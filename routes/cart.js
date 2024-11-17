// routes/cart.js
const express = require ("express");
const accessControl = require ("../utils/access-control").accessControl;
const cartControllers = require ('../controller/cart.js');

const router = express.Router();

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.post('/add-to-cart', setAccessControl('1,2'), cartControllers.addToCart);
router.get('/get-cart', setAccessControl('1,2'), cartControllers.getCart);
// Add more cart-related routes as needed

module.exports =router;
