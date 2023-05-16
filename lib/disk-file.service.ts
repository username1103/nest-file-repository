import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileService } from './file-service';
import {
  CONFIG,
  DiskFileUploadConfiguration,
} from './interface/file-upload-configuration';
import { File } from './File';
import { NAME_GENERATOR, NameGenerator } from './interface/NameGenerator';

@Injectable()
export class DiskFileService implements FileService {
  constructor(
    @Inject(CONFIG) private readonly config: DiskFileUploadConfiguration,
    @Inject(NAME_GENERATOR) private readonly nameGenerator: NameGenerator,
  ) {}

  async save(file: File): Promise<string> {
    const filePath = path.join(
      this.config.options.path || '',
      `${this.nameGenerator.generate(file)}`,
    );
    try {
      await new Promise((res, rej) => {
        fs.writeFile(filePath, file.data, { flag: 'w' }, err => {
          if (err) return rej(err);

          res(undefined);
        });
      });
    } catch (e) {
      throw new Error(`파일 저장에 실패했습니다.${e}`);
    }

    return filePath;
  }
}
