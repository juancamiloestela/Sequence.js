module.exports = function(grunt) {

	require('time-grunt')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		dev: "src",

		prod: "dist",

		jshint: {
			all: [
				"Gruntfile.js",
				"<%= dev %>/src/**/*.js"
			]
		},

		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			dist: {
				src: [
					'<%= dev %>/src/sequence.js'
				],
				dest: '<%= dev %>/js/sequence.js'
			}
		},

		uglify: {
			options: {
				mangle: {
					except: ['jQuery']
				},
				sourceMap: true
			},
			my_target: {
				files: {
					'<%= dev %>/js/sequence.min.js': ['<%= dev %>/js/sequence.js']
				}
			}
		},

		notify: {
			task_name: {
				options: {
				// Task-specific options go here.
				}
			},
			watch: {
				options: {
					//title: '',
					message: 'Less and Uglify finished running', //required
				}
			}
		},

		clean: ['<%= prod %>'],

		copy: {
			main: {
				files: [
					// media
					{
						expand: true,
						cwd: '<%= dev %>/',
						src: [
							'css/**/*',
							'js/**/*'
						],
						dest: '<%= prod %>/'
					}
				]
			}
		},

		version: {
			options:{
				prefix: '(\\* |")?[Vv]ersion[\'"]?\\s*[:=]?\\s*[\'"]?'
			},
			defaults: {
				src: ['bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.less']
			},
			patch: {
				options: {
					release: 'patch'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.less']
			},
			minor:{
				options: {
					release: 'minor'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.less']
			},
			major:{
				options: {
					release: 'major'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.less']
			}
		},

		watch: {
			less: {
				files: ['<%= dev %>/less/**/*.less', '<%= dev %>/src/**/*.js'],
				tasks: ['default']
			}
		}
	});

	// Load project tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-newer');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'version:defaults', 'concat', 'uglify']);
	grunt.registerTask('build', ['version:patch', 'default', 'clean', 'copy:main']);
	grunt.registerTask('minor', ['build', 'version:minor']);
	grunt.registerTask('major', ['build', 'version:major']);
};