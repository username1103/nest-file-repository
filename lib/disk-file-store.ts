import { Injectable } from '@nestjs/common';
import { FileStore } from './file-store';
import { DiskFileUploadConfiguration } from './interface/file-upload-configuration';

@Injectable()
export class DiskFileStore implements FileStore {
  constructor(private readonly config: DiskFileUploadConfiguration) {}

  async upload(file: any): Promise<string> {
    return Promise.resolve('');
  }
}
