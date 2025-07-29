import User from "../models/User";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

    return res.status(201).json({ message: 'User registered', success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET!);
    const newAccessToken = generateAccessToken(user._id.toString());

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Token verification failed' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.sendStatus(204);
    }

    user.refreshToken = '';
    await user.save();

    return res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    return res.status(500).json({ message: 'Logout failed', error: 'Internal server error' });
  }
};
