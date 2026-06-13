#!/bin/bash

# Push to GitHub with Personal Access Token
# Usage: ./scripts/push-with-token.sh "commit message" [branch-name]

set -e

# Configuration
TOKEN="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"
REPO_OWNER="Lumakara"
REPO_NAME="Porto-Fakhul"
DEFAULT_BRANCH="emailjs-integration"

# Get commit message
COMMIT_MESSAGE="${1:-'Add EmailJS contact form integration'}"
BRANCH_NAME="${2:-$DEFAULT_BRANCH}"

echo "🚀 GitHub Push Script with Token"
echo "=================================="
echo ""
echo "Repository: $REPO_OWNER/$REPO_NAME"
echo "Branch: $BRANCH_NAME"
echo "Commit: $COMMIT_MESSAGE"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized in this directory"
    echo "   Run: git init"
    exit 1
fi

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo "⚠️  No changes to commit"
    echo "   Make sure you've added the EmailJS files first."
    exit 1
fi

echo "📋 Changes to be committed:"
echo "---------------------------"
git status --short
echo ""

# Add all files
echo "➕ Adding files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

# Check if branch exists
if git branch --list "$BRANCH_NAME" | grep "$BRANCH_NAME"; then
    echo "↪️  Switching to existing branch: $BRANCH_NAME"
    git checkout "$BRANCH_NAME"
else
    echo "🌱 Creating new branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"
fi

# Configure remote with token
REMOTE_URL="https://$TOKEN@github.com/$REPO_OWNER/$REPO_NAME.git"
echo ""
echo "🔗 Configuring remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push -u origin "$BRANCH_NAME"; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🔗 Branch URL:"
    echo "   https://github.com/$REPO_OWNER/$REPO_NAME/tree/$BRANCH_NAME"
    echo ""
    echo "🔗 Create Pull Request:"
    echo "   https://github.com/$REPO_OWNER/$REPO_NAME/compare/main...$BRANCH_NAME?expand=1"
    echo ""
    echo "📝 Files added:"
    echo "--------------"
    find . -type f -name "*.md" -o -name "*.html" -o -name "*.json" -o -name "*.sh" -o -name "*.js" | grep -E "(docs/|public/emailjs|scripts/|\.env)" | sort
    echo ""
    echo "🎯 Next Steps:"
    echo "-------------"
    echo "1. Review the changes on GitHub"
    echo "2. Create a Pull Request to merge into main"
    echo "3. Test the contact form after deployment"
    echo "4. Configure EmailJS with your credentials"
    echo ""
else
    echo "❌ Failed to push to GitHub"
    echo "   Check your token permissions and network connection."
    exit 1
fi

# Clean up token from remote URL (security)
echo "🔒 Cleaning up token from git configuration..."
git remote set-url origin "https://github.com/$REPO_OWNER/$REPO_NAME.git"

echo ""
echo "✨ Done! The EmailJS integration is ready for review."
echo ""
echo "📚 Documentation created:"
echo "   - docs/EMAILJS_SETUP_GUIDE.md"
echo "   - docs/EMAILJS_CHECKLIST.md"
echo "   - docs/SETUP_EMAILJS_QUICK.md"
echo "   - public/emailjs-templates/"
echo "   - scripts/setup-emailjs.sh"
echo ""
echo "💡 Remember to:"
echo "   1. Add your EmailJS credentials to .env file"
echo "   2. Configure EmailJS security settings"
echo "   3. Test the contact form thoroughly"