import { GCSFileRepository } from './gcs-file-repository';
import { UploadStrategy } from '../../enum';
import { File } from '../../File';
import { NoSuchBucketException, TimeoutException } from '../exception';
import { GCSFileRepositoryConfiguration } from '../interface/file-repository-configuration';

describe('GCSFileRepository', () => {
  it('upload file in gcs', async () => {
    // given
    const config: GCSFileRepositoryConfiguration = {
      strategy: UploadStrategy.GCS,
      options: {
        apiEndPoint: 'http://localhost:8080',
        projectId: 'test',
        bucket: 'test-bucket',
        path: '/test',
      },
    };
    const gcsFileRepository = new GCSFileRepository(config);

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
        apiEndPoint: 'http://localhost:8080',
        projectId: 'test',
        bucket: 'test-bucket',
      },
    };
    const gcsFileRepository = new GCSFileRepository(config);

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
        apiEndPoint: 'http://localhost:8080',
        projectId: 'test',
        bucket: 'test-bucket',
        timeout: 1,
      },
    };
    const gcsFileRepository = new GCSFileRepository(config);

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
        apiEndPoint: 'http://localhost:8080',
        projectId: 'test',
        bucket: 'test-bucket2',
      },
    };
    const gcsFileRepository = new GCSFileRepository(config);

    const file = new File('file.txt', Buffer.from('hello'));

    // when, then
    await expect(() => gcsFileRepository.save(file)).rejects.toThrow(
      new NoSuchBucketException(`not exists bucket: test-bucket2`),
    );
  });
});
