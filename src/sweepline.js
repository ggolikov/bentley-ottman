// first we define a sweepline
// sweepline has to update its status

/**
 *  balanced AVL BST for storing an event queue and sweepline status
 */

var Tree = require('avl');
var handleEventPoint = require('./handleeventpoint');
var utils = require('./utils');

/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {

    // initialize empty queue for storing event points
    var queue = new Tree(utils.comparePoints);

    // initialize empty tree for storing segments
    var status = new Tree();

    var result = [];

    // store event points corresponding to their coordinates
    segments.forEach(function (segment) {
        segment.sort(utils.comparePoints);
        var begin = segment[0],
            end = segment[1],
            beginData = {
                point: begin,
                segment: segment
            },
            endData = {
                point: end
            };
        queue.insert(begin, beginData);
        queue.insert(end, endData);

        status.insert(segment, segment);
    });



    // console.log(status.values());
    // console.log(queue.values());
    // console.log(queue);

    while (!queue.isEmpty()) {
        var point = queue.pop();
        var res = handleEventPoint(point, queue, status);

        if (res.length) {
            result = result.concat(res);
        }
    }

    var values = queue.values();

    values.forEach(function (value, index, array) {
        var p = value.point;
        var ll = L.latLng([p[1], p[0]]);
        var mrk = L.circleMarker(ll, {radius: 4, color: 'red', fillColor: 'FF00' + 2 ** index}).addTo(map);
        mrk.bindPopup('' + index);
    });

}

module.exports = findIntersections;
