var app = angular.module("Fitnesse.App");

app.controller('homeController', ['$scope', '$location', function ($scope, $location) {

	$scope.navigate = function(whereTo) {
		var go = '/';

		if (whereTo === 'equipment') {
			go = '/equipment';
		}

		else if (whereTo === 'muscle_groups') {
			go = '/musclegroups';
		}

		else if (whereTo === 'exercises') {
			go = '/exercises';
		}

		else if (whereTo === 'workouts') {
			go = '/workouts';
		}

		$location.path(go);
	};
}]);