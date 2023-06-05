import jwt from "jsonwebtoken";
import secret from "../config.js";

const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
  return next();
};

export default auth;
