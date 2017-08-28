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
            [[37.573850666206845,55.733049357587916],[37.71254633731574,55.71737798207887]],
            [[37.52991345453246,55.7377427557047],[37.71581778491546,55.70607951744868]],
            [[37.59753404107039,55.68475142082826],[37.652072626817116,55.804224244933856]]
        ];

        for (var i = 0; i < data.length; i++) {
            var s1 = data[i];
            for (var j = 1; j < data.length; j++) {
                if (i !== j) {
                    var s2 = data[j];
                    console.log('test ' + i + ' ' + j + ': ' + utils.compareSegments(s1, s2));
                    console.log('switch delimiter');
                    console.log('test ' + j + ' ' + i + ': ' + utils.compareSegments(s2, s1));
                    console.log('--- --- ---');
                }
            }
        }
        // assert.strictEqual(utils.compareSegments(data[1], data[2]) === (utils.compareSegments(data[2], data[1])));
    });
});
