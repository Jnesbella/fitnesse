var app = angular.module("Fitnesse.App");

app.service('exerciseManager', ['$controller', function ($controller) {

	var self = this;

	angular.extend(self, $controller('generalManager', { $scope: self, name: 'exercise' }));

	return self;
}]);