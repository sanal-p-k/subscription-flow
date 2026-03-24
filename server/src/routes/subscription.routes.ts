import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.js';
import { subscribe, subscriptionSchema, getUserSubscription } from '../controllers/subscription.controller.js';

const router = Router();

router.post('/subscribe', validateRequest(subscriptionSchema), subscribe);
router.get('/user/:userId', getUserSubscription);

export default router;
