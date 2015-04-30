
// Directives "describe" the view and link to it.
module.exports = {
	restrict: 'E',
	scope: {
		name: '@',
		mutator: '&'
	},
	template: require('./views/mutationButton.jade')()
};
