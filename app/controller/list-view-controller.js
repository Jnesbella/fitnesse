var app = angular.module("Fitnesse.App");

app.constant('listModes', {
	read: 'read',
	edit: 'edit'
});

app.controller('listViewController', ['$scope', '$location', '$log', 'listModes', 'items', 'name', 'createPath', 'manager', 'read',
	function ($scope, $location, $log, listModes, items, name, createPath, manager, read) {

	$scope.mode = listModes.read;

	$scope.getItems = function() {
		return items;
	};

	$scope.getName = function() {
		return name;
	};

	$scope.editDone = function() {
		if ($scope.mode === listModes.read) {
			$scope.mode = listModes.edit;
		}
		
		else {
			$scope.mode = listModes.read;
		}
	};

	$scope.create = function() {
		$location.path(createPath);
	};

	$scope.getItemsLength = function() {
		var length = 0;

		if ($scope.getItems()) {
			for (var prop in $scope.getItems()) {
				length++;
			}
		}

		return length;
	};

	$scope.slay = function(item) {
		manager.slay(item);
		items = manager.get();
	};

	$scope.back = function() {
		$location.path('/');
	};

	$scope.read = function(id) {
		$location.path(read + id);
	};
}])