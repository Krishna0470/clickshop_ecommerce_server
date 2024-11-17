// routes/cart.js
const express = require ("express");
const accessControl = require ("../utils/access-control.js").accessControl;
const cartControllers = require ('../controller/favorite.js');

const router = express.Router();

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.post('/add-to-favorite', setAccessControl('1,2'), cartControllers.addToFavorite);
router.get('/get-favorite', setAccessControl('1,2'), cartControllers.getFavorite);
// Add more cart-related routes as needed

module.exports =router;
