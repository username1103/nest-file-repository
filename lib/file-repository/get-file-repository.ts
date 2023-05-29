import { Type } from '@nestjs/common';

import { DiskFileRepository } from './disk-file-repository/disk-file-repository';
import { FileRepository } from './file-repository';
import { FileRepositoryConfiguration } from './interface/file-repository-configuration';
import { MemoryFileRepository } from './memory-file-repository/memory-file-repository';
import { UploadStrategy } from '../enum';
import { lazyLoadPackage } from '../util/lazy-load-package';

export const getFileRepository = (
  config: FileRepositoryConfiguration,
): Type<FileRepository> => {
  switch (config.strategy) {
    case UploadStrategy.DISK:
      return DiskFileRepository;
    case UploadStrategy.S3:
      const { S3FileRepository } = lazyLoadPackage(
        './s3-file-repository/s3-file-repository',
        () => require('./s3-file-repository/s3-file-repository'),
      );

      return S3FileRepository;
    case UploadStrategy.GCS:
      const { GCSFileRepository } = lazyLoadPackage(
        './gcs-file-repository/gcs-file-repository',
        () => require('./gcs-file-repository/gcs-file-repository'),
      );

      return GCSFileRepository;
    case UploadStrategy.MEMORY:
      return MemoryFileRepository;
    default:
      return unknownUploadStrategy(config);
  }
};

const unknownUploadStrategy = (config: never): never => {
  throw new Error(`Unknown Upload Strategy: ${JSON.stringify(config)}`);
};
