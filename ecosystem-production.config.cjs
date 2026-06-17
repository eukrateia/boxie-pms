// PM2 Production Config - Backend Only
// Frontend is served directly by Nginx from /var/www/boxie-pms/frontend/build

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
      out_file: './logs/backend-out.log',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
