import { FileUploadConfiguration } from './interface/file-upload-configuration';
import { FileStore } from './file-store';
import { UploadStrategy } from './enum/upload-strategy';
import { DiskFileStore } from './disk-file-store';
import { S3FileStore } from './s3-file-store';

export const getImageStore = (config: FileUploadConfiguration): FileStore => {
  switch (config.strategy) {
    case UploadStrategy.DISK:
      return new DiskFileStore(config);
    case UploadStrategy.S3:
      return new S3FileStore(config);
    default:
      return unknownUploadStrategy(config);
  }
};

const unknownUploadStrategy = (config: never): never => {
  throw new Error(`Unknown Upload Strategy: ${JSON.stringify(config)}`);
};
