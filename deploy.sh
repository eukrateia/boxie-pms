#!/bin/bash

# PMS Deployment Script for Hostinger
# Usage: ./deploy.sh

set -e

echo "════════════════════════════════════════════════════════════"
echo "     PMS Deployment to Hostinger (2.24.94.127)"
echo "════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js not found${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm not found${NC}"; exit 1; }
command -v git >/dev/null 2>&1 || { echo -e "${RED}git not found${NC}"; exit 1; }
echo -e "${GREEN}✓ All prerequisites found${NC}"
echo ""

# Install PM2 globally if not installed
if ! command -v pm2 >/dev/null 2>&1; then
  echo -e "${YELLOW}Installing PM2...${NC}"
  npm install -g pm2
  echo -e "${GREEN}✓ PM2 installed${NC}"
fi
echo ""

# Create logs directory
echo -e "${YELLOW}Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

# Stop existing PM2 processes
echo -e "${YELLOW}Stopping existing processes...${NC}"
pm2 delete all 2>/dev/null || true
sleep 2
echo -e "${GREEN}✓ Processes stopped${NC}"
echo ""

# Install serve globally for frontend
echo -e "${YELLOW}Installing serve...${NC}"
npm install -g serve
echo -e "${GREEN}✓ Serve installed${NC}"
echo ""

# Start with PM2
echo -e "${YELLOW}Starting applications with PM2...${NC}"
pm2 start ecosystem.config.js
sleep 3
echo -e "${GREEN}✓ Applications started${NC}"
echo ""

# Save PM2 config
echo -e "${YELLOW}Saving PM2 configuration...${NC}"
pm2 save
pm2 startup > /dev/null 2>&1 || true
echo -e "${GREEN}✓ PM2 configuration saved${NC}"
echo ""

# Show status
echo -e "${YELLOW}Application Status:${NC}"
pm2 status
echo ""

# Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
sleep 2

if curl -s http://localhost:5001/health | grep -q "ok"; then
  echo -e "${GREEN}✓ Backend is running${NC}"
else
  echo -e "${RED}✗ Backend health check failed${NC}"
fi

if curl -s http://localhost:3000 > /dev/null; then
  echo -e "${GREEN}✓ Frontend is running${NC}"
else
  echo -e "${RED}✗ Frontend check failed${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}    DEPLOYMENT COMPLETE!${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Access your application:"
echo "  Frontend:  http://2.24.94.127:3000"
echo "  Backend:   http://2.24.94.127:5001"
echo "  Health:    http://2.24.94.127:5001/health"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs            - View application logs"
echo "  pm2 monit           - Monitor in real-time"
echo "  pm2 restart all     - Restart all applications"
echo ""
echo "Update code:"
echo "  git pull origin dev"
echo "  npm install"
echo "  cd frontend && npm run build && cd .."
echo "  pm2 restart all"
echo ""
