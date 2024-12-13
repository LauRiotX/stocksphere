const express = require('express');
const StockController = require('../controllers/stocksController');
const { requireUser } = require('./middleware/auth');

const router = express.Router();

router.get('/favorites', requireUser, StockController.getFavoriteStocks);
router.post('/favorites/add', requireUser, StockController.addToFavorites);
router.delete('/favorites/remove', requireUser, StockController.removeFromFavorites);
router.get('/daily/:symbol', requireUser, StockController.getDailyStockData);

module.exports = router;