module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bt: {
            dist: 'dist',
            build: {
                files: {
                    'dist/scroll.js': ['src/dist/scroll.js']
                },
                browserifyOptions: {
                    standalone: 'Scroll'
                }
            },
            min: {
                files: {
                    'dist/scroll-min.js': ['dist/scroll.js']
                }
            },
            tests: {
                qunit: {
                    src: ['tests/*.js']
                }
            }
        }
    });

    require("load-grunt-tasks")(grunt);
};