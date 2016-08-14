'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const db = require('./models');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function(){
  console.log(`Server listening on port: ${app.get('port')}`);
  db.sequelize.sync();
});