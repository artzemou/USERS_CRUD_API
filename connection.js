var mysql = require('mysql');
const chalk = require('chalk')
require('dotenv').config()
var moment = require('moment')

//Database connection
var connection = mysql.createConnection({
     host     : process.env.HOST,
    user     : process.env.DB_USER,
    password : process.env.PASSWORD,
    database : process.env.DB
})

connection.connect(function(err) {
    if (err) throw err
    else  console.log(chalk`{green ✅  Connected to mysql database ${connection.config.database}}`)
        
})

// keep connection alive 
setInterval( () => {
    var datetime = Date.now()
    connection.query('SELECT 1')
    console.log('Keep alive the connection. ' + datetime)
}, 4000)

module.exports = connection;