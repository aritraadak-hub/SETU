import dotenv from 'dotenv';
import path from 'path';

// Load .env from cwd or root directory if available
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'setu_bihar_tourism_jwt_super_secret_key_2026',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_setu_bihar_demo_key',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_demo_key_12345',
  RAZORPAY_SETU_PLUS_PLAN_ID: process.env.RAZORPAY_SETU_PLUS_PLAN_ID || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};
