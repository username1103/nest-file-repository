import { FileUploadConfiguration } from './interface/file-upload-configuration';
import { DynamicModule } from '@nestjs/common';
import { FileStore } from './file-store';
import { getImageStore } from './get-image-store';

export class FileModule {
  static register(config: FileUploadConfiguration): DynamicModule {
    return {
      module: FileModule,
      providers: [
        {
          provide: FileStore,
          useValue: getImageStore(config),
        },
      ],
      exports: [FileStore],
    };
  }
}
