import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// generate json web token
router.post("/", async (req, res) => {
   const email = req.body;
   const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
   res.status(200).send({ token });
});

export default router;
