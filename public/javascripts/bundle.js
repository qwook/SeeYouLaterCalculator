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
			if ((isNaN(parseFloat(this.model.right)) || !isFinite(parseFloat(this.model.right))) && this.model.right != '') return;

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
			if ((isNaN(parseFloat(this.model.right)) || !isFinite(parseFloat(this.model.right))) && this.model.right != '') return;

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
			if ((isNaN(parseFloat(this.model.right)) || !isFinite(parseFloat(this.model.right))) && this.model.right == '') return;

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

buf.push("<number-view model=\"calculatorController.model\"></number-view><div class=\"row\"><div class=\"six columns\"><div class=\"row\"><div class=\"four columns\"><number-button number=\"1\"></number-button></div><div class=\"four columns\"><number-button number=\"2\"></number-button></div><div class=\"four columns\"><number-button number=\"3\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"4\"></number-button></div><div class=\"four columns\"><number-button number=\"5\"></number-button></div><div class=\"four columns\"><number-button number=\"6\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"7\"></number-button></div><div class=\"four columns\"><number-button number=\"8\"></number-button></div><div class=\"four columns\"><number-button number=\"9\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><decimal-button></decimal-button></div><div class=\"four columns\"><number-button number=\"0\"></number-button></div><div class=\"four columns\"><equate-button></equate-button></div></div></div><div class=\"two columns\"><operator-button operator=\"+\"></operator-button><operator-button operator=\"-\"></operator-button><operator-button operator=\"x\"></operator-button><operator-button operator=\"/\"></operator-button></div><div class=\"four columns\"><mutation-button name=\"Clear\" mutator=\"calculatorController.resetModel()\"></mutation-button><mutation-button name=\"Sin\" mutator=\"calculatorController.mutatorSin()\"></mutation-button><mutation-button name=\"Cos\" mutator=\"calculatorController.mutatorCos()\"></mutation-button><mutation-button name=\"+/-\" mutator=\"calculatorController.flipSign()\"></mutation-button></div></div>");;return buf.join("");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L21haW4uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2NvbnRyb2xsZXJzL0NhbGN1bGF0b3JDb250cm9sbGVyLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL2NhbGN1bGF0b3IuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvZGVjaW1hbEJ1dHRvbi5qcyIsIi9Wb2x1bWVzL1N1cGVyTm92YS9TY2hvb2wvU3ByaW5nMjAxNS9DTVBFMTMxL1NlZVlvdUxhdGVyQ2FsY3VsYXRvci9jbGllbnQvZGlyZWN0aXZlcy9lcXVhdGVCdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbXV0YXRpb25CdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbnVtYmVyQnV0dG9uLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL251bWJlclZpZXcuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvb3BlcmF0b3JCdXR0b24uanMiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9jYWxjdWxhdG9yLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9kZWNpbWFsQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9lcXVhdGVCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL211dGF0aW9uQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9udW1iZXJCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL251bWJlclZpZXcuamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL29wZXJhdG9yQnV0dG9uLmphZGUiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L21vZGVscy9DYWxjdWxhdG9yTW9kZWwuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L3NlcnZpY2VzL0NhbGN1bGF0b3JXZWJTeW5jLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNhQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQzs7O0NBRzVDLE1BQU0sQ0FBQyxVQUFTLGlCQUFpQixF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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKiBMZXQncyB0YWxrIGFib3V0IE5vZGVKUy4gKi9cblxuLyogWW91IG1pZ2h0IGtub3cgZnJvbSBKYXZhIG9yIEMrKyB0aGUgYGltcG9ydGAgYW5kIGAjaW5jbHVkZWAga2V5d29yZHNcbiBUaG9zZSBrZXl3b3JkcyB3aWxsIGltcG9ydCB0aGUgZmlsZS5cbiBJbiBOb2RlSlMsIHRoZSBlcXVpdmFsZW50IG9mIHRoYXQgaXMgXCJyZXF1aXJlXCJcbiBcInJlcXVpcmVcIiB3aWxsIGFjdHVhbGx5IHJ1biB0aGUgZmlsZS5cblxuIFVubGlrZSBpbiBKYXZhIGFuZCBDKyssIHlvdSBkb24ndCBoYXZlIHRvIGNhbGwgYHJlcXVpcmVgIGF0IHRoZSB0b3AuXG4gVG8ga2VlcCB0aGUgZmxvdyBvZiB0aGUgY29kZSwgSSd2ZSB1c2VkIHRoZSBgcmVxdWlyZWAgaW5zaWRlIGZ1bmN0aW9uc1xuIGFuZCB3aGVuIGRlZmluaW5nIGNvbnRyb2xsZXJzIGFuZCB2aWV3cy5cbiAqL1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKFwiY2FsY3VsYXRvckFwcFwiLCBbXSlcbi8vIHRoaXMgaXMgdG8gZ3JhYiB0aGUgYWRkcmVzcyBiYXIgVVJMXG4vLyBtYWlubHkgdXNlZCBmb3IgY3JlYXRpbmcgZGlmZmVyZW50IHNlc3Npb25zXG4uY29uZmlnKGZ1bmN0aW9uKCRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKS5oYXNoUHJlZml4KCchJyk7XG59KTtcblxuLypcbiBMZXQncyB0YWxrIGFib3V0IGFuZ3VsYXIgZm9yIGEgYml0LlxuIEFuZ3VsYXIgaGFuZGxlcyBhbGwgdGhyZWUgb2YgdGhlIE0tVi1DLlxuIFRoZSB3YXkgaXQgZG9lcyBpdCBpcyBraW5kIG9mIGNvbmZ1c2luZywgYnV0IEknbGwgdHJ5IG15IGJlc3QgdG8gZXhwbGFpbi5cblxuIFRoZSBcIlZpZXdcIiBpbiBhbmd1bGFyIGlzIGRlc2NyaWJlZCBieSBhIFwiRGlyZWN0aXZlXCJcbiBBIFwiRGlyZWN0aXZlXCIgd2lsbCBkZXNjcmliZSB0aGUgdmlldywgaG93IHlvdSBjYW4gdXNlIGl0LFxuIHdoYXQgZGF0YSB5b3UgY2FuIHBhc3MgdG8gdGhlIHZpZXcsIGFuZCB0aGUgaHRtbC9qYWRlIGZpbGUgdXNlZFxuIHRvIHJlbmRlciBpdC5cbiovXG5cbi8qIGRlZmluZSBkaXJlY3RpdmVzICh2aWV3cykgKi9cbmFwcC5kaXJlY3RpdmUoXCJjYWxjdWxhdG9yXCIsXG5cdHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9jYWxjdWxhdG9yLmpzJylcbik7XG5hcHAuZGlyZWN0aXZlKFwibnVtYmVyQnV0dG9uXCIsXG5cdHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9udW1iZXJCdXR0b24uanMnKVxuKTtcbmFwcC5kaXJlY3RpdmUoXCJkZWNpbWFsQnV0dG9uXCIsXG5cdHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9kZWNpbWFsQnV0dG9uLmpzJylcbik7XG5hcHAuZGlyZWN0aXZlKFwib3BlcmF0b3JCdXR0b25cIixcblx0cmVxdWlyZSgnLi9kaXJlY3RpdmVzL29wZXJhdG9yQnV0dG9uLmpzJylcbik7XG5hcHAuZGlyZWN0aXZlKFwiZXF1YXRlQnV0dG9uXCIsXG5cdHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9lcXVhdGVCdXR0b24uanMnKVxuKTtcbmFwcC5kaXJlY3RpdmUoXCJtdXRhdGlvbkJ1dHRvblwiLFxuXHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbXV0YXRpb25CdXR0b24uanMnKVxuKTtcbmFwcC5kaXJlY3RpdmUoXCJudW1iZXJWaWV3XCIsXG5cdHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9udW1iZXJWaWV3LmpzJylcbik7XG5cbi8qIGRlZmluZSBjb250cm9sbGVycyAqL1xuYXBwLmNvbnRyb2xsZXIoXCJDYWxjdWxhdG9yQ29udHJvbGxlclwiLFxuXHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0NhbGN1bGF0b3JDb250cm9sbGVyLmpzJylcbik7XG5cbi8qIGRlZmluZSBmYWN0b3JpZXMgKG1vZGVscykgKi9cbmFwcC5mYWN0b3J5KFwiQ2FsY3VsYXRvck1vZGVsXCIsXG5cdHJlcXVpcmUoJy4vbW9kZWxzL0NhbGN1bGF0b3JNb2RlbC5qcycpXG4pO1xuXG4vKiBkZWZpbmUgc2VydmljZXMgKi9cbmFwcC5zZXJ2aWNlKFwiQ2FsY3VsYXRvcldlYlN5bmNcIixcblx0cmVxdWlyZSgnLi9zZXJ2aWNlcy9DYWxjdWxhdG9yV2ViU3luYy5qcycpXG4pO1xuIiwiXG4vKipcbiAqIENhbGN1bGF0b3IgQ29udHJvbGxlclxuICogQGRlc2NyaXB0aW9uIENvbnRyb2xsZXIgZm9yIGNhbGN1bGF0aW5nIGFuIGVxdWF0aW9uXG4gKiBnaXZlbiBsZWZ0IGFuZCByaWdodCBudW1iZXJzLCBhbmQgYW4gb3BlcmF0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENhbGN1bGF0b3JDb250cm9sbGVyIHtcblx0Y29uc3RydWN0b3IoQ2FsY3VsYXRvck1vZGVsLCBDYWxjdWxhdG9yV2ViU3luYywgJGludGVydmFsLCAkc2NvcGUpIHtcblx0XHQvLyBEZWZpbmUgaW5zdGFuY2UgdmFyaWFibGVzXG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gZmFsc2Vcblx0XHR0aGlzLm1vZGVsID0gbmV3IENhbGN1bGF0b3JNb2RlbCgpO1xuXHRcdHRoaXMudGVzdCA9ICcnO1xuXG5cdFx0Ly8gU3RhcnQgYXV0b3VwZGF0aW5nXG5cdFx0dmFyIGF1dG91cGRhdGUgPSBDYWxjdWxhdG9yV2ViU3luYy5hdXRvdXBkYXRlKHRoaXMubW9kZWwpO1xuXHRcdCRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG5cdFx0XHQkaW50ZXJ2YWwuY2FuY2VsKGF1dG91cGRhdGUpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsZWFyIC8gcmVzZXQgdGhlIG1vZGVsIHRvIGRlZmF1bHQgc2V0dGluZ3MuXG5cdCAqL1xuXHRyZXNldE1vZGVsKCkge1xuXHRcdHRoaXMubW9kZWwubGVmdCA9ICcnXG5cdFx0dGhpcy5tb2RlbC5yaWdodCA9ICcnXG5cdFx0dGhpcy5tb2RlbC5vcGVyYXRvciA9ICcnXG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogQ29uY2F0ZW5hdGUgYSBudW1iZXIgdG8gd29ya2luZyBudW1iZXJcblx0ICogQHBhcmFtICB7TnVtYmVyfSBudW1iZXIgdG8gY29uY2F0ZW5hdGUgd2l0aFxuXHQgKi9cblx0aW5zZXJ0TnVtYmVyKG51bWJlcikge1xuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgIT0gJycgJiYgdGhpcy5tb2RlbC5yaWdodCA9PSAnJyAmJiB0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcnKSB7XG5cdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnMCcpIHtcblx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSAnJztcblx0XHR9XG5cblx0XHQvLyBEb24ndCBhcHBlbmQgdG8gc29tZXRoaW5nIHRoYXQgaXNuJ3QgYSBudW1iZXIuXG5cdFx0aWYgKFxuXHRcdFx0KFxuXHRcdFx0XHRpc05hTihwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpKSB8fFxuXHRcdFx0XHQhaXNGaW5pdGUocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSlcblx0XHRcdClcblx0XHRcdCYmIHRoaXMubW9kZWwucmlnaHQgIT0gJydcblx0XHQpIHJldHVybjtcblxuXHRcdHRoaXMubW9kZWwucmlnaHQgKz0gbnVtYmVyLnRvU3RyaW5nKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb25jYXRlbmF0ZSBhIGRlY2ltYWwgdG8gdGhlIGVuZCBvZiB0aGUgbnVtYmVyXG5cdCAqL1xuXHRpbnNlcnREZWNpbWFsKCkge1xuXHRcdGlmICh0aGlzLmluc2VydGluZ0RlY2ltYWwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tb2RlbC5sZWZ0ICE9ICcnICYmIHRoaXMubW9kZWwucmlnaHQgPT0gJycgJiYgdGhpcy5tb2RlbC5vcGVyYXRvciA9PSAnJykge1xuXHRcdFx0dGhpcy5yZXNldE1vZGVsKCk7XG5cdFx0fVxuXG5cdFx0Ly8gRG9uJ3QgYXBwZW5kIHRvIHNvbWV0aGluZyB0aGF0IGlzbid0IGEgbnVtYmVyLlxuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0aXNOYU4ocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSkgfHxcblx0XHRcdFx0IWlzRmluaXRlKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpXG5cdFx0XHQpXG5cdFx0XHQmJiB0aGlzLm1vZGVsLnJpZ2h0ICE9ICcnXG5cdFx0KSByZXR1cm47XG5cblx0XHR0aGlzLm1vZGVsLnJpZ2h0ICs9ICcuJztcblxuXHRcdHRoaXMuaW5zZXJ0aW5nRGVjaW1hbCA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBvcGVyYXRvciBmb3IgdGhlIGN1cnJlbnQgY2FsY3VsYXRpb24uXG5cdCAqIEBwYXJhbSAge1N0cmluZ30gdGhlIG9wZXJhdG9yXG5cdCAqL1xuXHRpbnNlcnRPcGVyYXRvcihvcGVyYXRvcikge1xuXHRcdHRoaXMuZXF1YXRlKCk7XG5cblx0XHRpZiAodGhpcy5tb2RlbC5sZWZ0ID09ICcnICYmIHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJycgJiYgdGhpcy5tb2RlbC5yaWdodCAhPSAnJykge1xuXHRcdFx0dGhpcy5tb2RlbC5sZWZ0ID0gdGhpcy5tb2RlbC5yaWdodDtcblx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSAnJztcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tb2RlbC5sZWZ0ID09ICcnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5tb2RlbC5vcGVyYXRvciA9IG9wZXJhdG9yO1xuXHRcdFxuXHRcdHRoaXMuY2xhbXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGUgdGhlIGN1cnJlbnQgZXF1YXRpb24uXG5cdCAqL1xuXHRlcXVhdGUoKSB7XG5cblx0XHQvLyBXZSBoYXZlIG9wZXJhbmRzLCBub3cgZXF1YXRlIGZvciB0aGUgY29ycmVzcG9uZGluZyBvcGVyYXRvci5cblx0XHRpZiAodGhpcy5tb2RlbC5sZWZ0ICE9ICcnICYmIHRoaXMubW9kZWwucmlnaHQgIT0gJycpIHtcblx0XHRcdHZhciBsZWZ0ID0gcGFyc2VGbG9hdCh0aGlzLm1vZGVsLmxlZnQpO1xuXHRcdFx0dmFyIHJpZ2h0ID0gcGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KTtcblx0XHRcdGlmICh0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcrJykge1xuXHRcdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9IChsZWZ0ICsgcmlnaHQpLnRvU3RyaW5nKCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJy0nKSB7XG5cdFx0XHRcdHRoaXMucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gKGxlZnQgLSByaWdodCkudG9TdHJpbmcoKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5tb2RlbC5vcGVyYXRvciA9PSAneCcpIHtcblx0XHRcdFx0dGhpcy5yZXNldE1vZGVsKCk7XG5cdFx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSAobGVmdCAqIHJpZ2h0KS50b1N0cmluZygpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcvJykge1xuXHRcdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9IChsZWZ0IC8gcmlnaHQpLnRvU3RyaW5nKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gZmFsc2U7XG5cblx0XHR0aGlzLmNsYW1wKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlIHRoZSBzaW4gZnVuY3Rpb24gZm9yIHRoZSBjdXJyZW50IHdvcmtpbmcgb3BlcmF0aW9uLlxuXHQgKi9cblx0bXV0YXRvclNpbigpIHtcblx0XHR0aGlzLmVxdWF0ZSgpO1xuXG5cdFx0aWYgKHRoaXMubW9kZWwucmlnaHQgPT0gJycpIHJldHVybjtcblxuXHRcdHRoaXMubW9kZWwucmlnaHQgPSBNYXRoLnNpbihwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpKS50b1N0cmluZygpO1xuXG5cdFx0dGhpcy5jbGFtcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZSB0aGUgY29zIGZ1bmN0aW9uIGZvciB0aGUgY3VycmVudCB3b3JraW5nIG9wZXJhdGlvbi5cblx0ICovXG5cdG11dGF0b3JDb3MoKSB7XG5cdFx0dGhpcy5lcXVhdGUoKTtcblxuXHRcdGlmICh0aGlzLm1vZGVsLnJpZ2h0ID09ICcnKSByZXR1cm47XG5cblx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gTWF0aC5jb3MocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSkudG9TdHJpbmcoKTtcblxuXHRcdHRoaXMuY2xhbXAoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGbGlwIHRoZSBwYXJpdHkgb2YgdGhlIHdvcmtpbmcgbnVtYmVyLlxuXHQgKi9cblx0ZmxpcFNpZ24oKSB7XG5cdFx0aWYgKHRoaXMubW9kZWwucmlnaHQgPT0gJycpIHJldHVybjtcblxuXHRcdHRoaXMubW9kZWwucmlnaHQgPSAoLTEgKiBwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpKS50b1N0cmluZygpO1xuXG5cdFx0dGhpcy5jbGFtcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEVuc3VyZSB0aGF0IGEgbnVtYmVyIGlzbid0IHRvbyBiaWcuXG5cdCAqL1xuXHRjbGFtcCgpIHtcblx0XHQvLyBEb24ndCBjbGFtcCBpZiBpdCdzIG5vdCBhIG51bWJlclxuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0aXNOYU4ocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSkgfHxcblx0XHRcdFx0IWlzRmluaXRlKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpXG5cdFx0XHQpXG5cdFx0XHQmJiB0aGlzLm1vZGVsLnJpZ2h0ID09ICcnXG5cdFx0KSByZXR1cm47XG5cblx0XHQvLyBDbGFtcCB0byA2IGRpZ2l0c1xuXHRcdHRoaXMubW9kZWwucmlnaHQgPSAoTWF0aC5mbG9vcihwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpICogMTAwMDAwMCkgLyAxMDAwMDAwKS50b1N0cmluZygpXG5cdH1cblxufTtcbiIsIlxuLyoqXG4gKiBDYWxjdWxhdG9yIERpcmVjdGl2ZVxuICogQGF1dGhvciBZdSdOIENvXG4gKiBAZGVzY3JpcHRpb24gTWFpbiB2aWV3IGZvciBjYWxjdWxhdG9yLiBDb250YWlucyBhbGwgYnV0dG9ucyBpbiB0aGUgY2FsY3VsYXRvci5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvY2FsY3VsYXRvci5qYWRlJykoKSxcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdC8vIHRoaXMgaXMgdG8gYmluZCBrZXlwcmVzc2VzIHRvIGFuIGFjdGlvbiBpbiB0aGUgY29udHJvbGxlci5cblxuXHRcdFx0Ly8gS2V5cHJlc3NlcyBlbXVsYXRlIHRoZSBidXR0b24gcHJlc3NlcyBhbmQgY2FsbHMgdGhlIGNvbnRyb2xsZXIuXG5cdFx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmJpbmQoJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0c3dpdGNoIChldmVudC53aGljaCkge1xuXHRcdFx0XHRcdFx0Y2FzZSA0ODpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCcwJyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA0OTpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCcxJyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA1MDpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCcyJyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA1MTpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCczJyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA1Mjpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc0Jyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA1Mzpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc1Jyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA1NDpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc2Jyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA1NTpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc3Jyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA1Njpcblx0XHRcdFx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3IoJ3gnKVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignOCcpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgNTc6XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignOScpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgMTkwOlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnREZWNpbWFsKCk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSA4OlxuXHRcdFx0XHRcdFx0XHRpZiAoIWV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDEzOlxuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5lcXVhdGUoKTtcblx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDE4Nzpcblx0XHRcdFx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3IoJysnKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAxODk6XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE9wZXJhdG9yKCctJylcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDE5MTpcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3IoJy8nKVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9IC8vIHN3aXRjaFxuXHRcdFx0XHR9KSAvLyAkc2NvcGUuYXBwbHlcblx0XHRcdH0pIC8vIGFuZ3VsYXIga2V5ZG93biBiaW5kXG5cdFx0fSAvLyBsaW5rXG5cdH07IC8vIHJldHVyblxufTsgLy8gbW9kdWxlLmV4cG9ydHMgPVxuIiwiXG4vKipcbiAqIERlY2ltYWwgQnV0dG9uIERpcmVjdGl2ZVxuICogQGF1dGhvciBZdSdOIENvXG4gKiBAZGVzY3JpcHRpb24gVmlldyBmb3IgYnV0dG9uIHRoYXQgYXBwZW5kcyBhIGRlY2ltYWwgcG9pbnQgdG8gbnVtYmVyXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlOiByZXF1aXJlKCcuL3ZpZXdzL2RlY2ltYWxCdXR0b24uamFkZScpKClcblx0fTtcbn07XG4iLCJcbi8qKlxuICogRXF1YXRlIEJ1dHRvbiBEaXJlY3RpdmVcbiAqIEBhdXRob3IgWXUnTiBDb1xuICogQGRlc2NyaXB0aW9uIFZpZXcgZm9yIGJ1dHRvbiB0aGF0IHNpZ25hbHMgYW4gZXF1YXRlLlxuICovXG5cbi8vIERpcmVjdGl2ZXMgXCJkZXNjcmliZVwiIHRoZSB2aWV3IGFuZCBsaW5rIHRvIGl0LlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlOiByZXF1aXJlKCcuL3ZpZXdzL2VxdWF0ZUJ1dHRvbi5qYWRlJykoKVxuXHR9O1xufTtcbiIsIlxuLyoqXG4gKiBNdXRhdGlvbiBCdXR0b24gRGlyZWN0aXZlXG4gKiBAYXV0aG9yIFl1J04gQ29cbiAqIEBkZXNjcmlwdGlvbiBEZXNjcmliZXMgdmlldyBmb3IgYnV0dG9ucyB0aGF0IGNvbmNhdGVuYXRlcyBudW1iZXJzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bmFtZTogJ0AnLCAvLyBBY2NlcHQgYSBzdHJpbmcgYXMgdGhlIG5hbWVcblx0XHRcdG11dGF0b3I6ICcmJyAvLyBBY2NlcHQgYSBtdXRhdG9yIGZ1bmN0aW9uIGFkZHJlc3Ncblx0XHR9LFxuXHRcdHRlbXBsYXRlOiByZXF1aXJlKCcuL3ZpZXdzL211dGF0aW9uQnV0dG9uLmphZGUnKSgpXG5cdH07XG59O1xuIiwiXG4vKipcbiAqIE51bWJlciBCdXR0b24gRGlyZWN0aXZlXG4gKiBAYXV0aG9yIFl1J04gQ29cbiAqIEBkZXNjcmlwdGlvbiBEZXNjcmliZXMgdmlldyBmb3IgYnV0dG9ucyB0aGF0IGNvbmNhdGVuYXRlcyBudW1iZXJzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bnVtYmVyOiAnQCcgLy8gQWNjZXB0IGEgc3RyaW5nIGFzIHRoZSBudW1iZXIgdG8gZGlzcGxheVxuXHRcdH0sXG5cdFx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvbnVtYmVyQnV0dG9uLmphZGUnKSgpXG5cdH07XG59O1xuIiwiXG4vKipcbiAqIE51bWJlciBWaWV3IERpcmVjdGl2ZVxuICogQGF1dGhvciBZdSdOIENvXG4gKiBAZGVzY3JpcHRpb24gVmlldyB0byBkaXNwbGF5IHRoZSBudW1iZXJzIGFuZCBvcGVyYXRvcnMgaW4gYSBjYWxjdWxhdGlvbi5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG1vZGVsOiAnPScgLy8gbW9kZWwgdG8gZGlzcGxheVxuXHRcdH0sXG5cdFx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvbnVtYmVyVmlldy5qYWRlJykoKVxuXHR9O1xufTtcbiIsIlxuLyoqXG4gKiBPcGVyYXRvciBCdXR0b24gRGlyZWN0aXZlXG4gKiBAYXV0aG9yIFl1J04gQ29cbiAqIEBkZXNjcmlwdGlvbiBCdXR0b24gdG8gdHJpZ2dlciBhbiBvcGVyYXRpb24gd2l0aCBhIGRlZmluZWQgb3BlcmF0b3JcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG9wZXJhdG9yOiAnQCcgLy8gRGVzY3JpYmUgYW4gb3BlcmF0b3Igd2l0aCBhIHN0cmluZ1xuXHRcdH0sXG5cdFx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3Mvb3BlcmF0b3JCdXR0b24uamFkZScpKClcblx0fTtcbn07XG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8bnVtYmVyLXZpZXcgbW9kZWw9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLm1vZGVsXFxcIj48L251bWJlci12aWV3PjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwic2l4IGNvbHVtbnNcXFwiPjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjFcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiMlxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCIzXFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiNFxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI1XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjZcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI3XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjhcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiOVxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48ZGVjaW1hbC1idXR0b24+PC9kZWNpbWFsLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiMFxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PGVxdWF0ZS1idXR0b24+PC9lcXVhdGUtYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInR3byBjb2x1bW5zXFxcIj48b3BlcmF0b3ItYnV0dG9uIG9wZXJhdG9yPVxcXCIrXFxcIj48L29wZXJhdG9yLWJ1dHRvbj48b3BlcmF0b3ItYnV0dG9uIG9wZXJhdG9yPVxcXCItXFxcIj48L29wZXJhdG9yLWJ1dHRvbj48b3BlcmF0b3ItYnV0dG9uIG9wZXJhdG9yPVxcXCJ4XFxcIj48L29wZXJhdG9yLWJ1dHRvbj48b3BlcmF0b3ItYnV0dG9uIG9wZXJhdG9yPVxcXCIvXFxcIj48L29wZXJhdG9yLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxtdXRhdGlvbi1idXR0b24gbmFtZT1cXFwiQ2xlYXJcXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLnJlc2V0TW9kZWwoKVxcXCI+PC9tdXRhdGlvbi1idXR0b24+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCJTaW5cXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLm11dGF0b3JTaW4oKVxcXCI+PC9tdXRhdGlvbi1idXR0b24+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCJDb3NcXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLm11dGF0b3JDb3MoKVxcXCI+PC9tdXRhdGlvbi1idXR0b24+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCIrLy1cXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLmZsaXBTaWduKClcXFwiPjwvbXV0YXRpb24tYnV0dG9uPjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8YSBuZy1jbGljaz1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0RGVjaW1hbCgpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGJ1dHRvbi1wcmltYXJ5IHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj4uPC9hPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8YSBuZy1jbGljaz1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIuZXF1YXRlKClcXFwiIGNsYXNzPVxcXCJidXR0b24gYnV0dG9uLXByaW1hcnkgdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPj08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCJtdXRhdG9yKClcXFwiIGNsYXNzPVxcXCJidXR0b24gdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPnt7IG5hbWUgfX08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCIkcGFyZW50LmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcihudW1iZXIpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj57eyBudW1iZXIgfX08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcInt7bW9kZWwubGVmdH19IHt7bW9kZWwub3BlcmF0b3J9fSB7e21vZGVsLnJpZ2h0fX1cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGEgbmctY2xpY2s9XFxcIiRwYXJlbnQuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3Iob3BlcmF0b3IpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj57eyBvcGVyYXRvciB9fTwvYT5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiXG4vKipcbiAqIENhbGN1bGF0b3IgTW9kZWxcbiAqIEBhdXRob3IgWXUnTiBDb1xuICogQGRlc2NyaXB0aW9uIERlc2NyaWJlcyB0aGUgbW9kZWwgdG8gYmUgdXNlZC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gY2xhc3MgQ2FsY3VsYXRvck1vZGVsIHtcblx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdHRoaXMubGVmdCA9ICcnXG5cdFx0XHR0aGlzLnJpZ2h0ID0gJydcblx0XHRcdHRoaXMub3BlcmF0b3IgPSAnJ1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIENvbXBhcmUgdGhlIGVxdWFsaXR5IG9mIHRoaXMgbW9kZWwgdG8gYW5vdGhlciBtb2RlbFxuXHRcdCAqIEBwYXJhbSAge0NhbGN1bGF0b3JNb2RlbH0gb3RoZXJNb2RlbCB0aGUgbW9kZWwgdG8gY29tcGFyZSB3aXRoXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIGVxdWFsaXR5XG5cdFx0ICovXG5cdFx0ZXF1YWxzKG90aGVyTW9kZWwpIHtcblx0XHRcdHJldHVybiB0aGlzLmxlZnQgPT0gb3RoZXJNb2RlbC5sZWZ0ICYmXG5cdFx0XHRcdHRoaXMucmlnaHQgPT0gb3RoZXJNb2RlbC5yaWdodCAmJlxuXHRcdFx0XHR0aGlzLm9wZXJhdG9yID09IG90aGVyTW9kZWwub3BlcmF0b3I7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlIGEgZGVlcCBjb3B5IG9mIHRoZSBtb2RlbFxuXHRcdCAqIEByZXR1cm4ge0NhbGN1bGF0b3JNb2RlbH0gY2xvbmVcblx0XHQgKi9cblx0XHRjbG9uZSgpIHtcblx0XHRcdHZhciBjbG9uZSA9IG5ldyBDYWxjdWxhdG9yTW9kZWwoKTtcblx0XHRcdGNsb25lLmxlZnQgPSB0aGlzLmxlZnQ7XG5cdFx0XHRjbG9uZS5yaWdodCA9IHRoaXMucmlnaHQ7XG5cdFx0XHRjbG9uZS5vcGVyYXRvciA9IHRoaXMub3BlcmF0b3I7XG5cdFx0XHRyZXR1cm4gY2xvbmU7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQ29weSBkYXRhIGZyb20gb3RoZXIgbW9kZWwgdG8gY3VycmVudCBtb2RlbFxuXHRcdCAqIEBwYXJhbSAge0NhbGN1bGF0b3JNb2RlbH0gb3RoZXIgbW9kZWxcblx0XHQgKi9cblx0XHRjb3B5KG90aGVyTW9kZWwpIHtcblx0XHRcdHRoaXMubGVmdCA9IG90aGVyTW9kZWwubGVmdDtcblx0XHRcdHRoaXMucmlnaHQgPSBvdGhlck1vZGVsLnJpZ2h0O1xuXHRcdFx0dGhpcy5vcGVyYXRvciA9IG90aGVyTW9kZWwub3BlcmF0b3I7XG5cdFx0fVxuXHR9O1xufSIsIlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ2FsY3VsYXRvck1vZGVsLCAkbG9jYXRpb24sICRodHRwLCAkaW50ZXJ2YWwpIHtcblx0cmV0dXJuIG5ldyBjbGFzcyBDYWxjdWxhdG9yV2ViU3luYyB7XG5cblx0XHRhdXRvdXBkYXRlKG1vZGVsKSB7XG5cblx0XHRcdHZhciBfbW9kZWwgPSBtb2RlbDtcblxuXHRcdFx0dmFyIHdhaXRGb3JSdW4gPSB0cnVlO1xuXHRcdFx0dmFyIHByZXZpb3VzTW9kZWwgPSBudWxsO1xuXG5cdFx0XHQvLyBSZXF1ZXN0IGluaXRpYWwgbW9kZWwuXG5cdFx0XHR0aGlzLnJlcXVlc3QoKVxuXHRcdFx0LnRoZW4oKG1vZGVsKSA9PiB7XG5cdFx0XHRcdF9tb2RlbC5jb3B5KG1vZGVsKTtcblx0XHRcdFx0cHJldmlvdXNNb2RlbCA9IF9tb2RlbC5jbG9uZSgpO1xuXHRcdFx0XHR3YWl0Rm9yUnVuID0gZmFsc2U7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gU2F2ZSBldmVyeSA1MDBtc1xuXHRcdFx0dmFyIHNhdmV0aW1lciA9ICRpbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdGlmICh3YWl0Rm9yUnVuKSByZXR1cm47XG5cblx0XHRcdFx0Ly8gSWYgb3VyIG1vZGVsIGhhcyBjaGFuZ2VkLCB1cGxvYWQgaXQuXG5cdFx0XHRcdGlmICghX21vZGVsLmVxdWFscyhwcmV2aW91c01vZGVsKSkge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlKF9tb2RlbClcblx0XHRcdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0XHRwcmV2aW91c01vZGVsID0gX21vZGVsLmNsb25lKCk7XG5cdFx0XHRcdFx0XHR3YWl0Rm9yUnVuID0gZmFsc2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdC8vIElmIG91ciBtb2RlbCBpcyB0aGUgc2FtZSwgdXBkYXRlIHRvIHNlcnZlcidzLlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMucmVxdWVzdCgpXG5cdFx0XHRcdFx0LnRoZW4oKG1vZGVsKSA9PiB7XG5cdFx0XHRcdFx0XHRfbW9kZWwuY29weShtb2RlbCk7XG5cdFx0XHRcdFx0XHRwcmV2aW91c01vZGVsID0gX21vZGVsLmNsb25lKCk7XG5cdFx0XHRcdFx0XHR3YWl0Rm9yUnVuID0gZmFsc2U7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSwgNTAwKTtcblxuXHRcdFx0cmV0dXJuIHNhdmV0aW1lcjtcblxuXHRcdH1cblxuXHRcdHVwZGF0ZShtb2RlbCkge1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXBkYXRlJywge2lkOiB0aGlzLmdldElkKCksIG1vZGVsOiBtb2RlbH0pO1xuXHRcdH1cblxuXHRcdHJlcXVlc3QoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3JlcXVlc3QnLCB7cGFyYW1zOiB7aWQ6IHRoaXMuZ2V0SWQoKX19KVxuXHRcdFx0LnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdHZhciBuZXdNb2RlbCA9IG5ldyBDYWxjdWxhdG9yTW9kZWwoKTtcblx0XHRcdFx0bmV3TW9kZWwubGVmdCA9IHJlc3BvbnNlLmRhdGEubGVmdCB8fCAnJztcblx0XHRcdFx0bmV3TW9kZWwucmlnaHQgPSByZXNwb25zZS5kYXRhLnJpZ2h0IHx8ICcnO1xuXHRcdFx0XHRuZXdNb2RlbC5vcGVyYXRvciA9IHJlc3BvbnNlLmRhdGEub3BlcmF0b3IgfHwgJyc7XG5cdFx0XHRcdHJldHVybiBuZXdNb2RlbDtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGdldElkKCkge1xuXHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKCkuc3Vic3RyaW5nKDEpO1xuXHRcdH1cblxuXHR9O1xufVxuIixudWxsLCIhZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSxlKTtlbHNle3ZhciBmO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/Zj13aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9mPWdsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmKGY9c2VsZiksZi5qYWRlPWUoKX19KGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKSA6XG4gICAgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JykgPyBPYmplY3Qua2V5cyh2YWwpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB2YWxba2V5XTsgfSkgOlxuICAgIFt2YWxdKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuXG5leHBvcnRzLnN0eWxlID0gZnVuY3Rpb24gKHZhbCkge1xuICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbCkubWFwKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXTtcbiAgICB9KS5qb2luKCc7Jyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxufTtcbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICB2YWwgPSBleHBvcnRzLnN0eWxlKHZhbCk7XG4gIH1cbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsKS5pbmRleE9mKCcmJykgIT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NpbmNlIEphZGUgMi4wLjAsIGFtcGVyc2FuZHMgKGAmYCkgaW4gZGF0YSBhdHRyaWJ1dGVzICcgK1xuICAgICAgICAgICAgICAgICAgICd3aWxsIGJlIGVzY2FwZWQgdG8gYCZhbXA7YCcpO1xuICAgIH07XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBlbGltaW5hdGUgdGhlIGRvdWJsZSBxdW90ZXMgYXJvdW5kIGRhdGVzIGluICcgK1xuICAgICAgICAgICAgICAgICAgICdJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlID0gZnVuY3Rpb24gZXNjYXBlKGh0bWwpe1xuICB2YXIgcmVzdWx0ID0gU3RyaW5nKGh0bWwpXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxufSx7XCJmc1wiOjJ9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblxufSx7fV19LHt9LFsxXSkoMSlcbn0pOyJdfQ==
