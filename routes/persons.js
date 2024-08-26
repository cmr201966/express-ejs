var express = require('express')
var app = express()

// SHOW LIST OF PERSONS
app.get('/', function(req, res, next) {
	console.log("GET");
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM node_express_crud ORDER BY id DESC',function(err, rows, fields) {
			if (err) {
               res.send("Error al recuperar las personas");

			} else {
                res.send({rows});

			}
		})
	})
})

// SHOW ADD PERSON FORM
app.get('/add', function(req, res, next){	
	// render to views/person/add.ejs
	res.render('person/add', {
		title: 'Add a new Person',
		name: '',
		age: '',
		email: ''		
	})
})

// ADD NEW PERSON POST ACTION
app.post('/', function(req, res, next){	
	console.log("POST");
	console.log(req.body);

    var errors = false;
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		********************************************/
		var person = {
			name: req.body.name,
			age: req.body.age,
			email: req.body.email
		}
		
		req.getConnection(function(error, conn) {
			console.log('INSERT INTO node_express_crud (name, email, age) VALUES ("' + req.body.name + '", "' + req.body.email + '", "' + req.body.age + '")');
			conn.query('INSERT INTO node_express_crud (name, email, age) VALUES ("' + req.body.name + '", "' + req.body.email + '", "' + req.body.age + '")', person, function(err, result) {
				if (err) {
					
					res.send({error: 'Error al insertar'})
				} else {				
					res.send({success: 'Data added successfully!'})
					
				}
			})
		})
	}
	
})

// SHOW EDIT PERSON FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM node_express_crud WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if person not found redirect to list of persons
			if (rows.length <= 0) {
				req.flash('error', 'Person not found with id = ' + req.params.id)
				res.redirect('/persons')
			}
			else { // if person found
				// render to views/person/edit.ejs template file
				res.render('person/edit', {
					title: 'Edit the selected Person', 
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					age: rows[0].age,
					email: rows[0].email					
				})
			}			
		})
	})
})

// EDIT PERSON POST ACTION
app.put('/', function(req, res, next) {
	   console.log(req.body);

		var person = {
			name: req.body.name,
			age: req.body.age,
			email: req.body.email
		}
		console.log('UPDATE node_express_crud SET ? WHERE id = ' + req.body.id);
		req.getConnection(function(error, conn) {
			conn.query('UPDATE node_express_crud SET ? WHERE id = ' + req.body.id, person, function(err, result) {
				//if(err) throw err
				if (err) {
					
					// render to views/person/add.ejs
					res.render({error: 'Error al editar'})
				} else {
					res.send({success: 'Data updated successfully!'})
					
				}
			})
		})

})

// DELETE PERSON
//app.delete('/delete/(:id)', function(req, res, next) {
	app.delete('/', function(req, res, next) {
		var person = { id: req.body.id }
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM node_express_crud WHERE id = ' + req.body.id, person, function(err, result) {
			//if(err) throw err
			if (err) {
				// redirect to persons list page
				res.send({error: 'Error'})
			} else {
				// redirect to persons list page
				res.send({success: 'Person deleted successfully! id = ' + req.body.id})
			}
		})
	})
})

module.exports = app
