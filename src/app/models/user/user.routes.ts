import express from 'express';
import { userController } from './user.controller';
import { authorizeRole, isAuthenticated } from '../../middleware/auth';

const router = express.Router();

router.post('/registration', userController.registrationUser);
router.post('/activate-user', userController.activateUser);
router.post('/login', userController.logInUser);
router.get(
  '/logout',
  isAuthenticated,
  authorizeRole('admin'),
  userController.logoutUser,
);

export const UserRoutes = router;
