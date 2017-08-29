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
        x: null
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

            // if (!segA && segB && status.next(status.next(segE))) {
            //     segB = status.next(status.next(segE));
            // }
            // if (segA && !segB && status.prev(status.prev(segE))) {
            //     segA = status.prev(status.prev(segE));
            // }

            // console.log('segA:');
            // console.log(segA && segA.key.toString());
            //
            // console.log('segE below:');
            // console.log(segE.below && segE.below.key.toString());
            //
            // console.log('segB:');
            // console.log(segB && segB.key.toString());
            //
            // console.log('segE above:');
            // console.log(segE.above && segE.above.key.toString());

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
            //             Let segE1 above segE2 be E's intersecting segments in SL;
            // status.remove(event.data.segments[0]);
            // status.remove(event.data.segments[1]);
            // status.insert(event.data.segments[0]);
            // status.insert(event.data.segments[1]);

            // status.find() возвращает одну и ту же ноду

            var seg1 = status.find(event.data.segments[0]),
                seg2 = status.prev(seg1);

            var tempRight = seg1.right;
            seg1.right = seg2;
            seg1.left = tempRight;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXHN3ZWVwbGluZS5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFPLE9BQVAsR0FBaUIsQ0FDYixDQUFDLENBQUMsZ0JBQUQsRUFBa0IsaUJBQWxCLENBQUQsRUFBc0MsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBdEMsQ0FEYSxFQUViLENBQUMsQ0FBQyxrQkFBRCxFQUFvQixpQkFBcEIsQ0FBRCxFQUF3QyxDQUFDLGlCQUFELEVBQW1CLGlCQUFuQixDQUF4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFOYSxDQUFqQjs7O0FDQUEsSUFBSSxvQkFBb0IsUUFBUSxhQUFSLENBQXhCO0FBQ0EsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxNQUFNLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJDLEVBQXlDLFNBQVMsRUFBbEQsRUFBakIsQ0FMVjtBQUFBLElBTUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FOWDs7QUFRQSxPQUFPLEdBQVAsR0FBYSxHQUFiOztBQUVBLElBQUksU0FBUyxJQUFJLFNBQUosRUFBYjtBQUFBLElBQ0ksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FEMUI7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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dEI7QUFDUDtBQTVMYSxDQUFsQjs7QUErTEEsU0FBUyxJQUFULENBQWMsT0FBZCxFQUF1QixDQUF2QixFQUEwQjtBQUN0QixRQUFJLEtBQUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFUO0FBQUEsUUFDSSxLQUFLLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FEVDtBQUFBLFFBRUksS0FBSyxRQUFRLENBQVIsRUFBVyxDQUFYLENBRlQ7QUFBQSxRQUdJLEtBQUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUhUOztBQUtBO0FBQ0E7QUFDQSxRQUFJLEtBQUssR0FBTCxDQUFTLEtBQUssRUFBZCxJQUFvQixHQUF4QixFQUE2QjtBQUN6QixlQUFPLEVBQVA7QUFDSDtBQUNEO0FBQ0E7QUFDQSxXQUFPLEtBQUssQ0FBQyxLQUFLLEVBQU4sS0FBYSxJQUFJLEVBQWpCLEtBQXdCLEtBQUssRUFBN0IsQ0FBWjtBQUNIOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFJLEtBQUosRUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAgW1szNy41MTUyMDY5MzAwNTkxLDU1LjgwNDUwODg3MDY1MTg2XSxbMzcuNzI4MjcxNjcwMDk0NjcsNTUuNjgyNzE4Nzg5NjA5NTFdXSxcbiAgICBbWzM3LjUyNzQ2NDI0OTEzNzgxNSw1NS43NzAyMzM0ODI2MTY1NV0sWzM3LjUyODQwNjM0NjY5MDU5LDU1Ljg0NDg2MDAwNTEyNDA0XV1cblxuICAgIC8vIFtbMzcuNTMyMjc5MDc0MTQ4MjM1LDU1LjgwNTk4MTU5MjExMTg4NF0sWzM3LjY0MDk4NzAxNDAwMjE4LDU1LjcwNjQ4NjU1NjA0NzAxXV0sXG4gICAgLy8gW1szNy41NjU1MDUxNjk0MDY1ODUsNTUuNzEzNjY4NjQ3NDc2NjFdLFszNy42ODQxOTMyNDA1MjAxNCw1NS44MDEyNzc5NzYxMjc3NV1dLFxuICAgIC8vIFtbMzcuNjA5OTA2ODg2ODY2MDM1LDU1LjczMTMzNDk0MTA3MjY4XSxbMzcuNjQyNDQ1ODYyNDI5NzgsNTUuNzM4MDc3Mzc2NjIzNjldXVxuXTtcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvaW5kZXguanMnKTtcblxudmFyIG9zbSA9IEwudGlsZUxheWVyKCdodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9ub2xhYmVscy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgIG1heFpvb206IDIyLFxuICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAub3JnXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPidcbiAgICB9KSxcbiAgICBwb2ludCA9IEwubGF0TG5nKFs1NS43NTMyMTAsIDM3LjYyMTc2Nl0pLFxuICAgIG1hcCA9IG5ldyBMLk1hcCgnbWFwJywge2xheWVyczogW29zbV0sIGNlbnRlcjogcG9pbnQsIHpvb206IDExLCBtYXhab29tOiAyMn0pLFxuICAgIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xuXG53aW5kb3cubWFwID0gbWFwO1xuXG52YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpLFxuICAgIG4gPSBib3VuZHMuX25vcnRoRWFzdC5sYXQsXG4gICAgZSA9IGJvdW5kcy5fbm9ydGhFYXN0LmxuZyxcbiAgICBzID0gYm91bmRzLl9zb3V0aFdlc3QubGF0LFxuICAgIHcgPSBib3VuZHMuX3NvdXRoV2VzdC5sbmcsXG4gICAgaGVpZ2h0ID0gbiAtIHMsXG4gICAgd2lkdGggPSBlIC0gdyxcbiAgICBxSGVpZ2h0ID0gaGVpZ2h0IC8gNCxcbiAgICBxV2lkdGggPSB3aWR0aCAvIDQsXG4gICAgbGluZXMgPSBbXTtcblxudmFyIHBvaW50cyA9IHR1cmYucmFuZG9tKCdwb2ludHMnLCA4LCB7XG4gICAgYmJveDogW3cgKyBxV2lkdGgsIHMgKyBxSGVpZ2h0LCBlIC0gcVdpZHRoLCBuIC0gcUhlaWdodF1cbn0pO1xuXG52YXIgY29vcmRzID0gcG9pbnRzLmZlYXR1cmVzLm1hcChmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG59KVxuXG5mb3IgKHZhciBpID0gMDsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrPTIpIHtcbiAgICBsaW5lcy5wdXNoKFtjb29yZHNbaV0sIGNvb3Jkc1tpKzFdXSk7XG59XG5cbi8vIGRyYXdMaW5lcyhsaW5lcyk7XG5kcmF3TGluZXMoZGF0YSk7XG5cbi8vIHZhciBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGxpbmVzLCBtYXApO1xudmFyIHBzID0gZmluZEludGVyc2VjdGlvbnMoZGF0YSwgbWFwKTtcblxucHMuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpLCB7cmFkaXVzOiA1LCBjb2xvcjogJ2JsdWUnLCBmaWxsQ29sb3I6ICdibHVlJ30pLmFkZFRvKG1hcCk7XG59KVxuXG5mdW5jdGlvbiBkcmF3TGluZXMoYXJyYXkpIHtcbiAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgIHZhciBiZWdpbiA9IGxpbmVbMF0sXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdO1xuXG4gICAgICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGJlZ2luKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoZW5kKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcbiAgICAgICAgTC5wb2x5bGluZShbYmVnaW4sIGVuZF0sIHt3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xuICAgIH0pO1xufVxuXG4vLyBjb25zb2xlLmxvZyhwcyk7XG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuL3NyYy9zd2VlcGxpbmUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW50ZXJzZWN0aW9ucztcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5hdmwgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUHJpbnRzIHRyZWUgaG9yaXpvbnRhbGx5XG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHByaW50IChyb290LCBwcmludE5vZGUpIHtcbiAgaWYgKCBwcmludE5vZGUgPT09IHZvaWQgMCApIHByaW50Tm9kZSA9IGZ1bmN0aW9uIChuKSB7IHJldHVybiBuLmtleTsgfTtcblxuICB2YXIgb3V0ID0gW107XG4gIHJvdyhyb290LCAnJywgdHJ1ZSwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG91dC5wdXNoKHYpOyB9LCBwcmludE5vZGUpO1xuICByZXR1cm4gb3V0LmpvaW4oJycpO1xufVxuXG4vKipcbiAqIFByaW50cyBsZXZlbCBvZiB0aGUgdHJlZVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgIHByZWZpeFxuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICBpc1RhaWxcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKGluOnN0cmluZyk6dm9pZH0gICAgb3V0XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gIHByaW50Tm9kZVxuICovXG5mdW5jdGlvbiByb3cgKHJvb3QsIHByZWZpeCwgaXNUYWlsLCBvdXQsIHByaW50Tm9kZSkge1xuICBpZiAocm9vdCkge1xuICAgIG91dCgoXCJcIiArIHByZWZpeCArIChpc1RhaWwgPyAn4pSU4pSA4pSAICcgOiAn4pSc4pSA4pSAICcpICsgKHByaW50Tm9kZShyb290KSkgKyBcIlxcblwiKSk7XG4gICAgdmFyIGluZGVudCA9IHByZWZpeCArIChpc1RhaWwgPyAnICAgICcgOiAn4pSCICAgJyk7XG4gICAgaWYgKHJvb3QubGVmdCkgIHsgcm93KHJvb3QubGVmdCwgIGluZGVudCwgZmFsc2UsIG91dCwgcHJpbnROb2RlKTsgfVxuICAgIGlmIChyb290LnJpZ2h0KSB7IHJvdyhyb290LnJpZ2h0LCBpbmRlbnQsIHRydWUsICBvdXQsIHByaW50Tm9kZSk7IH1cbiAgfVxufVxuXG5cbi8qKlxuICogSXMgdGhlIHRyZWUgYmFsYW5jZWQgKG5vbmUgb2YgdGhlIHN1YnRyZWVzIGRpZmZlciBpbiBoZWlnaHQgYnkgbW9yZSB0aGFuIDEpXG4gKiBAcGFyYW0gIHtOb2RlfSAgICByb290XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0JhbGFuY2VkKHJvb3QpIHtcbiAgaWYgKHJvb3QgPT09IG51bGwpIHsgcmV0dXJuIHRydWU7IH0gLy8gSWYgbm9kZSBpcyBlbXB0eSB0aGVuIHJldHVybiB0cnVlXG5cbiAgLy8gR2V0IHRoZSBoZWlnaHQgb2YgbGVmdCBhbmQgcmlnaHQgc3ViIHRyZWVzXG4gIHZhciBsaCA9IGhlaWdodChyb290LmxlZnQpO1xuICB2YXIgcmggPSBoZWlnaHQocm9vdC5yaWdodCk7XG5cbiAgaWYgKE1hdGguYWJzKGxoIC0gcmgpIDw9IDEgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5sZWZ0KSAgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5yaWdodCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAvLyBJZiB3ZSByZWFjaCBoZXJlIHRoZW4gdHJlZSBpcyBub3QgaGVpZ2h0LWJhbGFuY2VkXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gQ29tcHV0ZSB0aGUgJ2hlaWdodCcgb2YgYSB0cmVlLlxuICogSGVpZ2h0IGlzIHRoZSBudW1iZXIgb2Ygbm9kZXMgYWxvbmcgdGhlIGxvbmdlc3QgcGF0aFxuICogZnJvbSB0aGUgcm9vdCBub2RlIGRvd24gdG8gdGhlIGZhcnRoZXN0IGxlYWYgbm9kZS5cbiAqXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGhlaWdodChub2RlKSB7XG4gIHJldHVybiBub2RlID8gKDEgKyBNYXRoLm1heChoZWlnaHQobm9kZS5sZWZ0KSwgaGVpZ2h0KG5vZGUucmlnaHQpKSkgOiAwO1xufVxuXG4vLyBmdW5jdGlvbiBjcmVhdGVOb2RlIChwYXJlbnQsIGxlZnQsIHJpZ2h0LCBoZWlnaHQsIGtleSwgZGF0YSkge1xuLy8gICByZXR1cm4geyBwYXJlbnQsIGxlZnQsIHJpZ2h0LCBiYWxhbmNlRmFjdG9yOiBoZWlnaHQsIGtleSwgZGF0YSB9O1xuLy8gfVxuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIHBhcmVudDogICAgICAgID9Ob2RlLFxuICogICBsZWZ0OiAgICAgICAgICA/Tm9kZSxcbiAqICAgcmlnaHQ6ICAgICAgICAgP05vZGUsXG4gKiAgIGJhbGFuY2VGYWN0b3I6IG51bWJlcixcbiAqICAga2V5OiAgICAgICAgICAgS2V5LFxuICogICBkYXRhOiAgICAgICAgICBWYWx1ZVxuICogfX0gTm9kZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeyp9IEtleVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeyp9IFZhbHVlXG4gKi9cblxuLyoqXG4gKiBEZWZhdWx0IGNvbXBhcmlzb24gZnVuY3Rpb25cbiAqIEBwYXJhbSB7S2V5fSBhXG4gKiBAcGFyYW0ge0tleX0gYlxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gREVGQVVMVF9DT01QQVJFIChhLCBiKSB7IHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDsgfVxuXG5cbi8qKlxuICogU2luZ2xlIGxlZnQgcm90YXRpb25cbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZUxlZnQgKG5vZGUpIHtcbiAgdmFyIHJpZ2h0Tm9kZSA9IG5vZGUucmlnaHQ7XG4gIG5vZGUucmlnaHQgICAgPSByaWdodE5vZGUubGVmdDtcblxuICBpZiAocmlnaHROb2RlLmxlZnQpIHsgcmlnaHROb2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIHJpZ2h0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAocmlnaHROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LmxlZnQgPSByaWdodE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQucmlnaHQgPSByaWdodE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSByaWdodE5vZGU7XG4gIHJpZ2h0Tm9kZS5sZWZ0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSByaWdodE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG4gIHJldHVybiByaWdodE5vZGU7XG59XG5cblxuZnVuY3Rpb24gcm90YXRlUmlnaHQgKG5vZGUpIHtcbiAgdmFyIGxlZnROb2RlID0gbm9kZS5sZWZ0O1xuICBub2RlLmxlZnQgPSBsZWZ0Tm9kZS5yaWdodDtcbiAgaWYgKG5vZGUubGVmdCkgeyBub2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIGxlZnROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAobGVmdE5vZGUucGFyZW50KSB7XG4gICAgaWYgKGxlZnROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9IGxlZnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQucmlnaHQgPSBsZWZ0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IGxlZnROb2RlO1xuICBsZWZ0Tm9kZS5yaWdodCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmV0dXJuIGxlZnROb2RlO1xufVxuXG5cbi8vIGZ1bmN0aW9uIGxlZnRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHJvdGF0ZUxlZnQobm9kZS5sZWZ0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZVJpZ2h0KG5vZGUpO1xuLy8gfVxuXG5cbi8vIGZ1bmN0aW9uIHJpZ2h0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSByb3RhdGVSaWdodChub2RlLnJpZ2h0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZUxlZnQobm9kZSk7XG4vLyB9XG5cblxudmFyIEFWTFRyZWUgPSBmdW5jdGlvbiBBVkxUcmVlIChjb21wYXJhdG9yLCBub0R1cGxpY2F0ZXMpIHtcbiAgaWYgKCBub0R1cGxpY2F0ZXMgPT09IHZvaWQgMCApIG5vRHVwbGljYXRlcyA9IGZhbHNlO1xuXG4gIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yIHx8IERFRkFVTFRfQ09NUEFSRTtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG4gIHRoaXMuX3NpemUgPSAwO1xuICB0aGlzLl9ub0R1cGxpY2F0ZXMgPSAhIW5vRHVwbGljYXRlcztcbn07XG5cbnZhciBwcm90b3R5cGVBY2Nlc3NvcnMgPSB7IHNpemU6IHt9IH07XG5cblxuLyoqXG4gKiBDbGVhciB0aGUgdHJlZVxuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICB0aGlzLl9yb290ID0gbnVsbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE51bWJlciBvZiBub2Rlc1xuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5wcm90b3R5cGVBY2Nlc3NvcnMuc2l6ZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9zaXplO1xufTtcblxuXG4vKipcbiAqIFdoZXRoZXIgdGhlIHRyZWUgY29udGFpbnMgYSBub2RlIHdpdGggdGhlIGdpdmVuIGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlL2ZhbHNlXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMgKGtleSkge1xuICBpZiAodGhpcy5fcm9vdCl7XG4gICAgdmFyIG5vZGUgICAgID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gICAgd2hpbGUgKG5vZGUpe1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3Ioa2V5LCBub2RlLmtleSk7XG4gICAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cbi8qKlxuICogU3VjY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIG5leHQgKG5vZGUpIHtcbiAgdmFyIHN1Y2Nlc3NvciA9IG5vZGU7XG4gIGlmIChzdWNjZXNzb3IpIHtcbiAgICBpZiAoc3VjY2Vzc29yLnJpZ2h0KSB7XG4gICAgICBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucmlnaHQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5sZWZ0KSB7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5sZWZ0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2Nlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IucmlnaHQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHN1Y2Nlc3Nvcjsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN1Y2Nlc3Nvcjtcbn07XG5cblxuLyoqXG4gKiBQcmVkZWNlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiBwcmV2IChub2RlKSB7XG4gIHZhciBwcmVkZWNlc3NvciA9IG5vZGU7XG4gIGlmIChwcmVkZWNlc3Nvcikge1xuICAgIGlmIChwcmVkZWNlc3Nvci5sZWZ0KSB7XG4gICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLmxlZnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IucmlnaHQpIHsgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5yaWdodDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmVkZWNlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLmxlZnQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHByZWRlY2Vzc29yO1xuICAgICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByZWRlY2Vzc29yO1xufTtcbi8qIGVzbGludC1lbmFibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGZvckVhY2hcbiAqIEBjYWxsYmFjayBmb3JFYWNoQ2FsbGJhY2tcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gKi9cblxuLyoqXG4gKiBAcGFyYW17Zm9yRWFjaENhbGxiYWNrfSBjYWxsYmFja1xuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2ggKGNhbGxiYWNrKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgZG9uZSA9IGZhbHNlLCBpID0gMDtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICAvLyBSZWFjaCB0aGUgbGVmdCBtb3N0IE5vZGUgb2YgdGhlIGN1cnJlbnQgTm9kZVxuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICAvLyBQbGFjZSBwb2ludGVyIHRvIGEgdHJlZSBub2RlIG9uIHRoZSBzdGFja1xuICAgICAgLy8gYmVmb3JlIHRyYXZlcnNpbmcgdGhlIG5vZGUncyBsZWZ0IHN1YnRyZWVcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJhY2tUcmFjayBmcm9tIHRoZSBlbXB0eSBzdWJ0cmVlIGFuZCB2aXNpdCB0aGUgTm9kZVxuICAgICAgLy8gYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2s7IGhvd2V2ZXIsIGlmIHRoZSBzdGFjayBpc1xuICAgICAgLy8gZW1wdHkgeW91IGFyZSBkb25lXG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICBjYWxsYmFjayhjdXJyZW50LCBpKyspO1xuXG4gICAgICAgIC8vIFdlIGhhdmUgdmlzaXRlZCB0aGUgbm9kZSBhbmQgaXRzIGxlZnRcbiAgICAgICAgLy8gc3VidHJlZS4gTm93LCBpdCdzIHJpZ2h0IHN1YnRyZWUncyB0dXJuXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBhbGwga2V5cyBpbiBvcmRlclxuICogQHJldHVybiB7QXJyYXk8S2V5Pn1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uIGtleXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5rZXkpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYGRhdGFgIGZpZWxkcyBvZiBhbGwgbm9kZXMgaW4gb3JkZXIuXG4gKiBAcmV0dXJuIHtBcnJheTxWYWx1ZT59XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmRhdGEpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSBhdCBnaXZlbiBpbmRleFxuICogQHBhcmFte251bWJlcn0gaW5kZXhcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIGF0IChpbmRleCkge1xuICAvLyByZW1vdmVkIGFmdGVyIGEgY29uc2lkZXJhdGlvbiwgbW9yZSBtaXNsZWFkaW5nIHRoYW4gdXNlZnVsXG4gIC8vIGluZGV4ID0gaW5kZXggJSB0aGlzLnNpemU7XG4gIC8vIGlmIChpbmRleCA8IDApIGluZGV4ID0gdGhpcy5zaXplIC0gaW5kZXg7XG5cbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCBkb25lID0gZmFsc2UsIGkgPSAwO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICBpZiAoaSA9PT0gaW5kZXgpIHsgcmV0dXJuIGN1cnJlbnQ7IH1cbiAgICAgICAgaSsrO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtaW5pbXVtIGtleVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm1pbk5vZGUgPSBmdW5jdGlvbiBtaW5Ob2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtYXgga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubWF4Tm9kZSA9IGZ1bmN0aW9uIG1heE5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBNaW4ga2V5XG4gKiBAcmV0dXJuIHs/S2V5fVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiBtaW4gKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuXG4vKipcbiAqIE1heCBrZXlcbiAqIEByZXR1cm4gez9LZXl9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uIG1heCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cblxuLyoqXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlL2ZhbHNlXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5ICgpIHtcbiAgcmV0dXJuICF0aGlzLl9yb290O1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG5vZGUgd2l0aCBzbWFsbGVzdCBrZXlcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiBwb3AgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3QsIHJldHVyblZhbHVlID0gbnVsbDtcbiAgaWYgKG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICByZXR1cm5WYWx1ZSA9IHsga2V5OiBub2RlLmtleSwgZGF0YTogbm9kZS5kYXRhIH07XG4gICAgdGhpcy5yZW1vdmUobm9kZS5rZXkpO1xuICB9XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBGaW5kIG5vZGUgYnkga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gZmluZCAoa2V5KSB7XG4gIHZhciByb290ID0gdGhpcy5fcm9vdDtcbiAgLy8gaWYgKHJvb3QgPT09IG51bGwpICByZXR1cm4gbnVsbDtcbiAgLy8gaWYgKGtleSA9PT0gcm9vdC5rZXkpIHJldHVybiByb290O1xuXG4gIHZhciBzdWJ0cmVlID0gcm9vdCwgY21wO1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHdoaWxlIChzdWJ0cmVlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIHN1YnRyZWUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBzdWJ0cmVlOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBzdWJ0cmVlID0gc3VidHJlZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBzdWJ0cmVlID0gc3VidHJlZS5yaWdodDsgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5cbi8qKlxuICogSW5zZXJ0IGEgbm9kZSBpbnRvIHRoZSB0cmVlXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEBwYXJhbXtWYWx1ZX0gW2RhdGFdXG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0IChrZXksIGRhdGEpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHtcbiAgICB0aGlzLl9yb290ID0ge1xuICAgICAgcGFyZW50OiBudWxsLCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICAgIGtleToga2V5LCBkYXRhOiBkYXRhXG4gICAgfTtcbiAgICB0aGlzLl9zaXplKys7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gIH1cblxuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHZhciBub2RlICA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBwYXJlbnQ9IG51bGw7XG4gIHZhciBjbXAgICA9IDA7XG5cbiAgaWYgKHRoaXMuX25vRHVwbGljYXRlcykge1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgICAgcGFyZW50ID0gbm9kZTtcbiAgICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICAgIHBhcmVudCA9IG5vZGU7XG4gICAgICBpZiAgICAoY21wIDw9IDApeyBub2RlID0gbm9kZS5sZWZ0OyB9IC8vcmV0dXJuIG51bGw7XG4gICAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gICAgfVxuICB9XG5cbiAgdmFyIG5ld05vZGUgPSB7XG4gICAgbGVmdDogbnVsbCxcbiAgICByaWdodDogbnVsbCxcbiAgICBiYWxhbmNlRmFjdG9yOiAwLFxuICAgIHBhcmVudDogcGFyZW50LCBrZXk6IGtleSwgZGF0YTogZGF0YVxuICB9O1xuICB2YXIgbmV3Um9vdDtcbiAgaWYgKGNtcCA8PSAwKSB7IHBhcmVudC5sZWZ0PSBuZXdOb2RlOyB9XG4gIGVsc2UgICAgICAgeyBwYXJlbnQucmlnaHQgPSBuZXdOb2RlOyB9XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGNtcCA9IGNvbXBhcmUocGFyZW50LmtleSwga2V5KTtcbiAgICBpZiAoY21wIDwgMCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy8gaW5saW5lZFxuICAgICAgLy92YXIgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gaW5saW5lZFxuICAgICAgLy8gdmFyIG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICBuZXdSb290ID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgdGhpcy5fc2l6ZSsrO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBub2RlIGZyb20gdGhlIHRyZWUuIElmIG5vdCBmb3VuZCwgcmV0dXJucyBudWxsLlxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrZXkpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgdmFyIGNtcCA9IDA7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmFyIHJldHVyblZhbHVlID0gbm9kZS5rZXk7XG4gIHZhciBtYXgsIG1pbjtcblxuICBpZiAobm9kZS5sZWZ0KSB7XG4gICAgbWF4ID0gbm9kZS5sZWZ0O1xuXG4gICAgd2hpbGUgKG1heC5sZWZ0IHx8IG1heC5yaWdodCkge1xuICAgICAgd2hpbGUgKG1heC5yaWdodCkgeyBtYXggPSBtYXgucmlnaHQ7IH1cblxuICAgICAgbm9kZS5rZXkgPSBtYXgua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgICBpZiAobWF4LmxlZnQpIHtcbiAgICAgICAgbm9kZSA9IG1heDtcbiAgICAgICAgbWF4ID0gbWF4LmxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1heC5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgbm9kZSA9IG1heDtcbiAgfVxuXG4gIGlmIChub2RlLnJpZ2h0KSB7XG4gICAgbWluID0gbm9kZS5yaWdodDtcblxuICAgIHdoaWxlIChtaW4ubGVmdCB8fCBtaW4ucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtaW4ubGVmdCkgeyBtaW4gPSBtaW4ubGVmdDsgfVxuXG4gICAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgICAgaWYgKG1pbi5yaWdodCkge1xuICAgICAgICBub2RlID0gbWluO1xuICAgICAgICBtaW4gPSBtaW4ucmlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgbm9kZSA9IG1pbjtcbiAgfVxuXG4gIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgdmFyIHBwICAgPSBub2RlO1xuICB2YXIgbmV3Um9vdDtcblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKHBhcmVudC5sZWZ0ID09PSBwcCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy8gaW5saW5lZFxuICAgICAgLy92YXIgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290O1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBpbmxpbmVkXG4gICAgICAvLyB2YXIgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIG5ld1Jvb3QgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdDtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IC0xIHx8IHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IGJyZWFrOyB9XG5cbiAgICBwcCAgID0gcGFyZW50O1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkgeyBub2RlLnBhcmVudC5sZWZ0PSBudWxsOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICB7IG5vZGUucGFyZW50LnJpZ2h0ID0gbnVsbDsgfVxuICB9XG5cbiAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHsgdGhpcy5fcm9vdCA9IG51bGw7IH1cblxuICB0aGlzLl9zaXplLS07XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBCdWxrLWxvYWQgaXRlbXNcbiAqIEBwYXJhbXtBcnJheTxLZXk+fWtleXNcbiAqIEBwYXJhbXtBcnJheTxWYWx1ZT59W3ZhbHVlc11cbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiBsb2FkIChrZXlzLCB2YWx1ZXMpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcbiAgICBpZiAoIGtleXMgPT09IHZvaWQgMCApIGtleXMgPSBbXTtcbiAgICBpZiAoIHZhbHVlcyA9PT0gdm9pZCAwICkgdmFsdWVzID0gW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoa2V5cykpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGhpcyQxLmluc2VydChrZXlzW2ldLCB2YWx1ZXNbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRyZWUgaXMgYmFsYW5jZWRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmlzQmFsYW5jZWQgPSBmdW5jdGlvbiBpc0JhbGFuY2VkJDEgKCkge1xuICByZXR1cm4gaXNCYWxhbmNlZCh0aGlzLl9yb290KTtcbn07XG5cblxuLyoqXG4gKiBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyZWUgLSBwcmltaXRpdmUgaG9yaXpvbnRhbCBwcmludC1vdXRcbiAqIEBwYXJhbXtGdW5jdGlvbihOb2RlKTpzdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKHByaW50Tm9kZSkge1xuICByZXR1cm4gcHJpbnQodGhpcy5fcm9vdCwgcHJpbnROb2RlKTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBBVkxUcmVlLnByb3RvdHlwZSwgcHJvdG90eXBlQWNjZXNzb3JzICk7XG5cbnJldHVybiBBVkxUcmVlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXZsLmpzLm1hcFxuIiwidmFyIFRyZWUgPSByZXF1aXJlKCdhdmwnKSxcbiAgICB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50cyBzZXQgb2Ygc2VnbWVudHMgaW50ZXJzZWN0aW5nIHN3ZWVwbGluZSBbW1t4MSwgeTFdLCBbeDIsIHkyXV0gLi4uIFtbeG0sIHltXSwgW3huLCB5bl1dXVxuICovXG5cbmZ1bmN0aW9uIGZpbmRJbnRlcnNlY3Rpb25zKHNlZ21lbnRzLCBtYXApIHtcbiAgICB2YXIgY3R4ID0ge1xuICAgICAgICB4OiBudWxsXG4gICAgfTtcblxuICAgIHZhciBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpLFxuICAgICAgICBzdGF0dXMgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlU2VnbWVudHMuYmluZChjdHgpKSxcbiAgICAgICAgb3V0cHV0ID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVBvaW50cyk7XG5cbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50KSB7XG4gICAgICAgIHNlZ21lbnQuc29ydCh1dGlscy5jb21wYXJlUG9pbnRzKTtcbiAgICAgICAgdmFyIGJlZ2luID0gc2VnbWVudFswXSxcbiAgICAgICAgICAgIGVuZCA9IHNlZ21lbnRbMV0sXG4gICAgICAgICAgICBiZWdpbkRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcG9pbnQ6IGJlZ2luLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdiZWdpbicsXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuZERhdGEgPSB7XG4gICAgICAgICAgICAgICAgcG9pbnQ6IGVuZCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZW5kJyxcbiAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICBxdWV1ZS5pbnNlcnQoYmVnaW4sIGJlZ2luRGF0YSk7XG4gICAgICAgIHF1ZXVlLmluc2VydChlbmQsIGVuZERhdGEpO1xuICAgIH0pO1xuXG4gICAgdmFyIGkgPSAwO1xuXG5cblxuICAgIHdoaWxlICghcXVldWUuaXNFbXB0eSgpKSB7XG4gICAgICAgIHZhciBldmVudCA9IHF1ZXVlLnBvcCgpO1xuICAgICAgICB2YXIgcCA9IGV2ZW50LmRhdGEucG9pbnQ7XG5cbiAgICAgICAgY3R4LnggPSBwWzBdO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGkgKyAnKSBjdXJyZW50IHBvaW50OiAnICsgZXZlbnQuZGF0YS5wb2ludC50b1N0cmluZygpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJyAgIHBvaW50IHR5cGU6ICcgKyBldmVudC5kYXRhLnR5cGUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnICAgcXVldWU6ICcgKyBxdWV1ZS50b1N0cmluZygpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJyAgIHN0YXR1czogJyArIHN0YXR1cy50b1N0cmluZygpKTtcblxuICAgICAgICB2YXIga2V5cyA9IHN0YXR1cy5rZXlzKCk7XG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSBrZXlzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgIHZhciBtbiA9IHN0YXR1cy5tYXhOb2RlKCk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvdW50ZXIgKyAnOiAnICsgbW4ua2V5LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICB3aGlsZShzdGF0dXMucHJldihtbikpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygtLWNvdW50ZXIgKyAnOiAnICsgc3RhdHVzLnByZXYobW4pLmtleS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBtbiA9IHN0YXR1cy5wcmV2KG1uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnYmVnaW4nKSB7XG5cbiAgICAgICAgICAgIHZhciBsbCA9IEwubGF0TG5nKFtwWzFdLCBwWzBdXSk7XG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAnZ3JlZW4nLCBmaWxsQ29sb3I6ICdncmVlbid9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgICAgICB2YXIgc2VnbWVudERhdGEgPSB7XG4gICAgICAgICAgICAgICAgYWJvdmU6IG51bGwsXG4gICAgICAgICAgICAgICAgYmVsb3c6IG51bGxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhdHVzLmluc2VydChldmVudC5kYXRhLnNlZ21lbnQpO1xuICAgICAgICAgICAgdmFyIHNlZ0UgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnQpO1xuXG4gICAgICAgICAgICB2YXIgbGxzID0gc2VnRS5rZXkubWFwKGZ1bmN0aW9uKHApe3JldHVybiBMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKX0pO1xuICAgICAgICAgICAgdmFyIGxpbmUgPSBMLnBvbHlsaW5lKGxscywge2NvbG9yOiAnZ3JlZW4nfSkuYWRkVG8obWFwKTtcblxuICAgICAgICAgICAgbGluZS5iaW5kUG9wdXAoJ2FkZGVkJyArIGkpO1xuXG4gICAgICAgICAgICB2YXIgc2VnQSA9IHN0YXR1cy5wcmV2KHNlZ0UpO1xuICAgICAgICAgICAgdmFyIHNlZ0IgPSBzdGF0dXMubmV4dChzZWdFKTtcblxuICAgICAgICAgICAgLy8gaWYgKCFzZWdBICYmIHNlZ0IgJiYgc3RhdHVzLm5leHQoc3RhdHVzLm5leHQoc2VnRSkpKSB7XG4gICAgICAgICAgICAvLyAgICAgc2VnQiA9IHN0YXR1cy5uZXh0KHN0YXR1cy5uZXh0KHNlZ0UpKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGlmIChzZWdBICYmICFzZWdCICYmIHN0YXR1cy5wcmV2KHN0YXR1cy5wcmV2KHNlZ0UpKSkge1xuICAgICAgICAgICAgLy8gICAgIHNlZ0EgPSBzdGF0dXMucHJldihzdGF0dXMucHJldihzZWdFKSk7XG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzZWdBOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2VnQSAmJiBzZWdBLmtleS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc2VnRSBiZWxvdzonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNlZ0UuYmVsb3cgJiYgc2VnRS5iZWxvdy5rZXkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3NlZ0I6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWdCICYmIHNlZ0Iua2V5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzZWdFIGFib3ZlOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2VnRS5hYm92ZSAmJiBzZWdFLmFib3ZlLmtleS50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgaWYgKHNlZ0IpIHtcbiAgICAgICAgICAgICAgIHNlZ0UuYWJvdmUgPSBzZWdCO1xuICAgICAgICAgICAgICAgc2VnRS5hYm92ZS5iZWxvdyA9IHNlZ0U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VnQSkge1xuICAgICAgICAgICAgICAgc2VnRS5iZWxvdyA9IHNlZ0E7XG4gICAgICAgICAgICAgICBzZWdFLmJlbG93LmFib3ZlID0gc2VnRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlZ0EpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdFLmtleSwgc2VnQS5rZXkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVhSW50ZXJzZWN0aW9uUG9pbnQgJiYgIW91dHB1dC5maW5kKGVhSW50ZXJzZWN0aW9uUG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlYUludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBlYUludGVyc2VjdGlvblBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Uua2V5LCBzZWdBLmtleV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoZWFJbnRlcnNlY3Rpb25Qb2ludCwgZWFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgcG9pbnQ6JyArIGVhSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VnQikge1xuICAgICAgICAgICAgICAgIHZhciBlYkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZ0Uua2V5LCBzZWdCLmtleSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWJJbnRlcnNlY3Rpb25Qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWJJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogZWJJbnRlcnNlY3Rpb25Qb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdCLmtleSwgc2VnRS5rZXldXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGViSW50ZXJzZWN0aW9uUG9pbnQsIGViSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGViSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGViSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICBFbHNlIElmIChFIGlzIGEgcmlnaHQgZW5kcG9pbnQpIHtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnR5cGUgPT09ICdlbmQnKSB7XG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xuICAgICAgICAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ3JlZCcsIGZpbGxDb2xvcjogJ3JlZCd9KS5hZGRUbyhtYXApO1xuICAgICAgICAgICAgdmFyIHNlZ0UgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnQpO1xuXG4gICAgICAgICAgICAvLyB2YXIgc2VnQSA9IHNlZ0UuYWJvdmU7XG4gICAgICAgICAgICAvLyB2YXIgc2VnQiA9IHNlZ0UuYmVsb3c7XG4gICAgICAgICAgICB2YXIgc2VnQSA9IHN0YXR1cy5wcmV2KHNlZ0UpO1xuICAgICAgICAgICAgdmFyIHNlZ0IgPSBzdGF0dXMubmV4dChzZWdFKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIExPR1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgdmFyIGxscyA9IHNlZ0Uua2V5Lm1hcChmdW5jdGlvbihwKXtyZXR1cm4gTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSl9KTtcbiAgICAgICAgICAgICB2YXIgbGluZSA9IEwucG9seWxpbmUobGxzLCB7Y29sb3I6ICdyZWQnfSkuYWRkVG8obWFwKTtcblxuICAgICAgICAgICAgIGxpbmUuYmluZFBvcHVwKCdyZW1vdmVkJyArIGkpO1xuXG4gICAgICAgICAgICBpZiAoc2VnQSAmJiBzZWdCKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFiSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnQS5rZXksIHNlZ0Iua2V5KTtcblxuICAgICAgICAgICAgICAgIGlmIChhYkludGVyc2VjdGlvblBvaW50ICYmICFvdXRwdXQuZmluZChhYkludGVyc2VjdGlvblBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWJJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogYWJJbnRlcnNlY3Rpb25Qb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdBLmtleSwgc2VnQi5rZXldXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIEluc2VydCBJIGludG8gRVE7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhYkludGVyc2VjdGlvblBvaW50LCBhYkludGVyc2VjdGlvblBvaW50RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBhYkludGVyc2VjdGlvblBvaW50OicgKyBhYkludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG54ID0gc3RhdHVzLm5leHQoc2VnRSk7XG4gICAgICAgICAgICBpZiAobngpe1xuICAgICAgICAgICAgICAgIG54LmJlbG93ID0gc2VnRS5iZWxvdztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5wID0gc3RhdHVzLnByZXYoc2VnRSk7XG4gICAgICAgICAgICBpZiAobnApe1xuICAgICAgICAgICAgICAgIG5wLmFib3ZlID0gc2VnRS5hYm92ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhdHVzLnJlbW92ZShzZWdFLmtleSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsbCA9IEwubGF0TG5nKFtwWzFdLCBwWzBdXSk7XG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYWRkVG8obWFwKTtcbiAgICAgICAgICAgIG91dHB1dC5pbnNlcnQoZXZlbnQuZGF0YS5wb2ludCk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnRTEgYWJvdmUgc2VnRTIgYmUgRSdzIGludGVyc2VjdGluZyBzZWdtZW50cyBpbiBTTDtcbiAgICAgICAgICAgIC8vIHN0YXR1cy5yZW1vdmUoZXZlbnQuZGF0YS5zZWdtZW50c1swXSk7XG4gICAgICAgICAgICAvLyBzdGF0dXMucmVtb3ZlKGV2ZW50LmRhdGEuc2VnbWVudHNbMV0pO1xuICAgICAgICAgICAgLy8gc3RhdHVzLmluc2VydChldmVudC5kYXRhLnNlZ21lbnRzWzBdKTtcbiAgICAgICAgICAgIC8vIHN0YXR1cy5pbnNlcnQoZXZlbnQuZGF0YS5zZWdtZW50c1sxXSk7XG5cbiAgICAgICAgICAgIC8vIHN0YXR1cy5maW5kKCkg0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QtNC90YMg0Lgg0YLRgyDQttC1INC90L7QtNGDXG5cbiAgICAgICAgICAgIHZhciBzZWcxID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50c1swXSksXG4gICAgICAgICAgICAgICAgc2VnMiA9IHN0YXR1cy5wcmV2KHNlZzEpO1xuXG4gICAgICAgICAgICB2YXIgdGVtcFJpZ2h0ID0gc2VnMS5yaWdodDtcbiAgICAgICAgICAgIHNlZzEucmlnaHQgPSBzZWcyO1xuICAgICAgICAgICAgc2VnMS5sZWZ0ID0gdGVtcFJpZ2h0O1xuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gdmFyIHNlZzEgPSBzdGF0dXMuZmluZChbZXZlbnQuZGF0YS5wb2ludCwgZXZlbnQuZGF0YS5zZWdtZW50c1swXVsxXV0pLFxuICAgICAgICAgICAgLy8gICAgIHNlZzIgPSBzdGF0dXMuZmluZChbZXZlbnQuZGF0YS5wb2ludCwgZXZlbnQuZGF0YS5zZWdtZW50c1sxXVsxXV0pO1xuXG4gICAgICAgICAgICBpZiAoc2VnMSAmJiBzZWcyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlZ0EgPSBzZWcxLmFib3ZlO1xuICAgICAgICAgICAgICAgIHZhciBzZWdCID0gc2VnMi5iZWxvdztcblxuICAgICAgICAgICAgICAgIHNlZzEuYWJvdmUgPSBzZWcyO1xuICAgICAgICAgICAgICAgIHNlZzIuYmVsb3cgPSBzZWcxO1xuICAgICAgICAgICAgICAgIHNlZzEuYmVsb3cgPSBzZWdCO1xuICAgICAgICAgICAgICAgIHNlZzIuYWJvdmUgPSBzZWdBO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlZ0EpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEySW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnMi5rZXksIHNlZ0Eua2V5KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYTJJbnRlcnNlY3Rpb25Qb2ludCAmJiAhb3V0cHV0LmZpbmQoYTJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhMkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogYTJJbnRlcnNlY3Rpb25Qb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Eua2V5LCBzZWcyLmtleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhMkludGVyc2VjdGlvblBvaW50LCBhMkludGVyc2VjdGlvblBvaW50RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYTJJbnRlcnNlY3Rpb25Qb2ludDonICsgYTJJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VnQikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYjFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWcxLmtleSwgc2VnQi5rZXkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChiMUludGVyc2VjdGlvblBvaW50ICYmICFvdXRwdXQuZmluZChiMUludGVyc2VjdGlvblBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGIxSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBiMUludGVyc2VjdGlvblBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnMS5rZXksIHNlZ0Iua2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGIxSW50ZXJzZWN0aW9uUG9pbnQsIGIxSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBiMUludGVyc2VjdGlvblBvaW50OicgKyBiMUludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHdpbmRvdy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgd2luZG93LnF1ZXVlID0gcXVldWU7XG5cbiAgICByZXR1cm4gb3V0cHV0LmtleXMoKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XG4iLCJ2YXIgRVBTID0gMUUtOTtcclxuXHJcbmZ1bmN0aW9uIFV0aWxzKCkge307XHJcblxyXG5VdGlscy5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLypcclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LzQtdC90YzRiNC1IDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L7RgdGC0LDQstC40YIgYSDQv9C+INC80LXQvdGM0YjQtdC80YMg0LjQvdC00LXQutGB0YMsINGH0LXQvCBiLCDRgtC+INC10YHRgtGMLCBhINC40LTRkdGCINC/0LXRgNCy0YvQvC5cclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LLQtdGA0L3RkdGCIDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC+0YHRgtCw0LLQuNGCIGEg0LggYiDQvdC10LjQt9C80LXQvdC90YvQvNC4INC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC00YDRg9CzINC6INC00YDRg9Cz0YMsXHJcbiAgICAgICAgICAgINC90L4g0L7RgtGB0L7RgNGC0LjRgNGD0LXRgiDQuNGFINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC60L4g0LLRgdC10Lwg0LTRgNGD0LPQuNC8INGN0LvQtdC80LXQvdGC0LDQvC5cclxuICAgICAgICAgICAg0J7QsdGA0LDRgtC40YLQtSDQstC90LjQvNCw0L3QuNC1OiDRgdGC0LDQvdC00LDRgNGCIEVDTUFzY3JpcHQg0L3QtSDQs9Cw0YDQsNC90YLQuNGA0YPQtdGCINC00LDQvdC90L7QtSDQv9C+0LLQtdC00LXQvdC40LUsINC4INC10LzRgyDRgdC70LXQtNGD0Y7RgiDQvdC1INCy0YHQtSDQsdGA0LDRg9C30LXRgNGLXHJcbiAgICAgICAgICAgICjQvdCw0L/RgNC40LzQtdGALCDQstC10YDRgdC40LggTW96aWxsYSDQv9C+INC60YDQsNC50L3QtdC5INC80LXRgNC1LCDQtNC+IDIwMDMg0LPQvtC00LApLlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQsdC+0LvRjNGI0LUgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QvtGB0YLQsNCy0LjRgiBiINC/0L4g0LzQtdC90YzRiNC10LzRgyDQuNC90LTQtdC60YHRgywg0YfQtdC8IGEuXHJcbiAgICAgICAg0KTRg9C90LrRhtC40Y8gY29tcGFyZUZ1bmN0aW9uKGEsIGIpINC00L7Qu9C20L3QsCDQstGB0LXQs9C00LAg0LLQvtC30LLRgNCw0YnQsNGC0Ywg0L7QtNC40L3QsNC60L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQtNC70Y8g0L7Qv9GA0LXQtNC10LvRkdC90L3QvtC5INC/0LDRgNGLINGN0LvQtdC80LXQvdGC0L7QsiBhINC4IGIuXHJcbiAgICAgICAgICAgINCV0YHQu9C4INCx0YPQtNGD0YIg0LLQvtC30LLRgNCw0YnQsNGC0YzRgdGPINC90LXQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQtSDRgNC10LfRg9C70YzRgtCw0YLRiywg0L/QvtGA0Y/QtNC+0Log0YHQvtGA0YLQuNGA0L7QstC60Lgg0LHRg9C00LXRgiDQvdC1INC+0L/RgNC10LTQtdC70ZHQvS5cclxuICAgICovXHJcbiAgICAvLyBwb2ludHMgY29tcGFyYXRvclxyXG4gICAgY29tcGFyZVBvaW50czogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICAgICAgeDIgPSBiWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGJbMV07XHJcblxyXG4gICAgICAgIGlmICh4MSA+IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPiB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4MSA8IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPCB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeDEgPT09IHgyICYmIHkxID09PSB5Mikge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBhcmVTZWdtZW50czE6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG5cclxuICAgICAgICBpZiAoeTEgPCB5Mykge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh5MSA+IHkzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICAgICAgLy8gZmlyc3QsIGNoZWNrIGxlZnQtZW5kc1xyXG5cclxuICAgICAgICAvLyB2YXIgeCA9IE1hdGgubWF4KE1hdGgubWluKHgxLCB4MiksIE1hdGgubWluKHgzLCB4NCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd4OiAnICsgeCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3kgZnJvbSB4OiAnICsgZ2V0WShiLCB4KSk7XHJcbiAgICAgICAgdmFyIGF5ID0gIGdldFkoYSwgdGhpcy54KTtcclxuICAgICAgICB2YXIgYnkgPSAgZ2V0WShiLCB0aGlzLngpO1xyXG4gICAgICAgIC8vIHJldHVybiBnZXRZKGEsIHgpIDwgZ2V0WShiLCB4KSAtIEVQUztcclxuICAgICAgICAvLyBMLm1hcmtlcihMLmxhdExuZyhbdGhpcy54LCBheV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzEgPiAyJykuYWRkVG8obWFwKTtcclxuICAgICAgICAvLyBMLnBvbHlsaW5lKFtcclxuICAgICAgICAvLyAgICAgTC5sYXRMbmcoW3RoaXMueCwgNTVdLnNsaWNlKCkucmV2ZXJzZSgpKSxcclxuICAgICAgICAvLyAgICAgTC5sYXRMbmcoW3RoaXMueCwgNTddLnNsaWNlKCkucmV2ZXJzZSgpKVxyXG4gICAgICAgIC8vIF0sIHtcclxuICAgICAgICAvLyAgICAgd2VpZ2h0OiAxXHJcbiAgICAgICAgLy8gfSkuYmluZFBvcHVwKCcnICsgdGhpcy54KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIC8vIEwubWFya2VyKEwubGF0TG5nKFt4LCBieV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzIgPiAxJykuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGF5IC0gYnkpID4gRVBTICYmIGF5IDwgYnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoYXkgLSBieSkgPiBFUFMgJiYgYXkgPiBieSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGEubGVmdFBvaW50ID0gYi5sZWZ0UG9pbnRcclxuICAgICAgICAvLyBjaGVjayByaWdodFxyXG5cclxuICAgICAgICB4ID0gTWF0aC5taW4oTWF0aC5tYXgoeDEsIHgyKSwgTWF0aC5tYXgoeDMsIHg0KSk7XHJcbiAgICAgICAgYXkgPSAgZ2V0WShhLCB4KTtcclxuICAgICAgICBieSA9ICBnZXRZKGIsIHgpO1xyXG5cclxuICAgICAgICAvLyBMLm1hcmtlcihMLmxhdExuZyhbdGhpcy54LCBheV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzEgPiAyJykuYWRkVG8obWFwKTtcclxuICAgICAgICBpZiAoTWF0aC5hYnMoYXkgLSBieSkgPiBFUFMgJiYgYXkgPCBieSkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhheSAtIGJ5KSA+IEVQUyAmJiBheSA+IGJ5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcblxyXG5cclxuICAgICAgICAvLyBpZiAoeTEgPCBieSkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmICh5MSA+IGJ5KSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAxO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAwO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcblxyXG4gICAgZmluZEVxdWF0aW9uOiBmdW5jdGlvbiAoc2VnbWVudCkge1xyXG4gICAgICAgIHZhciB4MSA9IHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gc2VnbWVudFswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IHNlZ21lbnRbMV1bMV0sXHJcbiAgICAgICAgICAgIGEgPSB5MSAtIHkyLFxyXG4gICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhhICsgJ3ggKyAnICsgYiArICd5ICsgJyArIGMgKyAnID0gMCcpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBBZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjMxOTgvaG93LWRvLXlvdS1kZXRlY3Qtd2hlcmUtdHdvLWxpbmUtc2VnbWVudHMtaW50ZXJzZWN0LzE5NjgzNDUjMTk2ODM0NVxyXG4gICAgYmV0d2VlbjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcclxuICAgICAgICAvLyB2YXIgZXBzID0gMC4wMDAwMDAxO1xyXG5cclxuICAgICAgICByZXR1cm4gYS1FUFMgPD0gYiAmJiBiIDw9IGMrRVBTO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgICAgIHZhciB4ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgIHZhciB5ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgIGlmIChpc05hTih4KXx8aXNOYU4oeSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDIsIHgsIHgxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeTEgPj0geTIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkyLCB5LCB5MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHgzID49IHg0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4NCwgeCwgeDMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHgzLCB4LCB4NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5MyA+PSB5NCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTQsIHksIHkzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3gsIHldO1xyXG4gICAgfSxcclxuXHJcbiAgICBwb2ludE9uTGluZTogZnVuY3Rpb24gKGxpbmUsIHBvaW50KSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXSxcclxuICAgICAgICAgICAgZW5kID0gbGluZVsxXSxcclxuICAgICAgICAgICAgeDEgPSBiZWdpblswXSxcclxuICAgICAgICAgICAgeTEgPSBiZWdpblsxXSxcclxuICAgICAgICAgICAgeDIgPSBlbmRbMF0sXHJcbiAgICAgICAgICAgIHkyID0gZW5kWzFdLFxyXG4gICAgICAgICAgICB4ID0gcG9pbnRbMF0sXHJcbiAgICAgICAgICAgIHkgPSBwb2ludFsxXTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoeCAtIHgxKSAqICh5MiAtIHkxKSAtICh5IC0geTEpICogKHgyIC0geDEpID09PSAwKSAmJiAoKHggPiB4MSAmJiB4IDwgeDIpIHx8ICh4ID4geDIgJiYgeCA8IHgxKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRZOiBmdW5jdGlvbiAocG9pbnQxLCBwb2ludDIsIHgpIHtcclxuICAgICAgICB2YXIgeDEgPSBwb2ludDFbMF0sXHJcbiAgICAgICAgICAgIHkxID0gcG9pbnQxWzFdLFxyXG4gICAgICAgICAgICB4MiA9IHBvaW50MlswXSxcclxuICAgICAgICAgICAgeTIgPSBwb2ludDJbMV0sXHJcbiAgICAgICAgICAgIGEgPSB5MSAtIHkyLFxyXG4gICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICgtYyAtIGEgKiB4KSAvIGI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFkoc2VnbWVudCwgeCkge1xyXG4gICAgdmFyIHgxID0gc2VnbWVudFswXVswXSxcclxuICAgICAgICB5MSA9IHNlZ21lbnRbMF1bMV0sXHJcbiAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgIHkyID0gc2VnbWVudFsxXVsxXTtcclxuXHJcbiAgICAvLyDQtdGB0LvQuCDQvtGC0YDQtdC30L7QuiDQs9C+0YDQuNC30L7QvdGC0LDQu9C10L0sXHJcbiAgICAvLyDQstC10YDQvdC10Lwg0L/RgNC+0YHRgtC+IHkg0L/RgNCw0LLQvtCz0L4g0LrQvtC90YbQsFxyXG4gICAgaWYgKE1hdGguYWJzKHgyIC0geDEpIDwgRVBTKSB7XHJcbiAgICAgICAgcmV0dXJuIHkxO1xyXG4gICAgfVxyXG4gICAgLy8g0LIg0L7RgdGC0LDQu9GM0L3Ri9GFINGB0LvRg9GH0LDRj9GFXHJcbiAgICAvLyDQsdC10YDQtdC8INC/0YDQvtC/0L7RgNGG0LjRjlxyXG4gICAgcmV0dXJuIHkxICsgKHkyIC0geTEpICogKHggLSB4MSkgLyAoeDIgLSB4MSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IFV0aWxzO1xyXG4iXX0=
