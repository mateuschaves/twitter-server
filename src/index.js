const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 5000;

mongoose.connect(
  `mongodb+srv://mathchaves:${
    process.env.MONGODB_PASSWORD
  }@cluster0-wlooi.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

app.use((req, res, next) => {
  req.io = io;
  return next();
});
app.use(express.json());
app.use(routes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
