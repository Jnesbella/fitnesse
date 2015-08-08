var app = angular.module("Fitnesse.App");

app.service('equipmentManager', ['$controller', function ($controller) {
	
	var self = this;

	angular.extend(self, $controller('generalManager', { $scope: self, name: 'equipment' }));

	return self;
}]);