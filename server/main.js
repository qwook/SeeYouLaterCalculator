
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoskin = require('mongoskin');

// this is for the database
var db = mongoskin.db('mongodb://localhost:27017/sylc', {safe:true});

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

// parsing json data
app.use(bodyParser.json());

// use /public and /vendor as static folders
app.use('/public', express.static( path.join( __dirname, '..', 'public' ) ));
app.use('/vendor', express.static( path.join( __dirname, '..', 'vendor' ) ));

var models = db.collection('models');

app.post('/api/update', function(req, res) {
	// Update the calculator model in the database
	models.update({ id: { $eq: req.body.id } }, {
		id: req.body.id,
		left: req.body.model.left,
		right: req.body.model.right,
		operator: req.body.model.operator
	}, {
		upsert: true
	}, function() {
		res.json({success: true});
	});
})

app.get('/api/request', function(req, res) {
	// Request a calculator model from the database
	models.findOne({ id: { $eq: req.query.id } }, function(err, result) {
		if (err || result == null) {
			// send blank
			res.json({
				left: '',
				right: '',
				operator: ''
			})
		} else {
			res.json(result)
		}
	});
})

// render page when user goes to root. (http://localhost:3000/)
app.get('/*', function(req, res) {
	res.render('index', {base: req.path});
});

// start the server
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});