# Stock Trading Bot - Usage Examples

## Command Line Interface

### Initial Startup
```
=== Stock Trading Bot ===
Initializing...
[2025-12-27 17:04:16] [INFO] === Stock Trading Bot Started ===
[2025-12-27 17:04:16] [INFO] Configuration loaded from: config.json
Initialization complete!

Available commands:
  start              - Start trading
  stop               - Stop trading
  status             - Show current status
  positions          - Show open positions
  add <SYMBOL>       - Add symbol to trading list
  remove <SYMBOL>    - Remove symbol from trading list
  help               - Show this help
  exit               - Exit the program

> 
```

### Checking Status
```
> status
=== Current Status ===
Trading: STOPPED

Account Balance:
  Cash:           $100000.00
  Portfolio Value: $100000.00
  Buying Power:    $200000.00
  Equity:          $100000.00

Trading Symbols (4):
  - AAPL
  - MSFT
  - GOOGL
  - TSLA

> 
```

### Starting Trading
```
> start
[2025-12-27 17:05:00] [INFO] Trading started
Trading started. Press Ctrl+C or type "stop" to stop.

[2025-12-27 17:05:05] [DEBUG] Processing symbol: AAPL
[2025-12-27 17:05:06] [DEBUG] AAPL Analysis - Min: 150.25, Max: 155.80, Avg: 153.02, Current: 149.99, SL: 146.36
[2025-12-27 17:05:06] [INFO] Buy signal for AAPL at 149.99 (min was: 150.25)
[2025-12-27 17:05:07] [INFO] Placing buy order: AAPL x 266 @ 149.99 (Leverage: 2.0x)
[2025-12-27 17:05:08] [INFO] Buy order executed: AAPL - Order ID: 12345-abc-6789

[2025-12-27 17:05:10] [DEBUG] Processing symbol: MSFT
[2025-12-27 17:05:11] [DEBUG] MSFT Analysis - Min: 380.50, Max: 395.20, Avg: 387.85, Current: 390.00, SL: 370.21
[2025-12-27 17:05:11] [INFO] No signal for MSFT

[2025-12-27 17:05:15] [DEBUG] Processing symbol: GOOGL
[2025-12-27 17:05:16] [DEBUG] GOOGL Analysis - Min: 142.10, Max: 148.50, Avg: 145.30, Current: 141.80, SL: 137.62
[2025-12-27 17:05:16] [INFO] Buy signal for GOOGL at 141.80 (min was: 142.10)
[2025-12-27 17:05:17] [INFO] Placing buy order: GOOGL x 281 @ 141.80 (Leverage: 2.0x)
[2025-12-27 17:05:18] [INFO] Buy order executed: GOOGL - Order ID: 23456-def-7890
```

### Viewing Positions
```
> positions
=== Open Positions ===
1. AAPL
   Quantity:      266
   Entry Price:   $149.99
   Current Price: $151.20
   Take Profit:   $153.02
   Stop Loss:     $146.36
   P/L:           $321.86
   Leverage:      2.0x

2. GOOGL
   Quantity:      281
   Entry Price:   $141.80
   Current Price: $143.50
   Take Profit:   $145.30
   Stop Loss:     $137.62
   P/L:           $477.70
   Leverage:      2.0x

> 
```

### Take Profit Triggered
```
[2025-12-27 17:35:22] [DEBUG] AAPL Analysis - Min: 150.25, Max: 155.80, Avg: 153.02, Current: 153.50, SL: 146.36
[2025-12-27 17:35:22] [INFO] Take Profit signal for AAPL at 153.50 (target: 153.02)
[2025-12-27 17:35:23] [INFO] Placing sell order: AAPL x 266 @ 153.50
[2025-12-27 17:35:24] [INFO] Sell order executed: AAPL - P/L: 933.66 - Order ID: 34567-ghi-8901
```

### Stop Loss Triggered
```
[2025-12-27 18:10:45] [DEBUG] TSLA Analysis - Min: 245.00, Max: 265.00, Avg: 255.00, Current: 240.50, SL: 241.00
[2025-12-27 18:10:45] [WARNING] Stop Loss triggered for TSLA at 240.50 (limit: 241.00)
[2025-12-27 18:10:46] [INFO] Placing sell order: TSLA x 163 @ 240.50
[2025-12-27 18:10:47] [INFO] Sell order executed: TSLA - P/L: -733.50 - Order ID: 45678-jkl-9012
```

### Adding New Symbol
```
> add NVDA
[2025-12-27 18:15:00] [INFO] Added symbol: NVDA
Symbol NVDA added to trading list

> 
```

### Removing Symbol
```
> remove TSLA
[2025-12-27 18:16:00] [INFO] Removed symbol: TSLA
Symbol TSLA removed from trading list

> 
```

### Stopping Trading
```
> stop
[2025-12-27 18:20:00] [INFO] Trading stopped
Trading stopped.

> 
```

### Exiting
```
> exit
Exiting...
[2025-12-27 18:21:00] [INFO] === Stock Trading Bot Stopped ===
```

## Log File Example (trading_bot.log)

```
[2025-12-27 17:04:16] [INFO] === Stock Trading Bot Started ===
[2025-12-27 17:04:16] [INFO] Configuration loaded from: config.json
[2025-12-27 17:05:00] [INFO] Trading started
[2025-12-27 17:05:05] [DEBUG] Processing symbol: AAPL
[2025-12-27 17:05:06] [DEBUG] API Request: GET https://paper-api.alpaca.markets/v2/stocks/AAPL/bars - Status: 200
[2025-12-27 17:05:06] [DEBUG] AAPL Analysis - Min: 150.25, Max: 155.80, Avg: 153.02, Current: 149.99, SL: 146.36
[2025-12-27 17:05:06] [INFO] Buy signal for AAPL at 149.99 (min was: 150.25)
[2025-12-27 17:05:07] [INFO] Placing buy order: AAPL x 266 @ 149.99 (Leverage: 2.0x)
[2025-12-27 17:05:08] [DEBUG] API Request: POST https://paper-api.alpaca.markets/v2/orders - Status: 200
[2025-12-27 17:05:08] [INFO] Buy order executed: AAPL - Order ID: 12345-abc-6789
[2025-12-27 17:05:10] [DEBUG] Processing symbol: MSFT
[2025-12-27 17:05:11] [DEBUG] API Request: GET https://paper-api.alpaca.markets/v2/stocks/MSFT/bars - Status: 200
[2025-12-27 17:05:11] [DEBUG] MSFT Analysis - Min: 380.50, Max: 395.20, Avg: 387.85, Current: 390.00, SL: 370.21
[2025-12-27 17:05:15] [DEBUG] Processing symbol: GOOGL
[2025-12-27 17:05:16] [DEBUG] API Request: GET https://paper-api.alpaca.markets/v2/stocks/GOOGL/bars - Status: 200
[2025-12-27 17:05:16] [DEBUG] GOOGL Analysis - Min: 142.10, Max: 148.50, Avg: 145.30, Current: 141.80, SL: 137.62
[2025-12-27 17:05:16] [INFO] Buy signal for GOOGL at 141.80 (min was: 142.10)
[2025-12-27 17:05:17] [INFO] Placing buy order: GOOGL x 281 @ 141.80 (Leverage: 2.0x)
[2025-12-27 17:05:18] [DEBUG] API Request: POST https://paper-api.alpaca.markets/v2/orders - Status: 200
[2025-12-27 17:05:18] [INFO] Buy order executed: GOOGL - Order ID: 23456-def-7890
```

## Error Handling Examples

### API Connection Error
```
[2025-12-27 17:10:00] [ERROR] API Request failed: GET https://paper-api.alpaca.markets/v2/stocks/AAPL/bars - Error: Connection timeout
[2025-12-27 17:10:00] [WARNING] No historical data for AAPL
```

### Authentication Error
```
[2025-12-27 17:11:00] [ERROR] API Request failed: GET https://paper-api.alpaca.markets/v2/account - Error: 401 Unauthorized
```

### Insufficient Funds
```
[2025-12-27 17:12:00] [WARNING] Insufficient buying power for TSLA
```

### Invalid Order
```
[2025-12-27 17:13:00] [ERROR] Failed to place buy order for AAPL
[2025-12-27 17:13:00] [WARNING] Calculated quantity too small for AAPL: 0.1234
```

## Configuration File (config.json)

```json
{
  "api": {
    "base_url": "https://paper-api.alpaca.markets",
    "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "trading": {
    "symbols": ["AAPL", "MSFT", "GOOGL", "TSLA"],
    "analysis_period_hours": 30,
    "leverage": 2.0,
    "stop_loss_percent": 70,
    "update_interval_seconds": 60
  },
  "logging": {
    "log_file": "trading_bot.log",
    "log_level": "INFO"
  }
}
```

## Performance Metrics

### Typical Operation Times
- Configuration loading: < 100ms
- API authentication: 200-500ms
- Historical data fetch: 500-1000ms per symbol
- Current price query: 100-300ms
- Order placement: 200-500ms
- Position sync: 300-600ms

### Resource Usage
- Memory: ~10-20 MB
- CPU: < 5% (idle), < 20% (active trading)
- Network: Minimal (API calls every 60 seconds by default)

## Trading Strategy Visualization

```
Price Chart (30 hours):

Max (155.80) ─────────────●───────────────────
                          │
Avg (153.02) ──────────────────●──────────────  ← Take Profit
                          │    │
Current      ──────────●──┼────┼──────────────
(149.99)            │     │    │
                    ▼     │    │
Min (150.25) ─────────────●────┼──────────────
                               │
Stop Loss    ──────────────────●──────────────  ← 70% below range
(146.36)

Actions:
- Buy Signal:  Current (149.99) < Min (150.25) ✓
- Take Profit: When Current >= Avg (153.02)
- Stop Loss:   When Current <= SL (146.36)
```

## Directory Structure After Build

```
StockTradingBot/
├── StockTradingBot         # Compiled executable
├── StockTradingBot.dpr
├── StockTradingBot.lpi
├── src/
│   ├── *.pas              # Source files
│   ├── *.ppu              # Compiled units
│   └── *.o                # Object files
├── lib/                    # Build directory
│   └── x86_64-linux/      # Platform-specific
├── config.json            # Configuration
├── trading_bot.log        # Log file
├── README.md
├── QUICKSTART.md
├── PROJECT_SUMMARY.md
├── Makefile
├── build.sh
├── Dockerfile
└── .gitignore
```

---

**Ready to Trade!** 🚀📈
