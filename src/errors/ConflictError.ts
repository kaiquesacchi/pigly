export default class ConflictError extends Error {
  constructor(readableMessage: string) {
    super(readableMessage);
  }
}
