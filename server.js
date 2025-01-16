#!/usr/bin/env node
const express = require("express");
const sqlite3 = require('sqlite3');
const app = express();

// open DB
const db = new sqlite3.Database('./database.db', (err) => {
	if(err){
		console.log('Error happen while oppening the Database');
	} else {
		console.log('connected to the Database');
	}
});

app.get('/', (req, res) => {
	console.log(`GET main Time: ${Date.now()}`);
	const user = req.query.name;
	const id = req.query.id;
	if(user || id){
		db.get(`SELECT * FROM users WHERE name = '${user}' OR id = ${id}`, (err, row) => {
			if(err){
				console.log('Error happen while retreving from rhe database');
			}else{
				if(row){
					const user_id = row.id;
					db.all(`SELECT * FROM notes WHERE user_id = ${user_id}`, (err, rows) => {
						if(err){
							console.log('Error happen while retreving from the database');
						}else{
							if(rows){
								res.end(JSON.srtingify(rows.body));
							}else{
								res.end('You don\'t have any notes')
							}
						}
					});
				}else{
					res.end('There no user found')
				}
			}
		});
	}else{
		res.end('notebook server')
	}
});

// Routes
const usersRoute  = require('./routes/users.js');
const productsRoute = require('./routes/products.js');

app.use('/users', usersRoute);
app.use('/products', productsRoute);


const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`server is listen on port ${port}`);
});