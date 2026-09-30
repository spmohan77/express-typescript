import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const controller = new UsersController();

// Authentication applies to every users endpoint.
router.use(authenticate);

router.get('/', controller.listUsers);
router.get('/:id', controller.getUser);

// Creating users is an administrative operation.
router.post('/', requireRole('ADMIN'), controller.createUser);

export default router;
