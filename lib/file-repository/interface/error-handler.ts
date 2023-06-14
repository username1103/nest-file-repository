export interface ErrorHandler {
  handle(e: unknown): never | any;
}

export const ERROR_HANDLER = Symbol('ERROR_HANDLER');
