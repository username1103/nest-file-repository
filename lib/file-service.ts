import { File } from './File';

export abstract class FileService {
  abstract save(file: File): Promise<string>;
}
