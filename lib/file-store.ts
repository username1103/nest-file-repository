export abstract class FileStore {
  abstract upload(file: any): Promise<string>;
}
