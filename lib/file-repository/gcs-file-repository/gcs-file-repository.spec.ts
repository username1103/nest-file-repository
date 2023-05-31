import { DefaultGCSUploadOptionFactory } from './default-gcs-upload-option-factory';
import { GCSFileRepository } from './gcs-file-repository';
import { UploadStrategy } from '../../enum';
import { File } from '../../File';
import { expectNonNullable } from '../../test/expect/expect-non-nullable';
import { NoSuchBucketException, TimeoutException } from '../exception';
import { GCSFileRepositoryConfiguration } from '../interface/file-repository-configuration';

describe('GCSFileRepository', () => {
  describe('save', () => {
    it('upload file in gcs', async () => {
      // given
      const config: GCSFileRepositoryConfiguration = {
        strategy: UploadStrategy.GCS,
        options: {
          apiEndPoint: new URL('http://localhost:8080'),
          projectId: 'test',
          bucket: 'test-bucket',
          path: '/test',
        },
      };
      const gcsFileRepository = new GCSFileRepository(
        config,
        new DefaultGCSUploadOptionFactory(),
      );

      const file = new File('file.txt', Buffer.from('hello'));

      // when
      const response = await gcsFileRepository.save(file);

      // then
      expect(response).toBe('/test/file.txt');
    });

    it('upload file in s3 when no path in options of config', async () => {
      // given
      const config: GCSFileRepositoryConfiguration = {
        strategy: UploadStrategy.GCS,
        options: {
          apiEndPoint: new URL('http://localhost:8080'),
          projectId: 'test',
          bucket: 'test-bucket',
        },
      };
      const gcsFileRepository = new GCSFileRepository(
        config,
        new DefaultGCSUploadOptionFactory(),
      );

      const file = new File('file.txt', Buffer.from('hello'));

      // when
      const response = await gcsFileRepository.save(file);

      // then
      expect(response).toBe('file.txt');
    });

    it('throw TimeoutException when times out', async () => {
      // given
      const config: GCSFileRepositoryConfiguration = {
        strategy: UploadStrategy.GCS,
        options: {
          apiEndPoint: new URL('http://localhost:8080'),
          projectId: 'test',
          bucket: 'test-bucket',
          timeout: 1,
        },
      };
      const gcsFileRepository = new GCSFileRepository(
        config,
        new DefaultGCSUploadOptionFactory(),
      );

      const file = new File('file.txt', Buffer.from('hello'));

      // when, then
      await expect(() => gcsFileRepository.save(file)).rejects.toThrow(
        new TimeoutException(`raise timeout: ${config.options.timeout}ms`),
      );
    });

    it('throw NoSuchBucketException when bucket does not exist', async () => {
      // given
      const config: GCSFileRepositoryConfiguration = {
        strategy: UploadStrategy.GCS,
        options: {
          apiEndPoint: new URL('http://localhost:8080'),
          projectId: 'test',
          bucket: 'test-bucket2',
        },
      };
      const gcsFileRepository = new GCSFileRepository(
        config,
        new DefaultGCSUploadOptionFactory(),
      );

      const file = new File('file.txt', Buffer.from('hello'));

      // when, then
      await expect(() => gcsFileRepository.save(file)).rejects.toThrow(
        new NoSuchBucketException(`not exists bucket: test-bucket2`),
      );
    });
  });

  describe('get', () => {
    it('return file that exists in the key', async () => {
      // given
      const gcsFileRepository = new GCSFileRepository(
        {
          strategy: UploadStrategy.GCS,
          options: {
            bucket: 'test-bucket',
            apiEndPoint: new URL('http://localhost:8080'),
          },
        },
        new DefaultGCSUploadOptionFactory(),
      );

      // when
      const result = await gcsFileRepository.get('test-file.txt');

      // then
      expectNonNullable(result);
      expect(result.filename).toBe('test-file.txt');
      expect(result.data.toString()).toBe('test-file\n');
    });

    it('return null if file does not exist', async () => {
      // given
      const gcsFileRepository = new GCSFileRepository(
        {
          strategy: UploadStrategy.GCS,
          options: {
            bucket: 'test-bucket',
            apiEndPoint: new URL('http://localhost:8080'),
          },
        },
        new DefaultGCSUploadOptionFactory(),
      );

      // when
      const result = await gcsFileRepository.get('test-file2.txt');

      // then
      expect(result).toBe(null);
    });

    it('throw NoSuchBucketException if bucket does not exist', async () => {
      // given
      const gcsFileRepository = new GCSFileRepository(
        {
          strategy: UploadStrategy.GCS,
          options: {
            bucket: 'invalid',
            apiEndPoint: new URL('http://localhost:8080'),
          },
        },
        new DefaultGCSUploadOptionFactory(),
      );

      // when, then
      await expect(() =>
        gcsFileRepository.get('test-file2.txt'),
      ).rejects.toThrow(NoSuchBucketException);
    });
  });

  describe('getUrl', () => {
    it('return url for getting file', async () => {
      // given
      const gcsFileRepository = new GCSFileRepository(
        {
          strategy: UploadStrategy.GCS,
          options: {
            bucket: 'test-bucket',
          },
        },
        new DefaultGCSUploadOptionFactory(),
      );

      // when
      const result = await gcsFileRepository.getUrl('/test/test.txt');

      // then
      expect(result).toBe(
        `https://storage.googleapis.com/test-bucket/test/test.txt`,
      );
    });

    it('return url for getting file with endPoint', async () => {
      // given
      const gcsFileRepository = new GCSFileRepository(
        {
          strategy: UploadStrategy.GCS,
          options: {
            bucket: 'test-bucket',
            apiEndPoint: new URL('http://localhost:8080/path'),
          },
        },
        new DefaultGCSUploadOptionFactory(),
      );

      // when
      const result = await gcsFileRepository.getUrl('test.txt');

      // then
      expect(result).toBe(`http://localhost:8080/path/test-bucket/test.txt`);
    });
  });
});
