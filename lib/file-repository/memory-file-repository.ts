import path from 'path';

import { Inject, Injectable } from '@nestjs/common';

import { FileRepository } from './file-repository';
import {
  CONFIG,
  MemoryFileUploadConfiguration,
} from './interface/file-upload-configuration';
import { File } from '../File';

@Injectable()
export class MemoryFileRepository implements FileRepository {
  private readonly storage = new Map<string, File>();
  constructor(
    @Inject(CONFIG) private readonly config: MemoryFileUploadConfiguration,
  ) {}

  async save(file: File): Promise<string> {
    const filePath = path.join(this.config.options?.path ?? '', file.filename);

    this.storage.set(filePath, file);

    return filePath;
  }

  async get(filePath: string): Promise<File | null> {
    return this.storage.get(filePath) ?? null;
  }
}
