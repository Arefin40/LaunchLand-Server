import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const verifyRole = (role) => async (req, res, next) => {
   try {
      const email = req.user.email;
      const user = await User.findOne({ email });
      if (!user) throw new ErrorResponse(404, "User not found");
      if (user?.role !== role) throw new ErrorResponse(403, "forbidden access");
      next();
   } catch (error) {
      next(error);
   }
};

export default verifyRole;
