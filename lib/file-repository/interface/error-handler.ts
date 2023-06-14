export interface ErrorHandler {
  handle(e: unknown): never;
}

export const ERROR_HANDLER = Symbol('ERROR_HANDLER');
