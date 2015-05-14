(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// Let's talk about NodeJS.

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

var app = angular.module('calculatorApp', []).config(function ($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
});

// Let's talk about angular for a bit.
// Angular handles all three of the M-V-C.
// The way it does it is kind of confusing, but I'll try my best to explain.

// The "View" in angular is described by a "Directive"
/* A "Directive" will describe the view, how you can use it,
 what data you can pass to the view, and the html/jade file used
 to render it.

 You will see in the directives folder that there is
*/

// define directives
app.directive('calculator', function () {
  return require('./directives/calculator.js');
});
app.directive('numberButton', function () {
  return require('./directives/numberButton.js');
});
app.directive('decimalButton', function () {
  return require('./directives/decimalButton.js');
});
app.directive('operatorButton', function () {
  return require('./directives/operatorButton.js');
});
app.directive('equateButton', function () {
  return require('./directives/equateButton.js');
});
app.directive('mutationButton', function () {
  return require('./directives/mutationButton.js');
});
app.directive('numberView', function () {
  return require('./directives/numberView.js');
});

// define controllers
app.controller('CalculatorController', require('./controllers/CalculatorController.js'));

},{"./controllers/CalculatorController.js":2,"./directives/calculator.js":3,"./directives/decimalButton.js":4,"./directives/equateButton.js":5,"./directives/mutationButton.js":6,"./directives/numberButton.js":7,"./directives/numberView.js":8,"./directives/operatorButton.js":9}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CalculatorModel = require('../models/CalculatorModel.js');

/**
 * Calculator Controller
 * ----------------
 * Calculator controller for MVC
 *
 **/

module.exports = (function () {
	function CalculatorController($interval, $location, $http, $scope) {
		var _this = this;

		_classCallCheck(this, CalculatorController);

		// Define instance variables
		this.$location = $location;
		this.insertingDecimal = false;
		this.model = new CalculatorModel();
		this.test = '';

		var waitForRun = true;
		var previousModel = null;

		// Request initial model.
		$http.get('/api/request', { params: { id: this.getId() } }).success(function (data, status, headers, config) {
			_this.model.left = data.left;
			_this.model.right = data.right;
			_this.model.operator = data.operator;
			previousModel = _this.model.clone();
			waitForRun = false;
		});

		// Save every 500ms
		this.savetimer = $interval(function () {
			if (waitForRun) return;

			// If our model has changed, upload it.
			if (!_this.model.equals(previousModel)) {
				$http.post('/api/update', { id: _this.getId(), model: _this.model }).success(function (data, status, headers, config) {
					previousModel = _this.model.clone();
					waitForRun = false;
				});
				// If our model is the same, update to server's.
			} else {
				$http.get('/api/request', { params: { id: _this.getId() } }).success(function (data, status, headers, config) {
					_this.model.left = data.left;
					_this.model.right = data.right;
					_this.model.operator = data.operator;
					previousModel = _this.model.clone();
					waitForRun = false;
				});
			}
		}, 500);

		$scope.$on('$destroy', function () {
			$interval.cancel(stop);
		});
	}

	_createClass(CalculatorController, [{
		key: 'getId',
		value: function getId() {
			return this.$location.path().substring(1);
		}
	}, {
		key: 'resetModel',
		value: function resetModel() {
			this.test = 'hey';
			this.model.left = '';
			this.model.right = '';
			this.model.operator = '';
			this.insertingDecimal = false;
		}
	}, {
		key: 'insertNumber',
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
		}
	}, {
		key: 'equate',

		// Calculate the current operation.
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
		}
	}, {
		key: 'mutatorSin',
		value: function mutatorSin() {
			this.equate();

			if (this.model.right == '') return;

			this.model.right = Math.sin(parseFloat(this.model.right)).toString();
		}
	}, {
		key: 'mutatorCos',
		value: function mutatorCos() {
			this.equate();

			if (this.model.right == '') return;

			this.model.right = Math.cos(parseFloat(this.model.right)).toString();
		}
	}, {
		key: 'flipSign',
		value: function flipSign() {
			if (this.model.right == '') return;

			this.model.right = (-1 * parseFloat(this.model.right)).toString();
		}
	}]);

	return CalculatorController;
})();

},{"../models/CalculatorModel.js":17}],3:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	template: require('./views/calculator.jade')(),
	link: function link(scope, element, attrs) {
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
				}
			});
		});
	}
};

},{"./views/calculator.jade":10}],4:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	template: require('./views/decimalButton.jade')()
};

},{"./views/decimalButton.jade":11}],5:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	template: require('./views/equateButton.jade')()
};

},{"./views/equateButton.jade":12}],6:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	scope: {
		name: '@',
		mutator: '&'
	},
	template: require('./views/mutationButton.jade')()
};

},{"./views/mutationButton.jade":13}],7:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	scope: {
		number: '@'
	},
	template: require('./views/numberButton.jade')()
};

},{"./views/numberButton.jade":14}],8:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	scope: {
		model: '='
	},
	template: require('./views/numberView.jade')()
};

},{"./views/numberView.jade":15}],9:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	scope: {
		operator: '@'
	},
	template: require('./views/operatorButton.jade')()
};

},{"./views/operatorButton.jade":16}],10:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<number-view model=\"calculatorController.model\"></number-view><div class=\"row\"><div class=\"six columns\"><div class=\"row\"><div class=\"four columns\"><number-button number=\"1\"></number-button></div><div class=\"four columns\"><number-button number=\"2\"></number-button></div><div class=\"four columns\"><number-button number=\"3\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"4\"></number-button></div><div class=\"four columns\"><number-button number=\"5\"></number-button></div><div class=\"four columns\"><number-button number=\"6\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"7\"></number-button></div><div class=\"four columns\"><number-button number=\"8\"></number-button></div><div class=\"four columns\"><number-button number=\"9\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><decimal-button></decimal-button></div><div class=\"four columns\"><number-button number=\"0\"></number-button></div><div class=\"four columns\"><equate-button></equate-button></div></div></div><div class=\"two columns\"><operator-button operator=\"+\"></operator-button><operator-button operator=\"-\"></operator-button><operator-button operator=\"x\"></operator-button><operator-button operator=\"/\"></operator-button></div><div class=\"four columns\"><mutation-button name=\"Clear\" mutator=\"calculatorController.resetModel()\"></mutation-button><mutation-button name=\"Sin\" mutator=\"calculatorController.mutatorSin()\"></mutation-button><mutation-button name=\"Cos\" mutator=\"calculatorController.mutatorCos()\"></mutation-button><mutation-button name=\"+/-\" mutator=\"calculatorController.flipSign()\"></mutation-button></div></div>");;return buf.join("");
};
},{"jade/runtime":19}],11:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"calculatorController.insertDecimal()\" class=\"button button-primary u-full-width no-padding\">.</a>");;return buf.join("");
};
},{"jade/runtime":19}],12:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"calculatorController.equate()\" class=\"button button-primary u-full-width no-padding\">=</a>");;return buf.join("");
};
},{"jade/runtime":19}],13:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"mutator()\" class=\"button u-full-width no-padding\">{{ name }}</a>");;return buf.join("");
};
},{"jade/runtime":19}],14:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"$parent.calculatorController.insertNumber(number)\" class=\"button u-full-width no-padding\">{{ number }}</a>");;return buf.join("");
};
},{"jade/runtime":19}],15:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("{{model.left}} {{model.operator}} {{model.right}}");;return buf.join("");
};
},{"jade/runtime":19}],16:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"$parent.calculatorController.insertOperator(operator)\" class=\"button u-full-width no-padding\">{{ operator }}</a>");;return buf.join("");
};
},{"jade/runtime":19}],17:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Calculator Model
 * ----------------
 * Simple calculator model for MVC
 *
 **/

module.exports = (function () {
	function CalculatorModel($http) {
		_classCallCheck(this, CalculatorModel);

		this.$http = $http;
		this.left = '';
		this.right = '';
		this.operator = '';
	}

	_createClass(CalculatorModel, [{
		key: 'equals',
		value: function equals(otherModel) {
			return this.left == otherModel.left && this.right == otherModel.right && this.operator == otherModel.operator;
		}
	}, {
		key: 'clone',
		value: function clone() {
			var clone = new CalculatorModel();
			clone.left = this.left;
			clone.right = this.right;
			clone.operator = this.operator;
			return clone;
		}
	}]);

	return CalculatorModel;
})();

},{}],18:[function(require,module,exports){

},{}],19:[function(require,module,exports){
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

},{"fs":18}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L21haW4uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2NvbnRyb2xsZXJzL0NhbGN1bGF0b3JDb250cm9sbGVyLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL2NhbGN1bGF0b3IuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvZGVjaW1hbEJ1dHRvbi5qcyIsIi9Wb2x1bWVzL1N1cGVyTm92YS9TY2hvb2wvU3ByaW5nMjAxNS9DTVBFMTMxL1NlZVlvdUxhdGVyQ2FsY3VsYXRvci9jbGllbnQvZGlyZWN0aXZlcy9lcXVhdGVCdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbXV0YXRpb25CdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbnVtYmVyQnV0dG9uLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL251bWJlclZpZXcuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvb3BlcmF0b3JCdXR0b24uanMiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9jYWxjdWxhdG9yLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9kZWNpbWFsQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9lcXVhdGVCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL211dGF0aW9uQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9udW1iZXJCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL251bWJlclZpZXcuamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL29wZXJhdG9yQnV0dG9uLmphZGUiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L21vZGVscy9DYWxjdWxhdG9yTW9kZWwuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2FBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFakMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQzVDLE1BQU0sQ0FBQyxVQUFTLGlCQUFpQixFQUFFO0FBQ2xDLG1CQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDbkQsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFlSCxH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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vLyBMZXQncyB0YWxrIGFib3V0IE5vZGVKUy5cblxuLyogWW91IG1pZ2h0IGtub3cgZnJvbSBKYXZhIG9yIEMrKyB0aGUgYGltcG9ydGAgYW5kIGAjaW5jbHVkZWAga2V5d29yZHNcbiBUaG9zZSBrZXl3b3JkcyB3aWxsIGltcG9ydCB0aGUgZmlsZS5cbiBJbiBOb2RlSlMsIHRoZSBlcXVpdmFsZW50IG9mIHRoYXQgaXMgXCJyZXF1aXJlXCJcbiBcInJlcXVpcmVcIiB3aWxsIGFjdHVhbGx5IHJ1biB0aGUgZmlsZS5cblxuIFVubGlrZSBpbiBKYXZhIGFuZCBDKyssIHlvdSBkb24ndCBoYXZlIHRvIGNhbGwgYHJlcXVpcmVgIGF0IHRoZSB0b3AuXG4gVG8ga2VlcCB0aGUgZmxvdyBvZiB0aGUgY29kZSwgSSd2ZSB1c2VkIHRoZSBgcmVxdWlyZWAgaW5zaWRlIGZ1bmN0aW9uc1xuIGFuZCB3aGVuIGRlZmluaW5nIGNvbnRyb2xsZXJzIGFuZCB2aWV3cy5cbiAqL1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKFwiY2FsY3VsYXRvckFwcFwiLCBbXSlcbi5jb25maWcoZnVuY3Rpb24oJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpLmhhc2hQcmVmaXgoJyEnKTtcbn0pO1xuXG4vLyBMZXQncyB0YWxrIGFib3V0IGFuZ3VsYXIgZm9yIGEgYml0LlxuLy8gQW5ndWxhciBoYW5kbGVzIGFsbCB0aHJlZSBvZiB0aGUgTS1WLUMuXG4vLyBUaGUgd2F5IGl0IGRvZXMgaXQgaXMga2luZCBvZiBjb25mdXNpbmcsIGJ1dCBJJ2xsIHRyeSBteSBiZXN0IHRvIGV4cGxhaW4uXG5cbi8vIFRoZSBcIlZpZXdcIiBpbiBhbmd1bGFyIGlzIGRlc2NyaWJlZCBieSBhIFwiRGlyZWN0aXZlXCJcbi8qIEEgXCJEaXJlY3RpdmVcIiB3aWxsIGRlc2NyaWJlIHRoZSB2aWV3LCBob3cgeW91IGNhbiB1c2UgaXQsXG4gd2hhdCBkYXRhIHlvdSBjYW4gcGFzcyB0byB0aGUgdmlldywgYW5kIHRoZSBodG1sL2phZGUgZmlsZSB1c2VkXG4gdG8gcmVuZGVyIGl0LlxuXG4gWW91IHdpbGwgc2VlIGluIHRoZSBkaXJlY3RpdmVzIGZvbGRlciB0aGF0IHRoZXJlIGlzXG4qL1xuXG4vLyBkZWZpbmUgZGlyZWN0aXZlc1xuYXBwLmRpcmVjdGl2ZShcImNhbGN1bGF0b3JcIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvY2FsY3VsYXRvci5qcycpXG59KTtcbmFwcC5kaXJlY3RpdmUoXCJudW1iZXJCdXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbnVtYmVyQnV0dG9uLmpzJylcbn0pO1xuYXBwLmRpcmVjdGl2ZShcImRlY2ltYWxCdXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvZGVjaW1hbEJ1dHRvbi5qcycpXG59KTtcbmFwcC5kaXJlY3RpdmUoXCJvcGVyYXRvckJ1dHRvblwiLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9vcGVyYXRvckJ1dHRvbi5qcycpXG59KTtcbmFwcC5kaXJlY3RpdmUoXCJlcXVhdGVCdXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvZXF1YXRlQnV0dG9uLmpzJylcbn0pO1xuYXBwLmRpcmVjdGl2ZShcIm11dGF0aW9uQnV0dG9uXCIsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL211dGF0aW9uQnV0dG9uLmpzJylcbn0pO1xuYXBwLmRpcmVjdGl2ZShcIm51bWJlclZpZXdcIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbnVtYmVyVmlldy5qcycpXG59KTtcblxuLy8gZGVmaW5lIGNvbnRyb2xsZXJzXG5hcHAuY29udHJvbGxlcihcIkNhbGN1bGF0b3JDb250cm9sbGVyXCIsXG5cdHJlcXVpcmUoJy4vY29udHJvbGxlcnMvQ2FsY3VsYXRvckNvbnRyb2xsZXIuanMnKVxuKTtcbiIsIlxudmFyIENhbGN1bGF0b3JNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9DYWxjdWxhdG9yTW9kZWwuanMnKTtcblxuLyoqXG4gKiBDYWxjdWxhdG9yIENvbnRyb2xsZXJcbiAqIC0tLS0tLS0tLS0tLS0tLS1cbiAqIENhbGN1bGF0b3IgY29udHJvbGxlciBmb3IgTVZDXG4gKlxuICoqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENhbGN1bGF0b3JDb250cm9sbGVyIHtcblx0Y29uc3RydWN0b3IoJGludGVydmFsLCAkbG9jYXRpb24sICRodHRwLCAkc2NvcGUpIHtcblx0XHQvLyBEZWZpbmUgaW5zdGFuY2UgdmFyaWFibGVzXG5cdFx0dGhpcy4kbG9jYXRpb24gPSAkbG9jYXRpb247XG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gZmFsc2Vcblx0XHR0aGlzLm1vZGVsID0gbmV3IENhbGN1bGF0b3JNb2RlbCgpO1xuXHRcdHRoaXMudGVzdCA9ICcnO1xuXG5cdFx0dmFyIHdhaXRGb3JSdW4gPSB0cnVlO1xuXHRcdHZhciBwcmV2aW91c01vZGVsID0gbnVsbDtcblxuXHRcdC8vIFJlcXVlc3QgaW5pdGlhbCBtb2RlbC5cblx0XHQkaHR0cC5nZXQoJy9hcGkvcmVxdWVzdCcsIHtwYXJhbXM6IHtpZDogdGhpcy5nZXRJZCgpfX0pXG5cdFx0LnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSA9PiB7XG5cdFx0XHR0aGlzLm1vZGVsLmxlZnQgPSBkYXRhLmxlZnQ7XG5cdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gZGF0YS5yaWdodDtcblx0XHRcdHRoaXMubW9kZWwub3BlcmF0b3IgPSBkYXRhLm9wZXJhdG9yO1xuXHRcdFx0cHJldmlvdXNNb2RlbCA9IHRoaXMubW9kZWwuY2xvbmUoKTtcblx0XHRcdHdhaXRGb3JSdW4gPSBmYWxzZTtcblx0XHR9KTtcblxuXHRcdC8vIFNhdmUgZXZlcnkgNTAwbXNcblx0XHR0aGlzLnNhdmV0aW1lciA9ICRpbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZiAod2FpdEZvclJ1bikgcmV0dXJuO1xuXG5cdFx0XHQvLyBJZiBvdXIgbW9kZWwgaGFzIGNoYW5nZWQsIHVwbG9hZCBpdC5cblx0XHRcdGlmICghdGhpcy5tb2RlbC5lcXVhbHMocHJldmlvdXNNb2RlbCkpIHtcblx0XHRcdFx0JGh0dHAucG9zdCgnL2FwaS91cGRhdGUnLCB7aWQ6IHRoaXMuZ2V0SWQoKSwgbW9kZWw6IHRoaXMubW9kZWx9KVxuXHRcdFx0XHQuc3VjY2VzcygoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpID0+IHtcblx0XHRcdFx0XHRwcmV2aW91c01vZGVsID0gdGhpcy5tb2RlbC5jbG9uZSgpO1xuXHRcdFx0XHRcdHdhaXRGb3JSdW4gPSBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHQvLyBJZiBvdXIgbW9kZWwgaXMgdGhlIHNhbWUsIHVwZGF0ZSB0byBzZXJ2ZXIncy5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRodHRwLmdldCgnL2FwaS9yZXF1ZXN0Jywge3BhcmFtczoge2lkOiB0aGlzLmdldElkKCl9fSlcblx0XHRcdFx0LnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5tb2RlbC5sZWZ0ID0gZGF0YS5sZWZ0O1xuXHRcdFx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSBkYXRhLnJpZ2h0O1xuXHRcdFx0XHRcdHRoaXMubW9kZWwub3BlcmF0b3IgPSBkYXRhLm9wZXJhdG9yO1xuXHRcdFx0XHRcdHByZXZpb3VzTW9kZWwgPSB0aGlzLm1vZGVsLmNsb25lKCk7XG5cdFx0XHRcdFx0d2FpdEZvclJ1biA9IGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH0sIDUwMCk7XG5cblx0XHQkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0JGludGVydmFsLmNhbmNlbChzdG9wKTtcblx0XHR9KTtcblx0fVxuXG5cdGdldElkKCkge1xuXHRcdHJldHVybiB0aGlzLiRsb2NhdGlvbi5wYXRoKCkuc3Vic3RyaW5nKDEpO1xuXHR9XG5cblx0cmVzZXRNb2RlbCgpIHtcblx0XHR0aGlzLnRlc3QgPSAnaGV5Jztcblx0XHR0aGlzLm1vZGVsLmxlZnQgPSAnJ1xuXHRcdHRoaXMubW9kZWwucmlnaHQgPSAnJ1xuXHRcdHRoaXMubW9kZWwub3BlcmF0b3IgPSAnJ1xuXHRcdHRoaXMuaW5zZXJ0aW5nRGVjaW1hbCA9IGZhbHNlO1xuXHR9XG5cblx0aW5zZXJ0TnVtYmVyKG51bWJlcikge1xuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgIT0gJycgJiYgdGhpcy5tb2RlbC5yaWdodCA9PSAnJyAmJiB0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcnKSB7XG5cdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnMCcpIHtcblx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSAnJztcblx0XHR9XG5cblx0XHQvLyBEb24ndCBhcHBlbmQgdG8gc29tZXRoaW5nIHRoYXQgaXNuJ3QgYSBudW1iZXIuXG5cdFx0aWYgKFxuXHRcdFx0KFxuXHRcdFx0XHROdW1iZXIuaXNOYU4ocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSkgfHxcblx0XHRcdFx0IU51bWJlci5pc0Zpbml0ZShwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpKVxuXHRcdFx0KVxuXHRcdFx0JiYgdGhpcy5tb2RlbC5yaWdodCAhPSAnJ1xuXHRcdCkgcmV0dXJuO1xuXG5cdFx0dGhpcy5tb2RlbC5yaWdodCArPSBudW1iZXIudG9TdHJpbmcoKTtcblx0fVxuXG5cdGluc2VydERlY2ltYWwoKSB7XG5cdFx0aWYgKHRoaXMuaW5zZXJ0aW5nRGVjaW1hbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgIT0gJycgJiYgdGhpcy5tb2RlbC5yaWdodCA9PSAnJyAmJiB0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcnKSB7XG5cdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHR9XG5cblx0XHQvLyBEb24ndCBhcHBlbmQgdG8gc29tZXRoaW5nIHRoYXQgaXNuJ3QgYSBudW1iZXIuXG5cdFx0aWYgKFxuXHRcdFx0KFxuXHRcdFx0XHROdW1iZXIuaXNOYU4ocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSkgfHxcblx0XHRcdFx0IU51bWJlci5pc0Zpbml0ZShwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpKVxuXHRcdFx0KVxuXHRcdFx0JiYgdGhpcy5tb2RlbC5yaWdodCAhPSAnJ1xuXHRcdCkgcmV0dXJuO1xuXG5cdFx0dGhpcy5tb2RlbC5yaWdodCArPSAnLic7XG5cblx0XHR0aGlzLmluc2VydGluZ0RlY2ltYWwgPSB0cnVlO1xuXHR9XG5cblx0aW5zZXJ0T3BlcmF0b3Iob3BlcmF0b3IpIHtcblx0XHR0aGlzLmVxdWF0ZSgpO1xuXG5cdFx0aWYgKHRoaXMubW9kZWwubGVmdCA9PSAnJyAmJiB0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcnICYmIHRoaXMubW9kZWwucmlnaHQgIT0gJycpIHtcblx0XHRcdHRoaXMubW9kZWwubGVmdCA9IHRoaXMubW9kZWwucmlnaHQ7XG5cdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubW9kZWwubGVmdCA9PSAnJykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMubW9kZWwub3BlcmF0b3IgPSBvcGVyYXRvcjtcblx0fVxuXG5cdC8vIENhbGN1bGF0ZSB0aGUgY3VycmVudCBvcGVyYXRpb24uXG5cdGVxdWF0ZSgpIHtcblxuXHRcdC8vIFdlIGhhdmUgb3BlcmFuZHMsIG5vdyBlcXVhdGUgZm9yIHRoZSBjb3JyZXNwb25kaW5nIG9wZXJhdG9yLlxuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgIT0gJycgJiYgdGhpcy5tb2RlbC5yaWdodCAhPSAnJykge1xuXHRcdFx0dmFyIGxlZnQgPSBwYXJzZUZsb2F0KHRoaXMubW9kZWwubGVmdCk7XG5cdFx0XHR2YXIgcmlnaHQgPSBwYXJzZUZsb2F0KHRoaXMubW9kZWwucmlnaHQpO1xuXHRcdFx0aWYgKHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJysnKSB7XG5cdFx0XHRcdHRoaXMucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gKGxlZnQgKyByaWdodCkudG9TdHJpbmcoKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5tb2RlbC5vcGVyYXRvciA9PSAnLScpIHtcblx0XHRcdFx0dGhpcy5yZXNldE1vZGVsKCk7XG5cdFx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSAobGVmdCAtIHJpZ2h0KS50b1N0cmluZygpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLm1vZGVsLm9wZXJhdG9yID09ICd4Jykge1xuXHRcdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9IChsZWZ0ICogcmlnaHQpLnRvU3RyaW5nKCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJy8nKSB7XG5cdFx0XHRcdHRoaXMucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gKGxlZnQgLyByaWdodCkudG9TdHJpbmcoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmluc2VydGluZ0RlY2ltYWwgPSBmYWxzZTtcblx0fVxuXG5cdG11dGF0b3JTaW4oKSB7XG5cdFx0dGhpcy5lcXVhdGUoKTtcblxuXHRcdGlmICh0aGlzLm1vZGVsLnJpZ2h0ID09ICcnKSByZXR1cm47XG5cblx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gTWF0aC5zaW4ocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSkudG9TdHJpbmcoKTtcblx0fVxuXG5cdG11dGF0b3JDb3MoKSB7XG5cdFx0dGhpcy5lcXVhdGUoKTtcblxuXHRcdGlmICh0aGlzLm1vZGVsLnJpZ2h0ID09ICcnKSByZXR1cm47XG5cblx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gTWF0aC5jb3MocGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSkudG9TdHJpbmcoKTtcblx0fVxuXG5cdGZsaXBTaWduKCkge1xuXHRcdGlmICh0aGlzLm1vZGVsLnJpZ2h0ID09ICcnKSByZXR1cm47XG5cblx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gKC0xICogcGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KSkudG9TdHJpbmcoKTtcblx0fVxuXG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9jYWxjdWxhdG9yLmphZGUnKSgpLFxuXHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHQvLyBLZXlwcmVzc2VzIGVtdWxhdGUgdGhlIGJ1dHRvbiBwcmVzc2VzIGFuZCBjYWxscyB0aGUgY29udHJvbGxlci5cblx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmJpbmQoJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0c2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzd2l0Y2ggKGV2ZW50LndoaWNoKSB7XG5cdFx0XHRcdFx0Y2FzZSA0ODpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignMCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA0OTpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignMScpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1MDpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignMicpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1MTpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignMycpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1Mjpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignNCcpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1Mzpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignNScpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1NDpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignNicpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1NTpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcignNycpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1Njpcblx0XHRcdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSkge1xuXHRcdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnRPcGVyYXRvcigneCcpXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc4Jyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDU3OlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc5Jyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDE5MDpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydERlY2ltYWwoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgODpcblx0XHRcdFx0XHRcdGlmICghZXZlbnQuc2hpZnRLZXkpIHtcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMzpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmVxdWF0ZSgpO1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTg3OlxuXHRcdFx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE9wZXJhdG9yKCcrJylcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTg5OlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3IoJy0nKVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxOTE6XG5cdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnRPcGVyYXRvcignLycpXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9KVxuXHR9XG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9kZWNpbWFsQnV0dG9uLmphZGUnKSgpXG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9lcXVhdGVCdXR0b24uamFkZScpKClcbn07XG4iLCJcbi8vIERpcmVjdGl2ZXMgXCJkZXNjcmliZVwiIHRoZSB2aWV3IGFuZCBsaW5rIHRvIGl0LlxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlc3RyaWN0OiAnRScsXG5cdHNjb3BlOiB7XG5cdFx0bmFtZTogJ0AnLFxuXHRcdG11dGF0b3I6ICcmJ1xuXHR9LFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9tdXRhdGlvbkJ1dHRvbi5qYWRlJykoKVxufTtcbiIsIlxuLy8gRGlyZWN0aXZlcyBcImRlc2NyaWJlXCIgdGhlIHZpZXcgYW5kIGxpbmsgdG8gaXQuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVzdHJpY3Q6ICdFJyxcblx0c2NvcGU6IHtcblx0XHRudW1iZXI6ICdAJ1xuXHR9LFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9udW1iZXJCdXR0b24uamFkZScpKClcbn07XG4iLCJcbi8vIERpcmVjdGl2ZXMgXCJkZXNjcmliZVwiIHRoZSB2aWV3IGFuZCBsaW5rIHRvIGl0LlxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlc3RyaWN0OiAnRScsXG5cdHNjb3BlOiB7XG5cdFx0bW9kZWw6ICc9J1xuXHR9LFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9udW1iZXJWaWV3LmphZGUnKSgpXG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHRzY29wZToge1xuXHRcdG9wZXJhdG9yOiAnQCdcblx0fSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3Mvb3BlcmF0b3JCdXR0b24uamFkZScpKClcbn07XG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8bnVtYmVyLXZpZXcgbW9kZWw9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLm1vZGVsXFxcIj48L251bWJlci12aWV3PjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwic2l4IGNvbHVtbnNcXFwiPjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjFcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiMlxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCIzXFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiNFxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI1XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjZcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI3XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjhcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiOVxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48ZGVjaW1hbC1idXR0b24+PC9kZWNpbWFsLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiMFxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PGVxdWF0ZS1idXR0b24+PC9lcXVhdGUtYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInR3byBjb2x1bW5zXFxcIj48b3BlcmF0b3ItYnV0dG9uIG9wZXJhdG9yPVxcXCIrXFxcIj48L29wZXJhdG9yLWJ1dHRvbj48b3BlcmF0b3ItYnV0dG9uIG9wZXJhdG9yPVxcXCItXFxcIj48L29wZXJhdG9yLWJ1dHRvbj48b3BlcmF0b3ItYnV0dG9uIG9wZXJhdG9yPVxcXCJ4XFxcIj48L29wZXJhdG9yLWJ1dHRvbj48b3BlcmF0b3ItYnV0dG9uIG9wZXJhdG9yPVxcXCIvXFxcIj48L29wZXJhdG9yLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxtdXRhdGlvbi1idXR0b24gbmFtZT1cXFwiQ2xlYXJcXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLnJlc2V0TW9kZWwoKVxcXCI+PC9tdXRhdGlvbi1idXR0b24+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCJTaW5cXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLm11dGF0b3JTaW4oKVxcXCI+PC9tdXRhdGlvbi1idXR0b24+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCJDb3NcXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLm11dGF0b3JDb3MoKVxcXCI+PC9tdXRhdGlvbi1idXR0b24+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCIrLy1cXFwiIG11dGF0b3I9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLmZsaXBTaWduKClcXFwiPjwvbXV0YXRpb24tYnV0dG9uPjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8YSBuZy1jbGljaz1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0RGVjaW1hbCgpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGJ1dHRvbi1wcmltYXJ5IHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj4uPC9hPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8YSBuZy1jbGljaz1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIuZXF1YXRlKClcXFwiIGNsYXNzPVxcXCJidXR0b24gYnV0dG9uLXByaW1hcnkgdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPj08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCJtdXRhdG9yKClcXFwiIGNsYXNzPVxcXCJidXR0b24gdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPnt7IG5hbWUgfX08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCIkcGFyZW50LmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE51bWJlcihudW1iZXIpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj57eyBudW1iZXIgfX08L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcInt7bW9kZWwubGVmdH19IHt7bW9kZWwub3BlcmF0b3J9fSB7e21vZGVsLnJpZ2h0fX1cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGEgbmctY2xpY2s9XFxcIiRwYXJlbnQuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3Iob3BlcmF0b3IpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj57eyBvcGVyYXRvciB9fTwvYT5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiXG4vKipcbiAqIENhbGN1bGF0b3IgTW9kZWxcbiAqIC0tLS0tLS0tLS0tLS0tLS1cbiAqIFNpbXBsZSBjYWxjdWxhdG9yIG1vZGVsIGZvciBNVkNcbiAqXG4gKiovXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ2FsY3VsYXRvck1vZGVsIHtcblx0Y29uc3RydWN0b3IoJGh0dHApIHtcblx0XHR0aGlzLiRodHRwID0gJGh0dHBcblx0XHR0aGlzLmxlZnQgPSAnJ1xuXHRcdHRoaXMucmlnaHQgPSAnJ1xuXHRcdHRoaXMub3BlcmF0b3IgPSAnJ1xuXHR9XG5cblx0ZXF1YWxzKG90aGVyTW9kZWwpIHtcblx0XHRyZXR1cm4gdGhpcy5sZWZ0ID09IG90aGVyTW9kZWwubGVmdCAmJlxuXHRcdFx0dGhpcy5yaWdodCA9PSBvdGhlck1vZGVsLnJpZ2h0ICYmXG5cdFx0XHR0aGlzLm9wZXJhdG9yID09IG90aGVyTW9kZWwub3BlcmF0b3I7XG5cdH1cblxuXHRjbG9uZSgpIHtcblx0XHR2YXIgY2xvbmUgPSBuZXcgQ2FsY3VsYXRvck1vZGVsKCk7XG5cdFx0Y2xvbmUubGVmdCA9IHRoaXMubGVmdDtcblx0XHRjbG9uZS5yaWdodCA9IHRoaXMucmlnaHQ7XG5cdFx0Y2xvbmUub3BlcmF0b3IgPSB0aGlzLm9wZXJhdG9yO1xuXHRcdHJldHVybiBjbG9uZTtcblx0fVxufSIsbnVsbCwiIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYuamFkZT1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IG1lcmdlKGF0dHJzLCBhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG4gIHZhciBhYyA9IGFbJ2NsYXNzJ107XG4gIHZhciBiYyA9IGJbJ2NsYXNzJ107XG5cbiAgaWYgKGFjIHx8IGJjKSB7XG4gICAgYWMgPSBhYyB8fCBbXTtcbiAgICBiYyA9IGJjIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhYykpIGFjID0gW2FjXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYmMpKSBiYyA9IFtiY107XG4gICAgYVsnY2xhc3MnXSA9IGFjLmNvbmNhdChiYykuZmlsdGVyKG51bGxzKTtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSAhPSAnY2xhc3MnKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIEZpbHRlciBudWxsIGB2YWxgcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG51bGxzKHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsICE9PSAnJztcbn1cblxuLyoqXG4gKiBqb2luIGFycmF5IGFzIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5qb2luQ2xhc3NlcyA9IGpvaW5DbGFzc2VzO1xuZnVuY3Rpb24gam9pbkNsYXNzZXModmFsKSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykgOlxuICAgICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpID8gT2JqZWN0LmtleXModmFsKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdmFsW2tleV07IH0pIDpcbiAgICBbdmFsXSkuZmlsdGVyKG51bGxzKS5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cblxuZXhwb3J0cy5zdHlsZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWwpLm1hcChmdW5jdGlvbiAoc3R5bGUpIHtcbiAgICAgIHJldHVybiBzdHlsZSArICc6JyArIHZhbFtzdHlsZV07XG4gICAgfSkuam9pbignOycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiBhdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgdmFsID0gZXhwb3J0cy5zdHlsZSh2YWwpO1xuICB9XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHZhbCkuaW5kZXhPZignJicpICE9PSAtMSkge1xuICAgICAgY29uc29sZS53YXJuKCdTaW5jZSBKYWRlIDIuMC4wLCBhbXBlcnNhbmRzIChgJmApIGluIGRhdGEgYXR0cmlidXRlcyAnICtcbiAgICAgICAgICAgICAgICAgICAnd2lsbCBiZSBlc2NhcGVkIHRvIGAmYW1wO2AnKTtcbiAgICB9O1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgZWxpbWluYXRlIHRoZSBkb3VibGUgcXVvdGVzIGFyb3VuZCBkYXRlcyBpbiAnICtcbiAgICAgICAgICAgICAgICAgICAnSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZSA9IGZ1bmN0aW9uIGVzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHJldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdKYWRlJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cbn0se1wiZnNcIjoyfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cbn0se31dfSx7fSxbMV0pKDEpXG59KTsiXX0=
