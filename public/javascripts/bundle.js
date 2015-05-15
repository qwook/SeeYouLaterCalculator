(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/* Let's talk about NodeJS. */

/* You might know from Java or C++ the `import` and `#include` keywords
 Those keywords will import the file.
 In NodeJS, the equivalent of that is "require"
 "require" will actually run the file.

 Unlike in Java and C++, you don't have to call `require` at the top.
 To keep the flow of the code, I've used the `require` inside functions
 and when defining controllers and views.
 */

'use strict';

var angular = (window.angular);

var app = angular.module('calculatorApp', [])
// this is to grab the address bar URL
// mainly used for creating different sessions
.config(function ($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
});

/*
 Let's talk about angular for a bit.
 Angular handles all three of the M-V-C.
 The way it does it is kind of confusing, but I'll try my best to explain.

 The "View" in angular is described by a "Directive"
 A "Directive" will describe the view, how you can use it,
 what data you can pass to the view, and the html/jade file used
 to render it.
*/

/* define directives (views) */
app.directive('calculator', require('./directives/calculator.js'));
app.directive('numberButton', require('./directives/numberButton.js'));
app.directive('decimalButton', require('./directives/decimalButton.js'));
app.directive('operatorButton', require('./directives/operatorButton.js'));
app.directive('equateButton', require('./directives/equateButton.js'));
app.directive('mutationButton', require('./directives/mutationButton.js'));
app.directive('numberView', require('./directives/numberView.js'));

/* define controllers */
app.controller('CalculatorController', require('./controllers/CalculatorController.js'));

/* define factories (models) */
app.factory('CalculatorModel', require('./models/CalculatorModel.js'));

/* define services */
app.service('CalculatorWebSync', require('./services/CalculatorWebSync.js'));

},{"./controllers/CalculatorController.js":2,"./directives/calculator.js":3,"./directives/decimalButton.js":4,"./directives/equateButton.js":5,"./directives/mutationButton.js":6,"./directives/numberButton.js":7,"./directives/numberView.js":8,"./directives/operatorButton.js":9,"./models/CalculatorModel.js":17,"./services/CalculatorWebSync.js":18}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Calculator Controller
 * @description Controller for calculating an equation
 * given left and right numbers, and an operation.
 */
module.exports = (function () {
	function CalculatorController(CalculatorModel, CalculatorWebSync, $interval, $scope) {
		_classCallCheck(this, CalculatorController);

		// Define instance variables
		this.insertingDecimal = false;
		this.model = new CalculatorModel();
		this.test = '';

		// Start autoupdating
		var autoupdate = CalculatorWebSync.autoupdate(this.model);
		$scope.$on('$destroy', function () {
			$interval.cancel(autoupdate);
		});
	}

	_createClass(CalculatorController, [{
		key: 'resetModel',

		/**
   * Clear / reset the model to default settings.
   */
		value: function resetModel() {
			this.model.left = '';
			this.model.right = '';
			this.model.operator = '';
			this.insertingDecimal = false;
		}
	}, {
		key: 'insertNumber',

		/**
   * Concatenate a number to working number
   * @param  {Number} number to concatenate with
   */
		value: function insertNumber(number) {
			if (this.model.left != '' && this.model.right == '' && this.model.operator == '') {
				this.resetModel();
			}

			if (this.model.right == '0') {
				this.model.right = '';
			}

			// Don't append to something that isn't a number.
			if ((Number.isNaN(parseFloat(this.model.right)) || !Number.isFinite(parseFloat(this.model.right))) && this.model.right != '') return;

			this.model.right += number.toString();
		}
	}, {
		key: 'insertDecimal',

		/**
   * Concatenate a decimal to the end of the number
   */
		value: function insertDecimal() {
			if (this.insertingDecimal) {
				return;
			}

			if (this.model.left != '' && this.model.right == '' && this.model.operator == '') {
				this.resetModel();
			}

			// Don't append to something that isn't a number.
			if ((Number.isNaN(parseFloat(this.model.right)) || !Number.isFinite(parseFloat(this.model.right))) && this.model.right != '') return;

			this.model.right += '.';

			this.insertingDecimal = true;
		}
	}, {
		key: 'insertOperator',

		/**
   * Set the operator for the current calculation.
   * @param  {String} the operator
   */
		value: function insertOperator(operator) {
			this.equate();

			if (this.model.left == '' && this.model.operator == '' && this.model.right != '') {
				this.model.left = this.model.right;
				this.model.right = '';
			}

			if (this.model.left == '') {
				return;
			}

			this.model.operator = operator;

			this.clamp();
		}
	}, {
		key: 'equate',

		/**
   * Calculate the current equation.
   */
		value: function equate() {

			// We have operands, now equate for the corresponding operator.
			if (this.model.left != '' && this.model.right != '') {
				var left = parseFloat(this.model.left);
				var right = parseFloat(this.model.right);
				if (this.model.operator == '+') {
					this.resetModel();
					this.model.right = (left + right).toString();
				} else if (this.model.operator == '-') {
					this.resetModel();
					this.model.right = (left - right).toString();
				} else if (this.model.operator == 'x') {
					this.resetModel();
					this.model.right = (left * right).toString();
				} else if (this.model.operator == '/') {
					this.resetModel();
					this.model.right = (left / right).toString();
				}
			}

			this.insertingDecimal = false;

			this.clamp();
		}
	}, {
		key: 'mutatorSin',

		/**
   * Calculate the sin function for the current working operation.
   */
		value: function mutatorSin() {
			this.equate();

			if (this.model.right == '') return;

			this.model.right = Math.sin(parseFloat(this.model.right)).toString();

			this.clamp();
		}
	}, {
		key: 'mutatorCos',

		/**
   * Calculate the cos function for the current working operation.
   */
		value: function mutatorCos() {
			this.equate();

			if (this.model.right == '') return;

			this.model.right = Math.cos(parseFloat(this.model.right)).toString();

			this.clamp();
		}
	}, {
		key: 'badTip',

		/**
   * Calculate a fairly bad tip given the current working operation.
   */
		value: function badTip() {
			this.equate();

			if (this.model.right == '') return;

			this.model.right = (parseFloat(this.model.right) * 0.1).toString();

			this.clamp();
		}
	}, {
		key: 'okayTip',

		/**
   * Calculate an okay tip given the current working operation.
   */
		value: function okayTip() {
			this.equate();

			if (this.model.right == '') return;

			this.model.right = (parseFloat(this.model.right) * 0.15).toString();

			this.clamp();
		}
	}, {
		key: 'flipSign',

		/**
   * Flip the parity of the working number.
   */
		value: function flipSign() {
			if (this.model.right == '') return;

			this.model.right = (-1 * parseFloat(this.model.right)).toString();

			this.clamp();
		}
	}, {
		key: 'clamp',

		/**
   * Ensure that a number isn't too big.
   */
		value: function clamp() {
			// Don't clamp if it's not a number
			if ((Number.isNaN(parseFloat(this.model.right)) || !Number.isFinite(parseFloat(this.model.right))) && this.model.right == '') return;

			// Clamp to 6 digits
			this.model.right = (Math.floor(parseFloat(this.model.right) * 1000000) / 1000000).toString();
		}
	}]);

	return CalculatorController;
})();

},{}],3:[function(require,module,exports){

/**
 * Calculator Directive
 * @author Yu'N Co
 * @description Main view for calculator. Contains all buttons in the calculator.
 */

'use strict';

module.exports = function () {
	return {
		restrict: 'E',
		template: require('./views/calculator.jade')(),
		link: function link(scope, element, attrs) {
			// this is to bind keypresses to an action in the controller.

			// Keypresses emulate the button presses and calls the controller.
			angular.element(document).bind('keydown', function (event) {
				scope.$apply(function () {
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
								scope.calculatorController.insertOperator('x');
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
								scope.calculatorController.insertOperator('+');
							}
							break;
						case 189:
							scope.calculatorController.insertOperator('-');
							break;
						case 191:
							scope.calculatorController.insertOperator('/');
							break;
					} // switch
				});
			});
		} // link
	}; // return
}; // module.exports =
// $scope.apply
// angular keydown bind

},{"./views/calculator.jade":10}],4:[function(require,module,exports){

/**
 * Decimal Button Directive
 * @author Yu'N Co
 * @description View for button that appends a decimal point to number
 */

'use strict';

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./views/decimalButton.jade')()
  };
};

},{"./views/decimalButton.jade":11}],5:[function(require,module,exports){

/**
 * Equate Button Directive
 * @author Yu'N Co
 * @description View for button that signals an equate.
 */

// Directives "describe" the view and link to it.
'use strict';

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./views/equateButton.jade')()
  };
};

},{"./views/equateButton.jade":12}],6:[function(require,module,exports){

/**
 * Mutation Button Directive
 * @author Yu'N Co
 * @description Describes view for buttons that concatenates numbers.
 */

'use strict';

module.exports = function () {
	return {
		restrict: 'E',
		scope: {
			name: '@', // Accept a string as the name
			mutator: '&' // Accept a mutator function address
		},
		template: require('./views/mutationButton.jade')()
	};
};

},{"./views/mutationButton.jade":13}],7:[function(require,module,exports){

/**
 * Number Button Directive
 * @author Yu'N Co
 * @description Describes view for buttons that concatenates numbers.
 */

'use strict';

module.exports = function () {
	return {
		restrict: 'E',
		scope: {
			number: '@' // Accept a string as the number to display
		},
		template: require('./views/numberButton.jade')()
	};
};

},{"./views/numberButton.jade":14}],8:[function(require,module,exports){

/**
 * Number View Directive
 * @author Yu'N Co
 * @description View to display the numbers and operators in a calculation.
 */

'use strict';

module.exports = function () {
	return {
		restrict: 'E',
		scope: {
			model: '=' // model to display
		},
		template: require('./views/numberView.jade')()
	};
};

},{"./views/numberView.jade":15}],9:[function(require,module,exports){

/**
 * Operator Button Directive
 * @author Yu'N Co
 * @description Button to trigger an operation with a defined operator
 */

'use strict';

module.exports = function () {
	return {
		restrict: 'E',
		scope: {
			operator: '@' // Describe an operator with a string
		},
		template: require('./views/operatorButton.jade')()
	};
};

},{"./views/operatorButton.jade":16}],10:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<number-view model=\"calculatorController.model\"></number-view><div class=\"row\"><div class=\"six columns\"><div class=\"row\"><div class=\"four columns\"><number-button number=\"1\"></number-button></div><div class=\"four columns\"><number-button number=\"2\"></number-button></div><div class=\"four columns\"><number-button number=\"3\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"4\"></number-button></div><div class=\"four columns\"><number-button number=\"5\"></number-button></div><div class=\"four columns\"><number-button number=\"6\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"7\"></number-button></div><div class=\"four columns\"><number-button number=\"8\"></number-button></div><div class=\"four columns\"><number-button number=\"9\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><decimal-button></decimal-button></div><div class=\"four columns\"><number-button number=\"0\"></number-button></div><div class=\"four columns\"><equate-button></equate-button></div></div></div><div class=\"two columns\"><operator-button operator=\"+\"></operator-button><operator-button operator=\"-\"></operator-button><operator-button operator=\"x\"></operator-button><operator-button operator=\"/\"></operator-button></div><div class=\"four columns\"><mutation-button name=\"Clear\" mutator=\"calculatorController.resetModel()\"></mutation-button><mutation-button name=\"Sin\" mutator=\"calculatorController.mutatorSin()\"></mutation-button><mutation-button name=\"Cos\" mutator=\"calculatorController.mutatorCos()\"></mutation-button><mutation-button name=\"+/-\" mutator=\"calculatorController.flipSign()\"></mutation-button><mutation-button name=\"Tip Badly (10%)\" mutator=\"calculatorController.badTip()\"></mutation-button><mutation-button name=\"Tip Okay (15%)\" mutator=\"calculatorController.okayTip()\"></mutation-button></div></div>");;return buf.join("");
};
},{"jade/runtime":20}],11:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"calculatorController.insertDecimal()\" class=\"button button-primary u-full-width no-padding\">.</a>");;return buf.join("");
};
},{"jade/runtime":20}],12:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"calculatorController.equate()\" class=\"button button-primary u-full-width no-padding\">=</a>");;return buf.join("");
};
},{"jade/runtime":20}],13:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"mutator()\" class=\"button u-full-width no-padding\">{{ name }}</a>");;return buf.join("");
};
},{"jade/runtime":20}],14:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"$parent.calculatorController.insertNumber(number)\" class=\"button u-full-width no-padding\">{{ number }}</a>");;return buf.join("");
};
},{"jade/runtime":20}],15:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("{{model.left}} {{model.operator}} {{model.right}}");;return buf.join("");
};
},{"jade/runtime":20}],16:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"$parent.calculatorController.insertOperator(operator)\" class=\"button u-full-width no-padding\">{{ operator }}</a>");;return buf.join("");
};
},{"jade/runtime":20}],17:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Calculator Model
 * @author Yu'N Co
 * @description Describes the model to be used.
 */

module.exports = function () {
	return (function () {
		function CalculatorModel() {
			_classCallCheck(this, CalculatorModel);

			this.left = '';
			this.right = '';
			this.operator = '';
		}

		_createClass(CalculatorModel, [{
			key: 'equals',

			/**
    * Compare the equality of this model to another model
    * @param  {CalculatorModel} otherModel the model to compare with
    * @return {boolean} the equality
    */
			value: function equals(otherModel) {
				return this.left == otherModel.left && this.right == otherModel.right && this.operator == otherModel.operator;
			}
		}, {
			key: 'clone',

			/**
    * Create a deep copy of the model
    * @return {CalculatorModel} clone
    */
			value: function clone() {
				var clone = new CalculatorModel();
				clone.left = this.left;
				clone.right = this.right;
				clone.operator = this.operator;
				return clone;
			}
		}, {
			key: 'copy',

			/**
    * Copy data from other model to current model
    * @param  {CalculatorModel} other model
    */
			value: function copy(otherModel) {
				this.left = otherModel.left;
				this.right = otherModel.right;
				this.operator = otherModel.operator;
			}
		}]);

		return CalculatorModel;
	})();
};

},{}],18:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = function (CalculatorModel, $location, $http, $interval) {
	return new ((function () {
		function CalculatorWebSync() {
			_classCallCheck(this, CalculatorWebSync);
		}

		_createClass(CalculatorWebSync, [{
			key: 'autoupdate',
			value: function autoupdate(model) {
				var _this = this;

				var _model = model;

				var waitForRun = true;
				var previousModel = null;

				// Request initial model.
				this.request().then(function (model) {
					_model.copy(model);
					previousModel = _model.clone();
					waitForRun = false;
				});

				// Save every 500ms
				var savetimer = $interval(function () {
					if (waitForRun) return;

					// If our model has changed, upload it.
					if (!_model.equals(previousModel)) {
						_this.update(_model).then(function () {
							previousModel = _model.clone();
							waitForRun = false;
						});
						// If our model is the same, update to server's.
					} else {
						_this.request().then(function (model) {
							_model.copy(model);
							previousModel = _model.clone();
							waitForRun = false;
						});
					}
				}, 500);

				return savetimer;
			}
		}, {
			key: 'update',
			value: function update(model) {
				return $http.post('/api/update', { id: this.getId(), model: model });
			}
		}, {
			key: 'request',
			value: function request() {
				return $http.get('/api/request', { params: { id: this.getId() } }).then(function (response) {
					var newModel = new CalculatorModel();
					newModel.left = response.data.left || '';
					newModel.right = response.data.right || '';
					newModel.operator = response.data.operator || '';
					return newModel;
				});
			}
		}, {
			key: 'getId',
			value: function getId() {
				return $location.path().substring(1);
			}
		}]);

		return CalculatorWebSync;
	})())();
};

},{}],19:[function(require,module,exports){

},{}],20:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"fs":19}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L21haW4uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2NvbnRyb2xsZXJzL0NhbGN1bGF0b3JDb250cm9sbGVyLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL2NhbGN1bGF0b3IuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvZGVjaW1hbEJ1dHRvbi5qcyIsIi9Wb2x1bWVzL1N1cGVyTm92YS9TY2hvb2wvU3ByaW5nMjAxNS9DTVBFMTMxL1NlZVlvdUxhdGVyQ2FsY3VsYXRvci9jbGllbnQvZGlyZWN0aXZlcy9lcXVhdGVCdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbXV0YXRpb25CdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbnVtYmVyQnV0dG9uLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL251bWJlclZpZXcuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvb3BlcmF0b3JCdXR0b24uanMiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9jYWxjdWxhdG9yLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9kZWNpbWFsQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9lcXVhdGVCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL211dGF0aW9uQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9udW1iZXJCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL251bWJlclZpZXcuamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL29wZXJhdG9yQnV0dG9uLmphZGUiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L21vZGVscy9DYWxjdWxhdG9yTW9kZWwuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L3NlcnZpY2VzL0NhbGN1bGF0b3JXZWJTeW5jLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNhQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQzs7O0NBRzVDLE1BQU0sQ0FBQyxVQUFTLGlCQUFpQixF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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyogTGV0J3MgdGFsayBhYm91dCBOb2RlSlMuICovXG5cbi8qIFlvdSBtaWdodCBrbm93IGZyb20gSmF2YSBvciBDKysgdGhlIGBpbXBvcnRgIGFuZCBgI2luY2x1ZGVgIGtleXdvcmRzXG4gVGhvc2Uga2V5d29yZHMgd2lsbCBpbXBvcnQgdGhlIGZpbGUuXG4gSW4gTm9kZUpTLCB0aGUgZXF1aXZhbGVudCBvZiB0aGF0IGlzIFwicmVxdWlyZVwiXG4gXCJyZXF1aXJlXCIgd2lsbCBhY3R1YWxseSBydW4gdGhlIGZpbGUuXG5cbiBVbmxpa2UgaW4gSmF2YSBhbmQgQysrLCB5b3UgZG9uJ3QgaGF2ZSB0byBjYWxsIGByZXF1aXJlYCBhdCB0aGUgdG9wLlxuIFRvIGtlZXAgdGhlIGZsb3cgb2YgdGhlIGNvZGUsIEkndmUgdXNlZCB0aGUgYHJlcXVpcmVgIGluc2lkZSBmdW5jdGlvbnNcbiBhbmQgd2hlbiBkZWZpbmluZyBjb250cm9sbGVycyBhbmQgdmlld3MuXG4gKi9cblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcImNhbGN1bGF0b3JBcHBcIiwgW10pXG4vLyB0aGlzIGlzIHRvIGdyYWIgdGhlIGFkZHJlc3MgYmFyIFVSTFxuLy8gbWFpbmx5IHVzZWQgZm9yIGNyZWF0aW5nIGRpZmZlcmVudCBzZXNzaW9uc1xuLmNvbmZpZyhmdW5jdGlvbigkbG9jYXRpb25Qcm92aWRlcikge1xuICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSkuaGFzaFByZWZpeCgnIScpO1xufSk7XG5cbi8qXG4gTGV0J3MgdGFsayBhYm91dCBhbmd1bGFyIGZvciBhIGJpdC5cbiBBbmd1bGFyIGhhbmRsZXMgYWxsIHRocmVlIG9mIHRoZSBNLVYtQy5cbiBUaGUgd2F5IGl0IGRvZXMgaXQgaXMga2luZCBvZiBjb25mdXNpbmcsIGJ1dCBJJ2xsIHRyeSBteSBiZXN0IHRvIGV4cGxhaW4uXG5cbiBUaGUgXCJWaWV3XCIgaW4gYW5ndWxhciBpcyBkZXNjcmliZWQgYnkgYSBcIkRpcmVjdGl2ZVwiXG4gQSBcIkRpcmVjdGl2ZVwiIHdpbGwgZGVzY3JpYmUgdGhlIHZpZXcsIGhvdyB5b3UgY2FuIHVzZSBpdCxcbiB3aGF0IGRhdGEgeW91IGNhbiBwYXNzIHRvIHRoZSB2aWV3LCBhbmQgdGhlIGh0bWwvamFkZSBmaWxlIHVzZWRcbiB0byByZW5kZXIgaXQuXG4qL1xuXG4vKiBkZWZpbmUgZGlyZWN0aXZlcyAodmlld3MpICovXG5hcHAuZGlyZWN0aXZlKFwiY2FsY3VsYXRvclwiLFxuXHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMvY2FsY3VsYXRvci5qcycpXG4pO1xuYXBwLmRpcmVjdGl2ZShcIm51bWJlckJ1dHRvblwiLFxuXHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbnVtYmVyQnV0dG9uLmpzJylcbik7XG5hcHAuZGlyZWN0aXZlKFwiZGVjaW1hbEJ1dHRvblwiLFxuXHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMvZGVjaW1hbEJ1dHRvbi5qcycpXG4pO1xuYXBwLmRpcmVjdGl2ZShcIm9wZXJhdG9yQnV0dG9uXCIsXG5cdHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9vcGVyYXRvckJ1dHRvbi5qcycpXG4pO1xuYXBwLmRpcmVjdGl2ZShcImVxdWF0ZUJ1dHRvblwiLFxuXHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMvZXF1YXRlQnV0dG9uLmpzJylcbik7XG5hcHAuZGlyZWN0aXZlKFwibXV0YXRpb25CdXR0b25cIixcblx0cmVxdWlyZSgnLi9kaXJlY3RpdmVzL211dGF0aW9uQnV0dG9uLmpzJylcbik7XG5hcHAuZGlyZWN0aXZlKFwibnVtYmVyVmlld1wiLFxuXHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbnVtYmVyVmlldy5qcycpXG4pO1xuXG4vKiBkZWZpbmUgY29udHJvbGxlcnMgKi9cbmFwcC5jb250cm9sbGVyKFwiQ2FsY3VsYXRvckNvbnRyb2xsZXJcIixcblx0cmVxdWlyZSgnLi9jb250cm9sbGVycy9DYWxjdWxhdG9yQ29udHJvbGxlci5qcycpXG4pO1xuXG4vKiBkZWZpbmUgZmFjdG9yaWVzIChtb2RlbHMpICovXG5hcHAuZmFjdG9yeShcIkNhbGN1bGF0b3JNb2RlbFwiLFxuXHRyZXF1aXJlKCcuL21vZGVscy9DYWxjdWxhdG9yTW9kZWwuanMnKVxuKTtcblxuLyogZGVmaW5lIHNlcnZpY2VzICovXG5hcHAuc2VydmljZShcIkNhbGN1bGF0b3JXZWJTeW5jXCIsXG5cdHJlcXVpcmUoJy4vc2VydmljZXMvQ2FsY3VsYXRvcldlYlN5bmMuanMnKVxuKTtcbiIsIlxuLyoqXG4gKiBDYWxjdWxhdG9yIENvbnRyb2xsZXJcbiAqIEBkZXNjcmlwdGlvbiBDb250cm9sbGVyIGZvciBjYWxjdWxhdGluZyBhbiBlcXVhdGlvblxuICogZ2l2ZW4gbGVmdCBhbmQgcmlnaHQgbnVtYmVycywgYW5kIGFuIG9wZXJhdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDYWxjdWxhdG9yQ29udHJvbGxlciB7XG5cdGNvbnN0cnVjdG9yKENhbGN1bGF0b3JNb2RlbCwgQ2FsY3VsYXRvcldlYlN5bmMsICRpbnRlcnZhbCwgJHNjb3BlKSB7XG5cdFx0Ly8gRGVmaW5lIGluc3RhbmNlIHZhcmlhYmxlc1xuXHRcdHRoaXMuaW5zZXJ0aW5nRGVjaW1hbCA9IGZhbHNlXG5cdFx0dGhpcy5tb2RlbCA9IG5ldyBDYWxjdWxhdG9yTW9kZWwoKTtcblx0XHR0aGlzLnRlc3QgPSAnJztcblxuXHRcdC8vIFN0YXJ0IGF1dG91cGRhdGluZ1xuXHRcdHZhciBhdXRvdXBkYXRlID0gQ2FsY3VsYXRvcldlYlN5bmMuYXV0b3VwZGF0ZSh0aGlzLm1vZGVsKTtcblx0XHQkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JGludGVydmFsLmNhbmNlbChhdXRvdXBkYXRlKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhciAvIHJlc2V0IHRoZSBtb2RlbCB0byBkZWZhdWx0IHNldHRpbmdzLlxuXHQgKi9cblx0cmVzZXRNb2RlbCgpIHtcblx0XHR0aGlzLm1vZGVsLmxlZnQgPSAnJ1xuXHRcdHRoaXMubW9kZWwucmlnaHQgPSAnJ1xuXHRcdHRoaXMubW9kZWwub3BlcmF0b3IgPSAnJ1xuXHRcdHRoaXMuaW5zZXJ0aW5nRGVjaW1hbCA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbmNhdGVuYXRlIGEgbnVtYmVyIHRvIHdvcmtpbmcgbnVtYmVyXG5cdCAqIEBwYXJhbSAge051bWJlcn0gbnVtYmVyIHRvIGNvbmNhdGVuYXRlIHdpdGhcblx0ICovXG5cdGluc2VydE51bWJlcihudW1iZXIpIHtcblx0XHRpZiAodGhpcy5tb2RlbC5sZWZ0ICE9ICcnICYmIHRoaXMubW9kZWwucmlnaHQgPT0gJycgJiYgdGhpcy5tb2RlbC5vcGVyYXRvciA9PSAnJykge1xuXHRcdFx0dGhpcy5yZXNldE1vZGVsKCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubW9kZWwucmlnaHQgPT0gJzAnKSB7XG5cdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gJyc7XG5cdFx0fVxuXG5cdFx0Ly8gRG9uJ3QgYXBwZW5kIHRvIHNvbWV0aGluZyB0aGF0IGlzbid0IGEgbnVtYmVyLlxuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0TnVtYmVyLmlzTmFOKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpIHx8XG5cdFx0XHRcdCFOdW1iZXIuaXNGaW5pdGUocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSlcblx0XHRcdClcblx0XHRcdCYmIHRoaXMubW9kZWwucmlnaHQgIT0gJydcblx0XHQpIHJldHVybjtcblxuXHRcdHRoaXMubW9kZWwucmlnaHQgKz0gbnVtYmVyLnRvU3RyaW5nKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb25jYXRlbmF0ZSBhIGRlY2ltYWwgdG8gdGhlIGVuZCBvZiB0aGUgbnVtYmVyXG5cdCAqL1xuXHRpbnNlcnREZWNpbWFsKCkge1xuXHRcdGlmICh0aGlzLmluc2VydGluZ0RlY2ltYWwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tb2RlbC5sZWZ0ICE9ICcnICYmIHRoaXMubW9kZWwucmlnaHQgPT0gJycgJiYgdGhpcy5tb2RlbC5vcGVyYXRvciA9PSAnJykge1xuXHRcdFx0dGhpcy5yZXNldE1vZGVsKCk7XG5cdFx0fVxuXG5cdFx0Ly8gRG9uJ3QgYXBwZW5kIHRvIHNvbWV0aGluZyB0aGF0IGlzbid0IGEgbnVtYmVyLlxuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0TnVtYmVyLmlzTmFOKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpIHx8XG5cdFx0XHRcdCFOdW1iZXIuaXNGaW5pdGUocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSlcblx0XHRcdClcblx0XHRcdCYmIHRoaXMubW9kZWwucmlnaHQgIT0gJydcblx0XHQpIHJldHVybjtcblxuXHRcdHRoaXMubW9kZWwucmlnaHQgKz0gJy4nO1xuXG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIG9wZXJhdG9yIGZvciB0aGUgY3VycmVudCBjYWxjdWxhdGlvbi5cblx0ICogQHBhcmFtICB7U3RyaW5nfSB0aGUgb3BlcmF0b3Jcblx0ICovXG5cdGluc2VydE9wZXJhdG9yKG9wZXJhdG9yKSB7XG5cdFx0dGhpcy5lcXVhdGUoKTtcblxuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgPT0gJycgJiYgdGhpcy5tb2RlbC5vcGVyYXRvciA9PSAnJyAmJiB0aGlzLm1vZGVsLnJpZ2h0ICE9ICcnKSB7XG5cdFx0XHR0aGlzLm1vZGVsLmxlZnQgPSB0aGlzLm1vZGVsLnJpZ2h0O1xuXHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9ICcnO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgPT0gJycpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLm1vZGVsLm9wZXJhdG9yID0gb3BlcmF0b3I7XG5cdFx0XG5cdFx0dGhpcy5jbGFtcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZSB0aGUgY3VycmVudCBlcXVhdGlvbi5cblx0ICovXG5cdGVxdWF0ZSgpIHtcblxuXHRcdC8vIFdlIGhhdmUgb3BlcmFuZHMsIG5vdyBlcXVhdGUgZm9yIHRoZSBjb3JyZXNwb25kaW5nIG9wZXJhdG9yLlxuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgIT0gJycgJiYgdGhpcy5tb2RlbC5yaWdodCAhPSAnJykge1xuXHRcdFx0dmFyIGxlZnQgPSBwYXJzZUZsb2F0KHRoaXMubW9kZWwubGVmdCk7XG5cdFx0XHR2YXIgcmlnaHQgPSBwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpO1xuXHRcdFx0aWYgKHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJysnKSB7XG5cdFx0XHRcdHRoaXMucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gKGxlZnQgKyByaWdodCkudG9TdHJpbmcoKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5tb2RlbC5vcGVyYXRvciA9PSAnLScpIHtcblx0XHRcdFx0dGhpcy5yZXNldE1vZGVsKCk7XG5cdFx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSAobGVmdCAtIHJpZ2h0KS50b1N0cmluZygpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLm1vZGVsLm9wZXJhdG9yID09ICd4Jykge1xuXHRcdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9IChsZWZ0ICogcmlnaHQpLnRvU3RyaW5nKCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJy8nKSB7XG5cdFx0XHRcdHRoaXMucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gKGxlZnQgLyByaWdodCkudG9TdHJpbmcoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmluc2VydGluZ0RlY2ltYWwgPSBmYWxzZTtcblxuXHRcdHRoaXMuY2xhbXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGUgdGhlIHNpbiBmdW5jdGlvbiBmb3IgdGhlIGN1cnJlbnQgd29ya2luZyBvcGVyYXRpb24uXG5cdCAqL1xuXHRtdXRhdG9yU2luKCkge1xuXHRcdHRoaXMuZXF1YXRlKCk7XG5cblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnJykgcmV0dXJuO1xuXG5cdFx0dGhpcy5tb2RlbC5yaWdodCA9IE1hdGguc2luKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpLnRvU3RyaW5nKCk7XG5cblx0XHR0aGlzLmNsYW1wKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlIHRoZSBjb3MgZnVuY3Rpb24gZm9yIHRoZSBjdXJyZW50IHdvcmtpbmcgb3BlcmF0aW9uLlxuXHQgKi9cblx0bXV0YXRvckNvcygpIHtcblx0XHR0aGlzLmVxdWF0ZSgpO1xuXG5cdFx0aWYgKHRoaXMubW9kZWwucmlnaHQgPT0gJycpIHJldHVybjtcblxuXHRcdHRoaXMubW9kZWwucmlnaHQgPSBNYXRoLmNvcyhwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpKS50b1N0cmluZygpO1xuXG5cdFx0dGhpcy5jbGFtcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZSBhIGZhaXJseSBiYWQgdGlwIGdpdmVuIHRoZSBjdXJyZW50IHdvcmtpbmcgb3BlcmF0aW9uLlxuXHQgKi9cblx0YmFkVGlwKCkge1xuXHRcdHRoaXMuZXF1YXRlKCk7XG5cblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnJykgcmV0dXJuO1xuXG5cdFx0dGhpcy5tb2RlbC5yaWdodCA9IChwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpICogMC4xMCkudG9TdHJpbmcoKTtcblxuXHRcdHRoaXMuY2xhbXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGUgYW4gb2theSB0aXAgZ2l2ZW4gdGhlIGN1cnJlbnQgd29ya2luZyBvcGVyYXRpb24uXG5cdCAqL1xuXHRva2F5VGlwKCkge1xuXHRcdHRoaXMuZXF1YXRlKCk7XG5cblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnJykgcmV0dXJuO1xuXG5cdFx0dGhpcy5tb2RlbC5yaWdodCA9IChwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpICogMC4xNSkudG9TdHJpbmcoKTtcblxuXHRcdHRoaXMuY2xhbXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGbGlwIHRoZSBwYXJpdHkgb2YgdGhlIHdvcmtpbmcgbnVtYmVyLlxuXHQgKi9cblx0ZmxpcFNpZ24oKSB7XG5cdFx0aWYgKHRoaXMubW9kZWwucmlnaHQgPT0gJycpIHJldHVybjtcblxuXHRcdHRoaXMubW9kZWwucmlnaHQgPSAoLTEgKiBwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpKS50b1N0cmluZygpO1xuXG5cdFx0dGhpcy5jbGFtcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEVuc3VyZSB0aGF0IGEgbnVtYmVyIGlzbid0IHRvbyBiaWcuXG5cdCAqL1xuXHRjbGFtcCgpIHtcblx0XHQvLyBEb24ndCBjbGFtcCBpZiBpdCdzIG5vdCBhIG51bWJlclxuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0TnVtYmVyLmlzTmFOKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpIHx8XG5cdFx0XHRcdCFOdW1iZXIuaXNGaW5pdGUocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSlcblx0XHRcdClcblx0XHRcdCYmIHRoaXMubW9kZWwucmlnaHQgPT0gJydcblx0XHQpIHJldHVybjtcblxuXHRcdC8vIENsYW1wIHRvIDYgZGlnaXRzXG5cdFx0dGhpcy5tb2RlbC5yaWdodCA9IChNYXRoLmZsb29yKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkgKiAxMDAwMDAwKSAvIDEwMDAwMDApLnRvU3RyaW5nKClcblx0fVxuXG59O1xuIiwiXG4vKipcbiAqIENhbGN1bGF0b3IgRGlyZWN0aXZlXG4gKiBAYXV0aG9yIFl1J04gQ29cbiAqIEBkZXNjcmlwdGlvbiBNYWluIHZpZXcgZm9yIGNhbGN1bGF0b3IuIENvbnRhaW5zIGFsbCBidXR0b25zIGluIHRoZSBjYWxjdWxhdG9yLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9jYWxjdWxhdG9yLmphZGUnKSgpLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXHRcdFx0Ly8gdGhpcyBpcyB0byBiaW5kIGtleXByZXNzZXMgdG8gYW4gYWN0aW9uIGluIHRoZSBjb250cm9sbGVyLlxuXG5cdFx0XHQvLyBLZXlwcmVzc2VzIGVtdWxhdGUgdGhlIGJ1dHRvbiBwcmVzc2VzIGFuZCBjYWxscyB0aGUgY29udHJvbGxlci5cblx0XHRcdGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuYmluZCgna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRzd2l0Y2ggKGV2ZW50LndoaWNoKSB7XG5cdFx0XHRcdFx0XHRjYXNlIDQ4OlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzAnKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDQ5OlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzEnKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDUwOlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzInKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDUxOlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzMnKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDUyOlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzQnKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDUzOlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzUnKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDU0OlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzYnKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDU1OlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzcnKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDU2OlxuXHRcdFx0XHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnRPcGVyYXRvcigneCcpXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc4Jyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA1Nzpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc5Jyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAxOTA6XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydERlY2ltYWwoKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDg6XG5cdFx0XHRcdFx0XHRcdGlmICghZXZlbnQuc2hpZnRLZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5yZXNldE1vZGVsKCk7XG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMTM6XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmVxdWF0ZSgpO1xuXHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMTg3OlxuXHRcdFx0XHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkpIHtcblx0XHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnRPcGVyYXRvcignKycpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDE4OTpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3IoJy0nKVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMTkxOlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnRPcGVyYXRvcignLycpXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gLy8gc3dpdGNoXG5cdFx0XHRcdH0pIC8vICRzY29wZS5hcHBseVxuXHRcdFx0fSkgLy8gYW5ndWxhciBrZXlkb3duIGJpbmRcblx0XHR9IC8vIGxpbmtcblx0fTsgLy8gcmV0dXJuXG59OyAvLyBtb2R1bGUuZXhwb3J0cyA9XG4iLCJcbi8qKlxuICogRGVjaW1hbCBCdXR0b24gRGlyZWN0aXZlXG4gKiBAYXV0aG9yIFl1J04gQ29cbiAqIEBkZXNjcmlwdGlvbiBWaWV3IGZvciBidXR0b24gdGhhdCBhcHBlbmRzIGEgZGVjaW1hbCBwb2ludCB0byBudW1iZXJcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvZGVjaW1hbEJ1dHRvbi5qYWRlJykoKVxuXHR9O1xufTtcbiIsIlxuLyoqXG4gKiBFcXVhdGUgQnV0dG9uIERpcmVjdGl2ZVxuICogQGF1dGhvciBZdSdOIENvXG4gKiBAZGVzY3JpcHRpb24gVmlldyBmb3IgYnV0dG9uIHRoYXQgc2lnbmFscyBhbiBlcXVhdGUuXG4gKi9cblxuLy8gRGlyZWN0aXZlcyBcImRlc2NyaWJlXCIgdGhlIHZpZXcgYW5kIGxpbmsgdG8gaXQuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvZXF1YXRlQnV0dG9uLmphZGUnKSgpXG5cdH07XG59O1xuIiwiXG4vKipcbiAqIE11dGF0aW9uIEJ1dHRvbiBEaXJlY3RpdmVcbiAqIEBhdXRob3IgWXUnTiBDb1xuICogQGRlc2NyaXB0aW9uIERlc2NyaWJlcyB2aWV3IGZvciBidXR0b25zIHRoYXQgY29uY2F0ZW5hdGVzIG51bWJlcnMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRuYW1lOiAnQCcsIC8vIEFjY2VwdCBhIHN0cmluZyBhcyB0aGUgbmFtZVxuXHRcdFx0bXV0YXRvcjogJyYnIC8vIEFjY2VwdCBhIG11dGF0b3IgZnVuY3Rpb24gYWRkcmVzc1xuXHRcdH0sXG5cdFx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvbXV0YXRpb25CdXR0b24uamFkZScpKClcblx0fTtcbn07XG4iLCJcbi8qKlxuICogTnVtYmVyIEJ1dHRvbiBEaXJlY3RpdmVcbiAqIEBhdXRob3IgWXUnTiBDb1xuICogQGRlc2NyaXB0aW9uIERlc2NyaWJlcyB2aWV3IGZvciBidXR0b25zIHRoYXQgY29uY2F0ZW5hdGVzIG51bWJlcnMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRudW1iZXI6ICdAJyAvLyBBY2NlcHQgYSBzdHJpbmcgYXMgdGhlIG51bWJlciB0byBkaXNwbGF5XG5cdFx0fSxcblx0XHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9udW1iZXJCdXR0b24uamFkZScpKClcblx0fTtcbn07XG4iLCJcbi8qKlxuICogTnVtYmVyIFZpZXcgRGlyZWN0aXZlXG4gKiBAYXV0aG9yIFl1J04gQ29cbiAqIEBkZXNjcmlwdGlvbiBWaWV3IHRvIGRpc3BsYXkgdGhlIG51bWJlcnMgYW5kIG9wZXJhdG9ycyBpbiBhIGNhbGN1bGF0aW9uLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bW9kZWw6ICc9JyAvLyBtb2RlbCB0byBkaXNwbGF5XG5cdFx0fSxcblx0XHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9udW1iZXJWaWV3LmphZGUnKSgpXG5cdH07XG59O1xuIiwiXG4vKipcbiAqIE9wZXJhdG9yIEJ1dHRvbiBEaXJlY3RpdmVcbiAqIEBhdXRob3IgWXUnTiBDb1xuICogQGRlc2NyaXB0aW9uIEJ1dHRvbiB0byB0cmlnZ2VyIGFuIG9wZXJhdGlvbiB3aXRoIGEgZGVmaW5lZCBvcGVyYXRvclxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0b3BlcmF0b3I6ICdAJyAvLyBEZXNjcmliZSBhbiBvcGVyYXRvciB3aXRoIGEgc3RyaW5nXG5cdFx0fSxcblx0XHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9vcGVyYXRvckJ1dHRvbi5qYWRlJykoKVxuXHR9O1xufTtcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxudW1iZXItdmlldyBtb2RlbD1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIubW9kZWxcXFwiPjwvbnVtYmVyLXZpZXc+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJzaXggY29sdW1uc1xcXCI+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiMVxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCIyXFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjNcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI0XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjVcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiNlxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjdcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiOFxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI5XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxkZWNpbWFsLWJ1dHRvbj48L2RlY2ltYWwtYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCIwXFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48ZXF1YXRlLWJ1dHRvbj48L2VxdWF0ZS1idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwidHdvIGNvbHVtbnNcXFwiPjxvcGVyYXRvci1idXR0b24gb3BlcmF0b3I9XFxcIitcXFwiPjwvb3BlcmF0b3ItYnV0dG9uPjxvcGVyYXRvci1idXR0b24gb3BlcmF0b3I9XFxcIi1cXFwiPjwvb3BlcmF0b3ItYnV0dG9uPjxvcGVyYXRvci1idXR0b24gb3BlcmF0b3I9XFxcInhcXFwiPjwvb3BlcmF0b3ItYnV0dG9uPjxvcGVyYXRvci1idXR0b24gb3BlcmF0b3I9XFxcIi9cXFwiPjwvb3BlcmF0b3ItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCJDbGVhclxcXCIgbXV0YXRvcj1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIucmVzZXRNb2RlbCgpXFxcIj48L211dGF0aW9uLWJ1dHRvbj48bXV0YXRpb24tYnV0dG9uIG5hbWU9XFxcIlNpblxcXCIgbXV0YXRvcj1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIubXV0YXRvclNpbigpXFxcIj48L211dGF0aW9uLWJ1dHRvbj48bXV0YXRpb24tYnV0dG9uIG5hbWU9XFxcIkNvc1xcXCIgbXV0YXRvcj1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIubXV0YXRvckNvcygpXFxcIj48L211dGF0aW9uLWJ1dHRvbj48bXV0YXRpb24tYnV0dG9uIG5hbWU9XFxcIisvLVxcXCIgbXV0YXRvcj1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIuZmxpcFNpZ24oKVxcXCI+PC9tdXRhdGlvbi1idXR0b24+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCJUaXAgQmFkbHkgKDEwJSlcXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLmJhZFRpcCgpXFxcIj48L211dGF0aW9uLWJ1dHRvbj48bXV0YXRpb24tYnV0dG9uIG5hbWU9XFxcIlRpcCBPa2F5ICgxNSUpXFxcIiBtdXRhdG9yPVxcXCJjYWxjdWxhdG9yQ29udHJvbGxlci5va2F5VGlwKClcXFwiPjwvbXV0YXRpb24tYnV0dG9uPjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8YSBuZy1jbGljaz1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0RGVjaW1hbCgpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGJ1dHRvbi1wcmltYXJ5IHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj4uPC9hPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8YSBuZy1jbGljaz1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIuZXF1YXRlKClcXFwiIGNsYXNzPVxcXCJidXR0b24gYnV0dG9uLXByaW1hcnkgdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPj08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCJtdXRhdG9yKClcXFwiIGNsYXNzPVxcXCJidXR0b24gdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPnt7IG5hbWUgfX08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCIkcGFyZW50LmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcihudW1iZXIpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj57eyBudW1iZXIgfX08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcInt7bW9kZWwubGVmdH19IHt7bW9kZWwub3BlcmF0b3J9fSB7e21vZGVsLnJpZ2h0fX1cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGEgbmctY2xpY2s9XFxcIiRwYXJlbnQuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3Iob3BlcmF0b3IpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj57eyBvcGVyYXRvciB9fTwvYT5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiXG4vKipcbiAqIENhbGN1bGF0b3IgTW9kZWxcbiAqIEBhdXRob3IgWXUnTiBDb1xuICogQGRlc2NyaXB0aW9uIERlc2NyaWJlcyB0aGUgbW9kZWwgdG8gYmUgdXNlZC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gY2xhc3MgQ2FsY3VsYXRvck1vZGVsIHtcblx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdHRoaXMubGVmdCA9ICcnXG5cdFx0XHR0aGlzLnJpZ2h0ID0gJydcblx0XHRcdHRoaXMub3BlcmF0b3IgPSAnJ1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENvbXBhcmUgdGhlIGVxdWFsaXR5IG9mIHRoaXMgbW9kZWwgdG8gYW5vdGhlciBtb2RlbFxuXHRcdCAqIEBwYXJhbSAge0NhbGN1bGF0b3JNb2RlbH0gb3RoZXJNb2RlbCB0aGUgbW9kZWwgdG8gY29tcGFyZSB3aXRoXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIGVxdWFsaXR5XG5cdFx0ICovXG5cdFx0ZXF1YWxzKG90aGVyTW9kZWwpIHtcblx0XHRcdHJldHVybiB0aGlzLmxlZnQgPT0gb3RoZXJNb2RlbC5sZWZ0ICYmXG5cdFx0XHRcdHRoaXMucmlnaHQgPT0gb3RoZXJNb2RlbC5yaWdodCAmJlxuXHRcdFx0XHR0aGlzLm9wZXJhdG9yID09IG90aGVyTW9kZWwub3BlcmF0b3I7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlIGEgZGVlcCBjb3B5IG9mIHRoZSBtb2RlbFxuXHRcdCAqIEByZXR1cm4ge0NhbGN1bGF0b3JNb2RlbH0gY2xvbmVcblx0XHQgKi9cblx0XHRjbG9uZSgpIHtcblx0XHRcdHZhciBjbG9uZSA9IG5ldyBDYWxjdWxhdG9yTW9kZWwoKTtcblx0XHRcdGNsb25lLmxlZnQgPSB0aGlzLmxlZnQ7XG5cdFx0XHRjbG9uZS5yaWdodCA9IHRoaXMucmlnaHQ7XG5cdFx0XHRjbG9uZS5vcGVyYXRvciA9IHRoaXMub3BlcmF0b3I7XG5cdFx0XHRyZXR1cm4gY2xvbmU7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQ29weSBkYXRhIGZyb20gb3RoZXIgbW9kZWwgdG8gY3VycmVudCBtb2RlbFxuXHRcdCAqIEBwYXJhbSAge0NhbGN1bGF0b3JNb2RlbH0gb3RoZXIgbW9kZWxcblx0XHQgKi9cblx0XHRjb3B5KG90aGVyTW9kZWwpIHtcblx0XHRcdHRoaXMubGVmdCA9IG90aGVyTW9kZWwubGVmdDtcblx0XHRcdHRoaXMucmlnaHQgPSBvdGhlck1vZGVsLnJpZ2h0O1xuXHRcdFx0dGhpcy5vcGVyYXRvciA9IG90aGVyTW9kZWwub3BlcmF0b3I7XG5cdFx0fVxuXHR9O1xufSIsIlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ2FsY3VsYXRvck1vZGVsLCAkbG9jYXRpb24sICRodHRwLCAkaW50ZXJ2YWwpIHtcblx0cmV0dXJuIG5ldyBjbGFzcyBDYWxjdWxhdG9yV2ViU3luYyB7XG5cblx0XHRhdXRvdXBkYXRlKG1vZGVsKSB7XG5cblx0XHRcdHZhciBfbW9kZWwgPSBtb2RlbDtcblxuXHRcdFx0dmFyIHdhaXRGb3JSdW4gPSB0cnVlO1xuXHRcdFx0dmFyIHByZXZpb3VzTW9kZWwgPSBudWxsO1xuXG5cdFx0XHQvLyBSZXF1ZXN0IGluaXRpYWwgbW9kZWwuXG5cdFx0XHR0aGlzLnJlcXVlc3QoKVxuXHRcdFx0LnRoZW4oKG1vZGVsKSA9PiB7XG5cdFx0XHRcdF9tb2RlbC5jb3B5KG1vZGVsKTtcblx0XHRcdFx0cHJldmlvdXNNb2RlbCA9IF9tb2RlbC5jbG9uZSgpO1xuXHRcdFx0XHR3YWl0Rm9yUnVuID0gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gU2F2ZSBldmVyeSA1MDBtc1xuXHRcdFx0dmFyIHNhdmV0aW1lciA9ICRpbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdGlmICh3YWl0Rm9yUnVuKSByZXR1cm47XG5cblx0XHRcdFx0Ly8gSWYgb3VyIG1vZGVsIGhhcyBjaGFuZ2VkLCB1cGxvYWQgaXQuXG5cdFx0XHRcdGlmICghX21vZGVsLmVxdWFscyhwcmV2aW91c01vZGVsKSkge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlKF9tb2RlbClcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRwcmV2aW91c01vZGVsID0gX21vZGVsLmNsb25lKCk7XG5cdFx0XHRcdFx0XHR3YWl0Rm9yUnVuID0gZmFsc2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdC8vIElmIG91ciBtb2RlbCBpcyB0aGUgc2FtZSwgdXBkYXRlIHRvIHNlcnZlcidzLlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMucmVxdWVzdCgpXG5cdFx0XHRcdFx0LnRoZW4oKG1vZGVsKSA9PiB7XG5cdFx0XHRcdFx0XHRfbW9kZWwuY29weShtb2RlbCk7XG5cdFx0XHRcdFx0XHRwcmV2aW91c01vZGVsID0gX21vZGVsLmNsb25lKCk7XG5cdFx0XHRcdFx0XHR3YWl0Rm9yUnVuID0gZmFsc2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSwgNTAwKTtcblxuXHRcdFx0cmV0dXJuIHNhdmV0aW1lcjtcblxuXHRcdH1cblxuXHRcdHVwZGF0ZShtb2RlbCkge1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXBkYXRlJywge2lkOiB0aGlzLmdldElkKCksIG1vZGVsOiBtb2RlbH0pO1xuXHRcdH1cblxuXHRcdHJlcXVlc3QoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3JlcXVlc3QnLCB7cGFyYW1zOiB7aWQ6IHRoaXMuZ2V0SWQoKX19KVxuXHRcdFx0LnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdHZhciBuZXdNb2RlbCA9IG5ldyBDYWxjdWxhdG9yTW9kZWwoKTtcblx0XHRcdFx0bmV3TW9kZWwubGVmdCA9IHJlc3BvbnNlLmRhdGEubGVmdCB8fCAnJztcblx0XHRcdFx0bmV3TW9kZWwucmlnaHQgPSByZXNwb25zZS5kYXRhLnJpZ2h0IHx8ICcnO1xuXHRcdFx0XHRuZXdNb2RlbC5vcGVyYXRvciA9IHJlc3BvbnNlLmRhdGEub3BlcmF0b3IgfHwgJyc7XG5cdFx0XHRcdHJldHVybiBuZXdNb2RlbDtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGdldElkKCkge1xuXHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKCkuc3Vic3RyaW5nKDEpO1xuXHRcdH1cblxuXHR9O1xufVxuIixudWxsLCIhZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSxlKTtlbHNle3ZhciBmO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/Zj13aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9mPWdsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmKGY9c2VsZiksZi5qYWRlPWUoKX19KGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKSA6XG4gICAgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JykgPyBPYmplY3Qua2V5cyh2YWwpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB2YWxba2V5XTsgfSkgOlxuICAgIFt2YWxdKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuXG5leHBvcnRzLnN0eWxlID0gZnVuY3Rpb24gKHZhbCkge1xuICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbCkubWFwKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXTtcbiAgICB9KS5qb2luKCc7Jyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxufTtcbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICB2YWwgPSBleHBvcnRzLnN0eWxlKHZhbCk7XG4gIH1cbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsKS5pbmRleE9mKCcmJykgIT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NpbmNlIEphZGUgMi4wLjAsIGFtcGVyc2FuZHMgKGAmYCkgaW4gZGF0YSBhdHRyaWJ1dGVzICcgK1xuICAgICAgICAgICAgICAgICAgICd3aWxsIGJlIGVzY2FwZWQgdG8gYCZhbXA7YCcpO1xuICAgIH07XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBlbGltaW5hdGUgdGhlIGRvdWJsZSBxdW90ZXMgYXJvdW5kIGRhdGVzIGluICcgK1xuICAgICAgICAgICAgICAgICAgICdJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlID0gZnVuY3Rpb24gZXNjYXBlKGh0bWwpe1xuICB2YXIgcmVzdWx0ID0gU3RyaW5nKGh0bWwpXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxufSx7XCJmc1wiOjJ9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblxufSx7fV19LHt9LFsxXSkoMSlcbn0pOyJdfQ==
