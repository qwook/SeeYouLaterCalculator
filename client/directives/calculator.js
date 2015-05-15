
/**
 * Calculator Directive
 * @author Yu'N Co
 * @description Main view for calculator. Contains all buttons in the calculator.
 */

module.exports = function() {
	return {
		restrict: 'E',
		template: require('./views/calculator.jade')(),
		link: function(scope, element, attrs) {
			// this is to bind keypresses to an action in the controller.

			// Keypresses emulate the button presses and calls the controller.
			angular.element(document).bind('keydown', function(event) {
				scope.$apply(function() {
					switch (event.which) {
						case 48:
							scope.calculatorController.insertNumber('0');
							break;
						case 49:
							scope.calculatorController.insertNumber('1');
							break;
						case 50:
							scope.calculatorController.insertNumber('2');
							break;
						case 51:
							scope.calculatorController.insertNumber('3');
							break;
						case 52:
							scope.calculatorController.insertNumber('4');
							break;
						case 53:
							scope.calculatorController.insertNumber('5');
							break;
						case 54:
							scope.calculatorController.insertNumber('6');
							break;
						case 55:
							scope.calculatorController.insertNumber('7');
							break;
						case 56:
							if (event.shiftKey) {
								scope.calculatorController.insertOperator('x')
								break;
							}
							scope.calculatorController.insertNumber('8');
							break;
						case 57:
							scope.calculatorController.insertNumber('9');
							break;
						case 190:
							scope.calculatorController.insertDecimal();
							break;
						case 8:
							if (!event.shiftKey) {
								scope.calculatorController.resetModel();
								event.preventDefault();
							}
							break;
						case 13:
							scope.calculatorController.equate();
							event.preventDefault();
							break;
						case 187:
							if (event.shiftKey) {
								scope.calculatorController.insertOperator('+')
							}
							break;
						case 189:
							scope.calculatorController.insertOperator('-')
							break;
						case 191:
							scope.calculatorController.insertOperator('/')
							break;
					} // switch
				}) // $scope.apply
			}) // angular keydown bind
		} // link
	}; // return
}; // module.exports =
