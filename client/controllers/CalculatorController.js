
module.exports = class CalculatorController {
	constructor() {
		// Define instance variables
		this.model = {
			left: '',
			right: '',
			operator: '',
		};
		this.insertingDecimal = false
	}

	resetModel() {
		this.model = {
			left: '',
			right: '',
			operator: ''
		}
	}

	insertNumber(number) {
		if (this.model.left != '' && this.model.right == '' && this.model.operator == '')
			this.resetModel();

		this.model.right += number.toString();
		console.log(number);
	}

	insertDecimal() {
		if (this.insertingDecimal) {
			return;
		}

		this.model.right += '.';

		this.insertingDecimal = true;
	}

	insertOperator(operator) {
		
	}

	// Calculate the current operation.
	equate() {
		if (this.model.left == '' && this.model.operator == '') {
			this.model.left = this.model.right;
			this.model.right = '';
		}
		console.log("Equate");
	}

};
