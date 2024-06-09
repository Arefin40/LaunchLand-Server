import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/index.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
   const { userId, paymentDetails } = req.body;

   // Check if user exists
   const user = await User.findById(userId);
   if (!user) throw new ErrorResponse(404, "User not found");

   // Check if user already has a subscription
   let subscription = await Subscription.findOne({ userId });

   // If the user does not have a subscription yet, create a new one
   if (!subscription) subscription = await Subscription.create({ userId });

   // save payment details
   await Payment.create({ subscriptionId: subscription._id, user: userId, ...paymentDetails });

   // Update user's isSubscribed status
   user.isSubscribed = true;
   await user.save();

   res.status(201).send({ success: true, message: "Subscription successful" });
});

// get all subscriptions
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
   const subscriptions = await Subscription.find().lean();
   res.status(200).send(subscriptions);
});

export default router;
