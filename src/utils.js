var EPS = 1E-9;

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

    compareSegments1: function (a, b) {
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];

        if (y1 < y3) {
            return -1;
        } else if (y1 > y3) {
            return 1;
        } else {
            return 0;
        }
    },

    compareSegments: function (a, b) {
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];

        var currentX,   // текущий x свиплайна
            ay,         // y точки пересечения отрезка события a со свиплайном
            by,         // y точки пересечения отрезка события b со свиплайном
            deltaY,     // разница y точек пересечения
            deltaX1,    // разница x начал отрезков
            deltaX2;    // разница x концов отрезков

        if (a === b) {
            return 0;
        }

        currentX = this.x;
        ay = getY(a, currentX);
        by = getY(b, currentX);
        deltaY = ay - by;

        // сравнение надо проводить с эпсилоном,
        // иначе возможны ошибки округления
        if (Math.abs(deltaY) > EPS) {
            return deltaY < 0 ? -1 : 1;
        // если y обеих событий равны
        // проверяем угол прямых
        // чем круче прямая, тем ниже ее левый конец, значит событие располагаем ниже
        } else {
            var aSlope = getSlope(a),
                bSlope = getSlope(b);

            if (aSlope !== bSlope) {
                if (this.position === 'before') {
                    return aSlope > bSlope ? -1 : 1;
                } else {
                    return aSlope > bSlope ? 1 : -1;
                }
            }
        }
        // после сравнения по y пересечения со свиплайном
        // и сравнения уклонов
        // остается случай, когда уклоны равны
        // (if aSlope === bSlope)
        // и 2 отрезка лежат на одной прямой
        // в таком случае
        // проверим положение концов отрезков
        deltaX1 = x1 - x3;

        // проверим взаимное положение левых концов
        if (deltaX1 !== 0) {
            return deltaX1 < 0 ? -1 : 1;
        }

        // проверим взаимное положение правых концов
        deltaX2 = x2 - x4;

        if (deltaX2 !== 0) {
            return deltaX2 < 0 ? -1 : 1;
        }

        // отрезки совпадают
        return 0;

    },

    compareSegments00: function (a, b) {
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];

        // first, check left-ends

        // var x = Math.max(Math.min(x1, x2), Math.min(x3, x4));
        // console.log('x: ' + x);
        // console.log('y from x: ' + getY(b, x));
        var ay =  getY(a, this.x);
        var by =  getY(b, this.x);
        // return getY(a, x) < getY(b, x) - EPS;
        // L.marker(L.latLng([this.x, ay].slice().reverse())).bindPopup('1 > 2').addTo(map);
        // L.polyline([
        //     L.latLng([this.x, 55].slice().reverse()),
        //     L.latLng([this.x, 57].slice().reverse())
        // ], {
        //     weight: 1
        // }).bindPopup('' + this.x).addTo(map);
        // L.marker(L.latLng([x, by].slice().reverse())).bindPopup('2 > 1').addTo(map);

        if (Math.abs(ay - by) > EPS && ay < by) {
            return -1;
        } else if (Math.abs(ay - by) > EPS && ay > by) {
            return 1;
        }

        // if a.leftPoint = b.leftPoint
        // check right

        x = Math.min(Math.max(x1, x2), Math.max(x3, x4));
        ay =  getY(a, x);
        by =  getY(b, x);

        // L.marker(L.latLng([this.x, ay].slice().reverse())).bindPopup('1 > 2').addTo(map);
        if (Math.abs(ay - by) > EPS && ay < by) {
            return -1;
        } else if (Math.abs(ay - by) > EPS && ay > by) {
            return 1;
        }

        return 0;


        // if (y1 < by) {
        //     return -1;
        // } else if (y1 > by) {
        //     return 1;
        // } else {
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

    // Adapted from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
    between: function (a, b, c) {
        // var eps = 0.0000001;

        return a-EPS <= b && b <= c+EPS;
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

}

function getSlope(segment) {
    var x1 = segment[0][0],
        y1 = segment[0][1],
        x2 = segment[1][0],
        y2 = segment[1][1];

    if (x1 === x2) {
        return (y1 < y2) ? Infinity : - Infinity;
    } else {
        return (y2 - y1) / (x2 - x1);
    }
}

function getY (segment, x) {
    var begin = segment[0],
        end = segment[1],
        span = segment[1][0] - segment[0][0],
        deltaX0, // разница между x и x начала отрезка
        deltaX1, // разница между x конца отрезка и x
        ifac,    // пропорция deltaX0 к проекции
        fac;     // пропорция deltaX1 к проекции

    // в случае, если x не пересекается с проекцией отрезка на ось x,
    // возврщает y начала или конца отрезка
    if (x <= begin[0]) {
        return begin[1];
    } else if (x >= end[0]) {
        return end[1];
    }

    // если x лежит внутри проекции отрезка на ось x
    // вычисляет пропорции
    deltaX0 = x - begin[0];
    deltaX1 = end[0] - x;

    if (deltaX0 > deltaX1) {
        ifac = deltaX0 / span
        fac = 1 - ifac;
    } else {
        fac = deltaX1 / span
        ifac = 1 - fac;
    }

    return (begin[1] * fac) + (end[1] * ifac);
}

function getY00(segment, x) {
    var x1 = segment[0][0],
        y1 = segment[0][1],
        x2 = segment[1][0],
        y2 = segment[1][1];

    // если отрезок горизонтален,
    // вернем просто y правого конца
    if (Math.abs(x2 - x1) < EPS) {
        return y1;
    }
    // в остальных случаях
    // берем пропорцию
    return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

module.exports = new Utils;
