import { BaseException } from './base-exception';

export class InvalidAccessKeyException extends BaseException {
  constructor(message: string, originError: any) {
    super(message, originError);
  }
}
