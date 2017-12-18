require('mocha');
var assert = require('chai').assert,
    Tree = require('avl'),
    utils = require('../src/geometry/geometry'),
    findIntersections = require('../index'),
    segments = [
        [[0, 0], [1, 1]],
        [[0, 5], [5, 1]],
        [[0, -1], [5, 2]]
    ];

describe('test segments order', function() {

    it('should change segments order', () => {

        var segments = [
            [[0, 1], [3, 1]],
            [[2, 0], [2, 2]]
        ]

        console.log(findIntersections(segments));

    });
});
