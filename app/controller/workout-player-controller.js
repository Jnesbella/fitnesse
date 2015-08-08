var app = angular.module("Fitnesse.App");

app.controller('workoutPlayerController', ['$scope', 'workout', 'exerciseManager', 'sessionManager', function ($scope, workout, exerciseManager, sessionManager) {

	$scope.data = {
		exerciseIndex: undefined,
		isRecording: false,
		timestamp: Date.now()
		// session
	};

	$scope.tabs = ['records', 'exercise'];
	$scope.data.selectedTab = $scope.tabs[0];

	$scope.selectTab = function (tab) {
		$scope.data.selectedTab = tab;
	};

	$scope.getWorkoutName = function () {
		return workout.name;
	};

	// the session for the exercise's previous workout
	$scope.getPreviousSession = function () {
		
	};

	// get the sessions of the current exercise
	$scope.getRecords = function () {
		var sessions = [];
		// the previous session
		// the session
		return sessions;
	};

	// record a set for it's session
	// weight, weightLabel, duration, durationLabel, note, timestamp
	$scope.record = function (data) {
		console.log('pause');
	};

	var getExercise = function (id) {
		return exerciseManager.get(id);
	}

	// load the next exercise for the workout
	/*$scope.getNextExerciseName = function () {
		var name;

		if (workout.exercises[$scope.data.exerciseIndex + 1]) {
			name = getExercise(workout.exercises[$scope.data.exerciseIndex + 1]).name;
		}

		return name;
	};*/

	// load the previous exercise for the workout
	/*$scope.getPreviousExerciseName = function () {
		var name;

		if (workout.exercises[$scope.data.exerciseIndex - 1]) {
			name = getExercise(workout.exercises[$scope.data.exerciseIndex - 1]).name;
		}

		return name;
	};*/

	// get the name of the exercise
	$scope.getExerciseName = function () {
		return getExercise(workout.exercises[$scope.data.exerciseIndex]).name;
	};

	$scope.getExercises = function () {
		var names = [];

		for (var i = 0; i < workout.exercises.length; i++) {
			names.push(getExercise(workout.exercises[i]));
		}

		return names;
	};

	$scope.setRecording = function (recording) {
		$scope.data.isRecording = recording;
	};

	$scope.selectExercise = function (index) {
		$scope.data.exerciseIndex = index;
		$scope.setRecording(true);
	};

	/*$scope.next = function () {
		if ($scope.data.exerciseIndex + 1 < workout.exercises.length) {
			$scope.data.exerciseIndex++;
		}
	};

	$scope.previous = function () {
		if ($scope.data.exerciseIndex - 1 >= 0) {
			$scope.data.exerciseIndex--;
		}
	};*/

	var init = function() {
		var session = sessionManager.create('session');
		session.workout = workout.id;
		$scope.data.session = session;
	}
	init();
}]);