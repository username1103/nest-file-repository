import { S3FileRepositoryConfiguration } from './file-repository-configuration';
import { Mimetype } from '../../constant';
import { File } from '../../File';
import { Acl } from '../constant';

export const S3_UPLOAD_OPTION_FACTORY = Symbol('S3_UPLOAD_OPTION_FACTORY');

export type S3UploadOption = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ACL?: Acl;
  ContentType?: Mimetype | string;
  CacheControl?: string;
  ContentDisposition?: string;
};

export interface S3UploadOptionFactory {
  getOptions(file: File, config: S3FileRepositoryConfiguration): S3UploadOption;
}
