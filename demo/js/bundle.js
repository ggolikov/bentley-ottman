(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// module.exports = [
//     [[37.595781792145225,55.735406916551476],[37.66241768210842,55.797343636156974]],
//     [[37.62659779190759,55.7998001505342],[37.626955076362854,55.72929839966215]],
//     [[37.64168372750481,55.73033802535862],[37.66556969369039,55.739413687532135]],
//     [[37.642588284404546,55.77311193037385],[37.65310008555496,55.73250865548459]]
// ];
//
module.exports = [
// [[37.5974390794743,55.74469278795457],[37.6143776656478,55.75001160832225]],
[[37.614796879097014, 55.77136671879989], [37.6532084051303, 55.77652834617445]], [[37.62640984440731, 55.722094265965104], [37.64833014306549, 55.777111577259016]], [[37.63078150145173, 55.75287198641849], [37.64200173756859, 55.73467884511657]]];

},{}],2:[function(require,module,exports){
var findIntersections = require('../../index');
var data = require('../data/index.js');

var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}),
    point = L.latLng([55.753210, 37.621766]),
    map = new L.Map('map', { layers: [osm], center: point, zoom: 12, maxZoom: 22 }),
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

var points = turf.random('points', 18, {
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
// почему-то первыми иногда приходят события end
// некоторые точки не видны?


var Tree = require('avl'),
    utils = require('./utils');

/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {
    var queue = new Tree(utils.comparePoints),
        status = new Tree(utils.compareSegments),
        result = [];

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

    /*
     * LOG
     */
    // var values = queue.values();

    // values.forEach(function (value, index, array) {
    //     var ll = L.latLng([p[1], p[0]]);
    //     var mrk = L.circleMarker(ll, {radius: 4, color: 'red', fillColor: 'FF00' + 2 ** index}).addTo(map);
    //     mrk.bindPopup('' + index + '\n' + p[0] + '\n' + p[1]);
    // });

    var i = 0;
    /*
     * LOG END
     */

    // debug:
    // L.marker(L.latLng([].slice().reverse())).addTo(map);
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

            status.insert(event.data.segment);
            var segE = status.find(event.data.segment);

            /*
             * LOG
             */
            var lls = segE.key.map(function (p) {
                return L.latLng(p.slice().reverse());
            });
            var line = L.polyline(lls, { color: 'green' }).addTo(map);

            line.bindPopup('added' + i);

            // console.log('now adding segment: ');
            segE.key.forEach(function (p) {
                // console.log('x: ' + p[0] + ' y: ' + p[1]);
            });
            /*
             * LOG END
             */

            var segA = status.prev(segE);
            var segB = status.next(segE);
            // console.log(segA);
            // console.log(segB);

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
                        segments: [segE.key, segB.key]
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
            var segA = status.prev(segE);
            var segB = status.next(segE);

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
                    if (!queue.find(abIntersectionPoint)) {
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
            /*
             * LOG
             */
            //             Delete segE from SL;
            // console.log('tree before removing segment: ');
            // console.log(status.toString());
            // var removing = segE.data;

            // console.log('now removing segment: ');
            // console.log(status.find(segE.key));
            // removing.forEach(function (p) {
            // console.log('x: ' + p[0] + ' y: ' + p[1]);
            // })
            /*
             * LOG END
             */
            status.remove(segE.key);
        } else {
            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, { radius: 4, color: 'blue', fillColor: 'blue' }).addTo(map);
            result.push(event.data.point);
            //             Let segE1 above segE2 be E's intersecting segments in SL;
            var seg1 = status.find(event.data.segments[0]),
                seg2 = status.find(event.data.segments[1]);

            //             Swap their positions so that segE2 is now above segE1;
            // console.log(status);
            // status.prev(seg1) = status.find(seg2);
            // status.next(seg2) = status.find(seg1);
            //             Let segA = the segment above segE2 in SL;
            var segA = status.next(seg1);
            //             Let segB = the segment below segE1 in SL;
            var segB = status.prev(seg2);

            if (segA) {
                var a2IntersectionPoint = utils.findSegmentsIntersection(seg2.key, segA.key);

                if (a2IntersectionPoint) {
                    if (!queue.find(a2IntersectionPoint)) {
                        var a2IntersectionPointData = {
                            point: a2IntersectionPoint,
                            type: 'intersection',
                            segments: [seg2.key, segA.key]
                        };
                        queue.insert(a2IntersectionPoint, a2IntersectionPointData);
                        console.log('inserted a2IntersectionPoint:' + a2IntersectionPoint.toString());
                    }
                }
            }
            if (segB) {
                var b1IntersectionPoint = utils.findSegmentsIntersection(seg1.key, segB.key);

                if (b1IntersectionPoint) {
                    if (!queue.find(b1IntersectionPoint)) {
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

    status.values().forEach(function (value, index, array) {

        lls = value.map(function (p) {
            return L.latLng(p.slice().reverse());
        });

        var line = L.polyline(lls).addTo(map);
        line.bindPopup('' + index);
    });

    window.status = status;
    window.queue = queue;

    // console.log(result);
    return result;
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
        var x1 = b[0][0],
            y1 = b[0][1],
            x2 = b[1][0],
            y2 = b[1][1],
            x3 = a[0][0],
            y3 = a[0][1],
            x4 = a[1][0],
            y4 = a[1][1],
            intersectionPoint = findSegmentsIntersection(a, b);

        // console.log(intersectionPoint);
        if (!intersectionPoint) {
            // находим векторное произведение векторов b и b[0]a[0]
            var Dba1 = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
            // находим векторное произведение векторов b и b[0]a[1]
            var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
            // находим знак векторных произведений
            var D = Dba1 * Dba2;

            if (D < 0) {
                return -1;
            } else if (D > 0) {
                return 1;
            } else if (D === 0) {
                return 0;
            }
        } else {
            console.log('they are intersecting');
            var intersectionX = intersectionPoint[0];
            var intersectionY = intersectionPoint[1];

            // if (y3 < intersectionY) {
            //     return -1
            // } else if (y3 > intersectionY) {
            //     return 1;
            // } else if (y3 === intersectionY) {
            //     return 0;
            // }
            // if (x3 < intersectionX) {
            //     return - 1
            // } else if (x3 > intersectionX) {
            //     return 1;
            // } else if (x3 === intersectionX) {
            //     return 0;
            // }
            if (y3 < y1) {
                return -1;
            } else if (y3 > y1) {
                return 1;
            } else if (y3 === y1) {
                return 0;
            }

            // находим векторное произведение векторов b и b[0]a[0]
            var D = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
            // находим векторное произведение векторов b и b[0]a[1]
            // var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
            // находим знак векторных произведений
            // var D = Dba1 * Dba2;

            if (D < 0) {
                return -1;
            } else if (D > 0) {
                return 1;
            } else if (D === 0) {
                return 0;
            }

            return 0;
        }

        function between(a, b, c) {
            var eps = 0.0000001;

            return a - eps <= b && b <= c + eps;
        }

        function findSegmentsIntersection(a, b) {
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
                    if (between(x2, x, x1)) {
                        return false;
                    }
                } else {
                    if (between(x1, x, x2)) {
                        return false;
                    }
                }
                if (y1 >= y2) {
                    if (between(y2, y, y1)) {
                        return false;
                    }
                } else {
                    if (between(y1, y, y2)) {
                        return false;
                    }
                }
                if (x3 >= x4) {
                    if (between(x4, x, x3)) {
                        return false;
                    }
                } else {
                    if (between(x3, x, x4)) {
                        return false;
                    }
                }
                if (y3 >= y4) {
                    if (between(y4, y, y3)) {
                        return false;
                    }
                } else {
                    if (between(y3, y, y4)) {
                        return false;
                    }
                }
            }
            return [x, y];
        }
    },

    compareSegments2: function (a, b) {
        var x1 = b[0][0],
            y1 = b[0][1],
            x2 = b[1][0],
            y2 = b[1][1],
            x3 = a[0][0],
            y3 = a[0][1],
            x4 = a[1][0],
            y4 = a[1][1];

        // test if the triple of endpoints left(Y), right(Y), left(X) is in
        // counterclockwise order.

        var nx1 = x3,
            ny1 = findY(b[0], b[1], x3);

        console.log([nx1, ny1]);

        var D = (y2 - y1) * (x3 - x2) - (y3 - y2) * (x2 - x1);
        // var D = (x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2);
        var D = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);

        // находим векторное произведение векторов b и b[0]a[0]
        var Dba1 = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
        // находим векторное произведение векторов b и b[0]a[1]
        var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
        // находим знак векторных произведений
        // var D = Dba1 * Dba2;

        // console.log('Dba1: ' + Dba1);
        // console.log('Dba2: ' + Dba2);
        // console.log('D: ' + D);

        if (D < 0) {
            return -1;
        } else if (D > 0) {
            return 1;
        } else if (D === 0) {
            return 0;
        }

        function findY(point1, point2, x) {
            var x1 = point1[0],
                y1 = point1[1],
                x2 = point2[0],
                y2 = point2[1],
                a = y1 - y2,
                b = x2 - x1,
                c = x1 * y2 - x2 * y1;

            return (-c - a * x) / b;
        }
    },

    compareSegments1: function (a, b) {
        // нужно вернуть сегмент, который в данной точке
        // является первым ближайшим по x или y
        // сортировка по y в точке с данной координатой x
        // найти, с какой стороны лежит левая точка b по отношению к a

        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];
        //
        var nx1 = x3,
            ny1 = findY(a[0], a[1], x3);

        // Векторное произведение в координатах
        // var D = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
        // var D = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
        // var intersectionPoint = findSegmentsIntersection(a, b);

        // вставляет не в тот сегмент
        var v1 = [x2 - x1, y2 - y1],
            v2 = [x4 - x3, y4 - y3];
        // дерево выдает ошибку
        var v1 = [x2 - x1, y2 - y1],
            v2 = [x3 - x1, y3 - y1];
        // дерево выдает ошибку
        var v1 = [x2 - nx1, y2 - ny1],
            v2 = [x3 - nx1, y3 - ny1];

        // Векторное произведение
        var D = v1[0] * v2[1] - v1[1] * v2[0];

        if (D < 0) {
            return -1;
        } else if (D > 0) {
            return 1;
        } else if (D === 0) {
            return 0;
        }

        function between(a, b, c) {
            var eps = 0.0000001;

            return a - eps <= b && b <= c + eps;
        }

        function findSegmentsIntersection(a, b) {
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
                    if (between(x2, x, x1)) {
                        return false;
                    }
                } else {
                    if (between(x1, x, x2)) {
                        return false;
                    }
                }
                if (y1 >= y2) {
                    if (between(y2, y, y1)) {
                        return false;
                    }
                } else {
                    if (between(y1, y, y2)) {
                        return false;
                    }
                }
                if (x3 >= x4) {
                    if (between(x4, x, x3)) {
                        return false;
                    }
                } else {
                    if (between(x3, x, x4)) {
                        return false;
                    }
                }
                if (y3 >= y4) {
                    if (between(y4, y, y3)) {
                        return false;
                    }
                } else {
                    if (between(y3, y, y4)) {
                        return false;
                    }
                }
            }
            return [x, y];
        }

        function findY(point1, point2, x) {
            var x1 = point1[0],
                y1 = point1[1],
                x2 = point2[0],
                y2 = point2[1],
                a = y1 - y2,
                b = x2 - x1,
                c = x1 * y2 - x2 * y1;

            return (-c - a * x) / b;
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXHN3ZWVwbGluZS5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sT0FBUCxHQUFpQjtBQUNiO0FBQ0EsQ0FBQyxDQUFDLGtCQUFELEVBQW9CLGlCQUFwQixDQUFELEVBQXdDLENBQUMsZ0JBQUQsRUFBa0IsaUJBQWxCLENBQXhDLENBRmEsRUFHYixDQUFDLENBQUMsaUJBQUQsRUFBbUIsa0JBQW5CLENBQUQsRUFBd0MsQ0FBQyxpQkFBRCxFQUFtQixrQkFBbkIsQ0FBeEMsQ0FIYSxFQUliLENBQUMsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBRCxFQUF1QyxDQUFDLGlCQUFELEVBQW1CLGlCQUFuQixDQUF2QyxDQUphLENBQWpCOzs7QUNQQSxJQUFJLG9CQUFvQixRQUFRLGFBQVIsQ0FBeEI7QUFDQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksTUFBTSxFQUFFLFNBQUYsQ0FBWSxpRUFBWixFQUErRTtBQUNqRixhQUFTLEVBRHdFO0FBRWpGLGlCQUFhO0FBRm9FLENBQS9FLENBQVY7QUFBQSxJQUlJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFULENBSlo7QUFBQSxJQUtJLE1BQU0sSUFBSSxFQUFFLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEVBQUMsUUFBUSxDQUFDLEdBQUQsQ0FBVCxFQUFnQixRQUFRLEtBQXhCLEVBQStCLE1BQU0sRUFBckMsRUFBeUMsU0FBUyxFQUFsRCxFQUFqQixDQUxWO0FBQUEsSUFNSSxPQUFPLFNBQVMsY0FBVCxDQUF3QixT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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFQLEdBQWlCLElBQUksS0FBSixFQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBtb2R1bGUuZXhwb3J0cyA9IFtcclxuLy8gICAgIFtbMzcuNTk1NzgxNzkyMTQ1MjI1LDU1LjczNTQwNjkxNjU1MTQ3Nl0sWzM3LjY2MjQxNzY4MjEwODQyLDU1Ljc5NzM0MzYzNjE1Njk3NF1dLFxyXG4vLyAgICAgW1szNy42MjY1OTc3OTE5MDc1OSw1NS43OTk4MDAxNTA1MzQyXSxbMzcuNjI2OTU1MDc2MzYyODU0LDU1LjcyOTI5ODM5OTY2MjE1XV0sXHJcbi8vICAgICBbWzM3LjY0MTY4MzcyNzUwNDgxLDU1LjczMDMzODAyNTM1ODYyXSxbMzcuNjY1NTY5NjkzNjkwMzksNTUuNzM5NDEzNjg3NTMyMTM1XV0sXHJcbi8vICAgICBbWzM3LjY0MjU4ODI4NDQwNDU0Niw1NS43NzMxMTE5MzAzNzM4NV0sWzM3LjY1MzEwMDA4NTU1NDk2LDU1LjczMjUwODY1NTQ4NDU5XV1cclxuLy8gXTtcclxuLy9cclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcbiAgICAvLyBbWzM3LjU5NzQzOTA3OTQ3NDMsNTUuNzQ0NjkyNzg3OTU0NTddLFszNy42MTQzNzc2NjU2NDc4LDU1Ljc1MDAxMTYwODMyMjI1XV0sXHJcbiAgICBbWzM3LjYxNDc5Njg3OTA5NzAxNCw1NS43NzEzNjY3MTg3OTk4OV0sWzM3LjY1MzIwODQwNTEzMDMsNTUuNzc2NTI4MzQ2MTc0NDVdXSxcclxuICAgIFtbMzcuNjI2NDA5ODQ0NDA3MzEsNTUuNzIyMDk0MjY1OTY1MTA0XSxbMzcuNjQ4MzMwMTQzMDY1NDksNTUuNzc3MTExNTc3MjU5MDE2XV0sXHJcbiAgICBbWzM3LjYzMDc4MTUwMTQ1MTczLDU1Ljc1Mjg3MTk4NjQxODQ5XSxbMzcuNjQyMDAxNzM3NTY4NTksNTUuNzM0Njc4ODQ1MTE2NTddXVxyXG5dO1xyXG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xyXG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvaW5kZXguanMnKTtcclxuXHJcbnZhciBvc20gPSBMLnRpbGVMYXllcignaHR0cDovL3tzfS5iYXNlbWFwcy5jYXJ0b2Nkbi5jb20vbGlnaHRfbm9sYWJlbHMve3p9L3t4fS97eX0ucG5nJywge1xyXG4gICAgICAgIG1heFpvb206IDIyLFxyXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5vcmdcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+J1xyXG4gICAgfSksXHJcbiAgICBwb2ludCA9IEwubGF0TG5nKFs1NS43NTMyMTAsIDM3LjYyMTc2Nl0pLFxyXG4gICAgbWFwID0gbmV3IEwuTWFwKCdtYXAnLCB7bGF5ZXJzOiBbb3NtXSwgY2VudGVyOiBwb2ludCwgem9vbTogMTIsIG1heFpvb206IDIyfSksXHJcbiAgICByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKTtcclxuXHJcbndpbmRvdy5tYXAgPSBtYXA7XHJcblxyXG52YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpLFxyXG4gICAgbiA9IGJvdW5kcy5fbm9ydGhFYXN0LmxhdCxcclxuICAgIGUgPSBib3VuZHMuX25vcnRoRWFzdC5sbmcsXHJcbiAgICBzID0gYm91bmRzLl9zb3V0aFdlc3QubGF0LFxyXG4gICAgdyA9IGJvdW5kcy5fc291dGhXZXN0LmxuZyxcclxuICAgIGhlaWdodCA9IG4gLSBzLFxyXG4gICAgd2lkdGggPSBlIC0gdyxcclxuICAgIHFIZWlnaHQgPSBoZWlnaHQgLyA0LFxyXG4gICAgcVdpZHRoID0gd2lkdGggLyA0LFxyXG4gICAgbGluZXMgPSBbXTtcclxuXHJcbnZhciBwb2ludHMgPSB0dXJmLnJhbmRvbSgncG9pbnRzJywgMTgsIHtcclxuICAgIGJib3g6IFt3ICsgcVdpZHRoLCBzICsgcUhlaWdodCwgZSAtIHFXaWR0aCwgbiAtIHFIZWlnaHRdXHJcbn0pO1xyXG5cclxudmFyIGNvb3JkcyA9IHBvaW50cy5mZWF0dXJlcy5tYXAoZnVuY3Rpb24oZmVhdHVyZSkge1xyXG4gICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XHJcbn0pXHJcblxyXG5mb3IgKHZhciBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrPTIpIHtcclxuICAgIGxpbmVzLnB1c2goW2Nvb3Jkc1tpXSwgY29vcmRzW2krMV1dKTtcclxufVxyXG5cclxuLy8gZHJhd0xpbmVzKGxpbmVzKTtcclxuZHJhd0xpbmVzKGRhdGEpO1xyXG5cclxuLy8gdmFyIHBzID0gZmluZEludGVyc2VjdGlvbnMobGluZXMsIG1hcCk7XHJcbnZhciBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGRhdGEsIG1hcCk7XHJcblxyXG5wcy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKSwge3JhZGl1czogNSwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5hZGRUbyhtYXApO1xyXG59KVxyXG5cclxuZnVuY3Rpb24gZHJhd0xpbmVzKGFycmF5KSB7XHJcbiAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXSxcclxuICAgICAgICAgICAgZW5kID0gbGluZVsxXTtcclxuXHJcbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoYmVnaW4pLCB7cmFkaXVzOiAyLCBmaWxsQ29sb3I6IFwiI0ZGRkYwMFwiLCB3ZWlnaHQ6IDJ9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGVuZCksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgTC5wb2x5bGluZShbYmVnaW4sIGVuZF0sIHt3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xyXG4gICAgfSk7XHJcbn1cclxuIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi9zcmMvc3dlZXBsaW5lLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuYXZsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFByaW50cyB0cmVlIGhvcml6b250YWxseVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBwcmludCAocm9vdCwgcHJpbnROb2RlKSB7XG4gIGlmICggcHJpbnROb2RlID09PSB2b2lkIDAgKSBwcmludE5vZGUgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbi5rZXk7IH07XG5cbiAgdmFyIG91dCA9IFtdO1xuICByb3cocm9vdCwgJycsIHRydWUsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBvdXQucHVzaCh2KTsgfSwgcHJpbnROb2RlKTtcbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBQcmludHMgbGV2ZWwgb2YgdGhlIHRyZWVcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICBwcmVmaXhcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgaXNUYWlsXG4gKiBAcGFyYW0gIHtGdW5jdGlvbihpbjpzdHJpbmcpOnZvaWR9ICAgIG91dFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9ICBwcmludE5vZGVcbiAqL1xuZnVuY3Rpb24gcm93IChyb290LCBwcmVmaXgsIGlzVGFpbCwgb3V0LCBwcmludE5vZGUpIHtcbiAgaWYgKHJvb3QpIHtcbiAgICBvdXQoKFwiXCIgKyBwcmVmaXggKyAoaXNUYWlsID8gJ+KUlOKUgOKUgCAnIDogJ+KUnOKUgOKUgCAnKSArIChwcmludE5vZGUocm9vdCkpICsgXCJcXG5cIikpO1xuICAgIHZhciBpbmRlbnQgPSBwcmVmaXggKyAoaXNUYWlsID8gJyAgICAnIDogJ+KUgiAgICcpO1xuICAgIGlmIChyb290LmxlZnQpICB7IHJvdyhyb290LmxlZnQsICBpbmRlbnQsIGZhbHNlLCBvdXQsIHByaW50Tm9kZSk7IH1cbiAgICBpZiAocm9vdC5yaWdodCkgeyByb3cocm9vdC5yaWdodCwgaW5kZW50LCB0cnVlLCAgb3V0LCBwcmludE5vZGUpOyB9XG4gIH1cbn1cblxuXG4vKipcbiAqIElzIHRoZSB0cmVlIGJhbGFuY2VkIChub25lIG9mIHRoZSBzdWJ0cmVlcyBkaWZmZXIgaW4gaGVpZ2h0IGJ5IG1vcmUgdGhhbiAxKVxuICogQHBhcmFtICB7Tm9kZX0gICAgcm9vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNCYWxhbmNlZChyb290KSB7XG4gIGlmIChyb290ID09PSBudWxsKSB7IHJldHVybiB0cnVlOyB9IC8vIElmIG5vZGUgaXMgZW1wdHkgdGhlbiByZXR1cm4gdHJ1ZVxuXG4gIC8vIEdldCB0aGUgaGVpZ2h0IG9mIGxlZnQgYW5kIHJpZ2h0IHN1YiB0cmVlc1xuICB2YXIgbGggPSBoZWlnaHQocm9vdC5sZWZ0KTtcbiAgdmFyIHJoID0gaGVpZ2h0KHJvb3QucmlnaHQpO1xuXG4gIGlmIChNYXRoLmFicyhsaCAtIHJoKSA8PSAxICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QubGVmdCkgICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QucmlnaHQpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gSWYgd2UgcmVhY2ggaGVyZSB0aGVuIHRyZWUgaXMgbm90IGhlaWdodC1iYWxhbmNlZFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIENvbXB1dGUgdGhlICdoZWlnaHQnIG9mIGEgdHJlZS5cbiAqIEhlaWdodCBpcyB0aGUgbnVtYmVyIG9mIG5vZGVzIGFsb25nIHRoZSBsb25nZXN0IHBhdGhcbiAqIGZyb20gdGhlIHJvb3Qgbm9kZSBkb3duIHRvIHRoZSBmYXJ0aGVzdCBsZWFmIG5vZGUuXG4gKlxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBoZWlnaHQobm9kZSkge1xuICByZXR1cm4gbm9kZSA/ICgxICsgTWF0aC5tYXgoaGVpZ2h0KG5vZGUubGVmdCksIGhlaWdodChub2RlLnJpZ2h0KSkpIDogMDtcbn1cblxuLy8gZnVuY3Rpb24gY3JlYXRlTm9kZSAocGFyZW50LCBsZWZ0LCByaWdodCwgaGVpZ2h0LCBrZXksIGRhdGEpIHtcbi8vICAgcmV0dXJuIHsgcGFyZW50LCBsZWZ0LCByaWdodCwgYmFsYW5jZUZhY3RvcjogaGVpZ2h0LCBrZXksIGRhdGEgfTtcbi8vIH1cblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBwYXJlbnQ6ICAgICAgICBOb2RlfE51bGwsXG4gKiAgIGxlZnQ6ICAgICAgICAgIE5vZGV8TnVsbCxcbiAqICAgcmlnaHQ6ICAgICAgICAgTm9kZXxOdWxsLFxuICogICBiYWxhbmNlRmFjdG9yOiBOdW1iZXIsXG4gKiAgIGtleTogICAgICAgICAgIGFueSxcbiAqICAgZGF0YTogICAgICAgICAgb2JqZWN0P1xuICogfX0gTm9kZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeyp9IEtleVxuICovXG5cbi8qKlxuICogRGVmYXVsdCBjb21wYXJpc29uIGZ1bmN0aW9uXG4gKiBAcGFyYW0geyp9IGFcbiAqIEBwYXJhbSB7Kn0gYlxuICovXG5mdW5jdGlvbiBERUZBVUxUX0NPTVBBUkUgKGEsIGIpIHsgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwOyB9XG5cblxuLyoqXG4gKiBTaW5nbGUgbGVmdCByb3RhdGlvblxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuZnVuY3Rpb24gcm90YXRlTGVmdCAobm9kZSkge1xuICB2YXIgcmlnaHROb2RlID0gbm9kZS5yaWdodDtcbiAgbm9kZS5yaWdodCAgICA9IHJpZ2h0Tm9kZS5sZWZ0O1xuXG4gIGlmIChyaWdodE5vZGUubGVmdCkgeyByaWdodE5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgcmlnaHROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAocmlnaHROb2RlLnBhcmVudCkge1xuICAgIGlmIChyaWdodE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9IHJpZ2h0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5yaWdodCA9IHJpZ2h0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IHJpZ2h0Tm9kZTtcbiAgcmlnaHROb2RlLmxlZnQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAocmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cbiAgcmV0dXJuIHJpZ2h0Tm9kZTtcbn1cblxuXG5mdW5jdGlvbiByb3RhdGVSaWdodCAobm9kZSkge1xuICB2YXIgbGVmdE5vZGUgPSBub2RlLmxlZnQ7XG4gIG5vZGUubGVmdCA9IGxlZnROb2RlLnJpZ2h0O1xuICBpZiAobm9kZS5sZWZ0KSB7IG5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgbGVmdE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChsZWZ0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobGVmdE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5sZWZ0ID0gbGVmdE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5yaWdodCA9IGxlZnROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gbGVmdE5vZGU7XG4gIGxlZnROb2RlLnJpZ2h0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IGxlZnROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByZXR1cm4gbGVmdE5vZGU7XG59XG5cblxuLy8gZnVuY3Rpb24gbGVmdEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgcm90YXRlTGVmdChub2RlLmxlZnQpO1xuLy8gICByZXR1cm4gcm90YXRlUmlnaHQobm9kZSk7XG4vLyB9XG5cblxuLy8gZnVuY3Rpb24gcmlnaHRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHJvdGF0ZVJpZ2h0KG5vZGUucmlnaHQpO1xuLy8gICByZXR1cm4gcm90YXRlTGVmdChub2RlKTtcbi8vIH1cblxuXG52YXIgVHJlZSA9IGZ1bmN0aW9uIFRyZWUgKGNvbXBhcmF0b3IpIHtcbiAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3IgfHwgREVGQVVMVF9DT01QQVJFO1xuICB0aGlzLl9yb290ID0gbnVsbDtcbiAgdGhpcy5fc2l6ZSA9IDA7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBzaXplOiB7fSB9O1xuXG5cbi8qKlxuICogQ2xlYXIgdGhlIHRyZWVcbiAqL1xuVHJlZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICB0aGlzLl9yb290ID0gbnVsbDtcbn07XG5cbi8qKlxuICogTnVtYmVyIG9mIG5vZGVzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbnByb3RvdHlwZUFjY2Vzc29ycy5zaXplLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3NpemU7XG59O1xuXG5cbi8qKlxuICogV2hldGhlciB0aGUgdHJlZSBjb250YWlucyBhIG5vZGUgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMgKGtleSkge1xuICBpZiAodGhpcy5fcm9vdCl7XG4gICAgdmFyIG5vZGUgICAgID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gICAgd2hpbGUgKG5vZGUpe1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3Ioa2V5LCBub2RlLmtleSk7XG4gICAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cbi8qKlxuICogU3VjY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiBuZXh0IChub2RlKSB7XG4gIHZhciBzdWNjZXNzb3IgPSBub2RlO1xuICBpZiAoc3VjY2Vzc29yKSB7XG4gICAgaWYgKHN1Y2Nlc3Nvci5yaWdodCkge1xuICAgICAgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnJpZ2h0O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IubGVmdCkgeyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IubGVmdDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLnJpZ2h0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBzdWNjZXNzb3I7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWNjZXNzb3I7XG59O1xuXG5cbi8qKlxuICogUHJlZGVjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uIHByZXYgKG5vZGUpIHtcbiAgdmFyIHByZWRlY2Vzc29yID0gbm9kZTtcbiAgaWYgKHByZWRlY2Vzc29yKSB7XG4gICAgaWYgKHByZWRlY2Vzc29yLmxlZnQpIHtcbiAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IubGVmdDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5yaWdodCkgeyBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnJpZ2h0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWRlY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IubGVmdCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gcHJlZGVjZXNzb3I7XG4gICAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcHJlZGVjZXNzb3I7XG59O1xuLyogZXNsaW50LWVuYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cblxuLyoqXG4gKiBAcGFyYW17RnVuY3Rpb24obm9kZTpOb2RlKTp2b2lkfSBmblxuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuVHJlZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2ggKGZuKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgZG9uZSA9IGZhbHNlLCBpID0gMDtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICAvLyBSZWFjaCB0aGUgbGVmdCBtb3N0IE5vZGUgb2YgdGhlIGN1cnJlbnQgTm9kZVxuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICAvLyBQbGFjZSBwb2ludGVyIHRvIGEgdHJlZSBub2RlIG9uIHRoZSBzdGFja1xuICAgICAgLy8gYmVmb3JlIHRyYXZlcnNpbmcgdGhlIG5vZGUncyBsZWZ0IHN1YnRyZWVcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJhY2tUcmFjayBmcm9tIHRoZSBlbXB0eSBzdWJ0cmVlIGFuZCB2aXNpdCB0aGUgTm9kZVxuICAgICAgLy8gYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2s7IGhvd2V2ZXIsIGlmIHRoZSBzdGFjayBpc1xuICAgICAgLy8gZW1wdHkgeW91IGFyZSBkb25lXG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICBmbihjdXJyZW50LCBpKyspO1xuXG4gICAgICAgIC8vIFdlIGhhdmUgdmlzaXRlZCB0aGUgbm9kZSBhbmQgaXRzIGxlZnRcbiAgICAgICAgLy8gc3VidHJlZS4gTm93LCBpdCdzIHJpZ2h0IHN1YnRyZWUncyB0dXJuXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBhbGwga2V5cyBpbiBvcmRlclxuICogQHJldHVybiB7QXJyYXk8S2V5Pn1cbiAqL1xuVHJlZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uIGtleXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5rZXkpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYGRhdGFgIGZpZWxkcyBvZiBhbGwgbm9kZXMgaW4gb3JkZXIuXG4gKiBAcmV0dXJuIHtBcnJheTwqPn1cbiAqL1xuVHJlZS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gdmFsdWVzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQuZGF0YSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1pbmltdW0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1pbk5vZGUgPSBmdW5jdGlvbiBtaW5Ob2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtYXgga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1heE5vZGUgPSBmdW5jdGlvbiBtYXhOb2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogTWluIGtleVxuICogQHJldHVybiB7S2V5fVxuICovXG5UcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiBtaW4gKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuLyoqXG4gKiBNYXgga2V5XG4gKiBAcmV0dXJuIHtLZXl8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gbWF4ICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuXG4vKipcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5ICgpIHtcbiAgcmV0dXJuICF0aGlzLl9yb290O1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG5vZGUgd2l0aCBzbWFsbGVzdCBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290LCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gIGlmIChub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgcmV0dXJuVmFsdWUgPSB7IGtleTogbm9kZS5rZXksIGRhdGE6IG5vZGUuZGF0YSB9O1xuICAgIHRoaXMucmVtb3ZlKG5vZGUua2V5KTtcbiAgfVxuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogRmluZCBub2RlIGJ5IGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiBmaW5kIChrZXkpIHtcbiAgdmFyIHJvb3QgPSB0aGlzLl9yb290O1xuICBpZiAocm9vdCA9PT0gbnVsbCkgIHsgcmV0dXJuIG51bGw7IH1cbiAgaWYgKGtleSA9PT0gcm9vdC5rZXkpIHsgcmV0dXJuIHJvb3Q7IH1cblxuICB2YXIgc3VidHJlZSA9IHJvb3QsIGNtcDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB3aGlsZSAoc3VidHJlZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBzdWJ0cmVlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gc3VidHJlZTsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgc3VidHJlZSA9IHN1YnRyZWUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgc3VidHJlZSA9IHN1YnRyZWUucmlnaHQ7IH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuXG4vKipcbiAqIEluc2VydCBhIG5vZGUgaW50byB0aGUgdHJlZVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcGFyYW17Kn0gW2RhdGFdXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCAoa2V5LCBkYXRhKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7XG4gICAgdGhpcy5fcm9vdCA9IHtcbiAgICAgIHBhcmVudDogbnVsbCwgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgICBrZXk6IGtleSwgZGF0YTogZGF0YVxuICAgIH07XG4gICAgdGhpcy5fc2l6ZSsrO1xuICAgIHJldHVybiB0aGlzLl9yb290O1xuICB9XG5cbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB2YXIgbm9kZSAgPSB0aGlzLl9yb290O1xuICB2YXIgcGFyZW50PSBudWxsO1xuICB2YXIgY21wICAgPSAwO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBwYXJlbnQgPSBub2RlO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cblxuICB2YXIgbmV3Tm9kZSA9IHtcbiAgICBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICBwYXJlbnQ6IHBhcmVudCwga2V5OiBrZXksIGRhdGE6IGRhdGEsXG4gIH07XG4gIGlmIChjbXAgPCAwKSB7IHBhcmVudC5sZWZ0PSBuZXdOb2RlOyB9XG4gIGVsc2UgICAgICAgeyBwYXJlbnQucmlnaHQgPSBuZXdOb2RlOyB9XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChjb21wYXJlKHBhcmVudC5rZXksIGtleSkgPCAwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvL2xldCBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gbGV0IG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCQxID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3QkMTsgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICB0aGlzLl9zaXplKys7XG4gIHJldHVybiBuZXdOb2RlO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgdGhlIG5vZGUgZnJvbSB0aGUgdHJlZS4gSWYgbm90IGZvdW5kLCByZXR1cm5zIG51bGwuXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge05vZGU6TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrZXkpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIHZhciBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHZhciByZXR1cm5WYWx1ZSA9IG5vZGUua2V5O1xuXG4gIGlmIChub2RlLmxlZnQpIHtcbiAgICB2YXIgbWF4ID0gbm9kZS5sZWZ0O1xuXG4gICAgd2hpbGUgKG1heC5sZWZ0IHx8IG1heC5yaWdodCkge1xuICAgICAgd2hpbGUgKG1heC5yaWdodCkgeyBtYXggPSBtYXgucmlnaHQ7IH1cblxuICAgICAgbm9kZS5rZXkgPSBtYXgua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgICBpZiAobWF4LmxlZnQpIHtcbiAgICAgICAgbm9kZSA9IG1heDtcbiAgICAgICAgbWF4ID0gbWF4LmxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1heC5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgbm9kZSA9IG1heDtcbiAgfVxuXG4gIGlmIChub2RlLnJpZ2h0KSB7XG4gICAgdmFyIG1pbiA9IG5vZGUucmlnaHQ7XG5cbiAgICB3aGlsZSAobWluLmxlZnQgfHwgbWluLnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWluLmxlZnQpIHsgbWluID0gbWluLmxlZnQ7IH1cblxuICAgICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICAgIGlmIChtaW4ucmlnaHQpIHtcbiAgICAgICAgbm9kZSA9IG1pbjtcbiAgICAgICAgbWluID0gbWluLnJpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgIG5vZGUgPSBtaW47XG4gIH1cblxuICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIHZhciBwcCAgID0gbm9kZTtcblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKHBhcmVudC5sZWZ0ID09PSBwcCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy9sZXQgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIHZhciBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdDtcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gbGV0IG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCQxID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3QkMTsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdCQxO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gLTEgfHwgcGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgYnJlYWs7IH1cblxuICAgIHBwICAgPSBwYXJlbnQ7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIGlmIChub2RlLnBhcmVudCkge1xuICAgIGlmIChub2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7IG5vZGUucGFyZW50LmxlZnQ9IG51bGw7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgIHsgbm9kZS5wYXJlbnQucmlnaHQgPSBudWxsOyB9XG4gIH1cblxuICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkgeyB0aGlzLl9yb290ID0gbnVsbDsgfVxuXG4gIHRoaXMuX3NpemUtLTtcbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHJlZSBpcyBiYWxhbmNlZFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaXNCYWxhbmNlZCA9IGZ1bmN0aW9uIGlzQmFsYW5jZWQkMSAoKSB7XG4gIHJldHVybiBpc0JhbGFuY2VkKHRoaXMuX3Jvb3QpO1xufTtcblxuXG4vKipcbiAqIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJlZSAtIHByaW1pdGl2ZSBob3Jpem9udGFsIHByaW50LW91dFxuICogQHBhcmFte0Z1bmN0aW9uKE5vZGUpOlN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuVHJlZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAocHJpbnROb2RlKSB7XG4gIHJldHVybiBwcmludCh0aGlzLl9yb290LCBwcmludE5vZGUpO1xufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIFRyZWUucHJvdG90eXBlLCBwcm90b3R5cGVBY2Nlc3NvcnMgKTtcblxucmV0dXJuIFRyZWU7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdmwuanMubWFwXG4iLCIvLyDQv9C+0YfQtdC80YMt0YLQviDQv9C10YDQstGL0LzQuCDQuNC90L7Qs9C00LAg0L/RgNC40YXQvtC00Y/RgiDRgdC+0LHRi9GC0LjRjyBlbmRcclxuLy8g0L3QtdC60L7RgtC+0YDRi9C1INGC0L7Rh9C60Lgg0L3QtSDQstC40LTQvdGLP1xyXG5cclxuXHJcblxyXG52YXIgVHJlZSA9IHJlcXVpcmUoJ2F2bCcpLFxyXG4gICAgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudHMgc2V0IG9mIHNlZ21lbnRzIGludGVyc2VjdGluZyBzd2VlcGxpbmUgW1tbeDEsIHkxXSwgW3gyLCB5Ml1dIC4uLiBbW3htLCB5bV0sIFt4biwgeW5dXV1cclxuICovXHJcblxyXG5mdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9ucyhzZWdtZW50cywgbWFwKSB7XHJcbiAgICB2YXIgcXVldWUgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlUG9pbnRzKSxcclxuICAgICAgICBzdGF0dXMgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlU2VnbWVudHMpLFxyXG4gICAgICAgIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIHNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKHNlZ21lbnQpIHtcclxuICAgICAgICBzZWdtZW50LnNvcnQodXRpbHMuY29tcGFyZVBvaW50cyk7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gc2VnbWVudFswXSxcclxuICAgICAgICAgICAgZW5kID0gc2VnbWVudFsxXSxcclxuICAgICAgICAgICAgYmVnaW5EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgcG9pbnQ6IGJlZ2luLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2JlZ2luJyxcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQ6IHNlZ21lbnRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW5kRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIHBvaW50OiBlbmQsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnZW5kJyxcclxuICAgICAgICAgICAgICAgIHNlZ21lbnQ6IHNlZ21lbnRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBxdWV1ZS5pbnNlcnQoYmVnaW4sIGJlZ2luRGF0YSk7XHJcbiAgICAgICAgcXVldWUuaW5zZXJ0KGVuZCwgZW5kRGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogTE9HXHJcbiAgICAgKi9cclxuICAgIC8vIHZhciB2YWx1ZXMgPSBxdWV1ZS52YWx1ZXMoKTtcclxuXHJcbiAgICAvLyB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBhcnJheSkge1xyXG4gICAgLy8gICAgIHZhciBsbCA9IEwubGF0TG5nKFtwWzFdLCBwWzBdXSk7XHJcbiAgICAvLyAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ3JlZCcsIGZpbGxDb2xvcjogJ0ZGMDAnICsgMiAqKiBpbmRleH0pLmFkZFRvKG1hcCk7XHJcbiAgICAvLyAgICAgbXJrLmJpbmRQb3B1cCgnJyArIGluZGV4ICsgJ1xcbicgKyBwWzBdICsgJ1xcbicgKyBwWzFdKTtcclxuICAgIC8vIH0pO1xyXG5cclxuICAgIHZhciBpID0gMDtcclxuICAgIC8qXHJcbiAgICAgKiBMT0cgRU5EXHJcbiAgICAgKi9cclxuXHJcbiAgICAvLyBkZWJ1ZzpcclxuICAgIC8vIEwubWFya2VyKEwubGF0TG5nKFtdLnNsaWNlKCkucmV2ZXJzZSgpKSkuYWRkVG8obWFwKTtcclxuICAgIHdoaWxlICghcXVldWUuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgdmFyIGV2ZW50ID0gcXVldWUucG9wKCk7XHJcbiAgICAgICAgdmFyIHAgPSBldmVudC5kYXRhLnBvaW50O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhpICsgJykgY3VycmVudCBwb2ludDogJyArIGV2ZW50LmRhdGEucG9pbnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAgIHBvaW50IHR5cGU6ICcgKyBldmVudC5kYXRhLnR5cGUpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCcgICBxdWV1ZTogJyArIHF1ZXVlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCcgICBzdGF0dXM6ICcgKyBzdGF0dXMudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgIGlmIChldmVudC5kYXRhLnR5cGUgPT09ICdiZWdpbicpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBsbCA9IEwubGF0TG5nKFtwWzFdLCBwWzBdXSk7XHJcbiAgICAgICAgICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdncmVlbicsIGZpbGxDb2xvcjogJ2dyZWVuJ30pLmFkZFRvKG1hcCk7XHJcblxyXG4gICAgICAgICAgICBzdGF0dXMuaW5zZXJ0KGV2ZW50LmRhdGEuc2VnbWVudCk7XHJcbiAgICAgICAgICAgIHZhciBzZWdFID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIExPR1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGxscyA9IHNlZ0Uua2V5Lm1hcChmdW5jdGlvbihwKXtyZXR1cm4gTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSl9KTtcclxuICAgICAgICAgICAgdmFyIGxpbmUgPSBMLnBvbHlsaW5lKGxscywge2NvbG9yOiAnZ3JlZW4nfSkuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgICAgIGxpbmUuYmluZFBvcHVwKCdhZGRlZCcgKyBpKTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25vdyBhZGRpbmcgc2VnbWVudDogJyk7XHJcbiAgICAgICAgICAgIHNlZ0Uua2V5LmZvckVhY2goZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd4OiAnICsgcFswXSArICcgeTogJyArIHBbMV0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBMT0cgRU5EXHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlZ0EgPSBzdGF0dXMucHJldihzZWdFKTtcclxuICAgICAgICAgICAgdmFyIHNlZ0IgPSBzdGF0dXMubmV4dChzZWdFKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2VnQSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNlZ0IpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ0EpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlYUludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZ0Uua2V5LCBzZWdBLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVhSW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWFJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBlYUludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdFLmtleSwgc2VnQS5rZXldXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChlYUludGVyc2VjdGlvblBvaW50LCBlYUludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIHBvaW50OicgKyBlYUludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGViSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnRS5rZXksIHNlZ0Iua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWJJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlYkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGViSW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Uua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGViSW50ZXJzZWN0aW9uUG9pbnQsIGViSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgZWJJbnRlcnNlY3Rpb25Qb2ludDonICsgZWJJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIEVsc2UgSWYgKEUgaXMgYSByaWdodCBlbmRwb2ludCkge1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnZW5kJykge1xyXG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xyXG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAncmVkJywgZmlsbENvbG9yOiAncmVkJ30pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIHZhciBzZWdFID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50KTtcclxuICAgICAgICAgICAgdmFyIHNlZ0EgPSBzdGF0dXMucHJldihzZWdFKTtcclxuICAgICAgICAgICAgdmFyIHNlZ0IgPSBzdGF0dXMubmV4dChzZWdFKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIExPR1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgIHZhciBsbHMgPSBzZWdFLmtleS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XHJcbiAgICAgICAgICAgICB2YXIgbGluZSA9IEwucG9seWxpbmUobGxzLCB7Y29sb3I6ICdyZWQnfSkuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgICAgICBsaW5lLmJpbmRQb3B1cCgncmVtb3ZlZCcgKyBpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWdBICYmIHNlZ0IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhYkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZ0Eua2V5LCBzZWdCLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFiSW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXF1ZXVlLmZpbmQoYWJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFiSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGFiSW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnQS5rZXksIHNlZ0Iua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBJbnNlcnQgSSBpbnRvIEVRO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoYWJJbnRlcnNlY3Rpb25Qb2ludCwgYWJJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYWJJbnRlcnNlY3Rpb25Qb2ludDonICsgYWJJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTE9HXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBEZWxldGUgc2VnRSBmcm9tIFNMO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndHJlZSBiZWZvcmUgcmVtb3Zpbmcgc2VnbWVudDogJyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cy50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgLy8gdmFyIHJlbW92aW5nID0gc2VnRS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25vdyByZW1vdmluZyBzZWdtZW50OiAnKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3RhdHVzLmZpbmQoc2VnRS5rZXkpKTtcclxuICAgICAgICAgICAgLy8gcmVtb3ZpbmcuZm9yRWFjaChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3g6ICcgKyBwWzBdICsgJyB5OiAnICsgcFsxXSk7XHJcbiAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIExPRyBFTkRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHN0YXR1cy5yZW1vdmUoc2VnRS5rZXkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBsbCA9IEwubGF0TG5nKFtwWzFdLCBwWzBdXSk7XHJcbiAgICAgICAgICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChldmVudC5kYXRhLnBvaW50KTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgTGV0IHNlZ0UxIGFib3ZlIHNlZ0UyIGJlIEUncyBpbnRlcnNlY3Rpbmcgc2VnbWVudHMgaW4gU0w7XHJcbiAgICAgICAgICAgIHZhciBzZWcxID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50c1swXSksXHJcbiAgICAgICAgICAgICAgICBzZWcyID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50c1sxXSk7XHJcblxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBTd2FwIHRoZWlyIHBvc2l0aW9ucyBzbyB0aGF0IHNlZ0UyIGlzIG5vdyBhYm92ZSBzZWdFMTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3RhdHVzKTtcclxuICAgICAgICAgICAgLy8gc3RhdHVzLnByZXYoc2VnMSkgPSBzdGF0dXMuZmluZChzZWcyKTtcclxuICAgICAgICAgICAgLy8gc3RhdHVzLm5leHQoc2VnMikgPSBzdGF0dXMuZmluZChzZWcxKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgTGV0IHNlZ0EgPSB0aGUgc2VnbWVudCBhYm92ZSBzZWdFMiBpbiBTTDtcclxuICAgICAgICAgICAgdmFyIHNlZ0EgPSBzdGF0dXMubmV4dChzZWcxKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgTGV0IHNlZ0IgPSB0aGUgc2VnbWVudCBiZWxvdyBzZWdFMSBpbiBTTDtcclxuICAgICAgICAgICAgdmFyIHNlZ0IgPSBzdGF0dXMucHJldihzZWcyKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWdBKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYTJJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWcyLmtleSwgc2VnQS5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhMkludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFxdWV1ZS5maW5kKGEySW50ZXJzZWN0aW9uUG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhMkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBhMkludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZzIua2V5LCBzZWdBLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoYTJJbnRlcnNlY3Rpb25Qb2ludCwgYTJJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYTJJbnRlcnNlY3Rpb25Qb2ludDonICsgYTJJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWdCKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYjFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWcxLmtleSwgc2VnQi5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiMUludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFxdWV1ZS5maW5kKGIxSW50ZXJzZWN0aW9uUG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiMUludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBiMUludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZzEua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoYjFJbnRlcnNlY3Rpb25Qb2ludCwgYjFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYjFJbnRlcnNlY3Rpb25Qb2ludDonICsgYjFJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGkrKztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0dXMudmFsdWVzKCkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBhcnJheSkge1xyXG5cclxuICAgICAgICBsbHMgPSB2YWx1ZS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XHJcblxyXG4gICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMpLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgbGluZS5iaW5kUG9wdXAoJycgKyBpbmRleCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB3aW5kb3cuc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgd2luZG93LnF1ZXVlID0gcXVldWU7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xyXG4iLCJmdW5jdGlvbiBVdGlscygpIHt9O1xyXG5cclxuVXRpbHMucHJvdG90eXBlID0ge1xyXG5cclxuICAgIC8qXHJcbiAgICAgICAg0JXRgdC70LggY29tcGFyZUZ1bmN0aW9uKGEsIGIpINC80LXQvdGM0YjQtSAwLCDRgdC+0YDRgtC40YDQvtCy0LrQsCDQv9C+0YHRgtCw0LLQuNGCIGEg0L/QviDQvNC10L3RjNGI0LXQvNGDINC40L3QtNC10LrRgdGDLCDRh9C10LwgYiwg0YLQviDQtdGB0YLRjCwgYSDQuNC00ZHRgiDQv9C10YDQstGL0LwuXHJcbiAgICAgICAg0JXRgdC70LggY29tcGFyZUZ1bmN0aW9uKGEsIGIpINCy0LXRgNC90ZHRgiAwLCDRgdC+0YDRgtC40YDQvtCy0LrQsCDQvtGB0YLQsNCy0LjRgiBhINC4IGIg0L3QtdC40LfQvNC10L3QvdGL0LzQuCDQv9C+INC+0YLQvdC+0YjQtdC90LjRjiDQtNGA0YPQsyDQuiDQtNGA0YPQs9GDLFxyXG4gICAgICAgICAgICDQvdC+INC+0YLRgdC+0YDRgtC40YDRg9C10YIg0LjRhSDQv9C+INC+0YLQvdC+0YjQtdC90LjRjiDQutC+INCy0YHQtdC8INC00YDRg9Cz0LjQvCDRjdC70LXQvNC10L3RgtCw0LwuXHJcbiAgICAgICAgICAgINCe0LHRgNCw0YLQuNGC0LUg0LLQvdC40LzQsNC90LjQtTog0YHRgtCw0L3QtNCw0YDRgiBFQ01Bc2NyaXB0INC90LUg0LPQsNGA0LDQvdGC0LjRgNGD0LXRgiDQtNCw0L3QvdC+0LUg0L/QvtCy0LXQtNC10L3QuNC1LCDQuCDQtdC80YMg0YHQu9C10LTRg9GO0YIg0L3QtSDQstGB0LUg0LHRgNCw0YPQt9C10YDRi1xyXG4gICAgICAgICAgICAo0L3QsNC/0YDQuNC80LXRgCwg0LLQtdGA0YHQuNC4IE1vemlsbGEg0L/QviDQutGA0LDQudC90LXQuSDQvNC10YDQtSwg0LTQviAyMDAzINCz0L7QtNCwKS5cclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LHQvtC70YzRiNC1IDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L7RgdGC0LDQstC40YIgYiDQv9C+INC80LXQvdGM0YjQtdC80YMg0LjQvdC00LXQutGB0YMsINGH0LXQvCBhLlxyXG4gICAgICAgINCk0YPQvdC60YbQuNGPIGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQtNC+0LvQttC90LAg0LLRgdC10LPQtNCwINCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC+0LTQuNC90LDQutC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUg0LTQu9GPINC+0L/RgNC10LTQtdC70ZHQvdC90L7QuSDQv9Cw0YDRiyDRjdC70LXQvNC10L3RgtC+0LIgYSDQuCBiLlxyXG4gICAgICAgICAgICDQldGB0LvQuCDQsdGD0LTRg9GCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGM0YHRjyDQvdC10L/QvtGB0LvQtdC00L7QstCw0YLQtdC70YzQvdGL0LUg0YDQtdC30YPQu9GM0YLQsNGC0YssINC/0L7RgNGP0LTQvtC6INGB0L7RgNGC0LjRgNC+0LLQutC4INCx0YPQtNC10YIg0L3QtSDQvtC/0YDQtdC00LXQu9GR0L0uXHJcbiAgICAqL1xyXG4gICAgLy8gcG9pbnRzIGNvbXBhcmF0b3JcclxuICAgIGNvbXBhcmVQb2ludHM6IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMV0sXHJcbiAgICAgICAgICAgIHgyID0gYlswXSxcclxuICAgICAgICAgICAgeTIgPSBiWzFdO1xyXG5cclxuICAgICAgICBpZiAoeDEgPiB4MiB8fCAoeDEgPT09IHgyICYmIHkxID4geTIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeDEgPCB4MiB8fCAoeDEgPT09IHgyICYmIHkxIDwgeTIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHgxID09PSB4MiAmJiB5MSA9PT0geTIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wYXJlU2VnbWVudHM6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYlsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICBpbnRlcnNlY3Rpb25Qb2ludCA9IGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihhLCBiKTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgIGlmICghaW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgLy8g0L3QsNGF0L7QtNC40Lwg0LLQtdC60YLQvtGA0L3QvtC1INC/0YDQvtC40LfQstC10LTQtdC90LjQtSDQstC10LrRgtC+0YDQvtCyIGIg0LggYlswXWFbMF1cclxuICAgICAgICAgICAgdmFyIERiYTEgPSAoeDIgLSB4MSkgKiAoeTMgLSB5MSkgLSAoeTIgLSB5MSkgKiAoeDMgLSB4MSk7XHJcbiAgICAgICAgICAgIC8vINC90LDRhdC+0LTQuNC8INCy0LXQutGC0L7RgNC90L7QtSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LUg0LLQtdC60YLQvtGA0L7QsiBiINC4IGJbMF1hWzFdXHJcbiAgICAgICAgICAgIHZhciBEYmEyID0gKHgyIC0geDEpICogKHk0IC0geTEpIC0gKHkyIC0geTEpICogKHg0IC0geDEpO1xyXG4gICAgICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQt9C90LDQuiDQstC10LrRgtC+0YDQvdGL0YUg0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC5XHJcbiAgICAgICAgICAgIHZhciBEID0gRGJhMSAqIERiYTI7XHJcblxyXG4gICAgICAgICAgICBpZiAoRCA8IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChEID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoRCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGhleSBhcmUgaW50ZXJzZWN0aW5nJyk7XHJcbiAgICAgICAgICAgIHZhciBpbnRlcnNlY3Rpb25YID0gaW50ZXJzZWN0aW9uUG9pbnRbMF07XHJcbiAgICAgICAgICAgIHZhciBpbnRlcnNlY3Rpb25ZID0gaW50ZXJzZWN0aW9uUG9pbnRbMV07XHJcblxyXG4gICAgICAgICAgICAvLyBpZiAoeTMgPCBpbnRlcnNlY3Rpb25ZKSB7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gLTFcclxuICAgICAgICAgICAgLy8gfSBlbHNlIGlmICh5MyA+IGludGVyc2VjdGlvblkpIHtcclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAvLyB9IGVsc2UgaWYgKHkzID09PSBpbnRlcnNlY3Rpb25ZKSB7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBpZiAoeDMgPCBpbnRlcnNlY3Rpb25YKSB7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gLSAxXHJcbiAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoeDMgPiBpbnRlcnNlY3Rpb25YKSB7XHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIGlmICh4MyA9PT0gaW50ZXJzZWN0aW9uWCkge1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgaWYgKHkzIDwgeTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHkzID4geTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHkzID09PSB5MSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vINC90LDRhdC+0LTQuNC8INCy0LXQutGC0L7RgNC90L7QtSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LUg0LLQtdC60YLQvtGA0L7QsiBiINC4IGJbMF1hWzBdXHJcbiAgICAgICAgICAgIHZhciBEID0gKHgyIC0geDEpICogKHkzIC0geTEpIC0gKHkyIC0geTEpICogKHgzIC0geDEpO1xyXG4gICAgICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQstC10LrRgtC+0YDQvdC+0LUg0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LXQutGC0L7RgNC+0LIgYiDQuCBiWzBdYVsxXVxyXG4gICAgICAgICAgICAvLyB2YXIgRGJhMiA9ICh4MiAtIHgxKSAqICh5NCAtIHkxKSAtICh5MiAtIHkxKSAqICh4NCAtIHgxKTtcclxuICAgICAgICAgICAgLy8g0L3QsNGF0L7QtNC40Lwg0LfQvdCw0Log0LLQtdC60YLQvtGA0L3Ri9GFINC/0YDQvtC40LfQstC10LTQtdC90LjQuVxyXG4gICAgICAgICAgICAvLyB2YXIgRCA9IERiYTEgKiBEYmEyO1xyXG5cclxuICAgICAgICAgICAgaWYgKEQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoRCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKEQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYmV0d2VlbihhLCBiLCBjKSB7XHJcbiAgICAgICAgICAgIHZhciBlcHMgPSAwLjAwMDAwMDE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYS1lcHMgPD0gYiAmJiBiIDw9IGMrZXBzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuICAgICAgICAgICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgICAgICB2YXIgeSA9ICgoeDEgKiB5MiAtIHkxICogeDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzICogeTQgLSB5MyAqIHg0KSkgL1xyXG4gICAgICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAgICAgICAgIGlmIChpc05hTih4KXx8aXNOYU4oeSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHgyLCB4LCB4MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh5MSA+PSB5Mikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHkyLCB5LCB5MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5MSwgeSwgeTIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh4MyA+PSB4NCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4MywgeCwgeDQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh5MyA+PSB5NCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHk0LCB5LCB5MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gW3gsIHldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBhcmVTZWdtZW50czI6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYlsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBhWzFdWzFdO1xyXG5cclxuICAgICAgICAgICAgLy8gdGVzdCBpZiB0aGUgdHJpcGxlIG9mIGVuZHBvaW50cyBsZWZ0KFkpLCByaWdodChZKSwgbGVmdChYKSBpcyBpblxyXG4gICAgICAgICAgICAvLyBjb3VudGVyY2xvY2t3aXNlIG9yZGVyLlxyXG5cclxuICAgICAgICB2YXIgbngxID0geDMsXHJcbiAgICAgICAgICAgIG55MSA9IGZpbmRZKGJbMF0sIGJbMV0sIHgzKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFtueDEsIG55MV0pO1xyXG5cclxuICAgICAgICB2YXIgRCA9ICh5MiAtIHkxKSAqICh4MyAtIHgyKSAtICh5MyAtIHkyKSAqICh4MiAtIHgxKTtcclxuICAgICAgICAvLyB2YXIgRCA9ICh4MSAtIHgyKSAqICh5MyAtIHkyKSAtICh5MSAtIHkyKSAqICh4MyAtIHgyKTtcclxuICAgICAgICB2YXIgRCA9ICh4MiAtIHgxKSAqICh5MyAtIHkxKSAtICh5MiAtIHkxKSAqICh4MyAtIHgxKTtcclxuXHJcbiAgICAgICAgLy8g0L3QsNGF0L7QtNC40Lwg0LLQtdC60YLQvtGA0L3QvtC1INC/0YDQvtC40LfQstC10LTQtdC90LjQtSDQstC10LrRgtC+0YDQvtCyIGIg0LggYlswXWFbMF1cclxuICAgICAgICB2YXIgRGJhMSA9ICh4MiAtIHgxKSAqICh5MyAtIHkxKSAtICh5MiAtIHkxKSAqICh4MyAtIHgxKTtcclxuICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQstC10LrRgtC+0YDQvdC+0LUg0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LXQutGC0L7RgNC+0LIgYiDQuCBiWzBdYVsxXVxyXG4gICAgICAgIHZhciBEYmEyID0gKHgyIC0geDEpICogKHk0IC0geTEpIC0gKHkyIC0geTEpICogKHg0IC0geDEpO1xyXG4gICAgICAgIC8vINC90LDRhdC+0LTQuNC8INC30L3QsNC6INCy0LXQutGC0L7RgNC90YvRhSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LlcclxuICAgICAgICAvLyB2YXIgRCA9IERiYTEgKiBEYmEyO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnRGJhMTogJyArIERiYTEpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdEYmEyOiAnICsgRGJhMik7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0Q6ICcgKyBEKTtcclxuXHJcbiAgICAgICAgaWYgKEQgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2UgaWYgKEQgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoRCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRZIChwb2ludDEsIHBvaW50MiwgeCkge1xyXG4gICAgICAgICAgICB2YXIgeDEgPSBwb2ludDFbMF0sXHJcbiAgICAgICAgICAgICAgICB5MSA9IHBvaW50MVsxXSxcclxuICAgICAgICAgICAgICAgIHgyID0gcG9pbnQyWzBdLFxyXG4gICAgICAgICAgICAgICAgeTIgPSBwb2ludDJbMV0sXHJcbiAgICAgICAgICAgICAgICBhID0geTEgLSB5MixcclxuICAgICAgICAgICAgICAgIGIgPSB4MiAtIHgxLFxyXG4gICAgICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICgtYyAtIGEgKiB4KSAvIGI7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wYXJlU2VnbWVudHMxOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIC8vINC90YPQttC90L4g0LLQtdGA0L3Rg9GC0Ywg0YHQtdCz0LzQtdC90YIsINC60L7RgtC+0YDRi9C5INCyINC00LDQvdC90L7QuSDRgtC+0YfQutC1XHJcbiAgICAgICAgLy8g0Y/QstC70Y/QtdGC0YHRjyDQv9C10YDQstGL0Lwg0LHQu9C40LbQsNC50YjQuNC8INC/0L4geCDQuNC70LggeVxyXG4gICAgICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L4geSDQsiDRgtC+0YfQutC1INGBINC00LDQvdC90L7QuSDQutC+0L7RgNC00LjQvdCw0YLQvtC5IHhcclxuICAgICAgICAvLyDQvdCw0LnRgtC4LCDRgSDQutCw0LrQvtC5INGB0YLQvtGA0L7QvdGLINC70LXQttC40YIg0LvQtdCy0LDRjyDRgtC+0YfQutCwIGIg0L/QviDQvtGC0L3QvtGI0LXQvdC40Y4g0LogYVxyXG5cclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICAgICAgLy9cclxuICAgICAgICB2YXIgbngxID0geDMsXHJcbiAgICAgICAgICAgIG55MSA9IGZpbmRZKGFbMF0sIGFbMV0sIHgzKTtcclxuXHJcbiAgICAgICAgLy8g0JLQtdC60YLQvtGA0L3QvtC1INC/0YDQvtC40LfQstC10LTQtdC90LjQtSDQsiDQutC+0L7RgNC00LjQvdCw0YLQsNGFXHJcbiAgICAgICAgLy8gdmFyIEQgPSAoeDIgLSB4MSkgKiAoeTMgLSB5MSkgLSAoeTIgLSB5MSkgKiAoeDMgLSB4MSk7XHJcbiAgICAgICAgLy8gdmFyIEQgPSAoeDQgLSB4MykgKiAoeTEgLSB5MykgLSAoeTQgLSB5MykgKiAoeDEgLSB4Myk7XHJcbiAgICAgICAgLy8gdmFyIGludGVyc2VjdGlvblBvaW50ID0gZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKGEsIGIpO1xyXG5cclxuICAgICAgICAgICAgLy8g0LLRgdGC0LDQstC70Y/QtdGCINC90LUg0LIg0YLQvtGCINGB0LXQs9C80LXQvdGCXHJcbiAgICAgICAgICAgIHZhciB2MSA9IFt4MiAtIHgxLCB5MiAtIHkxXSxcclxuICAgICAgICAgICAgICAgIHYyID0gW3g0IC0geDMsIHk0IC0geTNdO1xyXG4gICAgICAgICAgICAvLyDQtNC10YDQtdCy0L4g0LLRi9C00LDQtdGCINC+0YjQuNCx0LrRg1xyXG4gICAgICAgICAgICB2YXIgdjEgPSBbeDIgLSB4MSwgeTIgLSB5MV0sXHJcbiAgICAgICAgICAgICAgICB2MiA9IFt4MyAtIHgxLCB5MyAtIHkxXTtcclxuICAgICAgICAgICAgLy8g0LTQtdGA0LXQstC+INCy0YvQtNCw0LXRgiDQvtGI0LjQsdC60YNcclxuICAgICAgICAgICAgdmFyIHYxID0gW3gyIC0gbngxLCB5MiAtIG55MV0sXHJcbiAgICAgICAgICAgICAgICB2MiA9IFt4MyAtIG54MSwgeTMgLSBueTFdO1xyXG5cclxuICAgICAgICAgICAgLy8g0JLQtdC60YLQvtGA0L3QvtC1INC/0YDQvtC40LfQstC10LTQtdC90LjQtVxyXG4gICAgICAgICAgICB2YXIgRCA9IHYxWzBdICogdjJbMV0gLSB2MVsxXSAqIHYyWzBdO1xyXG5cclxuICAgICAgICAgICAgaWYgKEQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoRCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKEQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJldHdlZW4gKGEsIGIsIGMpIHtcclxuICAgICAgICAgICAgdmFyIGVwcyA9IDAuMDAwMDAwMTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhLWVwcyA8PSBiICYmIGIgPD0gYytlcHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuICAgICAgICAgICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgICAgICB2YXIgeSA9ICgoeDEgKiB5MiAtIHkxICogeDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzICogeTQgLSB5MyAqIHg0KSkgL1xyXG4gICAgICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAgICAgICAgIGlmIChpc05hTih4KXx8aXNOYU4oeSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHgyLCB4LCB4MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh5MSA+PSB5Mikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHkyLCB5LCB5MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5MSwgeSwgeTIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh4MyA+PSB4NCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4MywgeCwgeDQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh5MyA+PSB5NCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHk0LCB5LCB5MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gW3gsIHldO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRZIChwb2ludDEsIHBvaW50MiwgeCkge1xyXG4gICAgICAgICAgICB2YXIgeDEgPSBwb2ludDFbMF0sXHJcbiAgICAgICAgICAgICAgICB5MSA9IHBvaW50MVsxXSxcclxuICAgICAgICAgICAgICAgIHgyID0gcG9pbnQyWzBdLFxyXG4gICAgICAgICAgICAgICAgeTIgPSBwb2ludDJbMV0sXHJcbiAgICAgICAgICAgICAgICBhID0geTEgLSB5MixcclxuICAgICAgICAgICAgICAgIGIgPSB4MiAtIHgxLFxyXG4gICAgICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICgtYyAtIGEgKiB4KSAvIGI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgZmluZEVxdWF0aW9uOiBmdW5jdGlvbiAoc2VnbWVudCkge1xyXG4gICAgICAgIHZhciB4MSA9IHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gc2VnbWVudFswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IHNlZ21lbnRbMV1bMV0sXHJcbiAgICAgICAgICAgIGEgPSB5MSAtIHkyLFxyXG4gICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhhICsgJ3ggKyAnICsgYiArICd5ICsgJyArIGMgKyAnID0gMCcpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBBZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjMxOTgvaG93LWRvLXlvdS1kZXRlY3Qtd2hlcmUtdHdvLWxpbmUtc2VnbWVudHMtaW50ZXJzZWN0LzE5NjgzNDUjMTk2ODM0NVxyXG4gICAgYmV0d2VlbjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcclxuICAgICAgICB2YXIgZXBzID0gMC4wMDAwMDAxO1xyXG5cclxuICAgICAgICByZXR1cm4gYS1lcHMgPD0gYiAmJiBiIDw9IGMrZXBzO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgICAgIHZhciB4ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgIHZhciB5ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgIGlmIChpc05hTih4KXx8aXNOYU4oeSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDIsIHgsIHgxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeTEgPj0geTIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkyLCB5LCB5MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHgzID49IHg0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4NCwgeCwgeDMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHgzLCB4LCB4NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5MyA+PSB5NCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTQsIHksIHkzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3gsIHldO1xyXG4gICAgfSxcclxuXHJcbiAgICBwb2ludE9uTGluZTogZnVuY3Rpb24gKGxpbmUsIHBvaW50KSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXSxcclxuICAgICAgICAgICAgZW5kID0gbGluZVsxXSxcclxuICAgICAgICAgICAgeDEgPSBiZWdpblswXSxcclxuICAgICAgICAgICAgeTEgPSBiZWdpblsxXSxcclxuICAgICAgICAgICAgeDIgPSBlbmRbMF0sXHJcbiAgICAgICAgICAgIHkyID0gZW5kWzFdLFxyXG4gICAgICAgICAgICB4ID0gcG9pbnRbMF0sXHJcbiAgICAgICAgICAgIHkgPSBwb2ludFsxXTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoeCAtIHgxKSAqICh5MiAtIHkxKSAtICh5IC0geTEpICogKHgyIC0geDEpID09PSAwKSAmJiAoKHggPiB4MSAmJiB4IDwgeDIpIHx8ICh4ID4geDIgJiYgeCA8IHgxKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRZOiBmdW5jdGlvbiAocG9pbnQxLCBwb2ludDIsIHgpIHtcclxuICAgICAgICB2YXIgeDEgPSBwb2ludDFbMF0sXHJcbiAgICAgICAgICAgIHkxID0gcG9pbnQxWzFdLFxyXG4gICAgICAgICAgICB4MiA9IHBvaW50MlswXSxcclxuICAgICAgICAgICAgeTIgPSBwb2ludDJbMV0sXHJcbiAgICAgICAgICAgIGEgPSB5MSAtIHkyLFxyXG4gICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICgtYyAtIGEgKiB4KSAvIGI7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IFV0aWxzO1xyXG4iXX0=
