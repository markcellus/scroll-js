define([
    'sinon',
    'qunit',
    'src/scroll'
], function(
    Sinon,
    QUnit,
    Scroll
){
    "use strict";

    QUnit.module('Scroll Tests');

    QUnit.test('initialization', function() {
        QUnit.expect(1);
        var el = document.createElement('div');
        el.scrollTop = 300;
        var scroll = new Scroll({
            el: el
        });
        scroll.to(0, 200);
        QUnit.equal(el.scrollTop, 300, 'calling scroll.to() with 300 as y-coord changes element\'s scrollTop to 300');
    });

});