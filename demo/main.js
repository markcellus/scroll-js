var currentY = window.pageYOffset;
var i = 0;
var timer;

var scroll = new Scroll();

scroll.to(0, 2000, 1000, 'easeInOutCubic', function () {
    console.log('finished!');
});



