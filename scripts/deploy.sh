#!/bin/bash
# Production deployment script for DigitalOcean

echo "🚀 Starting production deployment..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Seed database with initial data (only if needed)
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database..."
  npm run db:seed
fi

echo "✅ Deployment preparation complete!"