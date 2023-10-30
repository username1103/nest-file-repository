import {
  InvalidAccessKeyException,
  NoSuchBucketException,
  NotAllowedAclException,
  TimeoutException,
  UploadStrategy,
} from '../../../lib';
import { UnexpectedException } from '../../../lib/file-repository/exception/unexpected.exception';
import { DefaultS3ErrorConverter } from '../../../lib/file-repository/s3-file-repository/default-s3-error-converter';

describe('DefaultS3ErrorConverter', () => {
  it('return UnexpectedException if is not error', async () => {
    // given
    const e = 'error';
    const errorConverter = new DefaultS3ErrorConverter({
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

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(UnexpectedException);
  });

  it('return TimeoutException if get TimeoutError', async () => {
    // given
    const e = new Error();
    e.name = 'TimeoutError';
    const errorConverter = new DefaultS3ErrorConverter({
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

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(TimeoutException);
  });

  it('return NoSuchBucketException if get NoSuchBucket Error', async () => {
    // given
    const e = new Error();
    e.name = 'NoSuchBucket';
    const errorConverter = new DefaultS3ErrorConverter({
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

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(NoSuchBucketException);
  });

  it('return NotAllowedAclException if get AccessControlListNotSupported Error', async () => {
    // given
    const e = new Error();
    e.name = 'AccessControlListNotSupported';
    const errorConverter = new DefaultS3ErrorConverter({
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

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(NotAllowedAclException);
  });

  it('return InvalidAccessKeyException if get InvalidAccessKeyId Error', async () => {
    // given
    const e = new Error();
    e.name = 'InvalidAccessKeyId';
    const errorConverter = new DefaultS3ErrorConverter({
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

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(InvalidAccessKeyException);
  });

  it('return InvalidAccessKeyException if get SignatureDoesNotMatch Error', async () => {
    // given
    const e = new Error();
    e.name = 'SignatureDoesNotMatch';
    const errorConverter = new DefaultS3ErrorConverter({
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

    // when
    const exception = errorConverter.convert(e);

    // when, then
    expect(exception).toBeInstanceOf(InvalidAccessKeyException);
  });
});
