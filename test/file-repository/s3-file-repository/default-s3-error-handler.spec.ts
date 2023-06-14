import {
  InvalidAccessKeyException,
  NoSuchBucketException,
  NotAllowedAclException,
  TimeoutException,
  UploadStrategy,
} from '../../../lib';
import { DefaultS3ErrorHandler } from '../../../lib/file-repository/s3-file-repository/default-s3-error-handler';

describe('DefaultS3ErrorHandler', () => {
  it('throw value if is not error', async () => {
    // given
    const e = 'error';
    const errorHandler = new DefaultS3ErrorHandler({
      strategy: UploadStrategy.S3,
      options: {
        region: 'string',
        credentials: {
          secretAccessKey: 'string',
          accessKeyId: 'string',
        },
        bucket: 'string',
      },
    });

    // when, then
    expect(() => errorHandler.handle(e)).toThrow('error');
  });

  it('throw TimeoutException if get TimeoutError', async () => {
    // given
    const e = new Error();
    e.name = 'TimeoutError';
    const errorHandler = new DefaultS3ErrorHandler({
      strategy: UploadStrategy.S3,
      options: {
        region: 'string',
        credentials: {
          secretAccessKey: 'string',
          accessKeyId: 'string',
        },
        bucket: 'string',
      },
    });

    // when, then
    expect(() => errorHandler.handle(e)).toThrow(TimeoutException);
  });

  it('throw NoSuchBucketException if get NoSuchBucket Error', async () => {
    // given
    const e = new Error();
    e.name = 'NoSuchBucket';
    const errorHandler = new DefaultS3ErrorHandler({
      strategy: UploadStrategy.S3,
      options: {
        region: 'string',
        credentials: {
          secretAccessKey: 'string',
          accessKeyId: 'string',
        },
        bucket: 'string',
      },
    });

    // when, then
    expect(() => errorHandler.handle(e)).toThrow(NoSuchBucketException);
  });

  it('throw NotAllowedAclException if get AccessControlListNotSupported Error', async () => {
    // given
    const e = new Error();
    e.name = 'AccessControlListNotSupported';
    const errorHandler = new DefaultS3ErrorHandler({
      strategy: UploadStrategy.S3,
      options: {
        region: 'string',
        credentials: {
          secretAccessKey: 'string',
          accessKeyId: 'string',
        },
        bucket: 'string',
      },
    });

    // when, then
    expect(() => errorHandler.handle(e)).toThrow(NotAllowedAclException);
  });

  it('throw InvalidAccessKeyException if get InvalidAccessKeyId Error', async () => {
    // given
    const e = new Error();
    e.name = 'InvalidAccessKeyId';
    const errorHandler = new DefaultS3ErrorHandler({
      strategy: UploadStrategy.S3,
      options: {
        region: 'string',
        credentials: {
          secretAccessKey: 'string',
          accessKeyId: 'string',
        },
        bucket: 'string',
      },
    });

    // when, then
    expect(() => errorHandler.handle(e)).toThrow(InvalidAccessKeyException);
  });

  it('throw InvalidAccessKeyException if get SignatureDoesNotMatch Error', async () => {
    // given
    const e = new Error();
    e.name = 'SignatureDoesNotMatch';
    const errorHandler = new DefaultS3ErrorHandler({
      strategy: UploadStrategy.S3,
      options: {
        region: 'string',
        credentials: {
          secretAccessKey: 'string',
          accessKeyId: 'string',
        },
        bucket: 'string',
      },
    });

    // when, then
    expect(() => errorHandler.handle(e)).toThrow(InvalidAccessKeyException);
  });
});
