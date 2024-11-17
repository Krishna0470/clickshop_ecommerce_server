const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Order = require('../db/models/Order');
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  getOrdersByUserId,
  updateIsDelivered,
  deleteOrder,
} = require('../controller/orderController');

router.post('/orders', authenticate, createOrder);
router.get('/orders', authenticate, getAllOrders);
router.get('/mine', authenticate, getUserOrders);
router.get('/total-orders', countTotalOrders);
router.get('/total-sales', calculateTotalSales);
router.get('/total-sales-by-date', calculateTotalSalesByDate);
router.get('/:id', authenticate, findOrderById);
router.put('/:id/pay', authenticate, markOrderAsPaid);
router.put('/:id/deliver', authenticate, markOrderAsDelivered);
router.get('/user/:userId/orders', authenticate, getOrdersByUserId);
router.put('/orders/:id/deliver',authenticate, updateIsDelivered);
router.delete('/deleteorders/:id',authenticate, deleteOrder);


module.exports = router;


