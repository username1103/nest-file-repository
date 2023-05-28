import path from 'path';

import { Mimetype } from './constant';

export class File {
  filename: string;

  data: Buffer;

  mimetype?: Mimetype | string;

  constructor(filename: string, data: Buffer, mimetype?: Mimetype | string) {
    this.filename = filename;
    this.data = data;
    this.mimetype = mimetype;
  }

  get extension(): string {
    return path.extname(this.filename);
  }
}
