import { CouponRepository } from '../repositories/coupon.repo.js';
import { AppError } from '../utils/AppError.js';

export class CouponService {
    static validate(code: string) {
        const coupon = CouponRepository.findByCode(code);

        if (!coupon) throw new AppError('Coupon not found', 404);
        if (coupon.is_active === 0) throw new AppError('Coupon is inactive', 400);
        if (coupon.current_uses >= coupon.max_uses) throw new AppError('Coupon usage limit reached', 400);

        return { discount_percent: coupon.discount_percent };
    }
}
