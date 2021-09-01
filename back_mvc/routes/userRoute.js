var express = require('express');
var userController=require('../controllers/userController');
var router = express.Router();

router.get('/all', userController.all);
router.get('/user', userController.user);
router.get('/admin', userController.admin);
router.post('/isAdmin', userController.isAdmin);
router.post('/getName', userController.getName);
router.post('/all', userController.getAll);
router.post('/isEmailExist', userController.isEmailExist);

module.exports = router;
