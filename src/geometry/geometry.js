/**
 * @param a vector
 * @param b vector
 * @param c vector
 */
function onSegment(a, b, c) {
    var x1 = a[0],
        x2 = b[0],
        x3 = c[0],
        y1 = a[1],
        y2 = b[1],
        y3 = c[1];

    return (Math.min(x1, x2) <= x3) && (x3 <= Math.max(x1, x2)) &&
           (Math.min(y1, y2) <= y3) && (y3 <= Math.max(y1, y2));
}

/**
 * ac x bc
 * @param a vector
 * @param b vector
 * @param c vector
 */
function direction(a, b, c) {
    var x1 = a[0],
        x2 = b[0],
        x3 = c[0],
        y1 = a[1],
        y2 = b[1],
        y3 = c[1];

    return (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1);
}

/**
 * @param a segment1
 * @param b segment2
 */
function segmentsIntersect(a, b) {
    var p1 = a[0],
        p2 = a[1],
        p3 = b[0],
        p4 = b[1],
        d1 = direction(p3, p4, p1),
        d2 = direction(p3, p4, p2),
        d3 = direction(p1, p2, p3),
        d4 = direction(p1, p2, p4);

    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
        return true;
    } else if (d1 === 0 && onSegment(p3, p4, p1)) {
        return true;
    } else if (d2 === 0 && onSegment(p3, p4, p2)) {
        return true;
    } else if (d3 === 0 && onSegment(p1, p2, p3)) {
        return true;
    } else if (d4 === 0 && onSegment(p1, p2, p4)) {
        return true;
    }
    return false;
}

/**
 * @param a segment1
 * @param b segment2
 */
function compareSegments(a, b) {
    var intersect = segmentsIntersect(a, b);
    var intersect = false;
    if (!intersect) {
        var sort = [a, b].sort(comparePoints),
            a = sort[0],
            b = sort[1],
            p1 = a[0],
            p2 = a[1],
            p3 = b[0],
            d = direction(p1, p2, p3);

        return d > 0 ? 1 : -1;
    }
}

function comparePoints(a, b) {
    var x1 = a[0],
        y1 = a[1],
        x2 = b[0],
        y2 = b[1];

    if (x1 > x2 || (x1 === x2 && y1 > y2)) {
        return 1;
    } else if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return -1;
    } else if (x1 === x2 && y1 === y2) {
        return 0;
    }
}

module.exports = {
    onSegment: onSegment,
    direction: direction,
    segmentsIntersect: segmentsIntersect,
    compareSegments: compareSegments
}
