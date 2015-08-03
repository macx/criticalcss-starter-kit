'use strict';
/*jshint camelcase:false */

module.exports = function(grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      src: 'src',
      dist: 'dist',
      vendor: 'vendor'
    },

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %>\n' +
        ' */\n'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: ['Gruntfile.js']
    },

    sass: {
      build: {
        options: {
          outputStyle: 'compressed',
          sourceComments: 'none',
          sourceMap: false
        },
        files: {
          '<%= config.dist %>/assets/css/main.css': '<%= config.src %>/scss/main.scss'
        }
      },
    },

    clean: {
      assets: [
        '<%= config.dist %>/assets/css',
        '!<%= config.dist %>/assets/css/critical/**',
        '<%= config.dist %>/assets/js',
        '<%= config.dist %>/assets/fonts',
        '<%= config.dist %>/assets/img'
      ],
      critical: [
        '<%= config.dist %>/assets/css/critical',
      ]
    },

    copy: {
      images: {
        expand: true,
        cwd: '<%= config.src %>/assets/img/',
        src: ['**/*.{jpg,gif,png,svg}', '!_responsive/**/*'],
        dest: '<%= config.dist %>/assets/img/'
      },
      vendor: {
        files: {
          '<%= config.dist %>/assets/js/loadCss.min.js': ['vendor/loadCSS/loadCSS.js']
        }
      }
    },

    watch: {
      css: {
        files: ['<%= config.src %>/scss/**/*.scss'],
        tasks: ['sass', 'postcss:dist']
      }
    },

    php: {
      dist: {
        options: {
          hostname: '127.0.0.1',
          port: 9000,
          base: '<%= config.dist %>',
          keepalive: false,
          open: false,
          silent: true
        }
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '<%= config.dist %>/*.php',
            '<%= config.dist %>/assets/css/*.css',
            '<%= config.dist %>/assets/js/*.js'
          ]
        },
        options: {
          proxy: '<%= php.dist.options.hostname %>:<%= php.dist.options.port %>',
          watchTask: true,
          notify: true,
          open: true,
          logLevel: 'silent',
          ghostMode: {
            clicks: true,
            scroll: true,
            links: true,
            forms: true
          }
        }
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer-core')({
            browsers: ['last 2 version', 'ie 9']
          }),
          require('csswring')({
            removeAllComments: true
          })
        ]
      },
      dist: {
        src: '<%= config.dist %>/assets/css/*.css'
      },
      critical: {
        src: '<%= config.dist %>/assets/css/critical/*.css'
      }
    },

    criticalcss: {
      index: {
        options: {
          url: 'http://<%= php.dist.options.hostname %>:<%= php.dist.options.port %>',
          outputfile: '<%= config.dist %>/assets/css/critical/index.css',
          filename: '<%= config.dist %>/assets/css/main.css',
          width: 320,
          height: 480,
          buffer: 800*1024
        }
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'clean:assets',
    'sass',
    'postcss:dist',
    'copy'
  ]);

  grunt.registerTask('critical', [
    'clean:critical',
    'php',
    'criticalcss',
    'postcss:critical'
  ]);

  grunt.registerTask('dist', [
    'default',
    'critical'
  ]);

  grunt.registerTask('serve', [
    'default',
    'php',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('help', function() {
    var text = '\n' +
      'Run the following commands:\n\n' +
      '$ grunt        # Build package\n' +
      '$ grunt serve  # Build and Develop\n' +
      '$ grunt dist   # Build a production ready version\n\n'
    ;

    grunt.log.writeln(text);
  });
};
