import type { Request, Response, NextFunction } from 'express';
import { PlanRepository } from '../repositories/plan.repo.js';

export const getPlans = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const plans = PlanRepository.findAll();
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        next(error);
    }
};
