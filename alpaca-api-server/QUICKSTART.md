# 🚀 Quick Start Guide - Alpaca Trading API Server

Get your Alpaca Trading API server up and running in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- Alpaca account (sign up at [alpaca.markets](https://alpaca.markets/))

## Step 1: Get Alpaca API Keys

1. Log in to [Alpaca](https://app.alpaca.markets/)
2. Go to Paper Trading Dashboard
3. Navigate to "Your API Keys" section
4. Generate new API Key and Secret
5. Copy both values

## Step 2: Installation

```bash
# Navigate to the server directory
cd alpaca-api-server

# Install dependencies
npm install
```

## Step 3: Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your credentials
nano .env  # or use any text editor
```

Update these values in `.env`:
```env
# Your Alpaca API credentials
ALPACA_API_KEY=your-actual-api-key-here
ALPACA_API_SECRET=your-actual-api-secret-here

# Your API login credentials (change these!)
API_USERNAME=admin
API_PASSWORD=change-this-to-secure-password

# JWT Secret (change this to a random string!)
JWT_SECRET=change-this-to-random-secret-minimum-32-characters
```

## Step 4: Start the Server

```bash
# Start in development mode
npm run dev

# Or start in production mode
npm start
```

You should see:
```
🚀 Alpaca Trading API Server running on port 3000
📊 Environment: development
🔐 Using Paper Trading
📍 Base URL: https://paper-api.alpaca.markets
✅ Server is ready to accept requests
```

## Step 5: Test the API

Open a new terminal and run:

```bash
# Test health check
curl http://localhost:3000/health

# Login to get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

You'll receive a JWT token in the response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

## Step 6: Make Your First Trading Request

```bash
# Replace YOUR_TOKEN with the token from Step 5
curl http://localhost:3000/api/trading/account \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 What's Next?

### View Account Information
```bash
GET /api/trading/account
```

### View Positions
```bash
GET /api/trading/positions
```

### Create a Market Order
```bash
POST /api/trading/orders
{
  "symbol": "AAPL",
  "qty": 1,
  "side": "buy",
  "type": "market",
  "time_in_force": "day"
}
```

### Get Market Quote
```bash
GET /api/trading/quotes/AAPL
```

## 📚 Full Documentation

- [README.md](README.md) - Complete API documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guides
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Check what's using port 3000
lsof -i :3000
# Kill the process or change PORT in .env
```

### "Invalid credentials" when calling Alpaca API
- Verify your API keys are correct in .env
- Make sure you're using Paper Trading keys if ALPACA_BASE_URL is set to paper-api
- Check your Alpaca account is active

### "Authentication failed" 
- Check API_USERNAME and API_PASSWORD match what you're sending
- Make sure .env file is in the alpaca-api-server directory

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options
- Create an issue in the GitHub repository

## ✅ Success Checklist

- [ ] Node.js 14+ installed
- [ ] Alpaca account created
- [ ] API keys obtained
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Server started successfully
- [ ] Health check returns success
- [ ] Login returns JWT token
- [ ] Account endpoint returns data

If all items are checked, you're ready to trade! 🎉

## ⚠️ Important Security Notes

**Before deploying to production:**

1. ✅ Change JWT_SECRET to a strong random value (minimum 32 characters)
2. ✅ Change API_USERNAME and API_PASSWORD to secure credentials
3. ✅ Use HTTPS in production
4. ✅ Consider using a database for user management
5. ✅ Review and configure CORS settings
6. ✅ Never commit .env file to git
7. ✅ Switch to Live Trading only when you're ready (update ALPACA_BASE_URL)

Happy Trading! 📈
