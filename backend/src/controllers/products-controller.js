const Product = require("../models/product");
const redisClient = require("../redis/redis-server");

exports.addProduct = async (req, res) => {
  const { name, price } = req.body;
  const ID = req.params.id;
  const product = new Product({ ID, name, price });

  try {
    product.save();
    redisClient.del("Products");

    res.status(201).json({
      message: "The product has been added.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Unable to add the product.",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).select({ _id: 0, __v: 0 });
    redisClient.set("Products", JSON.stringify(products));

    res.status(200).send({
      products,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not access products.",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const ID = req.params.id;
  const update = req.body;

  try {
    await Product.findOneAndUpdate({ ID }, update);
    redisClient.del("Products");

    res.status(200).json({
      message: "The product has been updated.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not update the product.",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const ID = req.params.id;

  try {
    await Product.findOneAndDelete({ ID });
    redisClient.del("Products");

    res.status(200).json({
      message: "The product has been deleted.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not delete the product.",
    });
  }
};
