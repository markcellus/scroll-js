module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        bt: {

            dist: 'dist',
            build: {
                files: {
                    'dist/scroll.js': ['src/scroll.js'],
                    'dist/scroll-listener.js': ['src/scroll-listener.js']
                },
                browserifyOptions: {
                    standalone: 'Scroll'
                }
            },
            min: {
                files: {
                    'dist/scroll-min.js': ['dist/scroll.js'],
                    'dist/scroll-listener-min.js': ['dist/scroll-listener.js']
                }
            },
            banner: {
                files: ['dist/*']
            },
            tests: {
                mocha: {
                    src: ['tests/*.js']
                }
            }
        }
    });

    // Load grunt tasks from node modules
    require("load-grunt-tasks")(grunt, {pattern: ['build-tools', 'grunt-*']});
};