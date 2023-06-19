import { ApiError } from '@google-cloud/storage/build/src/nodejs-common';
import { Inject, Injectable } from '@nestjs/common';

import {
  InvalidAccessKeyException,
  NoSuchBucketException,
  TimeoutException,
} from '../exception';
import { BaseException } from '../exception/base-exception';
import { UnexpectedException } from '../exception/unexpected.exception';
import { ErrorConverter } from '../interface/error-converter';
import {
  CONFIG,
  GCSFileRepositoryConfiguration,
} from '../interface/file-repository-configuration';

@Injectable()
export class DefaultGCSErrorConverter implements ErrorConverter {
  constructor(
    @Inject(CONFIG) private readonly config: GCSFileRepositoryConfiguration,
  ) {}

  convert(e: unknown): BaseException {
    if (!(e instanceof Error)) {
      return new UnexpectedException(e);
    }

    if ((e as any).code === 'ERR_OSSL_UNSUPPORTED') {
      return new InvalidAccessKeyException(
        `invalid access key: ${this.config.options.keyFile}`,
        e,
      );
    }

    if (e.name === 'FetchError' && (e as any).type === 'request-timeout') {
      return new TimeoutException(
        `raise timeout: ${this.config.options.timeout}ms`,
      );
    }

    if (
      e instanceof ApiError &&
      e.code === 404 &&
      e.message.includes('The specified bucket does not exist')
    ) {
      return new NoSuchBucketException(
        `not exists bucket: ${this.config.options.bucket}`,
      );
    }

    return new UnexpectedException(e);
  }
}
