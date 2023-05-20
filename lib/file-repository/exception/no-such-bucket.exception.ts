export class NoSuchBucketException extends Error {
  constructor(message: string) {
    super(message);
  }
}
