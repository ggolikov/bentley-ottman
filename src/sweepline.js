// first we define a sweepline
// sweepline has to update its status

/**
 *  balanced AVL BST for storing an event queue and sweepline status
 */

var Tree = require('avl');

/*
 * the events queue contains points according to their coordinates
 *
 */
var queue = new Tree(function (a, b) {
    return a.y > b.y || (a.y === b.y && a.x < b.x);
});

var status = new Tree();
console.log(queue);
console.log(status);


/**
 * @param {Object} status set of segments intersecting sweepline
 */

function SweepLine(status, queue) {
    this.status = status;
    this.queue = queue;
}

SweepLine.prototype = {

    /**
     * the status updates at some @event points
     */
    update: function (status) {
        this.status = status;
        this.test();
    },

    test: function (event) {

    }
}

module.exports = SweepLine;
