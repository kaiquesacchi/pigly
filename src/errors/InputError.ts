export default class InputError extends Error {
  constructor(readableMessage: string) {
    super(readableMessage);
  }
}
