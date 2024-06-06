import { ErrorResponse } from "../utils/index.js";

const errorHandler = (err, req, res, next) => {
   res.status(err.status || 500);

   // Validation error
   if (err?.name && err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => ({
         path: error.path,
         message:
            error.name === "CastError"
               ? `Cast to ${error.kind} failed for value ${error.stringValue}`
               : error.message,
      }));
      res.json({ success: false, message: "ValidationError", errors });
   }

   // Cast error
   else if (err?.name && err.name === "CastError") {
      res.json({
         success: false,
         message: "CastError",
         errors: [
            {
               path: err.path,
               message: `Cast to ${err.kind} failed for value ${err.stringValue}`,
            },
         ],
      });
   }

   // Duplicate value error
   else if (err?.code && err.code === 11000) {
      const error = [
         {
            path: Object.keys(err.keyValue)[0],
            message: `"${Object.values(err.keyValue)[0]}" already exists`,
         },
      ];
      res.json({ success: false, message: "DuplicateKeyValueError", errors: [error] });
   }

   // ErrorResponse
   else if (err instanceof ErrorResponse) {
      const { stack, ...errorProps } = JSON.parse(
         JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
      res.json(errorProps);
   }

   // other errors
   else res.json({ success: false, message: err.message });
};

export default errorHandler;
