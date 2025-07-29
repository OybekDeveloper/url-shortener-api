import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes';
import urlRoutes from "./routes/urlRoutes";
import { redirectToOriginalUrl } from "./controllers/urlController";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger'; // manzilga qarab o‘zgartiring
import cors from 'cors';


dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (_, res) => {
  res.send("URL Shortener API is running...");
});
app.use('/api/auth', authRoutes);
app.use("/api/url", urlRoutes);
app.get('/:shortCode', redirectToOriginalUrl); // yangi route


const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
