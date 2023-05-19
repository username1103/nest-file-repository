import path from 'path';

import { Mimetype } from './constant/mimetype';

export class File {
  filename: string;

  data: Buffer;

  mimetype?: Mimetype;

  constructor(filename: string, data: Buffer, mimetype?: Mimetype) {
    this.filename = filename;
    this.data = data;
    this.mimetype = mimetype;
  }

  get extension(): string {
    return path.extname(this.filename);
  }
}
