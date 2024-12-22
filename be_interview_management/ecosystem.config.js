module.exports = {
  apps: [
    {
      name: 'management_interview',
      script: 'dist/src/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1000M',
      env: {
        NODE_ENV: 'development',
        PORT: 8086,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
