import { db } from '../db/index.js';

export class SubscriptionRepository {
    static findByIdempotencyKey(key: string) {
        return db.prepare('SELECT id, final_price, discount_amount FROM Subscriptions WHERE idempotency_key = ? LIMIT 1').get(key) as any;
    }

    static findByUserId(userId: number) {
        return db.prepare(`
            SELECT s.*, p.name as plan_name, c.code as coupon_code,
                   u.name as user_name, u.username, u.age, u.weight, u.height
            FROM Subscriptions s
            JOIN Plans p ON s.plan_id = p.id
            JOIN Users u ON s.user_id = u.id
            LEFT JOIN Coupons c ON s.coupon_id = c.id
            WHERE s.user_id = ? AND s.status = 'active'
            ORDER BY s.created_at DESC LIMIT 1
        `).get(userId) as any;
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
