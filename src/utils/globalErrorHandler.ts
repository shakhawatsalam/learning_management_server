/* eslint-disable @typescript-eslint/ban-types */
class globalErrorHandler extends Error {
  // eslint-disable-next-line @typescript-eslint/ban-types
  statusCode: Number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: any, statusCode: Number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default globalErrorHandler;
