import { UploadStrategy } from './enum/upload-strategy';
import { NoSuchBucketException } from './exception/no-such-bucket.exception';
import { TimeoutException } from './exception/timeout.exception';
import { File } from './File';
import { S3FileUploadConfiguration } from './interface/file-upload-configuration';
import { S3FileRepository } from './s3-file-repository';
import { DefaultMimetypeExtensionConverter } from './util/default-mimetype-extension-converter';

describe('S3FileRepository', () => {
  it('upload file in s3', async () => {
    // given
    const confg: S3FileUploadConfiguration = {
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
    const s3FileRepository = new S3FileRepository(
      confg,
      new DefaultMimetypeExtensionConverter(),
    );

    const file = new File('file.txt', Buffer.from('hello'));

    // when
    const response = await s3FileRepository.save(file);

    // then
    expect(response).toBe('test-path/file.txt');
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
    const s3FileRepository = new S3FileRepository(
      config,
      new DefaultMimetypeExtensionConverter(),
    );

    const file = new File('file.jpeg', Buffer.from('hello'));

    // when, then
    await expect(() => s3FileRepository.save(file)).rejects.toThrow(
      TimeoutException,
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
    const s3FileRepository = new S3FileRepository(
      config,
      new DefaultMimetypeExtensionConverter(),
    );

    const file = new File('file.jpeg', Buffer.from('hello'));

    // when, then
    await expect(() => s3FileRepository.save(file)).rejects.toThrow(
      NoSuchBucketException,
    );
  });
});
