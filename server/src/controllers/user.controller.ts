import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserRepository } from '../repositories/user.repo.js';

export const userSchema = z.object({
    username: z.string().min(3),
    name: z.string().min(2),
    age: z.number().int().min(0).max(120).optional(),
    weight: z.number().positive().optional(),
    height: z.number().positive().optional()
});

export const createUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { username, name, age, weight, height } = req.body;
        let user = UserRepository.findByUsername(username);

        if (!user) {
            user = UserRepository.create({ username, name, age, weight, height });
        }

        res.status(201).json({ success: true, data: { user } });
    } catch (error) {
        next(error);
    }
};

export const getUserByUsername = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const username = req.params.username as string;
        const user = UserRepository.findByUsername(username);

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, data: { user } });
    } catch (error) {
        next(error);
    }
};
