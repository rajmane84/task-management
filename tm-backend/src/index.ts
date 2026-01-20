import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import V1Router from "./routes/v1/route";
import { connectDB } from "./db/connectDB";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/task-management");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser())

app.use("/api/v1", V1Router);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})