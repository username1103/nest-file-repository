import { DynamicModule, Provider } from '@nestjs/common';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { InjectionToken } from '@nestjs/common/interfaces/modules/injection-token.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';

import { DEFAULT_ALIAS } from './constant';
import { FileRepository } from './file-repository';
import { DefaultGCSUploadOptionFactory } from './gcs-file-repository/default-gcs-upload-option-factory';
import { getFileRepository } from './get-file-repository';
import {
  CONFIG,
  FileRepositoryConfiguration,
} from './interface/file-repository-configuration';
import { GCS_UPLOAD_OPTION_FACTORY } from './interface/gcs-upload-option-factory';
import { S3_UPLOAD_OPTION_FACTORY } from './interface/s3-upload-option-factory';
import { DefaultS3UploadOptionFactory } from './s3-file-repository/default-s3-upload-option-factory';
import { UploadStrategy } from '../enum';
import {
  CustomClassProvider,
  CustomFactoryProvider,
  CustomProvider,
  CustomValueProvider,
} from '../interface/custom-provider';

export class FileRepositoryModule {
  static register(config: FileRepositoryConfiguration): DynamicModule {
    const repositoryAlias = config.name ?? DEFAULT_ALIAS;
    const imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [];
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
      providers.push(
        ...this.getCustomProvider(
          S3_UPLOAD_OPTION_FACTORY,
          config.options.uploadOptionFactory ?? DefaultS3UploadOptionFactory,
        ),
      );

      if (
        config.options.uploadOptionFactory &&
        this.isCustomFactoryProvider(config.options.uploadOptionFactory)
      ) {
        imports.push(...(config.options.uploadOptionFactory.imports ?? []));
      }
    }

    if (config.strategy === UploadStrategy.GCS) {
      providers.push(
        ...this.getCustomProvider(
          GCS_UPLOAD_OPTION_FACTORY,
          config.options.uploadOptionFactory ?? DefaultGCSUploadOptionFactory,
        ),
      );

      if (
        config.options.uploadOptionFactory &&
        this.isCustomFactoryProvider(config.options.uploadOptionFactory)
      ) {
        imports.push(...(config.options.uploadOptionFactory.imports ?? []));
      }
    }

    return {
      module: FileRepositoryModule,
      imports,
      providers,
      exports: [FileRepository, repositoryAlias],
    };
  }

  private static getCustomProvider<T>(
    provide: InjectionToken,
    provider: CustomProvider<T>,
  ): Provider<T>[] {
    if (this.isCustomClassProvider(provider)) {
      return [
        {
          provide,
          useClass: provider.useClass,
          scope: provider.scope,
          durable: provider.durable,
        },
      ];
    }

    if (this.isCustomValueProvider(provider)) {
      return [
        {
          provide,
          useValue: provider.useValue,
        },
      ];
    }

    if (this.isCustomFactoryProvider(provider)) {
      return [
        {
          provide,
          useFactory: provider.useFactory,
          inject: provider.inject,
          scope: provider.scope,
          durable: provider.durable,
        },
      ];
    }

    return [
      {
        provide,
        useClass: provider,
      },
    ];
  }

  private static isCustomClassProvider<T>(
    provider: CustomProvider<T>,
  ): provider is CustomClassProvider<T> {
    return 'useClass' in provider;
  }

  private static isCustomValueProvider<T>(
    provider: CustomProvider<T>,
  ): provider is CustomValueProvider<T> {
    return 'useValue' in provider;
  }

  private static isCustomFactoryProvider<T>(
    provider: CustomProvider<T>,
  ): provider is CustomFactoryProvider<T> {
    return 'useFactory' in provider;
  }
}
