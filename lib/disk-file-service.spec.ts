import { File } from './File';
import { DiskFileService } from './disk-file.service';
import { UploadStrategy } from './enum/upload-strategy';
import { UuidNameGenerator } from './util/uuid-name-generator';

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
    console.log(result);
  });
});
