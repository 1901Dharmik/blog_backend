import Author from "../models/authorModel.js";
import asyncHandler from "express-async-handler";

const createAuthor = asyncHandler(async (req, res) => {
  const author = await Author.create(req.body);
  res.status(201).json(author);
});

const getAllAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find().sort({ name: 1 }).lean();
  res.status(200).json(authors);
});

const getAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) {
    res.status(404);
    throw new Error("Author not found");
  }
  res.status(200).json(author);
});

const updateAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!author) {
    res.status(404);
    throw new Error("Author not found");
  }
  res.status(200).json(author);
});

const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author) {
    res.status(404);
    throw new Error("Author not found");
  }
  res.status(200).json({ message: "Author deleted" });
});

export { createAuthor, getAllAuthors, getAuthor, updateAuthor, deleteAuthor };
