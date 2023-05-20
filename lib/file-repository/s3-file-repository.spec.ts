import { TimeoutException, NoSuchBucketException } from './exception';
import { S3FileUploadConfiguration } from './interface/file-upload-configuration';
import { S3FileRepository } from './s3-file-repository';
import { UploadStrategy } from '../enum';
import { File } from '../File';

describe('S3FileRepository', () => {
  it('upload file in s3', async () => {
    // given
    const config: S3FileUploadConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        path: 'test-path',
        region: 'test',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        endPoint: 'http://localhost:4566',
        forcePathStyle: true,
        bucket: 'test-bucket',
        acl: 'public-read',
      },
    };
    const s3FileRepository = new S3FileRepository(config);

    const file = new File('file.txt', Buffer.from('hello'));

    // when
    const response = await s3FileRepository.save(file);

    // then
    expect(response).toBe('test-path/file.txt');
  });

  it('upload file in s3 when no path in options of config', async () => {
    // given
    const config: S3FileUploadConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        region: 'test',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        endPoint: 'http://localhost:4566',
        forcePathStyle: true,
        bucket: 'test-bucket',
        acl: 'public-read',
      },
    };
    const s3FileRepository = new S3FileRepository(config);

    const file = new File('file.txt', Buffer.from('hello'));

    // when
    const response = await s3FileRepository.save(file);

    // then
    expect(response).toBe('file.txt');
  });

  it('throw timeout exception when it times out', async () => {
    // given
    const config: S3FileUploadConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        path: 'test-path',
        region: 'test',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        endPoint: 'http://localhost:4566',
        forcePathStyle: true,
        bucket: 'test-bucket',
        acl: 'public-read',
        timeout: 1,
      },
    };
    const s3FileRepository = new S3FileRepository(config);

    const file = new File('file.jpeg', Buffer.from('hello'));

    // when, then
    await expect(() => s3FileRepository.save(file)).rejects.toThrow(
      new TimeoutException('raise timeout: 1ms'),
    );
  });

  it('throw NoSuchBucketException when bucket does not exist', async () => {
    // given
    const config: S3FileUploadConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        path: 'test-path',
        region: 'test',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        endPoint: 'http://localhost:4566',
        forcePathStyle: true,
        bucket: 'invalid',
        acl: 'public-read',
      },
    };
    const s3FileRepository = new S3FileRepository(config);

    const file = new File('file.jpeg', Buffer.from('hello'));

    // when, then
    await expect(() => s3FileRepository.save(file)).rejects.toThrow(
      new NoSuchBucketException(`not exist bucket: invalid`),
    );
  });
});
