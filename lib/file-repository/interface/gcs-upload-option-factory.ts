import { GCSFileRepositoryConfiguration } from './file-repository-configuration';
import { Mimetype } from '../../constant';
import { File } from '../../File';

export const GCS_UPLOAD_OPTION_FACTORY = Symbol('GCS_UPLOAD_OPTION_FACTORY');

export type GCSUploadOption = {
  Bucket: string;
  fileName: string;
  fileData: Buffer;
  ContentType?: Mimetype | string;
  resumable: boolean;
};

export interface GCSUploadOptionFactory {
  getOptions(
    file: File,
    config: GCSFileRepositoryConfiguration,
  ): GCSUploadOption;
}
