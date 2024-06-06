import mongoose from "mongoose";

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export { default as request } from "./request.js";
export { default as ErrorResponse } from "./ErrorResponse.js";
