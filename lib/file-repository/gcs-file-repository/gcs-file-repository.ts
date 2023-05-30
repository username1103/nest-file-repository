import path from 'path';

import { Storage } from '@google-cloud/storage';
import { ApiError } from '@google-cloud/storage/build/src/nodejs-common';
import { Inject, Injectable } from '@nestjs/common';

import { File } from '../../File';
import { normalizePath } from '../../util/shared.util';
import {
  InvalidAccessKeyException,
  NoSuchBucketException,
  TimeoutException,
} from '../exception';
import { FileRepository } from '../file-repository';
import {
  CONFIG,
  GCSFileRepositoryConfiguration,
} from '../interface/file-repository-configuration';
import {
  GCS_UPLOAD_OPTION_FACTORY,
  GCSUploadOptionFactory,
} from '../interface/gcs-upload-option-factory';

@Injectable()
export class GCSFileRepository implements FileRepository {
  private client: Storage;

  constructor(
    @Inject(CONFIG) private readonly config: GCSFileRepositoryConfiguration,
    @Inject(GCS_UPLOAD_OPTION_FACTORY)
    private readonly uploadOptionFactory: GCSUploadOptionFactory,
  ) {
    this.client = new Storage({
      keyFilename: this.config.options.keyFile,
      apiEndpoint: config.options.apiEndPoint?.href,
      projectId: config.options.projectId,
      timeout: config.options.timeout,
    });
  }

  async save(file: File): Promise<string> {
    const filePath = path.join(this.config.options?.path ?? '', file.filename);

    const options = this.uploadOptionFactory.getOptions(
      new File(filePath, file.data, file.mimetype),
      this.config,
    );
    try {
      await this.client
        .bucket(options.bucket)
        .file(options.fileName)
        .save(options.fileData, {
          timeout: this.config.options.timeout,
          resumable: options.resumable,
          contentType: options.contentType,
          predefinedAcl: options.acl,
        });
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }

      if ((e as any).code === 'ERR_OSSL_UNSUPPORTED') {
        throw new InvalidAccessKeyException(
          `invalid access key: ${this.config.options.keyFile}`,
        );
      }

      if (e.name === 'FetchError' && (e as any).type === 'request-timeout') {
        throw new TimeoutException(
          `raise timeout: ${this.config.options.timeout}ms`,
        );
      }

      if (
        e instanceof ApiError &&
        e.code === 404 &&
        e.message.includes('The specified bucket does not exist')
      ) {
        throw new NoSuchBucketException(
          `not exists bucket: ${this.config.options.bucket}`,
        );
      }

      if (
        e instanceof ApiError &&
        e.code === 404 &&
        !(await this.client.bucket(options.bucket).exists())[0]
      ) {
        throw new NoSuchBucketException(
          `not exists bucket: ${this.config.options.bucket}`,
        );
      }

      throw e;
    }

    return filePath;
  }

  async get(key: string): Promise<File | null> {
    try {
      const [result] = await this.client
        .bucket(this.config.options.bucket)
        .file(key)
        .download();

      return new File(key, result);
    } catch (e) {
      if ((e as any).code === 'ERR_OSSL_UNSUPPORTED') {
        throw new InvalidAccessKeyException(
          `invalid access key: ${this.config.options.keyFile}`,
        );
      }

      if (
        e instanceof ApiError &&
        e.code === 404 &&
        e.message.includes('No such object')
      ) {
        return null;
      }

      if (
        e instanceof ApiError &&
        e.code === 404 &&
        e.message.includes('The specified bucket does not exist')
      ) {
        throw new NoSuchBucketException(
          `not exists bucket: ${this.config.options.bucket}`,
        );
      }

      /**
       * for fake-gcs-server error handling
       * https://github.com/fsouza/fake-gcs-server/issues/1187
       */
      if (e instanceof ApiError && e.code === 404) {
        if (
          (await this.client.bucket(this.config.options.bucket).exists())[0]
        ) {
          return null;
        }

        throw new NoSuchBucketException(
          `not exists bucket: ${this.config.options.bucket}`,
        );
      }

      throw e;
    }
  }

  async getUrl(key: string): Promise<string> {
    if (this.config.options.apiEndPoint) {
      return new URL(
        normalizePath(
          `${this.config.options.apiEndPoint.pathname}/${this.config.options.bucket}/${key}`,
        ),
        this.config.options.apiEndPoint,
      ).href;
    }
    return new URL(
      normalizePath(`/${this.config.options.bucket}/${key}`),
      this.getDefaultEndPoint(),
    ).href;
  }

  async getSignedUrlForRead(key: string): Promise<string> {
    const [signedUrl] = await this.client
      .bucket(this.config.options.bucket)
      .file(key)
      .getSignedUrl({
        action: 'read',
        expires:
          Date.now() + (this.config.options.signedUrlExpires ?? 3600) * 1000,
      });

    return signedUrl;
  }

  async getSignedUrlForUpload(key: string): Promise<string> {
    const [signedUrl] = await this.client
      .bucket(this.config.options.bucket)
      .file(key)
      .getSignedUrl({
        action: 'write',
        expires:
          Date.now() + (this.config.options.signedUrlExpires ?? 3600) * 1000,
      });

    return signedUrl;
  }

  private getDefaultEndPoint(): string {
    return `https://storage.googleapis.com`;
  }
}
