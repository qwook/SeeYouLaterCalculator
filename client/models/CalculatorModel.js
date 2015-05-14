
/**
 * Calculator Model
 * ----------------
 * Simple calculator model for MVC
 *
 **/

module.exports = class CalculatorModel {
	constructor($http) {
		this.$http = $http
		this.left = ''
		this.right = ''
		this.operator = ''
	}

	equals(otherModel) {
		return this.left == otherModel.left &&
			this.right == otherModel.right &&
			this.operator == otherModel.operator;
	}

	clone() {
		var clone = new CalculatorModel();
		clone.left = this.left;
		clone.right = this.right;
		clone.operator = this.operator;
		return clone;
	}
}