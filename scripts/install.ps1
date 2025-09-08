# RAGVault Installation Script for Windows (PowerShell)

Write-Host "🚀 Installing RAGVault..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    
    # Extract version number and check if it's >= 18
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "❌ Node.js version 18+ is required. Current version: $nodeVersion" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ and try again." -ForegroundColor Red
    Write-Host "Visit https://nodejs.org/ for installation instructions." -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    npm --version | Out-Null
    Write-Host "✅ npm is available" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm and try again." -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is available: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker is not installed. RAGVault requires Docker for ChromaDB." -ForegroundColor Yellow
    Write-Host "Please install Docker Desktop from https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Yellow
    Write-Host "You can continue the installation, but Docker will be required to run RAGVault." -ForegroundColor Yellow
}

# Install RAGVault globally
Write-Host "📦 Installing RAGVault globally..." -ForegroundColor Blue
try {
    npm install -g ragvault
    Write-Host "🎉 RAGVault installed successfully!" -ForegroundColor Green
    Write-Host "📚 Run 'ragvault' to start the application." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Make sure Docker Desktop is running before using RAGVault." -ForegroundColor Yellow
} catch {
    Write-Host "❌ Failed to install RAGVault. Please check your npm configuration." -ForegroundColor Red
    Write-Host "You may need to run this script as Administrator." -ForegroundColor Yellow
    exit 1
}