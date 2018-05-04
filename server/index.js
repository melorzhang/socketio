/**
 * Created by hp on 2018/5/3.
 */
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
app.use(express.static(path.resolve(__dirname, "../upload")));
const formidable = require("express-formidable");
app.use(
  formidable({
    uploadDir:path.resolve(__dirname,'../upload'),
		maxFieldsSize: 5 * 1024 * 1024,
  })
);
const uploadHandler=require('./upload');
app.post("/upload", (req, res) => {
	// console.log(req.fields, req.files);
  uploadHandler("fulAvatar",req.files);
	res.redirect("/test/uploadImg");
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});