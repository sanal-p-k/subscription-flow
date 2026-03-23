import { db } from '../db/index.js';
import { PlanRepository } from '../repositories/plan.repo.js';
import { CouponRepository } from '../repositories/coupon.repo.js';
import { SubscriptionRepository } from '../repositories/subscription.repo.js';
import { calculatePrice } from '../utils/price.util.js';
import { AppError } from '../utils/AppError.js';

export class SubscriptionService {
    static subscribe(userId: number, planId: number, couponCode?: string, idempotencyKey?: string) {
        return db.transaction(() => {
            if (idempotencyKey) {
                const existing = SubscriptionRepository.findByIdempotencyKey(idempotencyKey);
                if (existing) {
                    return {
                        subscription_id: existing.id,
                        originalPrice: existing.final_price + existing.discount_amount,
                        discountAmount: existing.discount_amount,
                        finalPrice: existing.final_price,
                        idempotent: true
                    };
                }
            }

            const plan = PlanRepository.findById(planId);
            if (!plan) throw new AppError('Plan not found', 404);

            let percentForInsertion = 0;
            let couponId: number | null = null;

            if (couponCode) {
                const coupon = CouponRepository.findByCode(couponCode);

                if (!coupon) throw new AppError('Invalid coupon code', 404);
                if (!coupon.is_active) throw new AppError('Coupon is no longer active', 400);
                if (coupon.current_uses >= coupon.max_uses) throw new AppError('Coupon usage limit reached', 409);

                const incremented = CouponRepository.incrementUsage(coupon.id);
                if (!incremented) throw new AppError('Coupon usage limit reached', 409);

                percentForInsertion = coupon.discount_percent;
                couponId = coupon.id;
            }

            const priceDetails = calculatePrice(plan.price, percentForInsertion);

            const subscriptionId = SubscriptionRepository.create({
                userId,
                planId,
                couponId,
                originalPrice: priceDetails.originalPrice,
                discountPercent: percentForInsertion,
                discountAmount: priceDetails.discountAmount,
                finalPrice: priceDetails.finalPrice,
                idempotencyKey
            });

            return {
                subscription_id: subscriptionId,
                ...priceDetails,
                idempotent: false
            };
        })();
    }
}
