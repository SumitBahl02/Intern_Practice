# Redis Setup Instructions

This application uses Redis for caching. If you're experiencing Redis connection errors, follow these steps:

## Option 1: Run Redis with Docker

```bash
docker run --name redis -p 6379:6379 -d redis:alpine
```

## Option 2: Install Redis Locally

### Windows
1. Download and install Redis for Windows from https://github.com/microsoftarchive/redis/releases
2. Run Redis server: `redis-server`

### macOS
```bash
brew install redis
brew services start redis
```

### Linux
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

## Option 3: Disable Redis (Temporary Solution)

If you can't run Redis locally, you can modify the application to work without Redis:

1. The application has been updated to gracefully handle Redis connection failures
2. It will continue to work without Redis, but without caching functionality

## Verifying Redis Connection

To verify Redis is running:

```bash
# Using redis-cli
redis-cli ping
# Should return PONG

# Using Docker
docker exec -it redis redis-cli ping
# Should return PONG
```

## Troubleshooting

If you continue to experience issues:

1. Check if Redis is running on port 6379: `netstat -an | findstr 6379`
2. Check if another process is using port 6379
3. Try changing the Redis port in your .env file:
   ```
   REDIS_URL="redis://localhost:6380"
   ```
   And run Redis on that port: `redis-server --port 6380`