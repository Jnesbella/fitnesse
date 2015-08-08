var app = angular.module("Fitnesse.App");

app.controller('fitnesseRecordController', ['$scope', function($scope) {

}]);

app.directive('fitnesseRecord', [function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			count: '@',
			weight: '@',
			reps: '@',
			note: '@'
		},
		templateUrl: '/view/fitnesse-record.html',
		controller: 'fitnesseRecordController'
	};
}]);