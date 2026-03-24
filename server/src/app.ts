import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { initDb } from './db/index.js';
import userRoutes from './routes/user.routes.js';
import planRoutes from './routes/plan.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import healthRoutes from './routes/health.routes.js';
import { AppError } from './utils/AppError.js';
import { requestLogger } from './middlewares/logger.js';

const app: Express = express();

initDb();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 Error Intercepted:", err.message);
    if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
