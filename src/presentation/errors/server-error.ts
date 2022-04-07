export class ServerError extends Error {
  constructor() {
    super('An server error has ocurred');
    this.name = 'ServerError ';
  }
}
