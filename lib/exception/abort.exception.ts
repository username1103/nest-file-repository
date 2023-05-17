export class AbortException extends Error {
  constructor(message = 'the operation aborted') {
    super(message);
  }
}
