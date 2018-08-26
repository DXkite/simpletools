module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: 'src/**/*.css',
                tasks: ['concat:css', 'autoprefixer', 'cssmin']
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['concat:js', 'uglify']
            }
        },
        concat: {
            js: {
                options: {
                    banner: '/*! <%= pkg.name %>.js by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                src: ['src/*/*.js'],
                dest: 'dest/<%= pkg.name %>.js'
            },
            css: {
                options: {
                    banner: '/*! <%= pkg.name %>.css by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                src: ['src/*/*.css'],
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
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                src: 'dest/<%= pkg.name %>.js',
                dest: 'dest/<%= pkg.name %>.min.js'
            },
            beautify: {
                options: {
                    banner: '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                    beautify: true,
                    report: 'none',
                    mangle: false,
                },
                src: 'dest/<%= pkg.name %>.js',
                dest: 'dest/<%= pkg.name %>.beautiful.js'
            }
        },
        copy: {
            test: {
                expand: true,
                cwd: 'src',
                src: '*/**',
                dest: 'dest/',
                filter: 'isFile'
            }, 
            test: {
                expand: true,
                cwd:'dest',
                src: '**',
                dest: 'test/simple',
                filter: 'isFile'
            },
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
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.registerTask('default', ['browserSync', 'watch', 'concat', 'autoprefixer', 'cssmin', 'uglify', 'copy']);
};