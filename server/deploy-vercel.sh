#!/bin/bash

echo "🚀 Force Redeploying to Vercel with Fresh Build"
echo "================================================"
echo ""

# Navigate to server directory
cd "/media/Main Files/pythonprojects/goal_tracker/server"

# Delete .vercel folder to clear cache
if [ -d ".vercel" ]; then
    echo "🗑️  Removing .vercel cache folder..."
    rm -rf .vercel
fi

# Show current files
echo ""
echo "📁 Current project structure:"
echo "api/index.py: $([ -f 'api/index.py' ] && echo '✅ exists' || echo '❌ missing')"
echo "vercel.json: $([ -f 'vercel.json' ] && echo '✅ exists' || echo '❌ missing')"
echo "requirements.txt: $([ -f 'requirements.txt' ] && echo '✅ exists' || echo '❌ missing')"
echo ""

# Check if mangum is in requirements.txt
if grep -q "mangum" requirements.txt; then
    echo "✅ mangum found in requirements.txt"
else
    echo "❌ mangum NOT found in requirements.txt"
    echo "⚠️  This will cause deployment to fail!"
    exit 1
fi

echo ""
echo "🔄 Deploying to Vercel with --force flag..."
echo ""

# Deploy with force flag to bypass cache
vercel --prod --force

echo ""
echo "✅ Deployment command completed!"
echo ""
echo "Next steps:"
echo "1. Check the deployment URL in the output above"
echo "2. Visit https://your-url.vercel.app/health to test"
echo "3. Check logs with: vercel logs"
