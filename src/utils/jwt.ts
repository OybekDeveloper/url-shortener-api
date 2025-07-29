import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};
