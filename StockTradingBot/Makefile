# Makefile for Stock Trading Bot

# Compiler
FPC = fpc
FPCFLAGS = -O3 -XX -CX -Fusrc

# Project files
PROJECT = StockTradingBot
MAIN = StockTradingBot.dpr
SOURCES = src/Types.pas src/Logger.pas src/ConfigManager.pas src/AlpacaAPIClient.pas src/TradingStrategy.pas src/OrderManager.pas

# Build directory
BUILDDIR = lib

# Default target
all: release

# Release build
release: $(MAIN) $(SOURCES)
	@echo "Building Stock Trading Bot (Release)..."
	$(FPC) $(FPCFLAGS) -O3 $(MAIN)
	@echo "Build complete: ./$(PROJECT)"

# Debug build
debug: $(MAIN) $(SOURCES)
	@echo "Building Stock Trading Bot (Debug)..."
	$(FPC) $(FPCFLAGS) -g -gl -gh $(MAIN)
	@echo "Debug build complete: ./$(PROJECT)"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -f $(PROJECT)
	rm -f src/*.o src/*.ppu
	rm -f *.o *.ppu
	rm -rf $(BUILDDIR)
	@echo "Clean complete"

# Run the program
run: release
	@echo "Running Stock Trading Bot..."
	./$(PROJECT)

# Show help
help:
	@echo "Stock Trading Bot - Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  make           - Build release version"
	@echo "  make release   - Build optimized release version"
	@echo "  make debug     - Build debug version with symbols"
	@echo "  make clean     - Remove build artifacts"
	@echo "  make run       - Build and run the program"
	@echo "  make help      - Show this help message"

.PHONY: all release debug clean run help
