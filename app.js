var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const Cfg= require("./CFG");
const ioLogic= require('./ioLogic');
var bodyParser = require("body-parser");
app.use(bodyParser.json()); //Content-Type: application/json
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/pages/index.html");
});
app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/pages/login/index.html");
});
app.post("/login", function(req, res) {
  console.log('req',req.body);
  const data=req.body;
  if(data.userName==='admin'&&data.psw==='123456'){
    res.send({
      token:'billion'
    })
  }else{
    res.end(JSON.stringify({errMsg:'nice try!',errCode:-500}));
  }
});
app.get("/customer", function(req, res) {
  res.sendFile(__dirname + "/pages/customer/index.html");
});
app.get("/service", function(req, res) {
  res.sendFile(__dirname + "/pages/service/index.html");
});
const users=[];
// ioLogic(io,users);

http.listen(3000, function() {
  console.log("listening on *:3000");
});
