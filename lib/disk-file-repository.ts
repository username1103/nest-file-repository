import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FileRepository } from './file-repository';
import {
  CONFIG,
  DiskFileUploadConfiguration,
} from './interface/file-upload-configuration';
import { File } from './File';
import { NAME_GENERATOR, NameGenerator } from './interface/NameGenerator';
import { Abortable } from 'events';
import { Mode, ObjectEncodingOptions, OpenMode } from 'node:fs';
import { AbortException } from './exception/abort.exception';

@Injectable()
export class DiskFileRepository implements FileRepository {
  constructor(
    @Inject(CONFIG) private readonly config: DiskFileUploadConfiguration,
    @Inject(NAME_GENERATOR) private readonly nameGenerator: NameGenerator,
  ) {}

  async save(file: File): Promise<string> {
    const filePath = path.join(this.config.options.path ?? '', file.filename);

    const options: ObjectEncodingOptions & {
      mode?: Mode | undefined;
      flag?: OpenMode | undefined;
    } & Abortable = {
      flag: 'w',
    };

    if (this.config.options.timeout !== undefined) {
      options.signal = AbortSignal.timeout(this.config.options.timeout);
    }

    try {
      await fs.writeFile(filePath, file.data, options);
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new AbortException();
      }

      throw e;
    }

    return filePath;
  }
}
