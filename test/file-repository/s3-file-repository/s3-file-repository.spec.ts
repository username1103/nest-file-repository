import { S3UploadOptionFactory, UploadStrategy } from '../../../lib';
import { File } from '../../../lib';
import { NoSuchBucketException, TimeoutException } from '../../../lib';
import { S3FileRepositoryConfiguration } from '../../../lib';
import { DefaultS3UploadOptionFactory } from '../../../lib';
import { FilePathResolver } from '../../../lib/file-repository/file-path-resolver';
import { ErrorHandler } from '../../../lib/file-repository/interface/error-handler';
import { DefaultS3ErrorHandler } from '../../../lib/file-repository/s3-file-repository/default-s3-error-handler';
import { S3FileRepository } from '../../../lib/file-repository/s3-file-repository/s3-file-repository';
import { expectNonNullable } from '../../expect/expect-non-nullable';

describe('S3FileRepository', () => {
  describe('save', () => {
    it('upload file in s3', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          path: 'test-path',
          region: 'test',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          endPoint: new URL('http://localhost:4566'),
          forcePathStyle: true,
          bucket: 'test-bucket',
          acl: 'public-read',
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      const file = new File('file.txt', Buffer.from('hello'));

      // when
      const response = await s3FileRepository.save(file);

      // then
      expect(response).toBe('test-path/file.txt');
    });

    it('upload file in s3 when no path in options of config', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          region: 'test',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          endPoint: new URL('http://localhost:4566'),
          forcePathStyle: true,
          bucket: 'test-bucket',
          acl: 'public-read',
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      const file = new File('file.txt', Buffer.from('hello'));

      // when
      const response = await s3FileRepository.save(file);

      // then
      expect(response).toBe('file.txt');
    });

    it('throw timeout exception when it times out', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          path: 'test-path',
          region: 'test',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          endPoint: new URL('http://localhost:4566'),
          forcePathStyle: true,
          bucket: 'test-bucket',
          acl: 'public-read',
          timeout: 1,
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      const file = new File('file.jpeg', Buffer.from('hello'));

      // when, then
      await expect(() => s3FileRepository.save(file)).rejects.toThrow(
        new TimeoutException('raise timeout: 1ms'),
      );
    });

    it('throw NoSuchBucketException when bucket does not exist', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          path: 'test-path',
          region: 'test',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          endPoint: new URL('http://localhost:4566'),
          forcePathStyle: true,
          bucket: 'invalid',
          acl: 'public-read',
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      const file = new File('file.jpeg', Buffer.from('hello'));

      // when, then
      await expect(() => s3FileRepository.save(file)).rejects.toThrow(
        new NoSuchBucketException(`not exist bucket: invalid`),
      );
    });
  });

  describe('get', () => {
    it('return file that exists in the key', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          region: 'test',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          bucket: 'test-bucket',
          acl: 'public-read',
          endPoint: new URL('http://localhost:4566'),
          forcePathStyle: true,
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.get('test-file.txt');

      // then
      expectNonNullable(result);
      expect(result.filename).toBe('test-file.txt');
      expect(result.data.toString()).toBe('test-file\n');
      expect(result.mimetype).toBeDefined();
    });

    it('throw NoSuchBucketException when bucket does not exist', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          path: 'test-path',
          region: 'test',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          endPoint: new URL('http://localhost:4566'),
          forcePathStyle: true,
          bucket: 'invalid',
          acl: 'public-read',
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when, then
      await expect(() => s3FileRepository.get('test-file.txt')).rejects.toThrow(
        new NoSuchBucketException(`not exist bucket: invalid`),
      );
    });

    it('throw timeout exception when it times out', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          path: 'test-path',
          region: 'test',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          endPoint: new URL('http://localhost:4566'),
          forcePathStyle: true,
          bucket: 'test-bucket',
          acl: 'public-read',
          timeout: 1,
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when, then
      await expect(() => s3FileRepository.get('test-file.txt')).rejects.toThrow(
        new TimeoutException('raise timeout: 1ms'),
      );
    });

    it('return null if file does not exist', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          path: 'test-path',
          region: 'test',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          endPoint: new URL('http://localhost:4566'),
          forcePathStyle: true,
          bucket: 'test-bucket',
          acl: 'public-read',
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.get('test-file2.txt');

      // then
      expect(result).toBeNull();
    });
  });

  describe('getUrl', () => {
    it('return url for getting file', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.getUrl('test.txt');

      // then
      expect(result).toBe(
        `https://test-bucket.s3.ap-northeast-2.amazonaws.com/test.txt`,
      );
    });

    it('return url for getting file with endPoint', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          endPoint: new URL('http://localhost:4566/test/test'),
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.getUrl('/path1/test.txt');

      // then
      expect(result).toBe(
        `http://test-bucket.localhost:4566/test/test/path1/test.txt`,
      );
    });

    it('return url for getting file with forcePathStyle', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          forcePathStyle: true,
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.getUrl('/path1/test.txt');

      // then
      expect(result).toBe(
        `https://s3.ap-northeast-2.amazonaws.com/test-bucket/path1/test.txt`,
      );
    });

    it('return url for getting file with forcePathStyle and endPoint', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          forcePathStyle: true,
          endPoint: new URL('http://localhost:4566/test/test'),
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.getUrl('/path1/test.txt');

      // then
      expect(result).toBe(
        `http://localhost:4566/test/test/test-bucket/path1/test.txt`,
      );
    });
  });

  describe('getSignedUrlForRead', () => {
    it('return signedUrl from key', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
        },
      };
      const s3FileRepository = createS3FileRepository(config);
      // when
      const result = await s3FileRepository.getSignedUrlForRead('test.txt');

      // then
      expect(result).not.toBe(
        'https://test-bucket.s3.ap-northeast-2.amazonaws.com/test.txt',
      );
      expect(
        result.startsWith(
          'https://test-bucket.s3.ap-northeast-2.amazonaws.com/test.txt',
        ),
      ).toBe(true);
    });

    it('return signedUrl from key with forcePathStyle', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          forcePathStyle: true,
        },
      };
      const s3FileRepository = createS3FileRepository(config);
      // when
      const result = await s3FileRepository.getSignedUrlForRead('test.txt');

      // then
      expect(result).not.toBe(
        'https://s3.ap-northeast-2.amazonaws.com/test-bucket/test.txt',
      );
      expect(
        result.startsWith(
          'https://s3.ap-northeast-2.amazonaws.com/test-bucket/test.txt',
        ),
      ).toBe(true);
    });

    it('return signedUrl for key with endPoint', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          endPoint: new URL('http://localhost:4566/test/test'),
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.getSignedUrlForRead(
        'path1/test.txt',
      );

      // then
      expect(result).not.toBe(
        'http://test-bucket.localhost:4566/test/test/path1/test.txt',
      );
      expect(
        result.startsWith(
          'http://test-bucket.localhost:4566/test/test/path1/test.txt',
        ),
      ).toBe(true);
    });

    it('return url for getting file with forcePathStyle and endPoint', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          forcePathStyle: true,
          endPoint: new URL('http://localhost:4566/test/test'),
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.getSignedUrlForRead(
        'path1/test.txt',
      );

      // then
      expect(result).not.toBe(
        'http://localhost:4566/test/test/test-bucket/path1/test.txt',
      );
      expect(
        result.startsWith(
          'http://localhost:4566/test/test/test-bucket/path1/test.txt',
        ),
      ).toBe(true);
    });
  });

  describe('getSignedUrlForUpload', () => {
    it('return signedUrl from key', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
        },
      };
      const s3FileRepository = createS3FileRepository(config);
      // when
      const result = await s3FileRepository.getSignedUrlForUpload('test.txt');

      // then
      expect(result).not.toBe(
        'https://test-bucket.s3.ap-northeast-2.amazonaws.com/test.txt',
      );
      expect(
        result.startsWith(
          'https://test-bucket.s3.ap-northeast-2.amazonaws.com/test.txt',
        ),
      ).toBe(true);
    });

    it('return signedUrl from key with forcePathStyle', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          forcePathStyle: true,
        },
      };
      const s3FileRepository = createS3FileRepository(config);
      // when
      const result = await s3FileRepository.getSignedUrlForUpload('test.txt');

      // then
      expect(result).not.toBe(
        'https://s3.ap-northeast-2.amazonaws.com/test-bucket/test.txt',
      );
      expect(
        result.startsWith(
          'https://s3.ap-northeast-2.amazonaws.com/test-bucket/test.txt',
        ),
      ).toBe(true);
    });

    it('return signedUrl for key with endPoint', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          endPoint: new URL('http://localhost:4566/test/test'),
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.getSignedUrlForUpload(
        'path1/test.txt',
      );

      // then
      expect(result).not.toBe(
        'http://test-bucket.localhost:4566/test/test/path1/test.txt',
      );
      expect(
        result.startsWith(
          'http://test-bucket.localhost:4566/test/test/path1/test.txt',
        ),
      ).toBe(true);
    });

    it('return url for getting file with forcePathStyle and endPoint', async () => {
      // given
      const config: S3FileRepositoryConfiguration = {
        strategy: UploadStrategy.S3,
        options: {
          bucket: 'test-bucket',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
          region: 'ap-northeast-2',
          forcePathStyle: true,
          endPoint: new URL('http://localhost:4566/test/test'),
        },
      };
      const s3FileRepository = createS3FileRepository(config);

      // when
      const result = await s3FileRepository.getSignedUrlForUpload(
        'path1/test.txt',
      );

      // then
      expect(result).not.toBe(
        'http://localhost:4566/test/test/test-bucket/path1/test.txt',
      );
      expect(
        result.startsWith(
          'http://localhost:4566/test/test/test-bucket/path1/test.txt',
        ),
      ).toBe(true);
    });
  });
});

function createS3FileRepository(
  config: S3FileRepositoryConfiguration,
  optionFactory?: S3UploadOptionFactory,
  errorHandler?: ErrorHandler,
) {
  return new S3FileRepository(
    config,
    optionFactory ?? new DefaultS3UploadOptionFactory(),
    new FilePathResolver(config),
    errorHandler ?? new DefaultS3ErrorHandler(config),
  );
}
