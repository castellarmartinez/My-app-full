const Address = require("../models/address");
const Order = require("../models/order");
const Payment = require("../models/payment-method");
const Product = require("../models/product");
const User = require("../models/user");

exports.addOrder = async (order) => {
  try {
    const newOrder = new Order(order);
    return await newOrder.save();
  } catch (error) {
    return console.log(error.message);
  }
};

exports.getOrders = async () => {
  try {
    const admin = true;
    const orders = await Order.find({}).select({ _id: 0, __v: 0 });
    return getOrderDitails(orders, admin);
  } catch (error) {
    return console.log(error.message);
  }
};

exports.getOrdersByUser = async (orders) => {
  try {
    const admin = false;
    return getOrderDitails(orders, admin);
  } catch (error) {
    return console.log(error.message);
  }
};

exports.addProductToOrder = async (product, quantityToAdd, order) => {
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

    return await order.save();
  } catch (error) {
    return console.log(error.message);
  }
};

exports.removeProductFromOrder = async (product, quantityToRemove, order) => {
  try {
    const original = order.products.filter(
      (element) =>
        JSON.stringify(element.product) === JSON.stringify(product._id)
    );
    const originalQuantity = original[0].quantity;

    if (originalQuantity < quantityToRemove) {
      throw new Error(
        "You cannot remove a quantity greater than the original quantity."
      );
    } else if (originalQuantity === quantityToRemove) {
      const orderUpdate = removeAllAmounts(order, quantityToRemove, product);
      return await orderUpdate.save();
    } else {
      const orderUpdate = decreaseAmount(
        order,
        originalQuantity,
        quantityToRemove,
        product
      );
      return await orderUpdate.save();
    }
  } catch (error) {
    return console.log(error.message);
  }
};

exports.updatePaymentInOrder = async (payment, order) => {
  try {
    order.payment_method = payment._id;
    return await order.save();
  } catch (error) {
    return console.log(error.message);
  }
};

exports.updateOrderState = async (state, order) => {
  try {
    order.state = state;
    return await order.save();
  } catch (error) {
    return console.log(error.message);
  }
};

exports.updateAddress = async (address, order) => {
  try {
    order.address = address._id;
    return await order.save();
  } catch (error) {
    return console.log(error.message);
  }
};

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
