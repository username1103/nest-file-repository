import { Abortable } from 'events';
import * as fs from 'fs/promises';
import { Mode, ObjectEncodingOptions, OpenMode } from 'node:fs';

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { File } from '../../File';
import { normalizePath } from '../../util/shared.util';
import { TimeoutException } from '../exception';
import { BaseException } from '../exception/base-exception';
import { UnexpectedException } from '../exception/unexpected.exception';
import { FilePathResolver } from '../file-path-resolver';
import { FileRepository } from '../file-repository';
import {
  CONFIG,
  DiskFileRepositoryConfiguration,
} from '../interface/file-repository-configuration';

@Injectable()
export class DiskFileRepository implements FileRepository, OnModuleInit {
  constructor(
    @Inject(CONFIG) private readonly config: DiskFileRepositoryConfiguration,
    private readonly filePathResolver: FilePathResolver,
  ) {}

  async save(file: File): Promise<string> {
    const filePath = this.filePathResolver.getPathByFile(file);
    const key = this.filePathResolver.getKeyByFile(file);

    const options: ObjectEncodingOptions & {
      mode?: Mode;
      flag?: OpenMode;
    } & Abortable = {
      flag: 'w',
    };

    if (this.config.options?.timeout) {
      options.signal = AbortSignal.timeout(this.config.options.timeout);
    }

    try {
      if (this.config.options.path) {
        await fs.mkdir(this.filePathResolver.getDirectoryPath(), {
          recursive: true,
        });
      }

      await fs.writeFile(filePath, file.data, options);
    } catch (e) {
      if ((e as any).name === 'AbortError') {
        throw new TimeoutException(
          `raise timeout: ${this.config.options?.timeout}ms`,
          e,
        );
      }

      throw new UnexpectedException(e);
    }

    return key;
  }

  async get(key: string): Promise<File | null> {
    try {
      const filePath = this.filePathResolver.getPathByKey(key);
      const fileStat = await fs.stat(filePath);

      if (!fileStat.isFile()) {
        return null;
      }

      const options: ObjectEncodingOptions & {
        mode?: Mode;
        flag?: OpenMode;
      } & Abortable = {
        flag: 'r',
      };

      if (this.config.options?.timeout) {
        options.signal = AbortSignal.timeout(this.config.options.timeout);
      }

      const fileContents = await fs.readFile(filePath, options);

      return new File(
        key,
        typeof fileContents === 'string'
          ? Buffer.from(fileContents)
          : fileContents,
      );
    } catch (e) {
      if (e instanceof BaseException) {
        throw e;
      }

      if ((e as any)?.code === 'ENOENT') {
        return null;
      }

      if ((e as any).name === 'AbortError') {
        throw new TimeoutException(
          `raise timeout: ${this.config.options?.timeout}ms`,
          e,
        );
      }

      throw new UnexpectedException(e);
    }
  }

  async getUrl(key: string): Promise<string> {
    if (!this.config.options?.endPoint) {
      throw new Error(
        'You need to set the url option in configuration for "getUrl"',
      );
    }

    return new URL(
      normalizePath(`${this.config.options.endPoint.pathname}/${key}`),
      this.config.options.endPoint,
    ).href;
  }

  async getSignedUrlForRead(key: string): Promise<string> {
    return this.getUrl(key);
  }

  async getSignedUrlForUpload(key: string): Promise<string> {
    return await this.getSignedUrlForRead(key);
  }

  async onModuleInit() {
    await fs.mkdir(this.config.options.bucket, { recursive: true });
  }
}
