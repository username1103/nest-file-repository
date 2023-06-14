import { Inject, Injectable } from '@nestjs/common';

import {
  InvalidAccessKeyException,
  NoSuchBucketException,
  NotAllowedAclException,
  TimeoutException,
} from '../exception';
import { ErrorHandler } from '../interface/error-handler';
import {
  CONFIG,
  S3FileRepositoryConfiguration,
} from '../interface/file-repository-configuration';

@Injectable()
export class DefaultS3ErrorHandler implements ErrorHandler {
  constructor(
    @Inject(CONFIG) private readonly config: S3FileRepositoryConfiguration,
  ) {}

  handle(e: unknown): never {
    if (!(e instanceof Error)) {
      throw e;
    }

    if (e.name === 'TimeoutError') {
      throw new TimeoutException(
        `raise timeout: ${this.config.options.timeout}ms`,
      );
    }

    if (e.name === 'NoSuchBucket') {
      throw new NoSuchBucketException(
        `not exist bucket: ${this.config.options.bucket}`,
      );
    }

    if (e.name === 'AccessControlListNotSupported') {
      throw new NotAllowedAclException(
        `not allowed acl: ${JSON.stringify({
          bucket: this.config.options.bucket,
          acl: this.config.options.acl,
        })}`,
      );
    }

    if (e.name === 'InvalidAccessKeyId') {
      throw new InvalidAccessKeyException(
        `invalid accessKey Id: ${this.config.options.credentials.accessKeyId}`,
      );
    }

    if (e.name === 'SignatureDoesNotMatch') {
      throw new InvalidAccessKeyException(
        `secretAccessKey does not matched: ${this.config.options.credentials.secretAccessKey}`,
      );
    }

    throw e;
  }
}
