const Order = require('../db/models/Order');
const Product = require('../db/models/Product');
const mongoose = require('mongoose');
const User = require('../db/models/users');
const  sendEmail  = require ("../utils/send-email").sendEmail;

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 2000 ? 0 : 20;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    console.log("Order Items from client:", orderItems);

    for (let i = 0; i < orderItems.length; i++) {
      if (!orderItems[i]._id) {
        return res.status(400).json({ error: `Order item at index ${i} is missing _id` });
      }
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    console.log("Items from DB:", itemsFromDB);

    if (itemsFromDB.length !== orderItems.length) {
      return res.status(404).json({ error: "One or more products not found" });
    }

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        name: matchingItemFromDB.name,
        qty: itemFromClient.qty,
        image: matchingItemFromDB.productImages[0],
        price: matchingItemFromDB.price,
        product: matchingItemFromDB._id,
      };
    });

    console.log("Processed order items:", dbOrderItems);

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: req.body.isPaid || false, 
    });

    const createdOrder = await order.save();

    // Update stock for each product and check if any product's stock reaches zero
    const bulkOperations = [];
    for (const item of orderItems) {
      const product = itemsFromDB.find(p => p._id.toString() === item._id);
      const newStock = product.stock - item.qty;

      bulkOperations.push({
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { stock: -item.qty } },
        },
      });

      if (newStock <= 0) {
        // Send out-of-stock notification
        const user = await User.findById(product.user);
        if (user) {
          const userEmail = user.email;
          const subject = `Product ${product.name} is now out of stock.`;
          const content = `<p>The product <strong>${product.name}</strong> is now out of stock in Click Shop.</p>`;
          await sendEmail([userEmail], subject, content);
        } else {
          console.log('User not found');
        }
      }
    }

    await Product.bulkWrite(bulkOperations);

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id username');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: { isPaid: true },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract the user ID from the request params
    const orders = await Order.find({ user: userId }); // Query orders by user ID
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIsDelivered = async (req, res) => {
  const { id } = req.params; // Extract the order ID from the request parameters

  try {
    const result = await Order.updateOne({ _id: id }, { $set: { isDelivered: true } });
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Order not found or already delivered' });
    }
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;  // Extract order ID from the request parameters
    
    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(id);

    // If the order does not exist, return a 404 error
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Respond with a success message if the order was deleted successfully
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error('Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
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
};
