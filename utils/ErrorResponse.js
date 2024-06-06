class ErrorResponse extends Error {
   constructor(statusCode, message, extra) {
      super(message);
      this.success = false;
      this.status = statusCode;

      if (extra) {
         for (const prop in extra) {
            if (extra.hasOwnProperty(prop)) {
               this[prop] = extra[prop];
            }
         }
      }

      Error.captureStackTrace(this, this.constructor);
   }
}

export default ErrorResponse;
