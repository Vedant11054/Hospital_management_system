#!/bin/bash

# Hospital Management System - Quick Deployment Script
# This script helps with local deployment setup

set -e

echo "🏥 Hospital Management System - Deployment Setup"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Create .env files if they don't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your API URL"
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your credentials"
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Build frontend
echo ""
echo "🔨 Building frontend for production..."
npm run build

echo ""
echo "✅ Deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env with your API URL"
echo "2. Update backend/.env with Google Sheets credentials"
echo "3. Choose a deployment platform:"
echo "   - Docker: docker-compose up"
echo "   - Heroku: git push heroku main"
echo "   - Self-hosted: npm start (backend) + nginx (frontend)"
echo "   - Vercel + Railway: Push to GitHub and deploy"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
