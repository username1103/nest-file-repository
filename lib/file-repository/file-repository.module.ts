import { DynamicModule, Provider } from '@nestjs/common';

import { DEFAULT_ALIAS } from './constant';
import { FileRepository } from './file-repository';
import { getFileRepository } from './get-file-repository';
import {
  CONFIG,
  FileRepositoryConfiguration,
} from './interface/file-repository-configuration';
import { S3_UPLOAD_OPTION_FACTORY } from './interface/s3-upload-option-factory';
import { DefaultS3UploadOptionFactory } from './s3-file-repository/default-s3-upload-option-factory';
import { UploadStrategy } from '../enum';

export class FileRepositoryModule {
  static register(config: FileRepositoryConfiguration): DynamicModule {
    const repositoryAlias = config.name ?? DEFAULT_ALIAS;
    const providers: Provider[] = [
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
    ];

    if (config.strategy === UploadStrategy.S3) {
      providers.push({
        provide: S3_UPLOAD_OPTION_FACTORY,
        useClass:
          config.options.uploadOptionFactory ?? DefaultS3UploadOptionFactory,
      });
    }

    return {
      module: FileRepositoryModule,
      providers: providers,
      exports: [FileRepository, repositoryAlias],
    };
  }
}
