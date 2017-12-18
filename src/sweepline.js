// 1) EPS-round intersections
// 2) handle ends
var Tree = require('avl'),
    Sweepline = require('./sl'),
    Point = require('./point'),
    utils = require('./geometry/geometry');

/**
* @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
*/
function findIntersections(segments, map) {
    var sweepline = new Sweepline('before'),
        queue = new Tree(utils.comparePoints, true),
        status = new Tree(utils.compareSegments.bind(sweepline)),
        output = new Tree(utils.comparePoints, true);

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
        }

        // if (!queue.contains(end)) {
            queue.insert(end, end);
        // }
    });
    console.log(queue.keys());
    console.log(queue.keys().length);
    while (!queue.isEmpty()) {
        var point = queue.pop();
        console.log('STEP');

        handleEventPoint(point.key, status, output, queue, sweepline, map);
    }

    // window.status = status;
    // window.queue = queue;
    return output.keys().map(function(key){
        return [key.x, key.y];
    });
}

function handleEventPoint(point, status, output, queue, sweepline, map) {
    // L.circleMarker(L.latLng([point.y, point.x]), {radius: 5, color: 'blue', fillColor: 'blue'}).addTo(map);
    sweepline.setPosition('before');
    sweepline.setX(point.x);
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
                if (Math.abs(utils.direction(segmentBegin, segmentEnd, [point.x, point.y])) < utils.EPS && utils.onSegment(segmentBegin, segmentEnd, [point.x, point.y])) {
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
        console.log('output.insert from first');
        // console.log(point);
        output.insert(point, point);
    };

    // step 5
    for (var j = 0; j < Cp.length; j++) {
        status.remove(Cp[j]);
    }

    sweepline.setPosition('after');

    // step 6 Insert intersecting,
    // (step 7) here is the segments order changing
    for (var k = 0; k < Up.length; k++) {
        status.insert(Up[k]);
    }
    for (var l = 0; l < Cp.length; l++) {
        status.insert(Cp[l]);
    }
    // handle right end-point case
    if (Up.length === 0 && Cp.length === 0) {
        for (var i = 0; i < Lp.length; i++) {
            var s = Lp[i],
                sNode = status.find(s),
                sl = status.prev(sNode),
                sr = status.next(sNode);

            if (sl && sr) {
                findNewEvent(sl.key, sr.key, point, output, queue);
            }

            status.remove(s);
        }
    } else {
        var UCp = [].concat(Up, Cp).sort(utils.compareSegments),
            UCpmin = UCp[0],
            sllNode = status.find(UCpmin),
            UCpmax = UCp[UCp.length-1],
            srrNode = status.find(UCpmax),
            sll = sllNode && status.prev(sllNode),
            srr = srrNode && status.next(srrNode);

        if (sll && UCpmin) {
            findNewEvent(sll.key, UCpmin, point, output, queue);
        }

        if (srr && UCpmax) {
            findNewEvent(srr.key, UCpmax, point, output, queue);
        }

        for (var j = 0; j < Lp.length; j++) {
            status.remove(Lp[j]);
        }
    }
    return output;
}

function findNewEvent(sl, sr, point, output, queue) {
    var intersectionCoords = utils.findSegmentsIntersection(sl, sr),
        intersectionPoint;

    if (intersectionCoords) {
        // console.log('point');
        // console.log(point);
        // console.log('intersectionCoords');
        // console.log(intersectionCoords);
        intersectionPoint = new Point(intersectionCoords, 'intersection');
        console.log('output.insert from second');

        queue.insert(intersectionPoint, intersectionPoint);
        output.insert(intersectionPoint, intersectionPoint);
    }
}
module.exports = findIntersections;
