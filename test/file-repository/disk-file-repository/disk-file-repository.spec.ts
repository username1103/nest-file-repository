import * as fs from 'fs/promises';

import { UploadStrategy } from '../../../lib';
import { File } from '../../../lib';
import { TimeoutException } from '../../../lib';
import { DiskFileRepositoryConfiguration } from '../../../lib';
import { DiskFileRepository } from '../../../lib/file-repository/disk-file-repository/disk-file-repository';
import { InvalidPathException } from '../../../lib/file-repository/exception/invalid-path.exception';
import { FilePathResolver } from '../../../lib/file-repository/file-path-resolver';
import { expectNonNullable } from '../../expect/expect-non-nullable';

describe('DiskFileRepository', () => {
  describe('save', () => {
    it('save file in disk', async () => {
      // given
      const file = new File('test.txt', Buffer.from('hello'));
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: { path: './sample/sample-nested', bucket: 'test-bucket' },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when
      const result = await diskFileRepository.save(file);

      // then
      expect(result).toBe('sample/sample-nested/test.txt');
      const buffer = await fs.readFile(`test-bucket/${result}`);
      expect(buffer.toString()).toBe('hello');

      await fs.unlink(`test-bucket/${result}`);
    });

    it('save file in disk when no path in options of config', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      };
      const file = new File('test.txt', Buffer.from('hello'));
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when
      const result = await diskFileRepository.save(file);

      // then
      expect(result).toBe('test.txt');
      const buffer = await fs.readFile(`test-bucket/${result}`);
      expect(buffer.toString()).toBe('hello');

      await fs.unlink(`test-bucket/${result}`);
    });

    it('throw TimeoutException if times out', async () => {
      // given
      const data = await fs.readFile('./test-bucket/sample.jpeg');
      const file = new File('timeout.jpg', data);
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: { path: '.', timeout: 1, bucket: 'test-bucket' },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when, then
      await expect(() => diskFileRepository.save(file)).rejects.toThrow(
        new TimeoutException('raise timeout: 1ms'),
      );
    });
  });

  describe('get', () => {
    it('return the file that exists in the path', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when
      const file = await diskFileRepository.get('sample.jpeg');

      // then
      expectNonNullable(file);
      expect(file.filename).toBe('sample.jpeg');
      expect(file.data).toBeDefined();
    });

    it('return null if target is directory', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when
      const file = await diskFileRepository.get('sample');

      // then
      expect(file).toBeNull();
    });

    it('return null if file does not exist', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when
      const file = await diskFileRepository.get('not-exist-file.jpeg');

      // then
      expect(file).toBeNull();
    });

    it('throw TimeoutException if times out', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          timeout: 1,
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when, then
      await expect(() => diskFileRepository.get('sample.jpeg')).rejects.toThrow(
        new TimeoutException('raise timeout: 1ms'),
      );
    });

    it('throw InvalidPathException if access file outside of bucket', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when, then
      await expect(() =>
        diskFileRepository.get('../users/user1/secure-file.txt'),
      ).rejects.toThrow(
        new InvalidPathException('Can not access files outside of bucket'),
      );
    });
  });

  describe('getUrl', () => {
    it('return url for getting file', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          endPoint: new URL('https://example.com/path1'),
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );
      // when
      const url = await diskFileRepository.getUrl('/path/path/test.txt');

      // then
      expect(url).toBe('https://example.com/path1/path/path/test.txt');
    });

    it('throw Error if url option does not exists', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when, then
      await expect(() => diskFileRepository.getUrl('test.txt')).rejects.toThrow(
        Error,
      );
    });
  });

  describe('getSignedUrlForRead', () => {
    it('return url for getting file', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          endPoint: new URL('https://example.com/path1'),
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );
      // when
      const url = await diskFileRepository.getSignedUrlForRead(
        '/path/path/test.txt',
      );

      // then
      expect(url).toBe('https://example.com/path1/path/path/test.txt');
    });

    it('throw Error if url option does not exists', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when, then
      await expect(() =>
        diskFileRepository.getSignedUrlForRead('test.txt'),
      ).rejects.toThrow(Error);
    });
  });

  describe('getSignedUrlForUpload', () => {
    it('return url for getting file', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          endPoint: new URL('https://example.com/path1'),
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );
      // when
      const url = await diskFileRepository.getSignedUrlForUpload(
        '/path/path/test.txt',
      );

      // then
      expect(url).toBe('https://example.com/path1/path/path/test.txt');
    });

    it('throw Error if url option does not exists', async () => {
      // given
      const config: DiskFileRepositoryConfiguration = {
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      };
      const diskFileRepository = new DiskFileRepository(
        config,
        new FilePathResolver(config),
      );

      // when, then
      await expect(() =>
        diskFileRepository.getSignedUrlForUpload('test.txt'),
      ).rejects.toThrow(Error);
    });
  });
});
