const express=require("express")
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const ioLogic=require('./io-logic');
const Constant= require("../config/Constant");
const path = require('path')
const { msgCfg, errCfg, eventCfg} =Constant;

const connMysql=require('./conn-mysql');
const connMysqlCfg=require('./conn-mysql/mysql-db-cfg');
const users={};
ioLogic(io,users);
app.use(express.static(path.resolve(__dirname, '../client/pages')));

const formidable=require('formidable');
const fs=require('fs');
const util = require('util');
try {
  fs.mkdirSync(path.join(__dirname,'../upload'));
  fs.mkdirSync(path.join(__dirname,'../upload/images'));
} catch (error) {
  console.log(error);
  console.log('maybe the dir is already exist');
}
app.use(express.static(path.resolve(__dirname, "../upload")));
const uploadHandler=require('./upload');
const sep=path.sep;
const redisClient=require('./conn-redis');
app.post("/upload", (req, res) => {
  const form = new formidable.IncomingForm();
  form.maxFileSize=5*1024*1024;
  form.uploadDir=path.resolve(__dirname,'../upload');
  form.parse(req, function(err, fields, files) {
    const file=uploadHandler("fulAvatar",files);
    console.log(file);
    const cfg = Object.assign({}, connMysqlCfg);
    cfg.database = "debug_melor_top";
    const fp=file.split(sep);
    const filename=fp[fp.length-1];
    const sql = `INSERT INTO filename (src,filename) VALUES (${JSON.stringify(file)},${JSON.stringify(filename)});`;
    connMysql(cfg, sql, (error, results, fields) => {
      console.log(error, results, fields);
    });
    // redisClient.set('file',filename);
    res.redirect("/upload");
  });
});



http.listen(3000, function() {
	console.log("listening on *:3000");
});