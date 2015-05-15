
/**
 * Calculator Model
 * @author Yu'N Co
 * @description Describes the model to be used.
 */

module.exports = function() {
	return class CalculatorModel {
		constructor() {
			this.left = ''
			this.right = ''
			this.operator = ''
		}

		/**
		 * Compare the equality of this model to another model
		 * @param  {CalculatorModel} otherModel the model to compare with
		 * @return {boolean} the equality
		 */
		equals(otherModel) {
			return this.left == otherModel.left &&
				this.right == otherModel.right &&
				this.operator == otherModel.operator;
		}

		/**
		 * Create a deep copy of the model
		 * @return {CalculatorModel} clone
		 */
		clone() {
			var clone = new CalculatorModel();
			clone.left = this.left;
			clone.right = this.right;
			clone.operator = this.operator;
			return clone;
		}

		/**
		 * Copy data from other model to current model
		 * @param  {CalculatorModel} other model
		 */
		copy(otherModel) {
			this.left = otherModel.left;
			this.right = otherModel.right;
			this.operator = otherModel.operator;
		}
	};
}