import path from 'path';

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Inject, Injectable } from '@nestjs/common';

import { File } from '../../File';
import {
  InvalidAccessKeyException,
  NoSuchBucketException,
  NotAllowedAclException,
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

    const options = this.s3UploadOptionFactory.getOptions(
      new File(filePath, file.data, file.mimetype),
      this.config,
    );

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: options.bucket,
          Key: options.key,
          ACL: options.acl,
          ContentType: options.contentType,
          CacheControl: options.cacheControl,
          ContentDisposition: options.contentDisposition,
          Body: options.body,
        }),
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
        throw new InvalidAccessKeyException(
          `invalid accessKey Id: ${this.config.options.credentials.accessKeyId}`,
        );
      }

      if (e.name === 'SignatureDoesNotMatch') {
        throw new InvalidAccessKeyException(
          `secretAccessKey does not matched: ${this.config.options.credentials.secretAccessKey}`,
        );
      }

      throw e;
    }

    return filePath;
  }

  async get(key: string): Promise<File | null> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.config.options.bucket,
          Key: key,
        }),
      );

      return new File(
        key,
        Buffer.from((await response.Body?.transformToByteArray()) ?? ''),
        response.ContentType,
      );
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }

      if (e.name === 'NoSuchKey') {
        return null;
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

      if (e.name === 'InvalidAccessKeyId') {
        throw new InvalidAccessKeyException(
          `invalid accessKey Id: ${this.config.options.credentials.accessKeyId}`,
        );
      }

      if (e.name === 'SignatureDoesNotMatch') {
        throw new InvalidAccessKeyException(
          `secretAccessKey does not matched: ${this.config.options.credentials.secretAccessKey}`,
        );
      }

      throw e;
    }
  }

  async getUrl(key: string): Promise<string> {
    if (this.config.options.endPoint) {
      return new URL(key, this.config.options.endPoint).href;
    }

    if (this.config.options.forcePathStyle) {
      return new URL(
        `${this.config.options.bucket}/${key}`,
        this.getDefaultPathStyleEndPoint(this.config.options.region),
      ).href;
    }

    return new URL(
      key,
      this.getHostStyleEndPoint(
        this.config.options.bucket,
        this.config.options.region,
      ),
    ).href;
  }

  private getDefaultPathStyleEndPoint(region: string): string {
    return `https://s3.${region}.amazonaws.com`;
  }

  private getHostStyleEndPoint(bucket: string, region: string): string {
    return `https://${bucket}.s3.${region}.amazonaws.com`;
  }
}
