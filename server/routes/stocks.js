const express = require('express');
const StockController = require('../controllers/stocksController');
const { requireUser } = require('./middleware/auth');

const router = express.Router();

router.get('/favorites', (req, res, next) => {
  console.log('Entering /favorites route');
  next();
}, requireUser, StockController.getFavoriteStocks);

module.exports = router;