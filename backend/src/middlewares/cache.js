const redisClient = require("../redis/redis-server");

const cacheProducts = async (req, res, next) => {
  const data = await redisClient.get("Products");

  if (data) {
    const products = JSON.parse(data);
    
    return res.json({
      products
    });
  } else {
    return next();
  }
};

module.exports = cacheProducts;
