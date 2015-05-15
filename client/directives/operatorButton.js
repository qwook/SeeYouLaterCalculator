
/**
 * Operator Button Directive
 * @author Yu'N Co
 * @description Button to trigger an operation with a defined operator
 */

module.exports = function() {
	return {
		restrict: 'E',
		scope: {
			operator: '@' // Describe an operator with a string
		},
		template: require('./views/operatorButton.jade')()
	};
};
