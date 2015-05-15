
/**
 * Number Button Directive
 * @author Yu'N Co
 * @description Describes view for buttons that concatenates numbers.
 */

module.exports = function() {
	return {
		restrict: 'E',
		scope: {
			number: '@' // Accept a string as the number to display
		},
		template: require('./views/numberButton.jade')()
	};
};
