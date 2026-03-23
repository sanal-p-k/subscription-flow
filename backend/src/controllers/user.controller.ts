import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserService } from '../services/user.service.js';

export const userSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    name: z.string().min(1, 'Name is required'),
    age: z.number().int().min(0).max(120, 'Age must be between 0 and 120'),
    weight: z.number().positive('Weight must be positive'),
    height: z.number().positive('Height must be positive')
});

export const loginOrSignup = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const result = UserService.getOrCreate(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};
