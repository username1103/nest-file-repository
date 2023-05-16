export abstract class FileService {
  abstract save(file: any): Promise<string>;
}
