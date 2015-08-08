var app = angular.module('Fitnesse.App');

app.service('localStorage', ['$window', function ($window) {

	var self = this;

	var storage = $window.localStorage;

	self.put = function (key, data) {
		storage.setItem(key, angular.toJson(data));
	};

	self.get = function (key) {
		return angular.fromJson(storage.getItem(key));
	};

	return self;
}]);