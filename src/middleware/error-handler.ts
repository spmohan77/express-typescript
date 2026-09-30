import type { ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = req.requestId;

  logger.error(
    {
      err,
      requestId,
      method: req.method,
      path: req.path,
    },
    'unhandled request error',
  );

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      requestId,
    },
  });
};
