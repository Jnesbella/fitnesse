var app = angular.module("Fitnesse.App");

app.service('muscleGroupManager', ['$controller', function ($controller) {
	
	var self = this;

	angular.extend(self, $controller('generalManager', { $scope: self, name: 'muscleGroup' }));

	return self;
}]);