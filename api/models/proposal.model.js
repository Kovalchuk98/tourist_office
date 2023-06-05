import mgs from "mongoose";
const { Schema, model } = mgs;

let Proposal = new Schema({
  name: { type: String, unique: true, required: true },
  descr: { type: String, unique: true, required: true },
  date: [{ type: Date, required: false, index: true }],
  employee: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  img: { type: String, required: true },
  file: { type: String, required: true },
  marker: {
    name: { type: String, required: false },
    descr: { type: String, required: false },
    img: { type: String, required: false },
    location: { type: Array, required: false },
  },
});

export default model("Proposal", Proposal);
