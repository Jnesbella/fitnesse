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

	var templates = new (function () {

		this.duration = {
			type: '', // seconds | reps
			value: 0
		};

		this.measure = {
			colors: [], // colors from the list
			weight: {
				unit: '', // lbs | kgs
				value: 0
			}
		};

		this.equipment = {
			id: '',
			name: '',
			value: '',
			measure: '' // if applicable
		};

		this.muscleGroup = {
			id: '',
			name: '',
			value: ''
		};

		this.exercise = {
			id: '',
			name: '',
			description: '',
			muscleGroups: [], // list of IDs
			equipment: [] // list of IDs
		};

		this.workout = {
			id: '',
			name: '',
			description: '',
			exercises: [] // a list of exercise IDs
			// have helper method to return all targeted muscle groups
			// have helper method to return all required equipment
			// stats for average completion time
		};

		this.action = { // interface | actions that can occur during a session
			id: '',
			type: '',
			timestamp: '', // immutable
			session: '' // the id of the session this action is associate with
		};

		this.startAction = angular.extend({}, this.action, {
			type: 'START'
		});

		this.endAction = angular.extend({}, this.action, {
			type: 'END'
		});

		this.logAction = angular.extend({}, this.action, {
			type: 'LOG',
			record: '' // the id of the record associated with this aciton
		});

		this.timerAction = angular.extend({}, this.action, {
			type: 'TIMER',
			seconds: 0 // amount of time in seconds the timer ran for
		});

		this.session = {
			id: '',
			workout: '', // the id for the workout this session references
			actions: []
			// have a helper method to get records for exercise
			// helper method to get ellapsed time
			// method to get the start of the session
			// method to get the end of the session
		};

		this.record = { // noun
			id: '',
			exercise: '', // id of the exercise this record is for
			measure: '', // a measure object
			duration: '' // a duration object
		};
	})();

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