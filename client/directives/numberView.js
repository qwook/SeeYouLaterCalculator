
/**
 * Number View Directive
 * @author Yu'N Co
 * @description View to display the numbers and operators in a calculation.
 */

module.exports = function() {
	return {
		restrict: 'E',
		scope: {
			model: '=' // model to display
		},
		template: require('./views/numberView.jade')()
	};
};
