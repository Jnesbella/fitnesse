var app = angular.module("Fitnesse.App");

app.service('workoutManager', ['$controller', 'exerciseManager', function ($controller, exerciseManager) {
	
	var self = this;

	angular.extend(self, $controller('generalManager', { $scope: self, name: 'workout' }));

	var getUnionOfExerciseData = function (id, key) {
		var arr = [];

		var workout = self.get(id);
		if (workout) {
			var set = {};

			var exercises = workout.exercises;
			for (var i = 0; i < exercises.length; i++) {
				var exercise = exercises[i];
				exercise = exerciseManager.get(exercise);

				var data = exercise[key];
				for (var j = 0; j < data.length; j++) {
					set[data[j]] = true;
				}
			}

			for (var prop in set) {
				arr.push(prop);
			}
		}

		return arr;
	};

	self.getEquipment = function (id) {
		return getUnionOfExerciseData(id, 'equipment');
	};

	self.getMuscleGroups = function (id) {
		return getUnionOfExerciseData(id, 'muscleGroups');
	};

	self.getSessionsForWorkout = function (id) {

	};

	return self;
}]);