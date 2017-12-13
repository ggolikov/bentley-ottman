var Point = function (coords, type) {
    this.x = coords[0];
    this.y = coords[1];
    this.type = type;
    this.segments = [];
}

module.exports = Point;
