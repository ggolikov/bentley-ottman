var Point = function (coords, type, segmentID) {
	this.segmentID = segmentID;
    this.x = coords[0];
    this.y = coords[1];
    this.type = type;
    this.segments = [];
}

module.exports = Point;
