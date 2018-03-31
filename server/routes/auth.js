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
    var sess = req.session
    res.render('auth',{
      sess : sess.name
    });
})

router.get('/login',function(req,res,next) {
  var sess = req.session
  res.render('login',{
    sess : sess.name
  });
})

router.post('/login',function(req,res,next) {
  var sess = req.session;
  var name = req.body.name;
  var pw = req.body.pw;

  var sql = `SELECT * FROM userinfo WHERE name = (?)`
  var params = [name];
  
  conn.query(sql,params,function(err,rows,field) {
    if(err){
      console.log(err);
      res.send('로그인실패');
    }else{
      if(rows[0] == null){
        res.send('존재하지않는 아이디 또는 비밀번호 입니다..');
        res.sendStatus(401);
      }
      else if(pw == rows[0].pw){
        sess.name = rows[0].name
        sess.pw = rows[0].pw
        return req.session.save(function() {
          console.log('로그인 성공 ! 아이디 :'+sess.name+' 비밀번호 : '+sess.pw);
          res.redirect('/');
      })
      }else{
        res.send('입력하신 아이디 또는 비밀번호가 잘못되었습니다.');
        res.sendStatus(401);
      }
    }
  })
})

router.get('/register',function(req,res,next) {
  var name = req.params.name;
  var pw = req.params.pw;
  var school = req.params.school;
  var sess = req.session;
  res.render('register',{
    sess : sess.name
  });
})

router.get('/logout',function(req,res,next) {
  
  delete req.session.name;
  delete req.session.pw;
  console.log('로그아웃');
  res.send(`<script>alert('로그아웃 되었습니다. 안녕히가세요'); location.href='/';</script>`);
})

router.post('/register',function(req,res,next) {
  var name = req.body.name;
  var pw = req.body.pw;
  var school = req.body.school;
  // var registerInfo = [
  //   id,name,pw
  // ];

  var sql = `SELECT * FROM userinfo WHERE id = ?`
  var params = [name];

  conn.query(sql,params,function(err,rows,fields) {
    if(err){
      return console.log(err);
    }else{
      if(rows[0] == null){
        var sql = `INSERT INTO userinfo (name,pw,school)
        VALUES(?,?,?)`
        var params = [name,pw,school];
        conn.query(sql,params,function(err,rows,fields) {
        if(err){
        console.log(err);
        return res.send('오류!',err);
        }else{
        console.log('회원가입성공!'+name+pw+school);
        res.redirect('/');
        // return res.redirect('/thanks.html');
        }
})
      }else{
        res.send('중복된 아이디 입니다.');
      }
    }
  })

})

module.exports = router;