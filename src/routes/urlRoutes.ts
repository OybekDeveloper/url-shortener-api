import express from "express";
import {  getUrlStats, shortenUrl } from "../controllers/urlController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/shorten", verifyToken, shortenUrl);
router.get('/stats/:shortCode', verifyToken, getUrlStats);

export default router;
