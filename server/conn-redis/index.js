const redis = require("redis");
const cfg = require('./config');

  client = redis.createClient(cfg);
// client.auth(RDS_PWD, function() {
//   console.log("通过认证");
// });

client.on("connect", function() {
  client.set("author", "Wilson", redis.print);
  client.get("author", redis.print);
  console.log("connect");
});
client.on("ready", function(err) {
  console.log("ready");
});
client.on("error", function(err) {
  console.log("Error " + err);
});
module.exports=client;