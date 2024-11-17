const express = require('express');
const router = express.Router();
const productControllers =require('../controller/product.js');

const accessControl = require ("../utils/access-control").accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.post("/addproduct", setAccessControl('1,2'), productControllers.createProduct);
router.get("/getAllProduct",setAccessControl('1,2'),productControllers.getAllProduct);
router.get("/getNewProducts",setAccessControl('1,2'),productControllers.getNewProducts);
router.get("/specialProducts",setAccessControl('1,2'),productControllers.getProductsFromDistinctCategory);
router.get("/getTopRated",setAccessControl('1,2'),productControllers.getTopRating);
router.get("/getProduct/:id",setAccessControl('*'),productControllers.getProductById);
router.put('/editProduct/:id',setAccessControl('*'),productControllers.updateProdect);
router.delete('/deleteproduct/:id', setAccessControl('*'), productControllers.deleteProduct);
router.get("/getNewProduct",productControllers.getNewProduct);
router.get("/specialProduct",productControllers.getspecialProducts);
router.get("/getTopRatedd",productControllers.getTopRatingg);
router.post('/product/:id/review', productControllers.addReview);
router.get('/product/:id/reviews', productControllers.getProductReviews);
router.get('/checkPurchase/:userId/:productId', setAccessControl('*'), productControllers.checkPurchase);  
router.put("/updateProductStock", setAccessControl('*'), productControllers.updateProductStock);
router.patch('/blockproduct/:id', setAccessControl('1,2'), productControllers.blockProduct);
router.patch('/unblockproduct/:id', setAccessControl('1,2'), productControllers.unblockProduct);



module.exports = router;
