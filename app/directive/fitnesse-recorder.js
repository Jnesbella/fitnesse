var app = angular.module("Fitnesse.App");

app.controller('fitnesseRecorderController', ['$scope', '$timeout', function($scope, $timeout) {

	$scope.data = {
		log: {
			exercise: '',
			measure: {
				unit: '',
				value: 0
			},
			duration: {
				unit: '',
				value: 0
			},
			note: '',
			timestamp: Date.now()
		},
		date: {
			day: '',
			month: '',
			year: ''
		}
	};

	$scope.fullUI = true;
	$scope.toggleUI = function () {
		$scope.fullUI = !$scope.fullUI;
	};

	$scope.measureOptions = {
		lbs: {
			display: 'lbs',
			value: 'lbs'
		},
		kgs: {
			display: 'kgs',
			value: 'kgs'
		}
	};

	$scope.durationOptions = {
		reps: {
			display: 'reps',
			value: 'reps'
		},
		seconds: {
			display: 'seconds',
			value: 'seconds'
		}
	};

	var getLog = function () {
		return $scope.data.log;
	};

	var setLog = function (log) {
		if (angular.isDefined(log) &&
			angular.isDefined(log.exercise) &&
			angular.isDefined(log.measure) &&
			angular.isDefined(log.duration) &&
			angular.isDefined(log.note) &&
			angular.isDefined(log.timestamp)) {
			
			$scope.data.log = angular.copy(log);
		}
	};

	$scope.doCallback = function () {
		if ($scope.callback && typeof $scope.callback === 'function') {
			$scope.callback(getLog());
		}
	};

	var isValidDate = function () {
		// yyyy-mm-dd
		var dateString = $scope.data.date.year + '-' + $scope.data.date.month + '-' + $scope.data.date.day;
		
		var date = Date.parse(dateString)
		return isFinite(date) ? date : undefined;
	};

	$scope.setDate = function (timestamp) {
		if (timestamp) {
			$scope.data.log.timestamp = timestamp;
			var date = new Date($scope.data.log.timestamp);
			$scope.data.date.day = date.getDate();
			$scope.data.date.month = date.getMonth() + 1;// zero based
			$scope.data.date.year = date.getFullYear();
		}

		else {
			var validDate = isValidDate();

			if (validDate) {
				$scope.setDate(validDate);
			}

			else {
				$scope.setDate($scope.data.log.timestamp);
			}
		}
	};

	var init = function() {
		$scope.data.log.measure.unit = $scope.measureOptions.lbs.value;
		$scope.data.log.duration.unit = $scope.durationOptions.reps.value;

		$scope.setDate($scope.data.log.timestamp);

		$scope.data.log.exercise = $scope.exercises[0].id;

		$scope.$watch('log', function (newValue, oldValue) {
			setLog(newValue);
		});
	};
	init();
}]);

// pass in initial values for measure, duration, measureLabel, durationLabel, timestamp
app.directive('fitnesseRecorder', [function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			callback: '&',
			log: '=',
			durationUnit: '=',
			measureUnit: '=',
			exercises: '='
		},
		controller: 'fitnesseRecorderController',
		templateUrl: 'view/fitnesse-recorder.html'
	};
}]);