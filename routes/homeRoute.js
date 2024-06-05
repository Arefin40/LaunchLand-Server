import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
   res.status(200).send("Response from home route");
});

export default router;
