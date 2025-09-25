#!/bin/bash
set -e

echo "=== PAYLOAD DEPLOYMENT (AUTOMATED) ==="
echo "Starting automated deployment at $(date)"

# Configuration
SERVER_IP="3.109.185.222"
SERVER_USER="ubuntu"
SSH_KEY="$HOME/.ssh/tngss_pem.pem"
SERVER_PATH="/opt/payload-app"
LOCAL_PATH="."

# Node.js paths (update these if different)
NODE_PATH="/home/ubuntu/.nvm/versions/node/v22.15.0/bin"
NPM_CMD="$NODE_PATH/npm"
PM2_CMD="$NODE_PATH/pm2"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to handle errors
handle_error() {
	echo -e "${RED}[X] Error occurred during deployment${NC}"
	echo -e "${RED}Check the output above for details${NC}"
	exit 1
}

# Trap errors
trap handle_error ERR

echo -e "${YELLOW}>> Step 1: Syncing source code to server...${NC}"
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

echo -e "${GREEN}[OK] Source code synced successfully${NC}"

echo -e "${YELLOW}>> Step 2: Installing dependencies...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "cd $SERVER_PATH && PATH=$NODE_PATH:\$PATH $NPM_CMD ci"
echo -e "${GREEN}[OK] Dependencies installed${NC}"

echo -e "${YELLOW}>> Step 3: Building application...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "cd $SERVER_PATH && PATH=$NODE_PATH:\$PATH $NPM_CMD run build"
echo -e "${GREEN}[OK] Application built successfully${NC}"

echo -e "${YELLOW}>> Step 4: Copying static assets...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "cd $SERVER_PATH && cp -r .next/static .next/standalone/.next/"
echo -e "${GREEN}[OK] Static assets copied${NC}"

echo -e "${YELLOW}>> Step 5: Restarting PM2 process...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "cd $SERVER_PATH && PATH=$NODE_PATH:\$PATH $PM2_CMD restart payload-app" ||
	ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "cd $SERVER_PATH && PATH=$NODE_PATH:\$PATH $PM2_CMD start ecosystem.config.cjs"
echo -e "${GREEN}[OK] PM2 process restarted${NC}"

echo -e "${BLUE}>> Step 6: Checking deployment status...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "PATH=$NODE_PATH:\$PATH $PM2_CMD status payload-app"

echo -e "${GREEN}*** DEPLOYMENT COMPLETED SUCCESSFULLY! ***${NC}"
echo -e "${BLUE}Deployment finished at $(date)${NC}"
echo ""
echo -e "${YELLOW}>> Useful commands:${NC}"
echo "  Check logs: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'PATH=$NODE_PATH:\$PATH $PM2_CMD logs payload-app'"
echo "  Check status: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'PATH=$NODE_PATH:\$PATH $PM2_CMD status'"
echo "  Restart app: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'PATH=$NODE_PATH:\$PATH $PM2_CMD restart payload-app'"
