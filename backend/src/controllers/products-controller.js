const Product = require("../models/product");
const redisClient = require("../redis/redis-server");

exports.addProduct = async ({ name, price }, ID) => {
  const product = new Product({ ID, name, price });

  try {
    const result = product.save();
    redisClient.del("Products");
    return result;
  } catch (error) {
    return console.log(error.message);
  }
};

exports.getProducts = async () => {
  try {
    const products = await Product.find({}).select({ _id: 0, __v: 0 });
    redisClient.set("Products", JSON.stringify(products));
    return products;
  } catch (error) {
    return console.log(error.message);
  }
};

exports.updateProduct = async (ID, update) => {
  try {
    const result = await Product.findOneAndUpdate({ ID }, update);
    redisClient.del("Products");
    return result;
  } catch (error) {
    return console.log(error.message);
  }
};

exports.deleteProduct = async (ID) => {
  try {
    const result = await Product.findOneAndDelete({ ID });
    redisClient.del("Products");
    return result;
  } catch (error) {
    return console.log(error.message);
  }
};
