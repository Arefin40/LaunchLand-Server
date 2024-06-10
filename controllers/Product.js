import Product from "../models/Product.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import { ErrorResponse, request } from "../utils/index.js";

// create a product
export const create = request(async (req, res) => {
   const { name, icon, tagline, description, tags, images, website } = req.body;
   const productDetails = { name, icon, tagline, description, tags, images, website };

   const user = await User.findOne({ email: req.user?.email });

   // Check if the user is subscribed or has not reached the product limit
   if (user.productsLaunched > 0 && !user.isSubscribed)
      throw new ErrorResponse(400, "You have reached the maximum product limit");

   // Add this product and update the user's product count
   const product = await Product.create({ ...productDetails, owner: user._id });
   await User.findByIdAndUpdate(user._id, { $inc: { productsLaunched: 1 } });

   res.status(201).send({ success: true, message: "Product added successfully", data: product });
});

// get all products
export const getAll = request(async (req, res) => {
   // pagination parameters
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 6;
   const startIndex = (page - 1) * limit;

   let query = {};

   // if tags are provided generate case-insensitive regex patterns for each tag
   const { tags } = req.query;
   if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      const regexTags = tagsArray.map((tag) => new RegExp(tag, "i"));
      query = { tags: { $in: regexTags } };
   }

   console.log(query);

   // fetch products with pagination
   const products = await Product.find(query)
      .populate("owner", "name email photoUrl")
      .lean()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

   // pagination metadata
   const total = await Product.countDocuments(query);
   const pages = Math.ceil(total / limit);
   const count = products.length;

   // products with pagination metadata
   res.status(200).send({ success: true, count, total, page, pages, products });
});

// get my products
export const getMyProducts = request(async (req, res) => {
   const user = await User.findOne({ email: req.user.email }).select("_id");
   const products = await Product.find({ owner: user._id })
      .populate("owner", "name email")
      .lean()
      .sort({ createdAt: -1 });
   res.status(200).send(products);
});

// get product details
export const get = request(async (req, res) => {
   const product = await Product.findById(req.params.id).populate("owner", "name email photoUrl");
   if (!product) throw new ErrorResponse(404, "Product not found");
   res.status(200).send(product);
});

// update product
export const update = request(async (req, res) => {
   const product = await Product.findById(req.params.id).populate("owner", "-_id email");
   if (!product) throw new ErrorResponse(404, "Product not found");

   // check if the product is owned by the user
   if (product.owner?.email !== req.user?.email) throw new ErrorResponse(403, "Forbidden access");

   // check if update data is provided
   const { name, icon, tagline, description, tags, images, website } = req.body;
   const updateData = { name, icon, tagline, description, tags, images, website };
   if (updateData && Object.keys(updateData).every((key) => updateData[key] === undefined))
      throw new ErrorResponse(500, "No changes made");

   const result = await Product.updateOne(
      { _id: req.params.id },
      { name, icon, tagline, description, tags, images, website },
      { runValidators: true }
   );

   if (result.modifiedCount === 0) throw new ErrorResponse(500, "No changes made");
   res.status(200).send({ success: true, message: "Product updated successfully" });
});

// delete product
export const remove = request(async (req, res) => {
   const product = await Product.findById(req.params.id).populate("owner");
   if (!product) throw new ErrorResponse(404, "Product not found");

   const user = await User.findOne({ email: req.user?.email });

   // check if the product is owned by the user
   if (!product.owner.equals(user._id)) throw new ErrorResponse(403, "Forbidden access");

   await Product.deleteOne({ _id: req.params.id });
   res.status(200).send({ success: true, message: "Product deleted successfully" });
});

// accept/reject a product
export const changeStatus = request(async (req, res) => {
   const result = await Product.updateOne(
      { _id: req.params.id },
      { status: req?.body?.status },
      { runValidators: true }
   );

   if (req?.body?.status === undefined || result.modifiedCount === 0)
      throw new ErrorResponse(500, "Product not found or status not changed");

   res.status(200).send({ success: true, message: "Product status changed successfully" });
});

// feature product
export const feature = request(async (req, res) => {
   const result = await Product.updateOne(
      { _id: req.params.id },
      { featured: true },
      { runValidators: true }
   );

   if (result.modifiedCount === 0) throw new ErrorResponse(500, "No changes made");
   res.status(200).send({ success: true, message: "Product featured successfully" });
});

// upvote a product
export const upvote = request(async (req, res) => {
   const user = await User.findOne({ email: req?.user?.email });

   // check if the product exists
   const product = await Product.findById(req.params.id);
   if (!product) throw new ErrorResponse(404, "Product not found");

   // check if the product is owned by the user
   if (product.owner.equals(user._id)) throw new ErrorResponse(400, "Cannot upvote own product");

   // check if already upvoted
   if (product.upvotedBy.includes(user?._id)) {
      return res.status(400).send({ error: "Already upvoted this product" });
   }

   // update upvote count
   product.upvotes += 1;
   product.upvotedBy.push(user?._id);
   await product.save();

   res.status(200).send({
      success: true,
      message: "Product upvoted successfully",
      upvotes: product.upvotes,
   });
});

// get latest featured products
export const getFeatured = request(async (req, res) => {
   const limit = parseInt(req.query.limit) || 6;
   const products = await Product.find({ featured: true })
      .select("name icon tagline upvotes description tags")
      .lean()
      .sort({ createdAt: -1 })
      .limit(limit);
   res.status(200).send({ success: true, count: products.length, data: products });
});

// get all trending products (highest votes)
export const getTrending = request(async (req, res) => {
   const limit = parseInt(req.query.limit) || 6;
   const products = await Product.find()
      .select("name icon tagline upvotes description tags")
      .lean()
      .sort({ upvotes: -1 })
      .limit(limit);
   res.status(200).send({ success: true, count: products.length, data: products });
});

// get all rising products (votes between 10 and 20), sorted by lowest votes
export const getRising = request(async (req, res) => {
   const query = { upvotes: { $gte: 10, $lte: 20 } };
   const products = await Product.find(query).lean().sort({ upvotes: 1 });
   res.status(200).send({ success: true, count: products.length, data: products });
});

// product queue sort by (status: pending > accepted > rejected)
export const getProductQueue = request(async (req, res) => {
   const products = await Product.aggregate([
      {
         $addFields: {
            statusOrder: {
               $switch: {
                  branches: [
                     { case: { $eq: ["$status", "pending"] }, then: 1 },
                     { case: { $eq: ["$status", "accepted"] }, then: 2 },
                     { case: { $eq: ["$status", "rejected"] }, then: 3 },
                  ],
                  default: 4,
               },
            },
         },
      },
      { $sort: { statusOrder: 1, createdAt: -1 } },
   ]);
   res.status(200).send({ success: true, count: products.length, data: products });
});

// report a product
export const report = request(async (req, res) => {
   const user = await User.findOne({ email: req?.user?.email });

   // check if the product exists
   const product = await Product.findById(req.params.id);
   if (!product) throw new ErrorResponse(404, "Product not found");

   // check if the product is owned by the user
   if (product.owner.equals(user._id)) throw new ErrorResponse(400, "Cannot report own product");

   const report = await Report.create({ product: product._id, reportedBy: user._id });
   res.status(200).send({ success: true, message: "Product reported successfully", data: report });
});

// settle a report
export const settleReport = request(async (req, res) => {
   // Check if the report exists
   const report = await Report.findById(req.params.reportId);
   if (!report) throw new ErrorResponse(404, "Report not found");

   // delete both report and the product
   await Product.deleteOne({ _id: report.product });
   await Report.deleteOne({ _id: req.params.reportId });

   res.status(200).send({ success: true, message: "Report settled successfully" });
});

// get all product reports
export const getAllReports = request(async (req, res) => {
   const reports = await Report.find().populate("product", "name icon tagline").lean();
   res.status(200).send(reports);
});
