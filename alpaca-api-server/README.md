# Alpaca Trading REST API Server

REST API сервер для торговли на Alpaca с JWT аутентификацией.

## 🚀 Возможности

- ✅ JWT аутентификация
- ✅ Интеграция с Alpaca Trading API
- ✅ Управление аккаунтом
- ✅ Управление позициями
- ✅ Создание и отмена ордеров
- ✅ Получение рыночных данных (котировки, сделки, бары)
- ✅ Rate limiting для защиты от DDoS
- ✅ Безопасность с Helmet.js
- ✅ CORS поддержка
- ✅ Обработка ошибок

## 📋 Требования

- Node.js >= 14.0.0
- npm или yarn
- Alpaca API аккаунт (Paper Trading или Live)

## 🔧 Установка

1. Перейдите в директорию проекта:
```bash
cd alpaca-api-server
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Настройте переменные окружения в `.env`:
```env
# Порт сервера
PORT=3000

# JWT секретный ключ (обязательно измените в продакшене!)
JWT_SECRET=your-secret-jwt-key-change-this-in-production

# Alpaca API ключи (получите на https://alpaca.markets)
ALPACA_API_KEY=your-alpaca-api-key-here
ALPACA_API_SECRET=your-alpaca-api-secret-here

# Alpaca Base URL
# Paper Trading: https://paper-api.alpaca.markets
# Live Trading: https://api.alpaca.markets
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# Учетные данные для API
API_USERNAME=admin
API_PASSWORD=change-this-password
```

## 🏃 Запуск

### Режим разработки (с автоперезагрузкой):
```bash
npm run dev
```

### Продакшн режим:
```bash
npm start
```

Сервер запустится на `http://localhost:3000`

## 📡 API Endpoints

### Аутентификация

#### 1. Логин (получение JWT токена)
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

Ответ:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h",
    "user": {
      "username": "admin"
    }
  }
}
```

#### 2. Проверка токена
```http
GET /api/auth/verify
Authorization: Bearer <your-token>
```

### Торговые операции

Все торговые endpoints требуют JWT токен в заголовке:
```
Authorization: Bearer <your-token>
```

#### Аккаунт

**Получить информацию об аккаунте:**
```http
GET /api/trading/account
```

#### Позиции

**Получить все позиции:**
```http
GET /api/trading/positions
```

**Получить конкретную позицию:**
```http
GET /api/trading/positions/:symbol
```

**Закрыть позицию:**
```http
DELETE /api/trading/positions/:symbol
```

#### Ордера

**Получить все ордера:**
```http
GET /api/trading/orders?status=all&limit=50&direction=desc
```

Параметры query:
- `status`: `open`, `closed`, `all` (по умолчанию: `all`)
- `limit`: количество ордеров (по умолчанию: `50`)
- `direction`: `asc`, `desc` (по умолчанию: `desc`)

**Получить конкретный ордер:**
```http
GET /api/trading/orders/:orderId
```

**Создать новый ордер:**
```http
POST /api/trading/orders
Content-Type: application/json

{
  "symbol": "AAPL",
  "qty": 10,
  "side": "buy",
  "type": "market",
  "time_in_force": "day"
}
```

Параметры для создания ордера:
- `symbol` (обязательно): тикер акции (например, "AAPL", "TSLA")
- `qty` (обязательно): количество акций
- `side` (обязательно): `buy` или `sell`
- `type` (обязательно): `market`, `limit`, `stop`, `stop_limit`
- `time_in_force` (обязательно): `day`, `gtc`, `opg`, `cls`, `ioc`, `fok`
- `limit_price` (опционально): для limit и stop_limit ордеров
- `stop_price` (опционально): для stop и stop_limit ордеров

Примеры ордеров:

Market order (покупка по рынку):
```json
{
  "symbol": "AAPL",
  "qty": 10,
  "side": "buy",
  "type": "market",
  "time_in_force": "day"
}
```

Limit order (покупка с лимитной ценой):
```json
{
  "symbol": "AAPL",
  "qty": 10,
  "side": "buy",
  "type": "limit",
  "time_in_force": "gtc",
  "limit_price": 150.00
}
```

Stop order (стоп-лосс):
```json
{
  "symbol": "AAPL",
  "qty": 10,
  "side": "sell",
  "type": "stop",
  "time_in_force": "gtc",
  "stop_price": 145.00
}
```

**Отменить ордер:**
```http
DELETE /api/trading/orders/:orderId
```

**Отменить все ордера:**
```http
DELETE /api/trading/orders
```

#### Рыночные данные

**Получить котировку:**
```http
GET /api/trading/quotes/:symbol
```

**Получить последнюю сделку:**
```http
GET /api/trading/trades/:symbol
```

**Получить бары (свечи):**
```http
GET /api/trading/bars/:symbol?timeframe=1Day&limit=100
```

Параметры query:
- `timeframe`: `1Min`, `5Min`, `15Min`, `1Hour`, `1Day` (по умолчанию: `1Day`)
- `start`: начальная дата в ISO формате
- `end`: конечная дата в ISO формате
- `limit`: количество баров (по умолчанию: `100`)

## 📝 Примеры использования

### cURL

1. Получить токен:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

2. Получить информацию об аккаунте:
```bash
curl http://localhost:3000/api/trading/account \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

3. Создать ордер на покупку:
```bash
curl -X POST http://localhost:3000/api/trading/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "qty": 1,
    "side": "buy",
    "type": "market",
    "time_in_force": "day"
  }'
```

### JavaScript (Fetch API)

```javascript
// 1. Получить токен
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'your-password'
  })
});
const { data } = await loginResponse.json();
const token = data.token;

// 2. Получить информацию об аккаунте
const accountResponse = await fetch('http://localhost:3000/api/trading/account', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const account = await accountResponse.json();
console.log(account);

// 3. Создать ордер
const orderResponse = await fetch('http://localhost:3000/api/trading/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symbol: 'AAPL',
    qty: 1,
    side: 'buy',
    type: 'market',
    time_in_force: 'day'
  })
});
const order = await orderResponse.json();
console.log(order);
```

## 🔒 Безопасность

1. **Всегда используйте HTTPS в продакшене**
2. **Измените JWT_SECRET** на случайную строку
3. **Измените API_USERNAME и API_PASSWORD**
4. **Не коммитьте .env файл** в git
5. **Используйте базу данных** для хранения пользователей в продакшене
6. **Настройте CORS** для конкретных доменов в продакшене
7. **Используйте переменные окружения** на сервере

## 🧪 Тестирование

```bash
npm test
```

## 📚 Дополнительная информация

### Alpaca API Documentation
- [Alpaca API Docs](https://alpaca.markets/docs/api-documentation/)
- [Alpaca Trading API](https://alpaca.markets/docs/api-documentation/api-v2/orders/)

### Получение Alpaca API ключей
1. Зарегистрируйтесь на [Alpaca](https://alpaca.markets/)
2. Перейдите в [Paper Trading](https://app.alpaca.markets/paper/dashboard/overview)
3. Получите API Key и Secret Key
4. Используйте их в `.env` файле

### Структура проекта
```
alpaca-api-server/
├── src/
│   ├── config/
│   │   ├── index.js           # Основная конфигурация
│   │   └── alpaca.js          # Alpaca клиент
│   ├── controllers/
│   │   ├── authController.js  # Контроллер аутентификации
│   │   └── tradingController.js # Контроллер торговли
│   ├── middleware/
│   │   ├── auth.js            # JWT middleware
│   │   └── errorHandler.js    # Обработчик ошибок
│   ├── routes/
│   │   ├── auth.js            # Маршруты аутентификации
│   │   └── trading.js         # Торговые маршруты
│   └── server.js              # Основной файл сервера
├── .env.example               # Пример переменных окружения
├── .gitignore
├── package.json
└── README.md
```

## 🐛 Troubleshooting

**Ошибка "Alpaca API credentials are not configured":**
- Проверьте, что ALPACA_API_KEY и ALPACA_API_SECRET указаны в .env файле

**Ошибка "Invalid credentials":**
- Проверьте API_USERNAME и API_PASSWORD в .env файле

**Ошибка 401 Unauthorized:**
- Убедитесь, что вы передаете валидный JWT токен в заголовке Authorization

**Ошибка подключения к Alpaca API:**
- Проверьте ALPACA_BASE_URL
- Проверьте правильность API ключей

## 📄 Лицензия

MIT

## 👤 Автор

Volodymyr Voronov
- Email: voronov.voldymyr@gmail.com
- LinkedIn: [Volodymyr Voronov](https://www.linkedin.com/in/volodymyr-voronov-224480236)
