import { Test } from '@nestjs/testing';

import { DiskFileRepository } from './disk-file-repository';
import { UploadStrategy } from './enum/upload-strategy';
import { FileRepository } from './file-repository';
import { FileRepositoryModule } from './file-repository.module';
import {
  CONFIG,
  DiskFileUploadConfiguration,
  S3FileUploadConfiguration,
} from './interface/file-upload-configuration';
import { MIMETYPE_EXTENSION_CONVERTER } from './interface/mimetype-extension-converter';
import { S3FileRepository } from './s3-file-repository';
import { DefaultMimetypeExtensionConverter } from './util/default-mimetype-extension-converter';

describe('FileRepositoryModule', () => {
  it('make disk file repository by disk config', async () => {
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
    const config = module.get(CONFIG);

    // then
    expect(fileService).toBeInstanceOf(DiskFileRepository);
    expect(config).toBe(diskConfig);
  });

  it('make s3 file repository by s3 config', async () => {
    // given
    const s3Config: S3FileUploadConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        acl: 'public-read',
        bucket: 'test',
        region: 'test',
      },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(s3Config)],
    }).compile();

    // when
    const fileService = module.get(FileRepository);
    const config = module.get(CONFIG);
    const mimetypeExtensionConverter = module.get(MIMETYPE_EXTENSION_CONVERTER);

    // then
    expect(fileService).toBeInstanceOf(S3FileRepository);
    expect(mimetypeExtensionConverter).toBeInstanceOf(
      DefaultMimetypeExtensionConverter,
    );
    expect(config).toBe(s3Config);
  });
});
