const express=require("express")
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const ioLogic=require('./io-logic');
const Constant= require("../config/Constant");
const path = require('path')
const { msgCfg, errCfg, eventCfg} =Constant;
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
app.post("/upload", (req, res) => {
  var form = new formidable.IncomingForm();
  form.maxFileSize=5*1024*1024;
  form.uploadDir=path.resolve(__dirname,'../upload');
  form.parse(req, function(err, fields, files) {
    uploadHandler("fulAvatar",files);
    res.redirect("/upload");
  });
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});