import { Inject, Injectable } from '@nestjs/common';

import {
  InvalidAccessKeyException,
  NoSuchBucketException,
  NotAllowedAclException,
  TimeoutException,
} from '../exception';
import { BaseException } from '../exception/base-exception';
import { UnexpectedException } from '../exception/unexpected.exception';
import { ErrorConverter } from '../interface/error-converter';
import {
  CONFIG,
  S3FileRepositoryConfiguration,
} from '../interface/file-repository-configuration';

@Injectable()
export class DefaultS3ErrorConverter implements ErrorConverter {
  constructor(
    @Inject(CONFIG) private readonly config: S3FileRepositoryConfiguration,
  ) {}

  convert(e: unknown): BaseException {
    if (!(e instanceof Error)) {
      return new UnexpectedException(e);
    }

    if (e.name === 'TimeoutError') {
      return new TimeoutException(
        `raise timeout: ${this.config.options.timeout}ms`,
        e,
      );
    }

    if (e.name === 'NoSuchBucket') {
      return new NoSuchBucketException(
        `not exist bucket: ${this.config.options.bucket}`,
        e,
      );
    }

    if (e.name === 'AccessControlListNotSupported') {
      return new NotAllowedAclException(
        `not allowed acl: ${JSON.stringify({
          bucket: this.config.options.bucket,
          acl: this.config.options.acl,
        })}`,
        e,
      );
    }

    if (e.name === 'InvalidAccessKeyId') {
      return new InvalidAccessKeyException(
        `invalid accessKey Id: ${this.config.options.credentials.accessKeyId}`,
        e,
      );
    }

    if (e.name === 'SignatureDoesNotMatch') {
      return new InvalidAccessKeyException(
        `secretAccessKey does not matched: ${this.config.options.credentials.secretAccessKey}`,
        e,
      );
    }

    return new UnexpectedException(e);
  }
}
