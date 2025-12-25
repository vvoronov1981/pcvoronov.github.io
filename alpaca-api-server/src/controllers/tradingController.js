const { getAlpacaClient } = require('../config/alpaca');

class TradingController {
  /**
   * Get account information
   */
  async getAccount(req, res) {
    try {
      const alpaca = getAlpacaClient();
      const account = await alpaca.getAccount();
      
      res.json({
        success: true,
        data: account
      });
    } catch (error) {
      console.error('Get account error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch account information',
        message: error.message
      });
    }
  }

  /**
   * Get all positions
   */
  async getPositions(req, res) {
    try {
      const alpaca = getAlpacaClient();
      const positions = await alpaca.getPositions();
      
      res.json({
        success: true,
        data: positions
      });
    } catch (error) {
      console.error('Get positions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch positions',
        message: error.message
      });
    }
  }

  /**
   * Get a specific position
   */
  async getPosition(req, res) {
    try {
      const { symbol } = req.params;
      const alpaca = getAlpacaClient();
      const position = await alpaca.getPosition(symbol);
      
      res.json({
        success: true,
        data: position
      });
    } catch (error) {
      console.error('Get position error:', error);
      res.status(404).json({
        success: false,
        error: 'Position not found',
        message: error.message
      });
    }
  }

  /**
   * Close a position
   */
  async closePosition(req, res) {
    try {
      const { symbol } = req.params;
      const alpaca = getAlpacaClient();
      const result = await alpaca.closePosition(symbol);
      
      res.json({
        success: true,
        data: result,
        message: `Position ${symbol} closed successfully`
      });
    } catch (error) {
      console.error('Close position error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to close position',
        message: error.message
      });
    }
  }

  /**
   * Get all orders
   */
  async getOrders(req, res) {
    try {
      const alpaca = getAlpacaClient();
      const { status, limit, direction } = req.query;
      
      const options = {
        status: status || 'all',
        limit: limit ? parseInt(limit) : 50,
        direction: direction || 'desc'
      };
      
      const orders = await alpaca.getOrders(options);
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch orders',
        message: error.message
      });
    }
  }

  /**
   * Get a specific order by ID
   */
  async getOrder(req, res) {
    try {
      const { orderId } = req.params;
      const alpaca = getAlpacaClient();
      const order = await alpaca.getOrder(orderId);
      
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(404).json({
        success: false,
        error: 'Order not found',
        message: error.message
      });
    }
  }

  /**
   * Create a new order
   */
  async createOrder(req, res) {
    try {
      const alpaca = getAlpacaClient();
      const { symbol, qty, side, type, time_in_force, limit_price, stop_price } = req.body;

      // Validate required fields
      if (!symbol || !qty || !side || !type || !time_in_force) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['symbol', 'qty', 'side', 'type', 'time_in_force']
        });
      }

      // Build order options
      const orderOptions = {
        symbol,
        qty,
        side,
        type,
        time_in_force
      };

      if (limit_price) orderOptions.limit_price = limit_price;
      if (stop_price) orderOptions.stop_price = stop_price;

      const order = await alpaca.createOrder(orderOptions);
      
      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create order',
        message: error.message
      });
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const alpaca = getAlpacaClient();
      await alpaca.cancelOrder(orderId);
      
      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel order',
        message: error.message
      });
    }
  }

  /**
   * Cancel all orders
   */
  async cancelAllOrders(req, res) {
    try {
      const alpaca = getAlpacaClient();
      const result = await alpaca.cancelAllOrders();
      
      res.json({
        success: true,
        data: result,
        message: 'All orders cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel all orders error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel all orders',
        message: error.message
      });
    }
  }

  /**
   * Get market quotes for a symbol
   */
  async getQuote(req, res) {
    try {
      const { symbol } = req.params;
      const alpaca = getAlpacaClient();
      const quote = await alpaca.getLatestQuote(symbol);
      
      res.json({
        success: true,
        data: quote
      });
    } catch (error) {
      console.error('Get quote error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch quote',
        message: error.message
      });
    }
  }

  /**
   * Get latest trade for a symbol
   */
  async getLatestTrade(req, res) {
    try {
      const { symbol } = req.params;
      const alpaca = getAlpacaClient();
      const trade = await alpaca.getLatestTrade(symbol);
      
      res.json({
        success: true,
        data: trade
      });
    } catch (error) {
      console.error('Get latest trade error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch latest trade',
        message: error.message
      });
    }
  }

  /**
   * Get bars (candlestick data) for a symbol
   */
  async getBars(req, res) {
    try {
      const { symbol } = req.params;
      const { timeframe, start, end, limit } = req.query;
      const alpaca = getAlpacaClient();
      
      const options = {
        limit: limit ? parseInt(limit) : 100
      };
      
      if (start) options.start = start;
      if (end) options.end = end;
      
      const bars = await alpaca.getBarsV2(
        symbol,
        timeframe || '1Day',
        options
      );
      
      const barsArray = [];
      for await (let bar of bars) {
        barsArray.push(bar);
      }
      
      res.json({
        success: true,
        data: barsArray
      });
    } catch (error) {
      console.error('Get bars error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bars',
        message: error.message
      });
    }
  }
}

module.exports = new TradingController();
