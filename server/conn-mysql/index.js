const mysql = require("mysql");
const cfg=require("./mysql-db-cfg");
// console.log(cfg);
const connection = mysql.createConnection(cfg);
connection.on('error',(err)=>{console.log(err)})
connection.connect();
connection.query("SHOW TABLES", function(error, results, fields) {
  // if (error) throw error;
  if (error) {
    console.log(error);
  }
  console.log("The results & field is: ", results, fields);
});

connection.end();
module.exports=function (cfg,sql,callback) {
  const connection = mysql.createConnection(cfg);
  connection.on("error", err => {
    console.log(err);
  });
  connection.connect();
  connection.query(sql, function(error, results, fields) {
    // if (error) throw error;
    if (error) {
      console.log(error);
    }
    console.log("The results & field is: ", results, fields);
    typeof callback==='function'&&callback(results,fields);
  });
  connection.end();
}
