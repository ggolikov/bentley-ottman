(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [
// 37.55418024945381,55.76055337506722,37.682212327238695,55.78647534693535
// ├── 37.523331638283224,55.70130362480638,37.675813496409205,55.7790723551507
// └── 37.583138738835785,55.7661318456073,37.59800467089051,55.738073634482035
// 37.66389916736505,55.72973882992644,37.68932908129723,55.73659234408807

[[37.55418024945381, 55.76055337506722], [37.682212327238695, 55.78647534693535]], [[37.523331638283224, 55.70130362480638], [37.675813496409205, 55.7790723551507]], [[37.583138738835785, 55.7661318456073], [37.59800467089051, 55.738073634482035]], [[37.66389916736505, 55.72973882992644], [37.68932908129723, 55.73659234408807]]];

},{}],2:[function(require,module,exports){
var findIntersections = require('../../index');
var data = require('../data/index.js');

var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}),
    point = L.latLng([55.753210, 37.621766]),
    map = new L.Map('map', { layers: [osm], center: point, zoom: 11, maxZoom: 22 }),
    root = document.getElementById('content');

window.map = map;

var bounds = map.getBounds(),
    n = bounds._northEast.lat,
    e = bounds._northEast.lng,
    s = bounds._southWest.lat,
    w = bounds._southWest.lng,
    height = n - s,
    width = e - w,
    qHeight = height / 4,
    qWidth = width / 4,
    lines = [];

var points = turf.random('points', 8, {
    bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
});

var coords = points.features.map(function (feature) {
    return feature.geometry.coordinates;
});

for (var i = 0; i < coords.length; i += 2) {
    lines.push([coords[i], coords[i + 1]]);
}

// drawLines(lines);
drawLines(data);

// var ps = findIntersections(lines, map);
var ps = findIntersections(data, map);

ps.forEach(function (p) {
    L.circleMarker(L.latLng(p.slice().reverse()), { radius: 5, color: 'blue', fillColor: 'blue' }).addTo(map);
});

function drawLines(array) {
    array.forEach(function (line) {
        var begin = line[0],
            end = line[1];

        L.circleMarker(L.latLng(begin), { radius: 2, fillColor: "#FFFF00", weight: 2 }).addTo(map);
        L.circleMarker(L.latLng(end), { radius: 2, fillColor: "#FFFF00", weight: 2 }).addTo(map);
        L.polyline([begin, end], { weight: 1 }).addTo(map);
    });
}

// console.log(ps);

},{"../../index":3,"../data/index.js":1}],3:[function(require,module,exports){
var findIntersections = require('./src/sweepline.js');

module.exports = findIntersections;

},{"./src/sweepline.js":5}],4:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.avl = factory());
}(this, (function () { 'use strict';

/**
 * Prints tree horizontally
 * @param  {Node}                       root
 * @param  {Function(node:Node):String} [printNode]
 * @return {String}
 */
function print (root, printNode) {
  if ( printNode === void 0 ) printNode = function (n) { return n.key; };

  var out = [];
  row(root, '', true, function (v) { return out.push(v); }, printNode);
  return out.join('');
}

/**
 * Prints level of the tree
 * @param  {Node}                        root
 * @param  {String}                      prefix
 * @param  {Boolean}                     isTail
 * @param  {Function(in:string):void}    out
 * @param  {Function(node:Node):String}  printNode
 */
function row (root, prefix, isTail, out, printNode) {
  if (root) {
    out(("" + prefix + (isTail ? '└── ' : '├── ') + (printNode(root)) + "\n"));
    var indent = prefix + (isTail ? '    ' : '│   ');
    if (root.left)  { row(root.left,  indent, false, out, printNode); }
    if (root.right) { row(root.right, indent, true,  out, printNode); }
  }
}


/**
 * Is the tree balanced (none of the subtrees differ in height by more than 1)
 * @param  {Node}    root
 * @return {Boolean}
 */
function isBalanced(root) {
  if (root === null) { return true; } // If node is empty then return true

  // Get the height of left and right sub trees
  var lh = height(root.left);
  var rh = height(root.right);

  if (Math.abs(lh - rh) <= 1 &&
      isBalanced(root.left)  &&
      isBalanced(root.right)) { return true; }

  // If we reach here then tree is not height-balanced
  return false;
}

/**
 * The function Compute the 'height' of a tree.
 * Height is the number of nodes along the longest path
 * from the root node down to the farthest leaf node.
 *
 * @param  {Node} node
 * @return {Number}
 */
function height(node) {
  return node ? (1 + Math.max(height(node.left), height(node.right))) : 0;
}

// function createNode (parent, left, right, height, key, data) {
//   return { parent, left, right, balanceFactor: height, key, data };
// }

/**
 * @typedef {{
 *   parent:        Node|Null,
 *   left:          Node|Null,
 *   right:         Node|Null,
 *   balanceFactor: Number,
 *   key:           any,
 *   data:          object?
 * }} Node
 */

/**
 * @typedef {*} Key
 */

/**
 * Default comparison function
 * @param {*} a
 * @param {*} b
 */
function DEFAULT_COMPARE (a, b) { return a > b ? 1 : a < b ? -1 : 0; }


/**
 * Single left rotation
 * @param  {Node} node
 * @return {Node}
 */
function rotateLeft (node) {
  var rightNode = node.right;
  node.right    = rightNode.left;

  if (rightNode.left) { rightNode.left.parent = node; }

  rightNode.parent = node.parent;
  if (rightNode.parent) {
    if (rightNode.parent.left === node) {
      rightNode.parent.left = rightNode;
    } else {
      rightNode.parent.right = rightNode;
    }
  }

  node.parent    = rightNode;
  rightNode.left = node;

  node.balanceFactor += 1;
  if (rightNode.balanceFactor < 0) {
    node.balanceFactor -= rightNode.balanceFactor;
  }

  rightNode.balanceFactor += 1;
  if (node.balanceFactor > 0) {
    rightNode.balanceFactor += node.balanceFactor;
  }
  return rightNode;
}


function rotateRight (node) {
  var leftNode = node.left;
  node.left = leftNode.right;
  if (node.left) { node.left.parent = node; }

  leftNode.parent = node.parent;
  if (leftNode.parent) {
    if (leftNode.parent.left === node) {
      leftNode.parent.left = leftNode;
    } else {
      leftNode.parent.right = leftNode;
    }
  }

  node.parent    = leftNode;
  leftNode.right = node;

  node.balanceFactor -= 1;
  if (leftNode.balanceFactor > 0) {
    node.balanceFactor -= leftNode.balanceFactor;
  }

  leftNode.balanceFactor -= 1;
  if (node.balanceFactor < 0) {
    leftNode.balanceFactor += node.balanceFactor;
  }

  return leftNode;
}


// function leftBalance (node) {
//   if (node.left.balanceFactor === -1) rotateLeft(node.left);
//   return rotateRight(node);
// }


// function rightBalance (node) {
//   if (node.right.balanceFactor === 1) rotateRight(node.right);
//   return rotateLeft(node);
// }


var Tree = function Tree (comparator) {
  this._comparator = comparator || DEFAULT_COMPARE;
  this._root = null;
  this._size = 0;
};

var prototypeAccessors = { size: {} };


/**
 * Clear the tree
 */
Tree.prototype.destroy = function destroy () {
  this._root = null;
};

/**
 * Number of nodes
 * @return {Number}
 */
prototypeAccessors.size.get = function () {
  return this._size;
};


/**
 * Whether the tree contains a node with the given key
 * @param{Key} key
 * @return {Boolean}
 */
Tree.prototype.contains = function contains (key) {
  if (this._root){
    var node     = this._root;
    var comparator = this._comparator;
    while (node){
      var cmp = comparator(key, node.key);
      if    (cmp === 0) { return true; }
      else if (cmp < 0) { node = node.left; }
      else              { node = node.right; }
    }
  }
  return false;
};


/* eslint-disable class-methods-use-this */

/**
 * Successor node
 * @param{Node} node
 * @return {Node|Null}
 */
Tree.prototype.next = function next (node) {
  var successor = node;
  if (successor) {
    if (successor.right) {
      successor = successor.right;
      while (successor && successor.left) { successor = successor.left; }
    } else {
      successor = node.parent;
      while (successor && successor.right === node) {
        node = successor; successor = successor.parent;
      }
    }
  }
  return successor;
};


/**
 * Predecessor node
 * @param{Node} node
 * @return {Node|Null}
 */
Tree.prototype.prev = function prev (node) {
  var predecessor = node;
  if (predecessor) {
    if (predecessor.left) {
      predecessor = predecessor.left;
      while (predecessor && predecessor.right) { predecessor = predecessor.right; }
    } else {
      predecessor = node.parent;
      while (predecessor && predecessor.left === node) {
        node = predecessor;
        predecessor = predecessor.parent;
      }
    }
  }
  return predecessor;
};
/* eslint-enable class-methods-use-this */


/**
 * @param{Function(node:Node):void} fn
 * @return {AVLTree}
 */
Tree.prototype.forEach = function forEach (fn) {
  var current = this._root;
  var s = [], done = false, i = 0;

  while (!done) {
    // Reach the left most Node of the current Node
    if (current) {
      // Place pointer to a tree node on the stack
      // before traversing the node's left subtree
      s.push(current);
      current = current.left;
    } else {
      // BackTrack from the empty subtree and visit the Node
      // at the top of the stack; however, if the stack is
      // empty you are done
      if (s.length > 0) {
        current = s.pop();
        fn(current, i++);

        // We have visited the node and its left
        // subtree. Now, it's right subtree's turn
        current = current.right;
      } else { done = true; }
    }
  }
  return this;
};


/**
 * Returns all keys in order
 * @return {Array<Key>}
 */
Tree.prototype.keys = function keys () {
  var current = this._root;
  var s = [], r = [], done = false;

  while (!done) {
    if (current) {
      s.push(current);
      current = current.left;
    } else {
      if (s.length > 0) {
        current = s.pop();
        r.push(current.key);
        current = current.right;
      } else { done = true; }
    }
  }
  return r;
};


/**
 * Returns `data` fields of all nodes in order.
 * @return {Array<*>}
 */
Tree.prototype.values = function values () {
  var current = this._root;
  var s = [], r = [], done = false;

  while (!done) {
    if (current) {
      s.push(current);
      current = current.left;
    } else {
      if (s.length > 0) {
        current = s.pop();
        r.push(current.data);
        current = current.right;
      } else { done = true; }
    }
  }
  return r;
};


/**
 * Returns node with the minimum key
 * @return {Node|Null}
 */
Tree.prototype.minNode = function minNode () {
  var node = this._root;
  if (!node) { return null; }
  while (node.left) { node = node.left; }
  return node;
};


/**
 * Returns node with the max key
 * @return {Node|Null}
 */
Tree.prototype.maxNode = function maxNode () {
  var node = this._root;
  if (!node) { return null; }
  while (node.right) { node = node.right; }
  return node;
};


/**
 * Min key
 * @return {Key}
 */
Tree.prototype.min = function min () {
  var node = this._root;
  if (!node) { return null; }
  while (node.left) { node = node.left; }
  return node.key;
};

/**
 * Max key
 * @return {Key|Null}
 */
Tree.prototype.max = function max () {
  var node = this._root;
  if (!node) { return null; }
  while (node.right) { node = node.right; }
  return node.key;
};


/**
 * @return {Boolean}
 */
Tree.prototype.isEmpty = function isEmpty () {
  return !this._root;
};


/**
 * Removes and returns the node with smallest key
 * @return {Node|Null}
 */
Tree.prototype.pop = function pop () {
  var node = this._root, returnValue = null;
  if (node) {
    while (node.left) { node = node.left; }
    returnValue = { key: node.key, data: node.data };
    this.remove(node.key);
  }
  return returnValue;
};


/**
 * Find node by key
 * @param{Key} key
 * @return {Node|Null}
 */
Tree.prototype.find = function find (key) {
  var root = this._root;
  if (root === null)  { return null; }
  if (key === root.key) { return root; }

  var subtree = root, cmp;
  var compare = this._comparator;
  while (subtree) {
    cmp = compare(key, subtree.key);
    if    (cmp === 0) { return subtree; }
    else if (cmp < 0) { subtree = subtree.left; }
    else              { subtree = subtree.right; }
  }

  return null;
};


/**
 * Insert a node into the tree
 * @param{Key} key
 * @param{*} [data]
 * @return {Node|Null}
 */
Tree.prototype.insert = function insert (key, data) {
    var this$1 = this;

  if (!this._root) {
    this._root = {
      parent: null, left: null, right: null, balanceFactor: 0,
      key: key, data: data
    };
    this._size++;
    return this._root;
  }

  var compare = this._comparator;
  var node  = this._root;
  var parent= null;
  var cmp   = 0;

  while (node) {
    cmp = compare(key, node.key);
    parent = node;
    if    (cmp === 0) { return null; }
    else if (cmp < 0) { node = node.left; }
    else              { node = node.right; }
  }

  var newNode = {
    left: null, right: null, balanceFactor: 0,
    parent: parent, key: key, data: data,
  };
  if (cmp < 0) { parent.left= newNode; }
  else       { parent.right = newNode; }

  while (parent) {
    if (compare(parent.key, key) < 0) { parent.balanceFactor -= 1; }
    else                            { parent.balanceFactor += 1; }

    if      (parent.balanceFactor === 0) { break; }
    else if (parent.balanceFactor < -1) {
      //let newRoot = rightBalance(parent);
      if (parent.right.balanceFactor === 1) { rotateRight(parent.right); }
      var newRoot = rotateLeft(parent);

      if (parent === this$1._root) { this$1._root = newRoot; }
      break;
    } else if (parent.balanceFactor > 1) {
      // let newRoot = leftBalance(parent);
      if (parent.left.balanceFactor === -1) { rotateLeft(parent.left); }
      var newRoot$1 = rotateRight(parent);

      if (parent === this$1._root) { this$1._root = newRoot$1; }
      break;
    }
    parent = parent.parent;
  }

  this._size++;
  return newNode;
};


/**
 * Removes the node from the tree. If not found, returns null.
 * @param{Key} key
 * @return {Node:Null}
 */
Tree.prototype.remove = function remove (key) {
    var this$1 = this;

  if (!this._root) { return null; }

  var node = this._root;
  var compare = this._comparator;

  while (node) {
    var cmp = compare(key, node.key);
    if    (cmp === 0) { break; }
    else if (cmp < 0) { node = node.left; }
    else              { node = node.right; }
  }
  if (!node) { return null; }
  var returnValue = node.key;

  if (node.left) {
    var max = node.left;

    while (max.left || max.right) {
      while (max.right) { max = max.right; }

      node.key = max.key;
      node.data = max.data;
      if (max.left) {
        node = max;
        max = max.left;
      }
    }

    node.key= max.key;
    node.data = max.data;
    node = max;
  }

  if (node.right) {
    var min = node.right;

    while (min.left || min.right) {
      while (min.left) { min = min.left; }

      node.key= min.key;
      node.data = min.data;
      if (min.right) {
        node = min;
        min = min.right;
      }
    }

    node.key= min.key;
    node.data = min.data;
    node = min;
  }

  var parent = node.parent;
  var pp   = node;

  while (parent) {
    if (parent.left === pp) { parent.balanceFactor -= 1; }
    else                  { parent.balanceFactor += 1; }

    if      (parent.balanceFactor < -1) {
      //let newRoot = rightBalance(parent);
      if (parent.right.balanceFactor === 1) { rotateRight(parent.right); }
      var newRoot = rotateLeft(parent);

      if (parent === this$1._root) { this$1._root = newRoot; }
      parent = newRoot;
    } else if (parent.balanceFactor > 1) {
      // let newRoot = leftBalance(parent);
      if (parent.left.balanceFactor === -1) { rotateLeft(parent.left); }
      var newRoot$1 = rotateRight(parent);

      if (parent === this$1._root) { this$1._root = newRoot$1; }
      parent = newRoot$1;
    }

    if (parent.balanceFactor === -1 || parent.balanceFactor === 1) { break; }

    pp   = parent;
    parent = parent.parent;
  }

  if (node.parent) {
    if (node.parent.left === node) { node.parent.left= null; }
    else                         { node.parent.right = null; }
  }

  if (node === this._root) { this._root = null; }

  this._size--;
  return returnValue;
};


/**
 * Returns true if the tree is balanced
 * @return {Boolean}
 */
Tree.prototype.isBalanced = function isBalanced$1 () {
  return isBalanced(this._root);
};


/**
 * String representation of the tree - primitive horizontal print-out
 * @param{Function(Node):String} [printNode]
 * @return {String}
 */
Tree.prototype.toString = function toString (printNode) {
  return print(this._root, printNode);
};

Object.defineProperties( Tree.prototype, prototypeAccessors );

return Tree;

})));


},{}],5:[function(require,module,exports){
var Tree = require('avl'),
    utils = require('./utils');

/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {
    var queue = new Tree(utils.comparePoints),
        status = new Tree(utils.compareSegments),
        output = new Tree(utils.comparePoints);

    segments.forEach(function (segment) {
        segment.sort(utils.comparePoints);
        var begin = segment[0],
            end = segment[1],
            beginData = {
            point: begin,
            type: 'begin',
            segment: segment
        },
            endData = {
            point: end,
            type: 'end',
            segment: segment
        };
        queue.insert(begin, beginData);
        queue.insert(end, endData);
    });

    var i = 0;

    while (!queue.isEmpty()) {
        var event = queue.pop();
        var p = event.data.point;

        console.log(i + ') current point: ' + event.data.point.toString());
        console.log('   point type: ' + event.data.type);
        // console.log('   queue: ' + queue.toString());
        console.log('   status: ' + status.toString());

        if (event.data.type === 'begin') {

            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, { radius: 4, color: 'green', fillColor: 'green' }).addTo(map);

            var segmentData = {
                above: null,
                below: null
            };

            status.insert(event.data.segment);
            var segE = status.find(event.data.segment);

            var lls = segE.key.map(function (p) {
                return L.latLng(p.slice().reverse());
            });
            var line = L.polyline(lls, { color: 'green' }).addTo(map);

            line.bindPopup('added' + i);

            var segA = status.prev(segE);
            var segB = status.next(segE);

            if (segB) {
                segE.above = segB;
                segE.above.below = segE;
            }
            if (segA) {
                segE.below = segA;
                segE.below.above = segE;
            }

            if (segA) {
                var eaIntersectionPoint = utils.findSegmentsIntersection(segE.key, segA.key);

                if (eaIntersectionPoint) {
                    var eaIntersectionPointData = {
                        point: eaIntersectionPoint,
                        type: 'intersection',
                        segments: [segE.key, segA.key]
                    };
                    queue.insert(eaIntersectionPoint, eaIntersectionPointData);
                    console.log('inserted point:' + eaIntersectionPoint.toString());
                }
            }

            if (segB) {
                var ebIntersectionPoint = utils.findSegmentsIntersection(segE.key, segB.key);

                if (ebIntersectionPoint) {
                    var ebIntersectionPointData = {
                        point: ebIntersectionPoint,
                        type: 'intersection',
                        segments: [segB.key, segE.key]
                    };
                    queue.insert(ebIntersectionPoint, ebIntersectionPointData);
                    console.log('inserted ebIntersectionPoint:' + ebIntersectionPoint.toString());
                }
            }
            //         Else If (E is a right endpoint) {
        } else if (event.data.type === 'end') {
            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, { radius: 4, color: 'red', fillColor: 'red' }).addTo(map);
            var segE = status.find(event.data.segment);

            var segA = segE.above;
            var segB = segE.below;
            // var segA = status.prev(segE);
            // var segB = status.next(segE);

            /*
             * LOG
             */
            var lls = segE.key.map(function (p) {
                return L.latLng(p.slice().reverse());
            });
            var line = L.polyline(lls, { color: 'red' }).addTo(map);

            line.bindPopup('removed' + i);

            if (segA && segB) {
                var abIntersectionPoint = utils.findSegmentsIntersection(segA.key, segB.key);

                if (abIntersectionPoint) {
                    if (!output.find(abIntersectionPoint)) {
                        var abIntersectionPointData = {
                            point: abIntersectionPoint,
                            type: 'intersection',
                            segments: [segA.key, segB.key]
                            //                 Insert I into EQ;
                        };queue.insert(abIntersectionPoint, abIntersectionPointData);
                        console.log('inserted abIntersectionPoint:' + abIntersectionPoint.toString());
                    }
                }
            }
            var nx = status.next(segE);
            if (nx) {
                nx.below = segE.below;
            }

            var np = status.prev(segE);
            if (np) {
                np.above = segE.above;
            }
            status.remove(segE.key);
        } else {
            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, { radius: 4, color: 'blue', fillColor: 'blue' }).addTo(map);
            output.insert(event.data.point);
            //             Let segE1 above segE2 be E's intersecting segments in SL;
            var seg1 = status.find(event.data.segments[0]),
                seg2 = status.find(event.data.segments[1]);

            if (seg1 && seg2) {

                //             Swap their positions so that segE2 is now above segE1;
                // console.log(status);
                // status.prev(seg1) = status.find(seg2);
                // status.next(seg2) = status.find(seg1);
                //             Let segA = the segment above segE2 in SL;

                // var segA = status.next(seg1);
                //             Let segB = the segment below segE1 in SL;
                // var segB = status.prev(seg2);
                var segA = seg1.above;
                var segB = seg2.below;

                console.log(seg1.above);
                console.log(seg2.below);
                seg1.above = seg2;
                seg2.below = seg1;

                if (segA) {
                    var a2IntersectionPoint = utils.findSegmentsIntersection(seg2.key, segA.key);

                    if (a2IntersectionPoint) {
                        if (!output.find(a2IntersectionPoint)) {
                            var a2IntersectionPointData = {
                                point: a2IntersectionPoint,
                                type: 'intersection',
                                segments: [segA.key, seg2.key]
                            };
                            queue.insert(a2IntersectionPoint, a2IntersectionPointData);
                            console.log('inserted a2IntersectionPoint:' + a2IntersectionPoint.toString());
                        }
                    }
                }
                if (segB) {
                    var b1IntersectionPoint = utils.findSegmentsIntersection(seg1.key, segB.key);

                    if (b1IntersectionPoint) {
                        if (!output.find(b1IntersectionPoint)) {
                            var b1IntersectionPointData = {
                                point: b1IntersectionPoint,
                                type: 'intersection',
                                segments: [seg1.key, segB.key]
                            };
                            queue.insert(b1IntersectionPoint, b1IntersectionPointData);
                            console.log('inserted b1IntersectionPoint:' + b1IntersectionPoint.toString());
                        }
                    }
                }
            }
            i++;
        }
    }
    window.status = status;
    window.queue = queue;

    return output.keys();
}
module.exports = findIntersections;

},{"./utils":6,"avl":4}],6:[function(require,module,exports){
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
    comparePoints: function (a, b) {
        var x1 = a[0],
            y1 = a[1],
            x2 = b[0],
            y2 = b[1];

        if (x1 > x2 || x1 === x2 && y1 > y2) {
            return 1;
        } else if (x1 < x2 || x1 === x2 && y1 < y2) {
            return -1;
        } else if (x1 === x2 && y1 === y2) {
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

        if (y1 < y3) {
            return -1;
        } else if (y1 > y3) {
            return 1;
        } else {
            return 0;
        }
    },

    // compareSegments3: function (a, b) {
    //     var x1 = b[0][0],
    //         y1 = b[0][1],
    //         x2 = b[1][0],
    //         y2 = b[1][1],
    //         x3 = a[0][0],
    //         y3 = a[0][1],
    //         x4 = a[1][0],
    //         y4 = a[1][1],
    //         intersectionPoint = findSegmentsIntersection(a, b);
    //
    //     // console.log(intersectionPoint);
    //     if (!intersectionPoint) {
    //         // находим векторное произведение векторов b и b[0]a[0]
    //         var Dba1 = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
    //         // находим векторное произведение векторов b и b[0]a[1]
    //         var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
    //         // находим знак векторных произведений
    //         var D = Dba1 * Dba2;
    //
    //         if (D < 0) {
    //             return -1;
    //         } else if (D > 0) {
    //             return 1;
    //         } else if (D === 0) {
    //             return 0;
    //         }
    //     } else {
    //         console.log('they are intersecting');
    //         var intersectionX = intersectionPoint[0];
    //         var intersectionY = intersectionPoint[1];
    //
    //         // if (y3 < intersectionY) {
    //         //     return -1
    //         // } else if (y3 > intersectionY) {
    //         //     return 1;
    //         // } else if (y3 === intersectionY) {
    //         //     return 0;
    //         // }
    //         // if (x3 < intersectionX) {
    //         //     return - 1
    //         // } else if (x3 > intersectionX) {
    //         //     return 1;
    //         // } else if (x3 === intersectionX) {
    //         //     return 0;
    //         // }
    //         if (y3 < y1) {
    //             return -1
    //         } else if (y3 > y1) {
    //             return 1;
    //         } else if (y3 === y1) {
    //             return 0;
    //         }
    //
    //         // находим векторное произведение векторов b и b[0]a[0]
    //         var D = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
    //         // находим векторное произведение векторов b и b[0]a[1]
    //         // var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
    //         // находим знак векторных произведений
    //         // var D = Dba1 * Dba2;
    //
    //         if (D < 0) {
    //             return -1;
    //         } else if (D > 0) {
    //             return 1;
    //         } else if (D === 0) {
    //             return 0;
    //         }
    //
    //
    //         return 0;
    //     }
    //
    //
    //     function between(a, b, c) {
    //         var eps = 0.0000001;
    //
    //         return a-eps <= b && b <= c+eps;
    //     }
    //
    //     function findSegmentsIntersection(a, b) {
    //         var x1 = a[0][0],
    //             y1 = a[0][1],
    //             x2 = a[1][0],
    //             y2 = a[1][1],
    //             x3 = b[0][0],
    //             y3 = b[0][1],
    //             x4 = b[1][0],
    //             y4 = b[1][1];
    //         var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    //             ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    //         var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    //             ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    //         if (isNaN(x)||isNaN(y)) {
    //             return false;
    //         } else {
    //             if (x1 >= x2) {
    //                 if (between(x2, x, x1)) {return false;}
    //             } else {
    //                 if (between(x1, x, x2)) {return false;}
    //             }
    //             if (y1 >= y2) {
    //                 if (between(y2, y, y1)) {return false;}
    //             } else {
    //                 if (between(y1, y, y2)) {return false;}
    //             }
    //             if (x3 >= x4) {
    //                 if (between(x4, x, x3)) {return false;}
    //             } else {
    //                 if (between(x3, x, x4)) {return false;}
    //             }
    //             if (y3 >= y4) {
    //                 if (between(y4, y, y3)) {return false;}
    //             } else {
    //                 if (between(y3, y, y4)) {return false;}
    //             }
    //         }
    //         return [x, y];
    //     }
    //
    // },

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
        var eps = 0.0000001;

        return a - eps <= b && b <= c + eps;
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
        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y)) {
            return false;
        } else {
            if (x1 >= x2) {
                if (!this.between(x2, x, x1)) {
                    return false;
                }
            } else {
                if (!this.between(x1, x, x2)) {
                    return false;
                }
            }
            if (y1 >= y2) {
                if (!this.between(y2, y, y1)) {
                    return false;
                }
            } else {
                if (!this.between(y1, y, y2)) {
                    return false;
                }
            }
            if (x3 >= x4) {
                if (!this.between(x4, x, x3)) {
                    return false;
                }
            } else {
                if (!this.between(x3, x, x4)) {
                    return false;
                }
            }
            if (y3 >= y4) {
                if (!this.between(y4, y, y3)) {
                    return false;
                }
            } else {
                if (!this.between(y3, y, y4)) {
                    return false;
                }
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

        return (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1) === 0 && (x > x1 && x < x2 || x > x2 && x < x1);
    },

    findY: function (point1, point2, x) {
        var x1 = point1[0],
            y1 = point1[1],
            x2 = point2[0],
            y2 = point2[1],
            a = y1 - y2,
            b = x2 - x1,
            c = x1 * y2 - x2 * y1;

        return (-c - a * x) / b;
    }
};

module.exports = new Utils();

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXHN3ZWVwbGluZS5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDLENBQUMsaUJBQUQsRUFBbUIsaUJBQW5CLENBQUQsRUFBdUMsQ0FBQyxrQkFBRCxFQUFvQixpQkFBcEIsQ0FBdkMsQ0FOYSxFQU9iLENBQUMsQ0FBQyxrQkFBRCxFQUFvQixpQkFBcEIsQ0FBRCxFQUF3QyxDQUFDLGtCQUFELEVBQW9CLGdCQUFwQixDQUF4QyxDQVBhLEVBUWIsQ0FBQyxDQUFDLGtCQUFELEVBQW9CLGdCQUFwQixDQUFELEVBQXVDLENBQUMsaUJBQUQsRUFBbUIsa0JBQW5CLENBQXZDLENBUmEsRUFTYixDQUFDLENBQUMsaUJBQUQsRUFBbUIsaUJBQW5CLENBQUQsRUFBdUMsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBdkMsQ0FUYSxDQUFqQjs7O0FDQUEsSUFBSSxvQkFBb0IsUUFBUSxhQUFSLENBQXhCO0FBQ0EsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxNQUFNLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFJLEVBQUwsS0FBWSxLQUFLLEVBQWpCLENBQXZCLEtBQWdELENBQWpELEtBQXlELElBQUksRUFBSixJQUFVLElBQUksRUFBZixJQUF1QixJQUFJLEVBQUosSUFBVSxJQUFJLEVBQTdGLENBQVA7QUFDSCxLQS9PYTs7QUFpUGQsV0FBTyxVQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEIsQ0FBMUIsRUFBNkI7QUFDaEMsWUFBSSxLQUFLLE9BQU8sQ0FBUCxDQUFUO0FBQUEsWUFDSSxLQUFLLE9BQU8sQ0FBUCxDQURUO0FBQUEsWUFFSSxLQUFLLE9BQU8sQ0FBUCxDQUZUO0FBQUEsWUFHSSxLQUFLLE9BQU8sQ0FBUCxDQUhUO0FBQUEsWUFJSSxJQUFJLEtBQUssRUFKYjtBQUFBLFlBS0ksSUFBSSxLQUFLLEVBTGI7QUFBQSxZQU1JLElBQUksS0FBSyxFQUFMLEdBQVUsS0FBSyxFQU52Qjs7QUFRSSxlQUFPLENBQUMsQ0FBQyxDQUFELEdBQUssSUFBSSxDQUFWLElBQWUsQ0FBdEI7QUFDUDtBQTNQYSxDQUFsQjs7QUE4UEEsT0FBTyxPQUFQLEdBQWlCLElBQUksS0FBSixFQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuICAgIC8vIDM3LjU1NDE4MDI0OTQ1MzgxLDU1Ljc2MDU1MzM3NTA2NzIyLDM3LjY4MjIxMjMyNzIzODY5NSw1NS43ODY0NzUzNDY5MzUzNVxyXG4gICAgLy8g4pSc4pSA4pSAIDM3LjUyMzMzMTYzODI4MzIyNCw1NS43MDEzMDM2MjQ4MDYzOCwzNy42NzU4MTM0OTY0MDkyMDUsNTUuNzc5MDcyMzU1MTUwN1xyXG4gICAgLy8g4pSU4pSA4pSAIDM3LjU4MzEzODczODgzNTc4NSw1NS43NjYxMzE4NDU2MDczLDM3LjU5ODAwNDY3MDg5MDUxLDU1LjczODA3MzYzNDQ4MjAzNVxyXG4gICAgLy8gMzcuNjYzODk5MTY3MzY1MDUsNTUuNzI5NzM4ODI5OTI2NDQsMzcuNjg5MzI5MDgxMjk3MjMsNTUuNzM2NTkyMzQ0MDg4MDdcclxuXHJcbiAgICBbWzM3LjU1NDE4MDI0OTQ1MzgxLDU1Ljc2MDU1MzM3NTA2NzIyXSxbMzcuNjgyMjEyMzI3MjM4Njk1LDU1Ljc4NjQ3NTM0NjkzNTM1XV0sXHJcbiAgICBbWzM3LjUyMzMzMTYzODI4MzIyNCw1NS43MDEzMDM2MjQ4MDYzOF0sWzM3LjY3NTgxMzQ5NjQwOTIwNSw1NS43NzkwNzIzNTUxNTA3XV0sXHJcbiAgICBbWzM3LjU4MzEzODczODgzNTc4NSw1NS43NjYxMzE4NDU2MDczXSxbMzcuNTk4MDA0NjcwODkwNTEsNTUuNzM4MDczNjM0NDgyMDM1XV0sXHJcbiAgICBbWzM3LjY2Mzg5OTE2NzM2NTA1LDU1LjcyOTczODgyOTkyNjQ0XSxbMzcuNjg5MzI5MDgxMjk3MjMsNTUuNzM2NTkyMzQ0MDg4MDddXVxyXG5dO1xyXG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xyXG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvaW5kZXguanMnKTtcclxuXHJcbnZhciBvc20gPSBMLnRpbGVMYXllcignaHR0cDovL3tzfS5iYXNlbWFwcy5jYXJ0b2Nkbi5jb20vbGlnaHRfbm9sYWJlbHMve3p9L3t4fS97eX0ucG5nJywge1xyXG4gICAgICAgIG1heFpvb206IDIyLFxyXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5vcmdcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+J1xyXG4gICAgfSksXHJcbiAgICBwb2ludCA9IEwubGF0TG5nKFs1NS43NTMyMTAsIDM3LjYyMTc2Nl0pLFxyXG4gICAgbWFwID0gbmV3IEwuTWFwKCdtYXAnLCB7bGF5ZXJzOiBbb3NtXSwgY2VudGVyOiBwb2ludCwgem9vbTogMTEsIG1heFpvb206IDIyfSksXHJcbiAgICByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKTtcclxuXHJcbndpbmRvdy5tYXAgPSBtYXA7XHJcblxyXG52YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpLFxyXG4gICAgbiA9IGJvdW5kcy5fbm9ydGhFYXN0LmxhdCxcclxuICAgIGUgPSBib3VuZHMuX25vcnRoRWFzdC5sbmcsXHJcbiAgICBzID0gYm91bmRzLl9zb3V0aFdlc3QubGF0LFxyXG4gICAgdyA9IGJvdW5kcy5fc291dGhXZXN0LmxuZyxcclxuICAgIGhlaWdodCA9IG4gLSBzLFxyXG4gICAgd2lkdGggPSBlIC0gdyxcclxuICAgIHFIZWlnaHQgPSBoZWlnaHQgLyA0LFxyXG4gICAgcVdpZHRoID0gd2lkdGggLyA0LFxyXG4gICAgbGluZXMgPSBbXTtcclxuXHJcbnZhciBwb2ludHMgPSB0dXJmLnJhbmRvbSgncG9pbnRzJywgOCwge1xyXG4gICAgYmJveDogW3cgKyBxV2lkdGgsIHMgKyBxSGVpZ2h0LCBlIC0gcVdpZHRoLCBuIC0gcUhlaWdodF1cclxufSk7XHJcblxyXG52YXIgY29vcmRzID0gcG9pbnRzLmZlYXR1cmVzLm1hcChmdW5jdGlvbihmZWF0dXJlKSB7XHJcbiAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcclxufSlcclxuXHJcbmZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgbGluZXMucHVzaChbY29vcmRzW2ldLCBjb29yZHNbaSsxXV0pO1xyXG59XHJcblxyXG4vLyBkcmF3TGluZXMobGluZXMpO1xyXG5kcmF3TGluZXMoZGF0YSk7XHJcblxyXG4vLyB2YXIgcHMgPSBmaW5kSW50ZXJzZWN0aW9ucyhsaW5lcywgbWFwKTtcclxudmFyIHBzID0gZmluZEludGVyc2VjdGlvbnMoZGF0YSwgbWFwKTtcclxuXHJcbnBzLmZvckVhY2goZnVuY3Rpb24gKHApIHtcclxuICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpLCB7cmFkaXVzOiA1LCBjb2xvcjogJ2JsdWUnLCBmaWxsQ29sb3I6ICdibHVlJ30pLmFkZFRvKG1hcCk7XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBkcmF3TGluZXMoYXJyYXkpIHtcclxuICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcclxuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdO1xyXG5cclxuICAgICAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhiZWdpbiksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoZW5kKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcclxuICAgICAgICBMLnBvbHlsaW5lKFtiZWdpbiwgZW5kXSwge3dlaWdodDogMX0pLmFkZFRvKG1hcCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gY29uc29sZS5sb2cocHMpO1xyXG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuL3NyYy9zd2VlcGxpbmUuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XHJcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5hdmwgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUHJpbnRzIHRyZWUgaG9yaXpvbnRhbGx5XG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHByaW50IChyb290LCBwcmludE5vZGUpIHtcbiAgaWYgKCBwcmludE5vZGUgPT09IHZvaWQgMCApIHByaW50Tm9kZSA9IGZ1bmN0aW9uIChuKSB7IHJldHVybiBuLmtleTsgfTtcblxuICB2YXIgb3V0ID0gW107XG4gIHJvdyhyb290LCAnJywgdHJ1ZSwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG91dC5wdXNoKHYpOyB9LCBwcmludE5vZGUpO1xuICByZXR1cm4gb3V0LmpvaW4oJycpO1xufVxuXG4vKipcbiAqIFByaW50cyBsZXZlbCBvZiB0aGUgdHJlZVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgIHByZWZpeFxuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICBpc1RhaWxcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKGluOnN0cmluZyk6dm9pZH0gICAgb3V0XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gIHByaW50Tm9kZVxuICovXG5mdW5jdGlvbiByb3cgKHJvb3QsIHByZWZpeCwgaXNUYWlsLCBvdXQsIHByaW50Tm9kZSkge1xuICBpZiAocm9vdCkge1xuICAgIG91dCgoXCJcIiArIHByZWZpeCArIChpc1RhaWwgPyAn4pSU4pSA4pSAICcgOiAn4pSc4pSA4pSAICcpICsgKHByaW50Tm9kZShyb290KSkgKyBcIlxcblwiKSk7XG4gICAgdmFyIGluZGVudCA9IHByZWZpeCArIChpc1RhaWwgPyAnICAgICcgOiAn4pSCICAgJyk7XG4gICAgaWYgKHJvb3QubGVmdCkgIHsgcm93KHJvb3QubGVmdCwgIGluZGVudCwgZmFsc2UsIG91dCwgcHJpbnROb2RlKTsgfVxuICAgIGlmIChyb290LnJpZ2h0KSB7IHJvdyhyb290LnJpZ2h0LCBpbmRlbnQsIHRydWUsICBvdXQsIHByaW50Tm9kZSk7IH1cbiAgfVxufVxuXG5cbi8qKlxuICogSXMgdGhlIHRyZWUgYmFsYW5jZWQgKG5vbmUgb2YgdGhlIHN1YnRyZWVzIGRpZmZlciBpbiBoZWlnaHQgYnkgbW9yZSB0aGFuIDEpXG4gKiBAcGFyYW0gIHtOb2RlfSAgICByb290XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0JhbGFuY2VkKHJvb3QpIHtcbiAgaWYgKHJvb3QgPT09IG51bGwpIHsgcmV0dXJuIHRydWU7IH0gLy8gSWYgbm9kZSBpcyBlbXB0eSB0aGVuIHJldHVybiB0cnVlXG5cbiAgLy8gR2V0IHRoZSBoZWlnaHQgb2YgbGVmdCBhbmQgcmlnaHQgc3ViIHRyZWVzXG4gIHZhciBsaCA9IGhlaWdodChyb290LmxlZnQpO1xuICB2YXIgcmggPSBoZWlnaHQocm9vdC5yaWdodCk7XG5cbiAgaWYgKE1hdGguYWJzKGxoIC0gcmgpIDw9IDEgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5sZWZ0KSAgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5yaWdodCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAvLyBJZiB3ZSByZWFjaCBoZXJlIHRoZW4gdHJlZSBpcyBub3QgaGVpZ2h0LWJhbGFuY2VkXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gQ29tcHV0ZSB0aGUgJ2hlaWdodCcgb2YgYSB0cmVlLlxuICogSGVpZ2h0IGlzIHRoZSBudW1iZXIgb2Ygbm9kZXMgYWxvbmcgdGhlIGxvbmdlc3QgcGF0aFxuICogZnJvbSB0aGUgcm9vdCBub2RlIGRvd24gdG8gdGhlIGZhcnRoZXN0IGxlYWYgbm9kZS5cbiAqXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGhlaWdodChub2RlKSB7XG4gIHJldHVybiBub2RlID8gKDEgKyBNYXRoLm1heChoZWlnaHQobm9kZS5sZWZ0KSwgaGVpZ2h0KG5vZGUucmlnaHQpKSkgOiAwO1xufVxuXG4vLyBmdW5jdGlvbiBjcmVhdGVOb2RlIChwYXJlbnQsIGxlZnQsIHJpZ2h0LCBoZWlnaHQsIGtleSwgZGF0YSkge1xuLy8gICByZXR1cm4geyBwYXJlbnQsIGxlZnQsIHJpZ2h0LCBiYWxhbmNlRmFjdG9yOiBoZWlnaHQsIGtleSwgZGF0YSB9O1xuLy8gfVxuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIHBhcmVudDogICAgICAgIE5vZGV8TnVsbCxcbiAqICAgbGVmdDogICAgICAgICAgTm9kZXxOdWxsLFxuICogICByaWdodDogICAgICAgICBOb2RlfE51bGwsXG4gKiAgIGJhbGFuY2VGYWN0b3I6IE51bWJlcixcbiAqICAga2V5OiAgICAgICAgICAgYW55LFxuICogICBkYXRhOiAgICAgICAgICBvYmplY3Q/XG4gKiB9fSBOb2RlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7Kn0gS2V5XG4gKi9cblxuLyoqXG4gKiBEZWZhdWx0IGNvbXBhcmlzb24gZnVuY3Rpb25cbiAqIEBwYXJhbSB7Kn0gYVxuICogQHBhcmFtIHsqfSBiXG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfQ09NUEFSRSAoYSwgYikgeyByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7IH1cblxuXG4vKipcbiAqIFNpbmdsZSBsZWZ0IHJvdGF0aW9uXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5mdW5jdGlvbiByb3RhdGVMZWZ0IChub2RlKSB7XG4gIHZhciByaWdodE5vZGUgPSBub2RlLnJpZ2h0O1xuICBub2RlLnJpZ2h0ICAgID0gcmlnaHROb2RlLmxlZnQ7XG5cbiAgaWYgKHJpZ2h0Tm9kZS5sZWZ0KSB7IHJpZ2h0Tm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICByaWdodE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChyaWdodE5vZGUucGFyZW50KSB7XG4gICAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5sZWZ0ID0gcmlnaHROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LnJpZ2h0ID0gcmlnaHROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gcmlnaHROb2RlO1xuICByaWdodE5vZGUubGVmdCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChyaWdodE5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gcmlnaHROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuICByZXR1cm4gcmlnaHROb2RlO1xufVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZVJpZ2h0IChub2RlKSB7XG4gIHZhciBsZWZ0Tm9kZSA9IG5vZGUubGVmdDtcbiAgbm9kZS5sZWZ0ID0gbGVmdE5vZGUucmlnaHQ7XG4gIGlmIChub2RlLmxlZnQpIHsgbm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICBsZWZ0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKGxlZnROb2RlLnBhcmVudCkge1xuICAgIGlmIChsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgbGVmdE5vZGUucGFyZW50LmxlZnQgPSBsZWZ0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdE5vZGUucGFyZW50LnJpZ2h0ID0gbGVmdE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSBsZWZ0Tm9kZTtcbiAgbGVmdE5vZGUucmlnaHQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobGVmdE5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gbGVmdE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJldHVybiBsZWZ0Tm9kZTtcbn1cblxuXG4vLyBmdW5jdGlvbiBsZWZ0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSByb3RhdGVMZWZ0KG5vZGUubGVmdCk7XG4vLyAgIHJldHVybiByb3RhdGVSaWdodChub2RlKTtcbi8vIH1cblxuXG4vLyBmdW5jdGlvbiByaWdodEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgcm90YXRlUmlnaHQobm9kZS5yaWdodCk7XG4vLyAgIHJldHVybiByb3RhdGVMZWZ0KG5vZGUpO1xuLy8gfVxuXG5cbnZhciBUcmVlID0gZnVuY3Rpb24gVHJlZSAoY29tcGFyYXRvcikge1xuICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvciB8fCBERUZBVUxUX0NPTVBBUkU7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xuICB0aGlzLl9zaXplID0gMDtcbn07XG5cbnZhciBwcm90b3R5cGVBY2Nlc3NvcnMgPSB7IHNpemU6IHt9IH07XG5cblxuLyoqXG4gKiBDbGVhciB0aGUgdHJlZVxuICovXG5UcmVlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xufTtcblxuLyoqXG4gKiBOdW1iZXIgb2Ygbm9kZXNcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xucHJvdG90eXBlQWNjZXNzb3JzLnNpemUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc2l6ZTtcbn07XG5cblxuLyoqXG4gKiBXaGV0aGVyIHRoZSB0cmVlIGNvbnRhaW5zIGEgbm9kZSB3aXRoIHRoZSBnaXZlbiBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyAoa2V5KSB7XG4gIGlmICh0aGlzLl9yb290KXtcbiAgICB2YXIgbm9kZSAgICAgPSB0aGlzLl9yb290O1xuICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgICB3aGlsZSAobm9kZSl7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcihrZXksIG5vZGUua2V5KTtcbiAgICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qIGVzbGludC1kaXNhYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuLyoqXG4gKiBTdWNjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIG5leHQgKG5vZGUpIHtcbiAgdmFyIHN1Y2Nlc3NvciA9IG5vZGU7XG4gIGlmIChzdWNjZXNzb3IpIHtcbiAgICBpZiAoc3VjY2Vzc29yLnJpZ2h0KSB7XG4gICAgICBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucmlnaHQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5sZWZ0KSB7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5sZWZ0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2Nlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IucmlnaHQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHN1Y2Nlc3Nvcjsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN1Y2Nlc3Nvcjtcbn07XG5cblxuLyoqXG4gKiBQcmVkZWNlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gcHJldiAobm9kZSkge1xuICB2YXIgcHJlZGVjZXNzb3IgPSBub2RlO1xuICBpZiAocHJlZGVjZXNzb3IpIHtcbiAgICBpZiAocHJlZGVjZXNzb3IubGVmdCkge1xuICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5sZWZ0O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLnJpZ2h0KSB7IHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucmlnaHQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZGVjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5sZWZ0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBwcmVkZWNlc3NvcjtcbiAgICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwcmVkZWNlc3Nvcjtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuXG4vKipcbiAqIEBwYXJhbXtGdW5jdGlvbihub2RlOk5vZGUpOnZvaWR9IGZuXG4gKiBAcmV0dXJuIHtBVkxUcmVlfVxuICovXG5UcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaCAoZm4pIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCBkb25lID0gZmFsc2UsIGkgPSAwO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIC8vIFJlYWNoIHRoZSBsZWZ0IG1vc3QgTm9kZSBvZiB0aGUgY3VycmVudCBOb2RlXG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIC8vIFBsYWNlIHBvaW50ZXIgdG8gYSB0cmVlIG5vZGUgb24gdGhlIHN0YWNrXG4gICAgICAvLyBiZWZvcmUgdHJhdmVyc2luZyB0aGUgbm9kZSdzIGxlZnQgc3VidHJlZVxuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQmFja1RyYWNrIGZyb20gdGhlIGVtcHR5IHN1YnRyZWUgYW5kIHZpc2l0IHRoZSBOb2RlXG4gICAgICAvLyBhdCB0aGUgdG9wIG9mIHRoZSBzdGFjazsgaG93ZXZlciwgaWYgdGhlIHN0YWNrIGlzXG4gICAgICAvLyBlbXB0eSB5b3UgYXJlIGRvbmVcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIGZuKGN1cnJlbnQsIGkrKyk7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSB2aXNpdGVkIHRoZSBub2RlIGFuZCBpdHMgbGVmdFxuICAgICAgICAvLyBzdWJ0cmVlLiBOb3csIGl0J3MgcmlnaHQgc3VidHJlZSdzIHR1cm5cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBrZXlzIGluIG9yZGVyXG4gKiBAcmV0dXJuIHtBcnJheTxLZXk+fVxuICovXG5UcmVlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24ga2V5cyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmtleSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBgZGF0YWAgZmllbGRzIG9mIGFsbCBub2RlcyBpbiBvcmRlci5cbiAqIEByZXR1cm4ge0FycmF5PCo+fVxuICovXG5UcmVlLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5kYXRhKTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWluaW11bSBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWluTm9kZSA9IGZ1bmN0aW9uIG1pbk5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1heCBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWF4Tm9kZSA9IGZ1bmN0aW9uIG1heE5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBNaW4ga2V5XG4gKiBAcmV0dXJuIHtLZXl9XG4gKi9cblRyZWUucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uIG1pbiAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG4vKipcbiAqIE1heCBrZXlcbiAqIEByZXR1cm4ge0tleXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiBtYXggKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG5cbi8qKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uIGlzRW1wdHkgKCkge1xuICByZXR1cm4gIXRoaXMuX3Jvb3Q7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgbm9kZSB3aXRoIHNtYWxsZXN0IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiBwb3AgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3QsIHJldHVyblZhbHVlID0gbnVsbDtcbiAgaWYgKG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICByZXR1cm5WYWx1ZSA9IHsga2V5OiBub2RlLmtleSwgZGF0YTogbm9kZS5kYXRhIH07XG4gICAgdGhpcy5yZW1vdmUobm9kZS5rZXkpO1xuICB9XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBGaW5kIG5vZGUgYnkga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIGZpbmQgKGtleSkge1xuICB2YXIgcm9vdCA9IHRoaXMuX3Jvb3Q7XG4gIGlmIChyb290ID09PSBudWxsKSAgeyByZXR1cm4gbnVsbDsgfVxuICBpZiAoa2V5ID09PSByb290LmtleSkgeyByZXR1cm4gcm9vdDsgfVxuXG4gIHZhciBzdWJ0cmVlID0gcm9vdCwgY21wO1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHdoaWxlIChzdWJ0cmVlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIHN1YnRyZWUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBzdWJ0cmVlOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBzdWJ0cmVlID0gc3VidHJlZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBzdWJ0cmVlID0gc3VidHJlZS5yaWdodDsgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5cbi8qKlxuICogSW5zZXJ0IGEgbm9kZSBpbnRvIHRoZSB0cmVlXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEBwYXJhbXsqfSBbZGF0YV1cbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0IChrZXksIGRhdGEpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHtcbiAgICB0aGlzLl9yb290ID0ge1xuICAgICAgcGFyZW50OiBudWxsLCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICAgIGtleToga2V5LCBkYXRhOiBkYXRhXG4gICAgfTtcbiAgICB0aGlzLl9zaXplKys7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gIH1cblxuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHZhciBub2RlICA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBwYXJlbnQ9IG51bGw7XG4gIHZhciBjbXAgICA9IDA7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIHBhcmVudCA9IG5vZGU7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgfVxuXG4gIHZhciBuZXdOb2RlID0ge1xuICAgIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsLCBiYWxhbmNlRmFjdG9yOiAwLFxuICAgIHBhcmVudDogcGFyZW50LCBrZXk6IGtleSwgZGF0YTogZGF0YSxcbiAgfTtcbiAgaWYgKGNtcCA8IDApIHsgcGFyZW50LmxlZnQ9IG5ld05vZGU7IH1cbiAgZWxzZSAgICAgICB7IHBhcmVudC5yaWdodCA9IG5ld05vZGU7IH1cblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKGNvbXBhcmUocGFyZW50LmtleSwga2V5KSA8IDApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vbGV0IG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBsZXQgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIHZhciBuZXdSb290JDEgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdCQxOyB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIHRoaXMuX3NpemUrKztcbiAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgbm9kZSBmcm9tIHRoZSB0cmVlLiBJZiBub3QgZm91bmQsIHJldHVybnMgbnVsbC5cbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Tm9kZTpOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGtleSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fcm9vdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgdmFyIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgfVxuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgdmFyIHJldHVyblZhbHVlID0gbm9kZS5rZXk7XG5cbiAgaWYgKG5vZGUubGVmdCkge1xuICAgIHZhciBtYXggPSBub2RlLmxlZnQ7XG5cbiAgICB3aGlsZSAobWF4LmxlZnQgfHwgbWF4LnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWF4LnJpZ2h0KSB7IG1heCA9IG1heC5yaWdodDsgfVxuXG4gICAgICBub2RlLmtleSA9IG1heC5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtYXguZGF0YTtcbiAgICAgIGlmIChtYXgubGVmdCkge1xuICAgICAgICBub2RlID0gbWF4O1xuICAgICAgICBtYXggPSBtYXgubGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWF4LmtleTtcbiAgICBub2RlLmRhdGEgPSBtYXguZGF0YTtcbiAgICBub2RlID0gbWF4O1xuICB9XG5cbiAgaWYgKG5vZGUucmlnaHQpIHtcbiAgICB2YXIgbWluID0gbm9kZS5yaWdodDtcblxuICAgIHdoaWxlIChtaW4ubGVmdCB8fCBtaW4ucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtaW4ubGVmdCkgeyBtaW4gPSBtaW4ubGVmdDsgfVxuXG4gICAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgICAgaWYgKG1pbi5yaWdodCkge1xuICAgICAgICBub2RlID0gbWluO1xuICAgICAgICBtaW4gPSBtaW4ucmlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgbm9kZSA9IG1pbjtcbiAgfVxuXG4gIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgdmFyIHBwICAgPSBub2RlO1xuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50LmxlZnQgPT09IHBwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvL2xldCBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290O1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBsZXQgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIHZhciBuZXdSb290JDEgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdCQxOyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290JDE7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAtMSB8fCBwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyBicmVhazsgfVxuXG4gICAgcHAgICA9IHBhcmVudDtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgaWYgKG5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHsgbm9kZS5wYXJlbnQubGVmdD0gbnVsbDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgeyBub2RlLnBhcmVudC5yaWdodCA9IG51bGw7IH1cbiAgfVxuXG4gIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7IHRoaXMuX3Jvb3QgPSBudWxsOyB9XG5cbiAgdGhpcy5fc2l6ZS0tO1xuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB0cmVlIGlzIGJhbGFuY2VkXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5pc0JhbGFuY2VkID0gZnVuY3Rpb24gaXNCYWxhbmNlZCQxICgpIHtcbiAgcmV0dXJuIGlzQmFsYW5jZWQodGhpcy5fcm9vdCk7XG59O1xuXG5cbi8qKlxuICogU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmVlIC0gcHJpbWl0aXZlIGhvcml6b250YWwgcHJpbnQtb3V0XG4gKiBAcGFyYW17RnVuY3Rpb24oTm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5UcmVlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nIChwcmludE5vZGUpIHtcbiAgcmV0dXJuIHByaW50KHRoaXMuX3Jvb3QsIHByaW50Tm9kZSk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyggVHJlZS5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xuXG5yZXR1cm4gVHJlZTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF2bC5qcy5tYXBcbiIsInZhciBUcmVlID0gcmVxdWlyZSgnYXZsJyksXHJcbiAgICB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50cyBzZXQgb2Ygc2VnbWVudHMgaW50ZXJzZWN0aW5nIHN3ZWVwbGluZSBbW1t4MSwgeTFdLCBbeDIsIHkyXV0gLi4uIFtbeG0sIHltXSwgW3huLCB5bl1dXVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGZpbmRJbnRlcnNlY3Rpb25zKHNlZ21lbnRzLCBtYXApIHtcclxuICAgIHZhciBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpLFxyXG4gICAgICAgIHN0YXR1cyA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVTZWdtZW50cyksXHJcbiAgICAgICAgb3V0cHV0ID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVBvaW50cyk7XHJcblxyXG4gICAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2VnbWVudCkge1xyXG4gICAgICAgIHNlZ21lbnQuc29ydCh1dGlscy5jb21wYXJlUG9pbnRzKTtcclxuICAgICAgICB2YXIgYmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBzZWdtZW50WzFdLFxyXG4gICAgICAgICAgICBiZWdpbkRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludDogYmVnaW4sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmVnaW4nLFxyXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbmREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgcG9pbnQ6IGVuZCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIHF1ZXVlLmluc2VydChiZWdpbiwgYmVnaW5EYXRhKTtcclxuICAgICAgICBxdWV1ZS5pbnNlcnQoZW5kLCBlbmREYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICB3aGlsZSAoIXF1ZXVlLmlzRW1wdHkoKSkge1xyXG4gICAgICAgIHZhciBldmVudCA9IHF1ZXVlLnBvcCgpO1xyXG4gICAgICAgIHZhciBwID0gZXZlbnQuZGF0YS5wb2ludDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coaSArICcpIGN1cnJlbnQgcG9pbnQ6ICcgKyBldmVudC5kYXRhLnBvaW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCcgICBwb2ludCB0eXBlOiAnICsgZXZlbnQuZGF0YS50eXBlKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnICAgcXVldWU6ICcgKyBxdWV1ZS50b1N0cmluZygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnICAgc3RhdHVzOiAnICsgc3RhdHVzLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnYmVnaW4nKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xyXG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAnZ3JlZW4nLCBmaWxsQ29sb3I6ICdncmVlbid9KS5hZGRUbyhtYXApO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlZ21lbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgYWJvdmU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBiZWxvdzogbnVsbFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzdGF0dXMuaW5zZXJ0KGV2ZW50LmRhdGEuc2VnbWVudCk7XHJcbiAgICAgICAgICAgIHZhciBzZWdFID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsbHMgPSBzZWdFLmtleS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XHJcbiAgICAgICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMsIHtjb2xvcjogJ2dyZWVuJ30pLmFkZFRvKG1hcCk7XHJcblxyXG4gICAgICAgICAgICBsaW5lLmJpbmRQb3B1cCgnYWRkZWQnICsgaSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VnQSA9IHN0YXR1cy5wcmV2KHNlZ0UpO1xyXG4gICAgICAgICAgICB2YXIgc2VnQiA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ0IpIHtcclxuICAgICAgICAgICAgICAgc2VnRS5hYm92ZSA9IHNlZ0I7XHJcbiAgICAgICAgICAgICAgIHNlZ0UuYWJvdmUuYmVsb3cgPSBzZWdFO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWdBKSB7XHJcbiAgICAgICAgICAgICAgIHNlZ0UuYmVsb3cgPSBzZWdBO1xyXG4gICAgICAgICAgICAgICBzZWdFLmJlbG93LmFib3ZlID0gc2VnRTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChzZWdBKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdFLmtleSwgc2VnQS5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlYUludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVhSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogZWFJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnRS5rZXksIHNlZ0Eua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoZWFJbnRlcnNlY3Rpb25Qb2ludCwgZWFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBwb2ludDonICsgZWFJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ0IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlYkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZ0Uua2V5LCBzZWdCLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGViSW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWJJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBlYkludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdCLmtleSwgc2VnRS5rZXldXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChlYkludGVyc2VjdGlvblBvaW50LCBlYkludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGViSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGViSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgICAgICBFbHNlIElmIChFIGlzIGEgcmlnaHQgZW5kcG9pbnQpIHtcclxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ2VuZCcpIHtcclxuICAgICAgICAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcclxuICAgICAgICAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ3JlZCcsIGZpbGxDb2xvcjogJ3JlZCd9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICB2YXIgc2VnRSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VnQSA9IHNlZ0UuYWJvdmU7XHJcbiAgICAgICAgICAgIHZhciBzZWdCID0gc2VnRS5iZWxvdztcclxuICAgICAgICAgICAgLy8gdmFyIHNlZ0EgPSBzdGF0dXMucHJldihzZWdFKTtcclxuICAgICAgICAgICAgLy8gdmFyIHNlZ0IgPSBzdGF0dXMubmV4dChzZWdFKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIExPR1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgIHZhciBsbHMgPSBzZWdFLmtleS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XHJcbiAgICAgICAgICAgICB2YXIgbGluZSA9IEwucG9seWxpbmUobGxzLCB7Y29sb3I6ICdyZWQnfSkuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgICAgICBsaW5lLmJpbmRQb3B1cCgncmVtb3ZlZCcgKyBpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWdBICYmIHNlZ0IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhYkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZ0Eua2V5LCBzZWdCLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFiSW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW91dHB1dC5maW5kKGFiSW50ZXJzZWN0aW9uUG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhYkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBhYkludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Eua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgSW5zZXJ0IEkgaW50byBFUTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGFiSW50ZXJzZWN0aW9uUG9pbnQsIGFiSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGFiSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGFiSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBueCA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xyXG4gICAgICAgICAgICBpZiAobngpe1xyXG4gICAgICAgICAgICAgIG54LmJlbG93ID0gc2VnRS5iZWxvdztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIG5wID0gc3RhdHVzLnByZXYoc2VnRSk7XHJcbiAgICAgICAgICAgIGlmIChucCl7XHJcbiAgICAgICAgICAgICAgbnAuYWJvdmUgPSBzZWdFLmFib3ZlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0YXR1cy5yZW1vdmUoc2VnRS5rZXkpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xyXG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgb3V0cHV0Lmluc2VydChldmVudC5kYXRhLnBvaW50KTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgTGV0IHNlZ0UxIGFib3ZlIHNlZ0UyIGJlIEUncyBpbnRlcnNlY3Rpbmcgc2VnbWVudHMgaW4gU0w7XHJcbiAgICAgICAgICAgIHZhciBzZWcxID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50c1swXSksXHJcbiAgICAgICAgICAgICAgICBzZWcyID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50c1sxXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnMSAmJiBzZWcyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgU3dhcCB0aGVpciBwb3NpdGlvbnMgc28gdGhhdCBzZWdFMiBpcyBub3cgYWJvdmUgc2VnRTE7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gc3RhdHVzLnByZXYoc2VnMSkgPSBzdGF0dXMuZmluZChzZWcyKTtcclxuICAgICAgICAgICAgICAgIC8vIHN0YXR1cy5uZXh0KHNlZzIpID0gc3RhdHVzLmZpbmQoc2VnMSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnQSA9IHRoZSBzZWdtZW50IGFib3ZlIHNlZ0UyIGluIFNMO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHZhciBzZWdBID0gc3RhdHVzLm5leHQoc2VnMSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnQiA9IHRoZSBzZWdtZW50IGJlbG93IHNlZ0UxIGluIFNMO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHNlZ0IgPSBzdGF0dXMucHJldihzZWcyKTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWdBID0gc2VnMS5hYm92ZTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWdCID0gc2VnMi5iZWxvdztcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWcxLmFib3ZlKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlZzIuYmVsb3cpO1xyXG4gICAgICAgICAgICAgICAgc2VnMS5hYm92ZSA9IHNlZzI7XHJcbiAgICAgICAgICAgICAgICBzZWcyLmJlbG93ID0gc2VnMTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VnQSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhMkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZzIua2V5LCBzZWdBLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhMkludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0LmZpbmQoYTJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhMkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogYTJJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Eua2V5LCBzZWcyLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhMkludGVyc2VjdGlvblBvaW50LCBhMkludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYTJJbnRlcnNlY3Rpb25Qb2ludDonICsgYTJJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VnQikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBiMUludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZzEua2V5LCBzZWdCLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiMUludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3V0cHV0LmZpbmQoYjFJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiMUludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogYjFJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZzEua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChiMUludGVyc2VjdGlvblBvaW50LCBiMUludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYjFJbnRlcnNlY3Rpb25Qb2ludDonICsgYjFJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgd2luZG93LnN0YXR1cyA9IHN0YXR1cztcclxuICAgIHdpbmRvdy5xdWV1ZSA9IHF1ZXVlO1xyXG5cclxuICAgIHJldHVybiBvdXRwdXQua2V5cygpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XHJcbiIsImZ1bmN0aW9uIFV0aWxzKCkge307XHJcblxyXG5VdGlscy5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLypcclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LzQtdC90YzRiNC1IDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L7RgdGC0LDQstC40YIgYSDQv9C+INC80LXQvdGM0YjQtdC80YMg0LjQvdC00LXQutGB0YMsINGH0LXQvCBiLCDRgtC+INC10YHRgtGMLCBhINC40LTRkdGCINC/0LXRgNCy0YvQvC5cclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LLQtdGA0L3RkdGCIDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC+0YHRgtCw0LLQuNGCIGEg0LggYiDQvdC10LjQt9C80LXQvdC90YvQvNC4INC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC00YDRg9CzINC6INC00YDRg9Cz0YMsXHJcbiAgICAgICAgICAgINC90L4g0L7RgtGB0L7RgNGC0LjRgNGD0LXRgiDQuNGFINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC60L4g0LLRgdC10Lwg0LTRgNGD0LPQuNC8INGN0LvQtdC80LXQvdGC0LDQvC5cclxuICAgICAgICAgICAg0J7QsdGA0LDRgtC40YLQtSDQstC90LjQvNCw0L3QuNC1OiDRgdGC0LDQvdC00LDRgNGCIEVDTUFzY3JpcHQg0L3QtSDQs9Cw0YDQsNC90YLQuNGA0YPQtdGCINC00LDQvdC90L7QtSDQv9C+0LLQtdC00LXQvdC40LUsINC4INC10LzRgyDRgdC70LXQtNGD0Y7RgiDQvdC1INCy0YHQtSDQsdGA0LDRg9C30LXRgNGLXHJcbiAgICAgICAgICAgICjQvdCw0L/RgNC40LzQtdGALCDQstC10YDRgdC40LggTW96aWxsYSDQv9C+INC60YDQsNC50L3QtdC5INC80LXRgNC1LCDQtNC+IDIwMDMg0LPQvtC00LApLlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQsdC+0LvRjNGI0LUgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QvtGB0YLQsNCy0LjRgiBiINC/0L4g0LzQtdC90YzRiNC10LzRgyDQuNC90LTQtdC60YHRgywg0YfQtdC8IGEuXHJcbiAgICAgICAg0KTRg9C90LrRhtC40Y8gY29tcGFyZUZ1bmN0aW9uKGEsIGIpINC00L7Qu9C20L3QsCDQstGB0LXQs9C00LAg0LLQvtC30LLRgNCw0YnQsNGC0Ywg0L7QtNC40L3QsNC60L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQtNC70Y8g0L7Qv9GA0LXQtNC10LvRkdC90L3QvtC5INC/0LDRgNGLINGN0LvQtdC80LXQvdGC0L7QsiBhINC4IGIuXHJcbiAgICAgICAgICAgINCV0YHQu9C4INCx0YPQtNGD0YIg0LLQvtC30LLRgNCw0YnQsNGC0YzRgdGPINC90LXQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQtSDRgNC10LfRg9C70YzRgtCw0YLRiywg0L/QvtGA0Y/QtNC+0Log0YHQvtGA0YLQuNGA0L7QstC60Lgg0LHRg9C00LXRgiDQvdC1INC+0L/RgNC10LTQtdC70ZHQvS5cclxuICAgICovXHJcbiAgICAvLyBwb2ludHMgY29tcGFyYXRvclxyXG4gICAgY29tcGFyZVBvaW50czogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICAgICAgeDIgPSBiWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGJbMV07XHJcblxyXG4gICAgICAgIGlmICh4MSA+IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPiB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4MSA8IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPCB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeDEgPT09IHgyICYmIHkxID09PSB5Mikge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBhcmVTZWdtZW50czogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcblxyXG4gICAgICAgIGlmICh5MSA8IHkzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHkxID4geTMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjb21wYXJlU2VnbWVudHMzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgLy8gICAgIHZhciB4MSA9IGJbMF1bMF0sXHJcbiAgICAvLyAgICAgICAgIHkxID0gYlswXVsxXSxcclxuICAgIC8vICAgICAgICAgeDIgPSBiWzFdWzBdLFxyXG4gICAgLy8gICAgICAgICB5MiA9IGJbMV1bMV0sXHJcbiAgICAvLyAgICAgICAgIHgzID0gYVswXVswXSxcclxuICAgIC8vICAgICAgICAgeTMgPSBhWzBdWzFdLFxyXG4gICAgLy8gICAgICAgICB4NCA9IGFbMV1bMF0sXHJcbiAgICAvLyAgICAgICAgIHk0ID0gYVsxXVsxXSxcclxuICAgIC8vICAgICAgICAgaW50ZXJzZWN0aW9uUG9pbnQgPSBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oYSwgYik7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgIC8vICAgICBpZiAoIWludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAvLyAgICAgICAgIC8vINC90LDRhdC+0LTQuNC8INCy0LXQutGC0L7RgNC90L7QtSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LUg0LLQtdC60YLQvtGA0L7QsiBiINC4IGJbMF1hWzBdXHJcbiAgICAvLyAgICAgICAgIHZhciBEYmExID0gKHgyIC0geDEpICogKHkzIC0geTEpIC0gKHkyIC0geTEpICogKHgzIC0geDEpO1xyXG4gICAgLy8gICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQstC10LrRgtC+0YDQvdC+0LUg0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LXQutGC0L7RgNC+0LIgYiDQuCBiWzBdYVsxXVxyXG4gICAgLy8gICAgICAgICB2YXIgRGJhMiA9ICh4MiAtIHgxKSAqICh5NCAtIHkxKSAtICh5MiAtIHkxKSAqICh4NCAtIHgxKTtcclxuICAgIC8vICAgICAgICAgLy8g0L3QsNGF0L7QtNC40Lwg0LfQvdCw0Log0LLQtdC60YLQvtGA0L3Ri9GFINC/0YDQvtC40LfQstC10LTQtdC90LjQuVxyXG4gICAgLy8gICAgICAgICB2YXIgRCA9IERiYTEgKiBEYmEyO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgaWYgKEQgPCAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAvLyAgICAgICAgIH0gZWxzZSBpZiAoRCA+IDApIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgLy8gICAgICAgICB9IGVsc2UgaWYgKEQgPT09IDApIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ3RoZXkgYXJlIGludGVyc2VjdGluZycpO1xyXG4gICAgLy8gICAgICAgICB2YXIgaW50ZXJzZWN0aW9uWCA9IGludGVyc2VjdGlvblBvaW50WzBdO1xyXG4gICAgLy8gICAgICAgICB2YXIgaW50ZXJzZWN0aW9uWSA9IGludGVyc2VjdGlvblBvaW50WzFdO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgLy8gaWYgKHkzIDwgaW50ZXJzZWN0aW9uWSkge1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgcmV0dXJuIC0xXHJcbiAgICAvLyAgICAgICAgIC8vIH0gZWxzZSBpZiAoeTMgPiBpbnRlcnNlY3Rpb25ZKSB7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICByZXR1cm4gMTtcclxuICAgIC8vICAgICAgICAgLy8gfSBlbHNlIGlmICh5MyA9PT0gaW50ZXJzZWN0aW9uWSkge1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgcmV0dXJuIDA7XHJcbiAgICAvLyAgICAgICAgIC8vIH1cclxuICAgIC8vICAgICAgICAgLy8gaWYgKHgzIDwgaW50ZXJzZWN0aW9uWCkge1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgcmV0dXJuIC0gMVxyXG4gICAgLy8gICAgICAgICAvLyB9IGVsc2UgaWYgKHgzID4gaW50ZXJzZWN0aW9uWCkge1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgcmV0dXJuIDE7XHJcbiAgICAvLyAgICAgICAgIC8vIH0gZWxzZSBpZiAoeDMgPT09IGludGVyc2VjdGlvblgpIHtcclxuICAgIC8vICAgICAgICAgLy8gICAgIHJldHVybiAwO1xyXG4gICAgLy8gICAgICAgICAvLyB9XHJcbiAgICAvLyAgICAgICAgIGlmICh5MyA8IHkxKSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gLTFcclxuICAgIC8vICAgICAgICAgfSBlbHNlIGlmICh5MyA+IHkxKSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgIC8vICAgICAgICAgfSBlbHNlIGlmICh5MyA9PT0geTEpIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQstC10LrRgtC+0YDQvdC+0LUg0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LXQutGC0L7RgNC+0LIgYiDQuCBiWzBdYVswXVxyXG4gICAgLy8gICAgICAgICB2YXIgRCA9ICh4MiAtIHgxKSAqICh5MyAtIHkxKSAtICh5MiAtIHkxKSAqICh4MyAtIHgxKTtcclxuICAgIC8vICAgICAgICAgLy8g0L3QsNGF0L7QtNC40Lwg0LLQtdC60YLQvtGA0L3QvtC1INC/0YDQvtC40LfQstC10LTQtdC90LjQtSDQstC10LrRgtC+0YDQvtCyIGIg0LggYlswXWFbMV1cclxuICAgIC8vICAgICAgICAgLy8gdmFyIERiYTIgPSAoeDIgLSB4MSkgKiAoeTQgLSB5MSkgLSAoeTIgLSB5MSkgKiAoeDQgLSB4MSk7XHJcbiAgICAvLyAgICAgICAgIC8vINC90LDRhdC+0LTQuNC8INC30L3QsNC6INCy0LXQutGC0L7RgNC90YvRhSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LlcclxuICAgIC8vICAgICAgICAgLy8gdmFyIEQgPSBEYmExICogRGJhMjtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGlmIChEIDwgMCkge1xyXG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgLy8gICAgICAgICB9IGVsc2UgaWYgKEQgPiAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgIC8vICAgICAgICAgfSBlbHNlIGlmIChEID09PSAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIHJldHVybiAwO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGZ1bmN0aW9uIGJldHdlZW4oYSwgYiwgYykge1xyXG4gICAgLy8gICAgICAgICB2YXIgZXBzID0gMC4wMDAwMDAxO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgcmV0dXJuIGEtZXBzIDw9IGIgJiYgYiA8PSBjK2VwcztcclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGZ1bmN0aW9uIGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihhLCBiKSB7XHJcbiAgICAvLyAgICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAvLyAgICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAvLyAgICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAvLyAgICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAvLyAgICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAvLyAgICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAvLyAgICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAvLyAgICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICAvLyAgICAgICAgIHZhciB4ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAvLyAgICAgICAgICAgICAoKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpKTtcclxuICAgIC8vICAgICAgICAgdmFyIHkgPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgIC8vICAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgLy8gICAgICAgICBpZiAoaXNOYU4oeCl8fGlzTmFOKHkpKSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAoeDEgPj0geDIpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4MiwgeCwgeDEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKGJldHdlZW4oeDEsIHgsIHgyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAoeTEgPj0geTIpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5MiwgeSwgeTEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKGJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAoeDMgPj0geDQpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4NCwgeCwgeDMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKGJldHdlZW4oeDMsIHgsIHg0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAoeTMgPj0geTQpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5NCwgeSwgeTMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKGJldHdlZW4oeTMsIHksIHk0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgcmV0dXJuIFt4LCB5XTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICBmaW5kRXF1YXRpb246IGZ1bmN0aW9uIChzZWdtZW50KSB7XHJcbiAgICAgICAgdmFyIHgxID0gc2VnbWVudFswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBzZWdtZW50WzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IHNlZ21lbnRbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gc2VnbWVudFsxXVsxXSxcclxuICAgICAgICAgICAgYSA9IHkxIC0geTIsXHJcbiAgICAgICAgICAgIGIgPSB4MiAtIHgxLFxyXG4gICAgICAgICAgICBjID0geDEgKiB5MiAtIHgyICogeTE7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGEgKyAneCArICcgKyBiICsgJ3kgKyAnICsgYyArICcgPSAwJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MzE5OC9ob3ctZG8teW91LWRldGVjdC13aGVyZS10d28tbGluZS1zZWdtZW50cy1pbnRlcnNlY3QvMTk2ODM0NSMxOTY4MzQ1XHJcbiAgICBiZXR3ZWVuOiBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gICAgICAgIHZhciBlcHMgPSAwLjAwMDAwMDE7XHJcblxyXG4gICAgICAgIHJldHVybiBhLWVwcyA8PSBiICYmIGIgPD0gYytlcHM7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICAgICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAgICAgdmFyIHkgPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHgpfHxpc05hTih5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHgxID49IHgyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MiwgeCwgeDEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHgxLCB4LCB4MikpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5MSA+PSB5Mikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTIsIHksIHkxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MSwgeSwgeTIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeDMgPj0geDQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDMsIHgsIHg0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkzID49IHk0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5NCwgeSwgeTMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkzLCB5LCB5NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbeCwgeV07XHJcbiAgICB9LFxyXG5cclxuICAgIHBvaW50T25MaW5lOiBmdW5jdGlvbiAobGluZSwgcG9pbnQpIHtcclxuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdLFxyXG4gICAgICAgICAgICB4MSA9IGJlZ2luWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGJlZ2luWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGVuZFswXSxcclxuICAgICAgICAgICAgeTIgPSBlbmRbMV0sXHJcbiAgICAgICAgICAgIHggPSBwb2ludFswXSxcclxuICAgICAgICAgICAgeSA9IHBvaW50WzFdO1xyXG5cclxuICAgICAgICByZXR1cm4gKCh4IC0geDEpICogKHkyIC0geTEpIC0gKHkgLSB5MSkgKiAoeDIgLSB4MSkgPT09IDApICYmICgoeCA+IHgxICYmIHggPCB4MikgfHwgKHggPiB4MiAmJiB4IDwgeDEpKTtcclxuICAgIH0sXHJcblxyXG4gICAgZmluZFk6IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50MiwgeCkge1xyXG4gICAgICAgIHZhciB4MSA9IHBvaW50MVswXSxcclxuICAgICAgICAgICAgeTEgPSBwb2ludDFbMV0sXHJcbiAgICAgICAgICAgIHgyID0gcG9pbnQyWzBdLFxyXG4gICAgICAgICAgICB5MiA9IHBvaW50MlsxXSxcclxuICAgICAgICAgICAgYSA9IHkxIC0geTIsXHJcbiAgICAgICAgICAgIGIgPSB4MiAtIHgxLFxyXG4gICAgICAgICAgICBjID0geDEgKiB5MiAtIHgyICogeTE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKC1jIC0gYSAqIHgpIC8gYjtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVXRpbHM7XHJcbiJdfQ==
