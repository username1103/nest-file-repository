import { Injectable } from '@nestjs/common';

import { ErrorHandler } from '../../../lib/file-repository/interface/error-handler';
import { NameGenerator } from '../../../lib/interface/name-generator';

@Injectable()
export class StubS3ErrorHandler implements ErrorHandler {
  handle(e: unknown): never {
    throw e;
  }
}

@Injectable()
export class StubS3ErrorHandlerInjectedNameGenerator implements ErrorHandler {
  constructor(readonly nameGenerator: NameGenerator) {}
  handle(e: unknown): never {
    throw e;
  }
}
