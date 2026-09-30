import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';

const router = Router();
const controller = new UsersController();

router.get('/', controller.listUsers);
router.get('/:id', controller.getUser);
router.post('/', controller.createUser);

export default router;
