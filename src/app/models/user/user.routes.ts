import express from 'express';
import { userController } from './user.controller';
import { authorizeRole, isAuthenticated } from '../../middleware/auth';

const router = express.Router();
router.get(
  '/',
  isAuthenticated,
  authorizeRole('admin'),
  userController.getAllUser,
);
router.post('/registration', userController.registrationUser);
router.post('/activate-user', userController.activateUser);
router.post('/login', userController.logInUser);
router.get('/logout', isAuthenticated, userController.logoutUser);
router.get('/refreshtoken', userController.updateAccessToken);
router.get('/me', isAuthenticated, userController.getSingleUser);
router.post('/social-auth', userController.socialAuth);
router.put('/update-user-info', isAuthenticated, userController.updateUserInfo);
router.put(
  '/update-user-password',
  isAuthenticated,
  userController.updatePassword,
);
router.put(
  '/update-user-avatar',
  isAuthenticated,
  userController.updateProfilePicture,
);
router.put(
  '/update-user-role',
  isAuthenticated,
  authorizeRole('admin'),
  userController.updateUserRole,
);
router.delete(
  '/delete-user/:id',
  isAuthenticated,
  authorizeRole('admin'),
  userController.deleteUser,
);

export const UserRoutes = router;
