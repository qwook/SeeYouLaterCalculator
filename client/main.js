
// Let's talk about NodeJS.

/* You might know from Java or C++ the `import` and `#include` keywords
 Those keywords will import the file.
 In NodeJS, the equivalent of that is "require"
 "require" will actually run the file.

 Unlike in Java and C++, you don't have to call `require` at the top.
 To keep the flow of the code, I've used the `require` inside functions
 and when defining controllers and views.
 */

var angular = require('angular');

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
app.directive("calculator", function() {
	return require('./directives/calculator.js')
});
app.directive("numberButton", function() {
	return require('./directives/numberButton.js')
});
app.directive("decimalButton", function() {
	return require('./directives/decimalButton.js')
});
app.directive("operatorButton", function() {
	return require('./directives/operatorButton.js')
});
app.directive("equateButton", function() {
	return require('./directives/equateButton.js')
});
app.directive("mutationButton", function() {
	return require('./directives/mutationButton.js')
});
app.directive("numberView", function() {
	return require('./directives/numberView.js')
});

// define controllers
app.controller("CalculatorController",
	require('./controllers/CalculatorController.js')
);
