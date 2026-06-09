import { AppError } from "./app-error.js";
import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }
    console.error('Unexpected error:', err);
    return res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred. Please try again later.'
    });
}