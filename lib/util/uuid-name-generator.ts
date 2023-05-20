import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';

import { File } from '../File';
import { NameGenerator } from '../interface/name-generator';

@Injectable()
export class UuidNameGenerator implements NameGenerator {
  generate(file: File): string {
    return `${randomUUID()}${file.extension}`;
  }
}
