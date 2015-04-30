
// Directives "describe" the view and link to it.
module.exports = {
	restrict: 'E',
	scope: {
		number: '@'
	},
	template: require('./views/numberButton.jade')()
};
