import * as fs from 'fs/promises';

import { DiskFileRepository } from './disk-file-repository';
import { UploadStrategy } from '../../enum';
import { File } from '../../File';
import { expectNonNullable } from '../../test/expect/expect-non-nullable';
import { TimeoutException } from '../exception';

describe('DiskFileRepository', () => {
  describe('save', () => {
    it('save file in disk', async () => {
      // given
      const file = new File('test.txt', Buffer.from('hello'));
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
        options: { path: './sample/sample-nested' },
      });

      // when
      const result = await diskFileRepository.save(file);

      // then
      expect(result).toBe('sample/sample-nested/test.txt');
      const buffer = await fs.readFile(result);
      expect(buffer.toString()).toBe('hello');

      await fs.unlink(result);
    });

    it('save file in disk when no path in options of config', async () => {
      // given
      const file = new File('test.txt', Buffer.from('hello'));
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
      });

      // when
      const result = await diskFileRepository.save(file);

      // then
      expect(result).toBe('test.txt');
      const buffer = await fs.readFile(result);
      expect(buffer.toString()).toBe('hello');

      await fs.unlink(result);
    });

    it('save file in disk if config doesnt have path', async () => {
      // given
      const file = new File('test.txt', Buffer.from('hello'));
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
      });

      // when
      const result = await diskFileRepository.save(file);

      // then
      expect(result).toBe('test.txt');
      const buffer = await fs.readFile(result);
      expect(buffer.toString()).toBe('hello');

      await fs.unlink(result);
    });

    it('throw TimeoutException if times out', async () => {
      // given
      const data = await fs.readFile('./sample.jpeg');
      const file = new File('test.jpg', data);
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
        options: { path: '.', timeout: 1 },
      });

      // when, then
      await expect(() => diskFileRepository.save(file)).rejects.toThrow(
        new TimeoutException('raise timeout: 1ms'),
      );
    });
  });

  describe('get', () => {
    it('return the file that exists in the path', async () => {
      // given
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
      });

      // when
      const file = await diskFileRepository.get('sample.jpeg');

      // then
      expectNonNullable(file);
      expect(file.filename).toBe('sample.jpeg');
      expect(file.data).toBeDefined();
    });

    it('return null if file does not exist', async () => {
      // given
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
      });

      // when
      const file = await diskFileRepository.get('invalid.jpeg');

      // then
      expect(file).toBeNull();
    });

    it('throw TimeoutException if times out', async () => {
      // given
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
        options: {
          timeout: 1,
        },
      });

      // when, then
      await expect(() => diskFileRepository.get('sample.jpeg')).rejects.toThrow(
        new TimeoutException('raise timeout: 1ms'),
      );
    });
  });

  describe('getUrl', () => {
    it('return url for getting file', async () => {
      // given
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
        options: {
          endPoint: new URL('https://example.com'),
        },
      });
      // when
      const url = await diskFileRepository.getUrl('test.txt');

      // then
      expect(url).toBe('https://example.com/test.txt');
    });

    it('throw Error if url option does not exists', async () => {
      // given
      const diskFileRepository = new DiskFileRepository({
        strategy: UploadStrategy.DISK,
      });

      // when, then
      await expect(() => diskFileRepository.getUrl('test.txt')).rejects.toThrow(
        Error,
      );
    });
  });
});
