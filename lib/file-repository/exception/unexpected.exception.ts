import { BaseException } from './base-exception';

export class UnexpectedException extends BaseException {
  constructor(originError: unknown) {
    super('Unexpected Exception', originError);
  }
}
