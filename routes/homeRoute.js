import express from "express";
import { verifyToken, verifyRole } from "../middlewares/index.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/", async (req, res) => {
   res.status(200).send("Response from home route");
});

// admin analytics
router.get("/admin/analytics", verifyToken, verifyRole("admin"), async (req, res) => {
   const totalProducts = await Product.countDocuments();
   const totalUsers = await User.countDocuments();
   const totalReviews = await Review.countDocuments();
   res.status(200).send({ totalProducts, totalUsers, totalReviews });
});

export default router;
