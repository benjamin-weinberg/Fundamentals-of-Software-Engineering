var express = require('express');
var path = require('path')
var app = express();

var mySql = require('mysql');

var connection = mySql.createConnection({
  host: '104.198.21.61',
  user: 'serviceAccount',
  password: 'password'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.static('public'));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/home.html'));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/signup.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'));
})

app.get('/', (req, res) => {
    res.redirect('/home');
})

app.listen(3000);