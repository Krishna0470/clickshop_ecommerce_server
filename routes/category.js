const express = require('express');
const router = express.Router();
const accessControl = require("../utils/access-control.js").accessControl;
const categoryControllers = require('../controller/category');

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next);
    };
};

router.post('/categories', setAccessControl('1,2'), categoryControllers.createCategory);
router.get('/categories', setAccessControl('1,2'), categoryControllers.getCategories);
router.put('/category/:id', setAccessControl('1,2'), categoryControllers.updateCategory);
router.delete('/category/:id', setAccessControl('1,2'), categoryControllers.deleteCategory);

module.exports = router;
