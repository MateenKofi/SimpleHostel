class HttpException extends Error {
  public status: number;

  constructor(status: number, message: string | Error) {
    if (message instanceof Error) {
      super(message.message);
      this.stack = message.stack;
    } else {
      super(message? message.toString(): ''); // Use toString() to handle unknown type safely
      this.name = " ";
    }

    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpException;
