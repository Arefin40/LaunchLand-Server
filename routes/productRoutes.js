import express from "express";
import * as Product from "../controllers/Product.js";
import { verifyRole, verifyToken } from "../middlewares/index.js";

const router = express.Router();

// create new product
router.post("/", verifyToken, Product.create);

// get all products with pagination
router.get("/", Product.getAll);

// get my products
router.get("/myproducts", verifyToken, Product.getMyProducts);

// get latest featured products
router.get("/featured", Product.getFeatured);

// get all trending products (highest votes)
router.get("/trending", Product.getTrending);

// get all rising products (votes between 10 and 20)
router.get("/rising", Product.getRising);

// get product queue
router.get("/queue", verifyToken, verifyRole("moderator"), Product.getProductQueue);

// get all product reports
router.get("/reports", verifyToken, verifyRole("moderator"), Product.getAllReports);

// get a single product by id
router.get("/:id", Product.get);

// update product info
router.patch("/:id", verifyToken, Product.update);

// delete product
router.delete("/:id", verifyToken, Product.remove);

// accept/reject a product
router.patch("/:id/status", verifyToken, verifyRole("moderator"), Product.changeStatus);

// feature product
router.patch("/:id/feature", verifyToken, verifyRole("moderator"), Product.feature);

// upvote a product
router.patch("/:id/upvote", verifyToken, Product.upvote);

// post a review on this product
router.post("/:id/reviews", verifyToken, Product.postReview);

// get all reviews posted for this product
router.get("/:id/reviews", Product.getAllReviews);

// report a product
router.post("/:id/report", verifyToken, Product.report);

// settle a report
router.delete("/:reportId/settle", verifyToken, verifyRole("moderator"), Product.settleReport);

export default router;
