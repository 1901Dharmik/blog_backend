import express from "express";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { uploadImage } from "../controller/uploadCtrl.js";

const router = express.Router();

router.post("/", uploadMiddleware, uploadImage);

export default router;
