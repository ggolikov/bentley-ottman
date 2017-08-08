var utils = require('./utils');

function handleEventPoint(point, queue, status) {
    var p = point.data.point;
    // 1
    var up = point.data.segment;
    var ups = up ? [up] : [];
    var lps = [];
    var cps = [];

    var result = [];

    // filter by upperpoint
    // 2
    status.forEach(function (node) {
        var segment = node.data,
            begin = segment[0],
            end = segment[1];

        // find lower intersection
        if (p[0] === end[0] && p[1] === end[1]) {
            lps.push(segment);
        }

        // find inner intersections
        if (utils.pointOnLine(segment, p)) {
            cps.push(segment);
        }
    });

    // 3
    if (ups.concat(lps).concat(cps).length > 1) {
    // 4
        result.push(p);
    }

    console.log(ups.concat(lps).concat(cps));

    // 5
    removeFromTree(lps, status);
    removeFromTree(cps, status);

    // 6
    insertIntoTree(ups, status);
    insertIntoTree(cps, status);




    // console.log(status);

    return result;
}

function removeFromTree(arr, tree) {
    arr.forEach(function (item) {
        tree.remove(item);
    })
}

function insertIntoTree(arr, tree) {
    arr.forEach(function (item) {
        tree.insert(item);
    })
}

module.exports = handleEventPoint;
