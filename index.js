import express from "express";
import cors from "cors";
import blogRoutes from "./routes/blogRoute.js";
import connectDB from "./config/dbConfig.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = 5000;
connectDB();

app.use(express.json());
app.use(cors({
    origin: "*"
}));


app.use("/api/blogs", blogRoutes);
app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
