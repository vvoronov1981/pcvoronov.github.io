const Alpaca = require('@alpacahq/alpaca-trade-api');
const config = require('./index');

let alpacaClient = null;

function getAlpacaClient() {
  if (!alpacaClient) {
    if (!config.alpaca.apiKey || !config.alpaca.apiSecret) {
      throw new Error('Alpaca API credentials are not configured. Please set ALPACA_API_KEY and ALPACA_API_SECRET in .env file');
    }

    alpacaClient = new Alpaca({
      keyId: config.alpaca.apiKey,
      secretKey: config.alpaca.apiSecret,
      baseUrl: config.alpaca.baseUrl,
      paper: config.alpaca.paper
    });
  }
  
  return alpacaClient;
}

module.exports = {
  getAlpacaClient
};
