var transforms = [
    [
        "babelify",
        {
            "presets": [
                "es2015"
            ]
        }
    ]
];

module.exports = {
    dist: 'dist',
    build: {
        files: {
            'dist/scroll.js': ['src/scroll.js']
        },
        browserifyOptions: {
            standalone: 'Scroll',
            transform: transforms
        },
        minifyFiles:{
            'dist/scroll-min.js': ['dist/scroll.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            src: ['tests/scroll-tests.js'],
        },
        browserifyOptions: {
            transform: transforms,
        },
    }
};
