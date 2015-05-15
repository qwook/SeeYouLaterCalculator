
/**
 * Mutation Button Directive
 * @author Yu'N Co
 * @description Describes view for buttons that concatenates numbers.
 */

module.exports = function() {
	return {
		restrict: 'E',
		scope: {
			name: '@', // Accept a string as the name
			mutator: '&' // Accept a mutator function address
		},
		template: require('./views/mutationButton.jade')()
	};
};
