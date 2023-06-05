import mgs from "mongoose";
const { Schema, model } = mgs;

const User = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export default model("User", User);
