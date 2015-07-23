module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: "compressed"
                },
                files: [{
                        expand: true,
                        cwd: 'css',
                        src: ['*.scss'],
                        dest: 'css',
                        ext: '.css'
                      }]
            }
        },
        // uglify: {
        //     options: {

        //     },
        //     build: {
        //         files: {
        //             'js/pledge.min.js': 'js/pledge.js'
        //         }
        //     }
        // },
        watch: {
            css: {
                files: 'public/css/*.scss',
                tasks: ['sass']
            },
            html : {
                files: 'public/*.html'
            },
            // scripts : {
            //     files: 'js/pledge.js',
            //     tasks: ['uglify']
            // },
            options: {
                livereload: true
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', [ 'watch' ]);
    grunt.registerTask('styles', [ 'sass' ]);
};

