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
    var status = new Tree(utils.comparePoints);

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

        // status.insert(segment, segment);
    });

    // console.log(queue.values());
    // console.log(queue);
    var values = queue.values();
    var v = values[0];
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

    values.forEach(function (value, index, array) {
        var p = value.point;
        var ll = L.latLng([p[1], p[0]]);
        var mrk = L.circleMarker(ll, {radius: 4, color: 'red', fillColor: 'FF00' + 2 ** index}).addTo(map);
        mrk.bindPopup('' + index + '\n' + p[0] + '\n' + p[1]);
    });

    // (5) While (EQ is nonempty) {
    while (!queue.isEmpty()) {
         //     (6) Let E = the next event from EQ;
        var event = queue.pop();

        //     (7) If (E is a left endpoint) {
        if (event.data.type === 'begin') {
            //             Let segE = E's segment;
            var segE = event.data.segment;
            //             Add segE to SL;
            status.insert(segE, segE);
            //             Let segA = the segment Above segE in SL;
            var segA = status.prev(segE);
            //             Let segB = the segment Below segE in SL;
            var segB = status.next(segE);

            // console.log(status.toString());

            // console.log(status.values());
            var ss = status.find(segE);

            // console.log(tree);
            // console.log(ss);
            status.forEach(function (n) {
                console.log(n);
            });

            console.log('----');

            // console.log(segA);
            // console.log(segB);

        }
        //             If (I = Intersect( segE with segA) exists)
        //                 Insert I into EQ;
        //             If (I = Intersect( segE with segB) exists)
        //                 Insert I into EQ;
        //         }
    }

    var sValues = status.values();
    var f = sValues[0];
    // console.log(status.next(f));

    // status.forEach(function (n) {
        // console.log(n);
    // });

    console.log(status);

    console.log(status.toString());

    sValues.forEach(function (value, index, array) {
        lls = value.map(function(p){return L.latLng(p.slice().reverse())});

        var line = L.polyline(lls).addTo(map);
        line.bindPopup('' + index);
    });
    // console.log(status.values());





}

module.exports = findIntersections;
