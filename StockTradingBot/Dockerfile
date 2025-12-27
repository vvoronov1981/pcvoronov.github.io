# Docker setup for Stock Trading Bot

FROM debian:bookworm-slim

# Install FreePascal and dependencies
RUN apt-get update && apt-get install -y \
    fpc \
    libssl-dev \
    make \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy application files
COPY . /app/

# Compile the application
RUN make clean && make release

# Default command
CMD ["./StockTradingBot"]
