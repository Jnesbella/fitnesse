var app = angular.module('Fitnesse.App');

app.controller('generalManager', ['dataManager', '$scope', 'name', function (dataManager, $scope, name) {
	
	var self = this;

	self.create = function () {
		return dataManager.create(name)
	};

	self.get = function (id) {
		return dataManager.get(name, id);
	};

	self.save = function (item) {
		dataManager.save(name, item);
	};

	self.update = function (item) {
		dataManager.save(name, item);
	};

	self.slay = function (item) {
		dataManager.slay(name, item);
	};

	return self;
}]);

app.service('dataManager', ['$cookies', 'localStorage', function ($cookies, localStorage) {

	var self = this;

	var templates = {

		duration: {
			type: '', // seconds | reps
			value: 0
		},

		measure: {
			colors: [], // colors from the list
			weight: {
				unit: '', // lbs | kgs
				value: 0
			}
		},

		equipment: {
			id: '',
			name: '',
			value: '',
			measure: '' // if applicable
		},

		muscleGroup: {
			id: '',
			name: '',
			value: ''
		},

		exercise: {
			id: '',
			name: '',
			description: '',
			muscleGroups: [], // list of IDs
			equipment: [] // list of IDs
		},

		workout: {
			id: '',
			name: '',
			description: '',
			exercises: [] // a list of exercise IDs
			// have helper method to return all targeted muscle groups
			// have helper method to return all required equipment
			// stats for average completion time
		},

		session: {
			id: '',
			timestamp: '', // when the session was started
			workout: '', // the id for the workout this session references
			records: [] // a list of IDs that point to records associated with this
			// have a helper method to get records for exercise
			// helper method to get ellapsed time. difference between session start and last record
		},

		record: { // noun
			id: '',
			exercise: '', // id of the exercise this record is for
			timestamp: '', // when the record was recorded
			measure: '', // a measure object
			duration: '', // a duration object
			session: '' // ??? | optional | id of the session this record is associated with
		}
	};

	var data = {

		durations: {
			time: {
				seconds: 's',
				minutes: 'min',
				hours: 'hr'
			},
			reps: 'reps'
		},

		measures: {
			colors: {
				red: 'red',
				orange: 'orange',
				yellow: 'yellow',
				green: 'green',
				blue: 'blue',
				purple: 'purple'
			},
			weight: {
				pounds: 'lbs',
				kilograms: 'kgs'
			}
		}
	};

	var getId = function () {
		 var length = 8;
		 var timestamp = new Date();
		 
		 var getRandomInt = function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		 };
		 
		 var generate = function () {
			 var ts = timestamp.toString();
			 var parts = ts.split('').reverse();
			 var id = '';
			 
			 for (var i = 0; i < length; ++i) {
				var index = getRandomInt(0, parts.length - 1);
				id += parts[index];	 
			 }
			 
			 return id;
		 };

		 return generate();
	};

	// gets a unique ID for the 
	var getIdForData = function (name) {
		var id;

		do {
			id = getId();
		} while (data[name][id]);

		return id;
	};

	var load = function (name) {
		data[name] = localStorage.get(name);
		if (!data[name]) {
			data[name] = {};
			self.save(name);
		}
	};

	self.init = function () {
		load('equipment');
		load('muscleGroup');
		load('exercise');
		load('session');
		load('workout');
	};

	self.get = function (name, id) {
		var item = undefined;

		if (name && id) {
			if (data[name] && data[name][id]) {
				item = data[name][id];
			}
		}

		else if (name) {
			if (data[name]) {
				item = data[name];
			}
		}

		return item ? angular.copy(item) : item;
	};

	self.save = function (name, item) {
		if (name && data[name]) {
			if (item) {
				// id is stubbed out but it doesn't yet have one assigned
				if (!item.id) {
					item.id = getIdForData(name);
				}

				data[name][item.id] = angular.copy(item);
			}

			localStorage.put(name, data[name]);
			load(name);
		}
	};

	self.create = function (name) {
		return angular.copy(templates[name]);
	};

	self.slay = function (name, item) {
		if (name && item && item.id) {
			if (data[name] && data[name][item.id]) {
				data[name][item.id] = undefined;
				delete data[name][item.id];

				self.save(name);
			}
		}
	};

	return self;
}]);