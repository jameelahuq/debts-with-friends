/**
 * Created by HUQ on 10/8/15.
 */
var express = require ("express");
var http = require('http');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var PORT = 3000;

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', router);
app.use(express.static('./public'));

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'friendDebt',
  multipleStatements: true
});

connection.connect();

router.post('/mysql', function(req, res) {
  console.log(req.body.sql);
  console.log(req.body.params);
  connection.query(req.body.sql, req.body.params, function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(400).send({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  })
});

router.post('/transactions', function(req, res) {
  var sql = '\
  SET @from =?; SET @to = ?; SET @amount = ?;\
  INSERT INTO transactions (`from`, `to`, `amount`) values (@from, @to, @amount);\
  UPDATE friends SET balance = balance - @amount WHERE id = @from;\
  UPDATE friends SET balance = balance + @amount WHERE id = @to;' ;

  connection.query(sql, req.body.params,
      function(err, rows, fields) {
        console.log(req.body.params);
        if (err) {
          console.log(err);
          res.status(400).send({error: 'Internal server error'});
        }
        else {
          res.send(rows);
        }
      })
});

router.get('/transactions/:cid', function(req, res) {
  console.log(req.params.cid);
  var sql = '\
  SELECT * FROM transactions, customers WHERE\
  transactions.`from` = = ? AND transactions.`to` = customers.id;';

  connection.query(sql, [req.params.cid], function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(400).send({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  })
});

router.get('/friends', function(req, res) {
  var sql = 'SELECT id, name, balance FROM friends;';
  connection.query(sql, function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  })
});
http.createServer(app).listen(3000);
console.log("http server is running on " + 3000);


