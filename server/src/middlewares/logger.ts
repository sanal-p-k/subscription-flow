import type { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();
    const reqStartStr = new Date().toISOString();

    res.on('finish', () => {
        const duration = performance.now() - start;
        console.log(`[${reqStartStr}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration.toFixed(3)}ms`);
    });

    next();
};
