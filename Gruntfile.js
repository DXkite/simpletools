module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dxproject: {
                src: ['src/dxui.js', 'src/libs/*.js', 'src/modules/*.js'],
                dest: 'dxui/<%= pkg.name %>.js'
            },
            css: {
                options: {
                    banner: '/*! <%= pkg.name %>.css by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: ['src/css/*.css'],
                dest: 'dxui/css/<%= pkg.name %>.css'
            }
        },
        autoprefixer: {
            dist: {
                files: {
                    'dxui/css/<%= pkg.name %>.css': 'dxui/css/<%= pkg.name %>.css',
                     // 测试用CSS
                    'test/test.css': 'test/test.css',
                }
            }
        },
        cssmin: {
            mincss: {
                files: {
                    'dxui/css/<%= pkg.name %>.min.css': ['dxui/css/<%= pkg.name %>.css'],
                },
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dxui/<%= pkg.name %>.js',
                dest: 'dxui/<%= pkg.name %>.min.js'
            },
            buildModules: {
                expand: true,
                cwd: 'src/modules',
                src: '**/*.js',
                dest: 'dxui/modules'
            },
            beautify: {
                options: {
                    banner: '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    beautify: true,
                    report: 'none',
                    mangle: false,
                },
                src: 'dxui/<%= pkg.name %>.js',
                dest: 'dxui/<%= pkg.name %>.beautiful.js'
            }

        },
        copy: {
            image: {
                expand: true,
                cwd: 'src',
                src: ['image/**'],
                dest: 'dxui/',
                filter: 'isFile',
            },
            font: {
                expand: true,
                cwd: 'src',
                src: ['font/**'],
                dest: 'dxui/',
                filter: 'isFile'
            },
            test: {
                expand: true,
                cwd: 'dxui',
                src: '**',
                dest: 'test/dxui/',
                filter: 'isFile'
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.registerTask('default', ['concat', 'autoprefixer', 'cssmin', 'uglify', 'copy']);

};