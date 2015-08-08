var app = angular.module("Fitnesse.App");

app.controller('addExerciseModalController', ['$scope', 'exerciseManager', '$log', function ($scope, exerciseManager, $log) {

	$scope.open = false;//true;

	$scope.selected = {};

	var minSearchLength = 1;
	$scope.passesSearch = function () {
		var passed = false;

		if ($scope.search && $scope.search.length && $scope.search.length >= minSearchLength) {

		}

		else {
			passed = true;
		}

		return passed;
	};

	var cleanUp = function () {
		$scope.open = false;
		$scope.selected = {};
	};

	$scope.getSelected = function () {
		var selected = [];

		for (var prop in $scope.selected) {
			if ($scope.selected[prop]) {
				selected.push(prop);
			}
		}

		return selected;
	};

	$scope.getExercises = function () {
		/*var exercises = {};
		var _exercises = exerciseManager.get();

		var count = 0;
		for (var i = 0; i < 10; i++) {
			for (var prop in _exercises) {
				exercises[count] = _exercises[prop];
				count++;
			}
		}

		return exercises;*/

		return exerciseManager.get();
	};

	$scope.toggleSelection = function (exercise) {
		if ($scope.selected[exercise.id]) {
			$scope.selected[exercise.id] = undefined;
		}

		else {
			$scope.selected[exercise.id] = true;
		}

		$scope.value = $scope.getSelected();
	};

	$scope.isSelected = function (exercise) {
		var selected = false;

		if ($scope.selected[exercise.id]) {
			selected = true;
		}

		return selected;
	};

	$scope.add = function () {
		if ($scope.callback && typeof $scope.callback === 'function') {
			$scope.callback({
				value: $scope.getSelected()
			});
		}

		cleanUp();
	};

	$scope.cancel = function () {
		cleanUp();
	};
}]);

app.directive('addExerciseModal', [function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			open: '=',
			callback: '&'//,
			//value: '='
		},
		templateUrl: '/view/add-exercise-modal.html',
		controller: 'addExerciseModalController'
	};
}]);