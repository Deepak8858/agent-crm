# Docker Production Deployment

## Quick Start
```bash
# 1. Update Clerk credentials in docker-compose.yml
# 2. Start the application
docker-compose up -d

# 3. Run database migrations
docker-compose exec app npx prisma db push

# 4. Access the app
http://localhost:3000
```

## Environment Variables to Update
Before running, update these in `docker-compose.yml`:

```yaml
- CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret  # From https://dashboard.clerk.com
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key
```

## Production Deployment Options

### Option 1: DigitalOcean App Platform (Current - RECOMMENDED)
- ✅ Build completed successfully
- ❌ Missing environment variables
- 🎯 Fix: Add env vars in DigitalOcean dashboard

### Option 2: DigitalOcean Droplet with Docker
```bash
# On your droplet:
git clone your-repo
cd agent-crm
docker-compose up -d
```

### Option 3: Local Docker Development
```bash
docker-compose up -d
```

## Monitoring
```bash
# Check logs
docker-compose logs -f app

# Check database
docker-compose exec db psql -U postgres -d agent_crm
```