var Tree = require('avl');
var handleEventPoint = require('./handleeventpoint');
var utils = require('./utils');

/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {
    var queue = new Tree(utils.comparePoints),
        status = new Tree(utils.compareSegments),
        result = [];

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

    /*
     * LOG
     */
    var values = queue.values();

    values.forEach(function (value, index, array) {
        var p = value.point;
        var ll = L.latLng([p[1], p[0]]);
        var mrk = L.circleMarker(ll, {radius: 4, color: 'red', fillColor: 'FF00' + 2 ** index}).addTo(map);
        mrk.bindPopup('' + index + '\n' + p[0] + '\n' + p[1]);
    });

    var i = 0;
    /*
     * LOG END
     */
    while (!queue.isEmpty()) {
        var event = queue.pop();

        if (event.data.type === 'begin') {

            status.insert(event.data.segment);
            var segE = status.find(event.data.segment);

            /*
             * LOG
             */
            var adding = segE.key;
            var lls = adding.map(function(p){return L.latLng(p.slice().reverse())});
            var line = L.polyline(lls).addTo(map);

            line.bindPopup('' + i);

            i++;

            console.log('now adding segment: ');
            adding.forEach(function (p) {
                console.log('x: ' + p[0] + ' y: ' + p[1]);
            })
            /*
             * LOG END
             */

            var segA = status.prev(segE);
            var segB = status.next(segE);
            console.log(segA);
            console.log(segB);

            if (segA) {
                var eaIntersectionPoint = utils.findSegmentsIntersection(segE.key, segA.key);

                if (eaIntersectionPoint) {
                    var eaIntersectionPointData = {
                        point: eaIntersectionPoint,
                        type: 'intersection',
                        segments: [segE.key, segA.key]
                    }
                    queue.insert(eaIntersectionPoint, eaIntersectionPointData);
                }
            }

            if (segB) {
                var ebIntersectionPoint = utils.findSegmentsIntersection(segE.key, segB.key);

                if (ebIntersectionPoint) {
                    var ebIntersectionPointData = {
                        point: ebIntersectionPoint,
                        type: 'intersection',
                        segments: [segE.key, segB.key]
                    }
                    queue.insert(ebIntersectionPoint, ebIntersectionPointData);
                }
            }
            //         Else If (E is a right endpoint) {
        } else if (event.data.type === 'end') {
            var segE = status.find(event.data.segment);
            var segA = status.prev(segE);
            var segB = status.next(segE);

            if (segA && segB) {
                var abIntersectionPoint = utils.findSegmentsIntersection(segA.key, segB.key);

                if (abIntersectionPoint) {
                    if (!queue.find(abIntersectionPoint)) {
                        var abIntersectionPointData = {
                            point: abIntersectionPoint,
                            type: 'intersection',
                            segments: [segA.key, segB.key]
                        }
                        //                 Insert I into EQ;
                        queue.insert(abIntersectionPoint, abIntersectionPointData);
                    }
                }
            }
            /*
             * LOG
             */
            //             Delete segE from SL;
            // console.log('tree before removing segment: ');
            // console.log(status.toString());
            // var removing = segE.data;

            // console.log('now removing segment: ');
            // console.log(status.find(segE.key));
            // removing.forEach(function (p) {
                // console.log('x: ' + p[0] + ' y: ' + p[1]);
            // })
            /*
             * LOG END
             */
            status.remove(segE.key);
        } else {
            result.push(event.data.point);
            //             Let segE1 above segE2 be E's intersecting segments in SL;
            var seg1 = status.find(event.data.segments[0]),
                seg2 = status.find(event.data.segments[1]);

            //             Swap their positions so that segE2 is now above segE1;
            console.log(status);
            // status.prev(seg1) = status.find(seg2);
            // status.next(seg2) = status.find(seg1);
            //             Let segA = the segment above segE2 in SL;
            var segA = status.prev(seg2);
            //             Let segB = the segment below segE1 in SL;
            var segB = status.next(seg1);

            if (segA) {
                var a2IntersectionPoint = utils.findSegmentsIntersection(seg2.key, segA.key);

                if (a2IntersectionPoint) {
                    if (!queue.find(a2IntersectionPoint)) {
                        var a2IntersectionPointData = {
                            point: a2IntersectionPoint,
                            type: 'intersection',
                            segments: [seg2.key, segA.key]
                        }
                        queue.insert(a2IntersectionPoint, a2IntersectionPointData);
                    }
                }
            }
            if (segB) {
                var b1IntersectionPoint = utils.findSegmentsIntersection(seg1.key, segB.key);

                if (b1IntersectionPoint) {
                    if (!queue.find(b1IntersectionPoint)) {
                        var b1IntersectionPointData = {
                            point: b1IntersectionPoint,
                            type: 'intersection',
                            segments: [seg1.key, segB.key]
                        }
                        queue.insert(b1IntersectionPoint, b1IntersectionPointData);
                    }
                }
            }
        }
    }

    status.values().forEach(function (value, index, array) {

        lls = value.map(function(p){return L.latLng(p.slice().reverse())});

        var line = L.polyline(lls).addTo(map);
        line.bindPopup('' + index);
    });
    console.log(result);
    return result;
}

module.exports = findIntersections;
