import { GCSFileRepositoryConfiguration } from './file-repository-configuration';
import { File } from '../../File';
import { GCSAcl } from '../constant';

export const GCS_UPLOAD_OPTION_FACTORY = Symbol('GCS_UPLOAD_OPTION_FACTORY');

export type GCSUploadOption = {
  bucket: string;
  fileName: string;
  fileData: Buffer;
  resumable: boolean;
  contentType?: string;
  acl?: GCSAcl;
};

export interface GCSUploadOptionFactory {
  getOptions(
    file: File,
    config: GCSFileRepositoryConfiguration,
  ): GCSUploadOption;
}
