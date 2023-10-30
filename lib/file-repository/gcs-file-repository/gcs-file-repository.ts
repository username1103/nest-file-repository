import { Storage } from '@google-cloud/storage';
import { ApiError } from '@google-cloud/storage/build/src/nodejs-common';
import { Inject, Injectable } from '@nestjs/common';

import { File } from '../../File';
import { normalizePath } from '../../util/shared.util';
import { FilePathResolver } from '../file-path-resolver';
import { FileRepository } from '../file-repository';
import { ERROR_CONVERTER, ErrorConverter } from '../interface/error-converter';
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
    private readonly filePathResolver: FilePathResolver,
    @Inject(ERROR_CONVERTER) private readonly errorConverter: ErrorConverter,
  ) {
    this.client = new Storage({
      keyFilename: this.config.options.keyFile,
      apiEndpoint: config.options.endPoint?.href,
      projectId: config.options.projectId,
      timeout: config.options.timeout,
    });
  }

  async save(file: File): Promise<string> {
    const filePath = this.filePathResolver.getKeyByFile(file);

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
      throw this.errorConverter.convert(e);
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
      if (
        e instanceof ApiError &&
        e.code === 404 &&
        e.message.includes('No such object')
      ) {
        return null;
      }

      throw this.errorConverter.convert(e);
    }
  }

  async getUrl(key: string): Promise<string> {
    if (this.config.options.endPoint) {
      return new URL(
        normalizePath(
          `${this.config.options.endPoint.pathname}/${this.config.options.bucket}/${key}`,
        ),
        this.config.options.endPoint,
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
