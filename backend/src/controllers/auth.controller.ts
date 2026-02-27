import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export const register = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const { email, password, name } = result.data;

    const isUserExist = await prisma.user.findUnique({ where: { email } });

    if (isUserExist) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({ token, user: userWithoutPassword });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ err: result.error.message });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Wrong credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Wrong credentials' });
    }

    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ token, user: userWithoutPassword });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const userData = await prisma.user.findUnique({ where: { id: userId } });

    if (!userData) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    const { password, ...userWithoutPassword } = userData;
    
    return res.status(200).json({ user: userWithoutPassword });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Server error'
    return res.status(500).json({ error })
  }
};
