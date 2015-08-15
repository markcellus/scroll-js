var Scroll = require('scroll');

var scroll = new Scroll({
    el: document.body
});
scroll.to(0, 2000, {duration: 1000, easing: 'easeInOutCubic'}).then(function () {
    console.log('finished!');
});
