const express = require('express')
const app = express()
const cors = require('cors')

const mysql = require("mysql");
const chalk = require('chalk')
const bodyParser = require('body-parser')
const connection = require('./connection')
const validator = require('validator')
const PORT = process.env.PORT || 3000
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

	next()
})

// Retrieve all users 
app.get('/users', function (req, res) {
	connection.query('SELECT * FROM users', function (error, results, fields) {
		if (error) throw error;
		return res.status(200).json({ 
			error: false, 
			results 
		})
	})
})

// Retrieve user with id 
app.get('/user/:id', function (req, res) {
	let id = req.params.id;
	if (!id) {
	 	return res.status(400).json({ 
			 error: true, 
			 message: 'Please provide user id' 
		})
	}
	
	connection.query(
		'SELECT * FROM users where id=?', 
		id, 
		function (error, results, fields) {
			if (error) throw error;
			return res.status(200).json({ 
				error: false, 
				result: results[0]
			})
	})
});


// Add a new user  
app.post('/user', function (req, res) {
	const {firstName, name, email, birthday} = req.body
	// Check required fields
	if (!firstName) {
		return res.status(400).json({ 
			error: true, 
			message: 'First name is required' 
		})
   	}
	if (!name) {
		return res.status(400).json({ 
			error: true, 
			message: 'Name is required' 
		})
   	}
	if (!email) {
		return res.status(400).json({ 
			error: true, 
			message: 'Email is required' 
		})
	}
	if ( !validator.isEmail(req.body.email) ) {
		return res.status(400).json({ 
			error: true, 
			message: 'Email is invalid' 
		})
	}
	// Check email unicity
	connection.query(
		'SELECT id FROM users WHERE email = ?', 
		[email], 
		function select (error, results) {
			if (error) throw error
			if (results.length > 0) {
				return res.status(400).json({ 
					error: true, 
					message: 'This user is allready exist' 
				})
			}
			else {
				// All is good... Add user
				connection.query(
					"INSERT INTO users SET ? ", 
					{ firstName, name, email, birthday: validator.toDate(req.body.birthday) }, 
					function (error, results, fields) {
					if (error) throw error
					return res.status(200).json({ 
						error: false, 
						data: results, 
						message: 'New user has been created successfully.' 
					})
				})
			}
	})
})

//  Update user with id
app.put('/user', function (req, res) {
	let {id, firstName, name, email, birthday} = req.body
	if (!id) {
	  return res.status(400).json({ 
		  error: true, 
		  message: 'Please provide user and user id' 
		})
	}
	if (!firstName) {
		return res.status(400).json({ 
			error: true, 
			message: 'First name is required' 
		})
   	}
	if (!name) {
		return res.status(400).json({ 
			error: true, 
			message: 'Name is required' 
		})
   	}
	if (!email) {
		return res.status(400).json({ 
			error: true, 
			message: 'Email is required' 
		})
	}
	if ( !validator.isEmail(req.body.email) ) {
		return res.status(400).json({ 
			error: true, 
			message: 'Email is invalid' 
		})
	}
	birthday = validator.toDate(req.body.birthday)
	connection.query(
		"UPDATE users SET firstName = ?, name = ?, email = ?, birthday = ? WHERE id = ?", 
		[firstName, name, email, birthday, id ], 
		function (error, results, fields) {
			if (error) throw error;
			return res.status(200).json({ 
				error: false, 
				data: results, 
				message: 'User has been updated successfully.' 
			})
	 })
})

//  Delete user
app.delete('/user', function (req, res) {
	let id= req.body.id
	if (!id) {
		return res.status(400).json({ 
			error: true, 
			message: 'Please provide user id' 
		})
	}
	connection.query(
		'DELETE FROM users WHERE id = ?', 
		[id], 
		function (error, results, fields) {
		if (error) throw error;
		return res.status(200).json({ 
			error: false, data: results, 
			message: 'User has been deleted successfully.' 
		})
	})
})



app.listen(PORT, function () {
  console.log(chalk`{green ✅  App listening on port ${PORT}}`)
})