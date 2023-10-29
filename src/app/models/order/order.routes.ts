import express from 'express';
import { OrderController } from './order.controller';
import { authorizeRole, isAuthenticated } from '../../middleware/auth';

const router = express.Router();

router.get(
  '/',
  isAuthenticated,
  authorizeRole('admin'),
  OrderController.getAllOrders,
);
router.post('/create-order', isAuthenticated, OrderController.createOrder);

export const OrderRouter = router;
