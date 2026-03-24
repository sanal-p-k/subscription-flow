import { db } from '../db/index.js';

export class CouponRepository {
    static findByCode(code: string) {
        return db.prepare('SELECT id, discount_percent, max_uses, current_uses, is_active FROM Coupons WHERE code = ? COLLATE NOCASE LIMIT 1').get(code) as any;
    }

    static findAvailable() {
        return db.prepare('SELECT code, discount_percent FROM Coupons WHERE is_active = 1 AND current_uses < max_uses').all() as any[];
    }

    static incrementUsage(id: number): boolean {
        const updateResult = db.prepare(`
            UPDATE Coupons 
            SET current_uses = current_uses + 1 
            WHERE id = ? AND current_uses < max_uses
        `).run(id);

        return updateResult.changes > 0;
    }
}
