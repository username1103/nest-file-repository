import { BaseException } from './base-exception';

export class NotAllowedAclException extends BaseException {
  constructor(message: string, originError: any) {
    super(message, originError);
  }
}
