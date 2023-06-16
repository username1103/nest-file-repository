import { BaseException } from './base-exception';

export class InvalidPathException extends BaseException {
  constructor(message: string, originError?: any) {
    super(message, originError);
  }
}
