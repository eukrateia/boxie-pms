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
    },
    {
      name: 'pms-frontend',
      script: 'serve',
      args: '-s frontend/build -l 3000',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
