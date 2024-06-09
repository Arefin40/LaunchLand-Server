import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "User",
         required: [true, "User ID is required"],
         index: { unique: true },
         immutable: true,
      },
      startDate: {
         type: Date,
         default: () => new Date(),
      },
      endDate: {
         type: Date,
         default: () => {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            return date;
         },
      },
      status: {
         type: String,
         enum: {
            values: ["active", "expired"],
            message: "Invalid status type {VALUE}",
         },
         default: "active",
      },
      price: {
         type: Number,
         default: 99,
      },
   },
   { versionKey: false, timestamps: true, autoIndex: true }
);

export default mongoose.model("Subscription", SubscriptionSchema);
