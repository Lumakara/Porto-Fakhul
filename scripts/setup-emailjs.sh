#!/bin/bash

# Porto-Fakhul EmailJS Setup Script
# Run this script to set up EmailJS for the contact form

set -e

echo "📧 Porto-Fakhul EmailJS Setup Script"
echo "======================================"
echo ""

# Check for Node.js for better UX
if command -v node &> /dev/null; then
    echo "✅ Node.js detected. Using interactive setup..."
    node scripts/generate-env.js
    exit 0
fi

echo "⚠️  Node.js not found. Using basic setup..."
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists."
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

echo ""
echo "📋 Please enter your EmailJS credentials:"
echo ""
echo "ℹ️  Get your credentials from:"
echo "   1. Public Key: EmailJS Dashboard → Account → API Keys"
echo "   2. Service ID: EmailJS Dashboard → Email Services"
echo "   3. Template IDs: EmailJS Dashboard → Email Templates"
echo ""

# Get credentials from user
read -p "Enter EmailJS Public Key (user_xxxxxxxx): " PUBLIC_KEY
read -p "Enter EmailJS Service ID (service_xxxxxx): " SERVICE_ID
read -p "Enter Notification Template ID (template_xxxxxx): " TEMPLATE_CONTACT
read -p "Enter Auto-Reply Template ID (template_yyyyyy) [optional, press Enter to skip]: " TEMPLATE_AUTOREPLY

# Create .env file
cat > .env << EOF
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=${PUBLIC_KEY}
VITE_EMAILJS_SERVICE_ID=${SERVICE_ID}
VITE_EMAILJS_TEMPLATE_CONTACT=${TEMPLATE_CONTACT}
VITE_EMAILJS_TEMPLATE_AUTOREPLY=${TEMPLATE_AUTOREPLY}

# Development Notes
# 1. Restart dev server after updating this file
# 2. Check console logs for debugging
# 3. Test with real email addresses
# 4. Monitor EmailJS dashboard for usage

# Security Configuration
# Add these domains to EmailJS Security → Allowed Origins:
# - http://localhost:5173
# - https://porto-fakhul.vercel.app
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""

# Create necessary directories
mkdir -p public/emailjs-templates

echo "📁 Directory structure checked:"
echo "   - public/emailjs-templates/ ✓"
echo ""

# Check if template files exist
if [ ! -f "docs/emailjs-autoreply-template.html" ]; then
    echo "⚠️  Warning: docs/emailjs-autoreply-template.html not found"
    echo "   Please check if the template file exists."
fi

if [ ! -f "public/emailjs-templates/contact-notification.html" ]; then
    echo "⚠️  Warning: public/emailjs-templates/contact-notification.html not found"
fi

if [ ! -f "public/emailjs-templates/simple-autoreply.html" ]; then
    echo "⚠️  Warning: public/emailjs-templates/simple-autoreply.html not found"
fi

echo ""
echo "📝 Next Steps:"
echo "=============="
echo "1. Restart your development server:"
echo "   npm run dev"
echo ""
echo "2. Test the contact form:"
echo "   - Fill out the form in your portfolio"
echo "   - Check your email for notification"
echo "   - Check visitor email for auto-reply"
echo ""
echo "3. Configure EmailJS Security:"
echo "   - Go to EmailJS Dashboard → Security"
echo "   - Add allowed origins:"
echo "     - http://localhost:5173 (development)"
echo "     - https://porto-fakhul.vercel.app (production)"
echo ""
echo "4. Monitor email delivery:"
echo "   - Check EmailJS Activity Log"
echo "   - Monitor spam folders"
echo ""
echo "📚 Documentation:"
echo "================"
echo "For detailed instructions, see:"
echo "- docs/EMAILJS_SETUP_GUIDE.md (Complete guide)"
echo "- docs/SETUP_EMAILJS_QUICK.md (Quick start)"
echo "- docs/EMAILJS_CHECKLIST.md (Verification)"
echo ""
echo "❓ Troubleshooting:"
echo "=================="
echo "If emails are not sending:"
echo "1. Check console logs in browser"
echo "2. Verify .env variables are correct"
echo "3. Check EmailJS dashboard for errors"
echo "4. Ensure templates are published (not draft)"
echo ""
echo "✨ Setup complete! ✨"
echo ""

# Test if variables are set
if [ -z "$TEMPLATE_AUTOREPLY" ]; then
    echo "ℹ️  Note: Auto-reply is disabled (TEMPLATE_AUTOREPLY is empty)"
    echo "   Visitors will not receive confirmation emails."
fi

echo ""
echo "💡 Tip: Install Node.js for better setup experience next time!"
echo "      The Node.js version provides validation and better UX."