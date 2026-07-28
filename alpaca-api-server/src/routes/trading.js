const express = require('express');
const router = express.Router();
const tradingController = require('../controllers/tradingController');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all trading routes
router.use(authMiddleware);

/**
 * Account routes
 */

/**
 * @route   GET /api/trading/account
 * @desc    Get account information
 * @access  Protected
 */
router.get('/account', tradingController.getAccount);

/**
 * Position routes
 */

/**
 * @route   GET /api/trading/positions
 * @desc    Get all positions
 * @access  Protected
 */
router.get('/positions', tradingController.getPositions);

/**
 * @route   GET /api/trading/positions/:symbol
 * @desc    Get a specific position
 * @access  Protected
 */
router.get('/positions/:symbol', tradingController.getPosition);

/**
 * @route   DELETE /api/trading/positions/:symbol
 * @desc    Close a position
 * @access  Protected
 */
router.delete('/positions/:symbol', tradingController.closePosition);

/**
 * Order routes
 */

/**
 * @route   GET /api/trading/orders
 * @desc    Get all orders (with optional filters)
 * @access  Protected
 * @query   status - Filter by order status (open, closed, all)
 * @query   limit - Number of orders to return
 * @query   direction - Sort direction (asc, desc)
 */
router.get('/orders', tradingController.getOrders);

/**
 * @route   GET /api/trading/orders/:orderId
 * @desc    Get a specific order by ID
 * @access  Protected
 */
router.get('/orders/:orderId', tradingController.getOrder);

/**
 * @route   POST /api/trading/orders
 * @desc    Create a new order
 * @access  Protected
 * @body    { symbol, qty, side, type, time_in_force, limit_price?, stop_price? }
 */
router.post('/orders', tradingController.createOrder);

/**
 * @route   DELETE /api/trading/orders/:orderId
 * @desc    Cancel an order
 * @access  Protected
 */
router.delete('/orders/:orderId', tradingController.cancelOrder);

/**
 * @route   DELETE /api/trading/orders
 * @desc    Cancel all open orders
 * @access  Protected
 */
router.delete('/orders', tradingController.cancelAllOrders);

/**
 * Market data routes
 */

/**
 * @route   GET /api/trading/quotes/:symbol
 * @desc    Get latest quote for a symbol
 * @access  Protected
 */
router.get('/quotes/:symbol', tradingController.getQuote);

/**
 * @route   GET /api/trading/trades/:symbol
 * @desc    Get latest trade for a symbol
 * @access  Protected
 */
router.get('/trades/:symbol', tradingController.getLatestTrade);

/**
 * @route   GET /api/trading/bars/:symbol
 * @desc    Get bars (candlestick data) for a symbol
 * @access  Protected
 * @query   timeframe - Timeframe for bars (1Min, 5Min, 15Min, 1Hour, 1Day)
 * @query   start - Start date (ISO format)
 * @query   end - End date (ISO format)
 * @query   limit - Number of bars to return
 */
router.get('/bars/:symbol', tradingController.getBars);

module.exports = router;
