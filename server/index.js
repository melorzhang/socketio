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
http.listen(3000, function() {
	console.log("listening on *:3000");
});