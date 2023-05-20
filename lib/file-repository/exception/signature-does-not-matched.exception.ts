export class SignatureDoesNotMatchedException extends Error {
  constructor(message: string) {
    super(message);
  }
}
