import {
  CONFIG,
  FileUploadConfiguration,
} from './interface/file-upload-configuration';
import { DynamicModule } from '@nestjs/common';
import { FileService } from './file-service';
import { getImageService } from './get-image-service';
import { NAME_GENERATOR } from './interface/NameGenerator';
import { UuidNameGenerator } from './util/uuid-name-generator';

export class FileModule {
  static register(config: FileUploadConfiguration): DynamicModule {
    return {
      module: FileModule,
      providers: [
        {
          provide: FileService,
          useClass: getImageService(config),
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
      exports: [FileService],
    };
  }
}
