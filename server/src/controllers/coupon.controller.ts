import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { CouponRepository } from '../repositories/coupon.repo.js';

export const validateCoupon = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { code } = req.body;

        if (!code || typeof code !== 'string') {
            res.status(400).json({ success: false, message: 'Invalid coupon code format' });
            return;
        }

        const coupon = CouponRepository.findByCode(code.toUpperCase());

        if (!coupon || !coupon.is_active) {
            res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
            return;
        }

        if (coupon.current_uses >= coupon.max_uses) {
            res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                valid: true,
                discount_percent: coupon.discount_percent
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableCoupons = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const coupons = CouponRepository.findAvailable();
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        next(error);
    }
};
