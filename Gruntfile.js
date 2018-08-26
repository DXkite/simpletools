module.exports = function (grunt) {
    let simpleBanner = '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: 'src/**/*.css',
                tasks: ['concat:css', 'autoprefixer', 'cssmin']
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['babel', 'browserify', 'uglify','clean:tmp', 'copy:test']
            }
        },
        clean: {
            dest: 'dest',
            simple: 'test/simple',
            tmp: 'src/.babel_tmp'
        },
        copy: {
            files: {
                expand: true,
                cwd: 'src/assets',
                src: '**',
                dest: 'dest/assets',
                filter: 'isFile'
            },
            test: {
                expand: true,
                cwd: 'dest',
                src: '**',
                dest: 'test/simple',
                filter: 'isFile'
            },
        },
        concat: {
            css: {
                options: {
                    banner: simpleBanner
                },
                src: ['src/**/*.css'],
                dest: 'dest/<%= pkg.name %>.css'
            }
        },
        autoprefixer: {
            dist: {
                files: {
                    'dest/<%= pkg.name %>.css': 'dest/<%= pkg.name %>.css'
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
                    banner: simpleBanner,
                    sourceMap: 'dest/<%= pkg.name %>.min.js.map',
                },
                src: 'dest/<%= pkg.name %>.js',
                dest: 'dest/<%= pkg.name %>.min.js',
            }
        },
        browserify: {
            options: {
                banner: simpleBanner,
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
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['clean', 'concat', 'autoprefixer', 'cssmin', 'babel', 'browserify', 'uglify' ,'clean:tmp', 'copy']);
    grunt.registerTask('watcher', ['browserSync', 'watch']);
};