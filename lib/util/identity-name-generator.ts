import { File } from '../File';
import { NameGenerator } from '../interface/name-generator';

export class IdentityNameGenerator implements NameGenerator {
  generate(file: File): string {
    return file.filename;
  }
}
