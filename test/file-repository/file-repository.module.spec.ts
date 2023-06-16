import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  StubS3ErrorConverter,
  StubS3ErrorConverterInjectedNameGenerator,
} from './s3-file-repository/stub-s3-error-converter';
import {
  StubS3OptionFactory,
  StubS3OptionFactoryInjectedNameGenerator,
} from './s3-file-repository/stub-s3-option-factory';
import {
  CONFIG,
  DEFAULT_ALIAS,
  DefaultS3UploadOptionFactory,
  DiskFileRepositoryConfiguration,
  File,
  FileRepository,
  FileRepositoryModule,
  GCS_UPLOAD_OPTION_FACTORY,
  GCSFileRepositoryConfiguration,
  GCSUploadOption,
  GCSUploadOptionFactory,
  MemoryFileRepositoryConfiguration,
  S3_UPLOAD_OPTION_FACTORY,
  S3FileRepositoryConfiguration,
  UploadStrategy,
} from '../../lib';
import { DiskFileRepository } from '../../lib/file-repository/disk-file-repository/disk-file-repository';
import { FilePathResolver } from '../../lib/file-repository/file-path-resolver';
import { DefaultGCSUploadOptionFactory } from '../../lib/file-repository/gcs-file-repository/default-gcs-upload-option-factory';
import { GCSFileRepository } from '../../lib/file-repository/gcs-file-repository/gcs-file-repository';
import { ERROR_CONVERTER } from '../../lib/file-repository/interface/error-converter';
import { MemoryFileRepository } from '../../lib/file-repository/memory-file-repository/memory-file-repository';
import { DefaultS3ErrorConverter } from '../../lib/file-repository/s3-file-repository/default-s3-error-converter';
import { S3FileRepository } from '../../lib/file-repository/s3-file-repository/s3-file-repository';
import {
  NAME_GENERATOR,
  NameGenerator,
} from '../../lib/interface/name-generator';
import { IdentityNameGenerator } from '../../lib/util/identity-name-generator';

describe('FileRepositoryModule', () => {
  it('make disk file repository by disk config', async () => {
    // given
    const diskConfig: DiskFileRepositoryConfiguration = {
      strategy: UploadStrategy.DISK,
      options: { path: '.', bucket: 'test-bucket' },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(diskConfig)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);
    const filePathResolver = module.get(FilePathResolver);

    // then
    expect(fileRepository).toBeInstanceOf(DiskFileRepository);
    expect(aliasFileRepository).toBeInstanceOf(DiskFileRepository);
    expect(filePathResolver).toBeInstanceOf(FilePathResolver);
    expect(config).toBe(diskConfig);
  });

  it('make s3 file repository by s3 config', async () => {
    // given
    const s3Config: S3FileRepositoryConfiguration = {
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
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);
    const s3UploadOptionFactory = module.get(S3_UPLOAD_OPTION_FACTORY);
    const errorHandler = module.get(ERROR_CONVERTER);

    // then
    expect(fileRepository).toBeInstanceOf(S3FileRepository);
    expect(aliasFileRepository).toBeInstanceOf(S3FileRepository);
    expect(s3UploadOptionFactory).toBeInstanceOf(DefaultS3UploadOptionFactory);
    expect(errorHandler).toBeInstanceOf(DefaultS3ErrorConverter);
    expect(config).toBe(s3Config);
  });

  it('make s3 file repository by s3 config with custom upload options factory', async () => {
    // given
    const s3Config: S3FileRepositoryConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        acl: 'public-read',
        bucket: 'test',
        region: 'test',
        uploadOptionFactory: StubS3OptionFactory,
        errorHandler: StubS3ErrorConverter,
      },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(s3Config)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);
    const s3UploadOptionFactory = module.get(S3_UPLOAD_OPTION_FACTORY);
    const errorHandler = module.get(ERROR_CONVERTER);

    // then
    expect(fileRepository).toBeInstanceOf(S3FileRepository);
    expect(aliasFileRepository).toBeInstanceOf(S3FileRepository);
    expect(s3UploadOptionFactory).toBeInstanceOf(StubS3OptionFactory);
    expect(errorHandler).toBeInstanceOf(StubS3ErrorConverter);
    expect(config).toBe(s3Config);
  });

  it('make s3 file repository by s3 config with custom upload options factory by ClassProvider', async () => {
    // given
    const s3Config: S3FileRepositoryConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        acl: 'public-read',
        bucket: 'test',
        region: 'test',
        uploadOptionFactory: { useClass: StubS3OptionFactory },
        errorHandler: { useClass: StubS3ErrorConverter },
      },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(s3Config)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);
    const s3UploadOptionFactory = module.get(S3_UPLOAD_OPTION_FACTORY);
    const errorHandler = module.get(ERROR_CONVERTER);

    // then
    expect(fileRepository).toBeInstanceOf(S3FileRepository);
    expect(aliasFileRepository).toBeInstanceOf(S3FileRepository);
    expect(s3UploadOptionFactory).toBeInstanceOf(StubS3OptionFactory);
    expect(errorHandler).toBeInstanceOf(StubS3ErrorConverter);
    expect(config).toBe(s3Config);
  });

  it('make s3 file repository by s3 config with custom upload options factory by ValueProvide', async () => {
    // given
    const s3Config: S3FileRepositoryConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        acl: 'public-read',
        bucket: 'test',
        region: 'test',
        uploadOptionFactory: { useValue: new StubS3OptionFactory() },
        errorHandler: { useValue: new StubS3ErrorConverter() },
      },
    };

    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(s3Config)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);
    const s3UploadOptionFactory = module.get(S3_UPLOAD_OPTION_FACTORY);

    // then
    expect(fileRepository).toBeInstanceOf(S3FileRepository);
    expect(aliasFileRepository).toBeInstanceOf(S3FileRepository);
    expect(s3UploadOptionFactory).toBeInstanceOf(StubS3OptionFactory);
    expect(s3UploadOptionFactory).toBe(
      (s3Config.options.uploadOptionFactory as any).useValue,
    );
    expect(config).toBe(s3Config);
  });

  it('make s3 file repository by s3 config with custom upload options factory by FactoryProvider', async () => {
    // given
    @Module({
      providers: [{ provide: NAME_GENERATOR, useClass: IdentityNameGenerator }],
      exports: [NAME_GENERATOR],
    })
    class TestModule {}

    const s3Config: S3FileRepositoryConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        acl: 'public-read',
        bucket: 'test',
        region: 'test',
        uploadOptionFactory: {
          imports: [TestModule],
          useFactory: (nameGenerator: NameGenerator) =>
            new StubS3OptionFactoryInjectedNameGenerator(nameGenerator),
          inject: [NAME_GENERATOR],
        },
        errorHandler: {
          imports: [TestModule],
          useFactory: (nameGenerator: NameGenerator) =>
            new StubS3ErrorConverterInjectedNameGenerator(nameGenerator),
          inject: [NAME_GENERATOR],
        },
      },
    };

    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(s3Config)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);
    const s3UploadOptionFactory =
      module.get<StubS3OptionFactoryInjectedNameGenerator>(
        S3_UPLOAD_OPTION_FACTORY,
      );
    const testModule = module.get(TestModule);
    const errorHandler =
      module.get<StubS3ErrorConverterInjectedNameGenerator>(ERROR_CONVERTER);

    // then
    expect(fileRepository).toBeInstanceOf(S3FileRepository);
    expect(aliasFileRepository).toBeInstanceOf(S3FileRepository);
    expect(s3UploadOptionFactory).toBeInstanceOf(
      StubS3OptionFactoryInjectedNameGenerator,
    );
    expect(s3UploadOptionFactory.nameGenerator).toBeInstanceOf(
      IdentityNameGenerator,
    );
    expect(testModule).toBeInstanceOf(TestModule);
    expect(errorHandler).toBeInstanceOf(
      StubS3ErrorConverterInjectedNameGenerator,
    );
    expect(errorHandler.nameGenerator).toBeInstanceOf(IdentityNameGenerator);
    expect(config).toBe(s3Config);
  });

  it('make gcs file repository by gcs config', async () => {
    // given
    const gcsConfig: GCSFileRepositoryConfiguration = {
      strategy: UploadStrategy.GCS,
      options: {
        bucket: 'test-bucket',
      },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(gcsConfig)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);
    const gcsUploadOptionFactory = module.get(GCS_UPLOAD_OPTION_FACTORY);

    // then
    expect(fileRepository).toBeInstanceOf(GCSFileRepository);
    expect(aliasFileRepository).toBeInstanceOf(GCSFileRepository);
    expect(gcsUploadOptionFactory).toBeInstanceOf(
      DefaultGCSUploadOptionFactory,
    );
    expect(config).toBe(gcsConfig);
  });

  it('make gcs file repository by gcs config with custom upload options factory', async () => {
    // given
    class CustomGCSUploadOptionFactory implements GCSUploadOptionFactory {
      getOptions(
        file: File,
        config: GCSFileRepositoryConfiguration,
      ): GCSUploadOption {
        return {
          bucket: config.options.bucket,
          fileName: file.filename,
          fileData: file.data,
          contentType: file.mimetype,
          resumable: false,
          acl: 'private',
        };
      }
    }
    const gcsConfig: GCSFileRepositoryConfiguration = {
      strategy: UploadStrategy.GCS,
      options: {
        bucket: 'test-bucket',
        uploadOptionFactory: CustomGCSUploadOptionFactory,
      },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(gcsConfig)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);
    const gcsUploadOptionFactory = module.get(GCS_UPLOAD_OPTION_FACTORY);

    // then
    expect(fileRepository).toBeInstanceOf(GCSFileRepository);
    expect(aliasFileRepository).toBeInstanceOf(GCSFileRepository);
    expect(gcsUploadOptionFactory).toBeInstanceOf(CustomGCSUploadOptionFactory);
    expect(config).toBe(gcsConfig);
  });

  it('make memory file repository by memory config', async () => {
    // given
    const memoryConfig: MemoryFileRepositoryConfiguration = {
      strategy: UploadStrategy.MEMORY,
      options: { bucket: 'test-bucket' },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(memoryConfig)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);

    // then
    expect(fileRepository).toBeInstanceOf(MemoryFileRepository);
    expect(aliasFileRepository).toBeInstanceOf(MemoryFileRepository);
    expect(config).toBe(memoryConfig);
  });

  it('register alias file repository when options has string name', async () => {
    // given
    const module = await Test.createTestingModule({
      imports: [
        FileRepositoryModule.register({
          strategy: UploadStrategy.MEMORY,
          name: 'alias',
          options: { bucket: 'test-bucket' },
        }),
      ],
    }).compile();

    const fileRepository = module.get(FileRepository);
    const aliasFileRepository = module.get('alias');

    expect(fileRepository).toBe(aliasFileRepository);
  });

  it('register alias file repository when options has symbol name', async () => {
    // given
    const name = Symbol('alias');
    const module = await Test.createTestingModule({
      imports: [
        FileRepositoryModule.register({
          strategy: UploadStrategy.MEMORY,
          name: name,
          options: { bucket: 'test-bucket' },
        }),
      ],
    }).compile();

    const fileRepository = module.get(FileRepository);
    const aliasFileRepository = module.get(name);

    expect(fileRepository).toBe(aliasFileRepository);
  });
});
