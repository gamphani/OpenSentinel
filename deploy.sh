#!/bin/bash

# OpenSentinel Deployment Script 🛡️
# Usage: ./deploy.sh

echo "🌍 BEGINNING OPENSENTINEL DEPLOYMENT..."

# 1. Update System
echo "🔄 Updating System Packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Docker & Git
echo "🐳 Installing Docker & Dependencies..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common git gnupg lsb-release

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Clone Repository (If not already present)
if [ -d "OpenSentinel" ]; then
    echo "📂 Repository exists. Pulling latest changes..."
    cd OpenSentinel
    git pull
else
    echo "📂 Cloning OpenSentinel Repository..."
    # REPLACE WITH YOUR GITHUB URL
    git clone https://github.com/YOUR-USERNAME/OpenSentinel.git
    cd OpenSentinel
fi

# 4. Environment Setup
if [ ! -f .env ]; then
    echo "🔑 Generating Production Environment Keys..."
    # Generate a random secret key for JWT
    RANDOM_KEY=$(openssl rand -hex 32)
    
    # Create .env file
    cat <<EOT >> .env
POSTGRES_USER=sentinel_admin
POSTGRES_PASSWORD=production_secure_password_$(openssl rand -hex 8)
POSTGRES_DB=sentinel_mesh_db
SECRET_KEY=$RANDOM_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
NODE_COUNTRY_CODE=ETH
NEXT_PUBLIC_API_URL=http://$(curl -s ifconfig.me):8000
EOT
    echo "✅ .env file created."
else
    echo "⚠️ .env file already exists. Skipping generation."
fi

# 5. Launch Node
echo "🚀 Launching Docker Containers..."
sudo docker compose up -d --build

echo "---------------------------------------------------"
echo "✅ DEPLOYMENT COMPLETE!"
echo "---------------------------------------------------"
echo "🖥️  Dashboard: http://$(curl -s ifconfig.me):3000"
echo "🔌 API Docs:  http://$(curl -s ifconfig.me):8000/docs"
echo "---------------------------------------------------"