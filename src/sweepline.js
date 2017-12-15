var Tree = require('avl'),
    Sweepline = require('./sl'),
    Point = require('./point'),
    utils = require('./geometry/geometry');


var queue = new Tree(utils.comparePoints),
    status = new Tree(utils.compareSegments/*BIND POINT HERE*/),
    output = new Tree(utils.comparePoints);

/**
* @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
*/
function findIntersections(segments) {
    segments.forEach(function (segment, i, a) {
        segment.sort(utils.comparePoints);
        var begin = new Point(segment[0], 'begin'),
            end = new Point(segment[1], 'end');

        if (!queue.contains(begin)) {
            queue.insert(begin, begin);
            begin.segments.push(segment);
        } else {
            begin = queue.find(begin).key;
            begin.segments.push(segment);
            // console.log('begin already there!');
        }

        if (!queue.contains(end)) {
            queue.insert(end, end);
        }
    });
    // console.log(queue.toString());
    // while (!queue.isEmpty()) {
    //
    // }
    // window.status = status;
    // window.queue = queue;

    return queue.keys();
}

function handleEventPoint(point, status, output) {
    // step 1
    var Up = point.segments, // segments, for which this is the left end
        Lp = [],             // segments, for which this is the right end
        Cp = [];             // // segments, for which this is an inner point

    // step 2
    status.forEach(function(node, i) {
        var segment = node.key,
            segmentBegin = segment[0],
            segmentEnd = segment[1];

        // count right-ends
        if (point.x === segmentEnd[0] && point.y === segmentEnd[1]) {
            Lp.push(segment);
        // count inner points
        } else {
            // filter left ends
            if (!(point.x === segmentBegin[0] && point.y === segmentBegin[1])) {
                if (utils.direction(segmentBegin, segmentEnd, [point.x, point.y]) === 0 && utils.onSegment(segmentBegin, segmentEnd, [point.x, point.y])) {
                    Cp.push(segment);
                }
            }
        }
    });
    // step 3
    // handle every intersection
    // there is always one of cases: Up.length || Cp.length || Lp.length
    // point in always the left || the right || on-segment
    if ([].concat(Up, Lp, Cp).length > 1) {
        output.insert(point, point);
    };
    // step 5
    for (var i = 0; i < Lp.length; i++) {
        status.remove(Lp[i]);
    }
    for (var j = 0; j < Cp.length; j++) {
        status.remove(Cp[j]);
    }
    // step 6 Insert intersecting,
    // (step 7) here is the segments order changing
    // HANDLE 'BEFORE/AFTER AND X HERE'
    // this.after = true;
    // this.x = x;
    for (var k = 0; k < Up.length; k++) {
        status.insert(Up[k]);
    }
    for (var l = 0; l < Cp.length; l++) {
        status.insert(Cp[l]);
    }
    // handle right end-point case
    if (Up.length === 0 && Cp.length === 0) {
        if (status.next())
        // below
        var sl = status.prev(/*segment*/)
        // above
        var sr = status.next(/*segment*/)
        if (sl && sr) {
            findNewEvent(sl, sr, point);
        } else {

        }

    return output;
}

function findNewEvent() {

}

module.exports = {
    findIntersections: findIntersections,
    handleEventPoint: handleEventPoint
};
