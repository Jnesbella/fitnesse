var app = angular.module("Fitnesse.App");

app.controller('enumEditController', ['$scope', '$location', '$log', 'editModes', 'item', 'manager', 'redirectTo', 'name',
	function ($scope, $location, $log, editModes, item, manager, redirectTo, name) {

	$scope.data = {};

	$scope.getName = function () {
		return name;
	};

	$scope.getItem = function () {
		return item;
	};

	var redirect = function () {
		$location.path(redirectTo);
	};

	// the name of the equipment with all the spaces replaced with underscores
	var getValue = function (name) {
		var value = name.toLowerCase();
		value = value.trim();
		value = value.replace(/\s+/g, '_');

		return value;
	};

	$scope.save = function () {
		$scope.data.value = getValue($scope.data.name);
		manager.save($scope.data);

		if ($scope.mode === editModes.create) {
			redirect();
		}

		else if ($scope.mode === editModes.update) {
			item = $scope.data;
			init();
		}
	};

	$scope.edit = function () {
		$scope.mode = editModes.update;
	};

	$scope.cancel = function () {
		if ($scope.mode === editModes.update) {
			init();
		}

		else if ($scope.mode === editModes.create || $scope.mode === editModes.read) {
			redirect();
		}
	};

	$scope.isDirty = function () {
		return !angular.equals(item, $scope.data);
	};

	$scope.isValid = function () {
		return $scope.data.name && $scope.data.name.trim();
	};

	var init = function () {
		if (item && item.id) {
			$scope.mode = editModes.read;

			$scope.data = angular.copy(item);
		}

		else {
			$scope.mode = editModes.create;

			$scope.data = manager.create();
		}
	};
	init();
}]);