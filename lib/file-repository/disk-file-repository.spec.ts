import * as fs from 'fs/promises';

import { DiskFileRepository } from './disk-file-repository';
import { UploadStrategy } from '../enum/upload-strategy';
import { TimeoutException } from '../exception/timeout.exception';
import { File } from '../File';

describe('DiskFileService', () => {
  it('save file in disk', async () => {
    // given
    const file = new File('test.txt', Buffer.from('hello'));
    const diskFileStore = new DiskFileRepository({
      strategy: UploadStrategy.DISK,
      options: { path: './sample/sample-nested' },
    });

    // when
    const result = await diskFileStore.save(file);

    // then
    expect(result).toBe('sample/sample-nested/test.txt');
    const buffer = await fs.readFile(result);
    expect(buffer.toString()).toBe('hello');

    await fs.unlink(result);
  });

  it('save file in disk when no path in options of config', async () => {
    // given
    const file = new File('test.txt', Buffer.from('hello'));
    const diskFileStore = new DiskFileRepository({
      strategy: UploadStrategy.DISK,
    });

    // when
    const result = await diskFileStore.save(file);

    // then
    expect(result).toBe('test.txt');
    const buffer = await fs.readFile(result);
    expect(buffer.toString()).toBe('hello');

    await fs.unlink(result);
  });

  it('save file in disk if config doesnt have path', async () => {
    // given
    const file = new File('test.txt', Buffer.from('hello'));
    const diskFileStore = new DiskFileRepository({
      strategy: UploadStrategy.DISK,
    });

    // when
    const result = await diskFileStore.save(file);

    // then
    expect(result).toBe('test.txt');
    const buffer = await fs.readFile(result);
    expect(buffer.toString()).toBe('hello');

    await fs.unlink(result);
  });

  it('throw timeout error if times out', async () => {
    // given
    const data = await fs.readFile('./sample.jpeg');
    const file = new File('test.jpg', data);
    const diskFileStore = new DiskFileRepository({
      strategy: UploadStrategy.DISK,
      options: { path: '.', timeout: 1 },
    });

    // when, then
    await expect(() => diskFileStore.save(file)).rejects.toThrow(
      new TimeoutException('raise timeout: 1ms'),
    );
  });
});
