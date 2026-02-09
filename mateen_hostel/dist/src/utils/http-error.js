"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message) {
        if (message instanceof Error) {
            super(message.message);
            this.stack = message.stack;
        }
        else {
            super(message ? message.toString() : ''); // Use toString() to handle unknown type safely
            this.name = " ";
        }
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = HttpException;
