const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController.js');

router.get('/', (req, res, next) => {
    res.send('succesfully connected to api');
})


router.post('/filter/new', dbController.createItem);

router.delete('/filter/reset/all', dbController.deleteAll);

router.get('/shop/data/all', dbController.getAll);

router.get('/shop/data/:id', dbController.queryShop);

module.exports = router;