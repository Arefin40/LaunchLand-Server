import express from "express";
import * as Coupon from "../controllers/Coupon.js";
import { verifyToken, verifyAdmin } from "../middlewares/index.js";

const router = express.Router();

// create a coupon
router.post("/", verifyToken, verifyAdmin, Coupon.create);

// apply coupon
router.get("/apply", verifyToken, Coupon.apply);

// get all coupons
router.get("/", verifyToken, verifyAdmin, Coupon.getAll);

// get coupon details
router.get("/:id", verifyToken, verifyAdmin, Coupon.get);

// update coupon
router.patch("/:id", verifyToken, verifyAdmin, Coupon.update);

// delete coupon
router.delete("/:id", verifyToken, verifyAdmin, Coupon.remove);

export default router;
