require('mocha');
var assert = require('chai').assert,
    Tree = require('avl'),
    data = require('../demo/data'),
    utils = require('../src/utils');

    function getY(segment, x) {
        var x1 = segment[0][0],
            y1 = segment[0][1],
            x2 = segment[1][0],
            y2 = segment[1][1];

        // если отрезок вертикален,
        // вернем просто y правого конца
        if (Math.abs(x2 - x1) < EPS) {
            return y1;
        }
        // в остальных случаях
        // берем пропорцию
        return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
    }


describe('comparison test', function() {

    it('should compare segments', () => {
        var data = [
            [[37.5152069300591,55.80450887065186],[37.72827167009467,55.68271878960951]],
            [[37.527464249137815,55.77023348261655],[37.52840634669059,55.84486000512404]]
        ];

        // for (var i = 0; i < data.length; i++) {
        //     var s1 = data[i];
        //     for (var j = 1; j < data.length; j++) {
        //         if (i !== j) {
        //             var s2 = data[j];
        //             console.log('test ' + i + ' ' + j + ': ' + utils.compareSegments(s1, s2));
        //             console.log('switch delimiter');
        //             console.log('test ' + j + ' ' + i + ': ' + utils.compareSegments(s2, s1));
        //             console.log('--- --- ---');
        //         }
        //     }
        // }

        console.log('test ' + 0 + ' ' + 1 + ': ' + utils.compareSegments.call({x: 37.519081707733754}, data[0], data[1]));
        console.log('test ' + 1 + ' ' + 0 + ': ' + utils.compareSegments.call({x: 37.519081707733754}, data[1], data[0]));
        console.log('rev');
        console.log('test ' + 0 + ' ' + 1 + ': ' + utils.compareSegments.call({x: 37.64850691178445}, data[0], data[1]));
        console.log('test ' + 1 + ' ' + 0 + ': ' + utils.compareSegments.call({x: 37.64850691178445}, data[1], data[0]));

        // assert.strictEqual(utils.compareSegments(data[1], data[2]) === (utils.compareSegments(data[2], data[1])));
    });
});
