import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  const statusCode = (err as any).statusCode || (err as any).status || 500;
  if (statusCode < 500) {
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Bad Request'
    });
  }

  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
}
