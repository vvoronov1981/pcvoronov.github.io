const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Alpaca API errors
  if (err.message && err.message.includes('Alpaca')) {
    return res.status(400).json({
      success: false,
      error: 'Alpaca API Error',
      message: err.message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: 'Invalid token'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
