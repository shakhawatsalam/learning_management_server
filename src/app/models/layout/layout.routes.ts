import express from 'express';
import { authorizeRole, isAuthenticated } from '../../middleware/auth';
import { layoutController } from './layout.controller';

const router = express.Router();

router.post(
  '/create-layout',
  isAuthenticated,
  authorizeRole('admin'),
  layoutController.createLayout,
);
router.put(
  '/update-layout',
  isAuthenticated,
  authorizeRole('admin'),
  layoutController.editLayout,
);
router.get('/get-layout', layoutController.getLayoutByType);

export const LayoutRoutes = router;
