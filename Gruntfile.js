module.exports = function (grunt) {

  grunt.initConfig({
    /**
     * Read package information from `package.json`.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Watch files for change and run corresponding (development) tasks.
     * Furthermore, start a local development server via the `connect` task.
     */
    watch: {
      tasks: ['jshint', 'includes', 'uglify:development', 'haml', 'sass:development', 'copy'],
      options: {
        atBegin: true,
        livereload: true,
        spawn: false
      },

      haml: {
        files: ['app/view/**/*.haml'],
        tasks: ['includes', 'haml']
      },
      css: {
        files: ['app/css/**/*.scss'],
        tasks: ['sass:development']
      },
      js: {
        files: ['app/**/*.js'],
        tasks: ['includes', 'uglify:development']
      },
      images: {
        files: ['app/img/**/*.{gif,jpg,png}'],
        tasks: ['copy']
      }
    },

    /**
     * Lint JavaScript files using jshint.
     */
    jshint: {
      all: ['Gruntfile.js']
    },

    /**
     * Transclude JS/HAML files using `include "filename.ext"`
     * in source files.
     */
    includes: {
      js: {
        files: {
          'build/tmp/app.js': 'app/application.js'
        }
      },
      app: {
        files: { 'build/tmp/view/application.html.haml': 'app/view/application.html.haml' }
      },
      templates: {
        expand: true,
        cwd: 'app/view/',
        src: ['**/*.html.haml'],
        dest: 'build/tmp/view/'
      }
    },

    /**
     * Concatenate and minify JS files.
     */
    uglify: {
      development: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          preserveComments: 'all'
        },
        files: {
          'build/app.js': 'build/tmp/app.js'
        }
      },
      production: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          preserveComments: false
        },
        files: {
          'build/app.js': 'build/tmp/app.js'
        }
      }
    },

    /**
     * Compile HAML templates into HTML.
     */
    haml: {
      app: {
        files: {
          'build/index.html': 'build/tmp/view/application.html.haml'
        }
      },
      templates: {
        expand: true,
        cwd: 'build/tmp/view/',
        src: ['**/*.html.haml'],
        dest: 'build/view/',
        ext: '.html'
      }
    },

    /**
     * Compile SASS into CSS.
     */
    sass: {
      options: {

      },
      development: {
        options: {
          style: 'expanded'
        },
        files: {
          'build/css/app.css': 'app/css/application.scss'
        }
      },
      production: {
        options: {
          style: 'compressed',
        },
        files: {
          'build/css/app.css': 'app/css/application.scss'
        }
      },
    },

    /**
     * Copy images and other static assets.
     */
    copy: {
      favicon: {
        files: {
          'build/img/fitnesse.ico': 'app/img/fitnesse.ico'
        }
      },
      images: {
        files: [{
          expand: true,
          cwd: 'app/img/',
          src: ['**/*.{gif,jpg,png,ico}'],
          dest: 'build/img/'
        }]
      },
      files: {
        files: [{
          expand: true,
          cwd: 'app/files/',
          src: ['**'],
          dest: 'build/files/'
        }]
      }
    },

    /**
     * Minify images.
     */
    imagemin: {
      production: {
        files: [{
          expand: true,
          cwd: 'build/img/',
          src: ['**/*.{gif,jpg,png}'],
          dest: 'build/img/'
        }]
      }
    },

    /**
     * Minify HTML.
     */
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      index: {
        files: {
          'build/index.html': 'build/index.html'
        }
      },
      templates: {
        files: [{
          expand: true,
          cwd: 'build/templates/',
          src: ['**/*.html'],
          dest: 'build/templates'
        }]
      }
    },

    /**
     * Clean up temporary files.
     */
    clean: ['build/tmp'],

    /**
     * Load a web server for the compiled files.
     */
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 8001,
          base: './build/',
          // keepalive: true
        }
      }
    },

    /* Karma + Jasmine for Unit Testing */
    karma: {
      unit: {
        configFile: 'test/karma.config.js'
      }
    }
  });


  // Load plugins that provide tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-haml2html');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Replace reference to static files with versioned versions...
  grunt.registerTask('version-assets', 'version the static assets just created', function () {
    var Version = require('node-version-assets');
    var versionInstance = new Version({
      assets: ['build/css/app.css', 'build/app.js'],
      grepFiles: ['build/index.html']
    });
    var cb = this.async();
    versionInstance.run(cb);
  });


  // Default task -- development.
  grunt.registerTask('default', [
      'jshint',
      'includes',
      'uglify:development',
      'haml',
      'sass:development',
      'copy',
      'clean'
  ]);

  // Local development (including server).
  grunt.registerTask('run', 'run watch and a web server', function () {
    grunt.task.run('connect', 'watch');
  });

  // Dev task.
  grunt.registerTask('dev', [
      'jshint',
      'includes',
      'uglify:development',
      'haml',
      'sass:development',
      'copy',
      'htmlmin',
      'clean',
      'version-assets'
  ]);

  // Staging task.
  grunt.registerTask('staging', [
      'jshint',
      'includes',
      'uglify:production',
      'haml',
      'sass:production',
      'copy',
      'imagemin',
      'htmlmin',
      'clean',
      'version-assets'
  ]);

  // Production task.
  grunt.registerTask('production', [
      'jshint',
      'includes',
      'uglify:production',
      'haml',
      'sass:production',
      'copy',
      'imagemin',
      'htmlmin',
      'clean',
      'version-assets'
  ]);
};
