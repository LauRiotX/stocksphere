const StockService = require('../services/stockService');

class StockController {
  static async getFavoriteStocks(req, res) {
    console.log('StockController.getFavoriteStocks called');
    console.log('User in request:', req.user);
    try {
      const favoriteStocks = await StockService.getFavoriteStocks(req.user.id);
      console.log(`Retrieved ${favoriteStocks.length} favorite stocks for user ${req.user.id}`);
      res.json({ stocks: favoriteStocks });
    } catch (error) {
      console.error('Error getting favorite stocks:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = StockController;