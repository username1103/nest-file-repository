import { S3FileRepositoryConfiguration } from './file-repository-configuration';
import { File } from '../../File';
import { S3Acl } from '../constant';

export const S3_UPLOAD_OPTION_FACTORY = Symbol('S3_UPLOAD_OPTION_FACTORY');

export type S3UploadOption = {
  bucket: string;
  key: string;
  body: Buffer;
  acl?: S3Acl;
  contentType?: string;
  cacheControl?: string;
  contentDisposition?: string;
};

export interface S3UploadOptionFactory {
  getOptions(file: File, config: S3FileRepositoryConfiguration): S3UploadOption;
}
