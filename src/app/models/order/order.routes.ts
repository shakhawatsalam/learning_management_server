import express from 'express';
import { OrderController } from './order.controller';
import { isAuthenticated } from '../../middleware/auth';

const router = express.Router();

router.post('/create-order', isAuthenticated, OrderController.createOrder);

export const OrderRouter = router;
