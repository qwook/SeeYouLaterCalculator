
var CalculatorModel = require('../models/CalculatorModel.js');

/**
 * Calculator Controller
 * ----------------
 * Calculator controller for MVC
 *
 **/

module.exports = class CalculatorController {
	constructor($interval, $location, $http, $scope) {
		// Define instance variables
		this.$location = $location;
		this.insertingDecimal = false
		this.model = new CalculatorModel();
		this.test = '';

		var waitForRun = true;
		var previousModel = null;

		// Request initial model.
		$http.get('/api/request', {params: {id: this.getId()}})
		.success((data, status, headers, config) => {
			this.model.left = data.left;
			this.model.right = data.right;
			this.model.operator = data.operator;
			previousModel = this.model.clone();
			waitForRun = false;
		});

		// Save every 500ms
		this.savetimer = $interval(() => {
			if (waitForRun) return;

			// If our model has changed, upload it.
			if (!this.model.equals(previousModel)) {
				$http.post('/api/update', {id: this.getId(), model: this.model})
				.success((data, status, headers, config) => {
					previousModel = this.model.clone();
					waitForRun = false;
				});
			// If our model is the same, update to server's.
			} else {
				$http.get('/api/request', {params: {id: this.getId()}})
				.success((data, status, headers, config) => {
					this.model.left = data.left;
					this.model.right = data.right;
					this.model.operator = data.operator;
					previousModel = this.model.clone();
					waitForRun = false;
				});
			}

		}, 500);

		$scope.$on('$destroy', function() {
			$interval.cancel(stop);
		});
	}

	getId() {
		return this.$location.path().substring(1);
	}

	resetModel() {
		this.test = 'hey';
		this.model.left = ''
		this.model.right = ''
		this.model.operator = ''
		this.insertingDecimal = false;
	}

	insertNumber(number) {
		if (this.model.left != '' && this.model.right == '' && this.model.operator == '') {
			this.resetModel();
		}

		if (this.model.right == '0') {
			this.model.right = '';
		}

		// Don't append to something that isn't a number.
		if (
			(
				Number.isNaN(parseFloat(this.model.right)) ||
				!Number.isFinite(parseFloat(this.model.right))
			)
			&& this.model.right != ''
		) return;

		this.model.right += number.toString();
	}

	insertDecimal() {
		if (this.insertingDecimal) {
			return;
		}

		if (this.model.left != '' && this.model.right == '' && this.model.operator == '') {
			this.resetModel();
		}

		// Don't append to something that isn't a number.
		if (
			(
				Number.isNaN(parseFloat(this.model.right)) ||
				!Number.isFinite(parseFloat(this.model.right))
			)
			&& this.model.right != ''
		) return;

		this.model.right += '.';

		this.insertingDecimal = true;
	}

	insertOperator(operator) {
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

	// Calculate the current operation.
	equate() {

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

	mutatorSin() {
		this.equate();

		if (this.model.right == '') return;

		this.model.right = Math.sin(parseFloat(this.model.right)).toString();
	}

	mutatorCos() {
		this.equate();

		if (this.model.right == '') return;

		this.model.right = Math.cos(parseFloat(this.model.right)).toString();
	}

	flipSign() {
		if (this.model.right == '') return;

		this.model.right = (-1 * parseFloat(this.model.right)).toString();
	}

};
