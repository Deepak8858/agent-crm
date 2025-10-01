# DigitalOcean Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Update Configuration
Before deploying, update these values in `.do/app.yaml`:

```yaml
# Line 22: Update with your actual GitHub repository
repo: your-github-username/agent-crm

# Lines 65-66: Update with your actual Clerk keys
CLERK_SECRET_KEY: sk_test_your_actual_clerk_secret_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: pk_test_your_actual_clerk_publishable_key_here

# Line 96: Update GitHub repo for migration job
repo: your-github-username/agent-crm
```

### 2. Get Clerk API Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your project
3. Go to "API Keys" section
4. Copy:
   - **Secret Key** (starts with `sk_test_`)
   - **Publishable Key** (starts with `pk_test_`)

## 🚀 Deployment Methods

### Method 1: Deploy via DigitalOcean Dashboard (Recommended)

1. **Login to DigitalOcean**
   ```
   https://cloud.digitalocean.com/apps
   ```

2. **Create New App**
   - Click "Create App"
   - Choose "GitHub" as source
   - Select your repository
   - Upload the `.do/app.yaml` file

3. **Configure Environment Variables**
   Add these in the dashboard:
   ```
   NODE_ENV=production
   NEXTAUTH_SECRET=2zW4bfdt9NR5pBwKt21WTRmAMV8sbHcLxbZSH/zzBGg=
   CLERK_SECRET_KEY=sk_test_your_actual_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key
   ```

4. **Deploy**
   - Review settings
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)

### Method 2: Deploy via doctl CLI

1. **Install doctl**
   ```bash
   # Windows (PowerShell)
   winget install digitalocean.doctl
   
   # Or download from: https://github.com/digitalocean/doctl/releases
   ```

2. **Authenticate**
   ```bash
   doctl auth init
   ```

3. **Deploy**
   ```bash
   doctl apps create .do/app.yaml
   ```

### Method 3: Deploy via GitHub Integration

1. **Push configuration to GitHub**
   ```bash
   git add .do/app.yaml
   git commit -m "Add DigitalOcean configuration"
   git push origin main
   ```

2. **Connect in DigitalOcean Dashboard**
   - Go to Apps → Create App
   - Select GitHub repository
   - DigitalOcean will automatically detect the YAML

## 🔧 Configuration Details

### Database Configuration
```yaml
databases:
  - name: agent-crm-db
    engine: PG
    version: "15"
    size: basic-xxs  # $7/month
    num_nodes: 1
```

### App Configuration
```yaml
services:
  - name: web
    instance_size_slug: basic-xxs  # $5/month
    instance_count: 1
    health_check:
      http_path: /api/health
```

### Cost Breakdown
- **App Instance**: $5/month (basic-xxs)
- **Database**: $7/month (basic-xxs PostgreSQL)
- **Total**: ~$12/month

## 🎯 Post-Deployment

### 1. Verify Deployment
```bash
# Test the health endpoint
curl https://your-app-name.ondigitalocean.app/api/health

# Test the main page
curl https://your-app-name.ondigitalocean.app/
```

### 2. Set up Custom Domain (Optional)
1. Go to App Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### 3. Enable HTTPS
- Automatically enabled for *.ondigitalocean.app domains
- For custom domains, SSL certificates are auto-provisioned

## 🐛 Troubleshooting

### Build Failures
```bash
# Check build logs in DigitalOcean dashboard
# Common issues:
# - Missing environment variables
# - Incorrect Node.js version
# - Database connection issues
```

### Runtime Issues
```bash
# Check runtime logs
# Common issues:
# - Missing CLERK_SECRET_KEY
# - Incorrect DATABASE_URL
# - Permission issues
```

### Database Issues
```bash
# Check database logs
# Run migrations manually:
doctl apps create-deployment <app-id> --force-rebuild
```

## 📊 Monitoring

### Built-in Alerts
- CPU utilization > 80%
- Memory utilization > 80%
- Restart count > 5

### Custom Monitoring
```bash
# Add custom health checks
curl https://your-app.ondigitalocean.app/api/health

# Monitor application metrics
# - Response times
# - Error rates
# - Database connections
```

## 🔄 Updates and Maintenance

### Automatic Deployments
- Enabled via `deploy_on_push: true`
- Deploys automatically on push to main branch

### Manual Deployments
```bash
# Via doctl
doctl apps create-deployment <app-id>

# Via dashboard
# Apps → Your App → Deploy
```

### Database Migrations
- Automatic via pre-deploy job
- Runs `npx prisma db push --accept-data-loss`
- Executes before each deployment