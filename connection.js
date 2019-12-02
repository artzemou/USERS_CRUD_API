var mysql = require('mysql');
const chalk = require('chalk')
require('dotenv').config()

console.log(process.env.DB_USER)
//Database connection
var connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.DB_USER,
    password : process.env.PASSWORD,
    database : process.env.DB
});




connection.connect(function(err) {
    if (err) throw err
    else  console.log(chalk`{green ✅  Connected to mysql database ${connection.config.database}}`)
    
});



module.exports = connection;