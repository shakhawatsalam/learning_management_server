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
router.get('/refreshtoken', userController.updateAccessToken);
router.get('/me', isAuthenticated, userController.getSingleUser);
router.post('/social-auth', userController.socialAuth);

export const UserRoutes = router;
