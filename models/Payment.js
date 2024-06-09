import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
   {
      subscriptionId: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "Subscription",
         required: [true, "Subscription ID is required"],
         index: true,
      },
      user: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "User",
         required: [true, "User ID is required"],
      },
      transactionId: {
         type: String,
         required: [true, "Transaction ID is required"],
      },
      amount: {
         type: Number,
         required: [true, "Amount is required"],
      },
      currency: {
         type: String,
         required: [true, "Currency is required"],
      },
      usedCoupon: {
         type: String,
      },
      paymentDate: {
         type: Date,
         default: () => new Date(),
      },
      paymentMethod: {
         type: String,
      },
   },
   { timestamps: true, versionKey: false, autoIndex: true }
);

export default mongoose.model("Payment", PaymentSchema);
