import {
  File,
  GCSFileRepositoryConfiguration,
  GCSUploadOptionFactory,
  TimeoutException,
  UploadStrategy,
} from '../../../lib';
import { FilePathResolver } from '../../../lib/file-repository/file-path-resolver';
import { DefaultGCSErrorConverter } from '../../../lib/file-repository/gcs-file-repository/default-gcs-error-converter';
import { DefaultGCSUploadOptionFactory } from '../../../lib/file-repository/gcs-file-repository/default-gcs-upload-option-factory';
import { GCSFileRepository } from '../../../lib/file-repository/gcs-file-repository/gcs-file-repository';
import { ErrorConverter } from '../../../lib/file-repository/interface/error-converter';
import { expectNonNullable } from '../../expect/expect-non-nullable';

describe('GCSFileRepository', () => {
  describe('save', () => {
    it('upload file in gcs', async () => {
      // given
      const config: GCSFileRepositoryConfiguration = {
        strategy: UploadStrategy.GCS,
        options: {
          endPoint: new URL('http://localhost:8080'),
          projectId: 'test',
          bucket: 'test-bucket',
          path: '/test',
        },
      };
      const gcsFileRepository = createGCSFileRepository(config);
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
          endPoint: new URL('http://localhost:8080'),
          projectId: 'test',
          bucket: 'test-bucket',
        },
      };
      const gcsFileRepository = createGCSFileRepository(config);
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
          endPoint: new URL('http://localhost:8080'),
          projectId: 'test',
          bucket: 'test-bucket',
          timeout: 1,
        },
      };
      const gcsFileRepository = createGCSFileRepository(config);

      const file = new File('file.txt', Buffer.from('hello'));

      // when, then
      await expect(() => gcsFileRepository.save(file)).rejects.toThrow(
        new TimeoutException(`raise timeout: ${config.options.timeout}ms`),
      );
    });
  });

  describe('get', () => {
    it('return file that exists in the key', async () => {
      // given
      const config: GCSFileRepositoryConfiguration = {
        strategy: UploadStrategy.GCS,
        options: {
          bucket: 'test-bucket',
          endPoint: new URL('http://localhost:8080'),
        },
      };
      const gcsFileRepository = createGCSFileRepository(config);

      // when
      const result = await gcsFileRepository.get('test-file.txt');

      // then
      expectNonNullable(result);
      expect(result.filename).toBe('test-file.txt');
      expect(result.data.toString()).toBe('test-file\n');
    });
  });

  describe('getUrl', () => {
    it('return url for getting file', async () => {
      // given
      const config: GCSFileRepositoryConfiguration = {
        strategy: UploadStrategy.GCS,
        options: {
          bucket: 'test-bucket',
        },
      };
      const gcsFileRepository = createGCSFileRepository(config);

      // when
      const result = await gcsFileRepository.getUrl('/test/test.txt');

      // then
      expect(result).toBe(
        `https://storage.googleapis.com/test-bucket/test/test.txt`,
      );
    });

    it('return url for getting file with endPoint', async () => {
      // given
      const config: GCSFileRepositoryConfiguration = {
        strategy: UploadStrategy.GCS,
        options: {
          bucket: 'test-bucket',
          endPoint: new URL('http://localhost:8080/path'),
        },
      };
      const gcsFileRepository = createGCSFileRepository(config);

      // when
      const result = await gcsFileRepository.getUrl('test.txt');

      // then
      expect(result).toBe(`http://localhost:8080/path/test-bucket/test.txt`);
    });
  });
});

function createGCSFileRepository(
  config: GCSFileRepositoryConfiguration,
  optionFactory?: GCSUploadOptionFactory,
  errorHandler?: ErrorConverter,
) {
  return new GCSFileRepository(
    config,
    optionFactory ?? new DefaultGCSUploadOptionFactory(),
    new FilePathResolver(config),
    errorHandler ?? new DefaultGCSErrorConverter(config),
  );
}
