import type { UserRole } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        role: UserRole;
      };
      requestId?: string;
    }
  }
}

export {};
