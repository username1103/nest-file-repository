import { Inject } from '@nestjs/common';

import { File } from './File';
import { FileRepository } from './file-repository';
import {
  CONFIG,
  S3FileUploadConfiguration,
} from './interface/file-upload-configuration';

export class S3FileRepository implements FileRepository {
  constructor(
    @Inject(CONFIG) private readonly config: S3FileUploadConfiguration,
  ) {}

  save(file: File): Promise<string> {
    return Promise.resolve('');
  }
}
