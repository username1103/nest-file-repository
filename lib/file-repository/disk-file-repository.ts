import { Abortable } from 'events';
import * as fs from 'fs/promises';
import { Mode, ObjectEncodingOptions, OpenMode } from 'node:fs';
import * as path from 'path';

import { Inject, Injectable } from '@nestjs/common';

import { FileRepository } from './file-repository';
import { TimeoutException } from '../exception/timeout.exception';
import { File } from '../File';
import {
  CONFIG,
  DiskFileUploadConfiguration,
} from '../interface/file-upload-configuration';

@Injectable()
export class DiskFileRepository implements FileRepository {
  constructor(
    @Inject(CONFIG) private readonly config: DiskFileUploadConfiguration,
  ) {}

  async save(file: File): Promise<string> {
    const filePath = path.join(this.config.options?.path ?? '', file.filename);

    const options: ObjectEncodingOptions & {
      mode?: Mode;
      flag?: OpenMode;
    } & Abortable = {
      flag: 'w',
    };

    if (this.config.options?.timeout) {
      options.signal = AbortSignal.timeout(this.config.options.timeout);
    }

    try {
      if (this.config.options?.path) {
        await fs.mkdir(this.config.options?.path, { recursive: true });
      }

      await fs.writeFile(filePath, file.data, options);
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new TimeoutException(
          `raise timeout: ${this.config.options?.timeout}ms`,
        );
      }

      throw e;
    }

    return filePath;
  }
}