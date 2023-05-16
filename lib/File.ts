import path from 'path';

export class File {
  filename: string;

  data: Buffer;

  constructor(filename: string, data: Buffer) {
    this.filename = filename;
    this.data = data;
  }

  get extension(): string {
    return path.extname(this.filename);
  }
}
