const StockService = require('../services/stockService');
const AlphaVantageService = require('../services/alphaVantageService');

class StockController {
  static async getFavoriteStocks(req, res, t) {
    console.log('StockController.getFavoriteStocks called');
    console.log('User in request:', req.user);
    try {
      const favoriteStocks = await StockService.getFavoriteStocks(req.user.id);
      console.log(`Retrieved ${favoriteStocks.length} favorite stocks for user ${req.user.id}`);
      res.json({ stocks: favoriteStocks });
    } catch (error) {
      console.error('Error getting favorite stocks:', error);
      res.status(500).json({ message: t('internalServerError') });
    }
  }

  static async addToFavorites(req, res, t) {
    console.log('StockController.addToFavorites called');
    console.log('User in request:', req.user);
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ message: t('symbolRequired') });
    }
    try {
      const updatedFavorites = await StockService.addFavoriteStock(req.user.id, symbol);
      console.log(`Added ${symbol} to favorites for user ${req.user.id}`);
      res.json({ stocks: updatedFavorites, message: t('stockAddedToFavorites') });
    } catch (error) {
      console.error('Error adding stock to favorites:', error);
      res.status(500).json({ message: t('internalServerError') });
    }
  }

  static async removeFromFavorites(req, res, t) {
    console.log('StockController.removeFromFavorites called');
    console.log('User in request:', req.user);
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ message: t('symbolRequired') });
    }
    try {
      const updatedFavorites = await StockService.removeFavoriteStock(req.user.id, symbol);
      console.log(`Removed ${symbol} from favorites for user ${req.user.id}`);
      res.json({ stocks: updatedFavorites, message: t('stockRemovedFromFavorites') });
    } catch (error) {
      console.error('Error removing stock from favorites:', error);
      res.status(500).json({ message: t('internalServerError') });
    }
  }

  static async getDailyStockData(req, res, t) {
    console.log('StockController.getDailyStockData called');
    try {
      const { symbol } = req.params;
      if (!symbol) {
        console.error('Missing symbol parameter');
        return res.status(400).json({ message: t('symbolRequired') });
      }
      console.log(`Fetching daily stock data for symbol: ${symbol}`);
      const data = await AlphaVantageService.getDailyStockData(symbol);
      console.log(`Successfully retrieved daily stock data for ${symbol}`);
      res.json({ data });
    } catch (error) {
      console.error('Error in getDailyStockData:', error);
      res.status(500).json({ message: t('internalServerError') });
    }
  }

  static async getWeeklyStockData(req, res, t) {
    console.log('StockController.getWeeklyStockData called');
    try {
      const { symbol } = req.params;
      if (!symbol) {
        console.error('Missing symbol parameter');
        return res.status(400).json({ message: t('symbolRequired') });
      }
      console.log(`Fetching weekly stock data for symbol: ${symbol}`);
      const data = await AlphaVantageService.getWeeklyStockData(symbol);
      console.log(`Successfully retrieved weekly stock data for ${symbol}`);
      res.json({ data });
    } catch (error) {
      console.error('Error in getWeeklyStockData:', error);
      res.status(500).json({ message: t('internalServerError') });
    }
  }

  static async getMonthlyStockData(req, res, t) {
    console.log('StockController.getMonthlyStockData called');
    try {
      const { symbol } = req.params;
      if (!symbol) {
        console.error('Missing symbol parameter');
        return res.status(400).json({ message: t('symbolRequired') });
      }
      console.log(`Fetching monthly stock data for symbol: ${symbol}`);
      const data = await AlphaVantageService.getMonthlyStockData(symbol);
      console.log(`Successfully retrieved monthly stock data for ${symbol}`);
      res.json({ data });
    } catch (error) {
      console.error('Error in getMonthlyStockData:', error);
      res.status(500).json({ message: t('internalServerError') });
    }
  }
}

module.exports = StockController;