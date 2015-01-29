var currentY = window.pageYOffset;
var i = 0;
var timer;

var scroll = new Scroll({
    el: document.body
});

scroll.to(0, 2000, {duration: 1000, easing: 'easeInOutCubic'}, function () {
    console.log('finished!');
});



