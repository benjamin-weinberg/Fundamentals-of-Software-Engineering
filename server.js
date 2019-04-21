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
var nodemailer = require("nodemailer");

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
// ================= Email Sender =========================
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bnrrideshare@gmail.com',
    pass: 'ece5800Team8'
  }
});
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
    CALL vanPool.rideWithoutDriver
  
  Adding a driver to a ride:
    CALL vanPool.addDriverToRide(req.session.user.userNum, RIDENUM)

  List of rides that the user has been in:
    CALL vanPool.allRidesForUser(USERNUM);
  
  List of rides the driver has driven:
    CALL vanPool.allDrivesForUser(USERNUM);
  
  List of all people on a ride:
     CALL vanPool.listOfUsersInRide(RIDEID);
   
  List of rides starting at X location with a driver:
    CALL vanPool.findRidesByStartLocation(STARTLOCATION);
  
  List of rides ending at X location with a driver:
    CALL vanPool.findRidesByDestination(DEST);

  List of rides on X date with a driver: 
    call vanPool.findRidesOnDate(DATE);

  List of rides at X time with a driver:
    CALL vanPool.findRidesBetweenTimes(TIME1,TIME2);

  List of rides between dates:
    CALL vanPool.findRideBetweenDates(DATE1, DATE2);
    There is a check in this stored procedure so if date2 is less than date1 it will still work

  Adding user to a ride: 
    CALL vanPool.addUserToRide(req.session.user.userNum, RIDENUMBER);
  
  List of all riders:
    CALL vanPool.listRiders();

  List of all drivers:
    CALL vanPool.listDrivers();
  
  Number of rides from todays date onward:
    CALL vanPool.numberOfRidesFromTodayOnwards();
  
  If you can think of anything else just put them under these and I'll work on getting them done.
  

*/
// ================ Express Views Setup ==========================

// ***** Home *****
app.get("/home", function(req, res, next) {
  var sql = "CALL vanPool.allRidesFromTodayOnward();";
  connection.query(sql, function(err, results){
    if(err) console.log(err.stack);
      else{
        if (req.session.user)
          res.render("home", {
          layout: "default",
          template: "home-template",
          username: req.session.user.username,
          context: results[0]
        });
        else res.render("home", { 
        layout: "default", 
        template: "home-template",
        context: results[0]});
      }
  });
});


// ***** Login *****
app.get("/login", function(req, res, next) {
  res.render("login", { layout: "default", template: "login-template" });
});

app.post("/login", function(req, res) {
 //"CALL vanPool.loginUser ('"+ req.body.username +"','"+ md5(req.body.password) +"');";
   var sql =  "SELECT * FROM vanPool.UserList WHERE username = '" +
    req.body.username +
    "' AND userPassword = '" +
    md5(req.body.password) +
    "';";
  connection.query(sql, function(err, results) {
    if (err) console.log(err.stack);
    if (results[0] == undefined) {
      res.redirect("login");
    } else {
      var user = {
        userNum: results[0].userNum,
        name: results[0].name,
        email: results[0].email,
        username: results[0].username,
        userPassword: results[0].userPassword,
        accountType: results[0].accountType
      };
      req.session.user = user;
      if (user.accountType == 2) {
        res.redirect("/driver");
      } else if (user.accountType == 3) {
        res.redirect("/rider");
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
    var sql = "CALL vanPool.findUsername('" + req.body.username + "');";
      // "SELECT * FROM vanPool.UserList WHERE username = '" +
      // req.body.username +
      // "';";
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
          userPassword: md5(req.body.password),
          accountType: req.body.accountType
        };
        sql = "CALL vanPool.addUser('"+newUser.name+"','"+newUser.email+"','"+newUser.username+"','"+newUser.userPassword
        +"','"+newUser.accountType+"');"

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
  var sql = "CALL vanPool.allRidesFromTodayOnward();";
  connection.query(sql, function(err, results){
    if(err) console.log(err.stack);
    else{
    
    res.render("rider", {
    layout: "default",
    template: "home-template",
    username: req.session.user.username,
    context: results[0]
  });
}
});
});

// ***** Driver Page *****
app.get("/driver", isAuthenticated, function(req, res) {
  var sql = "CALL vanPool.rideWithoutDriver();";

  connection.query(sql, function(err, results){
    if(err) console.log(err.stack);
    else{
      res.render("driver", {
        layout: "default",
        template: "home-template",
        username: req.session.user.username,
        context: results[0]
      });
    }
    });
  

});

app.post("/driver", function(req, res){

  var newRide ={
    startLoc: req.body.start,
    dest: req.body.dest,
    startTime: req.body.startTime,
    rideDate: req.body.rideDate,
    driverID: req.session.user.userNum
  };
  
  var sql = "CALL vanPool.addRideFromDriver ('"+newRide.startLoc+"','"+newRide.dest+"','"+newRide.startTime+"','"
  +newRide.rideDate+"','"+newRide.driverID+");"
  // "INSERT INTO vanPool.rideList (start, dest, startTime, rideDate, driverID) VALUES ('" 
  // +newRide.startLoc +"','"+newRide.dest+"','"+newRide.startTime+"','"+newRide.rideDate+"',"
  // +newRide.driverID+");";
  connection.query(sql, function(err, results){
    if(err) console.log(err.stack);
    else{
      res.redirect("/driver");
    }
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
    rideDate: req.body.rideDate
  };
  sql = "call vanPool.addRideFromAdmin('"+newRide.startLoc+"','"+newRide.dest+"','"+newRide.startTime+"','"+newRide.rideDate+"');";
    // "INSERT INTO vanPool.rideList (startLocation, dest, startTime) VALUES ('" +
    // newRide.startLoc +
    // "', '" +
    // newRide.dest +
    // "', '" +
    // newRide.startTime +
    // "');";
  connection.query(sql, function(err, results) {
    if (err) console.log(err.stack);
    res.redirect("/home");
  });
});
// ***** Forgot Password ******

app.get("/forgotPassword", function(req, res, next) {
  res.render("forgotPassword", { layout: "default", template: "signup-template" });
});

app.post("/forgotPassword", function(req, res) {
  //"CALL vanPool.loginUser ('"+ req.body.username +"','"+ md5(req.body.password) +"');";
    var sql =  "SELECT * FROM vanPool.UserList WHERE username = '" +
     req.body.username +
     "' AND email = '" +
     req.body.email +
     "';";
   connection.query(sql, function(err, results) {
     if (err) console.log(err.stack);
     if(results[0] == null){
        console.log('here');

     }
     else{
        var mailOptions ={
          from: 'brnrideshare@gmail.com',
          to: results[0].email,
          subject: "Password Reset",
          html:"<h1>Password Reset<h1> <br> <a href='http://localhost:3000/passwordReset'>Password Reset Link<a>"
       }
       transporter.sendMail(mailOptions, function(err, info){
          if(err) console.log(err.stack);
          else{
            console.log('Email sent: ' + info.response);
          }
       });
     }
   });
   res.redirect("/passwordResetSent");
 });
// ***** Password Rest ******
app.get("/passwordReset", function(req, res, next) {
  res.render("passwordReset", { layout: "default", template: "signup-template" });
});

app.post("/passwordReset", function(req, res) {
  //"CALL vanPool.loginUser ('"+ req.body.username +"','"+ md5(req.body.password) +"');";
    var sql =  "UPDATE vanPool.UserList SET password ='" +
     md5(req.body.password) +
     "' WHERE username = '" +
     req.body.username +
     "';";
   connection.query(sql, function(err, results) {
      if (err) {console.log(err.stack);}
      else{
       
      }
   });
   res.redirect("/home");
 });

 // ***** Link Sent ******
 app.get("/passwordResetSent", function(req, res, next) {
  res.render("passwordResetSent", { layout: "default", template: "signup-template" });
});
// ==================== helper functions ========================
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/");
}
// ================== Start Express Server ======================
app.listen(3000);
