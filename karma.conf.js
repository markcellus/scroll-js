module.exports = function(config) {
    config.set({
        files: ['tests/**/*.js'],

        preprocessors: {
            'tests/**/*.js': ['rollup']
        },

        rollupPreprocessor: {
            output: {
                format: 'umd',
                sourcemap: 'inline'
            },
            plugins: [
                require('rollup-plugin-node-resolve')(),
                require('rollup-plugin-typescript')(),
                require('rollup-plugin-commonjs')()
            ]
        },
        reporters: ['progress'],
        frameworks: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: true,
        singleRun: true,
        concurrency: Infinity
    });
};