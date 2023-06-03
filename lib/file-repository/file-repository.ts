import { File } from '../File';

export abstract class FileRepository {
  abstract save(file: File): Promise<string>;
  abstract get(key: string): Promise<File | null>;
  abstract getUrl(key: string): Promise<string>;
  abstract getSignedUrlForRead(key: string): Promise<string>;
  abstract getSignedUrlForUpload(key: string): Promise<string>;
}
