"use strict";

var fitnesse = {};

fitnesse.equipment = {};
fitnesse.muscleGroups = {};
fitnesse.exercises = {};
fitnesse.sessions = {};
fitnesse.workouts = {};

// self - object to copy properties to
// clazz - class to extend from
// args - arguments to pass to the clazz's constructor
fitnesse.extend = function(self, clazz, args) {
	if (self && fitnesse[clazz] && typeof fitnesse[clazz] === 'function') {
		fitnesse[clazz].apply(self, args);
		/*var impl;

		if (args) {

		}

		else {
			impl = fitnesse[clazz]();
		}

		if (impl) {
			for (var prop in impl) {
				self[prop] = impl[prop];
			}
		}*/
	}
};

// create an object with a unique id
fitnesse.Identifiable = function() {
	var self = this;

	var registerId = function(id) {
		fitnesse.Identifiable.createdIds[id] = true;
	};

	var isIdRegistered = function(id) {
		return fitnesse.Identifiable.createdIds[id];
	};

	var createId = function() {
		var timestamp = new Date().getUTCMilliseconds();
		return timestamp;
	};

	/*function Promise() {
		var self = this;

		var callback;

		self.resolve = function(data) {
			if (callback) {
				callback.apply(self, arguments);
			};
		};

		self.then = function(_callback) {
			callback = _callback;
		};

		return this;
	};*/

	var _createUniqueId = function(id, callback) {
		if (id && !isIdRegistered(id)) {
			registerId(id);
			callback(id);
		}

		else {
			if (id) {
				window.setTimeout(function () {
					var _callback = callback;
					_createUniqueId(createUniqueId(), _callback);
				}, 100);
			}

			else {
				_createUniqueId(createId(), callback);
			}	
		}			
	};

	// ids are created based of the current time
	// to ensure a truly unique id this function can't be run iteratively
	var createUniqueId = function(callback) {
		_createUniqueId(createId(), callback)	
	};

	var init = function() {
		if (!self.id) {
			createUniqueId(function (id) {
				self.id = id;
			});
		}

		else {
			registerId(self.id);
		}
	};
	init();

	return self;
};
fitnesse.Identifiable.createdIds = {};

fitnesse.Saveable = function(toExtend) {
	var self = this;

	var init = function() {
		self.toJSON = function() {
			return '';
		}

		self.fromJSON = function(str) {
			return {};
		};
	}

	return self;
};

fitnesse.FitnesseSet = function () {
	var self = this;

	var set = {};

	self.add = function(obj) {
		var added = !self.contains(obj);

		if (obj && obj.id) {
			set[obj.id] = obj;
		}

		return added;
	};

	self.remove = function(obj) {
		var removed = self.contains(obj);

		if (obj && obj.id) {
			delete set[obj.id];
		}

		return obj;
	};

	self.removeAll = function() {
		set = {};
	};

	self.getLength = function() {
		return self.asArray().length;
	};

	self.contains = function(obj) {
		var contained = false;

		if (obj && obj.id && set[obj.id]) {
			contained = true;
		}

		return contained;
	};

	self.asArray = function() {
		var arr = [];

		for (var key in set) {
			if (set[key]) {
				arr.push(set[key]);
			}
		}

		return arr;
	};

	return self;
};

fitnesse.Enumerable = function(_name, _value, _id) {
	var self = this;

	if (_id) {
		self.id = _id;
	}

	fitnesse.extend(self, 'Identifiable');
	fitnesse.extend(self, 'Saveable');

	self.name = _name;
	self.value = _value;

	self.toJSON = function() {
		var data = {
			id: self.id,
			name: self.name,
			value: self.value
		};

		return JSON.stringify(data);
	};

	return self;
};

fitnesse.Enumerable.fromJSON = function(json) {
	var data = JSON.parse(json);
	var temp = new fitnesse.Enumerable(data.name, data.value, data.id);

	return temp;
};

fitnesse.Equipment = function(name, value, id) {
	var self = this;
	fitnesse.extend(self, 'Enumerable', [name, value, id]);
	
	return self;
};

fitnesse.Equipment.fromJSON = function(json) {
	return fitnesse.Enumerable.fromJSON(json);
};

fitnesse.MuscleGroup = function(name, value, id) {
	var self = this;
	fitnesse.extend(self, 'Enumerable', [name, value, id]);

	return self;
};

fitnesse.MuscleGroup.fromJSON = function(json) {
	return fitnesse.Enumerable.fromJSON(json);
};

fitnesse.Exercise = function(_name, _id) {
	var self = this;

	if (_id) {
		self.id = _id;
	}

	fitnesse.extend(self, 'Identifiable');
	fitnesse.extend(self, 'Saveable');

	self.name = _name;
	self.directions;

	var equipment = new fitnesse.FitnesseSet();
	var muscleGroups = new fitnesse.FitnesseSet();

	self.addEquipment = function(_equipment) {
		equipment.add(_equipment);
	};

	self.removeEquipment = function(_equipment) {
		equipment.remove(_equipment);
	};

	self.getEquipment = function() {
		return equipment.asArray();
	};

	self.setEquipment = function(_equipment) {
		equipment.removeAll();
		for (var i = 0; i < _equipment.length; i++) {
			self.addEquipment(_equipment[i]);
		}
	};

	self.addMuscleGroup = function(muscleGroup) {
		muscleGroups.add(muscleGroup);
	};

	self.removeMuscleGroup = function(muscleGroup) {
		muscleGroups.remove(muscleGroup);
	};

	self.getMuscleGroups = function() {
		return muscleGroups.asArray();
	};

	self.setMuscleGroups = function(_muscleGroups) {
		muscleGroups.removeAll();
		for (var i = 0; i < _muscleGroups.length; i++) {
			self.addMuscleGroup(_muscleGroups[i]);
		}
	};

	self.toJSON = function() {
		var _equipment = [];
		var equipmentArr = self.getEquipment();
		for (var j = 0; j < equipmentArr.length; j++) {
			var id = equipmentArr[j].id;
			if (fitnesse.equipment[id]) {
				_equipment.push(id);
			}
		}

		var _muscleGroups = [];
		var muscleGroupsArr = self.getMuscleGroups();
		for (var i = 0; i < muscleGroupsArr.length; i++) {
			var id = muscleGroupsArr[i].id;
			if (fitnesse.muscleGroups[id]) {
				_muscleGroups.push(id);
			}
		}

		var data = {
			id: self.id,
			name: self.name,
			equipment: _equipment,
			muscleGroups: _muscleGroups
		};

		return JSON.stringify(data);
	};

	return self;
};

fitnesse.Exercise.fromJSON = function(json) {
	var data = JSON.parse(json);
	var temp = new fitnesse.Exercise(data.name, data.id);

	for (var i = 0; i < data.equipment.length; i++) {
		var equipmentId = data.equipment[i];
		var equipment = fitnesse.equipment[equipmentId];
		if (equipment) {
			temp.addEquipment(equipment);
		}
	}

	for (var j = 0; j < data.muscleGroups.length; j++) {
		var muscleGroupId = data.muscleGroups[j];
		var muscleGroup = fitnesse.muscleGroups[muscleGroupId];
		if (muscleGroup) {
			temp.addMuscleGroup(muscleGroup);
		}
	}

	return temp;
};

fitnesse.ExerciseLink = function(_exercise) {
	var self = this;
	fitnesse.extend(self, 'Identifiable');
	//fitnesse.extend(self, 'Saveable');

	self.exercise = _exercise;

	self.nextExerciseLink;
	self.previousExerciseLink;

	/*self.toJSON = function() {
		var data = {
			id: self.id,
			exercise: exercise.toJSON()
		};

		return JSON.stringify(data);
	};*/

	return self;
};

fitnesse.Workout = function(_name, _id) {
	var self = this;

	if (_id) {
		self.id = _id;
	}

	fitnesse.extend(self, 'Identifiable');
	fitnesse.extend(self, 'Saveable');

	self.name = _name;

	self.description;

	var exerciseLinks = new fitnesse.FitnesseSet();
	var start = undefined;

	self.getStart = function() {
		return start;
	};

	var setStart = function(exerciseLink) {
		start = exerciseLink;
		if (start) {
			start.previousExerciseLink = undefined;
		}
	};

	var createExerciseLink = function(exercise) {
		return new fitnesse.ExerciseLink(exercise);
	};

	var getLastLink = function() {
		var last = start;

		while (last && last.nextExerciseLink) {
			last = last.nextExerciseLink;
		}

		return last;
	}

	self.appendExercise = function(exercise) {
		var exerciseLink = createExerciseLink(exercise);
		appendExerciseLink(exerciseLink);
	};

	var appendExerciseLink = function(exerciseLink) {
		if (!exerciseLinks.contains(exerciseLink)) {
			exerciseLinks.add(exerciseLink);

			if (start) {
				var last = getLastLink();
				last.nextExerciseLink = exerciseLink;
				exerciseLink.previousExerciseLink = last;
			}
			
			else {
				setStart(exerciseLink);
			}
		}
	};

	self.removeExerciseLink = function(exerciseLink) {
		var removed = exerciseLinks.remove(exerciseLink);

		if (removed) {
			var previous = exerciseLink.previousExerciseLink;
			var next = exerciseLink.nextExerciseLink;

			exerciseLink.previousExerciseLink = undefined;
			exerciseLink.nextExerciseLink = undefined;

			if (previous && next) {
				//var previous = exerciseLink.previousExerciseLink;
				//var next = exerciseLink.nextExerciseLink;

				previous.nextExerciseLink = next;
				next.previousExerciseLink = previous;
			}

			else if (previous) {
				previous.nextExerciseLink = undefined;
			}

			else if (next) {
				setStart(next);
			}

			else {
				if (exerciseLinks.length() === 0) {
					setStart(undefined);
				}
			}
		}
	};

	// insert exerciseLink before beforeLink
	self.insertExerciseLink = function(exerciseLink, beforeLink) {
		if (exerciseLinks.contains(exerciseLink)) {
			self.removeExerciseLink(exerciseLink);
		}

		exerciseLinks.add(exerciseLink);

		if (beforeLink) {
			var beforePrevious = beforeLink.previousExerciseLink;

			if (beforePrevious) {
				beforePrevious.nextExerciseLink = exerciseLink;
				exerciseLink.previousExerciseLink = beforePrevious;
			}

			else {
				setStart(exerciseLink);
			}

			exerciseLink.nextExerciseLink = beforeLink;
			beforeLink.previousExerciseLink = exerciseLink;
		}

		else {
			appendExerciseLink(exerciseLink);
		}
	};

	// insert exerciseLink before beforeLink
	self.insertExercise = function(exercise, beforeLink) {
		if (exercise) {
			if (beforeLink) {
				var beforePrevious = beforeLink.previousExerciseLink;
				exerciseLink.previousExerciseLink = beforePrevious;
				if (beforePrevious) {
					beforePrevious.nextExerciseLink = exerciseLink;
				}

				exerciseLink
			}

			else {
				appendExercise(exerciseLink.exercise);
			}
		}
	};

	self.removeAllExerciseLinks = function () {
		//exerciseLinks.removeAll();
		//var start = undefined;

		var _exerciseLink = self.getStart();
		while (_exerciseLink && _exerciseLink.exercise) {
			self.removeExerciseLink(_exerciseLink);
			_exerciseLink = self.getStart();
		}
	};

	// I don't think this method should exhist here
	self.getExercises = function() {
		var exercises = [];

		var _exerciseLink = self.getStart();
		while (_exerciseLink && _exerciseLink.exercise) {
			exercises.push(_exerciseLink.exercise);
			_exerciseLink = _exerciseLink.nextExerciseLink;
		}

		return exercises;
	};

	self.getEquipment = function() {
		var equipment = new fitnesse.FitnesseSet();

		var exercises = self.getExercises();
		for (var i = 0; i < exercises.length; i++) {
			var exercise = exercises[i];
			var _equipment = exercise.getEquipment();
			for (var j = 0; j < _equipment.length; j++) {
				equipment.add(_equipment[j]);
			}
		}

		return equipment.asArray();
	};

	self.getMuscleGroups = function() {
		var muscleGroups = new fitnesse.FitnesseSet();

		var exercises = self.getExercises();
		for (var i = 0; i < exercises.length; i++) {
			var exercise = exercises[i];
			var _muscleGroups = exercise.getMuscleGroups();
			for (var j = 0; j < _muscleGroups.length; j++) {
				muscleGroups.add(_muscleGroups[j]);
			}
		}

		return muscleGroups.asArray()
	};

	self.toJSON = function() {
		var _exercisesIds = [];

		var _exercises = self.getExercises();
		for (var i = 0; i < _exercises.length; i++) {
			_exercisesIds.push(_exercises[i].id);
		}

		var data = {
			id: self.id,
			name: self.name,
			exercises: _exercisesIds
		};

		return JSON.stringify(data);
	};

	return self;
};

fitnesse.Workout.fromJSON = function(json) {
	var data = JSON.parse(json);

	var _workout = new fitnesse.Workout(data.name, data.id);

	for (var i = 0; i < data.exercises.length; i++) {
		var exerciseId = data.exercises[i];
		var exercise = fitnesse.exercises[exerciseId];
		if (exercise) {
			_workout.appendExercise(exercise);
		}
	}

	return _workout;
};

fitnesse.Session = function(_exercise, _timestamp) {
	var self = this;
	fitnesse.extend(self, 'Identifiable');
	fitnesse.extend(self, 'Saveable');

	self.toJson = function() {

	};

	self.fromJson = function() {

	};

	self.exerciseId = _exercise.id;
	self.timestamp = _timestamp;

	var records = new fitnesse.FitnesseSet();

	// add a record to the session
	self.addRecord = function(record) {
		records.add(record);
	};

	// remove the record from the session
	self.removeRecord = function(record) {
		records.remove(record);
	};

	self.getRecords = function() {
		return records.asArray();
	};

	return self;
};

fitnesse.Record = function(_weight, _weightLabel, _duration, _durationLabel, _note) {
	var self = this;
	fitnesse.extend(self, 'Identifiable');
	fitnesse.extend(self, 'Saveable');

	self.toJson = function() {
		var obj = {
			"id": self.id,
			"weight" : self.weight,
			"weight-label": self.weightLabel,
			"duration": self.duration,
			"duration-label": self.durationLabel,
			"note": self.note
		};

		return JSON.stringify(obj);
	}

	self.fromJson = function() {

	};

	self.weight = weight;
	self.weightLabel = _weightLabel;
	self.duration = _duration;
	self.durationLabel = _durationLabel;
	self.note = _note;

	return self;
};

fitnesse.WorkoutPlayer = function(_workout) {
	var self = this;

	var workout = _workout;
	var exerciseLink;
	var sessions = {};

	var timestamp;

	self.getWorkoutName = function() {
		return workout.name;
	};

	self.getActiveExercise = function() {
		return exerciseLink.exercise;
	};

	self.getNextExercise = function() {
		return exerciseLink.nextExerciseLink;
	};

	self.getPreviousExercise = function() {
		return exerciseLink.previousExerciseLink;
	};

	self.setTimestamp = function(_timestamp) {
		timestamp = _timestamp;
	};

	self.begin = function() {
		var timestamp = new Date().getUTCMilliseconds();
		self.setTimestamp(timestamp);

		exerciseLink = workout.getStart();
	};

	self.finish = function() {
		// save all the sessions
	};

	self.record = function(weight, weightLabel, duration, durationLabel, note) {
		if (exerciseLink) {
			var exercise = exerciseLink.exercise;

			if (!sessions[exercise.id]) {
				sessions[exercise.id] = new Session(exercise, timestamp);
			}

			var record = new Record(weight, weightLabel, duration, durationLabel, note);
			sessions[exercise.id].addRecord(record);
		}
	};

	var init = function() {
		self.begin();
	};
	init();

	return self;
};

fitnesse.AutoWorkoutPlayer = function() {
	var self = this;
	fitnesse.extend(self, 'WorkoutPlayer');

	return self;
};

//window.fitnesse = fitnesse;