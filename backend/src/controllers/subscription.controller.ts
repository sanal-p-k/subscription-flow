import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SubscriptionService } from '../services/subscription.service.js';

export const subscriptionSchema = z.object({
    user_id: z.number().int().positive('Valid user_id is required'),
    plan_id: z.number().int().positive('Valid plan_id is required'),
    coupon_code: z.string().optional(),
    idempotency_key: z.string().optional()
});

export const subscribe = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { user_id, plan_id, coupon_code, idempotency_key } = req.body;
        const result = SubscriptionService.subscribe(user_id, plan_id, coupon_code, idempotency_key);

        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};
