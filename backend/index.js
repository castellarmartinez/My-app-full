require('./services')
const express = require("express");
const cors = require("cors");
const passport = require('passport');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(passport.initialize());
app.use(express.json());

app.use(require('./routes/public'));
app.use(require('./routes/auth'));

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}!`);
});
