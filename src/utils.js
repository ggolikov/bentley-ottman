function Utils() {};

Utils.prototype = {

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
        var x1 = b[0][0],
            y1 = b[0][1],
            x2 = b[1][0],
            y2 = b[1][1],
            x3 = a[0][0],
            y3 = a[0][1],
            x4 = a[1][0],
            y4 = a[1][1];

        if (y3 > y1) {
            return -1;
        } else if (y3 < y1) {
            return 1;
        } else {
            return 0;
        }
    },

    // compareSegments3: function (a, b) {
    //     var x1 = b[0][0],
    //         y1 = b[0][1],
    //         x2 = b[1][0],
    //         y2 = b[1][1],
    //         x3 = a[0][0],
    //         y3 = a[0][1],
    //         x4 = a[1][0],
    //         y4 = a[1][1],
    //         intersectionPoint = findSegmentsIntersection(a, b);
    //
    //     // console.log(intersectionPoint);
    //     if (!intersectionPoint) {
    //         // находим векторное произведение векторов b и b[0]a[0]
    //         var Dba1 = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
    //         // находим векторное произведение векторов b и b[0]a[1]
    //         var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
    //         // находим знак векторных произведений
    //         var D = Dba1 * Dba2;
    //
    //         if (D < 0) {
    //             return -1;
    //         } else if (D > 0) {
    //             return 1;
    //         } else if (D === 0) {
    //             return 0;
    //         }
    //     } else {
    //         console.log('they are intersecting');
    //         var intersectionX = intersectionPoint[0];
    //         var intersectionY = intersectionPoint[1];
    //
    //         // if (y3 < intersectionY) {
    //         //     return -1
    //         // } else if (y3 > intersectionY) {
    //         //     return 1;
    //         // } else if (y3 === intersectionY) {
    //         //     return 0;
    //         // }
    //         // if (x3 < intersectionX) {
    //         //     return - 1
    //         // } else if (x3 > intersectionX) {
    //         //     return 1;
    //         // } else if (x3 === intersectionX) {
    //         //     return 0;
    //         // }
    //         if (y3 < y1) {
    //             return -1
    //         } else if (y3 > y1) {
    //             return 1;
    //         } else if (y3 === y1) {
    //             return 0;
    //         }
    //
    //         // находим векторное произведение векторов b и b[0]a[0]
    //         var D = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
    //         // находим векторное произведение векторов b и b[0]a[1]
    //         // var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
    //         // находим знак векторных произведений
    //         // var D = Dba1 * Dba2;
    //
    //         if (D < 0) {
    //             return -1;
    //         } else if (D > 0) {
    //             return 1;
    //         } else if (D === 0) {
    //             return 0;
    //         }
    //
    //
    //         return 0;
    //     }
    //
    //
    //     function between(a, b, c) {
    //         var eps = 0.0000001;
    //
    //         return a-eps <= b && b <= c+eps;
    //     }
    //
    //     function findSegmentsIntersection(a, b) {
    //         var x1 = a[0][0],
    //             y1 = a[0][1],
    //             x2 = a[1][0],
    //             y2 = a[1][1],
    //             x3 = b[0][0],
    //             y3 = b[0][1],
    //             x4 = b[1][0],
    //             y4 = b[1][1];
    //         var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    //             ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    //         var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    //             ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    //         if (isNaN(x)||isNaN(y)) {
    //             return false;
    //         } else {
    //             if (x1 >= x2) {
    //                 if (between(x2, x, x1)) {return false;}
    //             } else {
    //                 if (between(x1, x, x2)) {return false;}
    //             }
    //             if (y1 >= y2) {
    //                 if (between(y2, y, y1)) {return false;}
    //             } else {
    //                 if (between(y1, y, y2)) {return false;}
    //             }
    //             if (x3 >= x4) {
    //                 if (between(x4, x, x3)) {return false;}
    //             } else {
    //                 if (between(x3, x, x4)) {return false;}
    //             }
    //             if (y3 >= y4) {
    //                 if (between(y4, y, y3)) {return false;}
    //             } else {
    //                 if (between(y3, y, y4)) {return false;}
    //             }
    //         }
    //         return [x, y];
    //     }
    //
    // },

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
        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
            ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
            ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x)||isNaN(y)) {
            return false;
        } else {
            if (x1 >= x2) {
                if (!this.between(x2, x, x1)) {return false;}
            } else {
                if (!this.between(x1, x, x2)) {return false;}
            }
            if (y1 >= y2) {
                if (!this.between(y2, y, y1)) {return false;}
            } else {
                if (!this.between(y1, y, y2)) {return false;}
            }
            if (x3 >= x4) {
                if (!this.between(x4, x, x3)) {return false;}
            } else {
                if (!this.between(x3, x, x4)) {return false;}
            }
            if (y3 >= y4) {
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
    },

    findY: function (point1, point2, x) {
        var x1 = point1[0],
            y1 = point1[1],
            x2 = point2[0],
            y2 = point2[1],
            a = y1 - y2,
            b = x2 - x1,
            c = x1 * y2 - x2 * y1;

            return (-c - a * x) / b;
    }
}

module.exports = new Utils;
