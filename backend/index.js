//express setup main file
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const requestTracker = require("./middlewares/requestTracker");
const routers = require("./routes");
const { PORT = 5000 } = process.env;
const app = express();

//default cors
/* {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
 */

app.use(cors());
app.use(cookieParser());

connectDB();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Use request tracker middleware globally
app.use(requestTracker);

/* -----------API ROUTES------------------ */

app.use("/", routers);

app.use("/health", (req, res) => {
  res.status(200).json({
    message: "Server is working!",
  });
});
app.use("/*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () =>
  console.info(`server is running: http://localhost:${PORT}`)
);
