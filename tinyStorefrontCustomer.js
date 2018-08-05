var mysql = require("mysql");
//need to also require inquirer

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "", //need to re-set my password on mysql database to nothing
  database: "tiny_storefront_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res); //this should log the result as json
        connection.end(); //ends the connection
    });
};