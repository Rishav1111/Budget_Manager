# Docker Setup for MySQL

## Quick Start

### Step 1: Install Docker Desktop

If you don't have Docker installed:
1. Download Docker Desktop for Mac: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Wait for Docker to be running (whale icon in menu bar)

### Step 2: Start MySQL with Docker

```bash
cd /Users/rishavshrestha/Desktop/Website
docker-compose up -d
```

This will:
- Download MySQL 8.0 image (first time only)
- Create and start MySQL container
- Create database `budget_manager`
- Create user `rishav123` with password `rishav123`
- Expose MySQL on port 3306

### Step 3: Verify MySQL is Running

```bash
# Check if container is running
docker ps

# Check MySQL logs
docker-compose logs mysql

# Test connection
docker exec -it budget_manager_mysql mysql -u rishav123 -prishav123 budget_manager -e "SHOW DATABASES;"
```

### Step 4: Connect with MySQL Workbench

Use these settings:
```
Connection Name: Budget Manager (Docker)
Hostname:        localhost
Port:            3306
Username:        rishav123
Password:        rishav123
Default Schema:  budget_manager
```

## Docker Commands

### Start MySQL
```bash
docker-compose up -d
```

### Stop MySQL
```bash
docker-compose down
```

### Stop and Remove Data (WARNING: Deletes all data)
```bash
docker-compose down -v
```

### View Logs
```bash
docker-compose logs -f mysql
```

### Access MySQL Command Line
```bash
docker exec -it budget_manager_mysql mysql -u rishav123 -prishav123 budget_manager
```

### Restart MySQL
```bash
docker-compose restart mysql
```

## Configuration

The `docker-compose.yml` file is configured with:
- **Database:** `budget_manager`
- **User:** `rishav123`
- **Password:** `rishav123`
- **Port:** `3306`
- **Data Persistence:** Data is stored in a Docker volume

## Troubleshooting

### Port 3306 Already in Use

If you have MySQL already running on port 3306:

**Option 1:** Stop the existing MySQL
```bash
# Stop local MySQL
brew services stop mysql
# Or use System Preferences → MySQL → Stop Server
```

**Option 2:** Change Docker port
Edit `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"  # Change 3306 to 3307
```
Then update `.env`:
```env
DB_PORT=3307
```

### Container Won't Start

```bash
# Check logs
docker-compose logs mysql

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Reset Database

```bash
# Stop and remove everything
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Benefits of Docker

✅ No need to install MySQL on your Mac
✅ Consistent setup across different machines
✅ Easy to start/stop/reset
✅ Isolated from your system MySQL
✅ Data persists in Docker volume

## Your Backend Configuration

Your `.env` file is already configured correctly:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=rishav123
DB_PASSWORD=rishav123
DB_DATABASE=budget_manager
```

Just start Docker and your backend will connect automatically!


