import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

router.post('/registration', userController.registrationUser);

export const UserRoutes = router;
