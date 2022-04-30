const { config } = require("dotenv");

config();

exports.module = {
  URL_HOST: process.env.URL_HOST,
  APP_PORT: process.env.APP_PORT,
  MONGODB_CLUSTER: process.env.MONGODB_CLUSTER,
  MONGODB_USER: process.env.MONGODB_USER,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  REDIS_CLUSTER: process.env.REDIS_CLUSTER,
  REDIS_PORT: process.env.REDIS_PORT,
  SECRET_PASS: process.env.SECRET_PASS,
  NODE_ENV: process.env.NODE_ENV,
  API_DESCRIPTION: process.env.API_DESCRIPTION,
};
