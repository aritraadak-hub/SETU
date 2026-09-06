import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { ApiError } from '../utils/apiError.js';
import { signToken } from '../utils/jwt.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['TOURIST', 'VENDOR']).default('TOURIST'),
  phone: z.string().optional(),
  // Vendor specific optional fields
  businessName: z.string().optional(),
  businessType: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new ApiError(400, 'An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        phone: data.phone || null
      }
    });

    // If registered as VENDOR, automatically create a Vendor record with PENDING status
    if (data.role === 'VENDOR') {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          businessName: data.businessName || `${data.name}'s Tourism Services`,
          description: 'New vendor awaiting approval.',
          businessType: data.businessType || 'Tour Operator',
          phone: data.phone || '+910000000000',
          email: data.email,
          address: 'Pending Update',
          city: 'Patna',
          district: 'Patna',
          status: 'PENDING'
        }
      });
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    res.cookie('setu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { vendor: true }
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    res.cookie('setu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        isPremium: user.isPremium,
        vendor: user.vendor ? {
          id: user.vendor.id,
          businessName: user.vendor.businessName,
          status: user.vendor.status
        } : null
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('setu_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  return res.json({ success: true, message: 'Logged out successfully' });
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { vendor: true }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        isPremium: user.isPremium,
        vendor: user.vendor ? {
          id: user.vendor.id,
          businessName: user.vendor.businessName,
          status: user.vendor.status
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
}
