var express = require('express');
var path = require('path')
var app = express()


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


app.listen(3000);