import { DynamicModule } from '@nestjs/common';

import { DEFAULT_ALIAS } from './constant';
import { FileRepository } from './file-repository';
import { getFileRepository } from './get-file-repository';
import {
  CONFIG,
  FileRepositoryConfiguration,
} from './interface/file-repository-configuration';

export class FileRepositoryModule {
  static register(config: FileRepositoryConfiguration): DynamicModule {
    const repositoryAlias = config.name ?? DEFAULT_ALIAS;
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
        {
          provide: repositoryAlias,
          useExisting: FileRepository,
        },
      ],
      exports: [FileRepository, repositoryAlias],
    };
  }
}
