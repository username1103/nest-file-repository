import { Injectable } from '@nestjs/common';

import {
  File,
  S3FileRepositoryConfiguration,
  S3UploadOption,
  S3UploadOptionFactory,
} from '../../../lib';
import { NameGenerator } from '../../../lib/interface/name-generator';

@Injectable()
export class StubS3OptionFactory implements S3UploadOptionFactory {
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

@Injectable()
export class StubS3OptionFactoryInjectedNameGenerator
  implements S3UploadOptionFactory
{
  constructor(readonly nameGenerator: NameGenerator) {}
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
