import { Injectable } from '@nestjs/common';

import { File } from '../../File';
import { S3FileRepositoryConfiguration } from '../interface/file-repository-configuration';
import {
  S3UploadOption,
  S3UploadOptionFactory,
} from '../interface/s3-upload-option-factory';

@Injectable()
export class DefaultS3UploadOptionFactory implements S3UploadOptionFactory {
  getOptions(
    file: File,
    config: S3FileRepositoryConfiguration,
  ): S3UploadOption {
    return {
      bucket: config.options.bucket,
      key: file.filename,
      body: file.data,
      acl: config.options.acl,
      contentType: file.mimetype,
    };
  }
}
