var app = angular.module("Fitnesse.App");

app.controller('sessionDividerController', ['$scope', function($scope) {

}]);

app.directive('sessionDivider', [function() {
	return {
		restrict: 'E', 
		replace: true,
		scope: {
			label: '@'
		},
		templateUrl: 'view/session-divider.html'
	};
}]);