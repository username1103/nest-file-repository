import {
  CONFIG,
  FileUploadConfiguration,
} from './interface/file-upload-configuration';
import { DynamicModule } from '@nestjs/common';
import { FileRepository } from './file-repository';
import { getFileRepository } from './get-file-repository';
import { NAME_GENERATOR } from './interface/NameGenerator';
import { UuidNameGenerator } from './util/uuid-name-generator';

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
        {
          provide: NAME_GENERATOR,
          useClass: UuidNameGenerator,
        },
      ],
      exports: [FileRepository],
    };
  }
}
