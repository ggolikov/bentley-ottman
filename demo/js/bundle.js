(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [[[37.5152069300591, 55.80450887065186], [37.72827167009467, 55.68271878960951]], [[37.527464249137815, 55.77023348261655], [37.52840634669059, 55.84486000512404]]

// [[37.532279074148235,55.805981592111884],[37.64098701400218,55.70648655604701]],
// [[37.565505169406585,55.71366864747661],[37.68419324052014,55.80127797612775]],
// [[37.609906886866035,55.73133494107268],[37.64244586242978,55.73807737662369]]
];

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

var points = turf.random('points', 18, {
    bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
});

var coords = points.features.map(function (feature) {
    return feature.geometry.coordinates;
});

for (var i = 0; i < coords.length; i += 2) {
    lines.push([coords[i], coords[i + 1]]);
}

drawLines(lines);
// drawLines(data);

var ps = findIntersections(lines, map);
// var ps = findIntersections(data, map);

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
 *   parent:        ?Node,
 *   left:          ?Node,
 *   right:         ?Node,
 *   balanceFactor: number,
 *   key:           Key,
 *   data:          Value
 * }} Node
 */

/**
 * @typedef {*} Key
 */

/**
 * @typedef {*} Value
 */

/**
 * Default comparison function
 * @param {Key} a
 * @param {Key} b
 * @returns {number}
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


var AVLTree = function AVLTree (comparator, noDuplicates) {
  if ( noDuplicates === void 0 ) noDuplicates = false;

  this._comparator = comparator || DEFAULT_COMPARE;
  this._root = null;
  this._size = 0;
  this._noDuplicates = !!noDuplicates;
};

var prototypeAccessors = { size: {} };


/**
 * Clear the tree
 * @return {AVLTree}
 */
AVLTree.prototype.destroy = function destroy () {
  this._root = null;
  return this;
};

/**
 * Number of nodes
 * @return {number}
 */
prototypeAccessors.size.get = function () {
  return this._size;
};


/**
 * Whether the tree contains a node with the given key
 * @param{Key} key
 * @return {boolean} true/false
 */
AVLTree.prototype.contains = function contains (key) {
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
 * @return {?Node}
 */
AVLTree.prototype.next = function next (node) {
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
 * @return {?Node}
 */
AVLTree.prototype.prev = function prev (node) {
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
 * Callback for forEach
 * @callback forEachCallback
 * @param {Node} node
 * @param {number} index
 */

/**
 * @param{forEachCallback} callback
 * @return {AVLTree}
 */
AVLTree.prototype.forEach = function forEach (callback) {
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
        callback(current, i++);

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
AVLTree.prototype.keys = function keys () {
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
 * @return {Array<Value>}
 */
AVLTree.prototype.values = function values () {
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
 * Returns node at given index
 * @param{number} index
 * @return {?Node}
 */
AVLTree.prototype.at = function at (index) {
  // removed after a consideration, more misleading than useful
  // index = index % this.size;
  // if (index < 0) index = this.size - index;

  var current = this._root;
  var s = [], done = false, i = 0;

  while (!done) {
    if (current) {
      s.push(current);
      current = current.left;
    } else {
      if (s.length > 0) {
        current = s.pop();
        if (i === index) { return current; }
        i++;
        current = current.right;
      } else { done = true; }
    }
  }
  return null;
};


/**
 * Returns node with the minimum key
 * @return {?Node}
 */
AVLTree.prototype.minNode = function minNode () {
  var node = this._root;
  if (!node) { return null; }
  while (node.left) { node = node.left; }
  return node;
};


/**
 * Returns node with the max key
 * @return {?Node}
 */
AVLTree.prototype.maxNode = function maxNode () {
  var node = this._root;
  if (!node) { return null; }
  while (node.right) { node = node.right; }
  return node;
};


/**
 * Min key
 * @return {?Key}
 */
AVLTree.prototype.min = function min () {
  var node = this._root;
  if (!node) { return null; }
  while (node.left) { node = node.left; }
  return node.key;
};


/**
 * Max key
 * @return {?Key}
 */
AVLTree.prototype.max = function max () {
  var node = this._root;
  if (!node) { return null; }
  while (node.right) { node = node.right; }
  return node.key;
};


/**
 * @return {boolean} true/false
 */
AVLTree.prototype.isEmpty = function isEmpty () {
  return !this._root;
};


/**
 * Removes and returns the node with smallest key
 * @return {?Node}
 */
AVLTree.prototype.pop = function pop () {
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
 * @return {?Node}
 */
AVLTree.prototype.find = function find (key) {
  var root = this._root;
  // if (root === null)  return null;
  // if (key === root.key) return root;

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
 * @param{Value} [data]
 * @return {?Node}
 */
AVLTree.prototype.insert = function insert (key, data) {
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

  if (this._noDuplicates) {
    while (node) {
      cmp = compare(key, node.key);
      parent = node;
      if    (cmp === 0) { return null; }
      else if (cmp < 0) { node = node.left; }
      else              { node = node.right; }
    }
  } else {
    while (node) {
      cmp = compare(key, node.key);
      parent = node;
      if    (cmp <= 0){ node = node.left; } //return null;
      else              { node = node.right; }
    }
  }

  var newNode = {
    left: null,
    right: null,
    balanceFactor: 0,
    parent: parent, key: key, data: data
  };
  var newRoot;
  if (cmp <= 0) { parent.left= newNode; }
  else       { parent.right = newNode; }

  while (parent) {
    cmp = compare(parent.key, key);
    if (cmp < 0) { parent.balanceFactor -= 1; }
    else       { parent.balanceFactor += 1; }

    if      (parent.balanceFactor === 0) { break; }
    else if (parent.balanceFactor < -1) {
      // inlined
      //var newRoot = rightBalance(parent);
      if (parent.right.balanceFactor === 1) { rotateRight(parent.right); }
      newRoot = rotateLeft(parent);

      if (parent === this$1._root) { this$1._root = newRoot; }
      break;
    } else if (parent.balanceFactor > 1) {
      // inlined
      // var newRoot = leftBalance(parent);
      if (parent.left.balanceFactor === -1) { rotateLeft(parent.left); }
      newRoot = rotateRight(parent);

      if (parent === this$1._root) { this$1._root = newRoot; }
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
 * @return {?Node}
 */
AVLTree.prototype.remove = function remove (key) {
    var this$1 = this;

  if (!this._root) { return null; }

  var node = this._root;
  var compare = this._comparator;
  var cmp = 0;

  while (node) {
    cmp = compare(key, node.key);
    if    (cmp === 0) { break; }
    else if (cmp < 0) { node = node.left; }
    else              { node = node.right; }
  }
  if (!node) { return null; }

  var returnValue = node.key;
  var max, min;

  if (node.left) {
    max = node.left;

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
    min = node.right;

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
  var newRoot;

  while (parent) {
    if (parent.left === pp) { parent.balanceFactor -= 1; }
    else                  { parent.balanceFactor += 1; }

    if      (parent.balanceFactor < -1) {
      // inlined
      //var newRoot = rightBalance(parent);
      if (parent.right.balanceFactor === 1) { rotateRight(parent.right); }
      newRoot = rotateLeft(parent);

      if (parent === this$1._root) { this$1._root = newRoot; }
      parent = newRoot;
    } else if (parent.balanceFactor > 1) {
      // inlined
      // var newRoot = leftBalance(parent);
      if (parent.left.balanceFactor === -1) { rotateLeft(parent.left); }
      newRoot = rotateRight(parent);

      if (parent === this$1._root) { this$1._root = newRoot; }
      parent = newRoot;
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
 * Bulk-load items
 * @param{Array<Key>}keys
 * @param{Array<Value>}[values]
 * @return {AVLTree}
 */
AVLTree.prototype.load = function load (keys, values) {
    var this$1 = this;
    if ( keys === void 0 ) keys = [];
    if ( values === void 0 ) values = [];

  if (Array.isArray(keys)) {
    for (var i = 0, len = keys.length; i < len; i++) {
      this$1.insert(keys[i], values[i]);
    }
  }
  return this;
};


/**
 * Returns true if the tree is balanced
 * @return {boolean}
 */
AVLTree.prototype.isBalanced = function isBalanced$1 () {
  return isBalanced(this._root);
};


/**
 * String representation of the tree - primitive horizontal print-out
 * @param{Function(Node):string} [printNode]
 * @return {string}
 */
AVLTree.prototype.toString = function toString (printNode) {
  return print(this._root, printNode);
};

Object.defineProperties( AVLTree.prototype, prototypeAccessors );

return AVLTree;

})));


},{}],5:[function(require,module,exports){
var Tree = require('avl'),
    utils = require('./utils');

/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {
    var ctx = {
        x: null,
        before: null
    };

    var queue = new Tree(utils.comparePoints),
        status = new Tree(utils.compareSegments.bind(ctx)),
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

        ctx.x = p[0];

        console.log(i + ') current point: ' + event.data.point.toString());
        // console.log('   point type: ' + event.data.type);
        // console.log('   queue: ' + queue.toString());
        // console.log('   status: ' + status.toString());

        var keys = status.keys();
        if (keys.length) {
            var counter = keys.length - 1;

            var mn = status.maxNode();

            console.log(counter + ': ' + mn.key.toString());

            while (status.prev(mn)) {
                console.log(--counter + ': ' + status.prev(mn).key.toString());
                mn = status.prev(mn);
            }
        }

        if (event.data.type === 'begin') {
            ctx.before = null;

            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, { radius: 4, color: 'green', fillColor: 'green' }).addTo(map);
            status.insert(event.data.segment);
            var segE = status.find(event.data.segment);

            var lls = segE.key.map(function (p) {
                return L.latLng(p.slice().reverse());
            });
            var line = L.polyline(lls, { color: 'green' }).addTo(map);

            line.bindPopup('added' + i);

            var begin = status.minNode();

            var segA = status.prev(segE);
            var segB = status.next(segE);

            if (segA !== begin) {
                segA = status.prev(segE);
            } else {
                segA = begin;
                segA = status.prev(segA);
                segA = status.next(segA);
            }
            // next = sweepLine.next(next);

            // if (!segA && segB && status.next(status.next(segE))) {
            //     segB = status.next(status.next(segE));
            // }
            // if (segA && !segB && status.prev(status.prev(segE))) {
            //     segA = status.prev(status.prev(segE));
            // }

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
            ctx.before = null;
            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, { radius: 4, color: 'red', fillColor: 'red' }).addTo(map);
            var segE = status.find(event.data.segment);

            // var segA = segE.above;
            // var segB = segE.below;
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

            ctx.before = true;
            var seg1 = status.find(event.data.segments[0]),
                seg2 = status.find(event.data.segments[1]);
            // seg2 = status.prev(seg1);
            //             Let segE1 above segE2 be E's intersecting segments in SL;
            // status.find() возвращает одну и ту же ноду

            // seg2 = status.prev(seg1);

            // var tempRight = seg1.right;
            // seg1.right = seg2;
            // seg1.left = tempRight;

            //
            // var seg1 = status.find([event.data.point, event.data.segments[0][1]]),
            //     seg2 = status.find([event.data.point, event.data.segments[1][1]]);

            if (seg1 && seg2) {
                var segA = seg1.above;
                var segB = seg2.below;

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

            // status.remove(event.data.segments[0]);
            // status.remove(event.data.segments[1]);

            ctx.before = null;
            // status.insert(event.data.segments[1]);
            // status.insert(event.data.segments[0]);
        }

        i++;
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

        var currentX, // текущий x свиплайна
        ay, // y точки пересечения отрезка события a со свиплайном
        by, // y точки пересечения отрезка события b со свиплайном
        deltaY, // разница y точек пересечения
        deltaX1, // разница x начал отрезков
        deltaX2; // разница x концов отрезков

        if (a === b) {
            return 0;
        }

        currentX = this.x;
        ay = getY(a, currentX);
        by = getY(b, currentX);
        deltaY = ay - by;

        // сравнение надо проводить с эпсилоном,
        // иначе возможны ошибки округления
        if (Math.abs(deltaY) > EPS) {
            return deltaY < 0 ? -1 : 1;
            // если y обеих событий равны
            // проверяем угол прямых
            // чем круче прямая, тем ниже ее левый конец, значит событие располагаем ниже
        } else {
            var aSlope = getSlope(a),
                bSlope = getSlope(b);

            if (aSlope !== bSlope) {
                if (this.before) {
                    return aSlope > bSlope ? -1 : 1;
                } else {
                    return aSlope > bSlope ? 1 : -1;
                }
            }
        }
        // после сравнения по y пересечения со свиплайном
        // и сравнения уклонов
        // остается случай, когда уклоны равны
        // (if aSlope === bSlope)
        // и 2 отрезка лежат на одной прямой
        // в таком случае
        // проверим положение концов отрезков
        deltaX1 = x1 - x3;

        // проверим взаимное положение левых концов
        if (deltaX1 !== 0) {
            return deltaX1 < 0 ? -1 : 1;
        }

        // проверим взаимное положение правых концов
        deltaX2 = x2 - x4;

        if (deltaX2 !== 0) {
            return deltaX2 < 0 ? -1 : 1;
        }

        // отрезки совпадают
        return 0;
    },

    compareSegments00: function (a, b) {
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];

        // first, check left-ends

        // var x = Math.max(Math.min(x1, x2), Math.min(x3, x4));
        // console.log('x: ' + x);
        // console.log('y from x: ' + getY(b, x));
        var ay = getY(a, this.x);
        var by = getY(b, this.x);
        // return getY(a, x) < getY(b, x) - EPS;
        // L.marker(L.latLng([this.x, ay].slice().reverse())).bindPopup('1 > 2').addTo(map);
        // L.polyline([
        //     L.latLng([this.x, 55].slice().reverse()),
        //     L.latLng([this.x, 57].slice().reverse())
        // ], {
        //     weight: 1
        // }).bindPopup('' + this.x).addTo(map);
        // L.marker(L.latLng([x, by].slice().reverse())).bindPopup('2 > 1').addTo(map);

        if (Math.abs(ay - by) > EPS && ay < by) {
            return -1;
        } else if (Math.abs(ay - by) > EPS && ay > by) {
            return 1;
        }

        // if a.leftPoint = b.leftPoint
        // check right

        x = Math.min(Math.max(x1, x2), Math.max(x3, x4));
        ay = getY(a, x);
        by = getY(b, x);

        // L.marker(L.latLng([this.x, ay].slice().reverse())).bindPopup('1 > 2').addTo(map);
        if (Math.abs(ay - by) > EPS && ay < by) {
            return -1;
        } else if (Math.abs(ay - by) > EPS && ay > by) {
            return 1;
        }

        return 0;

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
    }

};

function getSlope(segment) {
    var x1 = segment[0][0],
        y1 = segment[0][1],
        x2 = segment[1][0],
        y2 = segment[1][1];

    if (x1 === x2) {
        return y1 < y2 ? Infinity : -Infinity;
    } else {
        return (y2 - y1) / (x2 - x1);
    }
}

function getY(segment, x) {
    var begin = segment[0],
        end = segment[1],
        span = segment[1][0] - segment[0][0],
        deltaX0,
        // разница между x и x начала отрезка
    deltaX1,
        // разница между x конца отрезка и x
    ifac,
        // пропорция deltaX0 к проекции
    fac; // пропорция deltaX1 к проекции

    // в случае, если x не пересекается с проекцией отрезка на ось x,
    // возврщает y начала или конца отрезка
    if (x <= begin[0]) {
        return begin[1];
    } else if (x >= end[0]) {
        return end[1];
    }

    // если x лежит внутри проекции отрезка на ось x
    // вычисляет пропорции
    deltaX0 = x - begin[0];
    deltaX1 = end[0] - x;

    if (deltaX0 > deltaX1) {
        ifac = deltaX0 / span;
        fac = 1 - ifac;
    } else {
        fac = deltaX1 / span;
        ifac = 1 - fac;
    }

    return begin[1] * fac + end[1] * ifac;
}

function getY00(segment, x) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXHN3ZWVwbGluZS5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFPLE9BQVAsR0FBaUIsQ0FDYixDQUFDLENBQUMsZ0JBQUQsRUFBa0IsaUJBQWxCLENBQUQsRUFBc0MsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBdEMsQ0FEYSxFQUViLENBQUMsQ0FBQyxrQkFBRCxFQUFvQixpQkFBcEIsQ0FBRCxFQUF3QyxDQUFDLGlCQUFELEVBQW1CLGlCQUFuQixDQUF4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFOYSxDQUFqQjs7O0FDQUEsSUFBSSxvQkFBb0IsUUFBUSxhQUFSLENBQXhCO0FBQ0EsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxNQUFNLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJDLEVBQXlDLFNBQVMsRUFBbEQsRUFBakIsQ0FMVjtBQUFBLElBTUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FOWDs7QUFRQSxPQUFPLEdBQVAsR0FBYSxHQUFiOztBQUVBLElBQUksU0FBUyxJQUFJLFNBQUosRUFBYjtBQUFBLElBQ0ksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FEMUI7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQSxRQUFJLEtBQUssTUFBTSxDQUFOLENBQVQsRUFBbUI7QUFDZixlQUFPLE1BQU0sQ0FBTixDQUFQO0FBQ0gsS0FGRCxNQUVPLElBQUksS0FBSyxJQUFJLENBQUosQ0FBVCxFQUFpQjtBQUNwQixlQUFPLElBQUksQ0FBSixDQUFQO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBLGNBQVUsSUFBSSxNQUFNLENBQU4sQ0FBZDtBQUNBLGNBQVUsSUFBSSxDQUFKLElBQVMsQ0FBbkI7O0FBRUEsUUFBSSxVQUFVLE9BQWQsRUFBdUI7QUFDbkIsZUFBTyxVQUFVLElBQWpCO0FBQ0EsY0FBTSxJQUFJLElBQVY7QUFDSCxLQUhELE1BR087QUFDSCxjQUFNLFVBQVUsSUFBaEI7QUFDQSxlQUFPLElBQUksR0FBWDtBQUNIOztBQUVELFdBQVEsTUFBTSxDQUFOLElBQVcsR0FBWixHQUFvQixJQUFJLENBQUosSUFBUyxJQUFwQztBQUNIOztBQUVELFNBQVMsTUFBVCxDQUFnQixPQUFoQixFQUF5QixDQUF6QixFQUE0QjtBQUN4QixRQUFJLEtBQUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFUO0FBQUEsUUFDSSxLQUFLLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FEVDtBQUFBLFFBRUksS0FBSyxRQUFRLENBQVIsRUFBVyxDQUFYLENBRlQ7QUFBQSxRQUdJLEtBQUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUhUOztBQUtBO0FBQ0E7QUFDQSxRQUFJLEtBQUssR0FBTCxDQUFTLEtBQUssRUFBZCxJQUFvQixHQUF4QixFQUE2QjtBQUN6QixlQUFPLEVBQVA7QUFDSDtBQUNEO0FBQ0E7QUFDQSxXQUFPLEtBQUssQ0FBQyxLQUFLLEVBQU4sS0FBYSxJQUFJLEVBQWpCLEtBQXdCLEtBQUssRUFBN0IsQ0FBWjtBQUNIOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFJLEtBQUosRUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAgW1szNy41MTUyMDY5MzAwNTkxLDU1LjgwNDUwODg3MDY1MTg2XSxbMzcuNzI4MjcxNjcwMDk0NjcsNTUuNjgyNzE4Nzg5NjA5NTFdXSxcbiAgICBbWzM3LjUyNzQ2NDI0OTEzNzgxNSw1NS43NzAyMzM0ODI2MTY1NV0sWzM3LjUyODQwNjM0NjY5MDU5LDU1Ljg0NDg2MDAwNTEyNDA0XV1cblxuICAgIC8vIFtbMzcuNTMyMjc5MDc0MTQ4MjM1LDU1LjgwNTk4MTU5MjExMTg4NF0sWzM3LjY0MDk4NzAxNDAwMjE4LDU1LjcwNjQ4NjU1NjA0NzAxXV0sXG4gICAgLy8gW1szNy41NjU1MDUxNjk0MDY1ODUsNTUuNzEzNjY4NjQ3NDc2NjFdLFszNy42ODQxOTMyNDA1MjAxNCw1NS44MDEyNzc5NzYxMjc3NV1dLFxuICAgIC8vIFtbMzcuNjA5OTA2ODg2ODY2MDM1LDU1LjczMTMzNDk0MTA3MjY4XSxbMzcuNjQyNDQ1ODYyNDI5NzgsNTUuNzM4MDc3Mzc2NjIzNjldXVxuXTtcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvaW5kZXguanMnKTtcblxudmFyIG9zbSA9IEwudGlsZUxheWVyKCdodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9ub2xhYmVscy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgIG1heFpvb206IDIyLFxuICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAub3JnXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPidcbiAgICB9KSxcbiAgICBwb2ludCA9IEwubGF0TG5nKFs1NS43NTMyMTAsIDM3LjYyMTc2Nl0pLFxuICAgIG1hcCA9IG5ldyBMLk1hcCgnbWFwJywge2xheWVyczogW29zbV0sIGNlbnRlcjogcG9pbnQsIHpvb206IDExLCBtYXhab29tOiAyMn0pLFxuICAgIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xuXG53aW5kb3cubWFwID0gbWFwO1xuXG52YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpLFxuICAgIG4gPSBib3VuZHMuX25vcnRoRWFzdC5sYXQsXG4gICAgZSA9IGJvdW5kcy5fbm9ydGhFYXN0LmxuZyxcbiAgICBzID0gYm91bmRzLl9zb3V0aFdlc3QubGF0LFxuICAgIHcgPSBib3VuZHMuX3NvdXRoV2VzdC5sbmcsXG4gICAgaGVpZ2h0ID0gbiAtIHMsXG4gICAgd2lkdGggPSBlIC0gdyxcbiAgICBxSGVpZ2h0ID0gaGVpZ2h0IC8gNCxcbiAgICBxV2lkdGggPSB3aWR0aCAvIDQsXG4gICAgbGluZXMgPSBbXTtcblxudmFyIHBvaW50cyA9IHR1cmYucmFuZG9tKCdwb2ludHMnLCAxOCwge1xuICAgIGJib3g6IFt3ICsgcVdpZHRoLCBzICsgcUhlaWdodCwgZSAtIHFXaWR0aCwgbiAtIHFIZWlnaHRdXG59KTtcblxudmFyIGNvb3JkcyA9IHBvaW50cy5mZWF0dXJlcy5tYXAoZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xufSlcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKz0yKSB7XG4gICAgbGluZXMucHVzaChbY29vcmRzW2ldLCBjb29yZHNbaSsxXV0pO1xufVxuXG5kcmF3TGluZXMobGluZXMpO1xuLy8gZHJhd0xpbmVzKGRhdGEpO1xuXG52YXIgcHMgPSBmaW5kSW50ZXJzZWN0aW9ucyhsaW5lcywgbWFwKTtcbi8vIHZhciBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGRhdGEsIG1hcCk7XG5cbnBzLmZvckVhY2goZnVuY3Rpb24gKHApIHtcbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKSwge3JhZGl1czogNSwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5hZGRUbyhtYXApO1xufSlcblxuZnVuY3Rpb24gZHJhd0xpbmVzKGFycmF5KSB7XG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLFxuICAgICAgICAgICAgZW5kID0gbGluZVsxXTtcblxuICAgICAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhiZWdpbiksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XG4gICAgICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGVuZCksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XG4gICAgICAgIEwucG9seWxpbmUoW2JlZ2luLCBlbmRdLCB7d2VpZ2h0OiAxfSkuYWRkVG8obWFwKTtcbiAgICB9KTtcbn1cblxuLy8gY29uc29sZS5sb2cocHMpO1xuIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi9zcmMvc3dlZXBsaW5lLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuYXZsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFByaW50cyB0cmVlIGhvcml6b250YWxseVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBwcmludCAocm9vdCwgcHJpbnROb2RlKSB7XG4gIGlmICggcHJpbnROb2RlID09PSB2b2lkIDAgKSBwcmludE5vZGUgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbi5rZXk7IH07XG5cbiAgdmFyIG91dCA9IFtdO1xuICByb3cocm9vdCwgJycsIHRydWUsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBvdXQucHVzaCh2KTsgfSwgcHJpbnROb2RlKTtcbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBQcmludHMgbGV2ZWwgb2YgdGhlIHRyZWVcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICBwcmVmaXhcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgaXNUYWlsXG4gKiBAcGFyYW0gIHtGdW5jdGlvbihpbjpzdHJpbmcpOnZvaWR9ICAgIG91dFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9ICBwcmludE5vZGVcbiAqL1xuZnVuY3Rpb24gcm93IChyb290LCBwcmVmaXgsIGlzVGFpbCwgb3V0LCBwcmludE5vZGUpIHtcbiAgaWYgKHJvb3QpIHtcbiAgICBvdXQoKFwiXCIgKyBwcmVmaXggKyAoaXNUYWlsID8gJ+KUlOKUgOKUgCAnIDogJ+KUnOKUgOKUgCAnKSArIChwcmludE5vZGUocm9vdCkpICsgXCJcXG5cIikpO1xuICAgIHZhciBpbmRlbnQgPSBwcmVmaXggKyAoaXNUYWlsID8gJyAgICAnIDogJ+KUgiAgICcpO1xuICAgIGlmIChyb290LmxlZnQpICB7IHJvdyhyb290LmxlZnQsICBpbmRlbnQsIGZhbHNlLCBvdXQsIHByaW50Tm9kZSk7IH1cbiAgICBpZiAocm9vdC5yaWdodCkgeyByb3cocm9vdC5yaWdodCwgaW5kZW50LCB0cnVlLCAgb3V0LCBwcmludE5vZGUpOyB9XG4gIH1cbn1cblxuXG4vKipcbiAqIElzIHRoZSB0cmVlIGJhbGFuY2VkIChub25lIG9mIHRoZSBzdWJ0cmVlcyBkaWZmZXIgaW4gaGVpZ2h0IGJ5IG1vcmUgdGhhbiAxKVxuICogQHBhcmFtICB7Tm9kZX0gICAgcm9vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNCYWxhbmNlZChyb290KSB7XG4gIGlmIChyb290ID09PSBudWxsKSB7IHJldHVybiB0cnVlOyB9IC8vIElmIG5vZGUgaXMgZW1wdHkgdGhlbiByZXR1cm4gdHJ1ZVxuXG4gIC8vIEdldCB0aGUgaGVpZ2h0IG9mIGxlZnQgYW5kIHJpZ2h0IHN1YiB0cmVlc1xuICB2YXIgbGggPSBoZWlnaHQocm9vdC5sZWZ0KTtcbiAgdmFyIHJoID0gaGVpZ2h0KHJvb3QucmlnaHQpO1xuXG4gIGlmIChNYXRoLmFicyhsaCAtIHJoKSA8PSAxICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QubGVmdCkgICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QucmlnaHQpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gSWYgd2UgcmVhY2ggaGVyZSB0aGVuIHRyZWUgaXMgbm90IGhlaWdodC1iYWxhbmNlZFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIENvbXB1dGUgdGhlICdoZWlnaHQnIG9mIGEgdHJlZS5cbiAqIEhlaWdodCBpcyB0aGUgbnVtYmVyIG9mIG5vZGVzIGFsb25nIHRoZSBsb25nZXN0IHBhdGhcbiAqIGZyb20gdGhlIHJvb3Qgbm9kZSBkb3duIHRvIHRoZSBmYXJ0aGVzdCBsZWFmIG5vZGUuXG4gKlxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBoZWlnaHQobm9kZSkge1xuICByZXR1cm4gbm9kZSA/ICgxICsgTWF0aC5tYXgoaGVpZ2h0KG5vZGUubGVmdCksIGhlaWdodChub2RlLnJpZ2h0KSkpIDogMDtcbn1cblxuLy8gZnVuY3Rpb24gY3JlYXRlTm9kZSAocGFyZW50LCBsZWZ0LCByaWdodCwgaGVpZ2h0LCBrZXksIGRhdGEpIHtcbi8vICAgcmV0dXJuIHsgcGFyZW50LCBsZWZ0LCByaWdodCwgYmFsYW5jZUZhY3RvcjogaGVpZ2h0LCBrZXksIGRhdGEgfTtcbi8vIH1cblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBwYXJlbnQ6ICAgICAgICA/Tm9kZSxcbiAqICAgbGVmdDogICAgICAgICAgP05vZGUsXG4gKiAgIHJpZ2h0OiAgICAgICAgID9Ob2RlLFxuICogICBiYWxhbmNlRmFjdG9yOiBudW1iZXIsXG4gKiAgIGtleTogICAgICAgICAgIEtleSxcbiAqICAgZGF0YTogICAgICAgICAgVmFsdWVcbiAqIH19IE5vZGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsqfSBLZXlcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsqfSBWYWx1ZVxuICovXG5cbi8qKlxuICogRGVmYXVsdCBjb21wYXJpc29uIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0tleX0gYVxuICogQHBhcmFtIHtLZXl9IGJcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfQ09NUEFSRSAoYSwgYikgeyByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7IH1cblxuXG4vKipcbiAqIFNpbmdsZSBsZWZ0IHJvdGF0aW9uXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5mdW5jdGlvbiByb3RhdGVMZWZ0IChub2RlKSB7XG4gIHZhciByaWdodE5vZGUgPSBub2RlLnJpZ2h0O1xuICBub2RlLnJpZ2h0ICAgID0gcmlnaHROb2RlLmxlZnQ7XG5cbiAgaWYgKHJpZ2h0Tm9kZS5sZWZ0KSB7IHJpZ2h0Tm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICByaWdodE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChyaWdodE5vZGUucGFyZW50KSB7XG4gICAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5sZWZ0ID0gcmlnaHROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LnJpZ2h0ID0gcmlnaHROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gcmlnaHROb2RlO1xuICByaWdodE5vZGUubGVmdCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChyaWdodE5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gcmlnaHROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuICByZXR1cm4gcmlnaHROb2RlO1xufVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZVJpZ2h0IChub2RlKSB7XG4gIHZhciBsZWZ0Tm9kZSA9IG5vZGUubGVmdDtcbiAgbm9kZS5sZWZ0ID0gbGVmdE5vZGUucmlnaHQ7XG4gIGlmIChub2RlLmxlZnQpIHsgbm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICBsZWZ0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKGxlZnROb2RlLnBhcmVudCkge1xuICAgIGlmIChsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgbGVmdE5vZGUucGFyZW50LmxlZnQgPSBsZWZ0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdE5vZGUucGFyZW50LnJpZ2h0ID0gbGVmdE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSBsZWZ0Tm9kZTtcbiAgbGVmdE5vZGUucmlnaHQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobGVmdE5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gbGVmdE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJldHVybiBsZWZ0Tm9kZTtcbn1cblxuXG4vLyBmdW5jdGlvbiBsZWZ0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSByb3RhdGVMZWZ0KG5vZGUubGVmdCk7XG4vLyAgIHJldHVybiByb3RhdGVSaWdodChub2RlKTtcbi8vIH1cblxuXG4vLyBmdW5jdGlvbiByaWdodEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgcm90YXRlUmlnaHQobm9kZS5yaWdodCk7XG4vLyAgIHJldHVybiByb3RhdGVMZWZ0KG5vZGUpO1xuLy8gfVxuXG5cbnZhciBBVkxUcmVlID0gZnVuY3Rpb24gQVZMVHJlZSAoY29tcGFyYXRvciwgbm9EdXBsaWNhdGVzKSB7XG4gIGlmICggbm9EdXBsaWNhdGVzID09PSB2b2lkIDAgKSBub0R1cGxpY2F0ZXMgPSBmYWxzZTtcblxuICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvciB8fCBERUZBVUxUX0NPTVBBUkU7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xuICB0aGlzLl9zaXplID0gMDtcbiAgdGhpcy5fbm9EdXBsaWNhdGVzID0gISFub0R1cGxpY2F0ZXM7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBzaXplOiB7fSB9O1xuXG5cbi8qKlxuICogQ2xlYXIgdGhlIHRyZWVcbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBOdW1iZXIgb2Ygbm9kZXNcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xucHJvdG90eXBlQWNjZXNzb3JzLnNpemUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc2l6ZTtcbn07XG5cblxuLyoqXG4gKiBXaGV0aGVyIHRoZSB0cmVlIGNvbnRhaW5zIGEgbm9kZSB3aXRoIHRoZSBnaXZlbiBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZS9mYWxzZVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zIChrZXkpIHtcbiAgaWYgKHRoaXMuX3Jvb3Qpe1xuICAgIHZhciBub2RlICAgICA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuICAgIHdoaWxlIChub2RlKXtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGtleSwgbm9kZS5rZXkpO1xuICAgICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblxuLyogZXNsaW50LWRpc2FibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG4vKipcbiAqIFN1Y2Nlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiBuZXh0IChub2RlKSB7XG4gIHZhciBzdWNjZXNzb3IgPSBub2RlO1xuICBpZiAoc3VjY2Vzc29yKSB7XG4gICAgaWYgKHN1Y2Nlc3Nvci5yaWdodCkge1xuICAgICAgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnJpZ2h0O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IubGVmdCkgeyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IubGVmdDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLnJpZ2h0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBzdWNjZXNzb3I7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWNjZXNzb3I7XG59O1xuXG5cbi8qKlxuICogUHJlZGVjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gcHJldiAobm9kZSkge1xuICB2YXIgcHJlZGVjZXNzb3IgPSBub2RlO1xuICBpZiAocHJlZGVjZXNzb3IpIHtcbiAgICBpZiAocHJlZGVjZXNzb3IubGVmdCkge1xuICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5sZWZ0O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLnJpZ2h0KSB7IHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucmlnaHQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZGVjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5sZWZ0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBwcmVkZWNlc3NvcjtcbiAgICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwcmVkZWNlc3Nvcjtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBmb3JFYWNoXG4gKiBAY2FsbGJhY2sgZm9yRWFjaENhbGxiYWNrXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICovXG5cbi8qKlxuICogQHBhcmFte2ZvckVhY2hDYWxsYmFja30gY2FsbGJhY2tcbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoIChjYWxsYmFjaykge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIGRvbmUgPSBmYWxzZSwgaSA9IDA7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgLy8gUmVhY2ggdGhlIGxlZnQgbW9zdCBOb2RlIG9mIHRoZSBjdXJyZW50IE5vZGVcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgLy8gUGxhY2UgcG9pbnRlciB0byBhIHRyZWUgbm9kZSBvbiB0aGUgc3RhY2tcbiAgICAgIC8vIGJlZm9yZSB0cmF2ZXJzaW5nIHRoZSBub2RlJ3MgbGVmdCBzdWJ0cmVlXG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCYWNrVHJhY2sgZnJvbSB0aGUgZW1wdHkgc3VidHJlZSBhbmQgdmlzaXQgdGhlIE5vZGVcbiAgICAgIC8vIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrOyBob3dldmVyLCBpZiB0aGUgc3RhY2sgaXNcbiAgICAgIC8vIGVtcHR5IHlvdSBhcmUgZG9uZVxuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgY2FsbGJhY2soY3VycmVudCwgaSsrKTtcblxuICAgICAgICAvLyBXZSBoYXZlIHZpc2l0ZWQgdGhlIG5vZGUgYW5kIGl0cyBsZWZ0XG4gICAgICAgIC8vIHN1YnRyZWUuIE5vdywgaXQncyByaWdodCBzdWJ0cmVlJ3MgdHVyblxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYWxsIGtleXMgaW4gb3JkZXJcbiAqIEByZXR1cm4ge0FycmF5PEtleT59XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiBrZXlzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQua2V5KTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGBkYXRhYCBmaWVsZHMgb2YgYWxsIG5vZGVzIGluIG9yZGVyLlxuICogQHJldHVybiB7QXJyYXk8VmFsdWU+fVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5kYXRhKTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgYXQgZ2l2ZW4gaW5kZXhcbiAqIEBwYXJhbXtudW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiBhdCAoaW5kZXgpIHtcbiAgLy8gcmVtb3ZlZCBhZnRlciBhIGNvbnNpZGVyYXRpb24sIG1vcmUgbWlzbGVhZGluZyB0aGFuIHVzZWZ1bFxuICAvLyBpbmRleCA9IGluZGV4ICUgdGhpcy5zaXplO1xuICAvLyBpZiAoaW5kZXggPCAwKSBpbmRleCA9IHRoaXMuc2l6ZSAtIGluZGV4O1xuXG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgZG9uZSA9IGZhbHNlLCBpID0gMDtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgaWYgKGkgPT09IGluZGV4KSB7IHJldHVybiBjdXJyZW50OyB9XG4gICAgICAgIGkrKztcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWluaW11bSBrZXlcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5taW5Ob2RlID0gZnVuY3Rpb24gbWluTm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWF4IGtleVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm1heE5vZGUgPSBmdW5jdGlvbiBtYXhOb2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogTWluIGtleVxuICogQHJldHVybiB7P0tleX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gbWluICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cblxuLyoqXG4gKiBNYXgga2V5XG4gKiBAcmV0dXJuIHs/S2V5fVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiBtYXggKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG5cbi8qKlxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZS9mYWxzZVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eSAoKSB7XG4gIHJldHVybiAhdGhpcy5fcm9vdDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBub2RlIHdpdGggc21hbGxlc3Qga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290LCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gIGlmIChub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgcmV0dXJuVmFsdWUgPSB7IGtleTogbm9kZS5rZXksIGRhdGE6IG5vZGUuZGF0YSB9O1xuICAgIHRoaXMucmVtb3ZlKG5vZGUua2V5KTtcbiAgfVxuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogRmluZCBub2RlIGJ5IGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIGZpbmQgKGtleSkge1xuICB2YXIgcm9vdCA9IHRoaXMuX3Jvb3Q7XG4gIC8vIGlmIChyb290ID09PSBudWxsKSAgcmV0dXJuIG51bGw7XG4gIC8vIGlmIChrZXkgPT09IHJvb3Qua2V5KSByZXR1cm4gcm9vdDtcblxuICB2YXIgc3VidHJlZSA9IHJvb3QsIGNtcDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB3aGlsZSAoc3VidHJlZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBzdWJ0cmVlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gc3VidHJlZTsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgc3VidHJlZSA9IHN1YnRyZWUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgc3VidHJlZSA9IHN1YnRyZWUucmlnaHQ7IH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuXG4vKipcbiAqIEluc2VydCBhIG5vZGUgaW50byB0aGUgdHJlZVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcGFyYW17VmFsdWV9IFtkYXRhXVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCAoa2V5LCBkYXRhKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7XG4gICAgdGhpcy5fcm9vdCA9IHtcbiAgICAgIHBhcmVudDogbnVsbCwgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgICBrZXk6IGtleSwgZGF0YTogZGF0YVxuICAgIH07XG4gICAgdGhpcy5fc2l6ZSsrO1xuICAgIHJldHVybiB0aGlzLl9yb290O1xuICB9XG5cbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB2YXIgbm9kZSAgPSB0aGlzLl9yb290O1xuICB2YXIgcGFyZW50PSBudWxsO1xuICB2YXIgY21wICAgPSAwO1xuXG4gIGlmICh0aGlzLl9ub0R1cGxpY2F0ZXMpIHtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICAgIHBhcmVudCA9IG5vZGU7XG4gICAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgICBwYXJlbnQgPSBub2RlO1xuICAgICAgaWYgICAgKGNtcCA8PSAwKXsgbm9kZSA9IG5vZGUubGVmdDsgfSAvL3JldHVybiBudWxsO1xuICAgICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBuZXdOb2RlID0ge1xuICAgIGxlZnQ6IG51bGwsXG4gICAgcmlnaHQ6IG51bGwsXG4gICAgYmFsYW5jZUZhY3RvcjogMCxcbiAgICBwYXJlbnQ6IHBhcmVudCwga2V5OiBrZXksIGRhdGE6IGRhdGFcbiAgfTtcbiAgdmFyIG5ld1Jvb3Q7XG4gIGlmIChjbXAgPD0gMCkgeyBwYXJlbnQubGVmdD0gbmV3Tm9kZTsgfVxuICBlbHNlICAgICAgIHsgcGFyZW50LnJpZ2h0ID0gbmV3Tm9kZTsgfVxuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBjbXAgPSBjb21wYXJlKHBhcmVudC5rZXksIGtleSk7XG4gICAgaWYgKGNtcCA8IDApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vIGlubGluZWRcbiAgICAgIC8vdmFyIG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGlubGluZWRcbiAgICAgIC8vIHZhciBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgbmV3Um9vdCA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIHRoaXMuX3NpemUrKztcbiAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgbm9kZSBmcm9tIHRoZSB0cmVlLiBJZiBub3QgZm91bmQsIHJldHVybnMgbnVsbC5cbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoa2V5KSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHZhciBjbXAgPSAwO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZhciByZXR1cm5WYWx1ZSA9IG5vZGUua2V5O1xuICB2YXIgbWF4LCBtaW47XG5cbiAgaWYgKG5vZGUubGVmdCkge1xuICAgIG1heCA9IG5vZGUubGVmdDtcblxuICAgIHdoaWxlIChtYXgubGVmdCB8fCBtYXgucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtYXgucmlnaHQpIHsgbWF4ID0gbWF4LnJpZ2h0OyB9XG5cbiAgICAgIG5vZGUua2V5ID0gbWF4LmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgICAgaWYgKG1heC5sZWZ0KSB7XG4gICAgICAgIG5vZGUgPSBtYXg7XG4gICAgICAgIG1heCA9IG1heC5sZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtYXgua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgIG5vZGUgPSBtYXg7XG4gIH1cblxuICBpZiAobm9kZS5yaWdodCkge1xuICAgIG1pbiA9IG5vZGUucmlnaHQ7XG5cbiAgICB3aGlsZSAobWluLmxlZnQgfHwgbWluLnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWluLmxlZnQpIHsgbWluID0gbWluLmxlZnQ7IH1cblxuICAgICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICAgIGlmIChtaW4ucmlnaHQpIHtcbiAgICAgICAgbm9kZSA9IG1pbjtcbiAgICAgICAgbWluID0gbWluLnJpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgIG5vZGUgPSBtaW47XG4gIH1cblxuICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIHZhciBwcCAgID0gbm9kZTtcbiAgdmFyIG5ld1Jvb3Q7XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQubGVmdCA9PT0gcHApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vIGlubGluZWRcbiAgICAgIC8vdmFyIG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdDtcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gaW5saW5lZFxuICAgICAgLy8gdmFyIG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICBuZXdSb290ID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3Q7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAtMSB8fCBwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyBicmVhazsgfVxuXG4gICAgcHAgICA9IHBhcmVudDtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgaWYgKG5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHsgbm9kZS5wYXJlbnQubGVmdD0gbnVsbDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgeyBub2RlLnBhcmVudC5yaWdodCA9IG51bGw7IH1cbiAgfVxuXG4gIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7IHRoaXMuX3Jvb3QgPSBudWxsOyB9XG5cbiAgdGhpcy5fc2l6ZS0tO1xuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogQnVsay1sb2FkIGl0ZW1zXG4gKiBAcGFyYW17QXJyYXk8S2V5Pn1rZXlzXG4gKiBAcGFyYW17QXJyYXk8VmFsdWU+fVt2YWx1ZXNdXG4gKiBAcmV0dXJuIHtBVkxUcmVlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gbG9hZCAoa2V5cywgdmFsdWVzKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG4gICAgaWYgKCBrZXlzID09PSB2b2lkIDAgKSBrZXlzID0gW107XG4gICAgaWYgKCB2YWx1ZXMgPT09IHZvaWQgMCApIHZhbHVlcyA9IFtdO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGtleXMpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMkMS5pbnNlcnQoa2V5c1tpXSwgdmFsdWVzW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB0cmVlIGlzIGJhbGFuY2VkXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5pc0JhbGFuY2VkID0gZnVuY3Rpb24gaXNCYWxhbmNlZCQxICgpIHtcbiAgcmV0dXJuIGlzQmFsYW5jZWQodGhpcy5fcm9vdCk7XG59O1xuXG5cbi8qKlxuICogU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmVlIC0gcHJpbWl0aXZlIGhvcml6b250YWwgcHJpbnQtb3V0XG4gKiBAcGFyYW17RnVuY3Rpb24oTm9kZSk6c3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nIChwcmludE5vZGUpIHtcbiAgcmV0dXJuIHByaW50KHRoaXMuX3Jvb3QsIHByaW50Tm9kZSk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyggQVZMVHJlZS5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xuXG5yZXR1cm4gQVZMVHJlZTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF2bC5qcy5tYXBcbiIsInZhciBUcmVlID0gcmVxdWlyZSgnYXZsJyksXG4gICAgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbi8qKlxuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudHMgc2V0IG9mIHNlZ21lbnRzIGludGVyc2VjdGluZyBzd2VlcGxpbmUgW1tbeDEsIHkxXSwgW3gyLCB5Ml1dIC4uLiBbW3htLCB5bV0sIFt4biwgeW5dXV1cbiAqL1xuXG5mdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9ucyhzZWdtZW50cywgbWFwKSB7XG4gICAgdmFyIGN0eCA9IHtcbiAgICAgICAgeDogbnVsbCxcbiAgICAgICAgYmVmb3JlOiBudWxsXG4gICAgfTtcblxuICAgIHZhciBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpLFxuICAgICAgICBzdGF0dXMgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlU2VnbWVudHMuYmluZChjdHgpKSxcbiAgICAgICAgb3V0cHV0ID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVBvaW50cyk7XG5cbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50KSB7XG4gICAgICAgIHNlZ21lbnQuc29ydCh1dGlscy5jb21wYXJlUG9pbnRzKTtcbiAgICAgICAgdmFyIGJlZ2luID0gc2VnbWVudFswXSxcbiAgICAgICAgICAgIGVuZCA9IHNlZ21lbnRbMV0sXG4gICAgICAgICAgICBiZWdpbkRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcG9pbnQ6IGJlZ2luLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdiZWdpbicsXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuZERhdGEgPSB7XG4gICAgICAgICAgICAgICAgcG9pbnQ6IGVuZCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZW5kJyxcbiAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICBxdWV1ZS5pbnNlcnQoYmVnaW4sIGJlZ2luRGF0YSk7XG4gICAgICAgIHF1ZXVlLmluc2VydChlbmQsIGVuZERhdGEpO1xuICAgIH0pO1xuXG4gICAgdmFyIGkgPSAwO1xuXG5cblxuICAgIHdoaWxlICghcXVldWUuaXNFbXB0eSgpKSB7XG4gICAgICAgIHZhciBldmVudCA9IHF1ZXVlLnBvcCgpO1xuICAgICAgICB2YXIgcCA9IGV2ZW50LmRhdGEucG9pbnQ7XG5cbiAgICAgICAgY3R4LnggPSBwWzBdO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGkgKyAnKSBjdXJyZW50IHBvaW50OiAnICsgZXZlbnQuZGF0YS5wb2ludC50b1N0cmluZygpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJyAgIHBvaW50IHR5cGU6ICcgKyBldmVudC5kYXRhLnR5cGUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnICAgcXVldWU6ICcgKyBxdWV1ZS50b1N0cmluZygpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJyAgIHN0YXR1czogJyArIHN0YXR1cy50b1N0cmluZygpKTtcblxuICAgICAgICB2YXIga2V5cyA9IHN0YXR1cy5rZXlzKCk7XG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSBrZXlzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgIHZhciBtbiA9IHN0YXR1cy5tYXhOb2RlKCk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvdW50ZXIgKyAnOiAnICsgbW4ua2V5LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICB3aGlsZShzdGF0dXMucHJldihtbikpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygtLWNvdW50ZXIgKyAnOiAnICsgc3RhdHVzLnByZXYobW4pLmtleS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBtbiA9IHN0YXR1cy5wcmV2KG1uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnYmVnaW4nKSB7XG4gICAgICAgICAgICBjdHguYmVmb3JlID0gbnVsbDtcblxuICAgICAgICAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcbiAgICAgICAgICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdncmVlbicsIGZpbGxDb2xvcjogJ2dyZWVuJ30pLmFkZFRvKG1hcCk7XG4gICAgICAgICAgICBzdGF0dXMuaW5zZXJ0KGV2ZW50LmRhdGEuc2VnbWVudCk7XG4gICAgICAgICAgICB2YXIgc2VnRSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudCk7XG5cbiAgICAgICAgICAgIHZhciBsbHMgPSBzZWdFLmtleS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XG4gICAgICAgICAgICB2YXIgbGluZSA9IEwucG9seWxpbmUobGxzLCB7Y29sb3I6ICdncmVlbid9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgICAgICBsaW5lLmJpbmRQb3B1cCgnYWRkZWQnICsgaSk7XG5cbiAgICAgICAgICAgIHZhciBiZWdpbiA9IHN0YXR1cy5taW5Ob2RlKCk7XG5cbiAgICAgICAgICAgIHZhciBzZWdBID0gc3RhdHVzLnByZXYoc2VnRSk7XG4gICAgICAgICAgICB2YXIgc2VnQiA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xuXG4gICAgICAgICAgICBpZiAoc2VnQSAhPT0gYmVnaW4pIHtcbiAgICAgICAgICAgICAgICBzZWdBID0gc3RhdHVzLnByZXYoc2VnRSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZ0EgPSBiZWdpbjtcbiAgICAgICAgICAgICAgICBzZWdBID0gc3RhdHVzLnByZXYoc2VnQSk7XG4gICAgICAgICAgICAgICAgc2VnQSA9IHN0YXR1cy5uZXh0KHNlZ0EpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbmV4dCA9IHN3ZWVwTGluZS5uZXh0KG5leHQpO1xuXG4gICAgICAgICAgICAvLyBpZiAoIXNlZ0EgJiYgc2VnQiAmJiBzdGF0dXMubmV4dChzdGF0dXMubmV4dChzZWdFKSkpIHtcbiAgICAgICAgICAgIC8vICAgICBzZWdCID0gc3RhdHVzLm5leHQoc3RhdHVzLm5leHQoc2VnRSkpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gaWYgKHNlZ0EgJiYgIXNlZ0IgJiYgc3RhdHVzLnByZXYoc3RhdHVzLnByZXYoc2VnRSkpKSB7XG4gICAgICAgICAgICAvLyAgICAgc2VnQSA9IHN0YXR1cy5wcmV2KHN0YXR1cy5wcmV2KHNlZ0UpKTtcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgaWYgKHNlZ0IpIHtcbiAgICAgICAgICAgICAgIHNlZ0UuYWJvdmUgPSBzZWdCO1xuICAgICAgICAgICAgICAgc2VnRS5hYm92ZS5iZWxvdyA9IHNlZ0U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VnQSkge1xuICAgICAgICAgICAgICAgc2VnRS5iZWxvdyA9IHNlZ0E7XG4gICAgICAgICAgICAgICBzZWdFLmJlbG93LmFib3ZlID0gc2VnRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlZ0EpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdFLmtleSwgc2VnQS5rZXkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVhSW50ZXJzZWN0aW9uUG9pbnQgJiYgIW91dHB1dC5maW5kKGVhSW50ZXJzZWN0aW9uUG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlYUludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBlYUludGVyc2VjdGlvblBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Uua2V5LCBzZWdBLmtleV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoZWFJbnRlcnNlY3Rpb25Qb2ludCwgZWFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgcG9pbnQ6JyArIGVhSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VnQikge1xuICAgICAgICAgICAgICAgIHZhciBlYkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZ0Uua2V5LCBzZWdCLmtleSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWJJbnRlcnNlY3Rpb25Qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWJJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogZWJJbnRlcnNlY3Rpb25Qb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdCLmtleSwgc2VnRS5rZXldXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGViSW50ZXJzZWN0aW9uUG9pbnQsIGViSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGViSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGViSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICBFbHNlIElmIChFIGlzIGEgcmlnaHQgZW5kcG9pbnQpIHtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnR5cGUgPT09ICdlbmQnKSB7XG4gICAgICAgICAgICBjdHguYmVmb3JlID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBsbCA9IEwubGF0TG5nKFtwWzFdLCBwWzBdXSk7XG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAncmVkJywgZmlsbENvbG9yOiAncmVkJ30pLmFkZFRvKG1hcCk7XG4gICAgICAgICAgICB2YXIgc2VnRSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudCk7XG5cbiAgICAgICAgICAgIC8vIHZhciBzZWdBID0gc2VnRS5hYm92ZTtcbiAgICAgICAgICAgIC8vIHZhciBzZWdCID0gc2VnRS5iZWxvdztcbiAgICAgICAgICAgIHZhciBzZWdBID0gc3RhdHVzLnByZXYoc2VnRSk7XG4gICAgICAgICAgICB2YXIgc2VnQiA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogTE9HXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICB2YXIgbGxzID0gc2VnRS5rZXkubWFwKGZ1bmN0aW9uKHApe3JldHVybiBMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKX0pO1xuICAgICAgICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMsIHtjb2xvcjogJ3JlZCd9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgICAgICAgbGluZS5iaW5kUG9wdXAoJ3JlbW92ZWQnICsgaSk7XG5cbiAgICAgICAgICAgIGlmIChzZWdBICYmIHNlZ0IpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWJJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdBLmtleSwgc2VnQi5rZXkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFiSW50ZXJzZWN0aW9uUG9pbnQgJiYgIW91dHB1dC5maW5kKGFiSW50ZXJzZWN0aW9uUG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhYkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBhYkludGVyc2VjdGlvblBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Eua2V5LCBzZWdCLmtleV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgSW5zZXJ0IEkgaW50byBFUTtcbiAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGFiSW50ZXJzZWN0aW9uUG9pbnQsIGFiSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGFiSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGFiSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbnggPSBzdGF0dXMubmV4dChzZWdFKTtcbiAgICAgICAgICAgIGlmIChueCl7XG4gICAgICAgICAgICAgICAgbnguYmVsb3cgPSBzZWdFLmJlbG93O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbnAgPSBzdGF0dXMucHJldihzZWdFKTtcbiAgICAgICAgICAgIGlmIChucCl7XG4gICAgICAgICAgICAgICAgbnAuYWJvdmUgPSBzZWdFLmFib3ZlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdGF0dXMucmVtb3ZlKHNlZ0Uua2V5KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcbiAgICAgICAgICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5hZGRUbyhtYXApO1xuICAgICAgICAgICAgb3V0cHV0Lmluc2VydChldmVudC5kYXRhLnBvaW50KTtcblxuICAgICAgICAgICAgY3R4LmJlZm9yZSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgc2VnMSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudHNbMF0pLFxuICAgICAgICAgICAgICAgIHNlZzIgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnRzWzFdKTtcbiAgICAgICAgICAgICAgICAvLyBzZWcyID0gc3RhdHVzLnByZXYoc2VnMSk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnRTEgYWJvdmUgc2VnRTIgYmUgRSdzIGludGVyc2VjdGluZyBzZWdtZW50cyBpbiBTTDtcbiAgICAgICAgICAgIC8vIHN0YXR1cy5maW5kKCkg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC90YMg0Lgg0YLRgyDQttC1INC90L7QtNGDXG5cbiAgICAgICAgICAgICAgICAvLyBzZWcyID0gc3RhdHVzLnByZXYoc2VnMSk7XG5cbiAgICAgICAgICAgIC8vIHZhciB0ZW1wUmlnaHQgPSBzZWcxLnJpZ2h0O1xuICAgICAgICAgICAgLy8gc2VnMS5yaWdodCA9IHNlZzI7XG4gICAgICAgICAgICAvLyBzZWcxLmxlZnQgPSB0ZW1wUmlnaHQ7XG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyB2YXIgc2VnMSA9IHN0YXR1cy5maW5kKFtldmVudC5kYXRhLnBvaW50LCBldmVudC5kYXRhLnNlZ21lbnRzWzBdWzFdXSksXG4gICAgICAgICAgICAvLyAgICAgc2VnMiA9IHN0YXR1cy5maW5kKFtldmVudC5kYXRhLnBvaW50LCBldmVudC5kYXRhLnNlZ21lbnRzWzFdWzFdXSk7XG5cbiAgICAgICAgICAgIGlmIChzZWcxICYmIHNlZzIpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VnQSA9IHNlZzEuYWJvdmU7XG4gICAgICAgICAgICAgICAgdmFyIHNlZ0IgPSBzZWcyLmJlbG93O1xuXG4gICAgICAgICAgICAgICAgc2VnMS5hYm92ZSA9IHNlZzI7XG4gICAgICAgICAgICAgICAgc2VnMi5iZWxvdyA9IHNlZzE7XG4gICAgICAgICAgICAgICAgc2VnMS5iZWxvdyA9IHNlZ0I7XG4gICAgICAgICAgICAgICAgc2VnMi5hYm92ZSA9IHNlZ0E7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VnQSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYTJJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWcyLmtleSwgc2VnQS5rZXkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhMkludGVyc2VjdGlvblBvaW50ICYmICFvdXRwdXQuZmluZChhMkludGVyc2VjdGlvblBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEySW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBhMkludGVyc2VjdGlvblBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnQS5rZXksIHNlZzIua2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGEySW50ZXJzZWN0aW9uUG9pbnQsIGEySW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBhMkludGVyc2VjdGlvblBvaW50OicgKyBhMkludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWdCKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiMUludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZzEua2V5LCBzZWdCLmtleSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGIxSW50ZXJzZWN0aW9uUG9pbnQgJiYgIW91dHB1dC5maW5kKGIxSW50ZXJzZWN0aW9uUG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYjFJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGIxSW50ZXJzZWN0aW9uUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWcxLmtleSwgc2VnQi5rZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoYjFJbnRlcnNlY3Rpb25Qb2ludCwgYjFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGIxSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGIxSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0YXR1cy5yZW1vdmUoZXZlbnQuZGF0YS5zZWdtZW50c1swXSk7XG4gICAgICAgICAgICAvLyBzdGF0dXMucmVtb3ZlKGV2ZW50LmRhdGEuc2VnbWVudHNbMV0pO1xuXG4gICAgICAgICAgICBjdHguYmVmb3JlID0gbnVsbDtcbiAgICAgICAgICAgIC8vIHN0YXR1cy5pbnNlcnQoZXZlbnQuZGF0YS5zZWdtZW50c1sxXSk7XG4gICAgICAgICAgICAvLyBzdGF0dXMuaW5zZXJ0KGV2ZW50LmRhdGEuc2VnbWVudHNbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICB3aW5kb3cuc3RhdHVzID0gc3RhdHVzO1xuICAgIHdpbmRvdy5xdWV1ZSA9IHF1ZXVlO1xuXG4gICAgcmV0dXJuIG91dHB1dC5rZXlzKCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xuIiwidmFyIEVQUyA9IDFFLTk7XHJcblxyXG5mdW5jdGlvbiBVdGlscygpIHt9O1xyXG5cclxuVXRpbHMucHJvdG90eXBlID0ge1xyXG5cclxuICAgIC8qXHJcbiAgICAgICAg0JXRgdC70LggY29tcGFyZUZ1bmN0aW9uKGEsIGIpINC80LXQvdGM0YjQtSAwLCDRgdC+0YDRgtC40YDQvtCy0LrQsCDQv9C+0YHRgtCw0LLQuNGCIGEg0L/QviDQvNC10L3RjNGI0LXQvNGDINC40L3QtNC10LrRgdGDLCDRh9C10LwgYiwg0YLQviDQtdGB0YLRjCwgYSDQuNC00ZHRgiDQv9C10YDQstGL0LwuXHJcbiAgICAgICAg0JXRgdC70LggY29tcGFyZUZ1bmN0aW9uKGEsIGIpINCy0LXRgNC90ZHRgiAwLCDRgdC+0YDRgtC40YDQvtCy0LrQsCDQvtGB0YLQsNCy0LjRgiBhINC4IGIg0L3QtdC40LfQvNC10L3QvdGL0LzQuCDQv9C+INC+0YLQvdC+0YjQtdC90LjRjiDQtNGA0YPQsyDQuiDQtNGA0YPQs9GDLFxyXG4gICAgICAgICAgICDQvdC+INC+0YLRgdC+0YDRgtC40YDRg9C10YIg0LjRhSDQv9C+INC+0YLQvdC+0YjQtdC90LjRjiDQutC+INCy0YHQtdC8INC00YDRg9Cz0LjQvCDRjdC70LXQvNC10L3RgtCw0LwuXHJcbiAgICAgICAgICAgINCe0LHRgNCw0YLQuNGC0LUg0LLQvdC40LzQsNC90LjQtTog0YHRgtCw0L3QtNCw0YDRgiBFQ01Bc2NyaXB0INC90LUg0LPQsNGA0LDQvdGC0LjRgNGD0LXRgiDQtNCw0L3QvdC+0LUg0L/QvtCy0LXQtNC10L3QuNC1LCDQuCDQtdC80YMg0YHQu9C10LTRg9GO0YIg0L3QtSDQstGB0LUg0LHRgNCw0YPQt9C10YDRi1xyXG4gICAgICAgICAgICAo0L3QsNC/0YDQuNC80LXRgCwg0LLQtdGA0YHQuNC4IE1vemlsbGEg0L/QviDQutGA0LDQudC90LXQuSDQvNC10YDQtSwg0LTQviAyMDAzINCz0L7QtNCwKS5cclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LHQvtC70YzRiNC1IDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L7RgdGC0LDQstC40YIgYiDQv9C+INC80LXQvdGM0YjQtdC80YMg0LjQvdC00LXQutGB0YMsINGH0LXQvCBhLlxyXG4gICAgICAgINCk0YPQvdC60YbQuNGPIGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQtNC+0LvQttC90LAg0LLRgdC10LPQtNCwINCy0L7Qt9Cy0YDQsNGJ0LDRgtGMINC+0LTQuNC90LDQutC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUg0LTQu9GPINC+0L/RgNC10LTQtdC70ZHQvdC90L7QuSDQv9Cw0YDRiyDRjdC70LXQvNC10L3RgtC+0LIgYSDQuCBiLlxyXG4gICAgICAgICAgICDQldGB0LvQuCDQsdGD0LTRg9GCINCy0L7Qt9Cy0YDQsNGJ0LDRgtGM0YHRjyDQvdC10L/QvtGB0LvQtdC00L7QstCw0YLQtdC70YzQvdGL0LUg0YDQtdC30YPQu9GM0YLQsNGC0YssINC/0L7RgNGP0LTQvtC6INGB0L7RgNGC0LjRgNC+0LLQutC4INCx0YPQtNC10YIg0L3QtSDQvtC/0YDQtdC00LXQu9GR0L0uXHJcbiAgICAqL1xyXG4gICAgLy8gcG9pbnRzIGNvbXBhcmF0b3JcclxuICAgIGNvbXBhcmVQb2ludHM6IGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMV0sXHJcbiAgICAgICAgICAgIHgyID0gYlswXSxcclxuICAgICAgICAgICAgeTIgPSBiWzFdO1xyXG5cclxuICAgICAgICBpZiAoeDEgPiB4MiB8fCAoeDEgPT09IHgyICYmIHkxID4geTIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeDEgPCB4MiB8fCAoeDEgPT09IHgyICYmIHkxIDwgeTIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHgxID09PSB4MiAmJiB5MSA9PT0geTIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wYXJlU2VnbWVudHMxOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICAgICAgaWYgKHkxIDwgeTMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeTEgPiB5Mykge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBhcmVTZWdtZW50czogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcblxyXG4gICAgICAgIHZhciBjdXJyZW50WCwgICAvLyDRgtC10LrRg9GJ0LjQuSB4INGB0LLQuNC/0LvQsNC50L3QsFxyXG4gICAgICAgICAgICBheSwgICAgICAgICAvLyB5INGC0L7Rh9C60Lgg0L/QtdGA0LXRgdC10YfQtdC90LjRjyDQvtGC0YDQtdC30LrQsCDRgdC+0LHRi9GC0LjRjyBhINGB0L4g0YHQstC40L/Qu9Cw0LnQvdC+0LxcclxuICAgICAgICAgICAgYnksICAgICAgICAgLy8geSDRgtC+0YfQutC4INC/0LXRgNC10YHQtdGH0LXQvdC40Y8g0L7RgtGA0LXQt9C60LAg0YHQvtCx0YvRgtC40Y8gYiDRgdC+INGB0LLQuNC/0LvQsNC50L3QvtC8XHJcbiAgICAgICAgICAgIGRlbHRhWSwgICAgIC8vINGA0LDQt9C90LjRhtCwIHkg0YLQvtGH0LXQuiDQv9C10YDQtdGB0LXRh9C10L3QuNGPXHJcbiAgICAgICAgICAgIGRlbHRhWDEsICAgIC8vINGA0LDQt9C90LjRhtCwIHgg0L3QsNGH0LDQuyDQvtGC0YDQtdC30LrQvtCyXHJcbiAgICAgICAgICAgIGRlbHRhWDI7ICAgIC8vINGA0LDQt9C90LjRhtCwIHgg0LrQvtC90YbQvtCyINC+0YLRgNC10LfQutC+0LJcclxuXHJcbiAgICAgICAgaWYgKGEgPT09IGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJyZW50WCA9IHRoaXMueDtcclxuICAgICAgICBheSA9IGdldFkoYSwgY3VycmVudFgpO1xyXG4gICAgICAgIGJ5ID0gZ2V0WShiLCBjdXJyZW50WCk7XHJcbiAgICAgICAgZGVsdGFZID0gYXkgLSBieTtcclxuXHJcbiAgICAgICAgLy8g0YHRgNCw0LLQvdC10L3QuNC1INC90LDQtNC+INC/0YDQvtCy0L7QtNC40YLRjCDRgSDRjdC/0YHQuNC70L7QvdC+0LwsXHJcbiAgICAgICAgLy8g0LjQvdCw0YfQtSDQstC+0LfQvNC+0LbQvdGLINC+0YjQuNCx0LrQuCDQvtC60YDRg9Cz0LvQtdC90LjRj1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhkZWx0YVkpID4gRVBTKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWx0YVkgPCAwID8gLTEgOiAxO1xyXG4gICAgICAgIC8vINC10YHQu9C4IHkg0L7QsdC10LjRhSDRgdC+0LHRi9GC0LjQuSDRgNCw0LLQvdGLXHJcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0Y/QtdC8INGD0LPQvtC7INC/0YDRj9C80YvRhVxyXG4gICAgICAgIC8vINGH0LXQvCDQutGA0YPRh9C1INC/0YDRj9C80LDRjywg0YLQtdC8INC90LjQttC1INC10LUg0LvQtdCy0YvQuSDQutC+0L3QtdGGLCDQt9C90LDRh9C40YIg0YHQvtCx0YvRgtC40LUg0YDQsNGB0L/QvtC70LDQs9Cw0LXQvCDQvdC40LbQtVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBhU2xvcGUgPSBnZXRTbG9wZShhKSxcclxuICAgICAgICAgICAgICAgIGJTbG9wZSA9IGdldFNsb3BlKGIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFTbG9wZSAhPT0gYlNsb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYVNsb3BlID4gYlNsb3BlID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYVNsb3BlID4gYlNsb3BlID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINC/0L7RgdC70LUg0YHRgNCw0LLQvdC10L3QuNGPINC/0L4geSDQv9C10YDQtdGB0LXRh9C10L3QuNGPINGB0L4g0YHQstC40L/Qu9Cw0LnQvdC+0LxcclxuICAgICAgICAvLyDQuCDRgdGA0LDQstC90LXQvdC40Y8g0YPQutC70L7QvdC+0LJcclxuICAgICAgICAvLyDQvtGB0YLQsNC10YLRgdGPINGB0LvRg9GH0LDQuSwg0LrQvtCz0LTQsCDRg9C60LvQvtC90Ysg0YDQsNCy0L3Ri1xyXG4gICAgICAgIC8vIChpZiBhU2xvcGUgPT09IGJTbG9wZSlcclxuICAgICAgICAvLyDQuCAyINC+0YLRgNC10LfQutCwINC70LXQttCw0YIg0L3QsCDQvtC00L3QvtC5INC/0YDRj9C80L7QuVxyXG4gICAgICAgIC8vINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1XHJcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LjQvCDQv9C+0LvQvtC20LXQvdC40LUg0LrQvtC90YbQvtCyINC+0YLRgNC10LfQutC+0LJcclxuICAgICAgICBkZWx0YVgxID0geDEgLSB4MztcclxuXHJcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LjQvCDQstC30LDQuNC80L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtSDQu9C10LLRi9GFINC60L7QvdGG0L7QslxyXG4gICAgICAgIGlmIChkZWx0YVgxICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWx0YVgxIDwgMCA/IC0xIDogMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC/0YDQvtCy0LXRgNC40Lwg0LLQt9Cw0LjQvNC90L7QtSDQv9C+0LvQvtC20LXQvdC40LUg0L/RgNCw0LLRi9GFINC60L7QvdGG0L7QslxyXG4gICAgICAgIGRlbHRhWDIgPSB4MiAtIHg0O1xyXG5cclxuICAgICAgICBpZiAoZGVsdGFYMiAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVsdGFYMiA8IDAgPyAtMSA6IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQvtGC0YDQtdC30LrQuCDRgdC+0LLQv9Cw0LTQsNGO0YJcclxuICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBhcmVTZWdtZW50czAwOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICAgICAgLy8gZmlyc3QsIGNoZWNrIGxlZnQtZW5kc1xyXG5cclxuICAgICAgICAvLyB2YXIgeCA9IE1hdGgubWF4KE1hdGgubWluKHgxLCB4MiksIE1hdGgubWluKHgzLCB4NCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd4OiAnICsgeCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3kgZnJvbSB4OiAnICsgZ2V0WShiLCB4KSk7XHJcbiAgICAgICAgdmFyIGF5ID0gIGdldFkoYSwgdGhpcy54KTtcclxuICAgICAgICB2YXIgYnkgPSAgZ2V0WShiLCB0aGlzLngpO1xyXG4gICAgICAgIC8vIHJldHVybiBnZXRZKGEsIHgpIDwgZ2V0WShiLCB4KSAtIEVQUztcclxuICAgICAgICAvLyBMLm1hcmtlcihMLmxhdExuZyhbdGhpcy54LCBheV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzEgPiAyJykuYWRkVG8obWFwKTtcclxuICAgICAgICAvLyBMLnBvbHlsaW5lKFtcclxuICAgICAgICAvLyAgICAgTC5sYXRMbmcoW3RoaXMueCwgNTVdLnNsaWNlKCkucmV2ZXJzZSgpKSxcclxuICAgICAgICAvLyAgICAgTC5sYXRMbmcoW3RoaXMueCwgNTddLnNsaWNlKCkucmV2ZXJzZSgpKVxyXG4gICAgICAgIC8vIF0sIHtcclxuICAgICAgICAvLyAgICAgd2VpZ2h0OiAxXHJcbiAgICAgICAgLy8gfSkuYmluZFBvcHVwKCcnICsgdGhpcy54KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIC8vIEwubWFya2VyKEwubGF0TG5nKFt4LCBieV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzIgPiAxJykuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGF5IC0gYnkpID4gRVBTICYmIGF5IDwgYnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoYXkgLSBieSkgPiBFUFMgJiYgYXkgPiBieSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGEubGVmdFBvaW50ID0gYi5sZWZ0UG9pbnRcclxuICAgICAgICAvLyBjaGVjayByaWdodFxyXG5cclxuICAgICAgICB4ID0gTWF0aC5taW4oTWF0aC5tYXgoeDEsIHgyKSwgTWF0aC5tYXgoeDMsIHg0KSk7XHJcbiAgICAgICAgYXkgPSAgZ2V0WShhLCB4KTtcclxuICAgICAgICBieSA9ICBnZXRZKGIsIHgpO1xyXG5cclxuICAgICAgICAvLyBMLm1hcmtlcihMLmxhdExuZyhbdGhpcy54LCBheV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzEgPiAyJykuYWRkVG8obWFwKTtcclxuICAgICAgICBpZiAoTWF0aC5hYnMoYXkgLSBieSkgPiBFUFMgJiYgYXkgPCBieSkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhheSAtIGJ5KSA+IEVQUyAmJiBheSA+IGJ5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcblxyXG5cclxuICAgICAgICAvLyBpZiAoeTEgPCBieSkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmICh5MSA+IGJ5KSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAxO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAwO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcblxyXG4gICAgZmluZEVxdWF0aW9uOiBmdW5jdGlvbiAoc2VnbWVudCkge1xyXG4gICAgICAgIHZhciB4MSA9IHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gc2VnbWVudFswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IHNlZ21lbnRbMV1bMV0sXHJcbiAgICAgICAgICAgIGEgPSB5MSAtIHkyLFxyXG4gICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhhICsgJ3ggKyAnICsgYiArICd5ICsgJyArIGMgKyAnID0gMCcpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBBZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjMxOTgvaG93LWRvLXlvdS1kZXRlY3Qtd2hlcmUtdHdvLWxpbmUtc2VnbWVudHMtaW50ZXJzZWN0LzE5NjgzNDUjMTk2ODM0NVxyXG4gICAgYmV0d2VlbjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcclxuICAgICAgICAvLyB2YXIgZXBzID0gMC4wMDAwMDAxO1xyXG5cclxuICAgICAgICByZXR1cm4gYS1FUFMgPD0gYiAmJiBiIDw9IGMrRVBTO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgICAgIHZhciB4ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgIHZhciB5ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgIGlmIChpc05hTih4KXx8aXNOYU4oeSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDIsIHgsIHgxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeTEgPj0geTIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkyLCB5LCB5MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHgzID49IHg0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4NCwgeCwgeDMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHgzLCB4LCB4NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5MyA+PSB5NCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTQsIHksIHkzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3gsIHldO1xyXG4gICAgfSxcclxuXHJcbiAgICBwb2ludE9uTGluZTogZnVuY3Rpb24gKGxpbmUsIHBvaW50KSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXSxcclxuICAgICAgICAgICAgZW5kID0gbGluZVsxXSxcclxuICAgICAgICAgICAgeDEgPSBiZWdpblswXSxcclxuICAgICAgICAgICAgeTEgPSBiZWdpblsxXSxcclxuICAgICAgICAgICAgeDIgPSBlbmRbMF0sXHJcbiAgICAgICAgICAgIHkyID0gZW5kWzFdLFxyXG4gICAgICAgICAgICB4ID0gcG9pbnRbMF0sXHJcbiAgICAgICAgICAgIHkgPSBwb2ludFsxXTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoeCAtIHgxKSAqICh5MiAtIHkxKSAtICh5IC0geTEpICogKHgyIC0geDEpID09PSAwKSAmJiAoKHggPiB4MSAmJiB4IDwgeDIpIHx8ICh4ID4geDIgJiYgeCA8IHgxKSk7XHJcbiAgICB9LFxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2xvcGUoc2VnbWVudCkge1xyXG4gICAgdmFyIHgxID0gc2VnbWVudFswXVswXSxcclxuICAgICAgICB5MSA9IHNlZ21lbnRbMF1bMV0sXHJcbiAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgIHkyID0gc2VnbWVudFsxXVsxXTtcclxuXHJcbiAgICBpZiAoeDEgPT09IHgyKSB7XHJcbiAgICAgICAgcmV0dXJuICh5MSA8IHkyKSA/IEluZmluaXR5IDogLSBJbmZpbml0eTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICh5MiAtIHkxKSAvICh4MiAtIHgxKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WSAoc2VnbWVudCwgeCkge1xyXG4gICAgdmFyIGJlZ2luID0gc2VnbWVudFswXSxcclxuICAgICAgICBlbmQgPSBzZWdtZW50WzFdLFxyXG4gICAgICAgIHNwYW4gPSBzZWdtZW50WzFdWzBdIC0gc2VnbWVudFswXVswXSxcclxuICAgICAgICBkZWx0YVgwLCAvLyDRgNCw0LfQvdC40YbQsCDQvNC10LbQtNGDIHgg0LggeCDQvdCw0YfQsNC70LAg0L7RgtGA0LXQt9C60LBcclxuICAgICAgICBkZWx0YVgxLCAvLyDRgNCw0LfQvdC40YbQsCDQvNC10LbQtNGDIHgg0LrQvtC90YbQsCDQvtGC0YDQtdC30LrQsCDQuCB4XHJcbiAgICAgICAgaWZhYywgICAgLy8g0L/RgNC+0L/QvtGA0YbQuNGPIGRlbHRhWDAg0Log0L/RgNC+0LXQutGG0LjQuFxyXG4gICAgICAgIGZhYzsgICAgIC8vINC/0YDQvtC/0L7RgNGG0LjRjyBkZWx0YVgxINC6INC/0YDQvtC10LrRhtC40LhcclxuXHJcbiAgICAvLyDQsiDRgdC70YPRh9Cw0LUsINC10YHQu9C4IHgg0L3QtSDQv9C10YDQtdGB0LXQutCw0LXRgtGB0Y8g0YEg0L/RgNC+0LXQutGG0LjQtdC5INC+0YLRgNC10LfQutCwINC90LAg0L7RgdGMIHgsXHJcbiAgICAvLyDQstC+0LfQstGA0YnQsNC10YIgeSDQvdCw0YfQsNC70LAg0LjQu9C4INC60L7QvdGG0LAg0L7RgtGA0LXQt9C60LBcclxuICAgIGlmICh4IDw9IGJlZ2luWzBdKSB7XHJcbiAgICAgICAgcmV0dXJuIGJlZ2luWzFdO1xyXG4gICAgfSBlbHNlIGlmICh4ID49IGVuZFswXSkge1xyXG4gICAgICAgIHJldHVybiBlbmRbMV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LXRgdC70LggeCDQu9C10LbQuNGCINCy0L3Rg9GC0YDQuCDQv9GA0L7QtdC60YbQuNC4INC+0YLRgNC10LfQutCwINC90LAg0L7RgdGMIHhcclxuICAgIC8vINCy0YvRh9C40YHQu9GP0LXRgiDQv9GA0L7Qv9C+0YDRhtC40LhcclxuICAgIGRlbHRhWDAgPSB4IC0gYmVnaW5bMF07XHJcbiAgICBkZWx0YVgxID0gZW5kWzBdIC0geDtcclxuXHJcbiAgICBpZiAoZGVsdGFYMCA+IGRlbHRhWDEpIHtcclxuICAgICAgICBpZmFjID0gZGVsdGFYMCAvIHNwYW5cclxuICAgICAgICBmYWMgPSAxIC0gaWZhYztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmFjID0gZGVsdGFYMSAvIHNwYW5cclxuICAgICAgICBpZmFjID0gMSAtIGZhYztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKGJlZ2luWzFdICogZmFjKSArIChlbmRbMV0gKiBpZmFjKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WTAwKHNlZ21lbnQsIHgpIHtcclxuICAgIHZhciB4MSA9IHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgeTEgPSBzZWdtZW50WzBdWzFdLFxyXG4gICAgICAgIHgyID0gc2VnbWVudFsxXVswXSxcclxuICAgICAgICB5MiA9IHNlZ21lbnRbMV1bMV07XHJcblxyXG4gICAgLy8g0LXRgdC70Lgg0L7RgtGA0LXQt9C+0Log0LPQvtGA0LjQt9C+0L3RgtCw0LvQtdC9LFxyXG4gICAgLy8g0LLQtdGA0L3QtdC8INC/0YDQvtGB0YLQviB5INC/0YDQsNCy0L7Qs9C+INC60L7QvdGG0LBcclxuICAgIGlmIChNYXRoLmFicyh4MiAtIHgxKSA8IEVQUykge1xyXG4gICAgICAgIHJldHVybiB5MTtcclxuICAgIH1cclxuICAgIC8vINCyINC+0YHRgtCw0LvRjNC90YvRhSDRgdC70YPRh9Cw0Y/RhVxyXG4gICAgLy8g0LHQtdGA0LXQvCDQv9GA0L7Qv9C+0YDRhtC40Y5cclxuICAgIHJldHVybiB5MSArICh5MiAtIHkxKSAqICh4IC0geDEpIC8gKHgyIC0geDEpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBVdGlscztcclxuIl19
