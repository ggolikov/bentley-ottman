var utils = {

    /*
        Если compareFunction(a, b) меньше 0, сортировка поставит a по меньшему индексу, чем b, то есть, a идёт первым.
        Если compareFunction(a, b) вернёт 0, сортировка оставит a и b неизменными по отношению друг к другу,
            но отсортирует их по отношению ко всем другим элементам.
            Обратите внимание: стандарт ECMAscript не гарантирует данное поведение, и ему следуют не все браузеры
            (например, версии Mozilla по крайней мере, до 2003 года).
        Если compareFunction(a, b) больше 0, сортировка поставит b по меньшему индексу, чем a.
        Функция compareFunction(a, b) должна всегда возвращать одинаковое значение для определённой пары элементов a и b.
            Если будут возвращаться непоследовательные результаты, порядок сортировки будет не определён.
    */
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
        // нужно вернуть сегмент, который в данной точке
        // является первым ближайшим по x или y

        // сортировка по y в точке с данной координатой x

        // найти, с какой стороны лежит левая точка b по отношению к a

        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];

        // var x3 = a[0][0],
        //     y3 = a[0][1],
        //     x4 = a[1][0],
        //     y4 = a[1][1],
        //     x1 = b[0][0],
        //     y1 = b[0][1],
        //     x2 = b[1][0],
        //     y2 = b[1][1];

        var D = (x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1);

        var v1 = [x2 - x1, y2 - y1],
            v2 = [x4 - x3, y4 - y3];

        var mult = v1[0] * v2[1] - v1[1] * v2[0];

        if (D < 0) {
            return -1;
        } else if (D > 0) {
            return 1;
        } else if (D === 0) {
            return 0;
        }
        // if (y1 > y3) {
        //     return 1;
        // } else if (y1 < y3) {
        //     return -1;
        // } else if (y1 === y3) {
        //     return 0;
        // }
        // if (mult > 0) {
        //     return 1;
        // } else if (mult < 0) {
        //     return -1;
        // } else if (mult === 0) {
        //     return 0;
        // }
    },

    findEquation: function (segment) {
        var x1 = segment[0][0],
            y1 = segment[0][1],
            x2 = segment[1][0],
            y2 = segment[1][1],
            a = y1 - y2,
            b = x2 - x1,
            c = x1 * y2 - x2 * y1;

        console.log(a + 'x + ' + b + 'y + ' + c + ' = 0');
    },

    findIntersection: function (a, b) {
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];
    },

    // Adapted from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
    between: function (a, b, c) {
        var eps = 0.0000001;

        return a-eps <= b && b <= c+eps;
    },


    findSegmentsIntersection: function (a, b) {
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];
        var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
        var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
        if (isNaN(x)||isNaN(y)) {
            return false;
        } else {
            if (x1>=x2) {
                if (!this.between(x2, x, x1)) {return false;}
            } else {
                if (!this.between(x1, x, x2)) {return false;}
            }
            if (y1>=y2) {
                if (!this.between(y2, y, y1)) {return false;}
            } else {
                if (!this.between(y1, y, y2)) {return false;}
            }
            if (x3>=x4) {
                if (!this.between(x4, x, x3)) {return false;}
            } else {
                if (!this.between(x3, x, x4)) {return false;}
            }
            if (y3>=y4) {
                if (!this.between(y4, y, y3)) {return false;}
            } else {
                if (!this.between(y3, y, y4)) {return false;}
            }
        }
        return [x, y];
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
