import { FileModule } from './file.module';
import { Test } from '@nestjs/testing';
import { UploadStrategy } from './enum/upload-strategy';
import { FileService } from './file-service';
import { DiskFileService } from './disk-file.service';
import { NAME_GENERATOR } from './interface/NameGenerator';
import {
  CONFIG,
  DiskFileUploadConfiguration,
} from './interface/file-upload-configuration';
import { UuidNameGenerator } from './util/uuid-name-generator';

describe('FileModule', () => {
  it('make disk file service by disk config', async () => {
    // given
    const diskConfig: DiskFileUploadConfiguration = {
      strategy: UploadStrategy.DISK,
      options: { path: '.' },
    };
    const module = await Test.createTestingModule({
      imports: [FileModule.register(diskConfig)],
    }).compile();

    // when
    const fileService = module.get(FileService);
    const nameGenerator = module.get(NAME_GENERATOR);
    const config = module.get(CONFIG);

    // then
    expect(fileService).toBeInstanceOf(DiskFileService);
    expect(nameGenerator).toBeInstanceOf(UuidNameGenerator);
    expect(config).toBe(diskConfig);
  });
});
