var app = angular.module("Fitnesse.App");

app.service('sessionManager', ['$controller', function ($controller) {
	
	var self = this;

	angular.extend(self, $controller('generalManager', { $scope: self, name: 'session' }));

	/*
	 * get the list of records organized as a map
	 * each key is the ID of an exercise
	 */
	self.getRecordsByExercise = function () {

	};

	// id: the id of the exercise in question
	self.getRecordsForExercise = function (id) {

	};

	self.getElapsedTime = function () {

	};

	return self;
}]);