module.exports = {
  apps: [
    {
      name: "admin",
      exec_mode: "cluster",
      instances: "max",
      script: "serve",
      autorestart: true,
      env: {
        PM2_SERVE_PATH: "./dist",
        PM2_SERVE_PORT: 5173,
        PM2_SERVE_SPA: "true",
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PM2_SERVE_PATH: "./dist",
        PM2_SERVE_PORT: 5173,
        PM2_SERVE_SPA: "true",
      },
    },
  ],
};
