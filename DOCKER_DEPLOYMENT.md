# Docker Deployment Guide - Smart Community Resource Sharing Portal

## Prerequisites
- Docker installed
- Docker Compose installed
- Terminal or CLI access
- Minimum 2 CPUs, 4GB RAM

## Architecture
This deployment includes:
- **Node.js App**: Full-stack application (backend + frontend)
- **MongoDB**: Database for persistent storage
- **Prometheus**: Metrics collection
- **Grafana**: Visualization and monitoring dashboards
- **cAdvisor**: Container resource usage monitoring

## Folder Structure
```
resource_management_fullstack/
├── Dockerfile
├── docker-compose.yml
├── prometheus.yml
├── package.json
├── server/
│   ├── index.js
│   ├── package.json
│   ├── controllers/
│   ├── models/
│   └── middleware/
└── client/
    ├── package.json
    ├── public/
    └── src/
```

## Docker Commands

### 1. Build the Container
```bash
docker-compose build
```

### 2. Start All Services
```bash
docker-compose up -d
```

### 3. View Running Containers
```bash
docker-compose ps
```

### 4. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

### 5. Stop All Services
```bash
docker-compose down
```

### 6. Stop and Remove Volumes (Clean Reset)
```bash
docker-compose down -v
```

## Access Points

After running `docker-compose up -d`, access:

- **Application**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin`
- **cAdvisor**: http://localhost:8080

## Monitoring Setup

### Configure Grafana
1. Open http://localhost:3001
2. Login with admin/admin
3. Add Prometheus data source:
   - Go to Configuration → Data Sources
   - Click "Add data source"
   - Select "Prometheus"
   - URL: `http://prometheus:9090`
   - Click "Save & Test"

### Import Dashboard
1. Go to Dashboards → Import
2. Upload a cAdvisor dashboard JSON or use ID: 893
3. Select Prometheus as data source
4. Click "Import"

### Key Metrics to Monitor
- **CPU Usage**: `container_cpu_usage_seconds_total`
- **Memory Usage**: `container_memory_usage_bytes`
- **Network Traffic**: `container_network_receive_bytes_total`
- **Disk I/O**: `container_fs_io_time_seconds_total`

## Environment Variables

Edit `docker-compose.yml` to customize:

```yaml
environment:
  - NODE_ENV=production
  - MONGODB_URI=mongodb://mongo:27017/communityDB
  - PORT=5000
```

## Production Deployment

For production:
1. Remove volume mounts in app service
2. Set `NODE_ENV=production`
3. Use environment-specific MongoDB URI
4. Enable Grafana authentication
5. Configure proper firewall rules

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5000

# Kill the process or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker-compose ps mongo

# Restart MongoDB
docker-compose restart mongo
```

### Clear All Data and Restart
```bash
docker-compose down -v
docker-compose up -d
```

## Quick Start Commands

```bash
# Clone or navigate to project
cd resource_management_fullstack

# Build and start everything
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Open in browser
start http://localhost:5000
start http://localhost:3001
start http://localhost:8080
```

## Scaling

To run multiple app instances:
```bash
docker-compose up -d --scale app=3
```

Note: You'll need a load balancer (nginx) to distribute traffic.

## Backup MongoDB Data

```bash
# Create backup
docker-compose exec mongo mongodump --out /backup

# Restore backup
docker-compose exec mongo mongorestore /backup
```

## System Requirements

- **Development**: 2 CPUs, 4GB RAM
- **Production**: 4+ CPUs, 8GB+ RAM
- **Disk Space**: 10GB minimum

## Support

For issues:
- Check logs: `docker-compose logs -f`
- Verify all containers are running: `docker-compose ps`
- Restart specific service: `docker-compose restart <service_name>`
