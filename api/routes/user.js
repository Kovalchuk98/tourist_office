import express, { Router } from "express";
const route = express.Router();
import userController from "../controllers/userController.js";

route.post("/signin", userController.signin);

export default route;
