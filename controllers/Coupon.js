import Coupon from "../models/Coupon.js";
import { ErrorResponse, request } from "../utils/index.js";

// create a coupon
export const create = request(async (req, res) => {
   const coupon = await Coupon.create(req.body);
   res.status(201).send({ success: true, message: "Coupon added successfully", data: coupon });
});

// get all coupons
export const getAll = request(async (req, res) => {
   const coupons = await Coupon.find().lean();
   res.status(200).send(coupons);
});

// get coupon details
export const get = request(async (req, res) => {
   const coupon = await Coupon.findById(req.params.id);
   if (!coupon) throw new ErrorResponse(404, "Coupon not found");
   res.status(200).send(coupon);
});

// update coupon
export const update = request(async (req, res) => {
   const { expiryDate, description, discountType, discount } = req.body;
   await Coupon.updateOne(
      { _id: req.params.id },
      { expiryDate, description, discountType, discount },
      { runValidators: true }
   );
   res.status(200).send({ success: true, message: "Coupon updated successfully" });
});

// delete coupon
export const remove = request(async (req, res) => {
   await Coupon.deleteOne({ _id: req.params.id });
   res.status(200).send({ success: true, message: "Coupon deleted successfully" });
});

// get valid coupons
export const getValidCoupons = request(async (req, res) => {
   const currentDate = new Date();
   const validCoupons = await Coupon.find({ expiryDate: { $gt: currentDate } });
   res.status(200).json(validCoupons);
});

// apply coupon
export const apply = request(async (req, res) => {
   const { code, amount } = req.query;

   if (!code || !amount) {
      return res.status(400).json({ error: "Coupon code and amount are required." });
   }

   const coupon = await Coupon.findOne({ code });
   if (!coupon) throw new ErrorResponse(404, "Invalid coupon code");

   if (new Date(coupon.expiryDate) < new Date()) throw new ErrorResponse(400, "Coupon is expired");

   let discountString, discount;
   const subTotalAmount = parseFloat(amount);

   if (coupon.discountType === "percent") {
      discountString = `${coupon.discount}%`;
      discount = subTotalAmount * (coupon.discount / 100);
   } else {
      discountString = `$${coupon.discount}`;
      discount = coupon.discount;
   }

   discount = Math.round(discount * 100) / 100;
   let discountedAmount = subTotalAmount - discount;
   discountedAmount = discountedAmount < 0 ? 0 : discountedAmount;
   discountedAmount = Math.round(discountedAmount * 100) / 100;

   res.status(200).send({
      success: true,
      message: "Verified coupon",
      data: { code, discount, discountString, subTotalAmount, discountedAmount },
   });
});
