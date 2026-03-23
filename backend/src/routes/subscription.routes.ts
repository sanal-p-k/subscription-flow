import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.js';
import { subscribe, subscriptionSchema } from '../controllers/subscription.controller.js';

const router = Router();

router.post('/subscribe', validateRequest(subscriptionSchema), subscribe);

export default router;
