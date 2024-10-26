export class EmailInUseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailInUseError';
  }
}

export class WeakPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeakPasswordError';
  }
}
