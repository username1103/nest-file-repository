import * as fs from 'fs/promises';

import { DiskFileRepository } from './disk-file-repository';
import { UploadStrategy } from './enum/upload-strategy';
import { AbortException } from './exception/abort.exception';
import { File } from './File';

describe('DiskFileService', () => {
  it('save file in disk', async () => {
    // given
    const file = new File('test.txt', Buffer.from('hello'));
    const diskFileStore = new DiskFileRepository({
      strategy: UploadStrategy.DISK,
      options: { path: '.' },
    });

    // when
    const result = await diskFileStore.save(file);

    // then
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
    const buffer = await fs.readFile(result);
    expect(buffer.toString()).toBe('hello');

    await fs.unlink(result);
  });

  it('throw timeout error if timeout', async () => {
    // given
    const data = await fs.readFile('./sample.jpeg');
    const file = new File('test.jpg', data);
    const diskFileStore = new DiskFileRepository({
      strategy: UploadStrategy.DISK,
      options: { path: '.', timeout: 0 },
    });

    // when, then
    await expect(() => diskFileStore.save(file)).rejects.toThrow(
      AbortException,
    );
  });
});
