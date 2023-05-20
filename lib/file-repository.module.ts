import { DynamicModule, Provider } from '@nestjs/common';

import { UploadStrategy } from './enum/upload-strategy';
import { FileRepository } from './file-repository';
import { getFileRepository } from './get-file-repository';
import {
  CONFIG,
  FileUploadConfiguration,
} from './interface/file-upload-configuration';
import { MIMETYPE_EXTENSION_CONVERTER } from './interface/mimetype-extension-converter';
import { DefaultMimetypeExtensionConverter } from './util/default-mimetype-extension-converter';

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

    if (config.strategy === UploadStrategy.S3) {
      providers.push({
        provide: MIMETYPE_EXTENSION_CONVERTER,
        useClass: DefaultMimetypeExtensionConverter,
      });
    }
    return {
      module: FileRepositoryModule,
      providers: providers,
      exports: [FileRepository],
    };
  }
}
