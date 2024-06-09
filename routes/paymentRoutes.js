import express from "express";
import createStripe from "stripe";
import { verifyToken } from "../middlewares/index.js";

const router = express.Router();
const stripe = createStripe(process.env.STRIPE_SECRET_KEY);

// create payment intent
router.post("/create-intent", verifyToken, async (req, res) => {
   let price = parseFloat(req.body.price) * 100;
   if (!price || price < 1) return;

   price = Math.round(price * 1000) / 1000;

   const { client_secret } = await stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
   });

   res.send({ clientSecret: client_secret });
});

export default router;
