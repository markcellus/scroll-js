module.exports = {
    build: {
        files: {
            'dist/scroll.js': ['src/scroll.js']
        },
        browserifyOptions: {
            standalone: 'Scroll',
            transform: [
                [
                    "babelify",
                    {
                        "plugins": [
                            ["add-module-exports"]
                        ]
                    }
                ]
            ]
        },
        minifyFiles:{
            'dist/scroll-min.js': ['dist/scroll.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            files: ['tests/*.js']
        }
    }
};
