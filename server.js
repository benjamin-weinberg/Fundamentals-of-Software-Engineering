var express = require('express');
var path = require('path');
var app = express();
var md5 = require('md5');
var hbs = require('express-handlebars');
var script = require('./public/script');


var mySql = require('mysql');
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

app.use(express.static(__dirname));



app.listen(3000);