import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

router.post('/registration', userController.registrationUser);
router.post('/activate-user', userController.activateUser);

export const UserRoutes = router;
