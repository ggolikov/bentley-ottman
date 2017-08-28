(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [[[37.532279074148235, 55.805981592111884], [37.64098701400218, 55.70648655604701]], [[37.565505169406585, 55.71366864747661], [37.68419324052014, 55.80127797612775]], [[37.609906886866035, 55.73133494107268], [37.64244586242978, 55.73807737662369]]];

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

            if (!segA && segB) {
                segB = status.next(status.next(segE));
            }
            if (segA && !segB) {
                segA = status.prev(status.prev(segE));
            }

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

                if (eaIntersectionPoint && !output.find(eaIntersectionPoint)) {
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

                if (abIntersectionPoint && !output.find(abIntersectionPoint)) {
                    var abIntersectionPointData = {
                        point: abIntersectionPoint,
                        type: 'intersection',
                        segments: [segA.key, segB.key]
                        //                 Insert I into EQ;
                    };queue.insert(abIntersectionPoint, abIntersectionPointData);
                    console.log('inserted abIntersectionPoint:' + abIntersectionPoint.toString());
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
                seg1.below = segB;
                seg2.above = segA;

                if (segA) {
                    var a2IntersectionPoint = utils.findSegmentsIntersection(seg2.key, segA.key);

                    if (a2IntersectionPoint && !output.find(a2IntersectionPoint)) {
                        var a2IntersectionPointData = {
                            point: a2IntersectionPoint,
                            type: 'intersection',
                            segments: [segA.key, seg2.key]
                        };
                        queue.insert(a2IntersectionPoint, a2IntersectionPointData);
                        console.log('inserted a2IntersectionPoint:' + a2IntersectionPoint.toString());
                    }
                }
                if (segB) {
                    var b1IntersectionPoint = utils.findSegmentsIntersection(seg1.key, segB.key);

                    if (b1IntersectionPoint && !output.find(b1IntersectionPoint)) {
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
            i++;
        }
    }
    window.status = status;
    window.queue = queue;

    return output.keys();
}
module.exports = findIntersections;

},{"./utils":6,"avl":4}],6:[function(require,module,exports){
var EPS = 1E-9;

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

    compareSegments1: function (a, b) {
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

    compareSegments: function (a, b) {
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];

        var x = Math.max(Math.min(x1, x2), Math.min(x3, x4));
        console.log('x: ' + x);
        console.log('y from x: ' + getY(b, x));
        var ay = getY(a, x);
        var by = getY(b, x);
        // return getY(a, x) < getY(b, x) - EPS;
        // L.marker(L.latLng([x, ay].slice().reverse())).bindPopup('1 > 2').addTo(map);
        // L.marker(L.latLng([x, by].slice().reverse())).bindPopup('2 > 1').addTo(map);

        if (ay < by) {
            return -1;
        } else if (ay > by) {
            return 1;
        } else {
            return 0;
        }
        // if (y1 < by) {
        //     return -1;
        // } else if (y1 > by) {
        //     return 1;
        // } else {
        //     return 0;
        // }
    },

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
        // var eps = 0.0000001;

        return a - EPS <= b && b <= c + EPS;
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

function getY(segment, x) {
    var x1 = segment[0][0],
        y1 = segment[0][1],
        x2 = segment[1][0],
        y2 = segment[1][1];

    // если отрезок горизонтален,
    // вернем просто y правого конца
    if (Math.abs(x2 - x1) < EPS) {
        return y1;
    }
    // в остальных случаях
    // берем пропорцию
    return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

module.exports = new Utils();

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXHN3ZWVwbGluZS5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFPLE9BQVAsR0FBaUIsQ0FDYixDQUFDLENBQUMsa0JBQUQsRUFBb0Isa0JBQXBCLENBQUQsRUFBeUMsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBekMsQ0FEYSxFQUViLENBQUMsQ0FBQyxrQkFBRCxFQUFvQixpQkFBcEIsQ0FBRCxFQUF3QyxDQUFDLGlCQUFELEVBQW1CLGlCQUFuQixDQUF4QyxDQUZhLEVBR2IsQ0FBQyxDQUFDLGtCQUFELEVBQW9CLGlCQUFwQixDQUFELEVBQXdDLENBQUMsaUJBQUQsRUFBbUIsaUJBQW5CLENBQXhDLENBSGEsQ0FBakI7OztBQ0FBLElBQUksb0JBQW9CLFFBQVEsYUFBUixDQUF4QjtBQUNBLElBQUksT0FBTyxRQUFRLGtCQUFSLENBQVg7O0FBRUEsSUFBSSxNQUFNLEVBQUUsU0FBRixDQUFZLGlFQUFaLEVBQStFO0FBQ2pGLGFBQVMsRUFEd0U7QUFFakYsaUJBQWE7QUFGb0UsQ0FBL0UsQ0FBVjtBQUFBLElBSUksUUFBUSxFQUFFLE1BQUYsQ0FBUyxDQUFDLFNBQUQsRUFBWSxTQUFaLENBQVQsQ0FKWjtBQUFBLElBS0ksTUFBTSxJQUFJLEVBQUUsR0FBTixDQUFVLEtBQVYsRUFBaUIsRUFBQyxRQUFRLENBQUMsR0FBRCxDQUFULEVBQWdCLFFBQVEsS0FBeEIsRUFBK0IsTUFBTSxFQUFyQyxFQUF5QyxTQUFTLEVBQWxELEVBQWpCLENBTFY7QUFBQSxJQU1JLE9BQU8sU0FBUyxjQUFULENBQXdCLFNBQXhCLENBTlg7O0FBUUEsT0FBTyxHQUFQLEdBQWEsR0FBYjs7QUFF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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQURUO0FBQUEsUUFFSSxLQUFLLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FGVDtBQUFBLFFBR0ksS0FBSyxRQUFRLENBQVIsRUFBVyxDQUFYLENBSFQ7O0FBS0E7QUFDQTtBQUNBLFFBQUksS0FBSyxHQUFMLENBQVMsS0FBSyxFQUFkLElBQW9CLEdBQXhCLEVBQTZCO0FBQ3pCLGVBQU8sRUFBUDtBQUNIO0FBQ0Q7QUFDQTtBQUNBLFdBQU8sS0FBSyxDQUFDLEtBQUssRUFBTixLQUFhLElBQUksRUFBakIsS0FBd0IsS0FBSyxFQUE3QixDQUFaO0FBQ0g7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLElBQUksS0FBSixFQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuICAgIFtbMzcuNTMyMjc5MDc0MTQ4MjM1LDU1LjgwNTk4MTU5MjExMTg4NF0sWzM3LjY0MDk4NzAxNDAwMjE4LDU1LjcwNjQ4NjU1NjA0NzAxXV0sXHJcbiAgICBbWzM3LjU2NTUwNTE2OTQwNjU4NSw1NS43MTM2Njg2NDc0NzY2MV0sWzM3LjY4NDE5MzI0MDUyMDE0LDU1LjgwMTI3Nzk3NjEyNzc1XV0sXHJcbiAgICBbWzM3LjYwOTkwNjg4Njg2NjAzNSw1NS43MzEzMzQ5NDEwNzI2OF0sWzM3LjY0MjQ0NTg2MjQyOTc4LDU1LjczODA3NzM3NjYyMzY5XV1cclxuXTtcclxuIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcclxudmFyIGRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL2luZGV4LmpzJyk7XHJcblxyXG52YXIgb3NtID0gTC50aWxlTGF5ZXIoJ2h0dHA6Ly97c30uYmFzZW1hcHMuY2FydG9jZG4uY29tL2xpZ2h0X25vbGFiZWxzL3t6fS97eH0ve3l9LnBuZycsIHtcclxuICAgICAgICBtYXhab29tOiAyMixcclxuICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAub3JnXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPidcclxuICAgIH0pLFxyXG4gICAgcG9pbnQgPSBMLmxhdExuZyhbNTUuNzUzMjEwLCAzNy42MjE3NjZdKSxcclxuICAgIG1hcCA9IG5ldyBMLk1hcCgnbWFwJywge2xheWVyczogW29zbV0sIGNlbnRlcjogcG9pbnQsIHpvb206IDExLCBtYXhab29tOiAyMn0pLFxyXG4gICAgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jyk7XHJcblxyXG53aW5kb3cubWFwID0gbWFwO1xyXG5cclxudmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKSxcclxuICAgIG4gPSBib3VuZHMuX25vcnRoRWFzdC5sYXQsXHJcbiAgICBlID0gYm91bmRzLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgcyA9IGJvdW5kcy5fc291dGhXZXN0LmxhdCxcclxuICAgIHcgPSBib3VuZHMuX3NvdXRoV2VzdC5sbmcsXHJcbiAgICBoZWlnaHQgPSBuIC0gcyxcclxuICAgIHdpZHRoID0gZSAtIHcsXHJcbiAgICBxSGVpZ2h0ID0gaGVpZ2h0IC8gNCxcclxuICAgIHFXaWR0aCA9IHdpZHRoIC8gNCxcclxuICAgIGxpbmVzID0gW107XHJcblxyXG52YXIgcG9pbnRzID0gdHVyZi5yYW5kb20oJ3BvaW50cycsIDgsIHtcclxuICAgIGJib3g6IFt3ICsgcVdpZHRoLCBzICsgcUhlaWdodCwgZSAtIHFXaWR0aCwgbiAtIHFIZWlnaHRdXHJcbn0pO1xyXG5cclxudmFyIGNvb3JkcyA9IHBvaW50cy5mZWF0dXJlcy5tYXAoZnVuY3Rpb24oZmVhdHVyZSkge1xyXG4gICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XHJcbn0pXHJcblxyXG5mb3IgKHZhciBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrPTIpIHtcclxuICAgIGxpbmVzLnB1c2goW2Nvb3Jkc1tpXSwgY29vcmRzW2krMV1dKTtcclxufVxyXG5cclxuLy8gZHJhd0xpbmVzKGxpbmVzKTtcclxuZHJhd0xpbmVzKGRhdGEpO1xyXG5cclxuLy8gdmFyIHBzID0gZmluZEludGVyc2VjdGlvbnMobGluZXMsIG1hcCk7XHJcbnZhciBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGRhdGEsIG1hcCk7XHJcblxyXG5wcy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKSwge3JhZGl1czogNSwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5hZGRUbyhtYXApO1xyXG59KVxyXG5cclxuZnVuY3Rpb24gZHJhd0xpbmVzKGFycmF5KSB7XHJcbiAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXSxcclxuICAgICAgICAgICAgZW5kID0gbGluZVsxXTtcclxuXHJcbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoYmVnaW4pLCB7cmFkaXVzOiAyLCBmaWxsQ29sb3I6IFwiI0ZGRkYwMFwiLCB3ZWlnaHQ6IDJ9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGVuZCksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgTC5wb2x5bGluZShbYmVnaW4sIGVuZF0sIHt3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIGNvbnNvbGUubG9nKHBzKTtcclxuIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi9zcmMvc3dlZXBsaW5lLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuYXZsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFByaW50cyB0cmVlIGhvcml6b250YWxseVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBwcmludCAocm9vdCwgcHJpbnROb2RlKSB7XG4gIGlmICggcHJpbnROb2RlID09PSB2b2lkIDAgKSBwcmludE5vZGUgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbi5rZXk7IH07XG5cbiAgdmFyIG91dCA9IFtdO1xuICByb3cocm9vdCwgJycsIHRydWUsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBvdXQucHVzaCh2KTsgfSwgcHJpbnROb2RlKTtcbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBQcmludHMgbGV2ZWwgb2YgdGhlIHRyZWVcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICBwcmVmaXhcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgaXNUYWlsXG4gKiBAcGFyYW0gIHtGdW5jdGlvbihpbjpzdHJpbmcpOnZvaWR9ICAgIG91dFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9ICBwcmludE5vZGVcbiAqL1xuZnVuY3Rpb24gcm93IChyb290LCBwcmVmaXgsIGlzVGFpbCwgb3V0LCBwcmludE5vZGUpIHtcbiAgaWYgKHJvb3QpIHtcbiAgICBvdXQoKFwiXCIgKyBwcmVmaXggKyAoaXNUYWlsID8gJ+KUlOKUgOKUgCAnIDogJ+KUnOKUgOKUgCAnKSArIChwcmludE5vZGUocm9vdCkpICsgXCJcXG5cIikpO1xuICAgIHZhciBpbmRlbnQgPSBwcmVmaXggKyAoaXNUYWlsID8gJyAgICAnIDogJ+KUgiAgICcpO1xuICAgIGlmIChyb290LmxlZnQpICB7IHJvdyhyb290LmxlZnQsICBpbmRlbnQsIGZhbHNlLCBvdXQsIHByaW50Tm9kZSk7IH1cbiAgICBpZiAocm9vdC5yaWdodCkgeyByb3cocm9vdC5yaWdodCwgaW5kZW50LCB0cnVlLCAgb3V0LCBwcmludE5vZGUpOyB9XG4gIH1cbn1cblxuXG4vKipcbiAqIElzIHRoZSB0cmVlIGJhbGFuY2VkIChub25lIG9mIHRoZSBzdWJ0cmVlcyBkaWZmZXIgaW4gaGVpZ2h0IGJ5IG1vcmUgdGhhbiAxKVxuICogQHBhcmFtICB7Tm9kZX0gICAgcm9vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNCYWxhbmNlZChyb290KSB7XG4gIGlmIChyb290ID09PSBudWxsKSB7IHJldHVybiB0cnVlOyB9IC8vIElmIG5vZGUgaXMgZW1wdHkgdGhlbiByZXR1cm4gdHJ1ZVxuXG4gIC8vIEdldCB0aGUgaGVpZ2h0IG9mIGxlZnQgYW5kIHJpZ2h0IHN1YiB0cmVlc1xuICB2YXIgbGggPSBoZWlnaHQocm9vdC5sZWZ0KTtcbiAgdmFyIHJoID0gaGVpZ2h0KHJvb3QucmlnaHQpO1xuXG4gIGlmIChNYXRoLmFicyhsaCAtIHJoKSA8PSAxICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QubGVmdCkgICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QucmlnaHQpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gSWYgd2UgcmVhY2ggaGVyZSB0aGVuIHRyZWUgaXMgbm90IGhlaWdodC1iYWxhbmNlZFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIENvbXB1dGUgdGhlICdoZWlnaHQnIG9mIGEgdHJlZS5cbiAqIEhlaWdodCBpcyB0aGUgbnVtYmVyIG9mIG5vZGVzIGFsb25nIHRoZSBsb25nZXN0IHBhdGhcbiAqIGZyb20gdGhlIHJvb3Qgbm9kZSBkb3duIHRvIHRoZSBmYXJ0aGVzdCBsZWFmIG5vZGUuXG4gKlxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBoZWlnaHQobm9kZSkge1xuICByZXR1cm4gbm9kZSA/ICgxICsgTWF0aC5tYXgoaGVpZ2h0KG5vZGUubGVmdCksIGhlaWdodChub2RlLnJpZ2h0KSkpIDogMDtcbn1cblxuLy8gZnVuY3Rpb24gY3JlYXRlTm9kZSAocGFyZW50LCBsZWZ0LCByaWdodCwgaGVpZ2h0LCBrZXksIGRhdGEpIHtcbi8vICAgcmV0dXJuIHsgcGFyZW50LCBsZWZ0LCByaWdodCwgYmFsYW5jZUZhY3RvcjogaGVpZ2h0LCBrZXksIGRhdGEgfTtcbi8vIH1cblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBwYXJlbnQ6ICAgICAgICBOb2RlfE51bGwsXG4gKiAgIGxlZnQ6ICAgICAgICAgIE5vZGV8TnVsbCxcbiAqICAgcmlnaHQ6ICAgICAgICAgTm9kZXxOdWxsLFxuICogICBiYWxhbmNlRmFjdG9yOiBOdW1iZXIsXG4gKiAgIGtleTogICAgICAgICAgIGFueSxcbiAqICAgZGF0YTogICAgICAgICAgb2JqZWN0P1xuICogfX0gTm9kZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeyp9IEtleVxuICovXG5cbi8qKlxuICogRGVmYXVsdCBjb21wYXJpc29uIGZ1bmN0aW9uXG4gKiBAcGFyYW0geyp9IGFcbiAqIEBwYXJhbSB7Kn0gYlxuICovXG5mdW5jdGlvbiBERUZBVUxUX0NPTVBBUkUgKGEsIGIpIHsgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwOyB9XG5cblxuLyoqXG4gKiBTaW5nbGUgbGVmdCByb3RhdGlvblxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuZnVuY3Rpb24gcm90YXRlTGVmdCAobm9kZSkge1xuICB2YXIgcmlnaHROb2RlID0gbm9kZS5yaWdodDtcbiAgbm9kZS5yaWdodCAgICA9IHJpZ2h0Tm9kZS5sZWZ0O1xuXG4gIGlmIChyaWdodE5vZGUubGVmdCkgeyByaWdodE5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgcmlnaHROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAocmlnaHROb2RlLnBhcmVudCkge1xuICAgIGlmIChyaWdodE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9IHJpZ2h0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5yaWdodCA9IHJpZ2h0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IHJpZ2h0Tm9kZTtcbiAgcmlnaHROb2RlLmxlZnQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAocmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cbiAgcmV0dXJuIHJpZ2h0Tm9kZTtcbn1cblxuXG5mdW5jdGlvbiByb3RhdGVSaWdodCAobm9kZSkge1xuICB2YXIgbGVmdE5vZGUgPSBub2RlLmxlZnQ7XG4gIG5vZGUubGVmdCA9IGxlZnROb2RlLnJpZ2h0O1xuICBpZiAobm9kZS5sZWZ0KSB7IG5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgbGVmdE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChsZWZ0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobGVmdE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5sZWZ0ID0gbGVmdE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5yaWdodCA9IGxlZnROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gbGVmdE5vZGU7XG4gIGxlZnROb2RlLnJpZ2h0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IGxlZnROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByZXR1cm4gbGVmdE5vZGU7XG59XG5cblxuLy8gZnVuY3Rpb24gbGVmdEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgcm90YXRlTGVmdChub2RlLmxlZnQpO1xuLy8gICByZXR1cm4gcm90YXRlUmlnaHQobm9kZSk7XG4vLyB9XG5cblxuLy8gZnVuY3Rpb24gcmlnaHRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHJvdGF0ZVJpZ2h0KG5vZGUucmlnaHQpO1xuLy8gICByZXR1cm4gcm90YXRlTGVmdChub2RlKTtcbi8vIH1cblxuXG52YXIgVHJlZSA9IGZ1bmN0aW9uIFRyZWUgKGNvbXBhcmF0b3IpIHtcbiAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3IgfHwgREVGQVVMVF9DT01QQVJFO1xuICB0aGlzLl9yb290ID0gbnVsbDtcbiAgdGhpcy5fc2l6ZSA9IDA7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBzaXplOiB7fSB9O1xuXG5cbi8qKlxuICogQ2xlYXIgdGhlIHRyZWVcbiAqL1xuVHJlZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICB0aGlzLl9yb290ID0gbnVsbDtcbn07XG5cbi8qKlxuICogTnVtYmVyIG9mIG5vZGVzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbnByb3RvdHlwZUFjY2Vzc29ycy5zaXplLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3NpemU7XG59O1xuXG5cbi8qKlxuICogV2hldGhlciB0aGUgdHJlZSBjb250YWlucyBhIG5vZGUgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMgKGtleSkge1xuICBpZiAodGhpcy5fcm9vdCl7XG4gICAgdmFyIG5vZGUgICAgID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gICAgd2hpbGUgKG5vZGUpe1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3Ioa2V5LCBub2RlLmtleSk7XG4gICAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cbi8qKlxuICogU3VjY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiBuZXh0IChub2RlKSB7XG4gIHZhciBzdWNjZXNzb3IgPSBub2RlO1xuICBpZiAoc3VjY2Vzc29yKSB7XG4gICAgaWYgKHN1Y2Nlc3Nvci5yaWdodCkge1xuICAgICAgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnJpZ2h0O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IubGVmdCkgeyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IubGVmdDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLnJpZ2h0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBzdWNjZXNzb3I7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWNjZXNzb3I7XG59O1xuXG5cbi8qKlxuICogUHJlZGVjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uIHByZXYgKG5vZGUpIHtcbiAgdmFyIHByZWRlY2Vzc29yID0gbm9kZTtcbiAgaWYgKHByZWRlY2Vzc29yKSB7XG4gICAgaWYgKHByZWRlY2Vzc29yLmxlZnQpIHtcbiAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IubGVmdDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5yaWdodCkgeyBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnJpZ2h0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWRlY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IubGVmdCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gcHJlZGVjZXNzb3I7XG4gICAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcHJlZGVjZXNzb3I7XG59O1xuLyogZXNsaW50LWVuYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cblxuLyoqXG4gKiBAcGFyYW17RnVuY3Rpb24obm9kZTpOb2RlKTp2b2lkfSBmblxuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuVHJlZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2ggKGZuKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgZG9uZSA9IGZhbHNlLCBpID0gMDtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICAvLyBSZWFjaCB0aGUgbGVmdCBtb3N0IE5vZGUgb2YgdGhlIGN1cnJlbnQgTm9kZVxuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICAvLyBQbGFjZSBwb2ludGVyIHRvIGEgdHJlZSBub2RlIG9uIHRoZSBzdGFja1xuICAgICAgLy8gYmVmb3JlIHRyYXZlcnNpbmcgdGhlIG5vZGUncyBsZWZ0IHN1YnRyZWVcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJhY2tUcmFjayBmcm9tIHRoZSBlbXB0eSBzdWJ0cmVlIGFuZCB2aXNpdCB0aGUgTm9kZVxuICAgICAgLy8gYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2s7IGhvd2V2ZXIsIGlmIHRoZSBzdGFjayBpc1xuICAgICAgLy8gZW1wdHkgeW91IGFyZSBkb25lXG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICBmbihjdXJyZW50LCBpKyspO1xuXG4gICAgICAgIC8vIFdlIGhhdmUgdmlzaXRlZCB0aGUgbm9kZSBhbmQgaXRzIGxlZnRcbiAgICAgICAgLy8gc3VidHJlZS4gTm93LCBpdCdzIHJpZ2h0IHN1YnRyZWUncyB0dXJuXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBhbGwga2V5cyBpbiBvcmRlclxuICogQHJldHVybiB7QXJyYXk8S2V5Pn1cbiAqL1xuVHJlZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uIGtleXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5rZXkpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYGRhdGFgIGZpZWxkcyBvZiBhbGwgbm9kZXMgaW4gb3JkZXIuXG4gKiBAcmV0dXJuIHtBcnJheTwqPn1cbiAqL1xuVHJlZS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gdmFsdWVzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQuZGF0YSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1pbmltdW0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1pbk5vZGUgPSBmdW5jdGlvbiBtaW5Ob2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtYXgga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1heE5vZGUgPSBmdW5jdGlvbiBtYXhOb2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogTWluIGtleVxuICogQHJldHVybiB7S2V5fVxuICovXG5UcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiBtaW4gKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuLyoqXG4gKiBNYXgga2V5XG4gKiBAcmV0dXJuIHtLZXl8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gbWF4ICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuXG4vKipcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5ICgpIHtcbiAgcmV0dXJuICF0aGlzLl9yb290O1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG5vZGUgd2l0aCBzbWFsbGVzdCBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290LCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gIGlmIChub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgcmV0dXJuVmFsdWUgPSB7IGtleTogbm9kZS5rZXksIGRhdGE6IG5vZGUuZGF0YSB9O1xuICAgIHRoaXMucmVtb3ZlKG5vZGUua2V5KTtcbiAgfVxuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogRmluZCBub2RlIGJ5IGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiBmaW5kIChrZXkpIHtcbiAgdmFyIHJvb3QgPSB0aGlzLl9yb290O1xuICBpZiAocm9vdCA9PT0gbnVsbCkgIHsgcmV0dXJuIG51bGw7IH1cbiAgaWYgKGtleSA9PT0gcm9vdC5rZXkpIHsgcmV0dXJuIHJvb3Q7IH1cblxuICB2YXIgc3VidHJlZSA9IHJvb3QsIGNtcDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB3aGlsZSAoc3VidHJlZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBzdWJ0cmVlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gc3VidHJlZTsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgc3VidHJlZSA9IHN1YnRyZWUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgc3VidHJlZSA9IHN1YnRyZWUucmlnaHQ7IH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuXG4vKipcbiAqIEluc2VydCBhIG5vZGUgaW50byB0aGUgdHJlZVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcGFyYW17Kn0gW2RhdGFdXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCAoa2V5LCBkYXRhKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7XG4gICAgdGhpcy5fcm9vdCA9IHtcbiAgICAgIHBhcmVudDogbnVsbCwgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgICBrZXk6IGtleSwgZGF0YTogZGF0YVxuICAgIH07XG4gICAgdGhpcy5fc2l6ZSsrO1xuICAgIHJldHVybiB0aGlzLl9yb290O1xuICB9XG5cbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB2YXIgbm9kZSAgPSB0aGlzLl9yb290O1xuICB2YXIgcGFyZW50PSBudWxsO1xuICB2YXIgY21wICAgPSAwO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBwYXJlbnQgPSBub2RlO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cblxuICB2YXIgbmV3Tm9kZSA9IHtcbiAgICBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICBwYXJlbnQ6IHBhcmVudCwga2V5OiBrZXksIGRhdGE6IGRhdGEsXG4gIH07XG4gIGlmIChjbXAgPCAwKSB7IHBhcmVudC5sZWZ0PSBuZXdOb2RlOyB9XG4gIGVsc2UgICAgICAgeyBwYXJlbnQucmlnaHQgPSBuZXdOb2RlOyB9XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChjb21wYXJlKHBhcmVudC5rZXksIGtleSkgPCAwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvL2xldCBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gbGV0IG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCQxID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3QkMTsgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICB0aGlzLl9zaXplKys7XG4gIHJldHVybiBuZXdOb2RlO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgdGhlIG5vZGUgZnJvbSB0aGUgdHJlZS4gSWYgbm90IGZvdW5kLCByZXR1cm5zIG51bGwuXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge05vZGU6TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrZXkpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIHZhciBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHZhciByZXR1cm5WYWx1ZSA9IG5vZGUua2V5O1xuXG4gIGlmIChub2RlLmxlZnQpIHtcbiAgICB2YXIgbWF4ID0gbm9kZS5sZWZ0O1xuXG4gICAgd2hpbGUgKG1heC5sZWZ0IHx8IG1heC5yaWdodCkge1xuICAgICAgd2hpbGUgKG1heC5yaWdodCkgeyBtYXggPSBtYXgucmlnaHQ7IH1cblxuICAgICAgbm9kZS5rZXkgPSBtYXgua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgICBpZiAobWF4LmxlZnQpIHtcbiAgICAgICAgbm9kZSA9IG1heDtcbiAgICAgICAgbWF4ID0gbWF4LmxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1heC5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgbm9kZSA9IG1heDtcbiAgfVxuXG4gIGlmIChub2RlLnJpZ2h0KSB7XG4gICAgdmFyIG1pbiA9IG5vZGUucmlnaHQ7XG5cbiAgICB3aGlsZSAobWluLmxlZnQgfHwgbWluLnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWluLmxlZnQpIHsgbWluID0gbWluLmxlZnQ7IH1cblxuICAgICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICAgIGlmIChtaW4ucmlnaHQpIHtcbiAgICAgICAgbm9kZSA9IG1pbjtcbiAgICAgICAgbWluID0gbWluLnJpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgIG5vZGUgPSBtaW47XG4gIH1cblxuICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIHZhciBwcCAgID0gbm9kZTtcblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKHBhcmVudC5sZWZ0ID09PSBwcCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy9sZXQgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIHZhciBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdDtcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gbGV0IG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCQxID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3QkMTsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdCQxO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gLTEgfHwgcGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgYnJlYWs7IH1cblxuICAgIHBwICAgPSBwYXJlbnQ7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIGlmIChub2RlLnBhcmVudCkge1xuICAgIGlmIChub2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7IG5vZGUucGFyZW50LmxlZnQ9IG51bGw7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgIHsgbm9kZS5wYXJlbnQucmlnaHQgPSBudWxsOyB9XG4gIH1cblxuICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkgeyB0aGlzLl9yb290ID0gbnVsbDsgfVxuXG4gIHRoaXMuX3NpemUtLTtcbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHJlZSBpcyBiYWxhbmNlZFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaXNCYWxhbmNlZCA9IGZ1bmN0aW9uIGlzQmFsYW5jZWQkMSAoKSB7XG4gIHJldHVybiBpc0JhbGFuY2VkKHRoaXMuX3Jvb3QpO1xufTtcblxuXG4vKipcbiAqIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJlZSAtIHByaW1pdGl2ZSBob3Jpem9udGFsIHByaW50LW91dFxuICogQHBhcmFte0Z1bmN0aW9uKE5vZGUpOlN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuVHJlZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAocHJpbnROb2RlKSB7XG4gIHJldHVybiBwcmludCh0aGlzLl9yb290LCBwcmludE5vZGUpO1xufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIFRyZWUucHJvdG90eXBlLCBwcm90b3R5cGVBY2Nlc3NvcnMgKTtcblxucmV0dXJuIFRyZWU7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdmwuanMubWFwXG4iLCJ2YXIgVHJlZSA9IHJlcXVpcmUoJ2F2bCcpLFxyXG4gICAgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudHMgc2V0IG9mIHNlZ21lbnRzIGludGVyc2VjdGluZyBzd2VlcGxpbmUgW1tbeDEsIHkxXSwgW3gyLCB5Ml1dIC4uLiBbW3htLCB5bV0sIFt4biwgeW5dXV1cclxuICovXHJcblxyXG5mdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9ucyhzZWdtZW50cywgbWFwKSB7XHJcbiAgICB2YXIgcXVldWUgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlUG9pbnRzKSxcclxuICAgICAgICBzdGF0dXMgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlU2VnbWVudHMpLFxyXG4gICAgICAgIG91dHB1dCA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpO1xyXG5cclxuICAgIHNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKHNlZ21lbnQpIHtcclxuICAgICAgICBzZWdtZW50LnNvcnQodXRpbHMuY29tcGFyZVBvaW50cyk7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gc2VnbWVudFswXSxcclxuICAgICAgICAgICAgZW5kID0gc2VnbWVudFsxXSxcclxuICAgICAgICAgICAgYmVnaW5EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgcG9pbnQ6IGJlZ2luLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2JlZ2luJyxcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQ6IHNlZ21lbnRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW5kRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIHBvaW50OiBlbmQsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQ6IHNlZ21lbnRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBxdWV1ZS5pbnNlcnQoYmVnaW4sIGJlZ2luRGF0YSk7XHJcbiAgICAgICAgcXVldWUuaW5zZXJ0KGVuZCwgZW5kRGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgd2hpbGUgKCFxdWV1ZS5pc0VtcHR5KCkpIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBxdWV1ZS5wb3AoKTtcclxuICAgICAgICB2YXIgcCA9IGV2ZW50LmRhdGEucG9pbnQ7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGkgKyAnKSBjdXJyZW50IHBvaW50OiAnICsgZXZlbnQuZGF0YS5wb2ludC50b1N0cmluZygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnICAgcG9pbnQgdHlwZTogJyArIGV2ZW50LmRhdGEudHlwZSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJyAgIHF1ZXVlOiAnICsgcXVldWUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAgIHN0YXR1czogJyArIHN0YXR1cy50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ2JlZ2luJykge1xyXG5cclxuICAgICAgICAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcclxuICAgICAgICAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ2dyZWVuJywgZmlsbENvbG9yOiAnZ3JlZW4nfSkuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWdtZW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGFib3ZlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYmVsb3c6IG51bGxcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3RhdHVzLmluc2VydChldmVudC5kYXRhLnNlZ21lbnQpO1xyXG4gICAgICAgICAgICB2YXIgc2VnRSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGxzID0gc2VnRS5rZXkubWFwKGZ1bmN0aW9uKHApe3JldHVybiBMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKX0pO1xyXG4gICAgICAgICAgICB2YXIgbGluZSA9IEwucG9seWxpbmUobGxzLCB7Y29sb3I6ICdncmVlbid9KS5hZGRUbyhtYXApO1xyXG5cclxuICAgICAgICAgICAgbGluZS5iaW5kUG9wdXAoJ2FkZGVkJyArIGkpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlZ0EgPSBzdGF0dXMucHJldihzZWdFKTtcclxuICAgICAgICAgICAgdmFyIHNlZ0IgPSBzdGF0dXMubmV4dChzZWdFKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2VnQSAmJiBzZWdCKSB7XHJcbiAgICAgICAgICAgICAgICBzZWdCID0gc3RhdHVzLm5leHQoc3RhdHVzLm5leHQoc2VnRSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWdBICYmICFzZWdCKSB7XHJcbiAgICAgICAgICAgICAgICBzZWdBID0gc3RhdHVzLnByZXYoc3RhdHVzLnByZXYoc2VnRSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQikge1xyXG4gICAgICAgICAgICAgICBzZWdFLmFib3ZlID0gc2VnQjtcclxuICAgICAgICAgICAgICAgc2VnRS5hYm92ZS5iZWxvdyA9IHNlZ0U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlZ0EpIHtcclxuICAgICAgICAgICAgICAgc2VnRS5iZWxvdyA9IHNlZ0E7XHJcbiAgICAgICAgICAgICAgIHNlZ0UuYmVsb3cuYWJvdmUgPSBzZWdFO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVhSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnRS5rZXksIHNlZ0Eua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWFJbnRlcnNlY3Rpb25Qb2ludCAmJiAhb3V0cHV0LmZpbmQoZWFJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWFJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBlYUludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdFLmtleSwgc2VnQS5rZXldXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChlYUludGVyc2VjdGlvblBvaW50LCBlYUludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIHBvaW50OicgKyBlYUludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGViSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnRS5rZXksIHNlZ0Iua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWJJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlYkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGViSW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Iua2V5LCBzZWdFLmtleV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGViSW50ZXJzZWN0aW9uUG9pbnQsIGViSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgZWJJbnRlcnNlY3Rpb25Qb2ludDonICsgZWJJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIEVsc2UgSWYgKEUgaXMgYSByaWdodCBlbmRwb2ludCkge1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnZW5kJykge1xyXG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xyXG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAncmVkJywgZmlsbENvbG9yOiAncmVkJ30pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIHZhciBzZWdFID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWdBID0gc2VnRS5hYm92ZTtcclxuICAgICAgICAgICAgdmFyIHNlZ0IgPSBzZWdFLmJlbG93O1xyXG4gICAgICAgICAgICAvLyB2YXIgc2VnQSA9IHN0YXR1cy5wcmV2KHNlZ0UpO1xyXG4gICAgICAgICAgICAvLyB2YXIgc2VnQiA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTE9HXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgdmFyIGxscyA9IHNlZ0Uua2V5Lm1hcChmdW5jdGlvbihwKXtyZXR1cm4gTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSl9KTtcclxuICAgICAgICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMsIHtjb2xvcjogJ3JlZCd9KS5hZGRUbyhtYXApO1xyXG5cclxuICAgICAgICAgICAgIGxpbmUuYmluZFBvcHVwKCdyZW1vdmVkJyArIGkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ0EgJiYgc2VnQikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFiSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnQS5rZXksIHNlZ0Iua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWJJbnRlcnNlY3Rpb25Qb2ludCAmJiAhb3V0cHV0LmZpbmQoYWJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWJJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBhYkludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdBLmtleSwgc2VnQi5rZXldXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBJbnNlcnQgSSBpbnRvIEVRO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhYkludGVyc2VjdGlvblBvaW50LCBhYkludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGFiSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGFiSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG54ID0gc3RhdHVzLm5leHQoc2VnRSk7XHJcbiAgICAgICAgICAgIGlmIChueCl7XHJcbiAgICAgICAgICAgICAgbnguYmVsb3cgPSBzZWdFLmJlbG93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbnAgPSBzdGF0dXMucHJldihzZWdFKTtcclxuICAgICAgICAgICAgaWYgKG5wKXtcclxuICAgICAgICAgICAgICBucC5hYm92ZSA9IHNlZ0UuYWJvdmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhdHVzLnJlbW92ZShzZWdFLmtleSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBsbCA9IEwubGF0TG5nKFtwWzFdLCBwWzBdXSk7XHJcbiAgICAgICAgICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICBvdXRwdXQuaW5zZXJ0KGV2ZW50LmRhdGEucG9pbnQpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnRTEgYWJvdmUgc2VnRTIgYmUgRSdzIGludGVyc2VjdGluZyBzZWdtZW50cyBpbiBTTDtcclxuICAgICAgICAgICAgdmFyIHNlZzEgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnRzWzBdKSxcclxuICAgICAgICAgICAgICAgIHNlZzIgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnRzWzFdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWcxICYmIHNlZzIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBTd2FwIHRoZWlyIHBvc2l0aW9ucyBzbyB0aGF0IHNlZ0UyIGlzIG5vdyBhYm92ZSBzZWdFMTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAvLyBzdGF0dXMucHJldihzZWcxKSA9IHN0YXR1cy5maW5kKHNlZzIpO1xyXG4gICAgICAgICAgICAgICAgLy8gc3RhdHVzLm5leHQoc2VnMikgPSBzdGF0dXMuZmluZChzZWcxKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIExldCBzZWdBID0gdGhlIHNlZ21lbnQgYWJvdmUgc2VnRTIgaW4gU0w7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHNlZ0EgPSBzdGF0dXMubmV4dChzZWcxKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIExldCBzZWdCID0gdGhlIHNlZ21lbnQgYmVsb3cgc2VnRTEgaW4gU0w7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgc2VnQiA9IHN0YXR1cy5wcmV2KHNlZzIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlZ0EgPSBzZWcxLmFib3ZlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlZ0IgPSBzZWcyLmJlbG93O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlZzEuYWJvdmUpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VnMi5iZWxvdyk7XHJcbiAgICAgICAgICAgICAgICBzZWcxLmFib3ZlID0gc2VnMjtcclxuICAgICAgICAgICAgICAgIHNlZzIuYmVsb3cgPSBzZWcxO1xyXG4gICAgICAgICAgICAgICAgc2VnMS5iZWxvdyA9IHNlZ0I7XHJcbiAgICAgICAgICAgICAgICBzZWcyLmFib3ZlID0gc2VnQTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlZ0EpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYTJJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWcyLmtleSwgc2VnQS5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYTJJbnRlcnNlY3Rpb25Qb2ludCAmJiAhb3V0cHV0LmZpbmQoYTJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEySW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGEySW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnQS5rZXksIHNlZzIua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhMkludGVyc2VjdGlvblBvaW50LCBhMkludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBhMkludGVyc2VjdGlvblBvaW50OicgKyBhMkludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzZWdCKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGIxSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnMS5rZXksIHNlZ0Iua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGIxSW50ZXJzZWN0aW9uUG9pbnQgJiYgIW91dHB1dC5maW5kKGIxSW50ZXJzZWN0aW9uUG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiMUludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBiMUludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZzEua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoYjFJbnRlcnNlY3Rpb25Qb2ludCwgYjFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYjFJbnRlcnNlY3Rpb25Qb2ludDonICsgYjFJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgd2luZG93LnN0YXR1cyA9IHN0YXR1cztcclxuICAgIHdpbmRvdy5xdWV1ZSA9IHF1ZXVlO1xyXG5cclxuICAgIHJldHVybiBvdXRwdXQua2V5cygpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XHJcbiIsInZhciBFUFMgPSAxRS05O1xyXG5cclxuZnVuY3Rpb24gVXRpbHMoKSB7fTtcclxuXHJcblV0aWxzLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQvNC10L3RjNGI0LUgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QvtGB0YLQsNCy0LjRgiBhINC/0L4g0LzQtdC90YzRiNC10LzRgyDQuNC90LTQtdC60YHRgywg0YfQtdC8IGIsINGC0L4g0LXRgdGC0YwsIGEg0LjQtNGR0YIg0L/QtdGA0LLRi9C8LlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQstC10YDQvdGR0YIgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L7RgdGC0LDQstC40YIgYSDQuCBiINC90LXQuNC30LzQtdC90L3Ri9C80Lgg0L/QviDQvtGC0L3QvtGI0LXQvdC40Y4g0LTRgNGD0LMg0Log0LTRgNGD0LPRgyxcclxuICAgICAgICAgICAg0L3QviDQvtGC0YHQvtGA0YLQuNGA0YPQtdGCINC40YUg0L/QviDQvtGC0L3QvtGI0LXQvdC40Y4g0LrQviDQstGB0LXQvCDQtNGA0YPQs9C40Lwg0Y3Qu9C10LzQtdC90YLQsNC8LlxyXG4gICAgICAgICAgICDQntCx0YDQsNGC0LjRgtC1INCy0L3QuNC80LDQvdC40LU6INGB0YLQsNC90LTQsNGA0YIgRUNNQXNjcmlwdCDQvdC1INCz0LDRgNCw0L3RgtC40YDRg9C10YIg0LTQsNC90L3QvtC1INC/0L7QstC10LTQtdC90LjQtSwg0Lgg0LXQvNGDINGB0LvQtdC00YPRjtGCINC90LUg0LLRgdC1INCx0YDQsNGD0LfQtdGA0YtcclxuICAgICAgICAgICAgKNC90LDQv9GA0LjQvNC10YAsINCy0LXRgNGB0LjQuCBNb3ppbGxhINC/0L4g0LrRgNCw0LnQvdC10Lkg0LzQtdGA0LUsINC00L4gMjAwMyDQs9C+0LTQsCkuXHJcbiAgICAgICAg0JXRgdC70LggY29tcGFyZUZ1bmN0aW9uKGEsIGIpINCx0L7Qu9GM0YjQtSAwLCDRgdC+0YDRgtC40YDQvtCy0LrQsCDQv9C+0YHRgtCw0LLQuNGCIGIg0L/QviDQvNC10L3RjNGI0LXQvNGDINC40L3QtNC10LrRgdGDLCDRh9C10LwgYS5cclxuICAgICAgICDQpNGD0L3QutGG0LjRjyBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LTQvtC70LbQvdCwINCy0YHQtdCz0LTQsCDQstC+0LfQstGA0LDRidCw0YLRjCDQvtC00LjQvdCw0LrQvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1INC00LvRjyDQvtC/0YDQtdC00LXQu9GR0L3QvdC+0Lkg0L/QsNGA0Ysg0Y3Qu9C10LzQtdC90YLQvtCyIGEg0LggYi5cclxuICAgICAgICAgICAg0JXRgdC70Lgg0LHRg9C00YPRgiDQstC+0LfQstGA0LDRidCw0YLRjNGB0Y8g0L3QtdC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3Ri9C1INGA0LXQt9GD0LvRjNGC0LDRgtGLLCDQv9C+0YDRj9C00L7QuiDRgdC+0YDRgtC40YDQvtCy0LrQuCDQsdGD0LTQtdGCINC90LUg0L7Qv9GA0LXQtNC10LvRkdC9LlxyXG4gICAgKi9cclxuICAgIC8vIHBvaW50cyBjb21wYXJhdG9yXHJcbiAgICBjb21wYXJlUG9pbnRzOiBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgICAgIHkyID0gYlsxXTtcclxuXHJcbiAgICAgICAgaWYgKHgxID4geDIgfHwgKHgxID09PSB4MiAmJiB5MSA+IHkyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHgxIDwgeDIgfHwgKHgxID09PSB4MiAmJiB5MSA8IHkyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4MSA9PT0geDIgJiYgeTEgPT09IHkyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcGFyZVNlZ21lbnRzMTogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcblxyXG4gICAgICAgIGlmICh5MSA8IHkzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHkxID4geTMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wYXJlU2VnbWVudHM6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG5cclxuICAgICAgICB2YXIgeCA9IE1hdGgubWF4KE1hdGgubWluKHgxLCB4MiksIE1hdGgubWluKHgzLCB4NCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd4OiAnICsgeCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3kgZnJvbSB4OiAnICsgZ2V0WShiLCB4KSk7XHJcbiAgICAgICAgdmFyIGF5ID0gIGdldFkoYSwgeCk7XHJcbiAgICAgICAgdmFyIGJ5ID0gIGdldFkoYiwgeCk7XHJcbiAgICAgICAgLy8gcmV0dXJuIGdldFkoYSwgeCkgPCBnZXRZKGIsIHgpIC0gRVBTO1xyXG4gICAgICAgIC8vIEwubWFya2VyKEwubGF0TG5nKFt4LCBheV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzEgPiAyJykuYWRkVG8obWFwKTtcclxuICAgICAgICAvLyBMLm1hcmtlcihMLmxhdExuZyhbeCwgYnldLnNsaWNlKCkucmV2ZXJzZSgpKSkuYmluZFBvcHVwKCcyID4gMScpLmFkZFRvKG1hcCk7XHJcblxyXG4gICAgICAgIGlmIChheSA8IGJ5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2UgaWYgKGF5ID4gYnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmICh5MSA8IGJ5KSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAtMTtcclxuICAgICAgICAvLyB9IGVsc2UgaWYgKHkxID4gYnkpIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxuXHJcbiAgICBmaW5kRXF1YXRpb246IGZ1bmN0aW9uIChzZWdtZW50KSB7XHJcbiAgICAgICAgdmFyIHgxID0gc2VnbWVudFswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBzZWdtZW50WzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IHNlZ21lbnRbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gc2VnbWVudFsxXVsxXSxcclxuICAgICAgICAgICAgYSA9IHkxIC0geTIsXHJcbiAgICAgICAgICAgIGIgPSB4MiAtIHgxLFxyXG4gICAgICAgICAgICBjID0geDEgKiB5MiAtIHgyICogeTE7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGEgKyAneCArICcgKyBiICsgJ3kgKyAnICsgYyArICcgPSAwJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MzE5OC9ob3ctZG8teW91LWRldGVjdC13aGVyZS10d28tbGluZS1zZWdtZW50cy1pbnRlcnNlY3QvMTk2ODM0NSMxOTY4MzQ1XHJcbiAgICBiZXR3ZWVuOiBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gICAgICAgIC8vIHZhciBlcHMgPSAwLjAwMDAwMDE7XHJcblxyXG4gICAgICAgIHJldHVybiBhLUVQUyA8PSBiICYmIGIgPD0gYytFUFM7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICAgICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAgICAgdmFyIHkgPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHgpfHxpc05hTih5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHgxID49IHgyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MiwgeCwgeDEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHgxLCB4LCB4MikpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5MSA+PSB5Mikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTIsIHksIHkxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MSwgeSwgeTIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeDMgPj0geDQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDMsIHgsIHg0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkzID49IHk0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5NCwgeSwgeTMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkzLCB5LCB5NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbeCwgeV07XHJcbiAgICB9LFxyXG5cclxuICAgIHBvaW50T25MaW5lOiBmdW5jdGlvbiAobGluZSwgcG9pbnQpIHtcclxuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdLFxyXG4gICAgICAgICAgICB4MSA9IGJlZ2luWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGJlZ2luWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGVuZFswXSxcclxuICAgICAgICAgICAgeTIgPSBlbmRbMV0sXHJcbiAgICAgICAgICAgIHggPSBwb2ludFswXSxcclxuICAgICAgICAgICAgeSA9IHBvaW50WzFdO1xyXG5cclxuICAgICAgICByZXR1cm4gKCh4IC0geDEpICogKHkyIC0geTEpIC0gKHkgLSB5MSkgKiAoeDIgLSB4MSkgPT09IDApICYmICgoeCA+IHgxICYmIHggPCB4MikgfHwgKHggPiB4MiAmJiB4IDwgeDEpKTtcclxuICAgIH0sXHJcblxyXG4gICAgZmluZFk6IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50MiwgeCkge1xyXG4gICAgICAgIHZhciB4MSA9IHBvaW50MVswXSxcclxuICAgICAgICAgICAgeTEgPSBwb2ludDFbMV0sXHJcbiAgICAgICAgICAgIHgyID0gcG9pbnQyWzBdLFxyXG4gICAgICAgICAgICB5MiA9IHBvaW50MlsxXSxcclxuICAgICAgICAgICAgYSA9IHkxIC0geTIsXHJcbiAgICAgICAgICAgIGIgPSB4MiAtIHgxLFxyXG4gICAgICAgICAgICBjID0geDEgKiB5MiAtIHgyICogeTE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKC1jIC0gYSAqIHgpIC8gYjtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WShzZWdtZW50LCB4KSB7XHJcbiAgICB2YXIgeDEgPSBzZWdtZW50WzBdWzBdLFxyXG4gICAgICAgIHkxID0gc2VnbWVudFswXVsxXSxcclxuICAgICAgICB4MiA9IHNlZ21lbnRbMV1bMF0sXHJcbiAgICAgICAgeTIgPSBzZWdtZW50WzFdWzFdO1xyXG5cclxuICAgIC8vINC10YHQu9C4INC+0YLRgNC10LfQvtC6INCz0L7RgNC40LfQvtC90YLQsNC70LXQvSxcclxuICAgIC8vINCy0LXRgNC90LXQvCDQv9GA0L7RgdGC0L4geSDQv9GA0LDQstC+0LPQviDQutC+0L3RhtCwXHJcbiAgICBpZiAoTWF0aC5hYnMoeDIgLSB4MSkgPCBFUFMpIHtcclxuICAgICAgICByZXR1cm4geTE7XHJcbiAgICB9XHJcbiAgICAvLyDQsiDQvtGB0YLQsNC70YzQvdGL0YUg0YHQu9GD0YfQsNGP0YVcclxuICAgIC8vINCx0LXRgNC10Lwg0L/RgNC+0L/QvtGA0YbQuNGOXHJcbiAgICByZXR1cm4geTEgKyAoeTIgLSB5MSkgKiAoeCAtIHgxKSAvICh4MiAtIHgxKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVXRpbHM7XHJcbiJdfQ==
