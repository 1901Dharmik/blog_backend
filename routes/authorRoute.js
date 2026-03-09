import express from "express";
import validate from "../middlewares/validate.js";
import {
  createAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controller/authorCtrl.js";

const router = express.Router();

const authorRules = {
  name: { required: true, type: "string", minLength: 1, maxLength: 200 },
  avatarUrl: { required: false, type: "string" },
  bio: { required: false, type: "string" },
};

router.post("/", validate(authorRules), createAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthor);
router.put("/:id", validate({ name: { required: false, type: "string", maxLength: 200 }, avatarUrl: { required: false, type: "string" }, bio: { required: false, type: "string" } }), updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
