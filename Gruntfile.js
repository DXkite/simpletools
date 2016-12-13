module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dxproject: {
                src: ['src/dxui.js', 'src/libs/*.js', 'src/modules/*.js'],
                dest: 'build/<%= pkg.name %>.js'
            },
            css: {
                options: {
                    banner: '/*! <%= pkg.name %>.css by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: ['src/css/*.css'],
                dest: 'build/css/<%= pkg.name %>.css'
            }
        },
        cssmin: {
            mincss: {
                files: {
                    'build/css/<%= pkg.name %>.min.css': ['build/css/<%= pkg.name %>.css']
                },
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            },
            buildModules: {
                expand: true,
                cwd: 'src/modules',
                src: '**/*.js',
                dest: 'build/modules'
            },
            beautify: {
                options: {
                    banner: '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    beautify: true,
                    report: 'none',
                    mangle: false,
                },
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.js'
            }

        },
        copy: {
            image: {
                expand: true,
                cwd: 'src',
                src: ['image/**'],
                dest: 'build/',
                filter: 'isFile',
            },
            font: {
                expand: true,
                cwd: 'src',
                src: ['font/**'],
                dest: 'build/',
                filter: 'isFile'
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'cssmin', 'uglify', 'copy']);

};