import crypto from 'crypto';
import express from 'express';
import usersRouter from './routes/users.routes';
import { errorHandler } from './middleware/error-handler';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use((req, res, next) => {
    const requestId = req.header('x-request-id') || crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  });

  // Basic security headers for an API without adding another runtime dependency.
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    next();
  });

  // Limit JSON payload size to reduce accidental/abusive large requests.
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/v1/users', usersRouter);

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  app.use(errorHandler);

  return app;
}
