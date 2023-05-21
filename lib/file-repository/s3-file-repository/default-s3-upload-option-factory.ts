import { File } from '../../File';
import { S3FileRepositoryConfiguration } from '../interface/file-repository-configuration';
import {
  S3UploadOption,
  S3UploadOptionFactory,
} from '../interface/s3-upload-option-factory';

export class DefaultS3UploadOptionFactory implements S3UploadOptionFactory {
  getOptions(
    file: File,
    config: S3FileRepositoryConfiguration,
  ): S3UploadOption {
    return {
      Bucket: config.options.bucket,
      Key: file.filename,
      Body: file.data,
      ACL: config.options.acl,
      ContentType: file.mimetype,
    };
  }
}
