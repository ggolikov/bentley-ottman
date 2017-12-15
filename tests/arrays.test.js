require('mocha');
var assert = require('chai').assert,
    Tree = require('avl'),
    Sweepline = require('../src/sl'),
    utils = require('../src/geometry/geometry'),
    sl = require('../src/sweepline'),
    segments = [
        // [[-1, 1], [1, -1]],
        // [[-2, -2], [2, 2]],
        //
        // [[1, 1], [3, 7]]
        //
        [[0, 0], [1, 1]],
        [[0, 5], [5, 1]],
        [[0, -1], [5, 2]],
        // [[1, 1], [10, 0]]
    ];

describe('test segments order', function() {

    it('should change segments order', () => {
        var points = sl.findIntersections(segments);

        console.log(points);
        //     sweepline = new Sweepline('before'),
        //     status = new Tree(utils.compareSegments.bind(sweepline)),
        //     output = new Tree(utils.comparePoints);
        //
        // segments.forEach(function (segment) {
        //     status.insert(segment, segment);
        // });
        // console.log(status.keys());
        // sl.handleEventPoint({x: 1, y: 1, segments: []}, status, output, sweepline);
        // console.log("status.keys()");
        // console.log(status.keys());
        // console.log("output.keys()");
        // console.log(output.keys());
        // assert.equal(status.min()[0][0], -2, '');

    });
});
// describe('test segments order', function() {
//
//     it('should change segments order', () => {
//         var points = sl.findIntersections(segments),
//             sweepline = new Sweepline('before'),
//             status = new Tree(utils.compareSegments.bind(sweepline)),
//             output = new Tree(utils.comparePoints);
//
//         segments.forEach(function (segment) {
//             status.insert(segment, segment);
//         });
//         console.log(status.keys());
//         sl.handleEventPoint({x: 1, y: 1, segments: []}, status, output, sweepline);
//         console.log("status.keys()");
//         console.log(status.keys());
//         console.log("output.keys()");
//         console.log(output.keys());
//         // assert.equal(status.min()[0][0], -2, '');
//
//     });
// });
// describe('test points loading', function() {
//
//     it('shoud not insert duplicate points', () => {
//         var points = sl.findIntersections(segments),
//             sweepline = new Sweepline('before'),
//             status = new Tree(utils.compareSegments.bind(sweepline)),
//             output = new Tree(utils.comparePoints);
//
//         segments.forEach(function (segment) {
//             status.insert(segment, segment);
//         })
//         sl.handleEventPoint({x: 0, y: 0, segments: []}, status, output, sweepline);
//         // console.log(status.keys());
//         console.log(output.keys());
//
//         assert.equal(status.keys().length, 0, 'zero');
//     });
// });
