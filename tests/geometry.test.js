require('mocha');
var assert = require('chai').assert,
    utils = require('../src/geometry/geometry'),
    segments = [
        [[0, 0], [10, 0]],
        [[2, -1], [5, 5]],
        [[5, 0], [5, 10]],
        [[1, 1], [3, 7]],
    ];

// describe('segments intersection test', function() {
//
//     it('should find intersecting segments', () => {
//         assert.equal(utils.segmentsIntersect(segments[0], segments[1]), true, 'intersect');
//     });
//
//     it('should find touching segments', () => {
//         assert.equal(utils.segmentsIntersect(segments[0], segments[2]), true, 'touch intersect');
//     });
//
//     it('should find not-intersecting segments', () => {
//         assert.equal(utils.segmentsIntersect(segments[0], segments[3]), false, 'not intersect');
//     });
// });

// describe('sort non-intersecting segments', function() {
//
//     it('should place a first', () => {
//         assert.equal(utils.compareSegments(segments[0], segments[3]), -1, 'first is above');
//     });
//     it('should place b first', () => {
//         assert.equal(utils.compareSegments(segments[3], segments[0]), 1, 'first is below');
//     });
// });

describe('sort intersecting segments', function() {

    it('returns b is higher at 5', () => {
        assert.equal(utils.compareSegments(segments[0], segments[1], 5), 1);
    });
    it('returns b is lower at -2', () => {
        assert.equal(utils.compareSegments(segments[0], segments[1], -2), -1);
    });
    it('returns a & b are equal at 5', () => {
        assert.equal(utils.compareSegments(segments[0], segments[2], 5), 0);
    });
});
