# PMS Deployment Guide - Hostinger VPS

## Server Information
- **IP Address:** 2.24.94.127
- **Application:** Project Management System (MERN Stack)
- **Frontend Port:** 3000
- **Backend Port:** 5001
- **Database:** MongoDB Atlas (Cloud)

---

## Prerequisites

Before deployment, ensure your Hostinger VPS has:

1. **Node.js & npm** (v18+)
   ```bash
   node --version
   npm --version
   ```

2. **Git** installed
   ```bash
   git --version
   ```

3. **PM2** (process manager)
   ```bash
   npm install -g pm2
   ```

4. **Nginx** (reverse proxy - optional but recommended)
   ```bash
   sudo apt-get install nginx
   ```

---

## Deployment Steps

### Step 1: SSH into Hostinger Server
```bash
ssh root@2.24.94.127
```

### Step 2: Clone Repository
```bash
cd /var/www
git clone https://github.com/eukrateia/boxie-pms.git
cd boxie-pms
git checkout dev
```

### Step 3: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 4: Environment Configuration

**Backend .env file** (`backend/.env`):
```env
PORT=5001
MONGODB_URI=mongodb+srv://pms_user:oF4Z36ghOHjIluDO@cluster0.jifl0iq.mongodb.net/?appName=Cluster0
JWT_SECRET=your-secure-secret-key-here
NODE_ENV=production
```

**Frontend .env file** (`frontend/.env`):
```env
REACT_APP_API_BASE_URL=http://2.24.94.127:5001
```

### Step 5: Build Frontend
```bash
cd frontend
npm run build
cd ..
```

### Step 6: Start with PM2

**Create PM2 ecosystem file** (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [
    {
      name: 'pms-backend',
      script: './backend/src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log'
    },
    {
      name: 'pms-frontend',
      script: 'npx',
      args: 'serve -s frontend/build -l 3000',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log'
    }
  ]
};
```

**Start applications:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 7: Configure Nginx (Recommended)

**Create Nginx config** (`/etc/nginx/sites-available/boxie-pms`):
```nginx
upstream backend {
  server localhost:5001;
}

upstream frontend {
  server localhost:3000;
}

server {
  listen 80;
  server_name 2.24.94.127;

  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # Backend API
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/boxie-pms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs pms-backend
pm2 logs pms-frontend

# Test endpoints
curl http://2.24.94.127:5001/health
curl http://2.24.94.127:3000
```

---

## Accessing Your Application

- **Frontend:** http://2.24.94.127:3000
- **Backend API:** http://2.24.94.127:5001
- **Health Check:** http://2.24.94.127:5001/health

---

## Monitoring & Maintenance

### Check Application Status
```bash
pm2 status
```

### View Real-time Logs
```bash
pm2 monit
```

### Restart Applications
```bash
pm2 restart all
pm2 restart pms-backend
pm2 restart pms-frontend
```

### Stop Applications
```bash
pm2 stop all
```

### Update Code
```bash
cd /var/www/boxie-pms
git pull origin dev
npm install
cd frontend && npm run build && cd ..
pm2 restart all
```

---

## SSL Certificate (Let's Encrypt)

For HTTPS (recommended for production):

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d 2.24.94.127
```

---

## Database

MongoDB Atlas is used (cloud database). No local database setup needed.

Connection string: `mongodb+srv://pms_user:oF4Z36ghOHjIluDO@cluster0.jifl0iq.mongodb.net/?appName=Cluster0`

---

## Troubleshooting

**Port already in use:**
```bash
sudo lsof -i :5001
sudo lsof -i :3000
sudo kill -9 <PID>
```

**PM2 not starting:**
```bash
pm2 delete all
pm2 start ecosystem.config.js
```

**Nginx 502 Bad Gateway:**
- Check backend is running: `pm2 status`
- Check logs: `pm2 logs pms-backend`
- Restart Nginx: `sudo systemctl restart nginx`

---

## Support

For issues:
1. Check logs: `pm2 logs`
2. Check connectivity: `curl http://2.24.94.127:5001/health`
3. Check GitHub: https://github.com/eukrateia/boxie-pms
