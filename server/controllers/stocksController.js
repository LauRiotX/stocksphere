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

  static async addToFavorites(req, res) {
    console.log('StockController.addToFavorites called');
    console.log('User in request:', req.user);
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }
    try {
      const updatedFavorites = await StockService.addFavoriteStock(req.user.id, symbol);
      console.log(`Added ${symbol} to favorites for user ${req.user.id}`);
      res.json({ stocks: updatedFavorites, message: 'Stock added to favorites successfully' });
    } catch (error) {
      console.error('Error adding stock to favorites:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = StockController;