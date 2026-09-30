import crypto from 'crypto';
import type { RequestHandler } from 'express';
import type { UserRole } from '../models/user';

type ApiKeyEntry = {
  key: string;
  role: UserRole;
};

function getConfiguredApiKeys(): ApiKeyEntry[] {
  /*
   * Example:
   * AUTH_API_KEYS=admin-secret:ADMIN,member-secret:MEMBER
   *
   * In a real deployment these values should come from a secret manager,
   * not source control or a committed .env file.
   */
  const raw = process.env.AUTH_API_KEYS ?? '';

  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.lastIndexOf(':');
      if (separator <= 0) {
        return null;
      }

      const key = entry.slice(0, separator);
      const role = entry.slice(separator + 1);

      if (role !== 'ADMIN' && role !== 'MEMBER') {
        return null;
      }

      return { key, role };
    })
    .filter((entry): entry is ApiKeyEntry => entry !== null);
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export const authenticate: RequestHandler = (req, res, next) => {
  const configuredKeys = getConfiguredApiKeys();

  if (configuredKeys.length === 0) {
    res.status(500).json({
      error: {
        code: 'AUTH_NOT_CONFIGURED',
        message: 'Authentication is not configured',
      },
    });
    return;
  }

  const providedKey = req.header('x-api-key');

  if (!providedKey) {
    res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication required',
      },
    });
    return;
  }

  const credential = configuredKeys.find((entry) => safeEqual(entry.key, providedKey));

  if (!credential) {
    res.status(401).json({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      },
    });
    return;
  }

  req.auth = { role: credential.role };
  next();
};

export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action',
        },
      });
      return;
    }

    next();
  };
}
