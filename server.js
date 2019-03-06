var express = require('express');
var path = require('path');
var app = express();
var md5 = require('md5');
var hbs = require('express-handlebars');
var mySql = require('mysql');


try{
var connection = mySql.createConnection({
  host: '104.198.21.61',
  user: 'serviceAccount',
  password: 'password'
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
    console.log('connected to database');
}
try{
connection.connect(function(err){
    try{
        connection.query("INSERT INTO vanPool.UserList VALUES ('Jim Bean', 'this@this.edu','user','password',1)")
    }
    catch(err){
        console.log(err)
    }
       
    });
}
catch(err){
    console.log(err);
}



app.engine( 'hbs', hbs( {
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');           // Use Handlebars view engine
app.use(express.static('public'));

app.get('/home', function(req, res, next) {
    res.render('home', {layout: 'default', template: 'home-template'});
});

app.get('/login', function(req, res, next) {
    res.render('login', {layout: 'default', template: 'login-template'});
});

app.get('/signup', function(req, res, next) {
    res.render('signup', {layout: 'default', template: 'signup-template'});
});

app.get('/', (req, res) => {
    res.redirect('/home');
})

app.listen(3000);