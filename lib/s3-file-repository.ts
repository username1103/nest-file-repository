import path from 'path';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Inject } from '@nestjs/common';

import { NoSuchBucketException } from './exception/no-such-bucket.exception';
import { TimeoutException } from './exception/timeout.exception';
import { File } from './File';
import { FileRepository } from './file-repository';
import {
  CONFIG,
  S3FileUploadConfiguration,
} from './interface/file-upload-configuration';
import {
  MIMETYPE_EXTENSION_CONVERTER,
  MimetypeExtensionConverter,
} from './interface/mimetype-extension-converter';

export class S3FileRepository implements FileRepository {
  private readonly client: S3Client;
  constructor(
    @Inject(CONFIG) private readonly config: S3FileUploadConfiguration,
    @Inject(MIMETYPE_EXTENSION_CONVERTER)
    private readonly mimetypeExtensionConverter: MimetypeExtensionConverter,
  ) {
    this.client = new S3Client({
      region: this.config.options.region,
      endpoint: this.config.options.endPoint,
      forcePathStyle: this.config.options.forcePathStyle,
      credentials: {
        accessKeyId: this.config.options.credentials.accessKeyId,
        secretAccessKey: this.config.options.credentials.secretAccessKey,
      },
      requestHandler: new NodeHttpHandler({
        requestTimeout: this.config.options.timeout,
      }),
    });
  }

  async save(file: File): Promise<string> {
    const filePath = path.join(this.config.options?.path ?? '', file.filename);

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.config.options.bucket,
          Key: filePath,
          Body: file.data,
          ACL: this.config.options.acl,
          ContentType:
            file.mimetype ??
            this.mimetypeExtensionConverter.getMimeType(file.extension),
        }),
      );
    } catch (e) {
      if (e.name === 'TimeoutError') {
        throw new TimeoutException(
          `raise timeout: ${this.config.options.timeout}ms`,
        );
      }

      if (e.name === 'NoSuchBucket') {
        throw new NoSuchBucketException(
          `not exist bucket: ${this.config.options.bucket}`,
        );
      }

      throw e;
    }

    return filePath;
  }
}
