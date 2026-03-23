import { db } from '../db/index.js';

export class SubscriptionRepository {
    static findByIdempotencyKey(key: string) {
        return db.prepare('SELECT id, final_price, discount_amount FROM Subscriptions WHERE idempotency_key = ? LIMIT 1').get(key) as any;
    }

    static create(sub: {
        userId: number,
        planId: number,
        couponId: number | null,
        originalPrice: number,
        discountPercent: number,
        discountAmount: number,
        finalPrice: number,
        idempotencyKey?: string
    }) {
        const insertSub = db.prepare(`
            INSERT INTO Subscriptions (
                user_id, plan_id, coupon_id, original_price, 
                discount_percent, discount_amount, final_price, status, idempotency_key
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)
        `);

        return insertSub.run(
            sub.userId, sub.planId, sub.couponId, sub.originalPrice,
            sub.discountPercent, sub.discountAmount, sub.finalPrice,
            sub.idempotencyKey || null
        ).lastInsertRowid;
    }
}
