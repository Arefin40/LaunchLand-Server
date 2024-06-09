import express from "express";
import * as User from "../controllers/User.js";
import { verifyToken, verifyRole } from "../middlewares/index.js";

const router = express.Router();

// create new user
router.post("/", User.create);

// get all users
router.get("/", verifyToken, verifyRole("admin"), User.getAll);

// get a single user by id
router.get("/:id", verifyToken, User.getById);

// get a single user by email
router.get("/email/:email", verifyToken, User.getByEmail);

// update user info
router.patch("/:id", verifyToken, User.update);

// change user role
router.patch("/make/:id", verifyToken, verifyRole("admin"), User.changeRole);

export default router;
