#!/bin/bash

# Start script for Budget Manager
# This script starts both backend and frontend servers

echo "Starting Budget Manager..."
echo ""

# Start backend in background
echo "Starting backend server on port 3000..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend server on port 3001..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Backend running on http://localhost:3000 (PID: $BACKEND_PID)"
echo "Frontend running on http://localhost:3001 (PID: $FRONTEND_PID)"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait

