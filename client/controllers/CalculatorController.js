
var CalculatorModel = require('../models/CalculatorModel.js');

/**
 * Calculator Controller
 * ----------------
 * Calculator controller for MVC
 *
 **/

module.exports = class CalculatorController {
	constructor() {
		// Define instance variables
		this.model = new CalculatorModel();
		this.insertingDecimal = false
	}

	resetModel() {
		this.model = new CalculatorModel();
		this.insertingDecimal = false;
	}

	insertNumber(number) {
		if (this.model.left != '' && this.model.right == '' && this.model.operator == '') {
			this.resetModel();
		}

		if (this.model.right == '0') {
			this.model.right = '';
		}

		this.model.right += number.toString();
	}

	insertDecimal() {
		if (this.insertingDecimal) {
			return;
		}

		if (this.model.left != '' && this.model.right == '' && this.model.operator == '') {
			this.resetModel();
		}

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
