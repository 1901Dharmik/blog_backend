import asyncHandler from "express-async-handler";
import { randomBytes } from "crypto";
import { uploadToR2 } from "../config/cloudflareR2.js";

const MIME_TO_EXT = { "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp" };

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error("No image provided. Use field name 'image'.");
  }

  const { buffer, mimetype } = req.file;
  const ext = MIME_TO_EXT[mimetype] || "jpg";
  const key = `images/${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;

  const url = await uploadToR2(buffer, key, mimetype);

  res.json({ url, key });
});
