module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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
            tests: {
                mocha: {
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