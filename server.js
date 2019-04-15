// =============== Node Setup =======================
var express = require("express");
var app = express();
var hbs = require("express-handlebars");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var md5 = require("md5");
var mySql = require("mysql");
var bodyParser = require("body-parser");

var path = require("path");
var script = require("./public/script");

// ================= Express Setup ===================

app.set("view engine", "hbs"); // Use Handlebars view engine

app.use(express.static("public")); // set public folder as static (accessable by user from pages)
app.use(express.static(__dirname));
app.use(cookieParser()); // parse cookies sent from user
app.use(session({ secret: "Your secret key" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine(
  "hbs",
  hbs({
    // Handlebars templating setup
    extname: "hbs",
    defaultView: "default",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
  })
);

// ================= MySQL Connection =====================
var connection = mySql.createConnection({
  host: "104.198.21.61",
  user: "root",
  password: "Team8-SoftwareFund"
});
connection.connect();
/*
  Queries to find differnt things

  Rides without a driver:
    Select * from vanPool.rideList where driverID = -1;

  List of rides that the user has been in:
    Select * from vanPool.rideList inner join vanPool.ridePassengers on rideID where userID = currentUserID;
  
  List of rides the driver has driven:
    Select * from vanPool.rideList where driverID = currentUserID;
  
  List of all people on a ride:
     Select * from vanPool.UserList inner 
     join vanPool.ridePassengers on UserList.userNum = ridePassengers.userNum where rideID = InputNumber;
   
  List of rides starting at X location with a driver:
    Select * from vanPool.rideList where start = 'UserInputStart' and driverID != -1;;
  
  List of rides ending at X location with a driver:
    Select * from vanPool.rideList where dest = 'UserInputDest' and driverID != -1;;

  List of rides on X date with a driver: 
    Select * from vanPool.rideList where rideDate = 'YYYY:MM:DD' and driverID != -1;

  List of rides at X time with a driver:
    Select * from vanPool.rideList where startTime >='HH:MM:00' 
    and startTime <= 'HH:MM:00' and driverID != -1;;

  List of rides between dates:
    Select * from vanPool.rideList where rideDate >= 'YYYY:MM:DD' 
    and rideDate <='YYYY:MM:DD' and driverID != -1;

  Adding user to a ride: 
    Insert into vanPool.ridePassengers values (UserNum, RideNum);
  
  List of all riders:
    Select * from vanPool.UserList where accountType = 3;

  List of all drivers:
    Select * from vanPool.UserList where accountType = 2;
  
  If you can think of anything else just put them under these and I'll work on getting them done.
  

*/
// ================ Express Views Setup ==========================

// ***** Home *****
app.get("/home", function(req, res, next) {
  if (req.session.user)
    res.render("home", {
      layout: "default",
      template: "home-template",
      username: req.session.user.username
    });
  else res.render("home", { layout: "default", template: "home-template" });
});

// ***** Login *****
app.get("/login", function(req, res, next) {
  res.render("login", { layout: "default", template: "login-template" });
});

app.post("/login", function(req, res) {
  var sql =
    "SELECT * FROM vanPool.UserList WHERE username = '" +
    req.body.username +
    "' AND password = '" +
    md5(req.body.password) +
    "';";
  connection.query(sql, function(err, results) {
    if (err) console.log(err.stack);
    if (results[0] == undefined) {
      res.redirect("login");
    } else {
      var user = {
        name: results[0].name,
        email: results[0].email,
        username: results[0].username,
        password: md5(results[0].password),
        accountType: results[0].accountType
      };
      req.session.user = user;
      if (user.accountType == 2) {
        res.redirect("/rider");
      } else if (user.accountType == 3) {
        res.redirect("/driver");
      } else {
        res.redirect("/home");
      }
    }
  });
});

// ***** Signup *****
app.get("/signup", function(req, res, next) {
  res.render("signup", { layout: "default", template: "signup-template" });
});

app.post("/signup", function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status("400");
    res.send("Invalid details!");
  } else {
    var newUser;
    var sql =
      "SELECT * FROM vanPool.UserList WHERE username = '" +
      req.body.username +
      "';";
    connection.query(sql, function(err, results) {
      if (err) console.log(err.stack);
      if (results[0] != undefined) {
        res.redirect("signup");
      } else {
        console.log(req.body.accountType);
        console.log(req.body.name);
        newUser = {
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: md5(req.body.password),
          accountType: req.body.accountType
        };
        sql =
          "INSERT INTO vanPool.UserList (name, email, username, password, accountType) VALUES ('" +
          newUser.name +
          "', '" +
          newUser.email +
          "', '" +
          newUser.username +
          "', '" +
          newUser.password +
          "', '" +
          newUser.accountType +
          "');";
        connection.query(sql, function(err, results) {
          if (err) console.log(err.stack);
          req.session.user = newUser;
          if (newUser.accountType == 2) {
            res.redirect("/rider");
          } else if (newUser.accountType == 3) {
            res.redirect("/driver");
          }
        });
      }
    });
  }
});

// ***** Logout *****
app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/login");
});

// ***** Test Protected Page *****
app.get("/protected_page", isAuthenticated, function(req, res) {
  res.render("protected_page", {
    layout: "default",
    template: "home-template",
    username: req.session.user.username
  });
});

// ***** Rider Page *****
app.get("/rider", isAuthenticated, function(req, res) {
  res.render("rider", {
    layout: "default",
    template: "home-template",
    username: req.session.user.username
  });
});

// ***** Driver Page *****
app.get("/driver", isAuthenticated, function(req, res) {
  res.render("driver", {
    layout: "default",
    template: "home-template",
    username: req.session.user.username
  });
});

// ***** Default -> Home *****
app.get("/", (req, res) => {
  res.redirect("/home");
});

// ***** Create Ride ******
app.get("/createRide", (req, res) => {
  res.redirect("/createRide");
});

app.post("/createRide", function(req, res) {
  var newRide;
  newRide = {
    start: req.body.startLoc,
    dest: req.body.dest,
    startTime: req.body.startTime,
  };
  sql =
    "INSERT INTO vanPool.rideList (startLocation, dest, startTime) VALUES ('" +
    newRide.startLoc +
    "', '" +
    newRide.dest +
    "', '" +
    newRide.startTime +
    "');";
  connection.query(sql, function(err, results) {
    if (err) console.log(err.stack);
    res.redirect("/home");
  });
});

// ==================== helper functions ========================
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/");
}
// ================== Start Express Server ======================
app.listen(3000);
