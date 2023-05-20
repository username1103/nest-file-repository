import { DynamicModule, Provider } from '@nestjs/common';

import { FileRepository } from './file-repository';
import { getFileRepository } from './get-file-repository';
import {
  CONFIG,
  FileUploadConfiguration,
} from './interface/file-upload-configuration';

export class FileRepositoryModule {
  static register(config: FileUploadConfiguration): DynamicModule {
    const providers: Provider[] = [
      {
        provide: FileRepository,
        useClass: getFileRepository(config),
      },
      {
        provide: CONFIG,
        useValue: config,
      },
    ];

    return {
      module: FileRepositoryModule,
      providers: providers,
      exports: [FileRepository],
    };
  }
}
