
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
// const accessControl = require ("../utils/access-control").accessControl;

// const setAccessControl = (access_type) => {
//     return (req, res, next) => {
//         accessControl(access_type, req, res, next)
//     }
// };

router.post('/users',userController.createUser);
router.get('/getData',userController.getUserData);
router.get('/getData/:id',userController.getSingleUserData);
router.put('/editData/:id',userController.updateUser);
router.delete('/deleteData/:id', userController.deleteUser);

module.exports = router;

