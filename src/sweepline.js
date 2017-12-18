function Sweepline(position) {
    this.x = null;
    this.position = position;
}

Sweepline.prototype.setPosition = function (position) {
    this.position = position;
}
Sweepline.prototype.setX = function (x) {
    this.x = x;
}

module.exports = Sweepline;
