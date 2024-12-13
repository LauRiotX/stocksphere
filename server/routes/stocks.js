const express = require('express');
const StockController = require('../controllers/stocksController');
const { requireUser } = require('./middleware/auth');

const router = express.Router();

router.get('/favorites', requireUser, (req, res) => StockController.getFavoriteStocks(req, res, req.t));
router.post('/favorites/add', requireUser, (req, res) => StockController.addToFavorites(req, res, req.t));
router.delete('/favorites/remove', requireUser, (req, res) => StockController.removeFromFavorites(req, res, req.t));
router.get('/daily/:symbol', requireUser, (req, res) => StockController.getDailyStockData(req, res, req.t));
router.get('/weekly/:symbol', requireUser, (req, res) => StockController.getWeeklyStockData(req, res, req.t));
router.get('/monthly/:symbol', requireUser, (req, res) => StockController.getMonthlyStockData(req, res, req.t));

module.exports = router;