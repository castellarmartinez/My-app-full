const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3000;

// Add headers before the routes are defined
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get("/", (req, res) => {
  console.log("New request GET to /");
  res.send("Hola Mundo!");
});

app.post("/login", (req, res) => {
  console.log("New request POST to /login");
  console.log(req.body);

  const token = "hgjsd8fs6g7s7df67g6sdf43sdg2s3df5sg6s7df7";

  let data = {
    success: true,
    message: `User ${req.body.email} registered correctly`,
    token: token,
    data: req.body,
  };

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`App listening the port [${PORT}]!`);
});
