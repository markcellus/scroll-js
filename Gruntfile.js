module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bt: {
            dist: 'dist',
            build: {
                files: {
                    'dist/scroll.js': ['src/scroll.js']
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
        },
        browserify: {
            dist: {
                files: {
                    'demo/demo-built.js': ['demo/demo.js']
                },
                options: {
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        }
    });

    require("load-grunt-tasks")(grunt);
};