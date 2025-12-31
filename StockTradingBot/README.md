# Stock Trading Bot (Delphi 12)

Консольное приложение для автоматической торговли акциями на платформе Alpaca через REST API с JWT аутентификацией.

## 🔒 ВАЖНО: Безопасность

**НИКОГДА НЕ ХРАНИТЕ РЕАЛЬНЫЕ CREDENTIALS В КОДЕ ИЛИ КОНФИГУРАЦИИ!**

Этот бот поддерживает безопасную работу с учетными данными через переменные окружения и интеграцию с CI/CD системами (GitHub Actions, Docker, и др.).

## Описание

Программа реализует автоматическую торговую стратегию, основанную на анализе исторических данных за последние 30 часов. Бот автоматически размещает ордера на покупку при благоприятных условиях и продает позиции при достижении целей Take Profit или Stop Loss.

## Возможности

- ✅ Подключение к REST API сервера Alpaca через JWT аутентификацию
- ✅ **Безопасное хранение credentials через переменные окружения**
- ✅ **Автоматическое управление тикерами (добавление/удаление)**
- ✅ **Поддержка GitHub Actions и CI/CD автоматизации**
- ✅ Анализ исторических данных за настраиваемый период
- ✅ Автоматическая торговля по алгоритму с использованием кредитного плеча
- ✅ Take Profit и Stop Loss для управления рисками
- ✅ Многопоточная архитектура для мониторинга нескольких акций
- ✅ Полное логирование всех операций
- ✅ Интерактивный консольный интерфейс
- ✅ Гибкая конфигурация через JSON файл

## Структура проекта

```
StockTradingBot/
├── StockTradingBot.dpr          # Главный файл проекта
├── src/
│   ├── Types.pas                # Общие типы и структуры данных
│   ├── Logger.pas               # Модуль логирования
│   ├── ConfigManager.pas        # Управление конфигурацией
│   ├── AlpacaAPIClient.pas      # REST API клиент с JWT
│   ├── TradingStrategy.pas      # Торговая стратегия и анализ
│   ├── OrderManager.pas         # Управление ордерами и позициями
│   ├── CredentialsProvider.pas  # Безопасная работа с credentials
│   └── TickerManager.pas        # Автоматическое управление тикерами
├── config.json                  # Конфигурационный файл (с placeholders)
├── config.example.json          # Пример конфигурации
└── README.md                    # Документация
```

## Требования

### Системные требования
- **Delphi/FreePascal**: Delphi 12 или FreePascal Compiler 3.2+
- **ОС**: Windows, Linux, macOS
- **Интернет**: Стабильное подключение для API запросов

### Зависимости FreePascal
Программа использует следующие модули FreePascal:
- `fphttpclient` - HTTP клиент
- `opensslsockets` - SSL/TLS поддержка
- `fpjson` - работа с JSON
- `jsonparser` - парсинг JSON

Для компиляции требуется установить OpenSSL библиотеки:

**Ubuntu/Debian:**
```bash
sudo apt-get install libssl-dev
```

**macOS:**
```bash
brew install openssl
```

**Windows:**
Скачайте OpenSSL с [slproweb.com](https://slproweb.com/products/Win32OpenSSL.html)

## 🔐 Безопасная конфигурация credentials

### Использование переменных окружения (РЕКОМЕНДУЕТСЯ)

Бот поддерживает автоматическую подстановку credentials из переменных окружения. Это безопасный способ работы с API ключами и токенами.

#### Поддерживаемые переменные окружения:

- `ALPACA_API_URL` - URL API сервера Alpaca
- `JWT_TOKEN` или `ALPACA_JWT_TOKEN` - JWT токен для аутентификации
- `ALPACA_API_KEY` - API ключ Alpaca (альтернатива JWT)
- `ALPACA_ACCOUNT` - ID аккаунта Alpaca

#### Установка переменных окружения:

**Linux/macOS:**
```bash
export ALPACA_API_URL="https://paper-api.alpaca.markets"
export JWT_TOKEN="your_jwt_token_here"
export ALPACA_API_KEY="your_api_key_here"
export ALPACA_ACCOUNT="your_account_id"
```

**Windows (PowerShell):**
```powershell
$env:ALPACA_API_URL="https://paper-api.alpaca.markets"
$env:JWT_TOKEN="your_jwt_token_here"
$env:ALPACA_API_KEY="your_api_key_here"
$env:ALPACA_ACCOUNT="your_account_id"
```

**Windows (CMD):**
```cmd
set ALPACA_API_URL=https://paper-api.alpaca.markets
set JWT_TOKEN=your_jwt_token_here
set ALPACA_API_KEY=your_api_key_here
set ALPACA_ACCOUNT=your_account_id
```

### Конфигурация с placeholders

Отредактируйте файл `config.json` используя placeholders:

```json
{
  "api": {
    "base_url": "${ALPACA_API_URL}",
    "jwt_token": "${JWT_TOKEN}"
  },
  "trading": {
    "symbols": ["AAPL", "MSFT", "GOOGL", "TSLA"],
    "analysis_period_hours": 30,
    "leverage": 2.0,
    "stop_loss_percent": 70,
    "update_interval_seconds": 60,
    "enable_random_ticker_management": true,
    "ticker_operation_interval_minutes": 30,
    "max_active_tickers": 10,
    "min_active_tickers": 3
  },
  "logging": {
    "log_file": "trading_bot.log",
    "log_level": "INFO"
  }
}
```

**Как это работает:**
1. Бот читает `config.json`
2. Находит placeholders вида `${VARIABLE_NAME}`
3. Автоматически заменяет их значениями из переменных окружения
4. Если переменная не найдена - выдает ошибку

### ⚠️ Правила безопасности

1. **НЕ коммитьте** config.json с реальными credentials в Git
2. **Используйте** `config.example.json` как шаблон
3. **Храните** реальные credentials в:
   - Переменных окружения
   - GitHub Secrets (для CI/CD)
   - Менеджерах паролей
   - Vault-системах
4. **Никогда не публикуйте** credentials в issues, PR или документации
5. **Используйте** demo/paper trading аккаунты для тестирования

## Конфигурация

Отредактируйте файл `config.json`:

```json
{
  "api": {
    "base_url": "https://your-api-server.com/api",
    "jwt_token": "your_jwt_token_here"
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

### Параметры конфигурации

**API секция:**
- `base_url` - URL вашего REST API сервера (используйте `${ALPACA_API_URL}`)
- `jwt_token` - JWT токен для аутентификации (используйте `${JWT_TOKEN}`)

**Trading секция:**
- `symbols` - Массив тикеров акций для торговли
- `analysis_period_hours` - Период анализа в часах (по умолчанию 30)
- `leverage` - Кредитное плечо (по умолчанию 2.0)
- `stop_loss_percent` - Процент для Stop Loss (по умолчанию 70)
- `update_interval_seconds` - Интервал обновления данных в секундах
- `enable_random_ticker_management` - Включить автоматическое управление тикерами (по умолчанию true)
- `ticker_operation_interval_minutes` - Интервал операций с тикерами в минутах (по умолчанию 30)
- `max_active_tickers` - Максимальное количество активных тикеров (по умолчанию 10)
- `min_active_tickers` - Минимальное количество активных тикеров (по умолчанию 3)

**Logging секция:**
- `log_file` - Путь к файлу лога
- `log_level` - Уровень логирования: DEBUG, INFO, WARNING, ERROR

### Автоматическое управление тикерами

Бот может автоматически добавлять и удалять тикеры из пула 47 технологических акций:

```
AAPL, MSFT, GOOGL, TSLA, NVDA, GOOG, AMZN, META, AVGO, ORCL,
ADBE, CRM, CSCO, INTC, AMD, TXN, QCOM, PLTR, ASML, INTU,
MU, PANW, SNOW, KLAC, ADI, CDNS, CRWD, LRCX, ABNB, WDAY,
AMAT, MCHP, FTNT, SNPS, ON, DELL, ANET, TEAM, MNST, TTWO,
ANSS, ZS, DDOG, PSTG, NXPI, GFS, ENPH
```

Функция управляется параметрами:
- Включается/выключается через `enable_random_ticker_management`
- Операции выполняются каждые `ticker_operation_interval_minutes` минут
- Количество активных тикеров поддерживается между `min_active_tickers` и `max_active_tickers`

**Logging секция:**
- `log_file` - Путь к файлу лога
- `log_level` - Уровень логирования: DEBUG, INFO, WARNING, ERROR

## Компиляция

### FreePascal (рекомендуется)
```bash
cd StockTradingBot
fpc -O3 -XX -CX StockTradingBot.dpr
```

### Delphi 12
1. Откройте проект `StockTradingBot.dpr` в Delphi 12
2. Настройте пути к исходным файлам
3. Скомпилируйте проект (Shift+F9)

## Запуск

### Локальный запуск с переменными окружения

```bash
# Установите переменные окружения
export ALPACA_API_URL="https://paper-api.alpaca.markets"
export JWT_TOKEN="your_jwt_token_here"

# Запуск с конфигурацией по умолчанию (config.json)
./StockTradingBot

# Запуск с указанием конфигурационного файла
./StockTradingBot /path/to/config.json
```

### Запуск через Docker

```bash
# Build Docker image
docker build -t stocktradingbot .

# Run with environment variables
docker run -e ALPACA_API_URL="https://paper-api.alpaca.markets" \
           -e JWT_TOKEN="your_jwt_token" \
           -e ALPACA_API_KEY="your_api_key" \
           stocktradingbot
```

## 🤖 Автоматизация через GitHub Actions

### Настройка GitHub Secrets

1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте следующие secrets:
   - `ALPACA_API_URL` - URL API сервера
   - `JWT_TOKEN` - JWT токен
   - `ALPACA_API_KEY` - API ключ (опционально)
   - `ALPACA_ACCOUNT` - ID аккаунта (опционально)

### Автоматический workflow

Файл `.github/workflows/trading-bot.yml` содержит готовый CI/CD pipeline:

```yaml
name: Run StockTradingBot on Alpaca
on: 
  push:
    branches: [ main ]
  workflow_dispatch:  # Ручной запуск

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install FreePascal
        run: |
          sudo apt-get update
          sudo apt-get install -y fpc libssl-dev
      
      - name: Build StockTradingBot
        run: |
          cd StockTradingBot
          fpc -O3 -XX -CX StockTradingBot.dpr
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: StockTradingBot-linux
          path: StockTradingBot/StockTradingBot

  # Опциональный job для автоматической торговли
  # Раскомментируйте в workflow файле для активации
  # trade:
  #   needs: build
  #   runs-on: ubuntu-latest
  #   env:
  #     ALPACA_API_URL: ${{ secrets.ALPACA_API_URL }}
  #     JWT_TOKEN: ${{ secrets.JWT_TOKEN }}
  #   steps:
  #     - name: Run trading
  #       run: ./StockTradingBot
```

### Запуск через GitHub Actions

1. **Автоматически**: При каждом push в main/master (только компиляция)
2. **Вручную**: Actions → StockTradingBot CI/CD → Run workflow
3. **По расписанию**: Раскомментируйте trade job и добавьте schedule trigger

### Пример полного workflow с торговлей

```yaml
on:
  schedule:
    - cron: '0 9 * * 1-5'  # Каждый будний день в 9:00 UTC
  workflow_dispatch:

jobs:
  trade:
    runs-on: ubuntu-latest
    env:
      ALPACA_API_URL: ${{ secrets.ALPACA_API_URL }}
      JWT_TOKEN: ${{ secrets.JWT_TOKEN }}
      ALPACA_ACCOUNT: ${{ secrets.ALPACA_ACCOUNT }}
    steps:
      - uses: actions/checkout@v4
      - name: Build and Run
        run: |
          cd StockTradingBot
          fpc -O3 -XX -CX StockTradingBot.dpr
          timeout 3600 ./StockTradingBot config.json
      - name: Upload logs
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: trading-logs
          path: StockTradingBot/*.log
```

## Запуск через агентов (Batch/Scripts)

### Bash скрипт (Linux/macOS)

```bash
#!/bin/bash
# run_trading.sh

# Загрузка credentials из .env файла
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Проверка наличия credentials
if [ -z "$ALPACA_API_URL" ] || [ -z "$JWT_TOKEN" ]; then
    echo "Error: ALPACA_API_URL and JWT_TOKEN must be set"
    exit 1
fi

# Запуск бота
cd StockTradingBot
./StockTradingBot config.json
```

### PowerShell скрипт (Windows)

```powershell
# run_trading.ps1

# Загрузка credentials из .env файла
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        $name, $value = $_.split('=')
        Set-Content env:\$name $value
    }
}

# Проверка credentials
if (-not $env:ALPACA_API_URL -or -not $env:JWT_TOKEN) {
    Write-Error "ALPACA_API_URL and JWT_TOKEN must be set"
    exit 1
}

# Запуск бота
cd StockTradingBot
.\StockTradingBot.exe config.json
```

### Пример .env файла (НЕ коммитить!)

```bash
# .env - НЕ КОММИТИТЬ В GIT!
ALPACA_API_URL=https://paper-api.alpaca.markets
JWT_TOKEN=your_jwt_token_here
ALPACA_API_KEY=your_api_key
ALPACA_ACCOUNT=your_account_id
```

## Запуск

## Команды управления (интерактивный режим)

После запуска программы доступны следующие команды:

| Команда | Описание |
|---------|----------|
| `start` | Запустить автоматическую торговлю |
| `stop` | Остановить торговлю |
| `status` | Показать текущий статус и баланс |
| `positions` | Показать открытые позиции |
| `add SYMBOL` | Добавить акцию в список для мониторинга |
| `remove SYMBOL` | Удалить акцию из списка |
| `help` | Показать список команд |
| `exit` | Выйти из программы |

### Примеры команд

```
> start              # Начать торговлю
> status             # Проверить статус
> positions          # Посмотреть позиции
> add NVDA           # Добавить NVIDIA в мониторинг
> remove TSLA        # Убрать Tesla из мониторинга
> stop               # Остановить торговлю
> exit               # Выйти
```

## Торговый алгоритм

### Анализ рынка
Для каждой акции программа:
1. Получает исторические данные за последние 30 часов
2. Вычисляет минимальную цену за период
3. Вычисляет максимальную цену за период
4. Вычисляет среднюю цену за период

### Логика покупки
- **Условие**: Текущая цена < минимальной цены за 30 часов
- **Действие**: Покупка с использованием кредитного плеча
- **Расчет количества**: `(BuyingPower × Leverage) / CurrentPrice`

### Логика продажи

**Take Profit:**
- **Условие**: Текущая цена ≥ средней цены за 30 часов
- **Действие**: Продажа всей позиции с прибылью

**Stop Loss:**
- **Условие**: Текущая цена ≤ Stop Loss цены
- **Расчет Stop Loss**: `MinPrice - 0.7 × (MaxPrice - MinPrice)`
- **Действие**: Продажа позиции для ограничения убытков

## Безопасность

⚠️ **Важные рекомендации по безопасности:**

### Хранение credentials

1. **НИКОГДА** не коммитьте `config.json` с реальными токенами в Git
2. **Используйте** переменные окружения для всех sensitive данных
3. **Используйте** GitHub Secrets для CI/CD
4. **Создайте** `.env` файл локально и добавьте его в `.gitignore`
5. **Используйте** placeholders `${VARIABLE_NAME}` в config файлах

### Работа с API

1. Храните JWT токены в безопасном месте
2. Регулярно меняйте токены доступа
3. Используйте demo/paper trading аккаунты для тестирования
4. Ограничьте права API ключей минимально необходимыми
5. Мониторьте активность API через dashboard Alpaca

### Лучшие практики

✅ **ПРАВИЛЬНО:**
```json
{
  "api": {
    "base_url": "${ALPACA_API_URL}",
    "jwt_token": "${JWT_TOKEN}"
  }
}
```

❌ **НЕПРАВИЛЬНО:**
```json
{
  "api": {
    "base_url": "https://paper-api.alpaca.markets",
    "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Защита в CI/CD

- Используйте GitHub Secrets, а не environment variables в workflow
- Ограничьте доступ к secrets только необходимым workflow
- Регулярно ротируйте secrets
- Не выводите secrets в логи (GitHub автоматически маскирует их)
- Используйте `if: always()` только там где необходимо

### Проверка безопасности

```bash
# Проверьте, что config.json не содержит реальных credentials
grep -E "(jwt_token|api_key)" config.json

# Убедитесь что используются placeholders
grep "\${" config.json

# Проверьте .gitignore
cat .gitignore | grep -E "(config.*json|\.env)"
```

## Логирование

Все операции логируются в файл, указанный в конфигурации. Формат лога:

```
[2025-12-27 17:00:00] [INFO] Trading started
[2025-12-27 17:00:05] [DEBUG] AAPL Analysis - Min: 150.25, Max: 155.80, Avg: 153.02, Current: 149.99
[2025-12-27 17:00:06] [INFO] Buy signal for AAPL at 149.99 (min was: 150.25)
[2025-12-27 17:00:07] [INFO] Placing buy order: AAPL x 10 @ 149.99 (Leverage: 2.0x)
[2025-12-27 17:00:08] [INFO] Buy order executed: AAPL - Order ID: abc123
```

## Обработка ошибок

Программа обрабатывает следующие типы ошибок:
- ❌ Сетевые ошибки при обращении к API
- ❌ Ошибки аутентификации JWT
- ❌ Ошибки при размещении ордеров
- ❌ Недостаточная покупательская способность
- ❌ Невалидные данные от API

При критических ошибках программа логирует их и продолжает работу.

## Тестирование

### Тестирование на демо-среде

1. Настройте `base_url` на тестовый API endpoint
2. Используйте тестовый JWT токен
3. Установите небольшой `leverage` (1.0 - 1.5)
4. Начните с одной-двух акций в `symbols`

### Мониторинг

Рекомендуется мониторить:
- Файл лога для отслеживания операций
- Баланс счета через команду `status`
- Открытые позиции через команду `positions`
- Производительность API (задержки ответов)

## Ограничения и риски

⚠️ **Предупреждения:**

- Торговля с кредитным плечом увеличивает риски
- Высокая волатильность может привести к быстрым убыткам
- API может быть недоступен или медленно отвечать
- Стратегия не гарантирует прибыль
- Требуется постоянное интернет-соединение

## Улучшения и дальнейшее развитие

Возможные улучшения:
- [ ] Поддержка нескольких торговых стратегий
- [ ] Бэктестинг на исторических данных
- [ ] Web-интерфейс для мониторинга
- [ ] Уведомления (email, Telegram)
- [ ] Расширенная статистика и аналитика
- [ ] Поддержка других бирж (Binance, Coinbase)
- [ ] Machine Learning для прогнозирования

## Лицензия

Этот проект предоставляется "как есть" без каких-либо гарантий. Используйте на свой риск.

## Автор

Volodymyr Voronov
- Email: voronov.voldymyr@gmail.com
- GitHub: [@vvoronov1981](https://github.com/vvoronov1981)

## Поддержка

Если вы нашли баг или у вас есть предложения по улучшению, создайте Issue на GitHub.

---

**⚠️ Дисклеймер**: Автоматическая торговля связана с финансовыми рисками. Разработчик не несет ответственности за любые финансовые потери. Всегда тестируйте на демо-счете перед использованием реальных средств.
