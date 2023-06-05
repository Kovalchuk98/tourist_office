import express, { Router } from "express";
const route = express.Router();
import auth from "../middleware/authMiddleware.js";

import helper from "../utils/uploadHelper.js";
import helperImg from "../utils/imgHelper.js";

const { upload } = helper;
const { uploadImg } = helperImg;

import proposalController from "../controllers/proposalController.js";

route.post("/", [auth, upload.any()], proposalController.addProposal);

route.patch("/:id", [auth, upload.any()], proposalController.updateProposal);

route.delete("/:id", auth, proposalController.deleteProposal);

route.delete("/marker/:id", auth, proposalController.deleteMarker);

// route.post("/:id", auth, proposalController.updatePreview);

route.post("/:id/preview", auth, proposalController.updatePreview);

route.get("/week", proposalController.getProposalsForWeek);

export default route;
