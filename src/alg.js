var EPS = 1E-9;

function Point(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * @constructor {Segment}
 * p {Point} left point
 * q {Point} right point
 */
function Segment(p, q) {
    this.p = p;
    this.q = q;
}
// получить y отрезка в точке с координатой x
Segment.prototype.getY = function (x) {
    // если отрезок вертикален,
    // вернем просто y правого конца
	if (Math.abs(p.x - q.x) < EPS) {
        return p.y;
    }
    // в остальных случаях
    // берем пропорцию
	return p.y + (q.y - p.y) * (x - p.x) / (q.x - p.x);
}

// определить пересечение проекций отрезков на оси
// если макс первых координат меньше мин вторых координат
function intersect1d(l1, r1, l2, r2) {
    if (l1 > r1)  swap (l1, r1);
    if (l2 > r2)  swap (l2, r2);
    return Math.max(l1, l2) <= Math.min(r1, r2) + EPS;
}

/**
 * point-segment orientation
 * vector multiple
 * a {Point} point
 * b {Point} point
 * c {Point} point
 */
function vec (a, b, c) {
	var s = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
	return Math.abs(s) < EPS ? 0 :  s > 0 ? 1 : -1;
}


/**
* detect segments intersection
* a {Segment}
* b {Segment}
*/
function intersect (a, b) {
	return intersect1d(a.p.x, a.q.x, b.p.x, b.q.x)
		&& intersect1d(a.p.y, a.q.y, b.p.y, b.q.y)
		&& vec(a.p, a.q, b.p) * vec(a.p, a.q, b.q) <= 0
		&& vec(b.p, b.q, a.p) * vec(b.p, b.q, a.q) <= 0;
}

bool operator< (const seg & a, const seg & b) {
	double x = max (min (a.p.x, a.q.x), min (b.p.x, b.q.x));
	return a.get_y(x) < b.get_y(x) - EPS;
}

/**
* compare segments position
* a {Segment}
* b {Segment}
*/
function compareSegments (a, b) {
	var x = Math.max(Math.min(a.p.x, a.q.x), Math.min(b.p.x, b.q.x));
	return a.getY(x) < b.getY(x) - EPS;
}
