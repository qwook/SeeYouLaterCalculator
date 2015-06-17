/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	/* Let's talk about NodeJS. */
	
	/* You might know from Java or C++ the `import` and `#include` keywords
	 Those keywords will import the file.
	 In NodeJS, the equivalent of that is "require"
	 "require" will actually run the file.
	
	 Unlike in Java and C++, you don't have to call `require` at the top.
	 To keep the flow of the code, I've used the `require` inside functions
	 and when defining controllers and views.
	 */
	
	"use strict";
	
	var app = angular.module("calculatorApp", [])
	// this is to grab the address bar URL
	// mainly used for creating different sessions
	.config(function ($locationProvider) {
	  $locationProvider.html5Mode(true).hashPrefix("!");
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
	app.directive("calculator", __webpack_require__(5));
	app.directive("numberButton", __webpack_require__(7));
	app.directive("decimalButton", __webpack_require__(9));
	app.directive("operatorButton", __webpack_require__(11));
	app.directive("equateButton", __webpack_require__(13));
	app.directive("mutationButton", __webpack_require__(1));
	app.directive("numberView", __webpack_require__(15));
	
	/* define controllers */
	app.controller("CalculatorController", __webpack_require__(17));
	
	/* define factories (models) */
	app.factory("CalculatorModel", __webpack_require__(18));
	
	/* define services */
	app.service("CalculatorWebSync", __webpack_require__(19));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
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
			template: __webpack_require__(2)()
		};
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("<a ng-click=\"mutator()\" class=\"button u-full-width no-padding\">{{ name }}</a>");;return buf.join("");
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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
	
	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;
	
	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}
	
	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
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
	    str = str || __webpack_require__(4).readFileSync(filename, 'utf8')
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
	
	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Calculator Directive
	 * @author Yu'N Co
	 * @description Main view for calculator. Contains all buttons in the calculator.
	 */
	
	'use strict';
	
	module.exports = function () {
		return {
			restrict: 'E',
			template: __webpack_require__(6)(),
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("<number-view model=\"calculatorController.model\"></number-view><div class=\"row\"><div class=\"six columns\"><div class=\"row\"><div class=\"four columns\"><number-button number=\"1\"></number-button></div><div class=\"four columns\"><number-button number=\"2\"></number-button></div><div class=\"four columns\"><number-button number=\"3\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"4\"></number-button></div><div class=\"four columns\"><number-button number=\"5\"></number-button></div><div class=\"four columns\"><number-button number=\"6\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><number-button number=\"7\"></number-button></div><div class=\"four columns\"><number-button number=\"8\"></number-button></div><div class=\"four columns\"><number-button number=\"9\"></number-button></div></div><div class=\"row\"><div class=\"four columns\"><decimal-button></decimal-button></div><div class=\"four columns\"><number-button number=\"0\"></number-button></div><div class=\"four columns\"><equate-button></equate-button></div></div></div><div class=\"two columns\"><operator-button operator=\"+\"></operator-button><operator-button operator=\"-\"></operator-button><operator-button operator=\"x\"></operator-button><operator-button operator=\"/\"></operator-button></div><div class=\"four columns\"><mutation-button name=\"Clear\" mutator=\"calculatorController.resetModel()\"></mutation-button><mutation-button name=\"Sin\" mutator=\"calculatorController.mutatorSin()\"></mutation-button><mutation-button name=\"Cos\" mutator=\"calculatorController.mutatorCos()\"></mutation-button><mutation-button name=\"+/-\" mutator=\"calculatorController.flipSign()\"></mutation-button></div></div>");;return buf.join("");
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
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
			template: __webpack_require__(8)()
		};
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("<a ng-click=\"$parent.calculatorController.insertNumber(number)\" class=\"button u-full-width no-padding\">{{ number }}</a>");;return buf.join("");
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Decimal Button Directive
	 * @author Yu'N Co
	 * @description View for button that appends a decimal point to number
	 */
	
	'use strict';
	
	module.exports = function () {
	  return {
	    restrict: 'E',
	    template: __webpack_require__(10)()
	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("<a ng-click=\"calculatorController.insertDecimal()\" class=\"button button-primary u-full-width no-padding\">.</a>");;return buf.join("");
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	
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
			template: __webpack_require__(12)()
		};
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("<a ng-click=\"$parent.calculatorController.insertOperator(operator)\" class=\"button u-full-width no-padding\">{{ operator }}</a>");;return buf.join("");
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	
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
	    template: __webpack_require__(14)()
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("<a ng-click=\"calculatorController.equate()\" class=\"button button-primary u-full-width no-padding\">=</a>");;return buf.join("");
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	
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
			template: __webpack_require__(16)()
		};
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	
	buf.push("{{model.left}} {{model.operator}} {{model.right}}");;return buf.join("");
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	
	/**
	 * Calculator Controller
	 * @description Controller for calculating an equation
	 * given left and right numbers, and an operation.
	 */
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
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

/***/ },
/* 18 */
/***/ function(module, exports) {

	
	/**
	 * Calculator Model
	 * @author Yu'N Co
	 * @description Describes the model to be used.
	 */
	
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
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

/***/ },
/* 19 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map