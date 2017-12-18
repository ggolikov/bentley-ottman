var EPS = 1E-9;
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

function findSegmentsIntersection (a, b) {
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
            if (!between(x2, x, x1)) {return false;}
        } else {
            if (!between(x1, x, x2)) {return false;}
        }
        if (y1 >= y2) {
            if (!between(y2, y, y1)) {return false;}
        } else {
            if (!between(y1, y, y2)) {return false;}
        }
        if (x3 >= x4) {
            if (!between(x4, x, x3)) {return false;}
        } else {
            if (!between(x3, x, x4)) {return false;}
        }
        if (y3 >= y4) {
            if (!between(y4, y, y3)) {return false;}
        } else {
            if (!between(y3, y, y4)) {return false;}
        }
    }
    return [x, y];
}

function between (a, b, c) {
    return a-EPS <= b && b <= c+EPS;
}


function compareSegments(a, b) {
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

};

function comparePoints(a, b) {
    var aIsArray = Array.isArray(a),
        bIsArray = Array.isArray(b),
        x1 = aIsArray ? a[0] : a.x,
        y1 = aIsArray ? a[1] : a.y,
        x2 = bIsArray ? b[0] : b.x,
        y2 = bIsArray ? b[1] : b.y;

    if (x1 > x2 || (x1 === x2 && y1 > y2)) {
        return 1;
    } else if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return -1;
    } else if (Math.abs(x1 - x2) < EPS && Math.abs(y1 - y2) < EPS ) {
        console.log('x1');
        console.log(Math.abs(x1));
        console.log('x2');
        console.log(Math.abs(x2));
        // console.log(Math.abs(y1 - y2));
        return 0;
    }
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
};

function getY(segment, x) {
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
};

module.exports = {
    EPS: EPS,
    onSegment: onSegment,
    direction: direction,
    segmentsIntersect: segmentsIntersect,
    findSegmentsIntersection: findSegmentsIntersection,
    compareSegments: compareSegments,
    comparePoints: comparePoints
}
