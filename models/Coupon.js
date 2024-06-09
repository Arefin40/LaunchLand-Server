import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
   {
      code: {
         type: String,
         required: [true, "Coupon code is required"],
         index: { unique: true },
         immutable: true,
      },
      expiryDate: {
         type: Date,
         required: [true, "Expiry date is required"],
      },
      description: {
         type: String,
         required: [true, "Coupon code description is required"],
      },
      discountType: {
         type: String,
         enum: { values: ["percent", "amount"], message: "{VALUE} is not supported" },
         required: [true, "Discount type is required"],
      },
      discount: {
         type: Number,
         required: [true, "Discount amount is required"],
         min: [0, "Discount value can't be negative"],
         validate: {
            validator: function (value) {
               if (this.discountType === "percent") return value >= 0 && value <= 100;
            },
            message: "Discount percentage must be within 0 to 100",
         },
      },
   },
   { versionKey: false, timestamps: true, autoIndex: true }
);

export default mongoose.model("Coupon", CouponSchema);
