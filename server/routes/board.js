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
  var sess = req.session;
  var todayDate = new Date().toISOString().slice(0,10);
  var data = {};
  var sql = `select * from board`;
  conn.query(sql,function(err,rows,field){
    if(err){
      console.log(err);
    }else{
      console.log("게시판 조회 요청 들어왔습니다."+todayDate);
      res.render('board',{
        sess: sess.name,
        length : rows.length,
        rows:rows
      });
    }
  })
})

router.get('/write',function(req,res,feilds) {
  var sess = req.session
  console.log(sess);
  if(sess.name == null){
    res.send(`<script>alert('글 작성은 회원만 이용할 수 있는 서비스입니다.로그인후 다시 시도해 주세요'); location.href='/';</script>`);
  }else{
    res.render('write',{
      sess : sess.name
    });    
  }
})

router.get('/:id',function(req,res,feilds) {
  var sess = req.session
  var boardId = req.params.id;
  // 조회수 증가
  var sql = `UPDATE board SET hit = hit + 1 WHERE id = ? `;
  var params = []
  conn.query(sql,boardId,function(err,rows,field) {
    if(err){
      console.log(err);
    }else{
      console.log(""+boardId);
      //해당 글 조회
      var sql = `SELECT * from board where id = ?`;
      var params = [boardId];
      conn.query(sql,params,function(er,rows,fields) {
        var boardRows = rows;
        var sql = `SELECT * from userinfo where name = ?`
        var params = [rows[0].writer]
        conn.query(sql,params,function(err,rows,fields) {
          var userRows = rows;
          if(err){
            console.log("에러 ! " +err);
            return res.send('err');
          }
          console.log('글'+boardId+"조회 요청");
          boardId = boardId +1 ;
          //res.send(boardRows[0].title + userRows[0].school);
          //res.json(boardRows[0].title + " " +userRows[0].school  );
          res.render('boardView',{
            sess : sess.name,
            boardRows: boardRows,
            userRows : userRows,
            id : boardId
          });      
        })
      })
    }
  })
})

router.post('/write',function(req,res,next) {
  var sess = req.session;
  var title = req.body.title;
  var description = req.body.description;

  var todayDate = new Date().toISOString().slice(0,10);
  var writer = sess.name;
  var sql = `INSERT INTO board (title,description,date,writer) values (?,?,?,?)`
  var params = [title,description,todayDate,writer];
  conn.query(sql,params,function(err,rows,field) {
    if(err){
      console.log(err);
      return res.status(500);
    }else{
      console.log("추가성공"+" "+title+" "+description+" "+todayDate+" "+writer);
      res.redirect("/board");
      //res.send("추가성공"+title+description+todayDate);
    }
  })
})

router.post('/delete/:id',function(req,res,next) {
  var id = req.params.id;
  var sql = 'delete from board WHERE id=?';
  var params = [id];
  conn.query(sql, params, function(err, rows, fields){
    if(err){
      console.log(err);
    } else {
      console.log("삭제성공");
      res.redirect('/board');
    }
  });
})




module.exports = router;