import { FilePathResolver } from './file-path-resolver';
import { UploadStrategy } from '../../enum';
import { File } from '../../File';
import { InvalidPathException } from '../exception/invalid-path.exception';

describe('FilePathResolver', () => {
  describe('getPathByFile', () => {
    it('return path by file', async () => {
      // given
      const filePathResolver = new FilePathResolver({
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
          path: 'path1/path2',
        },
      });

      const file = new File('test.txt', Buffer.from('123'));

      // when
      const result = filePathResolver.getPathByFile(file);

      // then
      expect(result).toBe('test-bucket/path1/path2/test.txt');
    });

    it('throw InvalidPathException if path is outside of bucket', async () => {
      // given
      const filePathResolver = new FilePathResolver({
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
          path: '../path1/path2',
        },
      });

      const file = new File('test.txt', Buffer.from('123'));

      // when
      expect(() => filePathResolver.getPathByFile(file)).toThrow(
        new InvalidPathException('Can not access files outside of bucket'),
      );
    });
  });

  describe('getPathByKey', () => {
    it('return path by key', async () => {
      // given
      const filePathResolver = new FilePathResolver({
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
          path: 'path1/path2',
        },
      });

      // when
      const result = filePathResolver.getPathByKey(
        '/path1/path2/path3/test.txt',
      );

      // then
      expect(result).toBe('test-bucket/path1/path2/path3/test.txt');
    });

    it('throw InvalidPathException if path is outside of bucket', async () => {
      // given
      const filePathResolver = new FilePathResolver({
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
          path: 'path1/path2',
        },
      });

      // when, then
      expect(() => filePathResolver.getPathByKey('../../test.txt')).toThrow(
        new InvalidPathException('Can not access files outside of bucket'),
      );
    });
  });

  describe('getKeyByFile', () => {
    it('return key from file', async () => {
      // given
      const filePathResolver = new FilePathResolver({
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
          path: '/path1/path2',
        },
      });

      const file = new File('test.txt', Buffer.from('hello'));

      // when
      const result = filePathResolver.getKeyByFile(file);

      // then
      expect(result).toBe('/path1/path2/test.txt');
    });

    it('return key from file without path', async () => {
      // given
      const filePathResolver = new FilePathResolver({
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      });

      const file = new File('test.txt', Buffer.from('hello'));

      // when
      const result = filePathResolver.getKeyByFile(file);

      // then
      expect(result).toBe('test.txt');
    });
  });

  describe('getDirectoryPath', () => {
    it('return directory path', async () => {
      // given
      const filePathResolver = new FilePathResolver({
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
          path: '/path1/path2',
        },
      });

      // when
      const result = filePathResolver.getDirectoryPath();

      // then
      expect(result).toBe('test-bucket/path1/path2');
    });

    it('return directory path without path', async () => {
      // given
      const filePathResolver = new FilePathResolver({
        strategy: UploadStrategy.DISK,
        options: {
          bucket: 'test-bucket',
        },
      });

      // when
      const result = filePathResolver.getDirectoryPath();

      // then
      expect(result).toBe('test-bucket');
    });
  });
});
