let transform = [
    [
        "babelify",
        {
            "presets": [
                "es2015"
            ],
            "plugins": [
                "add-module-exports" // to ensure dist files are exported without the "default" property
            ]
        }
    ]
];

module.exports = {
    build: {
        files: {
            'dist/scroll.js': ['src/scroll.js']
        },
        browserifyOptions: {
            standalone: 'Scroll',
            transform
        },
        minifyFiles:{
            'dist/scroll-min.js': ['dist/scroll.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            files: ['tests/*.js'],
            transform
        }
    }
};
