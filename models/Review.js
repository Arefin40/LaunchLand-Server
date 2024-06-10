import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      product: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product",
         required: true,
         index: true,
      },
      rating: {
         type: Number,
         required: true,
         min: 1,
         max: 5,
      },
      comment: {
         type: String,
         required: true,
      },
      createdAt: {
         type: Date,
         default: () => new Date(),
      },
   },
   { versionKey: false }
);

export default mongoose.model("Review", ReviewSchema);