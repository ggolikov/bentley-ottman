// константы
// игнорировать переечения на концах отрезков
var USE_IGNORE_SEGMENT_ENDINGS = true,
    USE_DEBUG = true,
    USE_VERBOSE = false,
    // использовать доп проверки
    USE_PARANOID = false,
    // использовать вертикальные отрезки
    // (событие 'START_VERTICAL')
    USE_VERTICAL = true;

var X = 0,
    Y = 1;

// типы событий
var types = {
    END: 0,
    INTERSECTION: 1,
    START: 2
}

// обработка вертикальных отрезков
// (отсутствует в классическом алгоритме)
if (USE_VERTICAL) {
    types.START_VERTICAL = 3;
}

/**
 * @param {string} type тип события (0, 1, 2, 3)
 * @param {object} point текущая точка свиплайна
 * @param {object} segment сегмент, которому приладлежит точка
 * @param {} slope
 */

function Event (type, point, segment, slope) {
    this.type = type;
    this.point = point;
    this.segment = segment;

    // для точки пересечения slope === null
    this.slope = slope;

    // длина проекции отрезка на ось x
    //            .
    //    .       |
    //    |       |
    //    |       |
    //    x0______x1
    //
    if (segment) {
        this.span = segment[1].x - segment[0].x
    }

    if (USE_DEBUG) {
        this.other = null;
        this.in_sweep = false;
    }
}

Event.prototype = {
    /**
     * функция для сравнения точек
     */
    hash: function () {
        return this.point;
    },

    /**
     * проверка на вертикальность отрезка
     */
    isVertical: function () {
        // this.segment[0].x === this.segment[1].x
        return this.span === 0;
    },

    /**
    * возвращает y точки, принадлежащей отрезку, при данном x
    *         .
    *        /
    *  y ---/
    *      /|
    *     / |
    *    .  x
    * @param {number} x заданный x
    * @return {number} y
    */
    yInterceptX: function (x) {
        if (USE_VERTICAL) {
            var vertical = this.isVertical(),
                begin = this.segment[0],
                end = this.segment[1],
                span = this.span,
                deltaX0, // разница между x и x начала отрезка
                deltaX1, // разница между x конца отрезка и x
                ifac,    // пропорция deltaX0 к проекции
                fac;     // пропорция deltaX1 к проекции

            // vertical events only for comparison (above_all check)
            // never added into the binary-tree its self
            // для вертикального отрезка проверка не производится
            if (vertical) {
                return;
            }

            // в случае, если x не пересекается с проекцией отрезка на ось x,
            // возврщает y начала или конца отрезка
            if (x <= begin.x) {
                return begin.y;
            } else if (x >= end.x) {
                return end.y;
            }

            // если x лежит внутри проекции отрезка на ось x
            // вычисляет пропорции
            deltaX0 = x - begin.x;
            deltaX1 = end.x - x;

            if (deltaX0 > deltaX1) {
                ifac = deltaX0 / span
                fac = 1 - ifac;
            } else {
                fac = deltaX1 / span
                ifac = 1 - fac;
            }

            return (begin.y * fac) + (end.y * ifac);
        }
    }
}

/**
 * @static compare сравнивает события относительно текущего положения свиплайна
 * @param {object} sweepLine
 * @param {event} a событие
 * @param {event} b событие
 */

 Event.compare = function (sweepLine, a, b) {
    var currentX,
        ay,
        by,
        deltaY;

     // события равны
    if (a === b) {
        return 0;
    }

    if (USE_DEBUG) {
        if (a.other = b) {
            return 0;
        }

        // текущее положение свиплайна - это его x.
        // получим y отрезков сравниваемых событий в текущей точке
        currentX = sweepLine.currentEventPointX;
        ay = a.yInterceptX(currentX);
        by = b.yInterceptX(currentX);

        // если нам попался вертикальный отрезок,
        // то этой точкой является y точки события
        // (ведь для вертикального отрезка не производится сравнение по x)
        if (USE_VERTICAL) {
            ay = ay || a.point.y;
            by = by || b.point.y;
        }

        deltaY = ay - by;
    }
 }
