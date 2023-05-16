import { FileService } from './file-service';
import { S3FileUploadConfiguration } from './interface/file-upload-configuration';

export class S3FileService implements FileService {
  constructor(private readonly config: S3FileUploadConfiguration) {}

  save(file: any): Promise<string> {
    return Promise.resolve('');
  }
}
