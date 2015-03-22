var Scroll = require('scroll');
var ScrollListener = require('scroll-listener');

var scroll = new Scroll({
    el: document.body
});
scroll.to(0, 2000, {duration: 1000, easing: 'easeInOutCubic'}).then(function () {
    console.log('finished!');
});

var listener = new ScrollListener({
    el: document.body.getElementsByClassName('pink')[0],
    onEnterView: function () {
        console.log('pink has entered!');
    },
    onExitView: function () {
        console.log('pink has EXITED!');
    }
});
