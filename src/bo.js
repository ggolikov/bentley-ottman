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

// используется для избежания ошибок округления
var EPS = 1E-9;

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
 * @param {object} point точка события
 * @param {object} segment сегмент, которому приладлежит точка
 * @param {number} slope уклон между точками
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
    var currentX,   // текущий x свиплайна
        ay,         // y точки пересечения отрезка события a со свиплайном
        by,         // y точки пересечения отрезка события b со свиплайном
        deltaY,     // разница y точек пересечения
        deltaX1,    // разница x начал отрезков
        deltaX2;    // разница x концов отрезков

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

        // сравнение надо проводить с эпсилоном,
        // иначе возможны ошибки округления
        if (Math.abs(deltaY) > EPS) {
            return deltaY < 0 ? -1 : 1;
        // если y обеих событий равны
        // проверяем угол прямых
        // чем круче прямая, тем ниже ее левый конец, значит событие располагаем ниже
        } else {
            var aSlope = a.slope,
                bSlope = b.slope;

            if (aSlope !== bSlope) {
                if (sweepLine.before) {
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
        deltaX1 = a.segment[0].x - b.segment[0].x;

        // проверим взаимное положение левых концов
        if (deltaX1 !== 0) {
            return deltaX1 < 0 ? -1 : 1;
        }

        // проверим взаимное положение правых концов
        deltaX2 = a.segment[1].x - b.segment[1].x;

        if (deltaX2 !== 0) {
            return deltaX2 < 0 ? -1 : 1;
        }

        // отрезки совпадают
        return 0;
    }
}

/**
 * свиплайн
 */

function SweepLine() {
    this.intersections = {};
    this.currentEventPointX = null;
    this.eventsCurrentSweep = RBTree(Event.Compare, this);
    this.before = true;
}

Sweepline.prototype = {

    //возвращает неотсортированный список точек пересечения
    getIntersections: function () {
        return Object.keys(this.intersections);
    },

    // необязательно, но полезно
    // возвращает списко пар "точка/отрезок"
    getIntersectionsWithSegments: function () {
        var result = [];

        for (var key in this.intersections) {
            result.push...
        }
    },

    /**
     * проверяет наличие пересечения между событиями a и b
     * @param {event} a событие
     * @param {event} b событие
     *
     */
    checkIntersection: function (a, b) {
        // a и b должны существовать
        // и обязательно не должны быть точками пересечения
        if (!a || !b ) return;
        if (a.type === types.INTERSECTION || b.type === types.INTERSECTION) return;

        if (a === b) return;

        // находим пересечение отрезков событий
        var p = findIntersection(a.segment[0], a.segment[1], b.segment[0], b.segment[1]);

        if (!p) return;

        // потом, сейчас не важно
        // # If the intersection is formed by both the segment endings, AND
        // # USE_IGNORE_SEGMENT_ENDINGS is true,
        // # return from this method.
        // if USE_IGNORE_SEGMENT_ENDINGS:
        //     if ((len_squared_v2v2(p, a.segment[0]) < NUM_EPS_SQ or
        //          len_squared_v2v2(p, a.segment[1]) < NUM_EPS_SQ) and
        //         (len_squared_v2v2(p, b.segment[0]) < NUM_EPS_SQ or
        //          len_squared_v2v2(p, b.segment[1]) < NUM_EPS_SQ)):
        //
        //         return

        // добавим пересе=чения в коллекцию пересечений свиплайна
        // # Add the intersection.
        // events_for_point = self.intersections.pop(p, set())
        // is_new = len(events_for_point) == 0
        // events_for_point.add(a)
        // events_for_point.add(b)
        // self.intersections[p] = events_for_point
        //
        // # If the intersection occurs to the right of the sweep line, OR
        // # if the intersection is on the sweep line and it's above the
        // # current event-point, add it as a new Event to the queue.
        // if is_new and p[X] >= self._current_event_point_x:
        //     event_isect = Event(Event.Type.INTERSECTION, p, None, None)
        //     self.queue.offer(p, event_isect)

    },
    /**
     * редкий кейс
     * @param {point} p точка
     */
    sweepTo: function (p) {
        if (p.x === this.currentEventPointX) return;
    },

    insert: function (event) {
        this.eventsCurrentSweep.insert(event);
    },

    remove: function (event) {
        this.eventsCurrentSweep.remove(event);
    },

    above: function (event) {
        this.eventsCurrentSweep.next(event);
    },

    above: function (event) {
        this.eventsCurrentSweep.prev(event);
    },
    /**
     * обработка события
     * @param {point} p точка
     * @param {array} eventsCurrent события
     */
    handle: function (p, eventsCurrent) {
        if (!eventsCurrent.length) return;

        for (var i = 0; i < eventsCurrent.length; i++) {
            this.handleEvent(eventsCurrent[i]);
        }
    }

    handleEvent: function (event) {
        var type = events.type,
            reinsertStack = [],
            eventSet, e,
            above, below;

        if (type === types.START) {
            this.before = false;
            this.insert(event);

            above = this.above(event);
            below = this.below(event);

            this.checkIntersection(event, above);
            this.checkIntersection(event, below);

        } else if (type === types.END) {
            this.before = true;

            above = this.above(event);
            below = this.below(event);

            this.remove(event);

            this.checkIntersection(above, below);
        } if (type === types.INTERSECTION) {
            this.before = true;
            // все пересечения с данным событием
            eventSet = this.intersections[event.point];
            // делаем из точек пересечений массив
            for (var key in eventSet) {
                if (this.remove(key)) {
                    reinsertStack.push(key);
                }
            }

            while (reinsertStack.length) {
                e = reinsertStack.pop();
                this.insert(e);

                above = this.above(e);
                below = this.below(e);

                this.checkIntersection(e, above);
                this.checkIntersection(e, below);
            }
        }
    }
}

// вспомогательные математические формулы

/**
 * подсчет уклона
 *
 *       /|
 *     /  |
 *   /    | a
 * /      |
 * -------
 *    b
 *
 * return a / b
 *
 * @param {point} p1 первая точка
 * @param {point} p2 вторая точка
 * @return {number} slope уклон между точками
 */
function getSlope(p1, p2) {
    if (p1.x === p2.x) {
        return (p1.y < p2.y) ? Infinity : - Infinity;
    } else {
        return (p2.y - p1.y) / (p2.x - p1.x);
    }
}
/**
 * @param {point} a первый отрезок
 * @param {point} b второй отрезок
 * @return {number}
 */
function sub(a, b) {
    return [a[0] - b[0], a[1] - b[1]]
}

/**
 * определение пересечения между 4 точками
 * @param {point} v1 начало 1 отрезка
 * @param {point} v2 конец 1 отрезка
 * @param {point} v3 начало 2 отрезка
 * @param {point} v4 конец 2 отрезка
 */
function findIntersection (v1, v2, v3, v4) {
    var tv1,
        tv2,
        tv3,
        div,
        vi,
        fac;

    // упорядочиваем концы отрезков по возрастанию
    if (v1 > v2) {
        tv1 = v1;

        v1 = v2;
        v2 = tv1;
    }

    if (v3 > v4) {
        tv3 = v3;

        v3 = v4;
        v4 = tv3;
    }

    // упорядочиваем отрезки по возрастанию
    if (v1 > v3 && v2 > v4) {
        tv1 = v1;
        tv2 = v2;
        tv3 = v3;

        v1 = v3;
        v2 = v4;
        v3 = tv1;
        v4 = tv2;
    }
    // определим векторное произведение
    div = (v2[0] - v1[0]) * (v4[1] - v3[1]) - (v2[1] - v1[1]) * (v4[0] - v3[0])

    if (div === 0) return false;

    vi = (((v3[0] - v4[0]) *
           (v1[0] * v2[1] - v1[1] * v2[0]) - (v1[0] - v2[0]) *
           (v3[0] * v4[1] - v3[1] * v4[0])) / div,
          ((v3[1] - v4[1]) *
           (v1[0] * v2[1] - v1[1] * v2[0]) - (v1[1] - v2[1]) *
           (v3[0] * v4[1] - v3[1] * v4[0])) / div,
          )
    fac =
}
