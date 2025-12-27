#!/bin/bash

# Build script for Stock Trading Bot
# Supports multiple platforms and compilers

set -e

echo "=== Stock Trading Bot Build Script ==="
echo ""

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Windows;;
    MINGW*)     MACHINE=Windows;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "Detected OS: ${MACHINE}"

# Check for FreePascal compiler
if command -v fpc &> /dev/null; then
    echo "FreePascal compiler found: $(fpc -iV)"
    COMPILER="fpc"
elif command -v dcc32 &> /dev/null; then
    echo "Delphi compiler found"
    COMPILER="delphi"
else
    echo "Error: No suitable compiler found!"
    echo "Please install FreePascal or Delphi"
    exit 1
fi

# Build with FreePascal
if [ "$COMPILER" = "fpc" ]; then
    echo ""
    echo "Building with FreePascal..."
    
    # Clean previous build
    echo "Cleaning previous build..."
    rm -f StockTradingBot
    rm -f src/*.o src/*.ppu
    rm -f *.o *.ppu
    
    # Build
    echo "Compiling..."
    fpc -O3 -XX -CX -Fusrc StockTradingBot.dpr
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ Build successful!"
        echo "Executable: ./StockTradingBot"
        
        # Make executable
        chmod +x StockTradingBot
    else
        echo ""
        echo "✗ Build failed!"
        exit 1
    fi
fi

echo ""
echo "=== Build Complete ==="
