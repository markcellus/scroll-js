module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bt: {
            dist: 'dist',
            uglify: {
                files: {
                    'dist/scroll-min.js': ['dist/scroll.js']
                }
            },
            browserify: {
                files: {
                    'dist/scroll.js': ['src/dist/scroll.js']
                },
                options: {
                    browserifyOptions: {
                        standalone: 'Scroll'
                    }

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