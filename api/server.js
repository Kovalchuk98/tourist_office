import express from "express";

const app = express();
const port = 4000;
import cors from "cors";
import mongoose from "mongoose";
import config from "./db.js";

import user from "./routes/user.js";
import proposals from "./routes/proposals.js";
import files from "./routes/files.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/auth", user);
app.use("/api/proposal", proposals);
app.use("/api/files", files);

app.use("/images", express.static("uploads/images"));
app.use(
  "/documents",
  express.static("uploads/documents", { fallthrough: false })
);

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {
    console.log("Database is connected");
  },
  (err) => {
    console.log("Can not connect to the database" + err);
  }
);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
