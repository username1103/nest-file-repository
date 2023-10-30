import { BaseException } from './base-exception';

export class NoSuchBucketException extends BaseException {
  constructor(message: string, originError?: any) {
    super(message, originError);
  }
}
