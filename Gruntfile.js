module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dxproject: {
                src: ['js/init.js','js/*.js'],
                dest: 'build/<%= pkg.name %>.js'
            },
            css: {
                options: {
                    banner: '/*! <%= pkg.name %>.css by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: ['css/*.css'],
                dest: 'build/<%= pkg.name %>.css'
            }
        },
        cssmin: {
            mincss: {
                files: {
                    'build/<%= pkg.name %>.min.css': ['build/<%= pkg.name %>.css']
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
            beautify: {
                options: {
                    banner: '/*! <%= pkg.name %> by <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    beautify: true,
                    report: 'none',
                    mangle: false,
                },
                src: 'build/<%= pkg.name %>.js',
                dest: '<%= pkg.name %>.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat', 'cssmin', 'uglify']);

};