import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import secret from "../config.js";

const generateAccessToken = (id, username, password) => {
  const payload = {
    id,
    username,
    password,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async signin(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        res.status(404).json({ message: `User ${username} not found` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Incorrect password` });
      }

      if (validPassword) {
        const token = generateAccessToken(
          user._id,
          user.username,
          user.password
        );
        return res.status(200).json({ user, token });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }
}

export default new authController();
