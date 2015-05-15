
/**
 * Calculator Controller
 * @description Controller for calculating an equation
 * given left and right numbers, and an operation.
 */
module.exports = class CalculatorController {
	constructor(CalculatorModel, CalculatorWebSync, $interval, $scope) {
		// Define instance variables
		this.insertingDecimal = false
		this.model = new CalculatorModel();
		this.test = '';

		// Start autoupdating
		var autoupdate = CalculatorWebSync.autoupdate(this.model);
		$scope.$on('$destroy', function() {
			$interval.cancel(autoupdate);
		});
	}

	/**
	 * Clear / reset the model to default settings.
	 */
	resetModel() {
		this.model.left = ''
		this.model.right = ''
		this.model.operator = ''
		this.insertingDecimal = false;
	}

	/**
	 * Concatenate a number to working number
	 * @param  {Number} number to concatenate with
	 */
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

	/**
	 * Concatenate a decimal to the end of the number
	 */
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

	/**
	 * Set the operator for the current calculation.
	 * @param  {String} the operator
	 */
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
		
		this.clamp();
	}

	/**
	 * Calculate the current equation.
	 */
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

		this.clamp();
	}

	/**
	 * Calculate the sin function for the current working operation.
	 */
	mutatorSin() {
		this.equate();

		if (this.model.right == '') return;

		this.model.right = Math.sin(parseFloat(this.model.right)).toString();

		this.clamp();
	}

	/**
	 * Calculate the cos function for the current working operation.
	 */
	mutatorCos() {
		this.equate();

		if (this.model.right == '') return;

		this.model.right = Math.cos(parseFloat(this.model.right)).toString();

		this.clamp();
	}

	/**
	 * Calculate a fairly bad tip given the current working operation.
	 */
	badTip() {
		this.equate();

		if (this.model.right == '') return;

		this.model.right = (parseFloat(this.model.right) * 0.10).toString();

		this.clamp();
	}

	/**
	 * Calculate an okay tip given the current working operation.
	 */
	okayTip() {
		this.equate();

		if (this.model.right == '') return;

		this.model.right = (parseFloat(this.model.right) * 0.15).toString();

		this.clamp();
	}

	/**
	 * Flip the parity of the working number.
	 */
	flipSign() {
		if (this.model.right == '') return;

		this.model.right = (-1 * parseFloat(this.model.right)).toString();

		this.clamp();
	}

	/**
	 * Ensure that a number isn't too big.
	 */
	clamp() {
		// Don't clamp if it's not a number
		if (
			(
				Number.isNaN(parseFloat(this.model.right)) ||
				!Number.isFinite(parseFloat(this.model.right))
			)
			&& this.model.right == ''
		) return;

		// Clamp to 6 digits
		this.model.right = (Math.floor(parseFloat(this.model.right) * 1000000) / 1000000).toString()
	}

};
