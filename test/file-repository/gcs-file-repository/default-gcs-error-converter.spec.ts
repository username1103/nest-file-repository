import { ApiError } from '@google-cloud/storage/build/src/nodejs-common';

import {
  InvalidAccessKeyException,
  NoSuchBucketException,
  TimeoutException,
  UploadStrategy,
} from '../../../lib';
import { UnexpectedException } from '../../../lib/file-repository/exception/unexpected.exception';
import { DefaultGCSErrorConverter } from '../../../lib/file-repository/gcs-file-repository/default-gcs-error-converter';

describe('DefaultGCSErrorConverter', () => {
  const errorConverter = new DefaultGCSErrorConverter({
    strategy: UploadStrategy.GCS,
    options: {
      bucket: 'string',
    },
  });

  it('return UnexpectedException if is not error', async () => {
    // given
    const e = 'error';

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(UnexpectedException);
  });

  it('return TimeoutException if get TimeoutError', async () => {
    // given
    const e = new Error();
    e.name = 'FetchError';
    (e as any).type = 'request-timeout';

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(TimeoutException);
  });

  it('return NoSuchBucketException if get NoSuchBucket Error', async () => {
    // given
    const e = new ApiError({
      code: 404,
      message: 'The specified bucket does not exist',
      response: {} as any,
    });

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(NoSuchBucketException);
  });

  it('return InvalidAccessKeyException if keyfile is invalid', async () => {
    // given
    const e = new Error();
    (e as any).code = 'ERR_OSSL_UNSUPPORTED';

    // when
    const exception = errorConverter.convert(e);

    // then
    expect(exception).toBeInstanceOf(InvalidAccessKeyException);
  });
});
