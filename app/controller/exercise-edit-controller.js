var app = angular.module("Fitnesse.App");

app.controller('exerciseEditController', ['$scope', 'exercise', 'editModes', '$location', 'exerciseManager', 'equipmentManager', 'muscleGroupManager', '$log',
	function ($scope, exercise, editModes, $location, exerciseManager, equipmentManager, muscleGroupManager, $log) {

	$scope.data = {};

	$scope.getExercise = function () {
		return exercise;
	};

	$scope.getEquipment = function (id) {
		return equipmentManager.get(id);
	};

	$scope.getMuscleGroups = function () {
		return muscleGroupManager.get();
	};

	$scope.getMuscleGroup = function (id) {
		return muscleGroupManager.get(id); 
	};

	var redirect = function () {
		$location.path('/exercises');
	};

	$scope.save = function () {
		exerciseManager.save($scope.data);

		if ($scope.mode === editModes.create) {
			redirect();
		}

		if ($scope.mode === editModes.update) {
			exercise = $scope.data;
			init();
		}
	};

	$scope.edit = function () {
		$scope.mode = editModes.update;
	};

	$scope.cancel = function () {
		if ($scope.mode === editModes.update) {
			init();
		}

		else if ($scope.mode === editModes.create || $scope.mode === editModes.read) {
			redirect();
		}
	};

	$scope.isDirty = function () {
		return !angular.equals(exercise, $scope.data);
	};

	$scope.isValid = function () {
		var valid = true;

		if (!$scope.data.name || !$scope.data.name.trim()) {
			valid = false;
		}

		return valid;
	};

	var init = function () {
		if (exercise && exercise.id) {
			$scope.mode = editModes.read;

			$scope.data = angular.copy(exercise);
		}

		else {
			$scope.mode = editModes.create;

			$scope.data = exerciseManager.create();
		}
	};
	init();
}])