var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "melor233",
  database: "test_db"
});
connection.on('error',(err)=>{console.log(err)})
connection.connect();
connection.query("CREATE TABLE test_table(id INT(11) PRIMARY KEY,name VARCHAR(20))", function(error, results, fields) {
  // if (error) throw error;
  if(error){
    console.log(error)
  }
  console.log("The results & field is: ", results, fields);
});
connection.query("SHOW TABLES", function(error, results, fields) {
  // if (error) throw error;
  console.log("The results & field is: ", results,fields);
});

connection.end();
