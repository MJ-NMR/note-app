#!/usr/bin/node
const express = require('express');
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
	res.write('<h1>notebook server</h1>');
	console.log('GET main');

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
							res.write(JSON.srtingify(rows.body));
							res.end();
						}
					});
				}
			}
		});
	}
});

// Routes
const usersRoute = require('./routes/users.js');
const productsRoute = require('./routes/products');

app.use('/users', usersRoute);
app.use('/products', productsRoute);


const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`server is listen on port ${port}`);
});