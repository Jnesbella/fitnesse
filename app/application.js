/* bower transclusions */
include "../bower_components/angular/angular.min.js"
include "../bower_components/angular-route/angular-route.min.js"
include "../bower_components/angular-sanitize/angular-sanitize.min.js"
include "../bower_components/angular-cookies/angular-cookies.min.js"
include "../bower_components/angular-bootstrap/ui-bootstrap.min.js"
include "../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"
include "../bower_components/angular-touch/angular-touch.min.js"

// fitnesse business logic
//include "/js/fitnesse.js"

/* app module declaration */
var app = angular.module("Fitnesse.App", [
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'ui.bootstrap',
  'ngTouch'
]);

var getMuscleGroupById = ['$route', 'muscleGroupManager', function ($route, muscleGroupManager) {
  var muscleGroup = {};
  var muscleGroups = muscleGroupManager.get();
  var id = $route.current.params.id;

  if (muscleGroups[id]) {
    muscleGroup = muscleGroups[id];
  }

  return muscleGroup;
}];

var getEquipmentById = ['$route', 'equipmentManager', function ($route, equipmentManager) {
  var equipment = {};
  var _equipment = equipmentManager.get();
  var id = $route.current.params.id;

  if (_equipment[id]) {
    equipment = _equipment[id];
  }

  return equipment;
}];

var getExerciseById = ['$route', 'exerciseManager', function ($route, exerciseManager) {
  var exercise = {};
  var exercises = exerciseManager.get();
  var id = $route.current.params.id;

  if (exercises[id]) {
    exercise = exercises[id];
  }

  return exercise;
}];

var getWorkoutById = ['$route', 'workoutManager', function ($route, workoutManager) {
  var workout = {};
  var workouts = workoutManager.get();
  var id = $route.current.params.id;

  if (workouts[id]) {
    workout = workouts[id];
  }

  return workout;
}];

/* configuration and running */
app.config(['$httpProvider', '$logProvider', '$routeProvider',
  function ($httpProvider, $logProvider, $routeProvider) {
  
  $routeProvider
    .when("/", {
      templateUrl: '/view/home.html',
      controller: 'homeController',
      title: 'Home'
    })
    .when("/workout/player/:id", {
      templateUrl: '/view/workout-player.html',
      controller: 'workoutPlayerController',
      title: 'Workout Player',
      resolve: {
        workout: getWorkoutById
      }
    })
    .when("/workouts", {
      templateUrl: '/view/list-view.html',
      controller: 'listViewController',
      title: 'Workouts',
      resolve: {
        items: ['workoutManager', function (workoutManager) {
          return workoutManager.get();
        }],
        name: function () {
          return 'workouts';
        },
        createPath: function () {
          return '/workout/new';
        },
        manager: ['workoutManager', function (workoutManager) {
          return workoutManager;
        }],
        read: function () {
          return '/workout/';
        }
      }
    })
    .when("/workout/new", {
      templateUrl: '/view/workout-edit.html',
      controller: 'workoutEditController',
      title: 'Workout New',
      resolve: {
        workout: function() {
          return undefined;
        }
      }
    })
    .when("/workout/:id", {
      templateUrl: '/view/workout-edit.html',
      controller: 'workoutEditController',
      title: 'Workout View',
      resolve: {
        workout: getWorkoutById
      }
    })
    .when("/exercises", {
      templateUrl: '/view/list-view.html',
      controller: 'listViewController',
      title: 'Exercises',
      resolve: {
        items: ['exerciseManager', function (exerciseManager) {
          return exerciseManager.get();
        }],
        name: function () {
          return 'exercises';
        },
        createPath: function () {
          return '/exercise/new';
        },
        manager: ['exerciseManager', function (exerciseManager) {
          return exerciseManager;
        }],
        read: function () {
          return '/exercise/';
        }
      }
    })
    .when("/exercise/new", {
      templateUrl: '/view/exercise-edit.html',
      controller: 'exerciseEditController',
      title: 'Exercise New',
      resolve: {
        exercise: function() {
          return undefined;
        }
      }
    })
    /*.when("/exercise/edit/:id", {
      templateUrl: '/view/exercise-edit.html',
      controller: 'exerciseEditController',
      title: 'Exercise Edit',
      resolve: {
        exercise: getExerciseById
      }
    })*/
    .when("/exercise/:id", {
      templateUrl: '/view/exercise-edit.html',
      controller: 'exerciseEditController',
      title: 'Exercise View',
      resolve: {
        exercise: getExerciseById,
        redirectTo: function () {
          return '/exercises';
        }
      }
    })
    .when("/equipment", {
      templateUrl: '/view/list-view.html',
      controller: 'listViewController',
      title: 'Equipment',
      resolve: {
        items: ['equipmentManager', function (equipmentManager) {
          return equipmentManager.get();
        }],
        name: function () {
          return 'equipment';
        },
        createPath: function () {
          return '/equipment/new';
        },
        manager: ['equipmentManager', function (equipmentManager) {
          return equipmentManager;
        }],
        read: function () {
          return '/equipment/'
        }
      }
    })
    .when("/equipment/new", {
      templateUrl: '/view/enum-edit.html',
      controller: 'enumEditController',
      title: 'Equipment New',
      resolve: {
        item: function () {
          return undefined;
        },
        manager: ['equipmentManager', function (equipmentManager) {
          return equipmentManager;
        }],
        redirectTo: function () {
          return '/equipment';
        },
        name: function () {
          return 'equipment';
        }
      }
    })
    .when("/equipment/:id", {
      templateUrl: '/view/enum-edit.html',
      controller: 'enumEditController',
      title: 'Equipment View',
      resolve: {
        item: getEquipmentById,
        manager: ['equipmentManager', function (equipmentManager) {
          return equipmentManager;
        }],
        redirectTo: function () {
          return '/equipment';
        },
        name: function () {
          return 'equipment';
        }
      }
    })
    .when("/musclegroups", {
      templateUrl: '/view/list-view.html',
      controller: 'listViewController',
      title: 'Muscle Groups',
      resolve: {
        items: ['muscleGroupManager', function (muscleGroupManager) {
          return muscleGroupManager.get();
        }],
        name: function () {
          return 'muscle groups';
        },
        createPath: function () {
          return '/musclegroup/new';
        },
        manager: ['muscleGroupManager', function (muscleGroupManager) {
          return muscleGroupManager;
        }],
        read: function () {
          return '/musclegroup/'
        }
      }
    })
    .when("/musclegroup/new", {
      templateUrl: '/view/enum-edit.html',
      controller: 'enumEditController',
      title: 'Equipment New',
      resolve: {
        item: function () {
          return undefined;
        },
        manager: ['muscleGroupManager', function (muscleGroupManager) {
          return muscleGroupManager;
        }],
        redirectTo: function () {
          return '/musclegroups';
        },
        name: function () {
          return 'muscle group';
        }
      }
    })
    .when("/musclegroup/edit/:id", {
      templateUrl: '/view/enum-edit.html',
      controller: 'enumEditController',
      title: 'Equipment Edit',
      resolve: {
        item: getMuscleGroupById,
        manager: ['muscleGroupManager', function (muscleGroupManager) {
          return muscleGroupManager;
        }],
        redirectTo: function () {
          return '/musclegroups';
        },
        name: function () {
          return 'muscle group';
        }
      }
    })
    .when("/musclegroup/:id", {
      templateUrl: '/view/enum-edit.html',
      controller: 'enumEditController',
      title: 'Muscle Group View',
      resolve: {
        item: getMuscleGroupById,
        manager: ['muscleGroupManager', function (muscleGroupManager) {
          return muscleGroupManager;
        }],
        redirectTo: function () {
          return '/musclegroups';
        },
        name: function () {
          return 'muscle group';
        }
      }
    });

  /*$rootScope.$on('$locationChangeStart', function (event) {
    $log.log('pause');
  });

  $rootScope.$on('$locationChangeSuccess', function (event) {
    $log.log('pause');
  });*/
}]);

app.run(['$location', '$log', '$rootScope', 'dataManager',
  function ($location, $log, $rootScope, dataManager) {

  dataManager.init();
}]);

// angular parts
include "constants.js"

// angular controllers
include "controller/workout-player-controller.js"
include "controller/exercise-edit-controller.js"
include "controller/enum-edit-controller.js"
include "controller/home-controller.js"
include "controller/list-view-controller.js"
include "controller/workout-edit-controller.js"

// angular services
include "service/exercise-manager.js"
include "service/equipment-manager.js"
include "service/muscle-group-manager.js"
include "service/data-manager.js"
include "service/workout-manager.js"
include "service/local-storage.js"
include "service/session-manager.js"

// angular directives
include "directive/fitnesse-record.js"
include "directive/session-divider.js"
include "directive/fitnesse-recorder.js"
include "directive/add-exercise-modal.js"

