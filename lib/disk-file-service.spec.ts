import { File } from './File';
import { DiskFileService } from './disk-file.service';
import { UploadStrategy } from './enum/upload-strategy';
import { UuidNameGenerator } from './util/uuid-name-generator';
import * as fs from 'fs/promises';
import { AbortException } from './exception/abort.exception';

describe('DiskFileService', () => {
  it('save file in disk', async () => {
    // given
    const file = new File('test.txt', Buffer.from('hello'));
    const diskFileStore = new DiskFileService(
      {
        strategy: UploadStrategy.DISK,
        options: { path: '.' },
      },
      new UuidNameGenerator(),
    );

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
    const diskFileStore = new DiskFileService(
      {
        strategy: UploadStrategy.DISK,
        options: { path: '.', timeout: 0 },
      },
      new UuidNameGenerator(),
    );

    // when, then
    await expect(() => diskFileStore.save(file)).rejects.toThrow(
      AbortException,
    );
  });
});
