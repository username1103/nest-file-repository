import { File } from '../File';

export abstract class FileRepository {
  abstract save(file: File): Promise<string>;
  abstract get(key: string): Promise<File | null>;
}
