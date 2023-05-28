import path from 'path';

import { Storage } from '@google-cloud/storage';
import { ApiError } from '@google-cloud/storage/build/src/nodejs-common/util';
import { Inject, Injectable } from '@nestjs/common';

import { File } from '../../File';
import { NoSuchBucketException, TimeoutException } from '../exception';
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
      apiEndpoint: config.options.apiEndPoint,
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
        .bucket(options.Bucket)
        .file(options.fileName)
        .save(options.fileData, {
          timeout: this.config.options.timeout,
          resumable: options.resumable,
        });
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }

      if (e.name === 'FetchError' && (e as any).type === 'request-timeout') {
        throw new TimeoutException(
          `raise timeout: ${this.config.options.timeout}ms`,
        );
      }

      if (e instanceof ApiError && (e as any).code === 404) {
        throw new NoSuchBucketException(
          `not exists bucket: ${this.config.options.bucket}`,
        );
      }

      throw e;
    }

    return filePath;
  }
}
