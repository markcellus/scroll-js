module.exports = function(config) {
    config.set({
        files: [{ pattern: 'tests/**/*.ts', type: 'module' }],

        plugins: [
            require.resolve('@open-wc/karma-esm'),
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-coverage',
        ],
        esm: {
            nodeResolve: true,
            compatibility: 'all',
            fileExtensions: ['.ts'],
            babel: true,
        },
        coverageReporter: {
            includeAllSources: true,
            dir: '.coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' },
            ],
        },
        reporters: ['progress', 'coverage'],
        frameworks: ['esm', 'mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: true,
        singleRun: true,
        concurrency: Infinity,
    });
};
