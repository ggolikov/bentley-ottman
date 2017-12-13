require('mocha');
var assert = require('chai').assert,
    Tree = require('avl'),
    utils = require('../src/geometry/geometry'),
    findIntersections = require('../src/sweepline'),
    segments = [
        [[0, 0], [10, 0]],
        [[0, 0], [5, 5]],
        // [[5, 0], [5, 10]],
        // [[1, 1], [3, 7]],
        [[1, 1], [10, 0]]
    ];

describe('test points loading', function() {

    it('shoud not insert duplicate points', () => {
        var queue = findIntersections(segments);
        console.log(queue);
        assert.equal(queue.length, 4, 'no doubles');
    });
});
