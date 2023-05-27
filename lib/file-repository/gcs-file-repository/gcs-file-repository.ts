import { Injectable } from '@nestjs/common';

import { File } from '../../File';
import { FileRepository } from '../file-repository';

@Injectable()
export class GcsFileRepository implements FileRepository {
  async save(file: File): Promise<string> {
    return file.filename;
  }
}
