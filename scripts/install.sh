#!/bin/bash

# RAGVault Installation Script for Unix-based systems (Linux/macOS)

set -e

echo "🚀 Installing RAGVault..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    echo "Visit https://nodejs.org/ for installation instructions."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm is available"

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is available"
    docker --version
else
    echo "⚠️  Docker is not installed. RAGVault requires Docker for ChromaDB."
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    echo "You can continue the installation, but Docker will be required to run RAGVault."
fi

# Install RAGVault globally
echo "📦 Installing RAGVault globally..."
npm install -g ragvault

echo "🎉 RAGVault installed successfully!"
echo "📚 Run 'ragvault' to start the application."
echo ""
echo "💡 Make sure Docker is running before using RAGVault."