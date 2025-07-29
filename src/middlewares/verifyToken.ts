import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err || !decoded) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error in verifyToken middleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
