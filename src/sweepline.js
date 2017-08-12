// first we define a sweepline
// sweepline has to update its status

/**
 *  balanced AVL BST for storing an event queue and sweepline status
 */


 // (1) Initialize event queue EQ = all segment endpoints;
 // (2) Sort EQ by increasing x and y;
 // (3) Initialize sweep line SL to be empty;
 // (4) Initialize output intersection list IL to be empty;
 //
 // (5) While (EQ is nonempty) {
 //     (6) Let E = the next event from EQ;
 //     (7) If (E is a left endpoint) {
 //             Let segE = E's segment;
 //             Add segE to SL;
 //             Let segA = the segment Above segE in SL;
 //             Let segB = the segment Below segE in SL;
 //             If (I = Intersect( segE with segA) exists)
 //                 Insert I into EQ;
 //             If (I = Intersect( segE with segB) exists)
 //                 Insert I into EQ;
 //         }
 //         Else If (E is a right endpoint) {
 //             Let segE = E's segment;
 //             Let segA = the segment Above segE in SL;
 //             Let segB = the segment Below segE in SL;
 //             Delete segE from SL;
 //             If (I = Intersect( segA with segB) exists)
 //                 If (I is not in EQ already)
 //                     Insert I into EQ;
 //         }
 //         Else {  // E is an intersection event
 //             Add E’s intersect point to the output list IL;
 //             Let segE1 above segE2 be E's intersecting segments in SL;
 //             Swap their positions so that segE2 is now above segE1;
 //             Let segA = the segment above segE2 in SL;
 //             Let segB = the segment below segE1 in SL;
 //             If (I = Intersect(segE2 with segA) exists)
 //                 If (I is not in EQ already)
 //                     Insert I into EQ;
 //             If (I = Intersect(segE1 with segB) exists)
 //                 If (I is not in EQ already)
 //                     Insert I into EQ;
 //         }
 //         remove E from EQ;
 //     }
 //     return IL;
 // }



var Tree = require('avl');
var handleEventPoint = require('./handleeventpoint');
var utils = require('./utils');

/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {

    // (1) Initialize event queue EQ = all segment endpoints;
    // (2) Sort EQ by increasing x and y;
    var queue = new Tree(utils.comparePoints);

    // (3) Initialize sweep line SL to be empty;
    var status = new Tree(utils.compareSegments);

    // (4) Initialize output intersection list IL to be empty;
    var result = [];

    // store event points corresponding to their coordinates
    segments.forEach(function (segment) {
        // 2. Sort EQ by increasing x and y;
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

    var values = queue.values();

    values.forEach(function (value, index, array) {
        var p = value.point;
        var ll = L.latLng([p[1], p[0]]);
        var mrk = L.circleMarker(ll, {radius: 4, color: 'red', fillColor: 'FF00' + 2 ** index}).addTo(map);
        mrk.bindPopup('' + index + '\n' + p[0] + '\n' + p[1]);
    });

    var i = 0;
    // (5) While (EQ is nonempty) {
    while (!queue.isEmpty()) {
         //     (6) Let E = the next event from EQ;
        var event = queue.pop();

        //     (7) If (E is a left endpoint) {
        if (event.data.type === 'begin') {
            // console.log('begin');

            // когда мы помещаем отрезок в множество статуса, мы сравниваем его в данной точке
            // с уже существующими.
            // это множество динамическое,
            // то есть отрезки меняют свое положение.

            // если в некоторой точке x у этого отрезка больше y, то он помещается после первого

            //             Let segE = E's segment;

            //             Add segE to SL;
            status.insert(event.data.segment, event.data.segment);
            var segE = status.find(event.data.segment);
            // console.log(status.find(segE).data);
            // var segE = status.find(segE).data;
            var adding = segE.data;

            var lls = adding.map(function(p){return L.latLng(p.slice().reverse())});

            var line = L.polyline(lls).addTo(map);
            line.bindPopup('' + i);

            i++;

            console.log('now adding segment: ');
            adding.forEach(function (p) {
                console.log('x: ' + p[0] + ' y: ' + p[1]);
            })
            //             Let segA = the segment Above segE in SL;
            var segA = status.prev(segE);
            //             Let segB = the segment Below segE in SL;
            var segB = status.next(segE);
            console.log(segA);
            console.log(segB);

            //             If (I = Intersect( segE with segA) exists)
            if (segA) {
                var eaIntersectionPoint = utils.findSegmentsIntersection(segE.data, segA.data);

                if (eaIntersectionPoint) {
                    var eaIntersectionPointData = {
                        point: eaIntersectionPoint,
                        type: 'intersection',
                        segments: [segE.data, segA.data]
                    }
                    //                 Insert I into EQ;
                    queue.insert(eaIntersectionPoint, eaIntersectionPointData);
                }
            }

            //             If (I = Intersect( segE with segB) exists)
            if (segB) {
                var ebIntersectionPoint = utils.findSegmentsIntersection(segE.data, segB.data);

                if (ebIntersectionPoint) {
                    var ebIntersectionPointData = {
                        point: ebIntersectionPoint,
                        type: 'intersection',
                        segments: [segE.data, segB.data]
                    }
                    //                 Insert I into EQ;
                    queue.insert(ebIntersectionPoint, ebIntersectionPointData);
                }
            }
            //         Else If (E is a right endpoint) {
        } else if (event.data.type === 'end') {
            // console.log('end');
            //             Let segE = E's segment;
            var segE = status.find(event.data.segment);
            //             Let segA = the segment Above segE in SL;
            var segA = status.prev(segE);
            //             Let segB = the segment Below segE in SL;
            var segB = status.next(segE);

            if (segA && segB) {
                var abIntersectionPoint = utils.findSegmentsIntersection(segA.data, segB.data);
                //             If (I = Intersect( segA with segB) exists)
                if (abIntersectionPoint) {
                    //                 If (I is not in EQ already)
                    if (!queue.find(abIntersectionPoint)) {
                        var abIntersectionPointData = {
                            point: abIntersectionPoint,
                            type: 'intersection',
                            segments: [segA.data, segB.data]
                        }
                        //                 Insert I into EQ;
                        queue.insert(abIntersectionPoint, abIntersectionPointData);
                    }
                }
            }

            //             Delete segE from SL;
            // console.log('tree before removing segment: ');
            // console.log(status.toString());
            // var removing = segE.data;

            // console.log('now removing segment: ');
            // console.log(status.find(segE.key));
            // removing.forEach(function (p) {
                // console.log('x: ' + p[0] + ' y: ' + p[1]);
            // })

            status.remove(segE.data);
            // console.log('tree after removing segment: ');
            // console.log(status.toString());
            //         Else {  // E is an intersection event
        } else {
        //     //             Add E’s intersect point to the output list IL;
            result.push(event.data.point);
        //     //             Let segE1 above segE2 be E's intersecting segments in SL;
        //     var seg1 = status.find(event.data.segments[0]),
        //         seg2 = status.find(event.data.segments[1]);
        //
        //     //             Swap their positions so that segE2 is now above segE1;
        //     // status.prev(seg1) = seg2;
        //     // status.next(seg2) = seg1;
        //     //             Let segA = the segment above segE2 in SL;
        //     var segA = status.prev(seg2);
        //     //             Let segB = the segment below segE1 in SL;
        //     var segB = status.next(seg1);
        //
        //     if (segA) {
        //         var a2IntersectionPoint = utils.findSegmentsIntersection(seg2.data, segA.data);
        //
        //         //             If (I = Intersect(segE2 with segA) exists)
        //         if (a2IntersectionPoint) {
        //             //                 If (I is not in EQ already)
        //             if (!queue.find(a2IntersectionPoint)) {
        //                 var a2IntersectionPointData = {
        //                     point: a2IntersectionPoint,
        //                     type: 'intersection',
        //                     segments: [seg2.data, segA.data]
        //                 }
        //                 //                 Insert I into EQ;
        //                 queue.insert(a2IntersectionPoint, a2IntersectionPointData);
        //             }
        //         }
        //     }
        //     if (segB) {
        //         var b1IntersectionPoint = utils.findSegmentsIntersection(seg1.data, segB.data);
        //
        //         //             If (I = Intersect(segE1 with segB) exists)
        //         if (b1IntersectionPoint) {
        //             //                 If (I is not in EQ already)
        //             if (!queue.find(b1IntersectionPoint)) {
        //                 var b1IntersectionPointData = {
        //                     point: b1IntersectionPoint,
        //                     type: 'intersection',
        //                     segments: [seg1.data, segB.data]
        //                 }
        //                 //                 Insert I into EQ;
        //                 queue.insert(b1IntersectionPoint, b1IntersectionPointData);
        //             }
        //         }
        //     }
        }
    }

    var sValues = status.values();
    var f = sValues[0];

    // console.log(sValues);

    // for (var i = 0; i < sValues.length; i++) {
    //     for (var j = 1; j < sValues.length; j++) {
    //         console.log(utils.findSegmentsIntersection(sValues[i], sValues[j]));
    //     }
    // }


    sValues.forEach(function (value, index, array) {

        lls = value.map(function(p){return L.latLng(p.slice().reverse())});

        var line = L.polyline(lls).addTo(map);
        line.bindPopup('' + index);
    });
    console.log(result);
    return result;
}

module.exports = findIntersections;
// var ss = status.find(segE);
//
// console.log(status.toString());
//
// // console.log(status.values());
// console.log(segE);
// console.log(ss);
// // console.log(ss);
//
// // console.log(tree);
// status.forEach(function (n) {
//     // console.log(utils.findEquation(n.data));
//     // console.log(n);
// });
// console.log(queue.toString());
// console.log(event);
// console.log(queue.toString());

// console.log(queue.values());
// console.log(queue);
// var v = values[0];
// vv = [v.point[0], v.point[1]];
// console.log(v.point);
// // console.log(vv);
// // console.log(v);
// console.log(queue.next(v.point));
// console.log(queue.find(v.point));
// queue.forEach(function (n) {
//     console.log(n.left, n.right);
// });
// console.log(queue.toString());
// console.log(status.values());
// console.log(status.next(f));

// status.forEach(function (n) {
    // console.log(n);
// });

// console.log(status);

// console.log(status.toString());
//
//
// console.log(segA);
// console.log(segB);
// console.log('----');
