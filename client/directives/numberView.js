
// Directives "describe" the view and link to it.
module.exports = {
	restrict: 'E',
	scope: {
		model: '='
	},
	template: require('./views/numberView.jade')()
};
