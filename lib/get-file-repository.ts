import { Type } from '@nestjs/common';

import { DiskFileRepository } from './disk-file-repository';
import { UploadStrategy } from './enum/upload-strategy';
import { FileRepository } from './file-repository';
import { FileUploadConfiguration } from './interface/file-upload-configuration';
import { S3FileRepository } from './s3-file-repository';

export const getFileRepository = (
  config: FileUploadConfiguration,
): Type<FileRepository> => {
  switch (config.strategy) {
    case UploadStrategy.DISK:
      return DiskFileRepository;
    case UploadStrategy.S3:
      return S3FileRepository;
    default:
      return unknownUploadStrategy(config);
  }
};

const unknownUploadStrategy = (config: never): never => {
  throw new Error(`Unknown Upload Strategy: ${JSON.stringify(config)}`);
};
