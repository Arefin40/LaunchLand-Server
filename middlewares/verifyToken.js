import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
   if (!req.headers?.authorization)
      return res.status(401).send({ success: false, message: "unauthorized access" });

   const token = req.headers.authorization.split(" ")[1];
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(401).send({ success: false, message: "unauthorized access" });
      req.user = decoded;
      next();
   });
};

export default verifyToken;
