import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import corsOptions from "./config/corsOptions.js";
import { connectToDB } from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/index.js";
import homeRoute from "./routes/homeRoute.js";
import authRoute from "./routes/authRoute.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

dotenv.config();
const app = express();

// middlewares
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use("/", homeRoute);
app.use("/jwt", authRoute);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/coupons", couponRoutes);
app.use("/payments", paymentRoutes);
app.use("/subscriptions", subscriptionRoutes);

// error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
// connect to the database and then listen for connections
connectToDB()
   .then(() => {
      app.listen(PORT, () => {
         console.log(`Listening at http://localhost:${PORT}`);
      });
   })
   .catch((error) => {
      console.log(error);
   });
