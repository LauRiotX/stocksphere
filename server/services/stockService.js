const User = require('../models/User');
const logger = require('pino')();

class StockService {
  static async getFavoriteStocks(userId) {
    console.log(`StockService.getFavoriteStocks called with userId: ${userId}`);
    try {
      logger.info(`Fetching favorite stocks for user ${userId}`);

      const user = await User.findById(userId);
      if (!user) {
        console.log(`User ${userId} not found in database`);
        return []; // Return an empty array instead of throwing an error
      }

      console.log(`Found user ${userId} with ${user.favoriteStocks?.length || 0} favorite stocks`);
      logger.info(`Successfully retrieved favorite stocks for user ${userId}`);
      return user.favoriteStocks || [];

    } catch (error) {
      console.error(`Error in StockService.getFavoriteStocks:`, error);
      logger.error({
        msg: `Error fetching favorite stocks for user ${userId}`,
        error: error.message,
        stack: error.stack
      });
      throw new Error(`Error fetching favorite stocks: ${error.message}`);
    }
  }

  static async addFavoriteStock(userId, stockSymbol) {
    try {
      logger.info(`Adding stock ${stockSymbol} to favorites for user ${userId}`);

      const user = await User.findById(userId);
      if (!user) {
        logger.error(`User ${userId} not found when adding favorite stock`);
        throw new Error('User not found');
      }

      // Initialize favoriteStocks array if it doesn't exist
      if (!user.favoriteStocks) {
        user.favoriteStocks = [];
      }

      // Check if stock is already in favorites
      if (user.favoriteStocks.includes(stockSymbol)) {
        logger.info(`Stock ${stockSymbol} already in favorites for user ${userId}`);
        return user.favoriteStocks;
      }

      // Add stock to favorites
      user.favoriteStocks.push(stockSymbol);
      await user.save();

      logger.info(`Successfully added stock ${stockSymbol} to favorites for user ${userId}`);
      return user.favoriteStocks;

    } catch (error) {
      logger.error({
        msg: `Error adding favorite stock ${stockSymbol} for user ${userId}`,
        error: error.message,
        stack: error.stack
      });
      throw new Error(`Error adding favorite stock: ${error.message}`);
    }
  }

  static async removeFavoriteStock(userId, stockSymbol) {
    try {
      logger.info(`Removing stock ${stockSymbol} from favorites for user ${userId}`);

      const user = await User.findById(userId);
      if (!user) {
        logger.error(`User ${userId} not found when removing favorite stock`);
        throw new Error('User not found');
      }

      // Remove stock from favorites if it exists
      if (user.favoriteStocks) {
        user.favoriteStocks = user.favoriteStocks.filter(symbol => symbol !== stockSymbol);
        await user.save();
      }

      logger.info(`Successfully removed stock ${stockSymbol} from favorites for user ${userId}`);
      return user.favoriteStocks;

    } catch (error) {
      logger.error({
        msg: `Error removing favorite stock ${stockSymbol} for user ${userId}`,
        error: error.message,
        stack: error.stack
      });
      throw new Error(`Error removing favorite stock: ${error.message}`);
    }
  }
}

module.exports = StockService;