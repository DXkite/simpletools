module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta:{
            banner: '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */',
            sortName: 'snow',
        },
        watch: {
            css: {
                files: 'src/**/*.scss',
                tasks: ['sass', 'autoprefixer', 'cssmin', 'copy:test']
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['babel', 'browserify', 'uglify', 'clean:tmp', 'copy:test']
            }
        },
        clean: {
            dest: 'dest',
            simple: 'test/<%= meta.sortName %>',
            tmp: 'src/.babel_tmp'
        },
        copy: {
            files: {
                expand: true,
                cwd: 'src/font',
                src: '**',
                dest: 'dest/font',
                filter: 'isFile'
            },
            test: {
                expand: true,
                cwd: 'dest',
                src: '**',
                dest: 'test/<%= meta.sortName %>',
                filter: 'isFile'
            },
        },
        autoprefixer: {
            dist: {
                files: {
                    'dest/<%= pkg.name %>.css': 'dest/<%= pkg.name %>.css'
                }
            }
        },
        sass: {
            options: {
                sourcemap: true,
            },
            dist: {
                files: {
                    'dest/<%= pkg.name %>.css': 'src/index.scss'
                }
            }
        },
        cssmin: {
            mincss: {
                files: {
                    'dest/<%= pkg.name %>.min.css': ['dest/<%= pkg.name %>.css'],
                },
            },
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ['babel-preset-env']
            },
            dest: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'src/.babel_tmp'
                }]
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: true,
                    comments: false,
                    banner: '<%= meta.banner %>',
                    sourceMap: 'dest/<%= pkg.name %>.min.js.map',
                },
                src: 'dest/<%= pkg.name %>.js',
                dest: 'dest/<%= pkg.name %>.min.js',
            }
        },
        browserify: {
            options: {
                banner: '<%= meta.banner %>',
            },
            main: {
                src: 'src/.babel_tmp/index.js',
                dest: 'dest/<%= pkg.name %>.js'
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'dest/**/*.css',
                        'dest/**/*.js',
                        'test/**/*.js',
                        'test/**/*.css',
                        'test/**/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    port: 8888,
                    server: './test',
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['clean', 'sass', /*'concat', */ 'autoprefixer', 'cssmin', 'babel', 'browserify', 'uglify', 'clean:tmp', 'copy']);
    grunt.registerTask('watcher', ['browserSync', 'watch']);
};