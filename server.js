import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

connectDB()
    .then(() => {
        const app = express();

        app.use(express.json());
        app.use(cors());

        // Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/services", serviceRoutes);
        app.use("/api/reviews", reviewRoutes);

        app.get("/api/test", (req, res) => {
            res.json({ message: "Server is working!" });
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    });
