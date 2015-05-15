
module.exports = function (CalculatorModel, $location, $http, $interval) {
	return new class CalculatorWebSync {

		autoupdate(model) {

			var _model = model;

			var waitForRun = true;
			var previousModel = null;

			// Request initial model.
			this.request()
			.then((model) => {
				_model.copy(model);
				previousModel = _model.clone();
				waitForRun = false;
			});

			// Save every 500ms
			var savetimer = $interval(() => {
				if (waitForRun) return;

				// If our model has changed, upload it.
				if (!_model.equals(previousModel)) {
					this.update(_model)
					.then(() => {
						previousModel = _model.clone();
						waitForRun = false;
					});
				// If our model is the same, update to server's.
				} else {
					this.request()
					.then((model) => {
						_model.copy(model);
						previousModel = _model.clone();
						waitForRun = false;
					});
				}

			}, 500);

			return savetimer;

		}

		update(model) {
			return $http.post('/api/update', {id: this.getId(), model: model});
		}

		request() {
			return $http.get('/api/request', {params: {id: this.getId()}})
			.then((response) => {
				var newModel = new CalculatorModel();
				newModel.left = response.data.left || '';
				newModel.right = response.data.right || '';
				newModel.operator = response.data.operator || '';
				return newModel;
			});
		}

		getId() {
			return $location.path().substring(1);
		}

	};
}
