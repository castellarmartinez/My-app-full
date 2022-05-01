require("./redis/redis-server");
require("./db/mongoose");
require("./services");
const cors = require("cors");
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerOptions = require("./utils/swaggerOptions");
const passport = require("passport");
const helmet = require("helmet");
const { module: config } = require("./config");
const swaggerSpecs = swaggerJsDoc(swaggerOptions);

const port = config.APP_PORT || 3000;
const environment = config.NODE_ENV;
const apiDescription = config.API_DESCRIPTION;

const app = express();

app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(helmet());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use("/users", require("./routes/users-route"));
app.use("/products", require("./routes/products-route"));
app.use("/payment", require("./routes/payment-route"));
app.use("/orders", require("./routes/order-route"));
app.use(require("./routes/public"));
app.use(require("./routes/auth"));
app.use(require("./routes/payments"));

app.listen(port, () => {
  console.log(`Application is running on: ${port}`);
  console.log(`Enviroment: '${environment}'`);
  console.log(`Description: '${apiDescription}'`);
});

module.exports = app;
