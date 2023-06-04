import { File } from '../../File';

export class Bucket extends Map<string, File> {
  constructor(entries?: readonly (readonly [string, File])[] | null) {
    super(entries);
  }
}
