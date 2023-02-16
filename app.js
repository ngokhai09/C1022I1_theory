var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mysql = require("mysql");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const fileUpload = require("express-fileupload");
const { truncateSync } = require("fs");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(fileUpload({ createParentPath: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use("/", indexRouter);
// app.use("/users", usersRouter);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "testdb",
});

connection.connect(function (err) {
  if (err) {
    throw err.stack;
  }
  console.log("connect success");
});

app.get("/", async (req, res) => {
  let {offset, page} = req.query;
  console.log(offset, page);
  let sql = "Select * from products limit 3 offset " + offset;
  connection.query(sql, function (err, data) {
    res.render("index", { data, title: "Wellcome" });
  });
});
app.get("/create", (req, res) => {
  res.render("create");
});
app.post("/create", (req, res) => {
  let {avatar} = req.files;
  avatar.mv("./public/images/" + avatar.name);
  res.json("Succes");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
