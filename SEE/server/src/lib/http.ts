/* An error with an HTTP status and a message that is safe to show the reader. */
export class HttpError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}
