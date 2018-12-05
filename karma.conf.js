const path = require('path');

module.exports = function(config) {
    config.set({
        files: ['src/**/*.ts', 'tests/**/*.js'],

        preprocessors: {
            'tests/**/*.js': ['rollup'],
            'src/**/*.ts': ['rollup', 'typescript', 'coverage']
        },
        plugins: [
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-rollup-preprocessor',
            'karma-typescript-preprocessor',
            'karma-coverage'
        ],
        rollupPreprocessor: {
            output: {
                format: 'umd', // we must output to UMD until karma-chrome-launcher supports 'esm'
                sourcemap: 'inline',
                name: 'scroll'
            },
            plugins: [
                require('rollup-plugin-node-resolve')(),
                require('rollup-plugin-typescript2')(),
                require('rollup-plugin-commonjs')()
            ]
        },
        typescriptPreprocessor: {
            options: {
                sourceMap: false,
                target: 'es6',
                module: 'esnext'
            }
        },
        coverageReporter: {
            includeAllSources: true,
            dir: '.coverage',
            reporters: [{ type: 'lcov', subdir: '.' }, { type: 'text-summary' }]
        },
        reporters: ['progress', 'coverage'],
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
