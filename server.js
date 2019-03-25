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
            if (req.session.user) res.render('home', {layout: 'default', template: 'home-template', username: req.session.user.username});
            else res.render('home', {layout: 'default', template: 'home-template'});
        });

    // ***** Login *****
        app.get('/login', function(req, res, next) {
            res.render('login', {layout: 'default', template: 'login-template'});
        });

        app.post('/login', function(req, res){
            var sql = "SELECT * FROM vanPool.UserList WHERE username = '" + req.body.username + "' AND password = '" + md5(req.body.password) + "';";
            connection.query(sql, function (err, results) {
                if (err) console.log(err.stack);
                if (results[0] == undefined){
                    res.redirect('login');
                }
                else{
                    var user = {name: results[0].name, email: results[0].email, username: results[0].username, password: md5(results[0].password), accountType: results[0].accountType};
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
            if(!req.body.username || !req.body.password){
                res.status("400");
                res.send("Invalid details!");
            } 
            else {
                var newUser;
                var sql = "SELECT * FROM vanPool.UserList WHERE username = '" + req.body.username+"';";
                connection.query(sql, function (err, results) {
                    if (err) console.log(err.stack);
                    if (results[0] != undefined){
                        res.redirect('signup');
                    }
                    else{  
                        newUser = {name: req.body.name, email: req.body.email, username: req.body.username, password: md5(req.body.password), accountType: 1};
                        sql = "INSERT INTO vanPool.UserList (name, email, username, password, accountType) VALUES ('" + newUser.name + "', '" +  newUser.email + "', '" + newUser.username +"', '" + newUser.password + "', '" + newUser.accountType +"');";
                        connection.query(sql, function (err, results) {
                            if (err) console.log(err.stack);
                            req.session.user = newUser;
                            res.redirect('/home');
                        });
                    }
                });   
            }
        });

    // ***** Logout *****
        app.get('/logout', function(req, res){
            req.session.destroy();
            res.redirect('/login');
        });

    // ***** Test Protected Page *****
        app.get('/protected_page', isAuthenticated, function(req, res){
            res.render('protected_page', {layout: 'default', template: 'home-template', username: req.session.user.username});
        });


    // ***** Default -> Home *****
        app.get('/', (req, res) => {
            res.redirect('/home');
        })
// ==================== helper functions ========================
    function isAuthenticated(req, res, next) {
        if (req.session.user) return next();
        res.redirect('/');
    }
// ================== Start Express Server ======================
    app.listen(3000);