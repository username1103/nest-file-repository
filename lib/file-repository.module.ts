import { DynamicModule } from '@nestjs/common';

import { FileRepository } from './file-repository';
import { getFileRepository } from './get-file-repository';
import {
  CONFIG,
  FileUploadConfiguration,
} from './interface/file-upload-configuration';

export class FileRepositoryModule {
  static register(config: FileUploadConfiguration): DynamicModule {
    return {
      module: FileRepositoryModule,
      providers: [
        {
          provide: FileRepository,
          useClass: getFileRepository(config),
        },
        {
          provide: CONFIG,
          useValue: config,
        },
      ],
      exports: [FileRepository],
    };
  }
}
