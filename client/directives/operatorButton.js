
// Directives "describe" the view and link to it.
module.exports = {
	restrict: 'E',
	scope: {
		operator: '@'
	},
	template: require('./views/operatorButton.jade')()
};
