
/**
 * Equate Button Directive
 * @author Yu'N Co
 * @description View for button that signals an equate.
 */

// Directives "describe" the view and link to it.
module.exports = function() {
	return {
		restrict: 'E',
		template: require('./views/equateButton.jade')()
	};
};
