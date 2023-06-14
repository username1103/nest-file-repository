import { Injectable } from '@nestjs/common';

import { NameGenerator } from '../../interface/name-generator';
import { ErrorHandler } from '../interface/error-handler';

@Injectable()
export class StubS3ErrorHandler implements ErrorHandler {
  handle(e: unknown): any {
    throw e;
  }
}

@Injectable()
export class StubS3FactoryHandler implements ErrorHandler {
  constructor(readonly nameGanerator: NameGenerator) {}
  handle(e: unknown): any {
    throw e;
  }
}
