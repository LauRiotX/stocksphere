import api from './api';

// Get Daily Stock Data
// GET /api/stocks/daily
// Response: { data: Array<{ date: string, open: number, high: number, low: number, close: number, volume: number, dividend: number }> }
export const getDailyStockData = (symbol: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate 30 days of mock data
      const data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const basePrice = 100 + Math.random() * 50;
        return {
          date: date.toISOString().split('T')[0],
          open: basePrice + Math.random() * 5,
          high: basePrice + Math.random() * 10,
          low: basePrice - Math.random() * 5,
          close: basePrice + Math.random() * 3,
          volume: Math.floor(Math.random() * 1000000) + 500000,
          dividend: Math.random() < 0.1 ? 0.5 + Math.random() : 0
        };
      }).reverse();
      resolve({ data });
    }, 500);
  });
};

// Get Weekly Stock Data
// GET /api/stocks/weekly
// Response: { data: Array<{ date: string, open: number, high: number, low: number, close: number, volume: number, dividend: number }> }
export const getWeeklyStockData = (symbol: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate 52 weeks of mock data
      const data = Array.from({ length: 52 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        const basePrice = 100 + Math.random() * 50;
        return {
          date: `${date.getFullYear()}-W${Math.floor(i / 52 * 100)}`,
          open: basePrice + Math.random() * 5,
          high: basePrice + Math.random() * 10,
          low: basePrice - Math.random() * 5,
          close: basePrice + Math.random() * 3,
          volume: Math.floor(Math.random() * 5000000) + 2000000,
          dividend: Math.random() < 0.2 ? 0.5 + Math.random() : 0
        };
      }).reverse();
      resolve({ data });
    }, 500);
  });
};

// Get Monthly Stock Data
// GET /api/stocks/monthly
// Response: { data: Array<{ date: string, open: number, high: number, low: number, close: number, volume: number, dividend: number }> }
export const getMonthlyStockData = (symbol: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate 24 months of mock data
      const data = Array.from({ length: 24 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const basePrice = 100 + Math.random() * 50;
        return {
          date: date.toISOString().slice(0, 7),
          open: basePrice + Math.random() * 5,
          high: basePrice + Math.random() * 10,
          low: basePrice - Math.random() * 5,
          close: basePrice + Math.random() * 3,
          volume: Math.floor(Math.random() * 20000000) + 8000000,
          dividend: Math.random() < 0.3 ? 0.5 + Math.random() : 0
        };
      }).reverse();
      resolve({ data });
    }, 500);
  });
};

// Get User's Favorite Stocks
// GET /api/stocks/favorites
// Response: { stocks: Array<string> }
export const getFavoriteStocks = async () => {
  try {
    const response = await api.get('/api/stocks/favorites');
    console.log('Fetched favorite stocks:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite stocks:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Add Stock to Favorites
// POST /api/stocks/favorites/add
// Request: { symbol: string }
// Response: { stocks: string[], message: string }
export const addToFavorites = async (symbol: string) => {
  try {
    console.log('Adding stock to favorites:', symbol);
    const response = await api.post('/api/stocks/favorites/add', { symbol });
    console.log('Successfully added stock to favorites:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding stock to favorites:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Remove Stock from Favorites
// DELETE /api/stocks/favorites/remove
// Request: { symbol: string }
// Response: { stocks: string[], message: string }
export const removeFromFavorites = async (symbol: string) => {
  try {
    console.log('Removing stock from favorites:', symbol);
    const response = await api.delete('/api/stocks/favorites/remove', { data: { symbol } });
    console.log('Successfully removed stock from favorites:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing stock from favorites:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};