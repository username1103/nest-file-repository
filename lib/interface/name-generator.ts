import { File } from '../File';

export interface NameGenerator {
  generate(file: File): string;
}

export const NAME_GENERATOR = Symbol('NAME_GENERATOR');
