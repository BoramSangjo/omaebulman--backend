var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
// DB SETTING
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  user : 'root',
  password : 'root',
  database : 'boram'
});
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

router.get('/',function(req,res,next) {
  res.render('main');
})



module.exports = router;