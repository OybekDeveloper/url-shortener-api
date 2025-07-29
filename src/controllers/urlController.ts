import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Url from "../models/Url";
import path from 'path';
import dotenv from "dotenv"

dotenv.config();

export const shortenUrl = async (req: Request, res: Response) => {
  try {
    const { originalUrl, expiresAt } = req.body;
    const userId = (req as any).user.id;
    const publicUrl = process.env.PUBLIC_URL

    if (!originalUrl) {
      return res.status(400).json({ message: "originalUrl is required" });
    }

    let expirationDate: Date;
    if (expiresAt) {
      const parsed = new Date(expiresAt);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({ message: "Invalid expiresAt format" });
      }
      expirationDate = parsed;
    } else {
      expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // default 30min
    }

    const shortCode = nanoid(6);
    const shortUrl = `${publicUrl}/${shortCode}`;

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      userId,
      expiresAt: expirationDate,
    });

    return res.status(201).json({ shortCode, shortUrl, expiresAt: expirationDate });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const redirectToOriginalUrl = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).sendFile(path.join(__dirname, '../../views/404.html'));
    }

    if (url.expiresAt && url.expiresAt.getTime() < Date.now()) {
      return res.status(410).sendFile(path.join(__dirname, '../../views/expired.html'));
    }

    url.visits += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    return res.status(500).send("Server error");
  }
};


export const getUrlStats = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    const userId = (req as any).user.id;

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ message: 'Short link not found' });
    }

    // Faqat o‘zining linkini ko‘ra oladi
    if (url.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied to this URL stats' });
    }

    return res.status(200).json({
      originalUrl: url.originalUrl,
      visits: url.visits,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt || null,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch URL stats' });
  }
};

