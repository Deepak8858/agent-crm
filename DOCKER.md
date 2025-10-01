# Docker Commands for Agent CRM

## 🐳 Docker Setup Commands

### 1. Build the Docker Image
```bash  
docker build -t agent-crm .
```

### 2. Run with Environment File
```bash
docker run -p 3000:3000 --env-file .env agent-crm
```

### 3. Run with Inline Environment Variables
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://username:password@host:5432/database" \
  -e NEXTAUTH_SECRET="your-32-character-secret-key" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e CLERK_SECRET_KEY="sk_test_your_clerk_secret" \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_key" \
  agent-crm
```

### 4. Run in Background (Detached Mode)
```bash
docker run -d -p 3000:3000 --env-file .env --name crm-app agent-crm
```

### 5. Run with Volume for Development
```bash
docker run -p 3000:3000 \
  --env-file .env \
  -v $(pwd):/app \
  --name crm-app \
  agent-crm
```

## 🗄️ Docker Compose (Recommended)

Create a `docker-compose.yml` file for easier management:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/agent_crm
      - NEXTAUTH_SECRET=your-32-character-secret-key
      - NEXTAUTH_URL=http://localhost:3000
      - CLERK_SECRET_KEY=sk_test_your_clerk_secret
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=agent_crm
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Run with Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

## 🛠️ Docker Management Commands

### Container Management
```bash
# List running containers
docker ps

# Stop container
docker stop crm-app

# Start stopped container
docker start crm-app

# Remove container
docker rm crm-app

# View logs
docker logs crm-app
docker logs -f crm-app  # Follow logs
```

### Image Management
```bash
# List images
docker images

# Remove image
docker rmi agent-crm

# Rebuild image
docker build --no-cache -t agent-crm .
```

## 🔧 Environment Variables for Docker

Create a `.env` file in your project root:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/agent_crm

# Next.js
NODE_ENV=production
NEXTAUTH_SECRET=your-32-character-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# Optional: Voice Agent
VOICE_AGENT_WEBHOOK_SECRET=your-webhook-secret
```

## 🚀 Quick Start Commands

### Option 1: Simple Run (with existing database)
```bash
# Build
docker build -t agent-crm .

# Run (make sure you have .env file)
docker run -p 3000:3000 --env-file .env agent-crm
```

### Option 2: Full Stack with PostgreSQL
```bash
# Create docker-compose.yml (see above)
# Then run:
docker-compose up -d
```

### Option 3: Development Mode
```bash
# Build development image
docker build -t agent-crm:dev .

# Run with volume mounting for development
docker run -p 3000:3000 \
  --env-file .env \
  -v $(pwd):/app \
  agent-crm:dev
```

## 🔍 Troubleshooting

### Check if container is running
```bash
docker ps
```

### View container logs
```bash
docker logs crm-app
```

### Access container shell
```bash
docker exec -it crm-app sh
```

### Test health endpoint
```bash
curl http://localhost:3000/api/health
```

## 📝 Notes

- Replace `your-32-character-secret-key` with actual secret (generate with `openssl rand -base64 32`)
- Replace Clerk keys with your actual Clerk development keys
- Ensure your database is accessible from the Docker container
- The app will be available at `http://localhost:3000`