require('mocha');
var assert = require('chai').assert,
    Tree = require('avl'),
    data = require('../demo/data'),
    utils = require('../src/utils');

describe('comparison test', function() {

    it('should compare segments', () => {
        var data = [
            [[37.614796879097014,55.77136671879989],[37.6532084051303,55.77652834617445]],
            [[37.62640984440731,55.722094265965104],[37.64833014306549,55.770111577259016]],
            [[37.63078150145173,55.75287198641849],[37.64200173756859,55.73467884511657]]
        ];

        console.log(utils.compareSegments(data[0], data[1]));
        console.log(utils.compareSegments(data[1], data[0]));
        console.log('---');
        console.log(utils.compareSegments(data[0], data[2]));
        console.log(utils.compareSegments(data[2], data[0]));
        console.log('---');
        console.log(utils.compareSegments(data[1], data[2]));
        console.log(utils.compareSegments(data[2], data[1]));
        console.log('---intersection---');
        console.log(utils.findSegmentsIntersection(data[0], data[1]));
        console.log('---');
        console.log(utils.findSegmentsIntersection(data[0], data[2]));
        console.log('---');
        console.log(utils.findSegmentsIntersection(data[1], data[2]));
        console.log('---');

        assert.strictEqual(utils.compareSegments(data[0], data[1]) === (utils.compareSegments(data[1], data[0])));
        assert.strictEqual(utils.compareSegments(data[0], data[2]) === (utils.compareSegments(data[2], data[0])));
        assert.strictEqual(utils.compareSegments(data[1], data[2]) === (utils.compareSegments(data[2], data[1])));
    });
});
