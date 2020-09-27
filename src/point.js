var Point = function (coords, type, segmentIndex) {
	this.segmentIndex = segmentIndex;
    this.x = coords[0];
    this.y = coords[1];
    this.type = type;
    this.segments = [];
}

module.exports = Point;
