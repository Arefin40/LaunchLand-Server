import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
   {
      product: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "Product",
         required: [true, "Product ID is required"],
      },
      reportedBy: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: "User",
         required: [true, "Reporter ID is required"],
      },
   },
   { versionKey: false, timestamps: true, autoIndex: true }
);

export default mongoose.model("Report", ReportSchema);
