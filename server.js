// =============== Node Setup =======================
    var express = require('express');
    var app = express();
    var hbs = require('express-handlebars');
    var session = require('express-session');
    var cookieParser = require('cookie-parser');
    var md5 = require('md5');
    var mySql = require('mysql');
    var bodyParser = require('body-parser')

    var path = require('path');
    var script = require('./public/script');

// ================= Express Setup ===================

    app.set('view engine', 'hbs');                     // Use Handlebars view engine

    app.use(express.static('public'));                 // set public folder as static (accessable by user from pages)
    app.use(express.static(__dirname));
    app.use(cookieParser());                           // parse cookies sent from user
    app.use(session({secret: "Your secret key"}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.engine( 'hbs', hbs( {                          // Handlebars templating setup
        extname: 'hbs',
        defaultView: 'default',
        layoutsDir: __dirname + '/views/layouts/',
        partialsDir: __dirname + '/views/partials/'
    }));



// ================ Temp auth stuff ======================
    var Users = [];

// ========== Attempt mysql connection stuff =============
    try{
        var connection = mySql.createConnection({
        host: '104.198.21.61',
        user: 'root',
        password: 'Team8-SoftwareFund'
    });
    }
    catch(error){
        console.log(error);
    }

    try{
        connection.connect();
    }
    catch(error){
        console.log(error);
    }
    finally{
        console.log('connected');
    }
    try{
        connection.query('Select * from vanPool.UserList', function(err,restults,fields){
            console.log(restults);
        });
    }
    catch(error){
        console.log(error);
    }
    finally{
        //console.log(restult);
    }




// ================ Express Views Setup ==========================

    // ***** Home *****
        app.get('/home', function(req, res, next) {
            res.render('home', {layout: 'default', template: 'home-template'});
        });

    // ***** Login *****
        app.get('/login', function(req, res, next) {
            res.render('login', {layout: 'default', template: 'login-template'});
        });

        app.post('/login', function(req, res){
            console.log(Users);
            if(!req.body.username || !req.body.password){
            res.render('login', {message: "Please enter both username and password"});
            } else {
            Users.filter(function(user){
                if(user.username === req.body.username && user.password === req.body.password){
                    req.session.user = user;
                    res.redirect('/protected_page');
                }
            });
            res.render('login', {message: "Invalid credentials!"});
            }
        });

    // ***** Signup *****
        app.get('/signup', function(req, res, next) {
            res.render('signup', {layout: 'default', template: 'signup-template'});
        });

        app.post('/signup', function(req, res){
            console.log(req)
            if(!req.body.username || !req.body.password){
            res.status("400");
            res.send("Invalid details!");
            } else {
                // var sql = "SELECT * from "
                // connection.query(sql, function (err, results) {
                //     if(err) console.log(err.stack);
                // }); 

                Users.filter(function(user){
                if(user.username === req.body.username){
                    res.render('signup', {
                        message: "User Already Exists! Login or choose another user id"});
                }
            });
            var newUser = {username: req.body.username, password: req.body.password};
            Users.push(newUser);
            req.session.user = newUser;
            console.log("New User created: " + newUser)
            res.redirect('/protected_page');
            }
        });

    // ***** Logout *****
        app.get('/logout', function(req, res){
            req.session.destroy(function(){
            console.log("user logged out.")
            });
            res.redirect('/login');
        });

    // ***** Test Protected Page *****
        app.get('/protected_page', checkSignIn, function(err, req, res, next){
            res.render('protected_page', {username: req.session.user.username})
        });

        app.use('/protected_page', function(err, req, res, next){
            console.log(err);
               //User should be authenticated! Redirect him to log in.
               res.redirect('/login');
        });


    // ***** Default -> Home *****
        app.get('/', (req, res) => {
            res.redirect('/home');
        })


// ==================== Helper Functions ========================
    function checkSignIn(req, res){
        if(req.session.user){
            next();     //If session exists, proceed to page
        } 
        else {
            var err = new Error("Not logged in!");
            console.log(req.session.user);
            next(err);  //Error, trying to access unauthorized page!
        }
    }

// ================== Start Express Server ======================
    app.listen(3000);