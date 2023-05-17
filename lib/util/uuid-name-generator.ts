import { randomUUID } from 'crypto';
import { NameGenerator } from '../interface/NameGenerator';
import { File } from '../File';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UuidNameGenerator implements NameGenerator {
  generate(file: File): string {
    return `${randomUUID()}${file.extension}`;
  }
}
