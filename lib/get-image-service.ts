import { FileUploadConfiguration } from './interface/file-upload-configuration';
import { FileService } from './file-service';
import { UploadStrategy } from './enum/upload-strategy';
import { DiskFileService } from './disk-file.service';
import { S3FileService } from './s3-file-service';
import { Type } from '@nestjs/common';

export const getImageService = (
  config: FileUploadConfiguration,
): Type<FileService> => {
  switch (config.strategy) {
    case UploadStrategy.DISK:
      return DiskFileService;
    case UploadStrategy.S3:
      return S3FileService;
    default:
      return unknownUploadStrategy(config);
  }
};

const unknownUploadStrategy = (config: never): never => {
  throw new Error(`Unknown Upload Strategy: ${JSON.stringify(config)}`);
};
