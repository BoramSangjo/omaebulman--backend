var express = require('express');

var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var app = express();

var routes = require('./routes/index.js');
var auth = require('./routes/auth.js');
var board = require('./routes/board.js');
// var shop = require('./routes/shop.js')

//view engine setup
app.set('views','./views');
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.resolve('../client')));
app.use(session({
  secret: '1$!%!%13513',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}))

app.use('/',routes);
app.use('/auth',auth);
app.use('/board',board);
// app.use('/shop',shop);

app.locals.pretty = true;

// 3000 번 리스닝
app.listen(3000,function() {
  console.log("서버가 정상적으로 작동되었습니다..(3000번포트)")
});
