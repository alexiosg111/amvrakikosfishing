#!/bin/bash

echo "🚀 Setting up Authentication System for Amvrakikos Fishing Trip Website"
echo ""
echo "Step 1: Installing required dependencies..."
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

echo ""
echo "Step 2: Generating Prisma migration..."
npx prisma migrate dev --name add-auth-models

echo ""
echo "Step 3: Seeding database..."
npx prisma db seed

echo ""
echo "Step 4: Generate NEXTAUTH_SECRET..."
echo "Run: ./scripts/generate-secret.sh"
echo ""
echo "✅ Authentication system setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run ./scripts/generate-secret.sh to get your NEXTAUTH_SECRET"
echo "2. Copy .env.example to .env.local"
echo "3. Add NEXTAUTH_SECRET to .env.local"
echo "4. Optionally add Google OAuth credentials"
echo "5. Optionally add Resend API key for email functionality"
echo "6. Start the dev server: npm run dev"
echo ""
echo "🔑 Default Admin Credentials:"
echo "Email: admin@amvrakikosfishing.com"
echo "Password: Admin123!"
echo ""
echo "⚠️  IMPORTANT: Change the admin password in production!"
