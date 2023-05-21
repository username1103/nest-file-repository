import { UploadStrategy } from '../../enum';
import { acl } from '../constant';

export const CONFIG = Symbol('CONFIG');

export type FileRepositoryConfiguration =
  | DiskFileRepositoryConfiguration
  | S3FileRepositoryConfiguration
  | MemoryFileRepositoryConfiguration;

export interface S3FileRepositoryConfiguration extends CommonConfiguration {
  strategy: UploadStrategy.S3;

  options: CommonOptions & {
    region: string;
    credentials: {
      secretAccessKey: string;
      accessKeyId: string;
    };
    bucket: string;
    acl: acl;
    endPoint?: string;
    forcePathStyle?: boolean;
  };
}

export interface DiskFileRepositoryConfiguration extends CommonConfiguration {
  strategy: UploadStrategy.DISK;

  options?: CommonOptions;
}

export interface MemoryFileRepositoryConfiguration extends CommonConfiguration {
  strategy: UploadStrategy.MEMORY;

  options?: CommonOptions;
}

export interface CommonOptions {
  path?: string;

  /**
   * The number of milliseconds a request can take before automatically being terminated.
   * 0 disables the timeout.
   */
  timeout?: number;
}

export interface CommonConfiguration {
  name?: string | symbol;
}
