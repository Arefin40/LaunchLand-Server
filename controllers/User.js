import User from "../models/User.js";
import { ErrorResponse, request } from "../utils/index.js";

// create new user
export const create = request(async (req, res) => {
   const { name, email, photoUrl } = req.body;
   const user = await User.create({ name, email, photoUrl });
   res.status(201).send(user);
});

// get all users
export const getAll = request(async (req, res) => {
   const users = await User.find().lean();
   res.status(200).send(users);
});

// get a single user by id
export const getById = request(async (req, res) => {
   const user = await User.findById(req.params.id);
   if (!user) throw new ErrorResponse(404, "User not found");
   res.status(200).send(user);
});

// get a single user by email
export const getByEmail = request(async (req, res) => {
   const user = await User.findOne({ email: req.params.email });
   if (!user) throw new ErrorResponse(404, "User not found");
   res.status(200).send(user);
});

// update user info
export const update = request(async (req, res) => {
   const { name, photoUrl, role, isSubscribed } = req.body;
   let updateData = {};
   let message = "";

   if (name || photoUrl) {
      updateData = { name, photoUrl };
      message = "User info updated successfully";
   } else if (isSubscribed !== undefined) {
      updateData = { isSubscribed };
      message = isSubscribed ? "Subscribed successfully" : "Unsubscribed successfully";
   }

   await User.updateOne({ _id: req.params.id }, updateData, { runValidators: true });
   res.status(200).json({ message });
});

// change user role
export const changeRole = request(async (req, res) => {
   const { role } = req.body;
   await User.updateOne({ _id: req.params.id }, { role }, { runValidators: true });
   res.status(200).send({ success: true, message: `Changed role to ${role}` });
});
