const axios = require('axios');
const pino = require('pino');
const logger = pino({ name: 'alphaVantageService' });

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

async function getDailyStockData(symbol) {
  logger.info(`Fetching daily stock data for symbol: ${symbol}`);

  try {
    if (!API_KEY) {
      logger.error('ALPHA_VANTAGE_API_KEY environment variable is not set');
      throw new Error('Alpha Vantage API key is not configured');
    }

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: 'compact',
        apikey: API_KEY
      }
    });

    if (!response.data || !response.data['Time Series (Daily)']) {
      logger.error('Invalid response format from Alpha Vantage API', response.data);
      throw new Error('Invalid response from Alpha Vantage API');
    }

    const timeSeriesData = response.data['Time Series (Daily)'];

    const formattedData = Object.entries(timeSeriesData).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
      dividend: 0
    }));

    const last30Days = formattedData.slice(0, 30).reverse();

    logger.info(`Successfully fetched daily data for ${symbol}: ${last30Days.length} records`);

    return last30Days;

  } catch (error) {
    logger.error({
      err: error,
      symbol: symbol,
      msg: 'Error fetching daily stock data from Alpha Vantage'
    });

    if (error.response) {
      // Alpha Vantage specific error response
      logger.error('Alpha Vantage API error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }

    throw new Error(`Failed to fetch daily stock data: ${error.message}`);
  }
}

async function getWeeklyStockData(symbol) {
  logger.info(`Fetching weekly stock data for symbol: ${symbol}`);

  try {
    if (!API_KEY) {
      logger.error('ALPHA_VANTAGE_API_KEY environment variable is not set');
      throw new Error('Alpha Vantage API key is not configured');
    }

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_WEEKLY',
        symbol: symbol,
        apikey: API_KEY
      }
    });

    if (!response.data || !response.data['Weekly Time Series']) {
      logger.error('Invalid response format from Alpha Vantage API', response.data);
      throw new Error('Invalid response from Alpha Vantage API');
    }

    const timeSeriesData = response.data['Weekly Time Series'];

    const formattedData = Object.entries(timeSeriesData).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
      dividend: 0
    }));

    const last52Weeks = formattedData.slice(0, 52).reverse();

    logger.info(`Successfully fetched weekly data for ${symbol}: ${last52Weeks.length} records`);

    return last52Weeks;

  } catch (error) {
    logger.error({
      err: error,
      symbol: symbol,
      msg: 'Error fetching weekly stock data from Alpha Vantage'
    });

    if (error.response) {
      logger.error('Alpha Vantage API error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }

    throw new Error(`Failed to fetch weekly stock data: ${error.message}`);
  }
}

async function getMonthlyStockData(symbol) {
  logger.info(`Fetching monthly stock data for symbol: ${symbol}`);

  try {
    if (!API_KEY) {
      logger.error('ALPHA_VANTAGE_API_KEY environment variable is not set');
      throw new Error('Alpha Vantage API key is not configured');
    }

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_MONTHLY',
        symbol: symbol,
        apikey: API_KEY
      }
    });

    if (!response.data || !response.data['Monthly Time Series']) {
      logger.error('Invalid response format from Alpha Vantage API', response.data);
      throw new Error('Invalid response from Alpha Vantage API');
    }

    const timeSeriesData = response.data['Monthly Time Series'];

    const formattedData = Object.entries(timeSeriesData).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
      dividend: parseFloat(values['7. dividend amount'])
    }));

    const last24Months = formattedData.slice(0, 24).reverse();

    logger.info(`Successfully fetched monthly data for ${symbol}: ${last24Months.length} records`);

    return last24Months;

  } catch (error) {
    logger.error({
      err: error,
      symbol: symbol,
      msg: 'Error fetching monthly stock data from Alpha Vantage'
    });

    if (error.response) {
      logger.error('Alpha Vantage API error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }

    throw new Error(`Failed to fetch monthly stock data: ${error.message}`);
  }
}

module.exports = {
  getDailyStockData,
  getWeeklyStockData,
  getMonthlyStockData
};