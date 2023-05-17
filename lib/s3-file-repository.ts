import { FileRepository } from './file-repository';
import { S3FileUploadConfiguration } from './interface/file-upload-configuration';
import { File } from './File';

export class S3FileRepository implements FileRepository {
  constructor(private readonly config: S3FileUploadConfiguration) {}

  save(file: File): Promise<string> {
    return Promise.resolve('');
  }
}
