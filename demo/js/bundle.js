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
[[37.614796879097014, 55.77136671879989], [37.6532084051303, 55.77652834617445]], [[37.62640984440731, 55.722094265965104], [37.64833014306549, 55.770111577259016]], [[37.63078150145173, 55.75287198641849], [37.64200173756859, 55.73467884511657]]];

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
        console.log('   queue: ' + queue.toString());
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
var utils = {

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

    findIntersection: function (a, b) {
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];
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

module.exports = utils;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXHN3ZWVwbGluZS5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sT0FBUCxHQUFpQjtBQUNiO0FBQ0EsQ0FBQyxDQUFDLGtCQUFELEVBQW9CLGlCQUFwQixDQUFELEVBQXdDLENBQUMsZ0JBQUQsRUFBa0IsaUJBQWxCLENBQXhDLENBRmEsRUFHYixDQUFDLENBQUMsaUJBQUQsRUFBbUIsa0JBQW5CLENBQUQsRUFBd0MsQ0FBQyxpQkFBRCxFQUFtQixrQkFBbkIsQ0FBeEMsQ0FIYSxFQUliLENBQUMsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBRCxFQUF1QyxDQUFDLGlCQUFELEVBQW1CLGlCQUFuQixDQUF2QyxDQUphLENBQWpCOzs7QUNQQSxJQUFJLG9CQUFvQixRQUFRLGFBQVIsQ0FBeEI7QUFDQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksTUFBTSxFQUFFLFNBQUYsQ0FBWSxpRUFBWixFQUErRTtBQUNqRixhQUFTLEVBRHdFO0FBRWpGLGlCQUFhO0FBRm9FLENBQS9FLENBQVY7QUFBQSxJQUlJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFULENBSlo7QUFBQSxJQUtJLE1BQU0sSUFBSSxFQUFFLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEVBQUMsUUFBUSxDQUFDLEdBQUQsQ0FBVCxFQUFnQixRQUFRLEtBQXhCLEVBQStCLE1BQU0sRUFBckMsRUFBeUMsU0FBUyxFQUFsRCxFQUFqQixDQUxWO0FBQUEsSUFNSSxPQUFPLFNBQVMsY0FBVCxDQUF3QixT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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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SSxLQUFLLE1BQU0sQ0FBTixDQUhUO0FBQUEsWUFJSSxLQUFLLElBQUksQ0FBSixDQUpUO0FBQUEsWUFLSSxLQUFLLElBQUksQ0FBSixDQUxUO0FBQUEsWUFNSSxJQUFJLE1BQU0sQ0FBTixDQU5SO0FBQUEsWUFPSSxJQUFJLE1BQU0sQ0FBTixDQVBSOztBQVNBLGVBQVEsQ0FBQyxJQUFJLEVBQUwsS0FBWSxLQUFLLEVBQWpCLElBQXVCLENBQUMsSUFBSSxFQUFMLEtBQVksS0FBSyxFQUFqQixDQUF2QixLQUFnRCxDQUFqRCxLQUF5RCxJQUFJLEVBQUosSUFBVSxJQUFJLEVBQWYsSUFBdUIsSUFBSSxFQUFKLElBQVUsSUFBSSxFQUE3RixDQUFQO0FBQ0gsS0E1UU87O0FBOFFSLFdBQU8sVUFBVSxNQUFWLEVBQWtCLE1BQWxCLEVBQTBCLENBQTFCLEVBQTZCO0FBQ2hDLFlBQUksS0FBSyxPQUFPLENBQVAsQ0FBVDtBQUFBLFlBQ0ksS0FBSyxPQUFPLENBQVAsQ0FEVDtBQUFBLFlBRUksS0FBSyxPQUFPLENBQVAsQ0FGVDtBQUFBLFlBR0ksS0FBSyxPQUFPLENBQVAsQ0FIVDtBQUFBLFlBSUksSUFBSSxLQUFLLEVBSmI7QUFBQSxZQUtJLElBQUksS0FBSyxFQUxiO0FBQUEsWUFNSSxJQUFJLEtBQUssRUFBTCxHQUFVLEtBQUssRUFOdkI7O0FBUUksZUFBTyxDQUFDLENBQUMsQ0FBRCxHQUFLLElBQUksQ0FBVixJQUFlLENBQXRCO0FBQ1A7QUF4Uk8sQ0FBWjs7QUEyUkEsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIG1vZHVsZS5leHBvcnRzID0gW1xyXG4vLyAgICAgW1szNy41OTU3ODE3OTIxNDUyMjUsNTUuNzM1NDA2OTE2NTUxNDc2XSxbMzcuNjYyNDE3NjgyMTA4NDIsNTUuNzk3MzQzNjM2MTU2OTc0XV0sXHJcbi8vICAgICBbWzM3LjYyNjU5Nzc5MTkwNzU5LDU1Ljc5OTgwMDE1MDUzNDJdLFszNy42MjY5NTUwNzYzNjI4NTQsNTUuNzI5Mjk4Mzk5NjYyMTVdXSxcclxuLy8gICAgIFtbMzcuNjQxNjgzNzI3NTA0ODEsNTUuNzMwMzM4MDI1MzU4NjJdLFszNy42NjU1Njk2OTM2OTAzOSw1NS43Mzk0MTM2ODc1MzIxMzVdXSxcclxuLy8gICAgIFtbMzcuNjQyNTg4Mjg0NDA0NTQ2LDU1Ljc3MzExMTkzMDM3Mzg1XSxbMzcuNjUzMTAwMDg1NTU0OTYsNTUuNzMyNTA4NjU1NDg0NTldXVxyXG4vLyBdO1xyXG4vL1xyXG5tb2R1bGUuZXhwb3J0cyA9IFtcclxuICAgIC8vIFtbMzcuNTk3NDM5MDc5NDc0Myw1NS43NDQ2OTI3ODc5NTQ1N10sWzM3LjYxNDM3NzY2NTY0NzgsNTUuNzUwMDExNjA4MzIyMjVdXSxcclxuICAgIFtbMzcuNjE0Nzk2ODc5MDk3MDE0LDU1Ljc3MTM2NjcxODc5OTg5XSxbMzcuNjUzMjA4NDA1MTMwMyw1NS43NzY1MjgzNDYxNzQ0NV1dLFxyXG4gICAgW1szNy42MjY0MDk4NDQ0MDczMSw1NS43MjIwOTQyNjU5NjUxMDRdLFszNy42NDgzMzAxNDMwNjU0OSw1NS43NzAxMTE1NzcyNTkwMTZdXSxcclxuICAgIFtbMzcuNjMwNzgxNTAxNDUxNzMsNTUuNzUyODcxOTg2NDE4NDldLFszNy42NDIwMDE3Mzc1Njg1OSw1NS43MzQ2Nzg4NDUxMTY1N11dXHJcbl07XHJcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XHJcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9pbmRleC5qcycpO1xyXG5cclxudmFyIG9zbSA9IEwudGlsZUxheWVyKCdodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9ub2xhYmVscy97en0ve3h9L3t5fS5wbmcnLCB7XHJcbiAgICAgICAgbWF4Wm9vbTogMjIsXHJcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4nXHJcbiAgICB9KSxcclxuICAgIHBvaW50ID0gTC5sYXRMbmcoWzU1Ljc1MzIxMCwgMzcuNjIxNzY2XSksXHJcbiAgICBtYXAgPSBuZXcgTC5NYXAoJ21hcCcsIHtsYXllcnM6IFtvc21dLCBjZW50ZXI6IHBvaW50LCB6b29tOiAxMiwgbWF4Wm9vbTogMjJ9KSxcclxuICAgIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xyXG5cclxud2luZG93Lm1hcCA9IG1hcDtcclxuXHJcbnZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCksXHJcbiAgICBuID0gYm91bmRzLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgZSA9IGJvdW5kcy5fbm9ydGhFYXN0LmxuZyxcclxuICAgIHMgPSBib3VuZHMuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICB3ID0gYm91bmRzLl9zb3V0aFdlc3QubG5nLFxyXG4gICAgaGVpZ2h0ID0gbiAtIHMsXHJcbiAgICB3aWR0aCA9IGUgLSB3LFxyXG4gICAgcUhlaWdodCA9IGhlaWdodCAvIDQsXHJcbiAgICBxV2lkdGggPSB3aWR0aCAvIDQsXHJcbiAgICBsaW5lcyA9IFtdO1xyXG5cclxudmFyIHBvaW50cyA9IHR1cmYucmFuZG9tKCdwb2ludHMnLCAxOCwge1xyXG4gICAgYmJveDogW3cgKyBxV2lkdGgsIHMgKyBxSGVpZ2h0LCBlIC0gcVdpZHRoLCBuIC0gcUhlaWdodF1cclxufSk7XHJcblxyXG52YXIgY29vcmRzID0gcG9pbnRzLmZlYXR1cmVzLm1hcChmdW5jdGlvbihmZWF0dXJlKSB7XHJcbiAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcclxufSlcclxuXHJcbmZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgbGluZXMucHVzaChbY29vcmRzW2ldLCBjb29yZHNbaSsxXV0pO1xyXG59XHJcblxyXG4vLyBkcmF3TGluZXMobGluZXMpO1xyXG5kcmF3TGluZXMoZGF0YSk7XHJcblxyXG4vLyB2YXIgcHMgPSBmaW5kSW50ZXJzZWN0aW9ucyhsaW5lcywgbWFwKTtcclxudmFyIHBzID0gZmluZEludGVyc2VjdGlvbnMoZGF0YSwgbWFwKTtcclxuXHJcbnBzLmZvckVhY2goZnVuY3Rpb24gKHApIHtcclxuICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpLCB7cmFkaXVzOiA1LCBjb2xvcjogJ2JsdWUnLCBmaWxsQ29sb3I6ICdibHVlJ30pLmFkZFRvKG1hcCk7XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBkcmF3TGluZXMoYXJyYXkpIHtcclxuICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcclxuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdO1xyXG5cclxuICAgICAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhiZWdpbiksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoZW5kKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcclxuICAgICAgICBMLnBvbHlsaW5lKFtiZWdpbiwgZW5kXSwge3dlaWdodDogMX0pLmFkZFRvKG1hcCk7XHJcbiAgICB9KTtcclxufVxyXG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuL3NyYy9zd2VlcGxpbmUuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XHJcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5hdmwgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUHJpbnRzIHRyZWUgaG9yaXpvbnRhbGx5XG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHByaW50IChyb290LCBwcmludE5vZGUpIHtcbiAgaWYgKCBwcmludE5vZGUgPT09IHZvaWQgMCApIHByaW50Tm9kZSA9IGZ1bmN0aW9uIChuKSB7IHJldHVybiBuLmtleTsgfTtcblxuICB2YXIgb3V0ID0gW107XG4gIHJvdyhyb290LCAnJywgdHJ1ZSwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG91dC5wdXNoKHYpOyB9LCBwcmludE5vZGUpO1xuICByZXR1cm4gb3V0LmpvaW4oJycpO1xufVxuXG4vKipcbiAqIFByaW50cyBsZXZlbCBvZiB0aGUgdHJlZVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgIHByZWZpeFxuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICBpc1RhaWxcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKGluOnN0cmluZyk6dm9pZH0gICAgb3V0XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gIHByaW50Tm9kZVxuICovXG5mdW5jdGlvbiByb3cgKHJvb3QsIHByZWZpeCwgaXNUYWlsLCBvdXQsIHByaW50Tm9kZSkge1xuICBpZiAocm9vdCkge1xuICAgIG91dCgoXCJcIiArIHByZWZpeCArIChpc1RhaWwgPyAn4pSU4pSA4pSAICcgOiAn4pSc4pSA4pSAICcpICsgKHByaW50Tm9kZShyb290KSkgKyBcIlxcblwiKSk7XG4gICAgdmFyIGluZGVudCA9IHByZWZpeCArIChpc1RhaWwgPyAnICAgICcgOiAn4pSCICAgJyk7XG4gICAgaWYgKHJvb3QubGVmdCkgIHsgcm93KHJvb3QubGVmdCwgIGluZGVudCwgZmFsc2UsIG91dCwgcHJpbnROb2RlKTsgfVxuICAgIGlmIChyb290LnJpZ2h0KSB7IHJvdyhyb290LnJpZ2h0LCBpbmRlbnQsIHRydWUsICBvdXQsIHByaW50Tm9kZSk7IH1cbiAgfVxufVxuXG5cbi8qKlxuICogSXMgdGhlIHRyZWUgYmFsYW5jZWQgKG5vbmUgb2YgdGhlIHN1YnRyZWVzIGRpZmZlciBpbiBoZWlnaHQgYnkgbW9yZSB0aGFuIDEpXG4gKiBAcGFyYW0gIHtOb2RlfSAgICByb290XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0JhbGFuY2VkKHJvb3QpIHtcbiAgaWYgKHJvb3QgPT09IG51bGwpIHsgcmV0dXJuIHRydWU7IH0gLy8gSWYgbm9kZSBpcyBlbXB0eSB0aGVuIHJldHVybiB0cnVlXG5cbiAgLy8gR2V0IHRoZSBoZWlnaHQgb2YgbGVmdCBhbmQgcmlnaHQgc3ViIHRyZWVzXG4gIHZhciBsaCA9IGhlaWdodChyb290LmxlZnQpO1xuICB2YXIgcmggPSBoZWlnaHQocm9vdC5yaWdodCk7XG5cbiAgaWYgKE1hdGguYWJzKGxoIC0gcmgpIDw9IDEgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5sZWZ0KSAgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5yaWdodCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAvLyBJZiB3ZSByZWFjaCBoZXJlIHRoZW4gdHJlZSBpcyBub3QgaGVpZ2h0LWJhbGFuY2VkXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gQ29tcHV0ZSB0aGUgJ2hlaWdodCcgb2YgYSB0cmVlLlxuICogSGVpZ2h0IGlzIHRoZSBudW1iZXIgb2Ygbm9kZXMgYWxvbmcgdGhlIGxvbmdlc3QgcGF0aFxuICogZnJvbSB0aGUgcm9vdCBub2RlIGRvd24gdG8gdGhlIGZhcnRoZXN0IGxlYWYgbm9kZS5cbiAqXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGhlaWdodChub2RlKSB7XG4gIHJldHVybiBub2RlID8gKDEgKyBNYXRoLm1heChoZWlnaHQobm9kZS5sZWZ0KSwgaGVpZ2h0KG5vZGUucmlnaHQpKSkgOiAwO1xufVxuXG4vLyBmdW5jdGlvbiBjcmVhdGVOb2RlIChwYXJlbnQsIGxlZnQsIHJpZ2h0LCBoZWlnaHQsIGtleSwgZGF0YSkge1xuLy8gICByZXR1cm4geyBwYXJlbnQsIGxlZnQsIHJpZ2h0LCBiYWxhbmNlRmFjdG9yOiBoZWlnaHQsIGtleSwgZGF0YSB9O1xuLy8gfVxuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIHBhcmVudDogICAgICAgIE5vZGV8TnVsbCxcbiAqICAgbGVmdDogICAgICAgICAgTm9kZXxOdWxsLFxuICogICByaWdodDogICAgICAgICBOb2RlfE51bGwsXG4gKiAgIGJhbGFuY2VGYWN0b3I6IE51bWJlcixcbiAqICAga2V5OiAgICAgICAgICAgYW55LFxuICogICBkYXRhOiAgICAgICAgICBvYmplY3Q/XG4gKiB9fSBOb2RlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7Kn0gS2V5XG4gKi9cblxuLyoqXG4gKiBEZWZhdWx0IGNvbXBhcmlzb24gZnVuY3Rpb25cbiAqIEBwYXJhbSB7Kn0gYVxuICogQHBhcmFtIHsqfSBiXG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfQ09NUEFSRSAoYSwgYikgeyByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7IH1cblxuXG4vKipcbiAqIFNpbmdsZSBsZWZ0IHJvdGF0aW9uXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5mdW5jdGlvbiByb3RhdGVMZWZ0IChub2RlKSB7XG4gIHZhciByaWdodE5vZGUgPSBub2RlLnJpZ2h0O1xuICBub2RlLnJpZ2h0ICAgID0gcmlnaHROb2RlLmxlZnQ7XG5cbiAgaWYgKHJpZ2h0Tm9kZS5sZWZ0KSB7IHJpZ2h0Tm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICByaWdodE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChyaWdodE5vZGUucGFyZW50KSB7XG4gICAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5sZWZ0ID0gcmlnaHROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LnJpZ2h0ID0gcmlnaHROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gcmlnaHROb2RlO1xuICByaWdodE5vZGUubGVmdCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChyaWdodE5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gcmlnaHROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuICByZXR1cm4gcmlnaHROb2RlO1xufVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZVJpZ2h0IChub2RlKSB7XG4gIHZhciBsZWZ0Tm9kZSA9IG5vZGUubGVmdDtcbiAgbm9kZS5sZWZ0ID0gbGVmdE5vZGUucmlnaHQ7XG4gIGlmIChub2RlLmxlZnQpIHsgbm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICBsZWZ0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKGxlZnROb2RlLnBhcmVudCkge1xuICAgIGlmIChsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgbGVmdE5vZGUucGFyZW50LmxlZnQgPSBsZWZ0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdE5vZGUucGFyZW50LnJpZ2h0ID0gbGVmdE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSBsZWZ0Tm9kZTtcbiAgbGVmdE5vZGUucmlnaHQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobGVmdE5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gbGVmdE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJldHVybiBsZWZ0Tm9kZTtcbn1cblxuXG4vLyBmdW5jdGlvbiBsZWZ0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSByb3RhdGVMZWZ0KG5vZGUubGVmdCk7XG4vLyAgIHJldHVybiByb3RhdGVSaWdodChub2RlKTtcbi8vIH1cblxuXG4vLyBmdW5jdGlvbiByaWdodEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgcm90YXRlUmlnaHQobm9kZS5yaWdodCk7XG4vLyAgIHJldHVybiByb3RhdGVMZWZ0KG5vZGUpO1xuLy8gfVxuXG5cbnZhciBUcmVlID0gZnVuY3Rpb24gVHJlZSAoY29tcGFyYXRvcikge1xuICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvciB8fCBERUZBVUxUX0NPTVBBUkU7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xuICB0aGlzLl9zaXplID0gMDtcbn07XG5cbnZhciBwcm90b3R5cGVBY2Nlc3NvcnMgPSB7IHNpemU6IHt9IH07XG5cblxuLyoqXG4gKiBDbGVhciB0aGUgdHJlZVxuICovXG5UcmVlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xufTtcblxuLyoqXG4gKiBOdW1iZXIgb2Ygbm9kZXNcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xucHJvdG90eXBlQWNjZXNzb3JzLnNpemUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc2l6ZTtcbn07XG5cblxuLyoqXG4gKiBXaGV0aGVyIHRoZSB0cmVlIGNvbnRhaW5zIGEgbm9kZSB3aXRoIHRoZSBnaXZlbiBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyAoa2V5KSB7XG4gIGlmICh0aGlzLl9yb290KXtcbiAgICB2YXIgbm9kZSAgICAgPSB0aGlzLl9yb290O1xuICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgICB3aGlsZSAobm9kZSl7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcihrZXksIG5vZGUua2V5KTtcbiAgICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qIGVzbGludC1kaXNhYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuLyoqXG4gKiBTdWNjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIG5leHQgKG5vZGUpIHtcbiAgdmFyIHN1Y2Nlc3NvciA9IG5vZGU7XG4gIGlmIChzdWNjZXNzb3IpIHtcbiAgICBpZiAoc3VjY2Vzc29yLnJpZ2h0KSB7XG4gICAgICBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucmlnaHQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5sZWZ0KSB7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5sZWZ0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2Nlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IucmlnaHQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHN1Y2Nlc3Nvcjsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN1Y2Nlc3Nvcjtcbn07XG5cblxuLyoqXG4gKiBQcmVkZWNlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gcHJldiAobm9kZSkge1xuICB2YXIgcHJlZGVjZXNzb3IgPSBub2RlO1xuICBpZiAocHJlZGVjZXNzb3IpIHtcbiAgICBpZiAocHJlZGVjZXNzb3IubGVmdCkge1xuICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5sZWZ0O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLnJpZ2h0KSB7IHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucmlnaHQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZGVjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5sZWZ0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBwcmVkZWNlc3NvcjtcbiAgICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwcmVkZWNlc3Nvcjtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuXG4vKipcbiAqIEBwYXJhbXtGdW5jdGlvbihub2RlOk5vZGUpOnZvaWR9IGZuXG4gKiBAcmV0dXJuIHtBVkxUcmVlfVxuICovXG5UcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaCAoZm4pIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCBkb25lID0gZmFsc2UsIGkgPSAwO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIC8vIFJlYWNoIHRoZSBsZWZ0IG1vc3QgTm9kZSBvZiB0aGUgY3VycmVudCBOb2RlXG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIC8vIFBsYWNlIHBvaW50ZXIgdG8gYSB0cmVlIG5vZGUgb24gdGhlIHN0YWNrXG4gICAgICAvLyBiZWZvcmUgdHJhdmVyc2luZyB0aGUgbm9kZSdzIGxlZnQgc3VidHJlZVxuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQmFja1RyYWNrIGZyb20gdGhlIGVtcHR5IHN1YnRyZWUgYW5kIHZpc2l0IHRoZSBOb2RlXG4gICAgICAvLyBhdCB0aGUgdG9wIG9mIHRoZSBzdGFjazsgaG93ZXZlciwgaWYgdGhlIHN0YWNrIGlzXG4gICAgICAvLyBlbXB0eSB5b3UgYXJlIGRvbmVcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIGZuKGN1cnJlbnQsIGkrKyk7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSB2aXNpdGVkIHRoZSBub2RlIGFuZCBpdHMgbGVmdFxuICAgICAgICAvLyBzdWJ0cmVlLiBOb3csIGl0J3MgcmlnaHQgc3VidHJlZSdzIHR1cm5cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBrZXlzIGluIG9yZGVyXG4gKiBAcmV0dXJuIHtBcnJheTxLZXk+fVxuICovXG5UcmVlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24ga2V5cyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmtleSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBgZGF0YWAgZmllbGRzIG9mIGFsbCBub2RlcyBpbiBvcmRlci5cbiAqIEByZXR1cm4ge0FycmF5PCo+fVxuICovXG5UcmVlLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5kYXRhKTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWluaW11bSBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWluTm9kZSA9IGZ1bmN0aW9uIG1pbk5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1heCBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWF4Tm9kZSA9IGZ1bmN0aW9uIG1heE5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBNaW4ga2V5XG4gKiBAcmV0dXJuIHtLZXl9XG4gKi9cblRyZWUucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uIG1pbiAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG4vKipcbiAqIE1heCBrZXlcbiAqIEByZXR1cm4ge0tleXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiBtYXggKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG5cbi8qKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uIGlzRW1wdHkgKCkge1xuICByZXR1cm4gIXRoaXMuX3Jvb3Q7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgbm9kZSB3aXRoIHNtYWxsZXN0IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiBwb3AgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3QsIHJldHVyblZhbHVlID0gbnVsbDtcbiAgaWYgKG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICByZXR1cm5WYWx1ZSA9IHsga2V5OiBub2RlLmtleSwgZGF0YTogbm9kZS5kYXRhIH07XG4gICAgdGhpcy5yZW1vdmUobm9kZS5rZXkpO1xuICB9XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBGaW5kIG5vZGUgYnkga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIGZpbmQgKGtleSkge1xuICB2YXIgcm9vdCA9IHRoaXMuX3Jvb3Q7XG4gIGlmIChyb290ID09PSBudWxsKSAgeyByZXR1cm4gbnVsbDsgfVxuICBpZiAoa2V5ID09PSByb290LmtleSkgeyByZXR1cm4gcm9vdDsgfVxuXG4gIHZhciBzdWJ0cmVlID0gcm9vdCwgY21wO1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHdoaWxlIChzdWJ0cmVlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIHN1YnRyZWUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBzdWJ0cmVlOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBzdWJ0cmVlID0gc3VidHJlZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBzdWJ0cmVlID0gc3VidHJlZS5yaWdodDsgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5cbi8qKlxuICogSW5zZXJ0IGEgbm9kZSBpbnRvIHRoZSB0cmVlXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEBwYXJhbXsqfSBbZGF0YV1cbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0IChrZXksIGRhdGEpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHtcbiAgICB0aGlzLl9yb290ID0ge1xuICAgICAgcGFyZW50OiBudWxsLCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICAgIGtleToga2V5LCBkYXRhOiBkYXRhXG4gICAgfTtcbiAgICB0aGlzLl9zaXplKys7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gIH1cblxuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHZhciBub2RlICA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBwYXJlbnQ9IG51bGw7XG4gIHZhciBjbXAgICA9IDA7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIHBhcmVudCA9IG5vZGU7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgfVxuXG4gIHZhciBuZXdOb2RlID0ge1xuICAgIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsLCBiYWxhbmNlRmFjdG9yOiAwLFxuICAgIHBhcmVudDogcGFyZW50LCBrZXk6IGtleSwgZGF0YTogZGF0YSxcbiAgfTtcbiAgaWYgKGNtcCA8IDApIHsgcGFyZW50LmxlZnQ9IG5ld05vZGU7IH1cbiAgZWxzZSAgICAgICB7IHBhcmVudC5yaWdodCA9IG5ld05vZGU7IH1cblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKGNvbXBhcmUocGFyZW50LmtleSwga2V5KSA8IDApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vbGV0IG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBsZXQgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIHZhciBuZXdSb290JDEgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdCQxOyB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIHRoaXMuX3NpemUrKztcbiAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgbm9kZSBmcm9tIHRoZSB0cmVlLiBJZiBub3QgZm91bmQsIHJldHVybnMgbnVsbC5cbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Tm9kZTpOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGtleSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fcm9vdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgdmFyIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgfVxuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgdmFyIHJldHVyblZhbHVlID0gbm9kZS5rZXk7XG5cbiAgaWYgKG5vZGUubGVmdCkge1xuICAgIHZhciBtYXggPSBub2RlLmxlZnQ7XG5cbiAgICB3aGlsZSAobWF4LmxlZnQgfHwgbWF4LnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWF4LnJpZ2h0KSB7IG1heCA9IG1heC5yaWdodDsgfVxuXG4gICAgICBub2RlLmtleSA9IG1heC5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtYXguZGF0YTtcbiAgICAgIGlmIChtYXgubGVmdCkge1xuICAgICAgICBub2RlID0gbWF4O1xuICAgICAgICBtYXggPSBtYXgubGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWF4LmtleTtcbiAgICBub2RlLmRhdGEgPSBtYXguZGF0YTtcbiAgICBub2RlID0gbWF4O1xuICB9XG5cbiAgaWYgKG5vZGUucmlnaHQpIHtcbiAgICB2YXIgbWluID0gbm9kZS5yaWdodDtcblxuICAgIHdoaWxlIChtaW4ubGVmdCB8fCBtaW4ucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtaW4ubGVmdCkgeyBtaW4gPSBtaW4ubGVmdDsgfVxuXG4gICAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgICAgaWYgKG1pbi5yaWdodCkge1xuICAgICAgICBub2RlID0gbWluO1xuICAgICAgICBtaW4gPSBtaW4ucmlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgbm9kZSA9IG1pbjtcbiAgfVxuXG4gIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgdmFyIHBwICAgPSBub2RlO1xuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50LmxlZnQgPT09IHBwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvL2xldCBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290O1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBsZXQgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIHZhciBuZXdSb290JDEgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdCQxOyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290JDE7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAtMSB8fCBwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyBicmVhazsgfVxuXG4gICAgcHAgICA9IHBhcmVudDtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgaWYgKG5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHsgbm9kZS5wYXJlbnQubGVmdD0gbnVsbDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgeyBub2RlLnBhcmVudC5yaWdodCA9IG51bGw7IH1cbiAgfVxuXG4gIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7IHRoaXMuX3Jvb3QgPSBudWxsOyB9XG5cbiAgdGhpcy5fc2l6ZS0tO1xuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB0cmVlIGlzIGJhbGFuY2VkXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5pc0JhbGFuY2VkID0gZnVuY3Rpb24gaXNCYWxhbmNlZCQxICgpIHtcbiAgcmV0dXJuIGlzQmFsYW5jZWQodGhpcy5fcm9vdCk7XG59O1xuXG5cbi8qKlxuICogU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmVlIC0gcHJpbWl0aXZlIGhvcml6b250YWwgcHJpbnQtb3V0XG4gKiBAcGFyYW17RnVuY3Rpb24oTm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5UcmVlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nIChwcmludE5vZGUpIHtcbiAgcmV0dXJuIHByaW50KHRoaXMuX3Jvb3QsIHByaW50Tm9kZSk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyggVHJlZS5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xuXG5yZXR1cm4gVHJlZTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF2bC5qcy5tYXBcbiIsIi8vINC/0L7Rh9C10LzRgy3RgtC+INC/0LXRgNCy0YvQvNC4INC40L3QvtCz0LTQsCDQv9GA0LjRhdC+0LTRj9GCINGB0L7QsdGL0YLQuNGPIGVuZFxyXG4vLyDQvdC10LrQvtGC0L7RgNGL0LUg0YLQvtGH0LrQuCDQvdC1INCy0LjQtNC90Ys/XHJcblxyXG5cclxuXHJcbnZhciBUcmVlID0gcmVxdWlyZSgnYXZsJyksXHJcbiAgICB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50cyBzZXQgb2Ygc2VnbWVudHMgaW50ZXJzZWN0aW5nIHN3ZWVwbGluZSBbW1t4MSwgeTFdLCBbeDIsIHkyXV0gLi4uIFtbeG0sIHltXSwgW3huLCB5bl1dXVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGZpbmRJbnRlcnNlY3Rpb25zKHNlZ21lbnRzLCBtYXApIHtcclxuICAgIHZhciBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpLFxyXG4gICAgICAgIHN0YXR1cyA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVTZWdtZW50cyksXHJcbiAgICAgICAgcmVzdWx0ID0gW107XHJcblxyXG4gICAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2VnbWVudCkge1xyXG4gICAgICAgIHNlZ21lbnQuc29ydCh1dGlscy5jb21wYXJlUG9pbnRzKTtcclxuICAgICAgICB2YXIgYmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBzZWdtZW50WzFdLFxyXG4gICAgICAgICAgICBiZWdpbkRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludDogYmVnaW4sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmVnaW4nLFxyXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbmREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgcG9pbnQ6IGVuZCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIHF1ZXVlLmluc2VydChiZWdpbiwgYmVnaW5EYXRhKTtcclxuICAgICAgICBxdWV1ZS5pbnNlcnQoZW5kLCBlbmREYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBMT0dcclxuICAgICAqL1xyXG4gICAgLy8gdmFyIHZhbHVlcyA9IHF1ZXVlLnZhbHVlcygpO1xyXG5cclxuICAgIC8vIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIGFycmF5KSB7XHJcbiAgICAvLyAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcclxuICAgIC8vICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAncmVkJywgZmlsbENvbG9yOiAnRkYwMCcgKyAyICoqIGluZGV4fSkuYWRkVG8obWFwKTtcclxuICAgIC8vICAgICBtcmsuYmluZFBvcHVwKCcnICsgaW5kZXggKyAnXFxuJyArIHBbMF0gKyAnXFxuJyArIHBbMV0pO1xyXG4gICAgLy8gfSk7XHJcblxyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgLypcclxuICAgICAqIExPRyBFTkRcclxuICAgICAqL1xyXG5cclxuICAgIC8vIGRlYnVnOlxyXG4gICAgLy8gTC5tYXJrZXIoTC5sYXRMbmcoW10uc2xpY2UoKS5yZXZlcnNlKCkpKS5hZGRUbyhtYXApO1xyXG4gICAgd2hpbGUgKCFxdWV1ZS5pc0VtcHR5KCkpIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBxdWV1ZS5wb3AoKTtcclxuICAgICAgICB2YXIgcCA9IGV2ZW50LmRhdGEucG9pbnQ7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGkgKyAnKSBjdXJyZW50IHBvaW50OiAnICsgZXZlbnQuZGF0YS5wb2ludC50b1N0cmluZygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnICAgcG9pbnQgdHlwZTogJyArIGV2ZW50LmRhdGEudHlwZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAgIHF1ZXVlOiAnICsgcXVldWUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyAgIHN0YXR1czogJyArIHN0YXR1cy50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ2JlZ2luJykge1xyXG5cclxuICAgICAgICAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcclxuICAgICAgICAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ2dyZWVuJywgZmlsbENvbG9yOiAnZ3JlZW4nfSkuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgICAgIHN0YXR1cy5pbnNlcnQoZXZlbnQuZGF0YS5zZWdtZW50KTtcclxuICAgICAgICAgICAgdmFyIHNlZ0UgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnQpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTE9HXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgbGxzID0gc2VnRS5rZXkubWFwKGZ1bmN0aW9uKHApe3JldHVybiBMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKX0pO1xyXG4gICAgICAgICAgICB2YXIgbGluZSA9IEwucG9seWxpbmUobGxzLCB7Y29sb3I6ICdncmVlbid9KS5hZGRUbyhtYXApO1xyXG5cclxuICAgICAgICAgICAgbGluZS5iaW5kUG9wdXAoJ2FkZGVkJyArIGkpO1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbm93IGFkZGluZyBzZWdtZW50OiAnKTtcclxuICAgICAgICAgICAgc2VnRS5rZXkuZm9yRWFjaChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3g6ICcgKyBwWzBdICsgJyB5OiAnICsgcFsxXSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIExPRyBFTkRcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICB2YXIgc2VnQSA9IHN0YXR1cy5wcmV2KHNlZ0UpO1xyXG4gICAgICAgICAgICB2YXIgc2VnQiA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWdBKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2VnQik7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVhSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnRS5rZXksIHNlZ0Eua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWFJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlYUludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGVhSW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Uua2V5LCBzZWdBLmtleV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGVhSW50ZXJzZWN0aW9uUG9pbnQsIGVhSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgcG9pbnQ6JyArIGVhSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzZWdCKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWJJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdFLmtleSwgc2VnQi5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlYkludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGViSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogZWJJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnRS5rZXksIHNlZ0Iua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoZWJJbnRlcnNlY3Rpb25Qb2ludCwgZWJJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBlYkludGVyc2VjdGlvblBvaW50OicgKyBlYkludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgRWxzZSBJZiAoRSBpcyBhIHJpZ2h0IGVuZHBvaW50KSB7XHJcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnR5cGUgPT09ICdlbmQnKSB7XHJcbiAgICAgICAgICAgIHZhciBsbCA9IEwubGF0TG5nKFtwWzFdLCBwWzBdXSk7XHJcbiAgICAgICAgICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdyZWQnLCBmaWxsQ29sb3I6ICdyZWQnfSkuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgdmFyIHNlZ0UgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnQpO1xyXG4gICAgICAgICAgICB2YXIgc2VnQSA9IHN0YXR1cy5wcmV2KHNlZ0UpO1xyXG4gICAgICAgICAgICB2YXIgc2VnQiA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTE9HXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgdmFyIGxscyA9IHNlZ0Uua2V5Lm1hcChmdW5jdGlvbihwKXtyZXR1cm4gTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSl9KTtcclxuICAgICAgICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMsIHtjb2xvcjogJ3JlZCd9KS5hZGRUbyhtYXApO1xyXG5cclxuICAgICAgICAgICAgIGxpbmUuYmluZFBvcHVwKCdyZW1vdmVkJyArIGkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ0EgJiYgc2VnQikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFiSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnQS5rZXksIHNlZ0Iua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWJJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcXVldWUuZmluZChhYkludGVyc2VjdGlvblBvaW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWJJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogYWJJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdBLmtleSwgc2VnQi5rZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIEluc2VydCBJIGludG8gRVE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhYkludGVyc2VjdGlvblBvaW50LCBhYkludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBhYkludGVyc2VjdGlvblBvaW50OicgKyBhYkludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBMT0dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIERlbGV0ZSBzZWdFIGZyb20gU0w7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0cmVlIGJlZm9yZSByZW1vdmluZyBzZWdtZW50OiAnKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3RhdHVzLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAvLyB2YXIgcmVtb3ZpbmcgPSBzZWdFLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbm93IHJlbW92aW5nIHNlZ21lbnQ6ICcpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdGF0dXMuZmluZChzZWdFLmtleSkpO1xyXG4gICAgICAgICAgICAvLyByZW1vdmluZy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygneDogJyArIHBbMF0gKyAnIHk6ICcgKyBwWzFdKTtcclxuICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTE9HIEVORFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc3RhdHVzLnJlbW92ZShzZWdFLmtleSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcclxuICAgICAgICAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ2JsdWUnLCBmaWxsQ29sb3I6ICdibHVlJ30pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGV2ZW50LmRhdGEucG9pbnQpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnRTEgYWJvdmUgc2VnRTIgYmUgRSdzIGludGVyc2VjdGluZyBzZWdtZW50cyBpbiBTTDtcclxuICAgICAgICAgICAgdmFyIHNlZzEgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnRzWzBdKSxcclxuICAgICAgICAgICAgICAgIHNlZzIgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnRzWzFdKTtcclxuXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIFN3YXAgdGhlaXIgcG9zaXRpb25zIHNvIHRoYXQgc2VnRTIgaXMgbm93IGFib3ZlIHNlZ0UxO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG4gICAgICAgICAgICAvLyBzdGF0dXMucHJldihzZWcxKSA9IHN0YXR1cy5maW5kKHNlZzIpO1xyXG4gICAgICAgICAgICAvLyBzdGF0dXMubmV4dChzZWcyKSA9IHN0YXR1cy5maW5kKHNlZzEpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnQSA9IHRoZSBzZWdtZW50IGFib3ZlIHNlZ0UyIGluIFNMO1xyXG4gICAgICAgICAgICB2YXIgc2VnQSA9IHN0YXR1cy5uZXh0KHNlZzEpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnQiA9IHRoZSBzZWdtZW50IGJlbG93IHNlZ0UxIGluIFNMO1xyXG4gICAgICAgICAgICB2YXIgc2VnQiA9IHN0YXR1cy5wcmV2KHNlZzIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ0EpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhMkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZzIua2V5LCBzZWdBLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGEySW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXF1ZXVlLmZpbmQoYTJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEySW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGEySW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnMi5rZXksIHNlZ0Eua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhMkludGVyc2VjdGlvblBvaW50LCBhMkludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBhMkludGVyc2VjdGlvblBvaW50OicgKyBhMkludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlZ0IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBiMUludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZzEua2V5LCBzZWdCLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGIxSW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXF1ZXVlLmZpbmQoYjFJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGIxSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGIxSW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnMS5rZXksIHNlZ0Iua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChiMUludGVyc2VjdGlvblBvaW50LCBiMUludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBiMUludGVyc2VjdGlvblBvaW50OicgKyBiMUludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaSsrO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXR1cy52YWx1ZXMoKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIGFycmF5KSB7XHJcblxyXG4gICAgICAgIGxscyA9IHZhbHVlLm1hcChmdW5jdGlvbihwKXtyZXR1cm4gTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSl9KTtcclxuXHJcbiAgICAgICAgdmFyIGxpbmUgPSBMLnBvbHlsaW5lKGxscykuYWRkVG8obWFwKTtcclxuICAgICAgICBsaW5lLmJpbmRQb3B1cCgnJyArIGluZGV4KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHdpbmRvdy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICB3aW5kb3cucXVldWUgPSBxdWV1ZTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XHJcbiIsInZhciB1dGlscyA9IHtcclxuXHJcbiAgICAvKlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQvNC10L3RjNGI0LUgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QvtGB0YLQsNCy0LjRgiBhINC/0L4g0LzQtdC90YzRiNC10LzRgyDQuNC90LTQtdC60YHRgywg0YfQtdC8IGIsINGC0L4g0LXRgdGC0YwsIGEg0LjQtNGR0YIg0L/QtdGA0LLRi9C8LlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQstC10YDQvdGR0YIgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L7RgdGC0LDQstC40YIgYSDQuCBiINC90LXQuNC30LzQtdC90L3Ri9C80Lgg0L/QviDQvtGC0L3QvtGI0LXQvdC40Y4g0LTRgNGD0LMg0Log0LTRgNGD0LPRgyxcclxuICAgICAgICAgICAg0L3QviDQvtGC0YHQvtGA0YLQuNGA0YPQtdGCINC40YUg0L/QviDQvtGC0L3QvtGI0LXQvdC40Y4g0LrQviDQstGB0LXQvCDQtNGA0YPQs9C40Lwg0Y3Qu9C10LzQtdC90YLQsNC8LlxyXG4gICAgICAgICAgICDQntCx0YDQsNGC0LjRgtC1INCy0L3QuNC80LDQvdC40LU6INGB0YLQsNC90LTQsNGA0YIgRUNNQXNjcmlwdCDQvdC1INCz0LDRgNCw0L3RgtC40YDRg9C10YIg0LTQsNC90L3QvtC1INC/0L7QstC10LTQtdC90LjQtSwg0Lgg0LXQvNGDINGB0LvQtdC00YPRjtGCINC90LUg0LLRgdC1INCx0YDQsNGD0LfQtdGA0YtcclxuICAgICAgICAgICAgKNC90LDQv9GA0LjQvNC10YAsINCy0LXRgNGB0LjQuCBNb3ppbGxhINC/0L4g0LrRgNCw0LnQvdC10Lkg0LzQtdGA0LUsINC00L4gMjAwMyDQs9C+0LTQsCkuXHJcbiAgICAgICAg0JXRgdC70LggY29tcGFyZUZ1bmN0aW9uKGEsIGIpINCx0L7Qu9GM0YjQtSAwLCDRgdC+0YDRgtC40YDQvtCy0LrQsCDQv9C+0YHRgtCw0LLQuNGCIGIg0L/QviDQvNC10L3RjNGI0LXQvNGDINC40L3QtNC10LrRgdGDLCDRh9C10LwgYS5cclxuICAgICAgICDQpNGD0L3QutGG0LjRjyBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LTQvtC70LbQvdCwINCy0YHQtdCz0LTQsCDQstC+0LfQstGA0LDRidCw0YLRjCDQvtC00LjQvdCw0LrQvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1INC00LvRjyDQvtC/0YDQtdC00LXQu9GR0L3QvdC+0Lkg0L/QsNGA0Ysg0Y3Qu9C10LzQtdC90YLQvtCyIGEg0LggYi5cclxuICAgICAgICAgICAg0JXRgdC70Lgg0LHRg9C00YPRgiDQstC+0LfQstGA0LDRidCw0YLRjNGB0Y8g0L3QtdC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3Ri9C1INGA0LXQt9GD0LvRjNGC0LDRgtGLLCDQv9C+0YDRj9C00L7QuiDRgdC+0YDRgtC40YDQvtCy0LrQuCDQsdGD0LTQtdGCINC90LUg0L7Qv9GA0LXQtNC10LvRkdC9LlxyXG4gICAgKi9cclxuICAgIC8vIHBvaW50cyBjb21wYXJhdG9yXHJcbiAgICBjb21wYXJlUG9pbnRzOiBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgICAgIHkyID0gYlsxXTtcclxuXHJcbiAgICAgICAgaWYgKHgxID4geDIgfHwgKHgxID09PSB4MiAmJiB5MSA+IHkyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHgxIDwgeDIgfHwgKHgxID09PSB4MiAmJiB5MSA8IHkyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4MSA9PT0geDIgJiYgeTEgPT09IHkyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGJbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYVsxXVsxXTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRlc3QgaWYgdGhlIHRyaXBsZSBvZiBlbmRwb2ludHMgbGVmdChZKSwgcmlnaHQoWSksIGxlZnQoWCkgaXMgaW5cclxuICAgICAgICAgICAgLy8gY291bnRlcmNsb2Nrd2lzZSBvcmRlci5cclxuXHJcbiAgICAgICAgdmFyIG54MSA9IHgzLFxyXG4gICAgICAgICAgICBueTEgPSBmaW5kWShiWzBdLCBiWzFdLCB4Myk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhbbngxLCBueTFdKTtcclxuXHJcbiAgICAgICAgdmFyIEQgPSAoeTIgLSB5MSkgKiAoeDMgLSB4MikgLSAoeTMgLSB5MikgKiAoeDIgLSB4MSk7XHJcbiAgICAgICAgLy8gdmFyIEQgPSAoeDEgLSB4MikgKiAoeTMgLSB5MikgLSAoeTEgLSB5MikgKiAoeDMgLSB4Mik7XHJcbiAgICAgICAgdmFyIEQgPSAoeDIgLSB4MSkgKiAoeTMgLSB5MSkgLSAoeTIgLSB5MSkgKiAoeDMgLSB4MSk7XHJcblxyXG4gICAgICAgIC8vINC90LDRhdC+0LTQuNC8INCy0LXQutGC0L7RgNC90L7QtSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LUg0LLQtdC60YLQvtGA0L7QsiBiINC4IGJbMF1hWzBdXHJcbiAgICAgICAgdmFyIERiYTEgPSAoeDIgLSB4MSkgKiAoeTMgLSB5MSkgLSAoeTIgLSB5MSkgKiAoeDMgLSB4MSk7XHJcbiAgICAgICAgLy8g0L3QsNGF0L7QtNC40Lwg0LLQtdC60YLQvtGA0L3QvtC1INC/0YDQvtC40LfQstC10LTQtdC90LjQtSDQstC10LrRgtC+0YDQvtCyIGIg0LggYlswXWFbMV1cclxuICAgICAgICB2YXIgRGJhMiA9ICh4MiAtIHgxKSAqICh5NCAtIHkxKSAtICh5MiAtIHkxKSAqICh4NCAtIHgxKTtcclxuICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQt9C90LDQuiDQstC10LrRgtC+0YDQvdGL0YUg0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC5XHJcbiAgICAgICAgLy8gdmFyIEQgPSBEYmExICogRGJhMjtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0RiYTE6ICcgKyBEYmExKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnRGJhMjogJyArIERiYTIpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdEOiAnICsgRCk7XHJcblxyXG4gICAgICAgIGlmIChEIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChEID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKEQgPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kWSAocG9pbnQxLCBwb2ludDIsIHgpIHtcclxuICAgICAgICAgICAgdmFyIHgxID0gcG9pbnQxWzBdLFxyXG4gICAgICAgICAgICAgICAgeTEgPSBwb2ludDFbMV0sXHJcbiAgICAgICAgICAgICAgICB4MiA9IHBvaW50MlswXSxcclxuICAgICAgICAgICAgICAgIHkyID0gcG9pbnQyWzFdLFxyXG4gICAgICAgICAgICAgICAgYSA9IHkxIC0geTIsXHJcbiAgICAgICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgICAgIGMgPSB4MSAqIHkyIC0geDIgKiB5MTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoLWMgLSBhICogeCkgLyBiO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcGFyZVNlZ21lbnRzMTogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAvLyDQvdGD0LbQvdC+INCy0LXRgNC90YPRgtGMINGB0LXQs9C80LXQvdGCLCDQutC+0YLQvtGA0YvQuSDQsiDQtNCw0L3QvdC+0Lkg0YLQvtGH0LrQtVxyXG4gICAgICAgIC8vINGP0LLQu9GP0LXRgtGB0Y8g0L/QtdGA0LLRi9C8INCx0LvQuNC20LDQudGI0LjQvCDQv9C+IHgg0LjQu9C4IHlcclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDQv9C+IHkg0LIg0YLQvtGH0LrQtSDRgSDQtNCw0L3QvdC+0Lkg0LrQvtC+0YDQtNC40L3QsNGC0L7QuSB4XHJcbiAgICAgICAgLy8g0L3QsNC50YLQuCwg0YEg0LrQsNC60L7QuSDRgdGC0L7RgNC+0L3RiyDQu9C10LbQuNGCINC70LXQstCw0Y8g0YLQvtGH0LrQsCBiINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC6IGFcclxuXHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgdmFyIG54MSA9IHgzLFxyXG4gICAgICAgICAgICBueTEgPSBmaW5kWShhWzBdLCBhWzFdLCB4Myk7XHJcblxyXG4gICAgICAgIC8vINCS0LXQutGC0L7RgNC90L7QtSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LUg0LIg0LrQvtC+0YDQtNC40L3QsNGC0LDRhVxyXG4gICAgICAgIC8vIHZhciBEID0gKHgyIC0geDEpICogKHkzIC0geTEpIC0gKHkyIC0geTEpICogKHgzIC0geDEpO1xyXG4gICAgICAgIC8vIHZhciBEID0gKHg0IC0geDMpICogKHkxIC0geTMpIC0gKHk0IC0geTMpICogKHgxIC0geDMpO1xyXG4gICAgICAgIC8vIHZhciBpbnRlcnNlY3Rpb25Qb2ludCA9IGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihhLCBiKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCy0YHRgtCw0LLQu9GP0LXRgiDQvdC1INCyINGC0L7RgiDRgdC10LPQvNC10L3RglxyXG4gICAgICAgICAgICB2YXIgdjEgPSBbeDIgLSB4MSwgeTIgLSB5MV0sXHJcbiAgICAgICAgICAgICAgICB2MiA9IFt4NCAtIHgzLCB5NCAtIHkzXTtcclxuICAgICAgICAgICAgLy8g0LTQtdGA0LXQstC+INCy0YvQtNCw0LXRgiDQvtGI0LjQsdC60YNcclxuICAgICAgICAgICAgdmFyIHYxID0gW3gyIC0geDEsIHkyIC0geTFdLFxyXG4gICAgICAgICAgICAgICAgdjIgPSBbeDMgLSB4MSwgeTMgLSB5MV07XHJcbiAgICAgICAgICAgIC8vINC00LXRgNC10LLQviDQstGL0LTQsNC10YIg0L7RiNC40LHQutGDXHJcbiAgICAgICAgICAgIHZhciB2MSA9IFt4MiAtIG54MSwgeTIgLSBueTFdLFxyXG4gICAgICAgICAgICAgICAgdjIgPSBbeDMgLSBueDEsIHkzIC0gbnkxXTtcclxuXHJcbiAgICAgICAgICAgIC8vINCS0LXQutGC0L7RgNC90L7QtSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LVcclxuICAgICAgICAgICAgdmFyIEQgPSB2MVswXSAqIHYyWzFdIC0gdjFbMV0gKiB2MlswXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChEIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKEQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChEID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBiZXR3ZWVuIChhLCBiLCBjKSB7XHJcbiAgICAgICAgICAgIHZhciBlcHMgPSAwLjAwMDAwMDE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYS1lcHMgPD0gYiAmJiBiIDw9IGMrZXBzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICAgICAgICAgIHZhciB4ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICAgICAoKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpKTtcclxuICAgICAgICAgICAgdmFyIHkgPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4oeCl8fGlzTmFOKHkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeDEgPj0geDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4MiwgeCwgeDEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJldHdlZW4oeDEsIHgsIHgyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoeTEgPj0geTIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5MiwgeSwgeTEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoeDMgPj0geDQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4NCwgeCwgeDMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJldHdlZW4oeDMsIHgsIHg0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoeTMgPj0geTQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5NCwgeSwgeTMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJldHdlZW4oeTMsIHksIHk0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFt4LCB5XTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kWSAocG9pbnQxLCBwb2ludDIsIHgpIHtcclxuICAgICAgICAgICAgdmFyIHgxID0gcG9pbnQxWzBdLFxyXG4gICAgICAgICAgICAgICAgeTEgPSBwb2ludDFbMV0sXHJcbiAgICAgICAgICAgICAgICB4MiA9IHBvaW50MlswXSxcclxuICAgICAgICAgICAgICAgIHkyID0gcG9pbnQyWzFdLFxyXG4gICAgICAgICAgICAgICAgYSA9IHkxIC0geTIsXHJcbiAgICAgICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgICAgIGMgPSB4MSAqIHkyIC0geDIgKiB5MTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoLWMgLSBhICogeCkgLyBiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRFcXVhdGlvbjogZnVuY3Rpb24gKHNlZ21lbnQpIHtcclxuICAgICAgICB2YXIgeDEgPSBzZWdtZW50WzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IHNlZ21lbnRbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gc2VnbWVudFsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBzZWdtZW50WzFdWzFdLFxyXG4gICAgICAgICAgICBhID0geTEgLSB5MixcclxuICAgICAgICAgICAgYiA9IHgyIC0geDEsXHJcbiAgICAgICAgICAgIGMgPSB4MSAqIHkyIC0geDIgKiB5MTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYSArICd4ICsgJyArIGIgKyAneSArICcgKyBjICsgJyA9IDAnKTtcclxuICAgIH0sXHJcblxyXG4gICAgZmluZEludGVyc2VjdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MzE5OC9ob3ctZG8teW91LWRldGVjdC13aGVyZS10d28tbGluZS1zZWdtZW50cy1pbnRlcnNlY3QvMTk2ODM0NSMxOTY4MzQ1XHJcbiAgICBiZXR3ZWVuOiBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gICAgICAgIHZhciBlcHMgPSAwLjAwMDAwMDE7XHJcblxyXG4gICAgICAgIHJldHVybiBhLWVwcyA8PSBiICYmIGIgPD0gYytlcHM7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICAgICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAgICAgdmFyIHkgPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHgpfHxpc05hTih5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHgxID49IHgyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MiwgeCwgeDEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHgxLCB4LCB4MikpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5MSA+PSB5Mikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTIsIHksIHkxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MSwgeSwgeTIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeDMgPj0geDQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDMsIHgsIHg0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkzID49IHk0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5NCwgeSwgeTMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkzLCB5LCB5NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbeCwgeV07XHJcbiAgICB9LFxyXG5cclxuICAgIHBvaW50T25MaW5lOiBmdW5jdGlvbiAobGluZSwgcG9pbnQpIHtcclxuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdLFxyXG4gICAgICAgICAgICB4MSA9IGJlZ2luWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGJlZ2luWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGVuZFswXSxcclxuICAgICAgICAgICAgeTIgPSBlbmRbMV0sXHJcbiAgICAgICAgICAgIHggPSBwb2ludFswXSxcclxuICAgICAgICAgICAgeSA9IHBvaW50WzFdO1xyXG5cclxuICAgICAgICByZXR1cm4gKCh4IC0geDEpICogKHkyIC0geTEpIC0gKHkgLSB5MSkgKiAoeDIgLSB4MSkgPT09IDApICYmICgoeCA+IHgxICYmIHggPCB4MikgfHwgKHggPiB4MiAmJiB4IDwgeDEpKTtcclxuICAgIH0sXHJcblxyXG4gICAgZmluZFk6IGZ1bmN0aW9uIChwb2ludDEsIHBvaW50MiwgeCkge1xyXG4gICAgICAgIHZhciB4MSA9IHBvaW50MVswXSxcclxuICAgICAgICAgICAgeTEgPSBwb2ludDFbMV0sXHJcbiAgICAgICAgICAgIHgyID0gcG9pbnQyWzBdLFxyXG4gICAgICAgICAgICB5MiA9IHBvaW50MlsxXSxcclxuICAgICAgICAgICAgYSA9IHkxIC0geTIsXHJcbiAgICAgICAgICAgIGIgPSB4MiAtIHgxLFxyXG4gICAgICAgICAgICBjID0geDEgKiB5MiAtIHgyICogeTE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKC1jIC0gYSAqIHgpIC8gYjtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1dGlscztcclxuIl19
