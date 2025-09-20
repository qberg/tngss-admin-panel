#!/bin/bash
set -e
echo "=== PAYLOAD DEPLOYMENT (INTERACTIVE) ==="
echo "Starting deployment at $(date)"

# Configuration
SERVER_IP="3.109.185.222" # Replace with your actual server IP
SERVER_USER="ubuntu"
SSH_KEY="$HOME/.ssh/tngss_pem.pem" # Replace with your actual SSH key path
SERVER_PATH="/opt/payload-app"
LOCAL_PATH="."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Syncing source code to server...${NC}"

# Sync only source files
rsync -avz --delete \
	-e "ssh -i $SSH_KEY" \
	--exclude 'node_modules' \
	--exclude '.next' \
	--exclude 'dist' \
	--exclude '.git' \
	--exclude '.env.local' \
	--exclude '*.log' \
	--exclude 'deploy*.sh' \
	--exclude 'migrationlogs.txt' \
	"$LOCAL_PATH/" "$SERVER_USER@$SERVER_IP:$SERVER_PATH/"

echo -e "${GREEN}✅ Source code synced${NC}"
echo -e "${YELLOW}🔧 Connecting to server for build...${NC}"
echo "Run these commands on the server:"
echo "  cd /opt/payload-app"
echo "  npm ci"
echo "  npm run build"
echo "  cp -r .next/static .next/standalone/.next/"
echo "  cp -r public .next/standalone/"
echo "  pm2 restart payload-app || pm2 start ecosystem.config.js"
echo ""

# Connect to server
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" -t "cd /opt/payload-app && bash"
