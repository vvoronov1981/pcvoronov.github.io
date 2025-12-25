require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiresIn: '24h',
  alpaca: {
    apiKey: process.env.ALPACA_API_KEY,
    apiSecret: process.env.ALPACA_API_SECRET,
    baseUrl: process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets',
    paper: process.env.ALPACA_BASE_URL?.includes('paper') !== false
  },
  auth: {
    username: process.env.API_USERNAME || 'admin',
    password: process.env.API_PASSWORD || 'change-this-password'
  }
};
