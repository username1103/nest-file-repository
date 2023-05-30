import path from 'path';

import { Inject, Injectable } from '@nestjs/common';

import { File } from '../../File';
import { normalizePath } from '../../util/shared.util';
import { FileRepository } from '../file-repository';
import {
  CONFIG,
  MemoryFileRepositoryConfiguration,
} from '../interface/file-repository-configuration';

@Injectable()
export class MemoryFileRepository implements FileRepository {
  private readonly storage = new Map<string, File>();
  constructor(
    @Inject(CONFIG) private readonly config: MemoryFileRepositoryConfiguration,
  ) {}

  async save(file: File): Promise<string> {
    const filePath = path.join(this.config.options?.path ?? '', file.filename);

    this.storage.set(filePath, file);

    return filePath;
  }

  async get(key: string): Promise<File | null> {
    return this.storage.get(key) ?? null;
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
}
