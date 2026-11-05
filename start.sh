#!/bin/bash
# IntelliProject Startup Script
# Starts both FastAPI backend and Vite frontend concurrently

echo "=========================================================="
echo " Starting IntelliProject - Intelligent Project Mentor"
echo " Autonomous Multi-Agent Research & Capstone Platform"
echo "=========================================================="


# Automatically resolve current directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Start Backend in background
echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..."
cd "$PROJECT_DIR/backend"
source ./venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# Trap Ctrl+C to kill backend when frontend exits
trap "kill $BACKEND_PID" EXIT

# 2. Start Frontend
echo "[2/2] Starting React (Vite) Frontend on http://localhost:5173..."
cd "$PROJECT_DIR/frontend"
npm run dev

# Wait for background processes
wait $BACKEND_PID
