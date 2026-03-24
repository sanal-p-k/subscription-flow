import { Router } from 'express';
import type { Request, Response } from 'express';
import { PlanRepository } from '../repositories/plan.repo.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    try {
        const plans = PlanRepository.findAll();
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving plans' });
    }
});

router.get('/:id', (req: Request, res: Response): any => {
    try {
        const plan = PlanRepository.findById(parseInt(req.params.id as string));
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving plan' });
    }
});

export default router;
