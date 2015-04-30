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
app.directive("equateButton", function () {
  return require("./directives/equateButton.js");
});
app.directive("numberView", function () {
  return require("./directives/numberView.js");
});

// define controllers
app.controller("CalculatorController", require("./controllers/CalculatorController.js"));

},{"./controllers/CalculatorController.js":2,"./directives/calculator.js":3,"./directives/decimalButton.js":4,"./directives/equateButton.js":5,"./directives/numberButton.js":6,"./directives/numberView.js":7}],2:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
		}
	}, {
		key: 'insertNumber',
		value: function insertNumber(number) {
			if (this.model.left != '' && this.model.right == '' && this.model.operator == '') this.resetModel();

			this.model.right += number.toString();
			console.log(number);
		}
	}, {
		key: 'insertDecimal',
		value: function insertDecimal() {
			if (this.insertingDecimal) {
				return;
			}

			this.model.right += '.';

			this.insertingDecimal = true;
		}
	}, {
		key: 'insertOperator',
		value: function insertOperator(operator) {}
	}, {
		key: 'equate',

		// Calculate the current operation.
		value: function equate() {
			if (this.model.left == '' && this.model.operator == '') {
				this.model.left = this.model.right;
				this.model.right = '';
			}
			console.log('Equate');
		}
	}]);

	return CalculatorController;
})();

},{}],3:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	template: require('./views/calculator.jade')()
};

},{"./views/calculator.jade":8}],4:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	template: require('./views/decimalButton.jade')()
};

},{"./views/decimalButton.jade":9}],5:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	template: require('./views/equateButton.jade')()
};

},{"./views/equateButton.jade":10}],6:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	scope: {
		number: '@'
	},
	template: require('./views/numberButton.jade')()
};

},{"./views/numberButton.jade":11}],7:[function(require,module,exports){

// Directives "describe" the view and link to it.
'use strict';

module.exports = {
	restrict: 'E',
	scope: {
		model: '='
	},
	template: require('./views/numberView.jade')()
};

},{"./views/numberView.jade":12}],8:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"row\"><div class=\"twelve columns\"><number-view model=\"calculatorController.model\"></number-view></div></div><div class=\"row\"><div class=\"six columns\"><div class=\"row\"><div class=\"four columns\"><number-button number=\"1\"></number-button></div><div class=\"four columns\"><number-button number=\"2\"></number-button></div><div class=\"four columns\"><number-button number=\"3\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"4\"></number-button></div><div class=\"four columns\"><number-button number=\"5\"></number-button></div><div class=\"four columns\"><number-button number=\"6\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"7\"></number-button></div><div class=\"four columns\"><number-button number=\"8\"></number-button></div><div class=\"four columns\"><number-button number=\"9\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><decimal-button></decimal-button></div><div class=\"four columns\"><number-button number=\"0\"></number-button></div><div class=\"four columns\"><equate-button></equate-button></div></div></div></div>");;return buf.join("");
};
},{"jade/runtime":14}],9:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"calculatorController.insertDecimal()\" class=\"button button-primary u-full-width no-padding\">.</a>");;return buf.join("");
};
},{"jade/runtime":14}],10:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a style=\"font-size: 26pt; line-height: 32px;\" ng-click=\"calculatorController.equate()\" class=\"button button-primary u-full-width no-padding\">=</a>");;return buf.join("");
};
},{"jade/runtime":14}],11:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<a ng-click=\"$parent.calculatorController.insertNumber(number)\" class=\"button u-full-width no-padding\">{{ number }}</a>");;return buf.join("");
};
},{"jade/runtime":14}],12:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("{{model.left}} {{model.operator}} {{model.right}}");;return buf.join("");
};
},{"jade/runtime":14}],13:[function(require,module,exports){

},{}],14:[function(require,module,exports){
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

},{"fs":13}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L21haW4uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2NvbnRyb2xsZXJzL0NhbGN1bGF0b3JDb250cm9sbGVyLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL2NhbGN1bGF0b3IuanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvZGVjaW1hbEJ1dHRvbi5qcyIsIi9Wb2x1bWVzL1N1cGVyTm92YS9TY2hvb2wvU3ByaW5nMjAxNS9DTVBFMTMxL1NlZVlvdUxhdGVyQ2FsY3VsYXRvci9jbGllbnQvZGlyZWN0aXZlcy9lcXVhdGVCdXR0b24uanMiLCIvVm9sdW1lcy9TdXBlck5vdmEvU2Nob29sL1NwcmluZzIwMTUvQ01QRTEzMS9TZWVZb3VMYXRlckNhbGN1bGF0b3IvY2xpZW50L2RpcmVjdGl2ZXMvbnVtYmVyQnV0dG9uLmpzIiwiL1ZvbHVtZXMvU3VwZXJOb3ZhL1NjaG9vbC9TcHJpbmcyMDE1L0NNUEUxMzEvU2VlWW91TGF0ZXJDYWxjdWxhdG9yL2NsaWVudC9kaXJlY3RpdmVzL251bWJlclZpZXcuanMiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9jYWxjdWxhdG9yLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9kZWNpbWFsQnV0dG9uLmphZGUiLCJjbGllbnQvZGlyZWN0aXZlcy92aWV3cy9lcXVhdGVCdXR0b24uamFkZSIsImNsaWVudC9kaXJlY3RpdmVzL3ZpZXdzL251bWJlckJ1dHRvbi5qYWRlIiwiY2xpZW50L2RpcmVjdGl2ZXMvdmlld3MvbnVtYmVyVmlldy5qYWRlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9qYWRlL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNhQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFlOUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsWUFBVztBQUN0QyxTQUFPLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0NBQzVDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLFlBQVc7QUFDeEMsU0FBTyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQTtDQUM5QyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxZQUFXO0FBQ3pDLFNBQU8sT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUE7Q0FDL0MsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsWUFBVztBQUN4QyxTQUFPLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0NBQzlDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFlBQVc7QUFDdEMsU0FBTyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtDQUM1QyxDQUFDLENBQUM7OztBQUdILEdBQUcsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQ3BDLE9BQU8sQ0FBQyx1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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLy8gTGV0J3MgdGFsayBhYm91dCBOb2RlSlMuXG5cbi8qIFlvdSBtaWdodCBrbm93IGZyb20gSmF2YSBvciBDKysgdGhlIGBpbXBvcnRgIGFuZCBgI2luY2x1ZGVgIGtleXdvcmRzXG4gVGhvc2Uga2V5d29yZHMgd2lsbCBpbXBvcnQgdGhlIGZpbGUuXG4gSW4gTm9kZUpTLCB0aGUgZXF1aXZhbGVudCBvZiB0aGF0IGlzIFwicmVxdWlyZVwiXG4gXCJyZXF1aXJlXCIgd2lsbCBhY3R1YWxseSBydW4gdGhlIGZpbGUuXG5cbiBVbmxpa2UgaW4gSmF2YSBhbmQgQysrLCB5b3UgZG9uJ3QgaGF2ZSB0byBjYWxsIGByZXF1aXJlYCBhdCB0aGUgdG9wLlxuIFRvIGtlZXAgdGhlIGZsb3cgb2YgdGhlIGNvZGUsIEkndmUgdXNlZCB0aGUgYHJlcXVpcmVgIGluc2lkZSBmdW5jdGlvbnNcbiBhbmQgd2hlbiBkZWZpbmluZyBjb250cm9sbGVycyBhbmQgdmlld3MuXG4gKi9cblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcImNhbGN1bGF0b3JBcHBcIiwgW10pO1xuXG4vLyBMZXQncyB0YWxrIGFib3V0IGFuZ3VsYXIgZm9yIGEgYml0LlxuLy8gQW5ndWxhciBoYW5kbGVzIGFsbCB0aHJlZSBvZiB0aGUgTS1WLUMuXG4vLyBUaGUgd2F5IGl0IGRvZXMgaXQgaXMga2luZCBvZiBjb25mdXNpbmcsIGJ1dCBJJ2xsIHRyeSBteSBiZXN0IHRvIGV4cGxhaW4uXG5cbi8vIFRoZSBcIlZpZXdcIiBpbiBhbmd1bGFyIGlzIGRlc2NyaWJlZCBieSBhIFwiRGlyZWN0aXZlXCJcbi8qIEEgXCJEaXJlY3RpdmVcIiB3aWxsIGRlc2NyaWJlIHRoZSB2aWV3LCBob3cgeW91IGNhbiB1c2UgaXQsXG4gd2hhdCBkYXRhIHlvdSBjYW4gcGFzcyB0byB0aGUgdmlldywgYW5kIHRoZSBodG1sL2phZGUgZmlsZSB1c2VkXG4gdG8gcmVuZGVyIGl0LlxuXG4gWW91IHdpbGwgc2VlIGluIHRoZSBkaXJlY3RpdmVzIGZvbGRlciB0aGF0IHRoZXJlIGlzXG4qL1xuXG4vLyBkZWZpbmUgZGlyZWN0aXZlc1xuYXBwLmRpcmVjdGl2ZShcImNhbGN1bGF0b3JcIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvY2FsY3VsYXRvci5qcycpXG59KTtcbmFwcC5kaXJlY3RpdmUoXCJudW1iZXJCdXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbnVtYmVyQnV0dG9uLmpzJylcbn0pO1xuYXBwLmRpcmVjdGl2ZShcImRlY2ltYWxCdXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvZGVjaW1hbEJ1dHRvbi5qcycpXG59KTtcbmFwcC5kaXJlY3RpdmUoXCJlcXVhdGVCdXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvZXF1YXRlQnV0dG9uLmpzJylcbn0pO1xuYXBwLmRpcmVjdGl2ZShcIm51bWJlclZpZXdcIiwgZnVuY3Rpb24oKSB7XG5cdHJldHVybiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvbnVtYmVyVmlldy5qcycpXG59KTtcblxuLy8gZGVmaW5lIGNvbnRyb2xsZXJzXG5hcHAuY29udHJvbGxlcihcIkNhbGN1bGF0b3JDb250cm9sbGVyXCIsXG5cdHJlcXVpcmUoJy4vY29udHJvbGxlcnMvQ2FsY3VsYXRvckNvbnRyb2xsZXIuanMnKVxuKTtcbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDYWxjdWxhdG9yQ29udHJvbGxlciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdC8vIERlZmluZSBpbnN0YW5jZSB2YXJpYWJsZXNcblx0XHR0aGlzLm1vZGVsID0ge1xuXHRcdFx0bGVmdDogJycsXG5cdFx0XHRyaWdodDogJycsXG5cdFx0XHRvcGVyYXRvcjogJycsXG5cdFx0fTtcblx0XHR0aGlzLmluc2VydGluZ0RlY2ltYWwgPSBmYWxzZVxuXHR9XG5cblx0cmVzZXRNb2RlbCgpIHtcblx0XHR0aGlzLm1vZGVsID0ge1xuXHRcdFx0bGVmdDogJycsXG5cdFx0XHRyaWdodDogJycsXG5cdFx0XHRvcGVyYXRvcjogJydcblx0XHR9XG5cdH1cblxuXHRpbnNlcnROdW1iZXIobnVtYmVyKSB7XG5cdFx0aWYgKHRoaXMubW9kZWwubGVmdCAhPSAnJyAmJiB0aGlzLm1vZGVsLnJpZ2h0ID09ICcnICYmIHRoaXMubW9kZWwub3BlcmF0b3IgPT0gJycpXG5cdFx0XHR0aGlzLnJlc2V0TW9kZWwoKTtcblxuXHRcdHRoaXMubW9kZWwucmlnaHQgKz0gbnVtYmVyLnRvU3RyaW5nKCk7XG5cdFx0Y29uc29sZS5sb2cobnVtYmVyKTtcblx0fVxuXG5cdGluc2VydERlY2ltYWwoKSB7XG5cdFx0aWYgKHRoaXMuaW5zZXJ0aW5nRGVjaW1hbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMubW9kZWwucmlnaHQgKz0gJy4nO1xuXG5cdFx0dGhpcy5pbnNlcnRpbmdEZWNpbWFsID0gdHJ1ZTtcblx0fVxuXG5cdGluc2VydE9wZXJhdG9yKG9wZXJhdG9yKSB7XG5cdFx0XG5cdH1cblxuXHQvLyBDYWxjdWxhdGUgdGhlIGN1cnJlbnQgb3BlcmF0aW9uLlxuXHRlcXVhdGUoKSB7XG5cdFx0aWYgKHRoaXMubW9kZWwubGVmdCA9PSAnJyAmJiB0aGlzLm1vZGVsLm9wZXJhdG9yID09ICcnKSB7XG5cdFx0XHR0aGlzLm1vZGVsLmxlZnQgPSB0aGlzLm1vZGVsLnJpZ2h0O1xuXHRcdFx0dGhpcy5tb2RlbC5yaWdodCA9ICcnO1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhcIkVxdWF0ZVwiKTtcblx0fVxuXG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9jYWxjdWxhdG9yLmphZGUnKSgpXG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9kZWNpbWFsQnV0dG9uLmphZGUnKSgpXG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi92aWV3cy9lcXVhdGVCdXR0b24uamFkZScpKClcbn07XG4iLCJcbi8vIERpcmVjdGl2ZXMgXCJkZXNjcmliZVwiIHRoZSB2aWV3IGFuZCBsaW5rIHRvIGl0LlxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlc3RyaWN0OiAnRScsXG5cdHNjb3BlOiB7XG5cdFx0bnVtYmVyOiAnQCdcblx0fSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvbnVtYmVyQnV0dG9uLmphZGUnKSgpXG59O1xuIiwiXG4vLyBEaXJlY3RpdmVzIFwiZGVzY3JpYmVcIiB0aGUgdmlldyBhbmQgbGluayB0byBpdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXN0cmljdDogJ0UnLFxuXHRzY29wZToge1xuXHRcdG1vZGVsOiAnPSdcblx0fSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdmlld3MvbnVtYmVyVmlldy5qYWRlJykoKVxufTtcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnNcXFwiPjxudW1iZXItdmlldyBtb2RlbD1cXFwiY2FsY3VsYXRvckNvbnRyb2xsZXIubW9kZWxcXFwiPjwvbnVtYmVyLXZpZXc+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJzaXggY29sdW1uc1xcXCI+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiMVxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCIyXFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjNcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI0XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjVcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiNlxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48bnVtYmVyLWJ1dHRvbiBudW1iZXI9XFxcIjdcXFwiPjwvbnVtYmVyLWJ1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxudW1iZXItYnV0dG9uIG51bWJlcj1cXFwiOFxcXCI+PC9udW1iZXItYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCI5XFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicm93XFxcIj48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnNcXFwiPjxkZWNpbWFsLWJ1dHRvbj48L2RlY2ltYWwtYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1uc1xcXCI+PG51bWJlci1idXR0b24gbnVtYmVyPVxcXCIwXFxcIj48L251bWJlci1idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cXFwiZm91ciBjb2x1bW5zXFxcIj48ZXF1YXRlLWJ1dHRvbj48L2VxdWF0ZS1idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIG5nLWNsaWNrPVxcXCJjYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnREZWNpbWFsKClcXFwiIGNsYXNzPVxcXCJidXR0b24gYnV0dG9uLXByaW1hcnkgdS1mdWxsLXdpZHRoIG5vLXBhZGRpbmdcXFwiPi48L2E+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxhIHN0eWxlPVxcXCJmb250LXNpemU6IDI2cHQ7IGxpbmUtaGVpZ2h0OiAzMnB4O1xcXCIgbmctY2xpY2s9XFxcImNhbGN1bGF0b3JDb250cm9sbGVyLmVxdWF0ZSgpXFxcIiBjbGFzcz1cXFwiYnV0dG9uIGJ1dHRvbi1wcmltYXJ5IHUtZnVsbC13aWR0aCBuby1wYWRkaW5nXFxcIj49PC9hPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8YSBuZy1jbGljaz1cXFwiJHBhcmVudC5jYWxjdWxhdG9yQ29udHJvbGxlci5pbnNlcnROdW1iZXIobnVtYmVyKVxcXCIgY2xhc3M9XFxcImJ1dHRvbiB1LWZ1bGwtd2lkdGggbm8tcGFkZGluZ1xcXCI+e3sgbnVtYmVyIH19PC9hPlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCJ7e21vZGVsLmxlZnR9fSB7e21vZGVsLm9wZXJhdG9yfX0ge3ttb2RlbC5yaWdodH19XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsbnVsbCwiIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYuamFkZT1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IG1lcmdlKGF0dHJzLCBhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG4gIHZhciBhYyA9IGFbJ2NsYXNzJ107XG4gIHZhciBiYyA9IGJbJ2NsYXNzJ107XG5cbiAgaWYgKGFjIHx8IGJjKSB7XG4gICAgYWMgPSBhYyB8fCBbXTtcbiAgICBiYyA9IGJjIHx8IFtdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhYykpIGFjID0gW2FjXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYmMpKSBiYyA9IFtiY107XG4gICAgYVsnY2xhc3MnXSA9IGFjLmNvbmNhdChiYykuZmlsdGVyKG51bGxzKTtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSAhPSAnY2xhc3MnKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIEZpbHRlciBudWxsIGB2YWxgcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG51bGxzKHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsICE9PSAnJztcbn1cblxuLyoqXG4gKiBqb2luIGFycmF5IGFzIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5qb2luQ2xhc3NlcyA9IGpvaW5DbGFzc2VzO1xuZnVuY3Rpb24gam9pbkNsYXNzZXModmFsKSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykgOlxuICAgICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpID8gT2JqZWN0LmtleXModmFsKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdmFsW2tleV07IH0pIDpcbiAgICBbdmFsXSkuZmlsdGVyKG51bGxzKS5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcbiAqIEBwYXJhbSB7QXJyYXkuPEJvb2xlYW4+fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xzID0gZnVuY3Rpb24gY2xzKGNsYXNzZXMsIGVzY2FwZWQpIHtcbiAgdmFyIGJ1ZiA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZXNjYXBlZCAmJiBlc2NhcGVkW2ldKSB7XG4gICAgICBidWYucHVzaChleHBvcnRzLmVzY2FwZShqb2luQ2xhc3NlcyhbY2xhc3Nlc1tpXV0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5wdXNoKGpvaW5DbGFzc2VzKGNsYXNzZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgdmFyIHRleHQgPSBqb2luQ2xhc3NlcyhidWYpO1xuICBpZiAodGV4dC5sZW5ndGgpIHtcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cblxuZXhwb3J0cy5zdHlsZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWwpLm1hcChmdW5jdGlvbiAoc3R5bGUpIHtcbiAgICAgIHJldHVybiBzdHlsZSArICc6JyArIHZhbFtzdHlsZV07XG4gICAgfSkuam9pbignOycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiBhdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgdmFsID0gZXhwb3J0cy5zdHlsZSh2YWwpO1xuICB9XG4gIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIHZhbCB8fCBudWxsID09IHZhbCkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9IGVsc2UgaWYgKDAgPT0ga2V5LmluZGV4T2YoJ2RhdGEnKSAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB7XG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHZhbCkuaW5kZXhPZignJicpICE9PSAtMSkge1xuICAgICAgY29uc29sZS53YXJuKCdTaW5jZSBKYWRlIDIuMC4wLCBhbXBlcnNhbmRzIChgJmApIGluIGRhdGEgYXR0cmlidXRlcyAnICtcbiAgICAgICAgICAgICAgICAgICAnd2lsbCBiZSBlc2NhcGVkIHRvIGAmYW1wO2AnKTtcbiAgICB9O1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgZWxpbWluYXRlIHRoZSBkb3VibGUgcXVvdGVzIGFyb3VuZCBkYXRlcyBpbiAnICtcbiAgICAgICAgICAgICAgICAgICAnSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArIFwiPSdcIiArIEpTT04uc3RyaW5naWZ5KHZhbCkucmVwbGFjZSgvJy9nLCAnJmFwb3M7JykgKyBcIidcIjtcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgZXhwb3J0cy5lc2NhcGUodmFsKSArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBzdHJpbmdpZnkgZGF0ZXMgaW4gSVNPIGZvcm0gYWZ0ZXIgMi4wLjAnKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlc2NhcGVkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBmdW5jdGlvbiBhdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGJ1ZiA9IFtdO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgICwgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xuICAgICAgICBpZiAodmFsID0gam9pbkNsYXNzZXModmFsKSkge1xuICAgICAgICAgIGJ1Zi5wdXNoKCcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZSA9IGZ1bmN0aW9uIGVzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IGZ1bmN0aW9uIHJldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHJldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdKYWRlJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cbn0se1wiZnNcIjoyfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cbn0se31dfSx7fSxbMV0pKDEpXG59KTsiXX0=
