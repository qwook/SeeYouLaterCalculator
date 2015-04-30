
var path = require('path');
var express = require('express');

// this is the server
// the server is only responsible for sending files over to the client.
var app = express();

// the /views directory contains the templates to render.
// for now, there should only be one page.
app.set('views', path.join(__dirname, 'views'));
// use "jade" for rendering pages
// jade is a templating language based on indentation
// it translates to HTML
app.set('view engine', 'jade');

// use /public and /vendor as static folders
app.use('/public', express.static( path.join( __dirname, '..', 'public' ) ));
app.use('/vendor', express.static( path.join( __dirname, '..', 'vendor' ) ));

// render page when user goes to root. (http://localhost:3000/)
app.get('/', function(req, res) {
	res.render('index');
});

// start the server
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});