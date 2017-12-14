require('mocha');
var assert = require('chai').assert,
    Tree = require('avl'),
    utils = require('../src/geometry/geometry'),
    sl = require('../src/sweepline'),
    segments = [
        [[0, 0], [10, 0]],
        // [[-5, 5], [0, 0]],
        [[0, -5], [0, 10]],
        // [[1, 1], [3, 7]],
        // [[1, 1], [10, 0]]
    ];

describe('test points loading', function() {

    it('shoud not insert duplicate points', () => {
        var points = sl.findIntersections(segments),
            status = new Tree(utils.compareSegments),
            output = new Tree(utils.comparePoints);

        segments.forEach(function (segment) {
            status.insert(segment, segment);
        })

        points.forEach(function (point) {
            sl.handleEventPoint(point, status, output);
        })
        console.log(output.keys());

        assert.equal(status.keys().length, 0, 'zero');
    });
});
