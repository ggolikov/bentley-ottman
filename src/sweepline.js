var Tree = require('avl'),
    Sweepline = require('./sl'),
    Point = require('./point'),
    utils = require('./geometry/geometry');


/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {
    var ctx = {
        x: null,
        before: null
    };

    var ctx = new Sweepline('begin');

    var queue = new Tree(utils.comparePoints),
        status = new Tree(utils.compareSegments.bind(ctx)),
        output = new Tree(utils.comparePoints);

    segments.forEach(function (segment, i, a) {
        console.log(i);
        segment.sort(utils.comparePoints);
        var begin = new Point(segment[0], 'begin'),
            end = new Point(segment[1], 'end');
            console.log(begin);
            console.log(end);

        if (!queue.contains(begin)) {
            queue.insert(begin, begin);
        } else {
            console.log('begin already there!');
        }
        if (!queue.contains(end)) {
            queue.insert(end, end);
            // return;
        } else {
            console.log('end already there!');
        }
    });

    // while (!queue.isEmpty()) {
    //
    // }
    // window.status = status;
    // window.queue = queue;

    return queue.keys();
}
module.exports = findIntersections;
