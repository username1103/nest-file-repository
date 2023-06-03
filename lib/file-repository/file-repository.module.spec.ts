import { Injectable, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DEFAULT_ALIAS } from './constant';
import { DiskFileRepository } from './disk-file-repository/disk-file-repository';
import { FileRepository } from './file-repository';
import { FileRepositoryModule } from './file-repository.module';
import { DefaultGCSUploadOptionFactory } from './gcs-file-repository/default-gcs-upload-option-factory';
import { GCSFileRepository } from './gcs-file-repository/gcs-file-repository';
import {
  CONFIG,
  DiskFileRepositoryConfiguration,
  GCSFileRepositoryConfiguration,
  MemoryFileRepositoryConfiguration,
  S3FileRepositoryConfiguration,
} from './interface/file-repository-configuration';
import {
  GCS_UPLOAD_OPTION_FACTORY,
  GCSUploadOption,
  GCSUploadOptionFactory,
} from './interface/gcs-upload-option-factory';
import {
  S3_UPLOAD_OPTION_FACTORY,
  S3UploadOption,
  S3UploadOptionFactory,
} from './interface/s3-upload-option-factory';
import { MemoryFileRepository } from './memory-file-repository/memory-file-repository';
import { DefaultS3UploadOptionFactory } from './s3-file-repository/default-s3-upload-option-factory';
import { S3FileRepository } from './s3-file-repository/s3-file-repository';
import { UploadStrategy } from '../enum';
import { File } from '../File';
import { NAME_GENERATOR, NameGenerator } from '../interface/name-generator';
import { IdentityNameGenerator } from '../util/identity-name-generator';

describe('FileRepositoryModule', () => {
  it('make disk file repository by disk config', async () => {
    // given
    const diskConfig: DiskFileRepositoryConfiguration = {
      strategy: UploadStrategy.DISK,
      options: { path: '.' },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(diskConfig)],
    }).compile();

    // when
    const fileRepository = module.get(FileRepository);
    const config = module.get(CONFIG);
    const aliasFileRepository = module.get(DEFAULT_ALIAS);

    // then
    expect(fileRepository).toBeInstanceOf(DiskFileRepository);
    expect(aliasFileRepository).toBeInstanceOf(DiskFileRepository);
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

    // then
    expect(fileRepository).toBeInstanceOf(S3FileRepository);
    expect(aliasFileRepository).toBeInstanceOf(S3FileRepository);
    expect(s3UploadOptionFactory).toBeInstanceOf(DefaultS3UploadOptionFactory);
    expect(config).toBe(s3Config);
  });

  it('make s3 file repository by s3 config with custom upload options factory', async () => {
    // given
    @Injectable()
    class Factory implements S3UploadOptionFactory {
      getOptions(
        file: File,
        config: S3FileRepositoryConfiguration,
      ): S3UploadOption {
        return {
          bucket: config.options.bucket,
          key: file.filename,
          body: file.data,
        };
      }
    }
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
        uploadOptionFactory: Factory,
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
    expect(s3UploadOptionFactory).toBeInstanceOf(Factory);
    expect(config).toBe(s3Config);
  });

  it('make s3 file repository by s3 config with custom upload options factory by ClassProvider', async () => {
    // given
    @Injectable()
    class Factory implements S3UploadOptionFactory {
      getOptions(
        file: File,
        config: S3FileRepositoryConfiguration,
      ): S3UploadOption {
        return {
          bucket: config.options.bucket,
          key: file.filename,
          body: file.data,
        };
      }
    }
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
        uploadOptionFactory: { useClass: Factory },
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
    expect(s3UploadOptionFactory).toBeInstanceOf(Factory);
    expect(config).toBe(s3Config);
  });

  it('make s3 file repository by s3 config with custom upload options factory by ValueProvide', async () => {
    // given
    @Injectable()
    class Factory implements S3UploadOptionFactory {
      getOptions(
        file: File,
        config: S3FileRepositoryConfiguration,
      ): S3UploadOption {
        return {
          bucket: config.options.bucket,
          key: file.filename,
          body: file.data,
        };
      }
    }
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
        uploadOptionFactory: { useValue: new Factory() },
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
    expect(s3UploadOptionFactory).toBeInstanceOf(Factory);
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
    @Injectable()
    class Factory implements S3UploadOptionFactory {
      constructor(readonly nameGenerator: NameGenerator) {}

      getOptions(
        file: File,
        config: S3FileRepositoryConfiguration,
      ): S3UploadOption {
        return {
          bucket: config.options.bucket,
          key: this.nameGenerator.generate(file),
          body: file.data,
        };
      }
    }
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
            new Factory(nameGenerator),
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
    const s3UploadOptionFactory = module.get<Factory>(S3_UPLOAD_OPTION_FACTORY);
    const testModule = module.get(TestModule);

    // then
    expect(fileRepository).toBeInstanceOf(S3FileRepository);
    expect(aliasFileRepository).toBeInstanceOf(S3FileRepository);
    expect(s3UploadOptionFactory).toBeInstanceOf(Factory);
    expect(s3UploadOptionFactory.nameGenerator).toBeInstanceOf(
      IdentityNameGenerator,
    );
    expect(testModule).toBeInstanceOf(TestModule);
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
        }),
      ],
    }).compile();

    const fileRepository = module.get(FileRepository);
    const aliasFileRepository = module.get(name);

    expect(fileRepository).toBe(aliasFileRepository);
  });
});
