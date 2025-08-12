#!/bin/bash

# Exit on any error
set -e

echo "📦 Installing frontend dependencies..."
npm install

echo "🛠️ Building React frontend with Vite..."
npm run build || { echo "❌ React build failed"; exit 1; }

echo "🧹 Cleaning old dist files from backend static folder..."
rm -rf LoginBackend/static/dist
mkdir -p LoginBackend/static

echo "📁 Copying built dist/ folder to FastAPI static folder..."
cp -r dist LoginBackend/static/

echo "🚀 Launching FastAPI app..."
cd LoginBackend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
