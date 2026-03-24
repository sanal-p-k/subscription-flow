import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        try {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                // Accessing underlying issues array bypassing getter wrappers
                const messages = result.error.issues.map((e: any) => e.message).join(', ');
                return res.status(400).json({ success: false, message: messages });
            }
            req.body = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };
};
