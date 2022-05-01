module.exports = {
  apps: [
    {
      name: "api",
      script: "./src/index.js",
      watch: true,

      env_local: {
        NODE_ENV: "local",
        API_DESCRIPTION: "API is running on development.",
      },

      env_production: {
        NODE_ENV: "production",
        API_DESCRIPTION: "API is running on production. Be careful!",
      },
    },
  ],
};
