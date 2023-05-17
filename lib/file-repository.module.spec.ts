import { FileRepositoryModule } from './file-repository.module';
import { Test } from '@nestjs/testing';
import { UploadStrategy } from './enum/upload-strategy';
import { FileRepository } from './file-repository';
import { DiskFileRepository } from './disk-file-repository';
import { NAME_GENERATOR } from './interface/NameGenerator';
import {
  CONFIG,
  DiskFileUploadConfiguration,
} from './interface/file-upload-configuration';
import { UuidNameGenerator } from './util/uuid-name-generator';

describe('FileRepositoryModule', () => {
  it('make disk file service by disk config', async () => {
    // given
    const diskConfig: DiskFileUploadConfiguration = {
      strategy: UploadStrategy.DISK,
      options: { path: '.' },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(diskConfig)],
    }).compile();

    // when
    const fileService = module.get(FileRepository);
    const nameGenerator = module.get(NAME_GENERATOR);
    const config = module.get(CONFIG);

    // then
    expect(fileService).toBeInstanceOf(DiskFileRepository);
    expect(nameGenerator).toBeInstanceOf(UuidNameGenerator);
    expect(config).toBe(diskConfig);
  });
});
