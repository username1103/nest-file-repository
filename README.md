<p align="center">
  <a href="https://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

# nest-file-repository
[![npm version](https://badge.fury.io/js/nest-file-repository.svg)](https://badge.fury.io/js/nest-file-repository)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=username1103_nest-file-manager&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=username1103_nest-file-manager)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=username1103_nest-file-manager&metric=coverage)](https://sonarcloud.io/summary/new_code?id=username1103_nest-file-manager)

This library provides a flexible file repository for storing files.

## Features

- Provides a flexible file repository
- Support Disk, Memory, AWS S3 file repository

## Installation

```bash
npm install nest-file-repository
```
```bash
yarn add nest-file-repository
```

## Usage

First, the module we created must be imported into your module
```typescript
import { Module } from '@nestjs/common';
import { FileRepositoryModule, UploadStrategy } from 'nest-file-repository';
import { YourService } from './your.service'

@Module({
  imports: [
    FileRepositoryModule.register({
      strategy: UploadStrategy.S3,
      options: {
        region: 'your region',
        bucket: 'your bucket',
        acl: 'public-read', // acl of your bucket
        credentials: {
          accessKeyId: 'your access key id',
          secretAccessKey: 'your secret access key',
        },
      },
    }),
  ],
  providers: [YourService]
})
export class YourModule {}
```

Then, Make the file repository available to inject into your service what you want.  
Appropriate file repository will be injected via the config you passed when configuring the module.


```typescript
import { Injectable } from '@nestjs/common';
import { FileRepository, File } from 'nest-file-repository';

@Injectable()
export class YourService {
  constructor(private readonly fileRepository: FileRepository) {}
  
  async save(filePath: string, fileData: Buffer): Promise<string> {
    const path = await this.fileRepository.save(new File(filePath, fileData))
    
    return path;
  }
}
```


If you want to use more than one file repository, you can specify it like this:

First, when importing our module into your module, you must set the name

```typescript
import { Module } from '@nestjs/common';
import { YourService } from './your.service';
import { FileRepositoryModule, UploadStrategy } from 'nest-file-repository';

@Module({
  imports: [
    FileRepositoryModule.register({
      name: 'sample1',
      strategy: UploadStrategy.S3,
      options: {
        region: 'your region',
        bucket: 'your bucket',
        acl: 'public-read', // acl of your bucket
        credentials: {
          accessKeyId: 'your access key id',
          secretAccessKey: 'your secret access key',
        },
      },
    }),
    FileRepositoryModule.register({
      name: 'sample2',
      strategy: UploadStrategy.DISK,
      options: {
        path: './sample2',
      },
    }),
  ],
  providers: [YourService],
})
export class YourModule {}
```

Then, you need to `@Inject` the `FileRepository` into your service.  
You must set which file repository it is through Inject.

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { TestProjectService } from './test-project.service';
import { File, FileRepository } from 'nest-file-repository';

@Injectable()
export class YourService {
  constructor(
    @Inject('sample1') private readonly fileRepository1: FileRepository,
    @Inject('sample2') private readonly fileRepository2: FileRepository,
  ) {}
  
  async save1(): Promise<string> {
    return await this.fileRepository1.save(
      new File('test-file.txt', Buffer.from('hello')),
    );
  }
  
  async save2(): Promise<string> {
    return await this.fileRepository2.save(
      new File('test-file.txt', Buffer.from('hello')),
    );
  }
}
```

## options

### common options

- `strategy`(required): Select upload strategy of FileRepository. Exist `MEMORY`, `DISK`, `S3` strategy.
- `name`: Set name of your FileRepository. It is required if you want to use two or more file repositories.
- `options.timeout`: Set timeout. The number of milliseconds a request can take before automatically being terminated. 0 disables the timeout.
- `options.path`: Set save path.

### S3 options

- `region`(required): Set the region where your bucket is located.
- `credentials.accessKeyId`(required): Set an access key id with access to AWS s3.
- `credentials.secretAccessKey`(required): Set a secret access key with access to AWS s3.
- `bucket`(required): Set your bucket.
- `acl`(required): Set available acl on your bucket.
- `endPoint`: Set AWS endpoint.
- `forcePathStyle`: Whether to force path style URLs for S3 objects (e.g., `https://s3.amazonaws.com/<bucketName>/<key>` instead of `https://<bucketName>.s3.amazonaws.com/<key>`.
    
## Exception

- `TimeoutException`: Times out
- `NoSuchBucketException`: Does not exist s3 bucket.
- `InvalidAccessKeyIdException`: Invalid access key id of s3
- `NotAllowedAclException`: Not allowed acl of s3 bucket
- `SignatureDoesNotMatchedException`: Not matched access key id and secret access key of s3


## License

This library is licensed under the MIT license.
