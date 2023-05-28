import path from 'path';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Inject, Injectable } from '@nestjs/common';

import { File } from '../../File';
import {
  InvalidAccessKeyIdException,
  NoSuchBucketException,
  NotAllowedAclException,
  SignatureDoesNotMatchedException,
  TimeoutException,
} from '../exception';
import { FileRepository } from '../file-repository';
import {
  CONFIG,
  S3FileRepositoryConfiguration,
} from '../interface/file-repository-configuration';
import {
  S3_UPLOAD_OPTION_FACTORY,
  S3UploadOptionFactory,
} from '../interface/s3-upload-option-factory';

@Injectable()
export class S3FileRepository implements FileRepository {
  private readonly client: S3Client;

  constructor(
    @Inject(CONFIG) private readonly config: S3FileRepositoryConfiguration,
    @Inject(S3_UPLOAD_OPTION_FACTORY)
    private readonly s3UploadOptionFactory: S3UploadOptionFactory,
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
        requestTimeout: this.config.options.timeout ?? 0,
      }),
    });
  }

  async save(file: File): Promise<string> {
    const filePath = path.join(this.config.options?.path ?? '', file.filename);

    try {
      await this.client.send(
        new PutObjectCommand(
          this.s3UploadOptionFactory.getOptions(
            new File(filePath, file.data, file.mimetype),
            this.config,
          ),
        ),
      );
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }

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

      if (e.name === 'AccessControlListNotSupported') {
        throw new NotAllowedAclException(
          `not allowed acl: ${JSON.stringify({
            bucket: this.config.options.bucket,
            acl: this.config.options.acl,
          })}`,
        );
      }

      if (e.name === 'InvalidAccessKeyId') {
        throw new InvalidAccessKeyIdException(
          `invalid accessKey Id: ${this.config.options.credentials.accessKeyId}`,
        );
      }

      if (e.name === 'SignatureDoesNotMatch') {
        throw new SignatureDoesNotMatchedException(
          `secretAccessKey does not matched: ${this.config.options.credentials.secretAccessKey}`,
        );
      }

      throw e;
    }

    return filePath;
  }
}
