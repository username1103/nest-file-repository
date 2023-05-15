import { FileUploadConfiguration } from './interface/file-upload-configuration';

export abstract class FileStore {
  abstract upload(file: any): Promise<string>;
}
