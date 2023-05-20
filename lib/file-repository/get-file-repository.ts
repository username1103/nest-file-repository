import { Type } from '@nestjs/common';

import { DiskFileRepository } from './disk-file-repository';
import { FileRepository } from './file-repository';
import { MemoryFileRepository } from './memory-file-repository';
import { S3FileRepository } from './s3-file-repository';
import { UploadStrategy } from '../enum/upload-strategy';
import { FileUploadConfiguration } from '../interface/file-upload-configuration';

export const getFileRepository = (
  config: FileUploadConfiguration,
): Type<FileRepository> => {
  switch (config.strategy) {
    case UploadStrategy.DISK:
      return DiskFileRepository;
    case UploadStrategy.S3:
      return S3FileRepository;
    case UploadStrategy.MEMORY:
      return MemoryFileRepository;
    default:
      return unknownUploadStrategy(config);
  }
};

const unknownUploadStrategy = (config: never): never => {
  throw new Error(`Unknown Upload Strategy: ${JSON.stringify(config)}`);
};