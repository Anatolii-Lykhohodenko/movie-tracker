import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from '../schemas/auth.schema';
import cloudinary, { uploadToCloudinary } from '../cloudinary';

export const register = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }
    const { email, password, name } = result.data;

    const isUserExist = await prisma.user.findUnique({ where: { email } });

    if (isUserExist) {
      return res.status(400).json({ error: 'User with this email is already exists' });
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
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Wrong credentials' });
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
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        birthDate: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    return res.status(200).json({ user: userData });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const dataToChange = result.data;

    const newUserData = await prisma.user.update({
      where: { id: userId },
      data: dataToChange,
    });

    const { password, ...userData } = newUserData;

    return res.status(200).json({ user: userData });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const result = updatePasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { oldPassword, newPassword } = result.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Wrong credentials' });
    }

    const password = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password },
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Invalid image input' });
    }
    const { userId } = req.user!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Wrong credentials' });
    }

    if (user.avatar) {
      const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const { secure_url } = await uploadToCloudinary(req.file.buffer);

    const userData = await prisma.user.update({
      where: { id: userId },
      data: { avatar: secure_url },
      select: {
        id: true,
        name: true,
        email: true,
        birthDate: true,
        avatar: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ user: userData });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error });
  }
};
