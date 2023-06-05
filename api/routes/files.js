import express from "express";
import auth from "../middleware/authMiddleware.js";

import fs from "fs";

import helperImg from "../utils/imgHelper.js";

const { uploadImg } = helperImg;

const route = express.Router();

route.post("/uploadpreview", [auth, uploadImg.single("file")], (req, res) => {
  res.json({ file: req.file });
});

route.post("/deletefile", auth, (req, res) => {
  const filepath = "uploads/documents/";
  fs.unlink(filepath + req.body.file, function (err) {
    if (err) {
      return res.status(400).json({ message: "Delete data error" });
    }
    return res.status(200).send({
      message: "File has been deleted",
    });
  });
});

export default route;
