import { Injectable } from '@nestjs/common';

import { BaseException } from '../../../lib/file-repository/exception/base-exception';
import { ErrorConverter } from '../../../lib/file-repository/interface/error-converter';
import { NameGenerator } from '../../../lib/interface/name-generator';

@Injectable()
export class StubS3ErrorConverter implements ErrorConverter {
  convert(e: unknown): never {
    throw e;
  }
}

@Injectable()
export class StubS3ErrorConverterInjectedNameGenerator
  implements ErrorConverter
{
  constructor(readonly nameGenerator: NameGenerator) {}
  convert(e: unknown): BaseException {
    return new BaseException('', e);
  }
}
