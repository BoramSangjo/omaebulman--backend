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
      // var boardLength = rows.length;
      // res.send(""+boardLength);
      // res.render('board',{
      //   boardLength : boardLength,
      //   rows : rows
      // })
    }
  })
})

router.get('/write',function(req,res,feilds) {
  res.render('write');
})

router.get('/:id',function(req,res,feilds) {
  var boardId = req.params.id;
  var sql = `UPDATE board SET hit = hit + 1 WHERE id = ? `;
  var params = []
  conn.query(sql,boardId,function(err,rows,field) {
    if(err){
      console.log(err);
    }else{
      console.log(""+boardId);
      //res.send(""+boardId);
      var sql = `SELECT * from board where id = ?`;
      var params = [boardId];
      conn.query(sql,params,function(er,rows,fields) {
        console.log('글'+boardId+"조회 요청");
        boardId = boardId +1 ;
        res.render('boardView',{
          rows: rows,
          id : boardId
        });  
      })
    }
  })

})

router.post('/write',function(req,res,next) {
  var title = req.body.title;
  var description = req.body.description;

  var todayDate = new Date().toISOString().slice(0,10);

  var sql = `INSERT INTO board (title,description,date) values (?,?,?)`
  var params = [title,description,todayDate];
  conn.query(sql,params,function(err,rows,field) {
    if(err){
      console.log(err);
      return res.status(500);
    }else{
      console.log("추가성공"+title+description+todayDate);
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