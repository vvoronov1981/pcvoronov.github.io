# Quick Start Guide - Stock Trading Bot

## Быстрый старт за 5 минут

### 1. Подготовка окружения

**FreePascal (рекомендуется):**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install fpc libssl-dev

# macOS
brew install fpc openssl

# Windows
# Скачайте FreePascal: https://www.freepascal.org/download.html
# Скачайте OpenSSL: https://slproweb.com/products/Win32OpenSSL.html
```

**Delphi 12:**
- Установите Delphi 12 Community Edition или выше
- Убедитесь что установлены компоненты для консольных приложений

### 2. Клонирование проекта

```bash
git clone https://github.com/vvoronov1981/pcvoronov.github.io.git
cd pcvoronov.github.io/StockTradingBot
```

### 3. Настройка конфигурации

Отредактируйте `config.json`:

```json
{
  "api": {
    "base_url": "https://paper-api.alpaca.markets",
    "jwt_token": "YOUR_JWT_TOKEN_HERE"
  },
  "trading": {
    "symbols": ["AAPL", "MSFT"],
    "analysis_period_hours": 30,
    "leverage": 1.5,
    "stop_loss_percent": 70,
    "update_interval_seconds": 60
  },
  "logging": {
    "log_file": "trading_bot.log",
    "log_level": "INFO"
  }
}
```

⚠️ **Важно**: 
- Замените `YOUR_JWT_TOKEN_HERE` на ваш реальный JWT токен
- Для начала используйте paper trading (тестовую среду)
- Начните с малого количества акций (2-3)

### 4. Компиляция

**Вариант А: С помощью Makefile (Linux/macOS):**
```bash
make
```

**Вариант Б: С помощью FreePascal напрямую:**
```bash
fpc -O3 -XX -CX -Fusrc StockTradingBot.dpr
```

**Вариант В: С помощью Lazarus IDE:**
1. Откройте `StockTradingBot.lpi` в Lazarus
2. Нажмите F9 для компиляции и запуска

**Вариант Г: С помощью Delphi 12:**
1. Откройте `StockTradingBot.dpr` в Delphi 12
2. Нажмите Shift+F9 для компиляции

### 5. Запуск

```bash
# Linux/macOS
./StockTradingBot

# Windows
StockTradingBot.exe
```

### 6. Первый запуск

После запуска вы увидите:

```
=== Stock Trading Bot ===
Initializing...
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

### 7. Основные команды для начала

```bash
# Проверить статус и баланс
> status

# Посмотреть список отслеживаемых акций
> status

# Добавить новую акцию
> add NVDA

# Начать торговлю
> start

# Посмотреть открытые позиции
> positions

# Остановить торговлю
> stop

# Выйти
> exit
```

## Тестирование без риска

### Paper Trading (рекомендуется для начала)

1. Зарегистрируйтесь на [Alpaca](https://alpaca.markets/)
2. Получите Paper Trading API ключи
3. Используйте эндпоинт: `https://paper-api.alpaca.markets`
4. Получите JWT токен для аутентификации

### Симуляция без реального API

Для тестирования логики без подключения к API:
1. Установите `base_url` на локальный мок-сервер
2. Или временно закомментируйте API вызовы
3. Проверьте логику в логах

## Мониторинг работы

### Проверка логов в реальном времени

```bash
# Linux/macOS
tail -f trading_bot.log

# Windows PowerShell
Get-Content trading_bot.log -Wait -Tail 50
```

### Что смотреть в логах

```
[2025-12-27 17:00:00] [INFO] Trading started
[2025-12-27 17:00:05] [DEBUG] AAPL Analysis - Min: 150.25, Max: 155.80, Avg: 153.02
[2025-12-27 17:00:06] [INFO] Buy signal for AAPL at 149.99
[2025-12-27 17:00:08] [INFO] Buy order executed: AAPL - Order ID: abc123
```

## Часто задаваемые вопросы (FAQ)

### Q: Программа не компилируется
**A:** Проверьте:
- Установлен ли FreePascal/Delphi
- Установлены ли OpenSSL библиотеки
- Все ли исходные файлы на месте

### Q: Ошибка подключения к API
**A:** Проверьте:
- Правильность `base_url` в config.json
- Валидность JWT токена
- Доступность интернета
- Не заблокирован ли доступ файрволом

### Q: Ошибка "Invalid JWT token"
**A:** 
- Обновите JWT токен в config.json
- Проверьте срок действия токена
- Убедитесь что нет лишних пробелов

### Q: Программа не покупает акции
**A:** Возможные причины:
- Недостаточно средств на счете
- Текущая цена не ниже минимума за 30 часов
- API вернул ошибку (смотрите логи)

### Q: Как остановить программу безопасно?
**A:** 
- Введите команду `stop` для остановки торговли
- Затем введите `exit` для выхода
- Или нажмите Ctrl+C (может прервать транзакцию)

## Рекомендации для начинающих

1. ✅ **Начните с Paper Trading** - не рискуйте реальными деньгами
2. ✅ **Малое плечо** - используйте `leverage: 1.0` для начала
3. ✅ **Мало акций** - начните с 1-2 ликвидных акций (AAPL, MSFT)
4. ✅ **Мониторьте** - первые дни следите за каждой операцией
5. ✅ **Изучайте логи** - понимайте почему программа покупает/продает
6. ✅ **Тестируйте** - запускайте несколько дней на тестовом окружении

## Следующие шаги

После успешного запуска:

1. **Оптимизация параметров**
   - Подберите оптимальный `analysis_period_hours`
   - Настройте `stop_loss_percent` под свой риск-профиль
   - Экспериментируйте с `leverage`

2. **Расширение списка акций**
   - Добавляйте проверенные ликвидные акции
   - Избегайте волатильных активов в начале
   - Диверсифицируйте портфель

3. **Мониторинг производительности**
   - Ведите дневник сделок
   - Анализируйте прибыльность стратегии
   - Корректируйте параметры на основе результатов

## Получение помощи

- 📖 Полная документация: см. `README.md`
- 🐛 Нашли баг: создайте Issue на GitHub
- 💬 Вопросы: voronov.voldymyr@gmail.com
- 🔗 GitHub: https://github.com/vvoronov1981

## Предупреждение

⚠️ **Важно**: Автоматическая торговля связана с финансовыми рисками. Разработчик не несет ответственности за любые финансовые потери. **ВСЕГДА** тестируйте на демо-счете перед использованием реальных средств!

---

**Удачной торговли! 🚀📈**
