var mySql = require("mysql");
var connection = mySql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ""
});
connection.connect();
var express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});
