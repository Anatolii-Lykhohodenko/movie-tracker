import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'User is not authorized' });
  }

  try {
    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };

    req.user = decodedInfo;

    next();
  } catch {
    res.status(401).json({ error: 'User is not authorized' });
  }
};
