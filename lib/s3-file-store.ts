import { FileStore } from './file-store';
import { S3FileUploadConfiguration } from './interface/file-upload-configuration';

export class S3FileStore implements FileStore {
  constructor(private readonly config: S3FileUploadConfiguration) {}

  upload(file: any): Promise<string> {
    return Promise.resolve('');
  }
}
