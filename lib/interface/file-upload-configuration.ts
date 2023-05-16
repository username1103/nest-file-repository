import { UploadStrategy } from '../enum/upload-strategy';

export const CONFIG = Symbol('CONFIG');

export type FileUploadConfiguration =
  | DiskFileUploadConfiguration
  | S3FileUploadConfiguration;

export interface S3FileUploadConfiguration {
  strategy: UploadStrategy.S3;

  options: {
    region: string;
    credentials: {
      secretAccessKey: string;
      accessKeyId: string;
    };
    bucket: string;
    acl: string;
    path?: string;
    endPoint?: string;
    forcePathStyle?: boolean;
  };
}

export interface DiskFileUploadConfiguration {
  strategy: UploadStrategy.DISK;

  options: {
    path?: string;
  };
}
