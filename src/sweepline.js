var Tree = require('avl'),
    utils = require('./utils');

/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {
    var queue = new Tree(utils.comparePoints),
        status = new Tree(utils.compareSegments),
        output = new Tree(utils.comparePoints);

    segments.forEach(function (segment) {
        segment.sort(utils.comparePoints);
        var begin = segment[0],
            end = segment[1],
            beginData = {
                point: begin,
                type: 'begin',
                segment: segment
            },
            endData = {
                point: end,
                type: 'end',
                segment: segment
            };
        queue.insert(begin, beginData);
        queue.insert(end, endData);
    });

    var i = 0;

    while (!queue.isEmpty()) {
        var event = queue.pop();
        var p = event.data.point;

        console.log(i + ') current point: ' + event.data.point.toString());
        console.log('   point type: ' + event.data.type);
        // console.log('   queue: ' + queue.toString());
        console.log('   status: ' + status.toString());

        if (event.data.type === 'begin') {

            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, {radius: 4, color: 'green', fillColor: 'green'}).addTo(map);

            var segmentData = {
                above: null,
                below: null
            }

            status.insert(event.data.segment);
            var segE = status.find(event.data.segment);

            var lls = segE.key.map(function(p){return L.latLng(p.slice().reverse())});
            var line = L.polyline(lls, {color: 'green'}).addTo(map);

            line.bindPopup('added' + i);

            var segA = status.prev(segE);
            var segB = status.next(segE);

            if (!segA && segB) {
                segB = status.next(status.next(segE));
            }
            if (segA && !segB) {
                segA = status.prev(status.prev(segE));
            }

            if (segB) {
               segE.above = segB;
               segE.above.below = segE;
            }
            if (segA) {
               segE.below = segA;
               segE.below.above = segE;
            }

            if (segA) {
                var eaIntersectionPoint = utils.findSegmentsIntersection(segE.key, segA.key);

                if (eaIntersectionPoint && !output.find(eaIntersectionPoint)) {
                    var eaIntersectionPointData = {
                        point: eaIntersectionPoint,
                        type: 'intersection',
                        segments: [segE.key, segA.key]
                    }
                    queue.insert(eaIntersectionPoint, eaIntersectionPointData);
                    console.log('inserted point:' + eaIntersectionPoint.toString());
                }
            }

            if (segB) {
                var ebIntersectionPoint = utils.findSegmentsIntersection(segE.key, segB.key);

                if (ebIntersectionPoint) {
                    var ebIntersectionPointData = {
                        point: ebIntersectionPoint,
                        type: 'intersection',
                        segments: [segB.key, segE.key]
                    }
                    queue.insert(ebIntersectionPoint, ebIntersectionPointData);
                    console.log('inserted ebIntersectionPoint:' + ebIntersectionPoint.toString());
                }
            }
            //         Else If (E is a right endpoint) {
        } else if (event.data.type === 'end') {
            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, {radius: 4, color: 'red', fillColor: 'red'}).addTo(map);
            var segE = status.find(event.data.segment);

            var segA = segE.above;
            var segB = segE.below;
            // var segA = status.prev(segE);
            // var segB = status.next(segE);

            /*
             * LOG
             */
             var lls = segE.key.map(function(p){return L.latLng(p.slice().reverse())});
             var line = L.polyline(lls, {color: 'red'}).addTo(map);

             line.bindPopup('removed' + i);

            if (segA && segB) {
                var abIntersectionPoint = utils.findSegmentsIntersection(segA.key, segB.key);

                if (abIntersectionPoint && !output.find(abIntersectionPoint)) {
                    var abIntersectionPointData = {
                        point: abIntersectionPoint,
                        type: 'intersection',
                        segments: [segA.key, segB.key]
                    }
                    //                 Insert I into EQ;
                    queue.insert(abIntersectionPoint, abIntersectionPointData);
                    console.log('inserted abIntersectionPoint:' + abIntersectionPoint.toString());
                }
            }
            var nx = status.next(segE);
            if (nx){
              nx.below = segE.below;
            }

            var np = status.prev(segE);
            if (np){
              np.above = segE.above;
            }
            status.remove(segE.key);

        } else {
            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, {radius: 4, color: 'blue', fillColor: 'blue'}).addTo(map);
            output.insert(event.data.point);
            //             Let segE1 above segE2 be E's intersecting segments in SL;
            var seg1 = status.find(event.data.segments[0]),
                seg2 = status.find(event.data.segments[1]);

            if (seg1 && seg2) {

                //             Swap their positions so that segE2 is now above segE1;
                // console.log(status);
                // status.prev(seg1) = status.find(seg2);
                // status.next(seg2) = status.find(seg1);
                //             Let segA = the segment above segE2 in SL;

                // var segA = status.next(seg1);
                //             Let segB = the segment below segE1 in SL;
                // var segB = status.prev(seg2);
                var segA = seg1.above;
                var segB = seg2.below;

                console.log(seg1.above);
                console.log(seg2.below);
                seg1.above = seg2;
                seg2.below = seg1;
                seg1.below = segB;
                seg2.above = segA;


                if (segA) {
                    var a2IntersectionPoint = utils.findSegmentsIntersection(seg2.key, segA.key);

                    if (a2IntersectionPoint && !output.find(a2IntersectionPoint)) {
                        var a2IntersectionPointData = {
                            point: a2IntersectionPoint,
                            type: 'intersection',
                            segments: [segA.key, seg2.key]
                        }
                        queue.insert(a2IntersectionPoint, a2IntersectionPointData);
                        console.log('inserted a2IntersectionPoint:' + a2IntersectionPoint.toString());
                    }
                }
                if (segB) {
                    var b1IntersectionPoint = utils.findSegmentsIntersection(seg1.key, segB.key);

                    if (b1IntersectionPoint && !output.find(b1IntersectionPoint)) {
                        var b1IntersectionPointData = {
                            point: b1IntersectionPoint,
                            type: 'intersection',
                            segments: [seg1.key, segB.key]
                        }
                        queue.insert(b1IntersectionPoint, b1IntersectionPointData);
                        console.log('inserted b1IntersectionPoint:' + b1IntersectionPoint.toString());
                    }
                }
            }
            i++;

            }
    }
    window.status = status;
    window.queue = queue;

    return output.keys();
}
module.exports = findIntersections;
