import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';

import { File } from '../../File';
import { normalizePath } from '../../util/shared.util';
import { FilePathResolver } from '../file-path-resolver';
import { FileRepository } from '../file-repository';
import { ERROR_HANDLER, ErrorHandler } from '../interface/error-handler';
import {
  CONFIG,
  S3FileRepositoryConfiguration,
} from '../interface/file-repository-configuration';
import {
  S3_UPLOAD_OPTION_FACTORY,
  S3UploadOptionFactory,
} from '../interface/s3-upload-option-factory';

@Injectable()
export class S3FileRepository implements FileRepository, OnModuleDestroy {
  private readonly client: S3Client;

  constructor(
    @Inject(CONFIG) private readonly config: S3FileRepositoryConfiguration,
    @Inject(S3_UPLOAD_OPTION_FACTORY)
    private readonly s3UploadOptionFactory: S3UploadOptionFactory,
    private readonly filePathResolver: FilePathResolver,
    @Inject(ERROR_HANDLER) private readonly errorHandler: ErrorHandler,
  ) {
    this.client = new S3Client({
      region: this.config.options.region,
      endpoint: this.config.options.endPoint?.href,
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
    const key = this.filePathResolver.getKeyByFile(file);

    const options = this.s3UploadOptionFactory.getOptions(
      new File(key, file.data, file.mimetype),
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
      return this.errorHandler.handle(e);
    }

    return key;
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
      return this.errorHandler.handle(e);
    }
  }

  async getUrl(key: string): Promise<string> {
    const endPoint = this.config.options.forcePathStyle
      ? new URL(
          this.getPathStyleEndPoint(
            this.config.options.bucket,
            this.config.options.endPoint ?? this.getDefaultEndPoint(),
          ),
        )
      : new URL(
          this.getHostStyleEndPoint(
            this.config.options.bucket,
            this.config.options.endPoint ?? this.getDefaultEndPoint(),
          ),
        );

    return new URL(normalizePath(`${endPoint.pathname}/${key}`), endPoint).href;
  }

  async getSignedUrlForRead(key: string): Promise<string> {
    return await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.config.options.bucket,
        Key: key,
      }),
      {
        expiresIn: this.config.options.signedUrlExpires ?? 3600,
      },
    );
  }

  async getSignedUrlForUpload(key: string): Promise<string> {
    return await this.getSignedUrlForRead(key);
  }

  private getPathStyleEndPoint(bucket: string, endPoint: URL): string {
    return `${endPoint.toString()}/${bucket}`;
  }

  private getHostStyleEndPoint(bucket: string, endPoint: URL): string {
    return `${endPoint.protocol}//${bucket}.${endPoint.host}${endPoint.pathname}`;
  }

  private getDefaultEndPoint(): URL {
    return new URL(`https://s3.${this.config.options.region}.amazonaws.com`);
  }

  onModuleDestroy() {
    this.client.destroy();
  }
}
