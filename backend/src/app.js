import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.json({ message: "EcoStore backend is running" });
});

// MOUNT ROUTES TRƯỚC KHI LISTEN
app.use("/api", apiRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

