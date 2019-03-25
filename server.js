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

// ================= MySQL Connection =====================
    var connection = mySql.createConnection({
        host: '104.198.21.61',
        user: 'root',
        password: 'Team8-SoftwareFund'
    })
    connection.connect();

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
            console.log("username: " + req.body.username)
            console.log("pass: " + req.body.password)
            var sql = "SELECT * FROM vanPool.UserList WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "';";
            connection.query(sql, function (err, results) {
                console.log("Results: ");
                console.log(results)
                console.log(results[0])
                if (err) console.log(err.stack);
                if (results[0] == undefined){
                    res.redirect('login');
                }
                else{
                    var user = {name: results[0].name, email: results[0].email, username: results[0].username, password: results[0].password, accountType: results[0].accountType};
                    req.session.user = user;
                    res.redirect('/home');
                }
            });   
            
        });

    // ***** Signup *****
        app.get('/signup', function(req, res, next) {
            res.render('signup', {layout: 'default', template: 'signup-template'});
        });

        app.post('/signup', function(req, res){
            console.log("username: " + req.body.username)
            console.log("pass: " + req.body.password)
            if(!req.body.username || !req.body.password){
                res.status("400");
                res.send("Invalid details!");
            } 
            else {
                var sql = "SELECT * FROM vanPool.UserList WHERE username = '" + req.body.username+"';";
                connection.query(sql, function (err, results) {
                    if (err) console.log(err.stack);
                    if (results[0] != undefined){
                        res.redirect('signup');
                    }
                });   
                var newUser = {name: req.body.name, email: req.body.email, username: req.body.username, password: req.body.password, accountType: 1};
                sql = "INSERT INTO vanPool.UserList (name, email, username, password, accountType) VALUES ('" + newUser.name + "', '" +  newUser.email + "', '" + newUser.username +"', '" + newUser.password + "', '" + newUser.accountType +"');";
                connection.query(sql, function (err, results) {
                    if (err) console.log(err.stack);
                    req.session.user = newUser;
                    res.redirect('/home');
                });  
            }
            console.log("New User created: " + newUser)
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