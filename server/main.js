
/**
 * Main Server Backend
 * @author Yu'N Co
 * @description Handles delivering files to browser
 * and API for updating/delivering models from the database.
 */

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

// access the "models" collection which contains the models for the calculator
var models = db.collection('models');

/**
 * Updates calculator model.
 */
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

/**
 * Requests a new calculator model.
 */
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

/**
 * Render the page when user access root.
 */
app.get('/*', function(req, res) {
	res.render('index', {base: req.path});
});

/**
 * Start the server.
 */
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});