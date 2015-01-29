module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ['dist'],
        connect: {
            test: {
                options: {
                    hostname: 'localhost',
                    port: 7000
                }
            },
            local: {
                options: {
                    keepalive: true
                }
            }
        }
    });

    // Load grunt tasks from node modules
    require( "load-grunt-tasks" )( grunt, {
        loadGruntTasks: {
            pattern: 'grunt-*'
        }
    } );

    grunt.registerTask( "server", [
        "connect:local"
    ]);
};