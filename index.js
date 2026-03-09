import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/dbConfig.js";
import blogRoutes from "./routes/blogRoute.js";
import authorRoutes from "./routes/authorRoute.js";
import uploadRoutes from "./routes/uploadRoute.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*" }));

// Upload route — mounted BEFORE express.json() so multer can parse multipart
// Mount at full path to avoid Express 5 Router sub-path stripping issues
app.use("/api/upload/image", uploadRoutes);

app.use(express.json());
app.use("/api/blogs", blogRoutes);
app.use("/api/authors", authorRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
