var utils = {
    // points comparator
    comparePoints: function(a, b) {
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
    },



    compareSegments: function (a, b) {
        console.log(this.x);

        return a[0][0] > this.x;

        // нужно вернуть сегмент, который в данной точке
        // является первым ближайшим по x или y

        // сортировка по y в точке с данной координатой x

        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];

        var v1 = [x2 - x1, y2 - y1],
            v2 = [x4 - x3, y4 - y3];

        var mult = v1[0] * v2[1] - v1[1] * v2[0];

        if (y1 > y3) {
            return 1;
        } else if (y1 < y3) {
            return -1;
        } else if (y1 === y3) {
            return 0;
        }
        // if (mult > 0) {
        //     return 1;
        // } else if (mult < 0) {
        //     return -1;
        // } else if (mult === 0) {
        //     return 0;
        // }
    },

    pointOnLine: function (line, point) {
        var begin = line[0],
            end = line[1],
            x1 = begin[0],
            y1 = begin[1],
            x2 = end[0],
            y2 = end[1],
            x = point[0],
            y = point[1];

        return ((x - x1) * (y2 - y1) - (y - y1) * (x2 - x1) === 0) && ((x > x1 && x < x2) || (x > x2 && x < x1));
    }
}

module.exports = utils;
