const mongoose = require("mongoose");
const { module: config } = require("../config");
const User = require("../models/user");

const uri = `mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}\
@${config.MONGODB_CLUSTER}/${config.DB_NAME}?retryWrites=true&w=majority`;

async function database() {
  try {
    await mongoose.connect(uri);
    console.info("Connected to the database:", config.DB_NAME);

    const users = await User.find({ isAdmin: true });

    if (users.length === 0) {
      await addAdminUser();
    }
  } catch (error) {
    console.error("Database error:", error.message);
  }
}

database();

async function addAdminUser() {
  const admin = new User({
    name: "Administrator",
    username: "Admin",
    email: "admin@delilahresto.com",
    password: "@)T0(Z]p",
    isAdmin: true,
    phone: 5557777,
  });

  admin.save();
}
