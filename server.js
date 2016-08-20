'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const db = require('./models');
var Card = db.Card;

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(function(req, res, next){
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Cache-Control', 'no-cache');
//   next();
// });

app.get('/api/tasks', function(req, res){
  Card.findAll()
  .then(function(data){
    res.json(data);
  });
});

app.post('/api/tasks', function(req, res){
  Card.create({
    title: req.body.title
  })
  .then(function(data){
    res.json(data);
  });
});

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function(){
  console.log(`Server listening on port: ${app.get('port')}`);
  db.sequelize.sync();
});