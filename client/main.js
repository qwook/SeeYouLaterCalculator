
/* Let's talk about NodeJS. */

/* You might know from Java or C++ the `import` and `#include` keywords
 Those keywords will import the file.
 In NodeJS, the equivalent of that is "require"
 "require" will actually run the file.

 Unlike in Java and C++, you don't have to call `require` at the top.
 To keep the flow of the code, I've used the `require` inside functions
 and when defining controllers and views.
 */

var app = angular.module("calculatorApp", [])
// this is to grab the address bar URL
// mainly used for creating different sessions
.config(function($locationProvider) {
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
app.directive("calculator",
	require('./directives/calculator.js')
);
app.directive("numberButton",
	require('./directives/numberButton.js')
);
app.directive("decimalButton",
	require('./directives/decimalButton.js')
);
app.directive("operatorButton",
	require('./directives/operatorButton.js')
);
app.directive("equateButton",
	require('./directives/equateButton.js')
);
app.directive("mutationButton",
	require('./directives/mutationButton.js')
);
app.directive("numberView",
	require('./directives/numberView.js')
);

/* define controllers */
app.controller("CalculatorController",
	require('./controllers/CalculatorController.js')
);

/* define factories (models) */
app.factory("CalculatorModel",
	require('./models/CalculatorModel.js')
);

/* define services */
app.service("CalculatorWebSync",
	require('./services/CalculatorWebSync.js')
);
