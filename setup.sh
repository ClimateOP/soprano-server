#!/data/data/com.termux/files/usr/bin/bash

echo "🎵 Soprano Server Setup"
echo "========================"

# Update packages
echo "📦 Updating packages..."
pkg update -y && pkg upgrade -y

# Install dependencies
echo "📦 Installing Node.js and git..."
pkg install -y nodejs git python

# Install yt-dlp
echo "📦 Installing yt-dlp..."
pip install yt-dlp

# Clone the server repo
echo "📥 Cloning soprano-server..."
cd ~ && git clone https://github.com/ClimateOP/soprano-server.git

# Install node dependencies
echo "📦 Installing server dependencies..."
cd ~/soprano-server && npm install

# Setup Termux:Boot auto-start
echo "⚙️ Setting up auto-start on boot..."
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start-soprano.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/soprano-server && node server.js &
EOF
chmod +x ~/.termux/boot/start-soprano.sh

echo ""
echo "✅ Setup complete!"
echo ""
echo "⚠️  To enable auto-start on boot:"
echo "    Install 'Termux:Boot' from F-Droid"
echo "    Open it once to activate"
echo ""
echo "🚀 Starting server now..."
cd ~/soprano-server && node server.js