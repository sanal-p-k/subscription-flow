import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.js';
import { loginOrSignup, userSchema } from '../controllers/user.controller.js';

const router = Router();

router.post('/profile', validateRequest(userSchema), loginOrSignup);

export default router;
