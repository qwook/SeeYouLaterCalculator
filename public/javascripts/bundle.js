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

"use strict";

var angular = (window.angular);

var app = angular.module("calculatorApp", []);

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
app.directive("calculator", function () {
  return require("./directives/calculator.js");
});
app.directive("numberButton", function () {
  return require("./directives/numberButton.js");
});
app.directive("decimalButton", function () {
  return require("./directives/decimalButton.js");
});
app.directive("operatorButton", function () {
  return require("./directives/operatorButton.js");
});
app.directive("equateButton", function () {
  return require("./directives/equateButton.js");
});
app.directive("mutationButton", function () {
  return require("./directives/mutationButton.js");
});
app.directive("numberView", function () {
  return require("./directives/numberView.js");
});

// define controllers
app.controller("CalculatorController", require("./controllers/CalculatorController.js"));

},{"./controllers/CalculatorController.js":2,"./directives/calculator.js":3,"./directives/decimalButton.js":4,"./directives/equateButton.js":5,"./directives/mutationButton.js":6,"./directives/numberButton.js":7,"./directives/numberView.js":8,"./directives/operatorButton.js":9}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
	function CalculatorController() {
		_classCallCheck(this, CalculatorController);

		// Define instance variables
		this.model = {
			left: '',
			right: '',
			operator: '' };
		this.insertingDecimal = false;
	}

	_createClass(CalculatorController, [{
		key: 'resetModel',
		value: function resetModel() {
			this.model = {
				left: '',
				right: '',
				operator: ''
			};
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

},{}],3:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	template: require('./views/calculator.jade')(),
	link: function link(scope, element, attrs) {
		angular.element(document).bind('keyup', function (event) {
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
						scope.calculatorController.resetModel();
						break;
					case 13:
						scope.calculatorController.equate();
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
},{"jade/runtime":18}],11:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"calculatorController.insertDecimal()\" class=\"button button-primary u-full-width no-padding\">.</a>");;return buf.join("");
};
},{"jade/runtime":18}],12:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"calculatorController.equate()\" class=\"button button-primary u-full-width no-padding\">=</a>");;return buf.join("");
};
},{"jade/runtime":18}],13:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"mutator()\" class=\"button u-full-width no-padding\">{{ name }}</a>");;return buf.join("");
};
},{"jade/runtime":18}],14:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"$parent.calculatorController.insertNumber(number)\" class=\"button u-full-width no-padding\">{{ number }}</a>");;return buf.join("");
};
},{"jade/runtime":18}],15:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("{{model.left}} {{model.operator}} {{model.right}}");;return buf.join("");
};
},{"jade/runtime":18}],16:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"$parent.calculatorController.insertOperator(operator)\" class=\"button u-full-width no-padding\">{{ operator }}</a>");;return buf.join("");
};
},{"jade/runtime":18}],17:[function(require,module,exports){

},{}],18:[function(require,module,exports){
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

},{"fs":17}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L21haW4uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2NvbnRyb2xsZXJzL0NhbGN1bGF0b3JDb250cm9sbGVyLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL2NhbGN1bGF0b3IuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvZGVjaW1hbEJ1dHRvbi5qcyIsIi9Wb2x1bWVzL1N1cGVyTm92YS9TY2hvb2wvU3ByaW5nMjAxNS9DTVBFMTMxL1NlZVlvdUxhdGVyQ2FsY3VsYXRvci9jbGllbnQvZGlyZWN0aXZlcy9lcXVhdGVCdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbXV0YXRpb25CdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbnVtYmVyQnV0dG9uLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL251bWJlclZpZXcuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvb3BlcmF0b3JCdXR0b24uanMiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9jYWxjdWxhdG9yLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9kZWNpbWFsQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9lcXVhdGVCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL211dGF0aW9uQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9udW1iZXJCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL251bWJlclZpZXcuamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL29wZXJhdG9yQnV0dG9uLmphZGUiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2FBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFakMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQWU5QyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxZQUFXO0FBQ3RDLFNBQU8sT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUE7Q0FDNUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsWUFBVztBQUN4QyxTQUFPLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0NBQzlDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZSxF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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8vIExldCdzIHRhbGsgYWJvdXQgTm9kZUpTLlxuXG4vKiBZb3UgbWlnaHQga25vdyBmcm9tIEphdmEgb3IgQysrIHRoZSBgaW1wb3J0YCBhbmQgYCNpbmNsdWRlYCBrZXl3b3Jkc1xuIFRob3NlIGtleXdvcmRzIHdpbGwgaW1wb3J0IHRoZSBmaWxlLlxuIEluIE5vZGVKUywgdGhlIGVxdWl2YWxlbnQgb2YgdGhhdCBpcyBcInJlcXVpcmVcIlxuIFwicmVxdWlyZVwiIHdpbGwgYWN0dWFsbHkgcnVuIHRoZSBmaWxlLlxuXG4gVW5saWtlIGluIEphdmEgYW5kIEMrKywgeW91IGRvbid0IGhhdmUgdG8gY2FsbCBgcmVxdWlyZWAgYXQgdGhlIHRvcC5cbiBUbyBrZWVwIHRoZSBmbG93IG9mIHRoZSBjb2RlLCBJJ3ZlIHVzZWQgdGhlIGByZXF1aXJlYCBpbnNpZGUgZnVuY3Rpb25zXG4gYW5kIHdoZW4gZGVmaW5pbmcgY29udHJvbGxlcnMgYW5kIHZpZXdzLlxuICovXG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoXCJjYWxjdWxhdG9yQXBwXCIsIFtdKTtcblxuLy8gTGV0J3MgdGFsayBhYm91dCBhbmd1bGFyIGZvciBhIGJpdC5cbi8vIEFuZ3VsYXIgaGFuZGxlcyBhbGwgdGhyZWUgb2YgdGhlIE0tVi1DLlxuLy8gVGhlIHdheSBpdCBkb2VzIGl0IGlzIGtpbmQgb2YgY29uZnVzaW5nLCBidXQgSSdsbCB0cnkgbXkgYmVzdCB0byBleHBsYWluLlxuXG4vLyBUaGUgXCJWaWV3XCIgaW4gYW5ndWxhciBpcyBkZXNjcmliZWQgYnkgYSBcIkRpcmVjdGl2ZVwiXG4vKiBBIFwiRGlyZWN0aXZlXCIgd2lsbCBkZXNjcmliZSB0aGUgdmlldywgaG93IHlvdSBjYW4gdXNlIGl0LFxuIHdoYXQgZGF0YSB5b3UgY2FuIHBhc3MgdG8gdGhlIHZpZXcsIGFuZCB0aGUgaHRtbC9qYWRlIGZpbGUgdXNlZFxuIHRvIHJlbmRlciBpdC5cblxuIFlvdSB3aWxsIHNlZSBpbiB0aGUgZGlyZWN0aXZlcyBmb2xkZXIgdGhhdCB0aGVyZSBpc1xuKi9cblxuLy8gZGVmaW5lIGRpcmVjdGl2ZXNcbmFwcC5kaXJlY3RpdmUoXCJjYWxjdWxhdG9yXCIsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2NhbGN1bGF0b3IuanMnKVxufSk7XG5hcHAuZGlyZWN0aXZlKFwibnVtYmVyQnV0dG9uXCIsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL251bWJlckJ1dHRvbi5qcycpXG59KTtcbmFwcC5kaXJlY3RpdmUoXCJkZWNpbWFsQnV0dG9uXCIsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2RlY2ltYWxCdXR0b24uanMnKVxufSk7XG5hcHAuZGlyZWN0aXZlKFwib3BlcmF0b3JCdXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvb3BlcmF0b3JCdXR0b24uanMnKVxufSk7XG5hcHAuZGlyZWN0aXZlKFwiZXF1YXRlQnV0dG9uXCIsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2VxdWF0ZUJ1dHRvbi5qcycpXG59KTtcbmFwcC5kaXJlY3RpdmUoXCJtdXRhdGlvbkJ1dHRvblwiLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9tdXRhdGlvbkJ1dHRvbi5qcycpXG59KTtcbmFwcC5kaXJlY3RpdmUoXCJudW1iZXJWaWV3XCIsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gcmVxdWlyZSgnLi9kaXJlY3RpdmVzL251bWJlclZpZXcuanMnKVxufSk7XG5cbi8vIGRlZmluZSBjb250cm9sbGVyc1xuYXBwLmNvbnRyb2xsZXIoXCJDYWxjdWxhdG9yQ29udHJvbGxlclwiLFxuXHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0NhbGN1bGF0b3JDb250cm9sbGVyLmpzJylcbik7XG4iLCJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ2FsY3VsYXRvckNvbnRyb2xsZXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHQvLyBEZWZpbmUgaW5zdGFuY2UgdmFyaWFibGVzXG5cdFx0dGhpcy5tb2RlbCA9IHtcblx0XHRcdGxlZnQ6ICcnLFxuXHRcdFx0cmlnaHQ6ICcnLFxuXHRcdFx0b3BlcmF0b3I6ICcnLFxuXHRcdH07XG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gZmFsc2Vcblx0fVxuXG5cdHJlc2V0TW9kZWwoKSB7XG5cdFx0dGhpcy5tb2RlbCA9IHtcblx0XHRcdGxlZnQ6ICcnLFxuXHRcdFx0cmlnaHQ6ICcnLFxuXHRcdFx0b3BlcmF0b3I6ICcnXG5cdFx0fVxuXHRcdHRoaXMuaW5zZXJ0aW5nRGVjaW1hbCA9IGZhbHNlO1xuXHR9XG5cblx0aW5zZXJ0TnVtYmVyKG51bWJlcikge1xuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgIT0gJycgJiYgdGhpcy5tb2RlbC5yaWdodCA9PSAnJyAmJiB0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcnKSB7XG5cdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnMCcpIHtcblx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSAnJztcblx0XHR9XG5cblx0XHR0aGlzLm1vZGVsLnJpZ2h0ICs9IG51bWJlci50b1N0cmluZygpO1xuXHR9XG5cblx0aW5zZXJ0RGVjaW1hbCgpIHtcblx0XHRpZiAodGhpcy5pbnNlcnRpbmdEZWNpbWFsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubW9kZWwubGVmdCAhPSAnJyAmJiB0aGlzLm1vZGVsLnJpZ2h0ID09ICcnICYmIHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJycpIHtcblx0XHRcdHRoaXMucmVzZXRNb2RlbCgpO1xuXHRcdH1cblxuXHRcdHRoaXMubW9kZWwucmlnaHQgKz0gJy4nO1xuXG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gdHJ1ZTtcblx0fVxuXG5cdGluc2VydE9wZXJhdG9yKG9wZXJhdG9yKSB7XG5cdFx0dGhpcy5lcXVhdGUoKTtcblxuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgPT0gJycgJiYgdGhpcy5tb2RlbC5vcGVyYXRvciA9PSAnJyAmJiB0aGlzLm1vZGVsLnJpZ2h0ICE9ICcnKSB7XG5cdFx0XHR0aGlzLm1vZGVsLmxlZnQgPSB0aGlzLm1vZGVsLnJpZ2h0O1xuXHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9ICcnO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1vZGVsLmxlZnQgPT0gJycpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLm1vZGVsLm9wZXJhdG9yID0gb3BlcmF0b3I7XG5cdH1cblxuXHQvLyBDYWxjdWxhdGUgdGhlIGN1cnJlbnQgb3BlcmF0aW9uLlxuXHRlcXVhdGUoKSB7XG5cblx0XHQvLyBXZSBoYXZlIG9wZXJhbmRzLCBub3cgZXF1YXRlIGZvciB0aGUgY29ycmVzcG9uZGluZyBvcGVyYXRvci5cblx0XHRpZiAodGhpcy5tb2RlbC5sZWZ0ICE9ICcnICYmIHRoaXMubW9kZWwucmlnaHQgIT0gJycpIHtcblx0XHRcdHZhciBsZWZ0ID0gcGFyc2VGbG9hdCh0aGlzLm1vZGVsLmxlZnQpO1xuXHRcdFx0dmFyIHJpZ2h0ID0gcGFyc2VGbG9hdCh0aGlzLm1vZGVsLnJpZ2h0KTtcblx0XHRcdGlmICh0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcrJykge1xuXHRcdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9IChsZWZ0ICsgcmlnaHQpLnRvU3RyaW5nKCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJy0nKSB7XG5cdFx0XHRcdHRoaXMucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLm1vZGVsLnJpZ2h0ID0gKGxlZnQgLSByaWdodCkudG9TdHJpbmcoKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5tb2RlbC5vcGVyYXRvciA9PSAneCcpIHtcblx0XHRcdFx0dGhpcy5yZXNldE1vZGVsKCk7XG5cdFx0XHRcdHRoaXMubW9kZWwucmlnaHQgPSAobGVmdCAqIHJpZ2h0KS50b1N0cmluZygpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcvJykge1xuXHRcdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblx0XHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9IChsZWZ0IC8gcmlnaHQpLnRvU3RyaW5nKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gZmFsc2U7XG5cdH1cblxuXHRtdXRhdG9yU2luKCkge1xuXHRcdHRoaXMuZXF1YXRlKCk7XG5cblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnJykgcmV0dXJuO1xuXG5cdFx0dGhpcy5tb2RlbC5yaWdodCA9IE1hdGguc2luKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpLnRvU3RyaW5nKCk7XG5cdH1cblxuXHRtdXRhdG9yQ29zKCkge1xuXHRcdHRoaXMuZXF1YXRlKCk7XG5cblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnJykgcmV0dXJuO1xuXG5cdFx0dGhpcy5tb2RlbC5yaWdodCA9IE1hdGguY29zKHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpLnRvU3RyaW5nKCk7XG5cdH1cblxuXHRmbGlwU2lnbigpIHtcblx0XHRpZiAodGhpcy5tb2RlbC5yaWdodCA9PSAnJykgcmV0dXJuO1xuXG5cdFx0dGhpcy5tb2RlbC5yaWdodCA9ICgtMSAqIHBhcnNlRmxvYXQodGhpcy5tb2RlbC5yaWdodCkpLnRvU3RyaW5nKCk7XG5cdH1cblxufTtcbiIsIlxuLy8gRGlyZWN0aXZlcyBcImRlc2NyaWJlXCIgdGhlIHZpZXcgYW5kIGxpbmsgdG8gaXQuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVzdHJpY3Q6ICdFJyxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvY2FsY3VsYXRvci5qYWRlJykoKSxcblx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5iaW5kKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDQ4OlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCcwJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQ5OlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCcxJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDUwOlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCcyJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDUxOlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCczJyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDUyOlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc0Jyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDUzOlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc1Jyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDU0OlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc2Jyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDU1OlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKCc3Jyk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDU2OlxuXHRcdFx0XHRcdFx0aWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE9wZXJhdG9yKCd4Jylcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzgnKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNTc6XG5cdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIoJzknKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTkwOlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0RGVjaW1hbCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA4OlxuXHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIucmVzZXRNb2RlbCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMzpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmVxdWF0ZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxODc6XG5cdFx0XHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkpIHtcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0T3BlcmF0b3IoJysnKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxODk6XG5cdFx0XHRcdFx0XHRzY29wZS5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnRPcGVyYXRvcignLScpXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDE5MTpcblx0XHRcdFx0XHRcdHNjb3BlLmNhbGN1bGF0b3JDb250cm9sbGVyLmluc2VydE9wZXJhdG9yKCcvJylcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0pXG5cdH1cbn07XG4iLCJcbi8vIERpcmVjdGl2ZXMgXCJkZXNjcmliZVwiIHRoZSB2aWV3IGFuZCBsaW5rIHRvIGl0LlxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlc3RyaWN0OiAnRScsXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3ZpZXdzL2RlY2ltYWxCdXR0b24uamFkZScpKClcbn07XG4iLCJcbi8vIERpcmVjdGl2ZXMgXCJkZXNjcmliZVwiIHRoZSB2aWV3IGFuZCBsaW5rIHRvIGl0LlxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlc3RyaWN0OiAnRScsXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3ZpZXdzL2VxdWF0ZUJ1dHRvbi5qYWRlJykoKVxufTtcbiIsIlxuLy8gRGlyZWN0aXZlcyBcImRlc2NyaWJlXCIgdGhlIHZpZXcgYW5kIGxpbmsgdG8gaXQuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVzdHJpY3Q6ICdFJyxcblx0c2NvcGU6IHtcblx0XHRuYW1lOiAnQCcsXG5cdFx0bXV0YXRvcjogJyYnXG5cdH0sXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3ZpZXdzL211dGF0aW9uQnV0dG9uLmphZGUnKSgpXG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHRzY29wZToge1xuXHRcdG51bWJlcjogJ0AnXG5cdH0sXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3ZpZXdzL251bWJlckJ1dHRvbi5qYWRlJykoKVxufTtcbiIsIlxuLy8gRGlyZWN0aXZlcyBcImRlc2NyaWJlXCIgdGhlIHZpZXcgYW5kIGxpbmsgdG8gaXQuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVzdHJpY3Q6ICdFJyxcblx0c2NvcGU6IHtcblx0XHRtb2RlbDogJz0nXG5cdH0sXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3ZpZXdzL251bWJlclZpZXcuamFkZScpKClcbn07XG4iLCJcbi8vIERpcmVjdGl2ZXMgXCJkZXNjcmliZVwiIHRoZSB2aWV3IGFuZCBsaW5rIHRvIGl0LlxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlc3RyaWN0OiAnRScsXG5cdHNjb3BlOiB7XG5cdFx0b3BlcmF0b3I6ICdAJ1xuXHR9LFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9vcGVyYXRvckJ1dHRvbi5qYWRlJykoKVxufTtcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxudW1iZXItdmlldyBtb2RlbD1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIubW9kZWxcXFwiPjwvbnVtYmVyLXZpZXc+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJzaXggY29sdW1uc1xcXCI+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiMVxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCIyXFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjNcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI0XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjVcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiNlxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjdcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiOFxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI5XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxkZWNpbWFsLWJ1dHRvbj48L2RlY2ltYWwtYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCIwXFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48ZXF1YXRlLWJ1dHRvbj48L2VxdWF0ZS1idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwidHdvIGNvbHVtbnNcXFwiPjxvcGVyYXRvci1idXR0b24gb3BlcmF0b3I9XFxcIitcXFwiPjwvb3BlcmF0b3ItYnV0dG9uPjxvcGVyYXRvci1idXR0b24gb3BlcmF0b3I9XFxcIi1cXFwiPjwvb3BlcmF0b3ItYnV0dG9uPjxvcGVyYXRvci1idXR0b24gb3BlcmF0b3I9XFxcInhcXFwiPjwvb3BlcmF0b3ItYnV0dG9uPjxvcGVyYXRvci1idXR0b24gb3BlcmF0b3I9XFxcIi9cXFwiPjwvb3BlcmF0b3ItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG11dGF0aW9uLWJ1dHRvbiBuYW1lPVxcXCJDbGVhclxcXCIgbXV0YXRvcj1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIucmVzZXRNb2RlbCgpXFxcIj48L211dGF0aW9uLWJ1dHRvbj48bXV0YXRpb24tYnV0dG9uIG5hbWU9XFxcIlNpblxcXCIgbXV0YXRvcj1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIubXV0YXRvclNpbigpXFxcIj48L211dGF0aW9uLWJ1dHRvbj48bXV0YXRpb24tYnV0dG9uIG5hbWU9XFxcIkNvc1xcXCIgbXV0YXRvcj1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIubXV0YXRvckNvcygpXFxcIj48L211dGF0aW9uLWJ1dHRvbj48bXV0YXRpb24tYnV0dG9uIG5hbWU9XFxcIisvLVxcXCIgbXV0YXRvcj1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIuZmxpcFNpZ24oKVxcXCI+PC9tdXRhdGlvbi1idXR0b24+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCJjYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnREZWNpbWFsKClcXFwiIGNsYXNzPVxcXCJidXR0b24gYnV0dG9uLXByaW1hcnkgdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPi48L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCJjYWxjdWxhdG9yQ29udHJvbGxlci5lcXVhdGUoKVxcXCIgY2xhc3M9XFxcImJ1dHRvbiBidXR0b24tcHJpbWFyeSB1LWZ1bGwtd2lkdGggbm8tcGFkZGluZ1xcXCI+PTwvYT5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGEgbmctY2xpY2s9XFxcIm11dGF0b3IoKVxcXCIgY2xhc3M9XFxcImJ1dHRvbiB1LWZ1bGwtd2lkdGggbm8tcGFkZGluZ1xcXCI+e3sgbmFtZSB9fTwvYT5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGEgbmctY2xpY2s9XFxcIiRwYXJlbnQuY2FsY3VsYXRvckNvbnRyb2xsZXIuaW5zZXJ0TnVtYmVyKG51bWJlcilcXFwiIGNsYXNzPVxcXCJidXR0b24gdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPnt7IG51bWJlciB9fTwvYT5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwie3ttb2RlbC5sZWZ0fX0ge3ttb2RlbC5vcGVyYXRvcn19IHt7bW9kZWwucmlnaHR9fVwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8YSBuZy1jbGljaz1cXFwiJHBhcmVudC5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnRPcGVyYXRvcihvcGVyYXRvcilcXFwiIGNsYXNzPVxcXCJidXR0b24gdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPnt7IG9wZXJhdG9yIH19PC9hPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLG51bGwsIiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLmphZGU9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbC5tYXAoam9pbkNsYXNzZXMpIDpcbiAgICAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSA/IE9iamVjdC5rZXlzKHZhbCkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHZhbFtrZXldOyB9KSA6XG4gICAgW3ZhbF0pLmZpbHRlcihudWxscykuam9pbignICcpO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjbGFzc2VzXG4gKiBAcGFyYW0ge0FycmF5LjxCb29sZWFuPn0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNscyA9IGZ1bmN0aW9uIGNscyhjbGFzc2VzLCBlc2NhcGVkKSB7XG4gIHZhciBidWYgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVzY2FwZWQgJiYgZXNjYXBlZFtpXSkge1xuICAgICAgYnVmLnB1c2goZXhwb3J0cy5lc2NhcGUoam9pbkNsYXNzZXMoW2NsYXNzZXNbaV1dKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWYucHVzaChqb2luQ2xhc3NlcyhjbGFzc2VzW2ldKSk7XG4gICAgfVxuICB9XG4gIHZhciB0ZXh0ID0gam9pbkNsYXNzZXMoYnVmKTtcbiAgaWYgKHRleHQubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcgY2xhc3M9XCInICsgdGV4dCArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5cbmV4cG9ydHMuc3R5bGUgPSBmdW5jdGlvbiAodmFsKSB7XG4gIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModmFsKS5tYXAoZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICByZXR1cm4gc3R5bGUgKyAnOicgKyB2YWxbc3R5bGVdO1xuICAgIH0pLmpvaW4oJzsnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG59O1xuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVzY2FwZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gYXR0cihrZXksIHZhbCwgZXNjYXBlZCwgdGVyc2UpIHtcbiAgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgIHZhbCA9IGV4cG9ydHMuc3R5bGUodmFsKTtcbiAgfVxuICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiB2YWwgfHwgbnVsbCA9PSB2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmICgwID09IGtleS5pbmRleE9mKCdkYXRhJykgJiYgJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkge1xuICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWwpLmluZGV4T2YoJyYnKSAhPT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignU2luY2UgSmFkZSAyLjAuMCwgYW1wZXJzYW5kcyAoYCZgKSBpbiBkYXRhIGF0dHJpYnV0ZXMgJyArXG4gICAgICAgICAgICAgICAgICAgJ3dpbGwgYmUgZXNjYXBlZCB0byBgJmFtcDtgJyk7XG4gICAgfTtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIGVsaW1pbmF0ZSB0aGUgZG91YmxlIHF1b3RlcyBhcm91bmQgZGF0ZXMgaW4gJyArXG4gICAgICAgICAgICAgICAgICAgJ0lTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyBcIj0nXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpLnJlcGxhY2UoLycvZywgJyZhcG9zOycpICsgXCInXCI7XG4gIH0gZWxzZSBpZiAoZXNjYXBlZCkge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIGV4cG9ydHMuZXNjYXBlKHZhbCkgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gZnVuY3Rpb24gYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBidWYgPSBbXTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICAsIHZhbCA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoJ2NsYXNzJyA9PSBrZXkpIHtcbiAgICAgICAgaWYgKHZhbCA9IGpvaW5DbGFzc2VzKHZhbCkpIHtcbiAgICAgICAgICBidWYucHVzaCgnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWYucHVzaChleHBvcnRzLmF0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYuam9pbignJyk7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5lc2NhcGUgPSBmdW5jdGlvbiBlc2NhcGUoaHRtbCl7XG4gIHZhciByZXN1bHQgPSBTdHJpbmcoaHRtbClcbiAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgaWYgKHJlc3VsdCA9PT0gJycgKyBodG1sKSByZXR1cm4gaHRtbDtcbiAgZWxzZSByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcbiAqIHRoZSBqYWRlIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJldGhyb3cgPSBmdW5jdGlvbiByZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBlcnI7XG4gIGlmICgodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyB8fCAhZmlsZW5hbWUpICYmICFzdHIpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgdHJ5IHtcbiAgICBzdHIgPSBzdHIgfHwgcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKSgxKVxufSk7Il19
