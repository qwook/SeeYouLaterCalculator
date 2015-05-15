
/**
 * Decimal Button Directive
 * @author Yu'N Co
 * @description View for button that appends a decimal point to number
 */

module.exports = function() {
	return {
		restrict: 'E',
		template: require('./views/decimalButton.jade')()
	};
};
