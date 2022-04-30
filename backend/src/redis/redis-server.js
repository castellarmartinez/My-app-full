const redis = require("redis");
const { module: config } = require("../config");

const redisClient = redis.createClient({
  url: `redis://${config.REDIS_CLUSTER}`
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

(async function connect() {
  await redisClient.connect();
  console.log(`Redis connection: ${config.REDIS_CLUSTER}`);
})();

module.exports = redisClient;
