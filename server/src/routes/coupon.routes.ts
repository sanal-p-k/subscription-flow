import { Router } from 'express';
import { validateCoupon, getAvailableCoupons } from '../controllers/coupon.controller.js';

const router = Router();

router.get('/', getAvailableCoupons);
router.post('/validate', validateCoupon);

export default router;
