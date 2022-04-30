const Address = require("../models/address");
const Order = require("../models/order");
const Payment = require("../models/payment-method");
const Product = require("../models/product");
const User = require("../models/user");

exports.addOrder = async (req, res) => {
  const order = prepareOrder(req);
  const newOrder = new Order(order);

  try {
    await newOrder.save();

    res.status(201).json({
      message: "The order has been added.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Unable to add order.",
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const admin = true;
    let orders = await Order.find({}).select({ _id: 0, __v: 0 });
    orders = await getOrderDitails(orders, admin);

    res.status(200).json({
      orders_list: orders,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not access orders.",
    });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const orders = req.orders;

  try {
    const admin = false;
    const ordersDetails = await getOrderDitails(orders, admin);

    res.status(200).json({
      my_orders: ordersDetails,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not access this user's orders.",
    });
  }
};

exports.addProductToOrder = async (req, res) => {
  const product = req.product;
  const quantityToAdd = parseInt(req.query.quantity, 10);
  const order = req.order;

  try {
    order.total += quantityToAdd * product.price;
    let hasProduct = false;

    for (let i = 0; i < order.products.length; i++) {
      if (
        JSON.stringify(order.products[i].product) ===
        JSON.stringify(product._id)
      ) {
        order.products[i].quantity += quantityToAdd;
        hasProduct = true;
        break;
      }
    }

    if (!hasProduct) {
      order.products.push({ product: product._id, quantity: quantityToAdd });
    }

    await order.save();

    res.status(200).json({
      message: "The product has been added to the order.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not add the product.",
    });
  }
};

exports.removeProductFromOrder = async (req, res) => {
  const product = req.product;
  const quantityToRemove = parseInt(req.query.quantity, 10);
  const order = req.order;

  try {
    const original = order.products.filter(
      (element) =>
        JSON.stringify(element.product) === JSON.stringify(product._id)
    );

    const originalQuantity = original[0].quantity;
    let orderUpdate;

    if (originalQuantity < quantityToRemove) {
      throw new Error(
        "You cannot remove a quantity greater than the original quantity."
      );
    } else if (originalQuantity === quantityToRemove) {
      orderUpdate = removeAllAmounts(order, quantityToRemove, product);
    } else {
      orderUpdate = decreaseAmount(
        order,
        originalQuantity,
        quantityToRemove,
        product
      );
    }

    await orderUpdate.save();

    res.status(200).json({
      message: "The product has been deleted/reduced from the order.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not delete/reduce the product.",
    });
  }
};

exports.updatePaymentInOrder = async (req, res) => {
  const payment = req.payment;
  const order = req.order;

  try {
    order.payment_method = payment._id;
    await order.save();

    res.status(200).json({
      message: "The payment method has been changed.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not change the payment method.",
    });
  }
};

exports.updateAddress = async (req, res) => {
  const address = req.address;
  const order = req.order;

  try {
    order.address = address._id;
    await order.save();

    res.status(200).json({
      message: "The address has been updated.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not change the address.",
    });
  }
};

exports.updateOrderState = async (req, res) => {
  const state = req.query.state;
  const order = req.order;

  try {
    order.state = state;
    await order.save();

    res.status(200).json({
      message: "The order's state has been changed.",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Could not change the order's state.",
    });
  }
};

function prepareOrder(req) {
  return {
    products: [
      {
        product: req.product._id,
        quantity: req.body.quantity,
      },
    ],
    total: req.product.price * req.body.quantity,
    address: req.address,
    payment_method: req.payment,
    state: req.body.state,
    owner: req.user._id,
  };
}

function removeAllAmounts(order, quantityToRemove, product) {
  order.total -= quantityToRemove * product.price;

  for (let i = 0; i < order.products.length; i++) {
    if (
      JSON.stringify(order.products[i].product) === JSON.stringify(product._id)
    ) {
      order.products.splice(i, 1);
      break;
    }
  }

  return order;
}

function decreaseAmount(order, originalQuantity, quantityToRemove, product) {
  order.total -= quantityToRemove * product.price;

  for (let i = 0; i < order.products.length; i++) {
    if (
      JSON.stringify(order.products[i].product) === JSON.stringify(product._id)
    ) {
      order.products[i].quantity = originalQuantity - quantityToRemove;
      break;
    }
  }

  return order;
}

async function getOrderDitails(orders, admin) {
  let orderDitails = await getCommonDitails(orders);

  if (admin) {
    orderDitails = addAdminDitails(orders, orderDitails);
  }

  return orderDitails;
}

async function getCommonDitails(orders) {
  let ordersList = [];

  for (let i = 0; i < orders.length; i++) {
    const {
      products,
      total,
      payment_method,
      state,
      address: theAddress,
    } = orders[i];

    const productList = await getProductsDitails(products);
    const { method } = await Payment.findById(payment_method);
    const { address } = await Address.findById(theAddress);

    ordersList[i] = {
      products: productList,
      total,
      payment_method: method,
      address,
      state,
    };
  }

  return ordersList;
}

async function getProductsDitails(products) {
  let productList = [];

  for (let j = 0; j < products.length; j++) {
    const { ID, name, price } = await Product.findById(products[j].product);
    const quantity = products[j].quantity;
    productList[j] = { ID, name, price, quantity };
  }

  return productList;
}

async function addAdminDitails(orders, orderDitails) {
  for (let i = 0; i < orders.length; i++) {
    const { orderId, owner } = orders[i];
    const { name, email } = await User.findById(owner);

    orderDitails[i].name = name;
    orderDitails[i].email = email;
    orderDitails[i].orderId = orderId;
  }

  return orderDitails;
}
