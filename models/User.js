import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Name is required"],
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         index: { unique: true },
         immutable: true,
      },
      photoUrl: {
         type: String,
         default: "",
      },
      role: {
         type: String,
         enum: ["admin", "moderator", "member"],
         default: "member",
      },
      isSubscribed: {
         type: Boolean,
         default: false,
      },
   },
   { versionKey: false, timestamps: true, autoIndex: true }
);

export default mongoose.model("User", UserSchema);
