var app = angular.module("Fitnesse.App");

app.controller('workoutEditController', ['$scope', 'workout', 'editModes', '$location', 'workoutManager', '$log', 'exerciseManager', 'equipmentManager', 'muscleGroupManager',
	function ($scope, workout, editModes, $location, workoutManager, $log, exerciseManager, equipmentManager, muscleGroupManager) {

	$scope.data = {};

	$scope.addExercicesModalOpen = false;

	$scope.getWorkout = function () {
		return workout;
	};

	$scope.getEquipment = function () {
		return workoutManager.getEquipment(workout.id);
	};

	$scope.getEquipmentData = function (id) {
		return equipmentManager.get(id);
	};

	$scope.getMuscleGroups = function () {
		return workoutManager.getMuscleGroups(workout.id);
	};

	$scope.getMuscleGroupData = function (id) {
		return muscleGroupManager.get(id);
	};

	$scope.getExercise = function (id) {
		return exerciseManager.get(id);
	};

	$scope.addExercises = function () {
		$scope.addExercicesModalOpen = true;
	};

	var redirect = function () {
		$location.path('/workouts');
	};

	$scope.slay = function (index) {
		$scope.data.exercises.splice(index, 1);
	};

	/*$scope.save = function () {
		var _workout;

		if ($scope.mode === editModes.create) {
			_workout = workoutManager.create($scope.data);
			redirect();
		}

		if ($scope.mode === editModes.update) {
			_workout = workout;
			_workout.removeAllExerciseLinks();
			for (var i = 0; i < $scope.data.exercises.length; i++) {
				_workout.appendExercise($scope.data.exercises[i]);
			}
			workoutManager.update(_workout);
			workout = _workout;
			init();
		}
	};*/

	$scope.save = function () {
		workoutManager.save($scope.data);

		if ($scope.mode === editModes.create) {
			redirect();
		}

		if ($scope.mode === editModes.update) {
			workout = $scope.data;
			init();
		}
	};

	$scope.move = function (index) {
		if ($scope.moveIndex === undefined) {
			$scope.moveIndex = index;
		}

		else {
			var first = $scope.data.exercises[$scope.moveIndex];
			var second = $scope.data.exercises[index];

			$scope.data.exercises[index] = first;
			$scope.data.exercises[$scope.moveIndex] = second;

			$scope.moveIndex = undefined;
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

	/*var exercisesDirty = function () {
		var dirty = false;

		var arr1 = $scope.master.getExercises();
		var arr2 = $scope.data.exercises;

		if (arr1.length !== arr2.length) {
			dirty = true;
		}

		else {
			for (var i = 0; i < arr1.length; i++) {
				if (arr1[i] !== arr2[i]) {
					dirty = false;
					break;
				}
			}
		}

		return dirty;
	};*/

	$scope.isDirty = function () {
		return !angular.equals(workout, $scope.data);
	};

	$scope.isValid = function () {
		/*var valid = true;

		if (!$scope.data.name || !$scope.data.name.trim()) {
			valid = false;
		}

		return valid;*/
		return true;
	};

	$scope.doAddExercises = function (value) {
		for (var i = 0; i < value.length; i++) {
			$scope.data.exercises.push(value[i]);
		}
	};

	/*var objToArray = function (obj) {
		var arr = [];

		for (var prop in obj) {
			arr.push(obj[prop]);
		}

		return arr;
	};*/

	/*$scope.getExercises = function () {
		var exercises = [];

		if ($scope.mode === editModes.read) {
			exercises = $scope.master.getExercises();
		}

		else if ($scope.mode === editModes.update || $scope.mode === editModes.create) {
			exercises = $scope.data.exercises;
			//exercises = objToArray($scope.data.exercises);
		}

		return exercises;
	};*/

	$scope.doWorkout = function () {
		$location.path('/workout/player/' + $scope.getWorkout().id);
	};

	var init = function() {
		if (workout && workout.id) {
			$scope.mode = editModes.read;

			$scope.data = angular.copy(workout);
		}

		else {
			$scope.mode = editModes.create;

			$scope.data = workoutManager.create();
		}
	};
	init();
}])