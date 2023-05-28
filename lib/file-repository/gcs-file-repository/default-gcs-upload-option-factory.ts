import { File } from '../../File';
import { GCSFileRepositoryConfiguration } from '../interface/file-repository-configuration';
import {
  GCSUploadOption,
  GCSUploadOptionFactory,
} from '../interface/gcs-upload-option-factory';

export class DefaultGCSUploadOptionFactory implements GCSUploadOptionFactory {
  getOptions(
    file: File,
    config: GCSFileRepositoryConfiguration,
  ): GCSUploadOption {
    return {
      fileName: file.filename,
      fileData: file.data,
      Bucket: config.options.bucket,
      ContentType: file.mimetype,
    };
  }
}
