module.exports = {
    build: {
        files: {
            'dist/scroll.js': ['src/scroll.js']
        },
        browserifyOptions: {
            standalone: 'Scroll'
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
