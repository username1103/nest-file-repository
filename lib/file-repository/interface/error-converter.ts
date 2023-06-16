import { BaseException } from '../exception/base-exception';

export interface ErrorConverter {
  convert(e: unknown): BaseException;
}

export const ERROR_CONVERTER = Symbol('ERROR_CONVERTER');
