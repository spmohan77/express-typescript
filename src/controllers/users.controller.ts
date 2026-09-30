import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { UsersRepository } from '../repositories/users.repository';
import { createServiceLogger } from '../utils/logger';
import { createUserSchema, userIdSchema } from '../utils/validation';

export class UsersController {
  private readonly logger = createServiceLogger('UsersController');
  private readonly repo = new UsersRepository();

  listUsers = (_req: Request, res: Response) => {
    res.status(200).json(this.repo.getAll());
  };

  getUser = (req: Request, res: Response) => {
    const parsedId = userIdSchema.safeParse(req.params.id);

    if (!parsedId.success) {
      res.status(400).json({
        error: {
          code: 'INVALID_USER_ID',
          message: 'id must be a positive integer',
        },
      });
      return;
    }

    const user = this.repo.findById(parsedId.data);

    if (!user) {
      res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
      return;
    }

    res.status(200).json(user);
  };

  createUser = (req: Request, res: Response) => {
    const parsedBody = createUserSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: parsedBody.error.flatten().fieldErrors,
        },
      });
      return;
    }

    try {
      const user = this.repo.create(parsedBody.data);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'USER_EMAIL_EXISTS') {
        res.status(409).json({
          error: {
            code: 'USER_EMAIL_EXISTS',
            message: 'A user with this email already exists',
          },
        });
        return;
      }

      this.logger.error({ err: error }, 'failed to create user');
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
        },
      });
    }
  };
}
