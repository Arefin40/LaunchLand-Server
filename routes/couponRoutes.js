import express from "express";
import * as Coupon from "../controllers/Coupon.js";
import { verifyToken, verifyRole } from "../middlewares/index.js";

const router = express.Router();

// create a coupon
router.post("/", verifyToken, verifyRole("admin"), Coupon.create);

// apply coupon
router.get("/apply", verifyToken, Coupon.apply);

// get all coupons
router.get("/", verifyToken, verifyRole("admin"), Coupon.getAll);

// get all valid coupons (not expired)
router.get("/valid", Coupon.getValidCoupons);

// get coupon details
router.get("/:id", verifyToken, verifyRole("admin"), Coupon.get);

// update coupon
router.patch("/:id", verifyToken, verifyRole("admin"), Coupon.update);

// delete coupon
router.delete("/:id", verifyToken, verifyRole("admin"), Coupon.remove);

export default router;
