var express = require('express');
var crudController=require('../controllers/transaction-controller');
var router = express.Router();

router.post('/balance', crudController.balance );
router.post('/all', crudController.all );
router.post('/getFromId', crudController.getFromId );
router.post('/makePayment', crudController.makePayment );
// router.get('/form', crudController.crudForm );
// router.post('/create', crudController.createCrud);
// router.get('/fetch', crudController.fetchCrud);
// router.get('/edit/:id', crudController.editCrud);
// router.post('/edit/:id', crudController.UpdateCrud);
// router.get('/delete/:id', crudController.deleteCrud);

module.exports = router;
