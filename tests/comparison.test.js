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
            [[37.532279074148235,55.805981592111884],[37.64098701400218,55.70648655604701]],
            [[37.565505169406585,55.71366864747661],[37.68419324052014,55.80127797612775]],
            [[37.609906886866035,55.73133494107268],[37.64244586242978,55.73807737662369]]
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
