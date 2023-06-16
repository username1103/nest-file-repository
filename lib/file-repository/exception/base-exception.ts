export class BaseException extends Error {
  private readonly _originError: any;
  constructor(message: string, originError?: unknown) {
    super(message);
    this._originError = originError;
  }

  get originError() {
    return this._originError;
  }
}
