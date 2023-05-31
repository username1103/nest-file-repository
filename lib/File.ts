import path from 'path';

export class File {
  filename: string;

  data: Buffer;

  mimetype?: string;

  constructor(filename: string, data: Buffer, mimetype?: string) {
    this.filename = filename;
    this.data = data;
    this.mimetype = mimetype;
  }

  get extension(): string {
    return path.extname(this.filename);
  }
}
