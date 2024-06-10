import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Name is required"],
      },
      icon: {
         type: String,
         required: [true, "Icon is required"],
      },
      tagline: {
         type: String,
         required: [true, "Tagline is required"],
      },
      description: {
         type: String,
         required: [true, "Description is required"],
      },
      owner: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "User",
         index: true,
         required: [true, "Owner ID is required"],
      },
      tags: {
         type: [String],
         required: [true, "Tags is required"],
      },
      images: {
         type: [String],
         default: [],
      },
      website: {
         type: String,
      },
      status: {
         type: String,
         enum: ["pending", "accepted", "rejected"],
         default: "pending",
      },
      featured: {
         type: Boolean,
         default: false,
      },
      upvotes: {
         type: Number,
         default: 0,
      },
      upvotedBy: {
         type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
         default: [],
      },
   },
   { versionKey: false, timestamps: true, autoIndex: true }
);

export default mongoose.model("Product", ProductSchema);
