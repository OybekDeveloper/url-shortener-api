import express from "express";
import {  getUrlStats, shortenUrl } from "../controllers/urlController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/shorten", verifyToken, shortenUrl);
router.get('/stats/:shortCode', verifyToken, getUrlStats);

export default router;
/**
 * @swagger
 * tags:
 *   name: URL
 *   description: URL Shortening and Stats
 */

/**
 * @swagger
 * /api/url/shorten:
 *   post:
 *     summary: Shorten a URL
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: URL shortened
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /api/url/stats/{shortCode}:
 *   get:
 *     summary: Get stats of a shortened URL
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stats returned
 *       404:
 *         description: URL not found
 */
