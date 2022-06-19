export default class UnexpectedError extends Error {
  constructor(readableMessage: string) {
    super(readableMessage);
  }
}
