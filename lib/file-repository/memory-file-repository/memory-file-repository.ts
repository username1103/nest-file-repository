import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { Bucket } from './bucket';
import { File } from '../../File';
import { normalizePath } from '../../util/shared.util';
import { NoSuchBucketException } from '../exception';
import { FilePathResolver } from '../file-path-resolver';
import { FileRepository } from '../file-repository';
import {
  CONFIG,
  MemoryFileRepositoryConfiguration,
} from '../interface/file-repository-configuration';

@Injectable()
export class MemoryFileRepository implements FileRepository, OnModuleInit {
  private readonly storage = new Map<string, Bucket>();
  constructor(
    @Inject(CONFIG) private readonly config: MemoryFileRepositoryConfiguration,
    private readonly filePathResolver: FilePathResolver,
  ) {}

  async save(file: File): Promise<string> {
    const key = this.filePathResolver.getKeyByFile(file);

    const bucket = this.storage.get(this.config.options.bucket);
    if (!bucket) {
      throw new NoSuchBucketException(
        `not exist bucket: ${this.config.options.bucket}`,
      );
    }

    bucket.set(key, new File(key, file.data, file.mimetype));

    return key;
  }

  async get(key: string): Promise<File | null> {
    const bucket = this.storage.get(this.config.options.bucket);
    if (!bucket) {
      throw new NoSuchBucketException(
        `not exist bucket: ${this.config.options.bucket}`,
      );
    }

    return bucket.get(key) ?? null;
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

  onModuleInit(): void {
    this.storage.set(this.config.options.bucket, new Bucket());
  }
}
