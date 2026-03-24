import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.js';
import { createUser, getUserByUsername, userSchema } from '../controllers/user.controller.js';

const router = Router();

router.post('/', validateRequest(userSchema), createUser);
router.get('/:username', getUserByUsername);

export default router;
