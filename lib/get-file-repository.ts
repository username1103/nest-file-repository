import { FileUploadConfiguration } from './interface/file-upload-configuration';
import { FileRepository } from './file-repository';
import { UploadStrategy } from './enum/upload-strategy';
import { DiskFileRepository } from './disk-file-repository';
import { S3FileRepository } from './s3-file-repository';
import { Type } from '@nestjs/common';

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
