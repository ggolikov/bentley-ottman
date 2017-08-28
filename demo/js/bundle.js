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

            // if (!segA && segB && status.next(status.next(segE))) {
            //     segB = status.next(status.next(segE));
            // }
            // if (segA && !segB && status.prev(status.prev(segE))) {
            //     segA = status.prev(status.prev(segE));
            // }

            console.log('segA:');
            console.log(segA && segA.key.toString());

            console.log('segE below:');
            console.log(segE.below && segE.below.key.toString());

            console.log('segB:');
            console.log(segB && segB.key.toString());

            console.log('segE above:');
            console.log(segE.above && segE.above.key.toString());

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

            var seg1 = status.find(event.data.segments[0]),

            // seg2 = status.find(event.data.segments[1]);
            seg2 = status.prev(seg1) || status.next(seg1);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXHN3ZWVwbGluZS5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFPLE9BQVAsR0FBaUIsQ0FDYixDQUFDLENBQUMsZ0JBQUQsRUFBa0IsaUJBQWxCLENBQUQsRUFBc0MsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBdEMsQ0FEYSxFQUViLENBQUMsQ0FBQyxrQkFBRCxFQUFvQixpQkFBcEIsQ0FBRCxFQUF3QyxDQUFDLGlCQUFELEVBQW1CLGlCQUFuQixDQUF4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFOYSxDQUFqQjs7O0FDQUEsSUFBSSxvQkFBb0IsUUFBUSxhQUFSLENBQXhCO0FBQ0EsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxNQUFNLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJDLEVBQXlDLFNBQVMsRUFBbEQsRUFBakIsQ0FMVjtBQUFBLElBTUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FOWDs7QUFRQSxPQUFPLEdBQVAsR0FBYSxHQUFiOztBQUVBLElBQUksU0FBUyxJQUFJLFNBQUosRUFBYjtBQUFBLElBQ0ksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FEMUI7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0FBdkIsRUFBMEI7QUFDdEIsUUFBSSxLQUFLLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FBVDtBQUFBLFFBQ0ksS0FBSyxRQUFRLENBQVIsRUFBVyxDQUFYLENBRFQ7QUFBQSxRQUVJLEtBQUssUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUZUO0FBQUEsUUFHSSxLQUFLLFFBQVEsQ0FBUixFQUFXLENBQVgsQ0FIVDs7QUFLQTtBQUNBO0FBQ0EsUUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFLLEVBQWQsSUFBb0IsR0FBeEIsRUFBNkI7QUFDekIsZUFBTyxFQUFQO0FBQ0g7QUFDRDtBQUNBO0FBQ0EsV0FBTyxLQUFLLENBQUMsS0FBSyxFQUFOLEtBQWEsSUFBSSxFQUFqQixLQUF3QixLQUFLLEVBQTdCLENBQVo7QUFDSDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsSUFBSSxLQUFKLEVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIFtbMzcuNTE1MjA2OTMwMDU5MSw1NS44MDQ1MDg4NzA2NTE4Nl0sWzM3LjcyODI3MTY3MDA5NDY3LDU1LjY4MjcxODc4OTYwOTUxXV0sXG4gICAgW1szNy41Mjc0NjQyNDkxMzc4MTUsNTUuNzcwMjMzNDgyNjE2NTVdLFszNy41Mjg0MDYzNDY2OTA1OSw1NS44NDQ4NjAwMDUxMjQwNF1dXG5cbiAgICAvLyBbWzM3LjUzMjI3OTA3NDE0ODIzNSw1NS44MDU5ODE1OTIxMTE4ODRdLFszNy42NDA5ODcwMTQwMDIxOCw1NS43MDY0ODY1NTYwNDcwMV1dLFxuICAgIC8vIFtbMzcuNTY1NTA1MTY5NDA2NTg1LDU1LjcxMzY2ODY0NzQ3NjYxXSxbMzcuNjg0MTkzMjQwNTIwMTQsNTUuODAxMjc3OTc2MTI3NzVdXSxcbiAgICAvLyBbWzM3LjYwOTkwNjg4Njg2NjAzNSw1NS43MzEzMzQ5NDEwNzI2OF0sWzM3LjY0MjQ0NTg2MjQyOTc4LDU1LjczODA3NzM3NjYyMzY5XV1cbl07XG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xudmFyIGRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL2luZGV4LmpzJyk7XG5cbnZhciBvc20gPSBMLnRpbGVMYXllcignaHR0cDovL3tzfS5iYXNlbWFwcy5jYXJ0b2Nkbi5jb20vbGlnaHRfbm9sYWJlbHMve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICBtYXhab29tOiAyMixcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4nXG4gICAgfSksXG4gICAgcG9pbnQgPSBMLmxhdExuZyhbNTUuNzUzMjEwLCAzNy42MjE3NjZdKSxcbiAgICBtYXAgPSBuZXcgTC5NYXAoJ21hcCcsIHtsYXllcnM6IFtvc21dLCBjZW50ZXI6IHBvaW50LCB6b29tOiAxMSwgbWF4Wm9vbTogMjJ9KSxcbiAgICByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKTtcblxud2luZG93Lm1hcCA9IG1hcDtcblxudmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKSxcbiAgICBuID0gYm91bmRzLl9ub3J0aEVhc3QubGF0LFxuICAgIGUgPSBib3VuZHMuX25vcnRoRWFzdC5sbmcsXG4gICAgcyA9IGJvdW5kcy5fc291dGhXZXN0LmxhdCxcbiAgICB3ID0gYm91bmRzLl9zb3V0aFdlc3QubG5nLFxuICAgIGhlaWdodCA9IG4gLSBzLFxuICAgIHdpZHRoID0gZSAtIHcsXG4gICAgcUhlaWdodCA9IGhlaWdodCAvIDQsXG4gICAgcVdpZHRoID0gd2lkdGggLyA0LFxuICAgIGxpbmVzID0gW107XG5cbnZhciBwb2ludHMgPSB0dXJmLnJhbmRvbSgncG9pbnRzJywgOCwge1xuICAgIGJib3g6IFt3ICsgcVdpZHRoLCBzICsgcUhlaWdodCwgZSAtIHFXaWR0aCwgbiAtIHFIZWlnaHRdXG59KTtcblxudmFyIGNvb3JkcyA9IHBvaW50cy5mZWF0dXJlcy5tYXAoZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xufSlcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKz0yKSB7XG4gICAgbGluZXMucHVzaChbY29vcmRzW2ldLCBjb29yZHNbaSsxXV0pO1xufVxuXG4vLyBkcmF3TGluZXMobGluZXMpO1xuZHJhd0xpbmVzKGRhdGEpO1xuXG4vLyB2YXIgcHMgPSBmaW5kSW50ZXJzZWN0aW9ucyhsaW5lcywgbWFwKTtcbnZhciBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGRhdGEsIG1hcCk7XG5cbnBzLmZvckVhY2goZnVuY3Rpb24gKHApIHtcbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKSwge3JhZGl1czogNSwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5hZGRUbyhtYXApO1xufSlcblxuZnVuY3Rpb24gZHJhd0xpbmVzKGFycmF5KSB7XG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLFxuICAgICAgICAgICAgZW5kID0gbGluZVsxXTtcblxuICAgICAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhiZWdpbiksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XG4gICAgICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGVuZCksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XG4gICAgICAgIEwucG9seWxpbmUoW2JlZ2luLCBlbmRdLCB7d2VpZ2h0OiAxfSkuYWRkVG8obWFwKTtcbiAgICB9KTtcbn1cblxuLy8gY29uc29sZS5sb2cocHMpO1xuIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi9zcmMvc3dlZXBsaW5lLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuYXZsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFByaW50cyB0cmVlIGhvcml6b250YWxseVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBwcmludCAocm9vdCwgcHJpbnROb2RlKSB7XG4gIGlmICggcHJpbnROb2RlID09PSB2b2lkIDAgKSBwcmludE5vZGUgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbi5rZXk7IH07XG5cbiAgdmFyIG91dCA9IFtdO1xuICByb3cocm9vdCwgJycsIHRydWUsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBvdXQucHVzaCh2KTsgfSwgcHJpbnROb2RlKTtcbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBQcmludHMgbGV2ZWwgb2YgdGhlIHRyZWVcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICBwcmVmaXhcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgaXNUYWlsXG4gKiBAcGFyYW0gIHtGdW5jdGlvbihpbjpzdHJpbmcpOnZvaWR9ICAgIG91dFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9ICBwcmludE5vZGVcbiAqL1xuZnVuY3Rpb24gcm93IChyb290LCBwcmVmaXgsIGlzVGFpbCwgb3V0LCBwcmludE5vZGUpIHtcbiAgaWYgKHJvb3QpIHtcbiAgICBvdXQoKFwiXCIgKyBwcmVmaXggKyAoaXNUYWlsID8gJ+KUlOKUgOKUgCAnIDogJ+KUnOKUgOKUgCAnKSArIChwcmludE5vZGUocm9vdCkpICsgXCJcXG5cIikpO1xuICAgIHZhciBpbmRlbnQgPSBwcmVmaXggKyAoaXNUYWlsID8gJyAgICAnIDogJ+KUgiAgICcpO1xuICAgIGlmIChyb290LmxlZnQpICB7IHJvdyhyb290LmxlZnQsICBpbmRlbnQsIGZhbHNlLCBvdXQsIHByaW50Tm9kZSk7IH1cbiAgICBpZiAocm9vdC5yaWdodCkgeyByb3cocm9vdC5yaWdodCwgaW5kZW50LCB0cnVlLCAgb3V0LCBwcmludE5vZGUpOyB9XG4gIH1cbn1cblxuXG4vKipcbiAqIElzIHRoZSB0cmVlIGJhbGFuY2VkIChub25lIG9mIHRoZSBzdWJ0cmVlcyBkaWZmZXIgaW4gaGVpZ2h0IGJ5IG1vcmUgdGhhbiAxKVxuICogQHBhcmFtICB7Tm9kZX0gICAgcm9vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNCYWxhbmNlZChyb290KSB7XG4gIGlmIChyb290ID09PSBudWxsKSB7IHJldHVybiB0cnVlOyB9IC8vIElmIG5vZGUgaXMgZW1wdHkgdGhlbiByZXR1cm4gdHJ1ZVxuXG4gIC8vIEdldCB0aGUgaGVpZ2h0IG9mIGxlZnQgYW5kIHJpZ2h0IHN1YiB0cmVlc1xuICB2YXIgbGggPSBoZWlnaHQocm9vdC5sZWZ0KTtcbiAgdmFyIHJoID0gaGVpZ2h0KHJvb3QucmlnaHQpO1xuXG4gIGlmIChNYXRoLmFicyhsaCAtIHJoKSA8PSAxICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QubGVmdCkgICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QucmlnaHQpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gSWYgd2UgcmVhY2ggaGVyZSB0aGVuIHRyZWUgaXMgbm90IGhlaWdodC1iYWxhbmNlZFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIENvbXB1dGUgdGhlICdoZWlnaHQnIG9mIGEgdHJlZS5cbiAqIEhlaWdodCBpcyB0aGUgbnVtYmVyIG9mIG5vZGVzIGFsb25nIHRoZSBsb25nZXN0IHBhdGhcbiAqIGZyb20gdGhlIHJvb3Qgbm9kZSBkb3duIHRvIHRoZSBmYXJ0aGVzdCBsZWFmIG5vZGUuXG4gKlxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBoZWlnaHQobm9kZSkge1xuICByZXR1cm4gbm9kZSA/ICgxICsgTWF0aC5tYXgoaGVpZ2h0KG5vZGUubGVmdCksIGhlaWdodChub2RlLnJpZ2h0KSkpIDogMDtcbn1cblxuLy8gZnVuY3Rpb24gY3JlYXRlTm9kZSAocGFyZW50LCBsZWZ0LCByaWdodCwgaGVpZ2h0LCBrZXksIGRhdGEpIHtcbi8vICAgcmV0dXJuIHsgcGFyZW50LCBsZWZ0LCByaWdodCwgYmFsYW5jZUZhY3RvcjogaGVpZ2h0LCBrZXksIGRhdGEgfTtcbi8vIH1cblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBwYXJlbnQ6ICAgICAgICA/Tm9kZSxcbiAqICAgbGVmdDogICAgICAgICAgP05vZGUsXG4gKiAgIHJpZ2h0OiAgICAgICAgID9Ob2RlLFxuICogICBiYWxhbmNlRmFjdG9yOiBudW1iZXIsXG4gKiAgIGtleTogICAgICAgICAgIEtleSxcbiAqICAgZGF0YTogICAgICAgICAgVmFsdWVcbiAqIH19IE5vZGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsqfSBLZXlcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsqfSBWYWx1ZVxuICovXG5cbi8qKlxuICogRGVmYXVsdCBjb21wYXJpc29uIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0tleX0gYVxuICogQHBhcmFtIHtLZXl9IGJcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfQ09NUEFSRSAoYSwgYikgeyByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7IH1cblxuXG4vKipcbiAqIFNpbmdsZSBsZWZ0IHJvdGF0aW9uXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5mdW5jdGlvbiByb3RhdGVMZWZ0IChub2RlKSB7XG4gIHZhciByaWdodE5vZGUgPSBub2RlLnJpZ2h0O1xuICBub2RlLnJpZ2h0ICAgID0gcmlnaHROb2RlLmxlZnQ7XG5cbiAgaWYgKHJpZ2h0Tm9kZS5sZWZ0KSB7IHJpZ2h0Tm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICByaWdodE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChyaWdodE5vZGUucGFyZW50KSB7XG4gICAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5sZWZ0ID0gcmlnaHROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LnJpZ2h0ID0gcmlnaHROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gcmlnaHROb2RlO1xuICByaWdodE5vZGUubGVmdCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChyaWdodE5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gcmlnaHROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuICByZXR1cm4gcmlnaHROb2RlO1xufVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZVJpZ2h0IChub2RlKSB7XG4gIHZhciBsZWZ0Tm9kZSA9IG5vZGUubGVmdDtcbiAgbm9kZS5sZWZ0ID0gbGVmdE5vZGUucmlnaHQ7XG4gIGlmIChub2RlLmxlZnQpIHsgbm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICBsZWZ0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKGxlZnROb2RlLnBhcmVudCkge1xuICAgIGlmIChsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgbGVmdE5vZGUucGFyZW50LmxlZnQgPSBsZWZ0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdE5vZGUucGFyZW50LnJpZ2h0ID0gbGVmdE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSBsZWZ0Tm9kZTtcbiAgbGVmdE5vZGUucmlnaHQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobGVmdE5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gbGVmdE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJldHVybiBsZWZ0Tm9kZTtcbn1cblxuXG4vLyBmdW5jdGlvbiBsZWZ0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSByb3RhdGVMZWZ0KG5vZGUubGVmdCk7XG4vLyAgIHJldHVybiByb3RhdGVSaWdodChub2RlKTtcbi8vIH1cblxuXG4vLyBmdW5jdGlvbiByaWdodEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgcm90YXRlUmlnaHQobm9kZS5yaWdodCk7XG4vLyAgIHJldHVybiByb3RhdGVMZWZ0KG5vZGUpO1xuLy8gfVxuXG5cbnZhciBBVkxUcmVlID0gZnVuY3Rpb24gQVZMVHJlZSAoY29tcGFyYXRvciwgbm9EdXBsaWNhdGVzKSB7XG4gIGlmICggbm9EdXBsaWNhdGVzID09PSB2b2lkIDAgKSBub0R1cGxpY2F0ZXMgPSBmYWxzZTtcblxuICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvciB8fCBERUZBVUxUX0NPTVBBUkU7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xuICB0aGlzLl9zaXplID0gMDtcbiAgdGhpcy5fbm9EdXBsaWNhdGVzID0gISFub0R1cGxpY2F0ZXM7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBzaXplOiB7fSB9O1xuXG5cbi8qKlxuICogQ2xlYXIgdGhlIHRyZWVcbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBOdW1iZXIgb2Ygbm9kZXNcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xucHJvdG90eXBlQWNjZXNzb3JzLnNpemUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc2l6ZTtcbn07XG5cblxuLyoqXG4gKiBXaGV0aGVyIHRoZSB0cmVlIGNvbnRhaW5zIGEgbm9kZSB3aXRoIHRoZSBnaXZlbiBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZS9mYWxzZVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zIChrZXkpIHtcbiAgaWYgKHRoaXMuX3Jvb3Qpe1xuICAgIHZhciBub2RlICAgICA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuICAgIHdoaWxlIChub2RlKXtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGtleSwgbm9kZS5rZXkpO1xuICAgICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblxuLyogZXNsaW50LWRpc2FibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG4vKipcbiAqIFN1Y2Nlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiBuZXh0IChub2RlKSB7XG4gIHZhciBzdWNjZXNzb3IgPSBub2RlO1xuICBpZiAoc3VjY2Vzc29yKSB7XG4gICAgaWYgKHN1Y2Nlc3Nvci5yaWdodCkge1xuICAgICAgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnJpZ2h0O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IubGVmdCkgeyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IubGVmdDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLnJpZ2h0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBzdWNjZXNzb3I7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWNjZXNzb3I7XG59O1xuXG5cbi8qKlxuICogUHJlZGVjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gcHJldiAobm9kZSkge1xuICB2YXIgcHJlZGVjZXNzb3IgPSBub2RlO1xuICBpZiAocHJlZGVjZXNzb3IpIHtcbiAgICBpZiAocHJlZGVjZXNzb3IubGVmdCkge1xuICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5sZWZ0O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLnJpZ2h0KSB7IHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucmlnaHQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZGVjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5sZWZ0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBwcmVkZWNlc3NvcjtcbiAgICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwcmVkZWNlc3Nvcjtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuXG4vKipcbiAqIENhbGxiYWNrIGZvciBmb3JFYWNoXG4gKiBAY2FsbGJhY2sgZm9yRWFjaENhbGxiYWNrXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICovXG5cbi8qKlxuICogQHBhcmFte2ZvckVhY2hDYWxsYmFja30gY2FsbGJhY2tcbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoIChjYWxsYmFjaykge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIGRvbmUgPSBmYWxzZSwgaSA9IDA7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgLy8gUmVhY2ggdGhlIGxlZnQgbW9zdCBOb2RlIG9mIHRoZSBjdXJyZW50IE5vZGVcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgLy8gUGxhY2UgcG9pbnRlciB0byBhIHRyZWUgbm9kZSBvbiB0aGUgc3RhY2tcbiAgICAgIC8vIGJlZm9yZSB0cmF2ZXJzaW5nIHRoZSBub2RlJ3MgbGVmdCBzdWJ0cmVlXG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCYWNrVHJhY2sgZnJvbSB0aGUgZW1wdHkgc3VidHJlZSBhbmQgdmlzaXQgdGhlIE5vZGVcbiAgICAgIC8vIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrOyBob3dldmVyLCBpZiB0aGUgc3RhY2sgaXNcbiAgICAgIC8vIGVtcHR5IHlvdSBhcmUgZG9uZVxuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgY2FsbGJhY2soY3VycmVudCwgaSsrKTtcblxuICAgICAgICAvLyBXZSBoYXZlIHZpc2l0ZWQgdGhlIG5vZGUgYW5kIGl0cyBsZWZ0XG4gICAgICAgIC8vIHN1YnRyZWUuIE5vdywgaXQncyByaWdodCBzdWJ0cmVlJ3MgdHVyblxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYWxsIGtleXMgaW4gb3JkZXJcbiAqIEByZXR1cm4ge0FycmF5PEtleT59XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiBrZXlzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQua2V5KTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGBkYXRhYCBmaWVsZHMgb2YgYWxsIG5vZGVzIGluIG9yZGVyLlxuICogQHJldHVybiB7QXJyYXk8VmFsdWU+fVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5kYXRhKTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgYXQgZ2l2ZW4gaW5kZXhcbiAqIEBwYXJhbXtudW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiBhdCAoaW5kZXgpIHtcbiAgLy8gcmVtb3ZlZCBhZnRlciBhIGNvbnNpZGVyYXRpb24sIG1vcmUgbWlzbGVhZGluZyB0aGFuIHVzZWZ1bFxuICAvLyBpbmRleCA9IGluZGV4ICUgdGhpcy5zaXplO1xuICAvLyBpZiAoaW5kZXggPCAwKSBpbmRleCA9IHRoaXMuc2l6ZSAtIGluZGV4O1xuXG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgZG9uZSA9IGZhbHNlLCBpID0gMDtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgaWYgKGkgPT09IGluZGV4KSB7IHJldHVybiBjdXJyZW50OyB9XG4gICAgICAgIGkrKztcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWluaW11bSBrZXlcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5taW5Ob2RlID0gZnVuY3Rpb24gbWluTm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWF4IGtleVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm1heE5vZGUgPSBmdW5jdGlvbiBtYXhOb2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogTWluIGtleVxuICogQHJldHVybiB7P0tleX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gbWluICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cblxuLyoqXG4gKiBNYXgga2V5XG4gKiBAcmV0dXJuIHs/S2V5fVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiBtYXggKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG5cbi8qKlxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZS9mYWxzZVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eSAoKSB7XG4gIHJldHVybiAhdGhpcy5fcm9vdDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBub2RlIHdpdGggc21hbGxlc3Qga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290LCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gIGlmIChub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgcmV0dXJuVmFsdWUgPSB7IGtleTogbm9kZS5rZXksIGRhdGE6IG5vZGUuZGF0YSB9O1xuICAgIHRoaXMucmVtb3ZlKG5vZGUua2V5KTtcbiAgfVxuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogRmluZCBub2RlIGJ5IGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIGZpbmQgKGtleSkge1xuICB2YXIgcm9vdCA9IHRoaXMuX3Jvb3Q7XG4gIC8vIGlmIChyb290ID09PSBudWxsKSAgcmV0dXJuIG51bGw7XG4gIC8vIGlmIChrZXkgPT09IHJvb3Qua2V5KSByZXR1cm4gcm9vdDtcblxuICB2YXIgc3VidHJlZSA9IHJvb3QsIGNtcDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB3aGlsZSAoc3VidHJlZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBzdWJ0cmVlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gc3VidHJlZTsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgc3VidHJlZSA9IHN1YnRyZWUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgc3VidHJlZSA9IHN1YnRyZWUucmlnaHQ7IH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuXG4vKipcbiAqIEluc2VydCBhIG5vZGUgaW50byB0aGUgdHJlZVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcGFyYW17VmFsdWV9IFtkYXRhXVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCAoa2V5LCBkYXRhKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7XG4gICAgdGhpcy5fcm9vdCA9IHtcbiAgICAgIHBhcmVudDogbnVsbCwgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgICBrZXk6IGtleSwgZGF0YTogZGF0YVxuICAgIH07XG4gICAgdGhpcy5fc2l6ZSsrO1xuICAgIHJldHVybiB0aGlzLl9yb290O1xuICB9XG5cbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB2YXIgbm9kZSAgPSB0aGlzLl9yb290O1xuICB2YXIgcGFyZW50PSBudWxsO1xuICB2YXIgY21wICAgPSAwO1xuXG4gIGlmICh0aGlzLl9ub0R1cGxpY2F0ZXMpIHtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICAgIHBhcmVudCA9IG5vZGU7XG4gICAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgICBwYXJlbnQgPSBub2RlO1xuICAgICAgaWYgICAgKGNtcCA8PSAwKXsgbm9kZSA9IG5vZGUubGVmdDsgfSAvL3JldHVybiBudWxsO1xuICAgICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBuZXdOb2RlID0ge1xuICAgIGxlZnQ6IG51bGwsXG4gICAgcmlnaHQ6IG51bGwsXG4gICAgYmFsYW5jZUZhY3RvcjogMCxcbiAgICBwYXJlbnQ6IHBhcmVudCwga2V5OiBrZXksIGRhdGE6IGRhdGFcbiAgfTtcbiAgdmFyIG5ld1Jvb3Q7XG4gIGlmIChjbXAgPD0gMCkgeyBwYXJlbnQubGVmdD0gbmV3Tm9kZTsgfVxuICBlbHNlICAgICAgIHsgcGFyZW50LnJpZ2h0ID0gbmV3Tm9kZTsgfVxuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBjbXAgPSBjb21wYXJlKHBhcmVudC5rZXksIGtleSk7XG4gICAgaWYgKGNtcCA8IDApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vIGlubGluZWRcbiAgICAgIC8vdmFyIG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGlubGluZWRcbiAgICAgIC8vIHZhciBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgbmV3Um9vdCA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIHRoaXMuX3NpemUrKztcbiAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgbm9kZSBmcm9tIHRoZSB0cmVlLiBJZiBub3QgZm91bmQsIHJldHVybnMgbnVsbC5cbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoa2V5KSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHZhciBjbXAgPSAwO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZhciByZXR1cm5WYWx1ZSA9IG5vZGUua2V5O1xuICB2YXIgbWF4LCBtaW47XG5cbiAgaWYgKG5vZGUubGVmdCkge1xuICAgIG1heCA9IG5vZGUubGVmdDtcblxuICAgIHdoaWxlIChtYXgubGVmdCB8fCBtYXgucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtYXgucmlnaHQpIHsgbWF4ID0gbWF4LnJpZ2h0OyB9XG5cbiAgICAgIG5vZGUua2V5ID0gbWF4LmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgICAgaWYgKG1heC5sZWZ0KSB7XG4gICAgICAgIG5vZGUgPSBtYXg7XG4gICAgICAgIG1heCA9IG1heC5sZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtYXgua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgIG5vZGUgPSBtYXg7XG4gIH1cblxuICBpZiAobm9kZS5yaWdodCkge1xuICAgIG1pbiA9IG5vZGUucmlnaHQ7XG5cbiAgICB3aGlsZSAobWluLmxlZnQgfHwgbWluLnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWluLmxlZnQpIHsgbWluID0gbWluLmxlZnQ7IH1cblxuICAgICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICAgIGlmIChtaW4ucmlnaHQpIHtcbiAgICAgICAgbm9kZSA9IG1pbjtcbiAgICAgICAgbWluID0gbWluLnJpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgIG5vZGUgPSBtaW47XG4gIH1cblxuICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIHZhciBwcCAgID0gbm9kZTtcbiAgdmFyIG5ld1Jvb3Q7XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQubGVmdCA9PT0gcHApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vIGlubGluZWRcbiAgICAgIC8vdmFyIG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdDtcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gaW5saW5lZFxuICAgICAgLy8gdmFyIG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICBuZXdSb290ID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3Q7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAtMSB8fCBwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyBicmVhazsgfVxuXG4gICAgcHAgICA9IHBhcmVudDtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgaWYgKG5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHsgbm9kZS5wYXJlbnQubGVmdD0gbnVsbDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgeyBub2RlLnBhcmVudC5yaWdodCA9IG51bGw7IH1cbiAgfVxuXG4gIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7IHRoaXMuX3Jvb3QgPSBudWxsOyB9XG5cbiAgdGhpcy5fc2l6ZS0tO1xuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogQnVsay1sb2FkIGl0ZW1zXG4gKiBAcGFyYW17QXJyYXk8S2V5Pn1rZXlzXG4gKiBAcGFyYW17QXJyYXk8VmFsdWU+fVt2YWx1ZXNdXG4gKiBAcmV0dXJuIHtBVkxUcmVlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gbG9hZCAoa2V5cywgdmFsdWVzKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG4gICAgaWYgKCBrZXlzID09PSB2b2lkIDAgKSBrZXlzID0gW107XG4gICAgaWYgKCB2YWx1ZXMgPT09IHZvaWQgMCApIHZhbHVlcyA9IFtdO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGtleXMpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMkMS5pbnNlcnQoa2V5c1tpXSwgdmFsdWVzW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB0cmVlIGlzIGJhbGFuY2VkXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5pc0JhbGFuY2VkID0gZnVuY3Rpb24gaXNCYWxhbmNlZCQxICgpIHtcbiAgcmV0dXJuIGlzQmFsYW5jZWQodGhpcy5fcm9vdCk7XG59O1xuXG5cbi8qKlxuICogU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmVlIC0gcHJpbWl0aXZlIGhvcml6b250YWwgcHJpbnQtb3V0XG4gKiBAcGFyYW17RnVuY3Rpb24oTm9kZSk6c3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nIChwcmludE5vZGUpIHtcbiAgcmV0dXJuIHByaW50KHRoaXMuX3Jvb3QsIHByaW50Tm9kZSk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyggQVZMVHJlZS5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xuXG5yZXR1cm4gQVZMVHJlZTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF2bC5qcy5tYXBcbiIsInZhciBUcmVlID0gcmVxdWlyZSgnYXZsJyksXG4gICAgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbi8qKlxuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudHMgc2V0IG9mIHNlZ21lbnRzIGludGVyc2VjdGluZyBzd2VlcGxpbmUgW1tbeDEsIHkxXSwgW3gyLCB5Ml1dIC4uLiBbW3htLCB5bV0sIFt4biwgeW5dXV1cbiAqL1xuXG5mdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9ucyhzZWdtZW50cywgbWFwKSB7XG4gICAgdmFyIGN0eCA9IHtcbiAgICAgICAgeDogbnVsbFxuICAgIH07XG5cbiAgICB2YXIgcXVldWUgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlUG9pbnRzKSxcbiAgICAgICAgc3RhdHVzID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVNlZ21lbnRzLmJpbmQoY3R4KSksXG4gICAgICAgIG91dHB1dCA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpO1xuXG4gICAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2VnbWVudCkge1xuICAgICAgICBzZWdtZW50LnNvcnQodXRpbHMuY29tcGFyZVBvaW50cyk7XG4gICAgICAgIHZhciBiZWdpbiA9IHNlZ21lbnRbMF0sXG4gICAgICAgICAgICBlbmQgPSBzZWdtZW50WzFdLFxuICAgICAgICAgICAgYmVnaW5EYXRhID0ge1xuICAgICAgICAgICAgICAgIHBvaW50OiBiZWdpbixcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmVnaW4nLFxuICAgICAgICAgICAgICAgIHNlZ21lbnQ6IHNlZ21lbnRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmREYXRhID0ge1xuICAgICAgICAgICAgICAgIHBvaW50OiBlbmQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2VuZCcsXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxuICAgICAgICAgICAgfTtcbiAgICAgICAgcXVldWUuaW5zZXJ0KGJlZ2luLCBiZWdpbkRhdGEpO1xuICAgICAgICBxdWV1ZS5pbnNlcnQoZW5kLCBlbmREYXRhKTtcbiAgICB9KTtcblxuICAgIHZhciBpID0gMDtcblxuXG5cbiAgICB3aGlsZSAoIXF1ZXVlLmlzRW1wdHkoKSkge1xuICAgICAgICB2YXIgZXZlbnQgPSBxdWV1ZS5wb3AoKTtcbiAgICAgICAgdmFyIHAgPSBldmVudC5kYXRhLnBvaW50O1xuXG4gICAgICAgIGN0eC54ID0gcFswXTtcblxuICAgICAgICBjb25zb2xlLmxvZyhpICsgJykgY3VycmVudCBwb2ludDogJyArIGV2ZW50LmRhdGEucG9pbnQudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcgICBwb2ludCB0eXBlOiAnICsgZXZlbnQuZGF0YS50eXBlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJyAgIHF1ZXVlOiAnICsgcXVldWUudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcgICBzdGF0dXM6ICcgKyBzdGF0dXMudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgaWYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ2JlZ2luJykge1xuXG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xuICAgICAgICAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ2dyZWVuJywgZmlsbENvbG9yOiAnZ3JlZW4nfSkuYWRkVG8obWFwKTtcblxuICAgICAgICAgICAgdmFyIHNlZ21lbnREYXRhID0ge1xuICAgICAgICAgICAgICAgIGFib3ZlOiBudWxsLFxuICAgICAgICAgICAgICAgIGJlbG93OiBudWxsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXR1cy5pbnNlcnQoZXZlbnQuZGF0YS5zZWdtZW50KTtcbiAgICAgICAgICAgIHZhciBzZWdFID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50KTtcblxuICAgICAgICAgICAgdmFyIGxscyA9IHNlZ0Uua2V5Lm1hcChmdW5jdGlvbihwKXtyZXR1cm4gTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSl9KTtcbiAgICAgICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMsIHtjb2xvcjogJ2dyZWVuJ30pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgICAgIGxpbmUuYmluZFBvcHVwKCdhZGRlZCcgKyBpKTtcblxuICAgICAgICAgICAgdmFyIHNlZ0EgPSBzdGF0dXMucHJldihzZWdFKTtcbiAgICAgICAgICAgIHZhciBzZWdCID0gc3RhdHVzLm5leHQoc2VnRSk7XG5cbiAgICAgICAgICAgIC8vIGlmICghc2VnQSAmJiBzZWdCICYmIHN0YXR1cy5uZXh0KHN0YXR1cy5uZXh0KHNlZ0UpKSkge1xuICAgICAgICAgICAgLy8gICAgIHNlZ0IgPSBzdGF0dXMubmV4dChzdGF0dXMubmV4dChzZWdFKSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBpZiAoc2VnQSAmJiAhc2VnQiAmJiBzdGF0dXMucHJldihzdGF0dXMucHJldihzZWdFKSkpIHtcbiAgICAgICAgICAgIC8vICAgICBzZWdBID0gc3RhdHVzLnByZXYoc3RhdHVzLnByZXYoc2VnRSkpO1xuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VnQTonKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlZ0EgJiYgc2VnQS5rZXkudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWdFIGJlbG93OicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coc2VnRS5iZWxvdyAmJiBzZWdFLmJlbG93LmtleS50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlZ0I6Jyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWdCICYmIHNlZ0Iua2V5LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VnRSBhYm92ZTonKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlZ0UuYWJvdmUgJiYgc2VnRS5hYm92ZS5rZXkudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgIGlmIChzZWdCKSB7XG4gICAgICAgICAgICAgICBzZWdFLmFib3ZlID0gc2VnQjtcbiAgICAgICAgICAgICAgIHNlZ0UuYWJvdmUuYmVsb3cgPSBzZWdFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlZ0EpIHtcbiAgICAgICAgICAgICAgIHNlZ0UuYmVsb3cgPSBzZWdBO1xuICAgICAgICAgICAgICAgc2VnRS5iZWxvdy5hYm92ZSA9IHNlZ0U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWdBKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVhSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnRS5rZXksIHNlZ0Eua2V5KTtcblxuICAgICAgICAgICAgICAgIGlmIChlYUludGVyc2VjdGlvblBvaW50ICYmICFvdXRwdXQuZmluZChlYUludGVyc2VjdGlvblBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWFJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogZWFJbnRlcnNlY3Rpb25Qb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdFLmtleSwgc2VnQS5rZXldXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGVhSW50ZXJzZWN0aW9uUG9pbnQsIGVhSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIHBvaW50OicgKyBlYUludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlZ0IpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWJJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdFLmtleSwgc2VnQi5rZXkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGViSW50ZXJzZWN0aW9uUG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGViSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGViSW50ZXJzZWN0aW9uUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnQi5rZXksIHNlZ0Uua2V5XVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChlYkludGVyc2VjdGlvblBvaW50LCBlYkludGVyc2VjdGlvblBvaW50RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBlYkludGVyc2VjdGlvblBvaW50OicgKyBlYkludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgRWxzZSBJZiAoRSBpcyBhIHJpZ2h0IGVuZHBvaW50KSB7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnZW5kJykge1xuICAgICAgICAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcbiAgICAgICAgICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdyZWQnLCBmaWxsQ29sb3I6ICdyZWQnfSkuYWRkVG8obWFwKTtcbiAgICAgICAgICAgIHZhciBzZWdFID0gc3RhdHVzLmZpbmQoZXZlbnQuZGF0YS5zZWdtZW50KTtcblxuICAgICAgICAgICAgLy8gdmFyIHNlZ0EgPSBzZWdFLmFib3ZlO1xuICAgICAgICAgICAgLy8gdmFyIHNlZ0IgPSBzZWdFLmJlbG93O1xuICAgICAgICAgICAgdmFyIHNlZ0EgPSBzdGF0dXMucHJldihzZWdFKTtcbiAgICAgICAgICAgIHZhciBzZWdCID0gc3RhdHVzLm5leHQoc2VnRSk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBMT0dcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgIHZhciBsbHMgPSBzZWdFLmtleS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XG4gICAgICAgICAgICAgdmFyIGxpbmUgPSBMLnBvbHlsaW5lKGxscywge2NvbG9yOiAncmVkJ30pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgICAgICBsaW5lLmJpbmRQb3B1cCgncmVtb3ZlZCcgKyBpKTtcblxuICAgICAgICAgICAgaWYgKHNlZ0EgJiYgc2VnQikge1xuICAgICAgICAgICAgICAgIHZhciBhYkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZ0Eua2V5LCBzZWdCLmtleSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWJJbnRlcnNlY3Rpb25Qb2ludCAmJiAhb3V0cHV0LmZpbmQoYWJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFiSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGFiSW50ZXJzZWN0aW9uUG9pbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnQS5rZXksIHNlZ0Iua2V5XVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBJbnNlcnQgSSBpbnRvIEVRO1xuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoYWJJbnRlcnNlY3Rpb25Qb2ludCwgYWJJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYWJJbnRlcnNlY3Rpb25Qb2ludDonICsgYWJJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBueCA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xuICAgICAgICAgICAgaWYgKG54KXtcbiAgICAgICAgICAgICAgICBueC5iZWxvdyA9IHNlZ0UuYmVsb3c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBucCA9IHN0YXR1cy5wcmV2KHNlZ0UpO1xuICAgICAgICAgICAgaWYgKG5wKXtcbiAgICAgICAgICAgICAgICBucC5hYm92ZSA9IHNlZ0UuYWJvdmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXR1cy5yZW1vdmUoc2VnRS5rZXkpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xuICAgICAgICAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ2JsdWUnLCBmaWxsQ29sb3I6ICdibHVlJ30pLmFkZFRvKG1hcCk7XG4gICAgICAgICAgICBvdXRwdXQuaW5zZXJ0KGV2ZW50LmRhdGEucG9pbnQpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgTGV0IHNlZ0UxIGFib3ZlIHNlZ0UyIGJlIEUncyBpbnRlcnNlY3Rpbmcgc2VnbWVudHMgaW4gU0w7XG4gICAgICAgICAgICAvLyBzdGF0dXMucmVtb3ZlKGV2ZW50LmRhdGEuc2VnbWVudHNbMF0pO1xuICAgICAgICAgICAgLy8gc3RhdHVzLnJlbW92ZShldmVudC5kYXRhLnNlZ21lbnRzWzFdKTtcbiAgICAgICAgICAgIC8vIHN0YXR1cy5pbnNlcnQoZXZlbnQuZGF0YS5zZWdtZW50c1swXSk7XG4gICAgICAgICAgICAvLyBzdGF0dXMuaW5zZXJ0KGV2ZW50LmRhdGEuc2VnbWVudHNbMV0pO1xuXG4gICAgICAgICAgICB2YXIgc2VnMSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudHNbMF0pLFxuICAgICAgICAgICAgICAgIC8vIHNlZzIgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnRzWzFdKTtcbiAgICAgICAgICAgICAgICBzZWcyID0gc3RhdHVzLnByZXYoc2VnMSkgfHwgc3RhdHVzLm5leHQoc2VnMSk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gdmFyIHNlZzEgPSBzdGF0dXMuZmluZChbZXZlbnQuZGF0YS5wb2ludCwgZXZlbnQuZGF0YS5zZWdtZW50c1swXVsxXV0pLFxuICAgICAgICAgICAgLy8gICAgIHNlZzIgPSBzdGF0dXMuZmluZChbZXZlbnQuZGF0YS5wb2ludCwgZXZlbnQuZGF0YS5zZWdtZW50c1sxXVsxXV0pO1xuXG4gICAgICAgICAgICBpZiAoc2VnMSAmJiBzZWcyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlZ0EgPSBzZWcxLmFib3ZlO1xuICAgICAgICAgICAgICAgIHZhciBzZWdCID0gc2VnMi5iZWxvdztcblxuICAgICAgICAgICAgICAgIHNlZzEuYWJvdmUgPSBzZWcyO1xuICAgICAgICAgICAgICAgIHNlZzIuYmVsb3cgPSBzZWcxO1xuICAgICAgICAgICAgICAgIHNlZzEuYmVsb3cgPSBzZWdCO1xuICAgICAgICAgICAgICAgIHNlZzIuYWJvdmUgPSBzZWdBO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlZ0EpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEySW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnMi5rZXksIHNlZ0Eua2V5KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYTJJbnRlcnNlY3Rpb25Qb2ludCAmJiAhb3V0cHV0LmZpbmQoYTJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhMkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogYTJJbnRlcnNlY3Rpb25Qb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Eua2V5LCBzZWcyLmtleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhMkludGVyc2VjdGlvblBvaW50LCBhMkludGVyc2VjdGlvblBvaW50RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgYTJJbnRlcnNlY3Rpb25Qb2ludDonICsgYTJJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VnQikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYjFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWcxLmtleSwgc2VnQi5rZXkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChiMUludGVyc2VjdGlvblBvaW50ICYmICFvdXRwdXQuZmluZChiMUludGVyc2VjdGlvblBvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGIxSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBiMUludGVyc2VjdGlvblBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnMS5rZXksIHNlZ0Iua2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGIxSW50ZXJzZWN0aW9uUG9pbnQsIGIxSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBiMUludGVyc2VjdGlvblBvaW50OicgKyBiMUludGVyc2VjdGlvblBvaW50LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHdpbmRvdy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgd2luZG93LnF1ZXVlID0gcXVldWU7XG5cbiAgICByZXR1cm4gb3V0cHV0LmtleXMoKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XG4iLCJ2YXIgRVBTID0gMUUtOTtcclxuXHJcbmZ1bmN0aW9uIFV0aWxzKCkge307XHJcblxyXG5VdGlscy5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLypcclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LzQtdC90YzRiNC1IDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L7RgdGC0LDQstC40YIgYSDQv9C+INC80LXQvdGM0YjQtdC80YMg0LjQvdC00LXQutGB0YMsINGH0LXQvCBiLCDRgtC+INC10YHRgtGMLCBhINC40LTRkdGCINC/0LXRgNCy0YvQvC5cclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LLQtdGA0L3RkdGCIDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC+0YHRgtCw0LLQuNGCIGEg0LggYiDQvdC10LjQt9C80LXQvdC90YvQvNC4INC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC00YDRg9CzINC6INC00YDRg9Cz0YMsXHJcbiAgICAgICAgICAgINC90L4g0L7RgtGB0L7RgNGC0LjRgNGD0LXRgiDQuNGFINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC60L4g0LLRgdC10Lwg0LTRgNGD0LPQuNC8INGN0LvQtdC80LXQvdGC0LDQvC5cclxuICAgICAgICAgICAg0J7QsdGA0LDRgtC40YLQtSDQstC90LjQvNCw0L3QuNC1OiDRgdGC0LDQvdC00LDRgNGCIEVDTUFzY3JpcHQg0L3QtSDQs9Cw0YDQsNC90YLQuNGA0YPQtdGCINC00LDQvdC90L7QtSDQv9C+0LLQtdC00LXQvdC40LUsINC4INC10LzRgyDRgdC70LXQtNGD0Y7RgiDQvdC1INCy0YHQtSDQsdGA0LDRg9C30LXRgNGLXHJcbiAgICAgICAgICAgICjQvdCw0L/RgNC40LzQtdGALCDQstC10YDRgdC40LggTW96aWxsYSDQv9C+INC60YDQsNC50L3QtdC5INC80LXRgNC1LCDQtNC+IDIwMDMg0LPQvtC00LApLlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQsdC+0LvRjNGI0LUgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QvtGB0YLQsNCy0LjRgiBiINC/0L4g0LzQtdC90YzRiNC10LzRgyDQuNC90LTQtdC60YHRgywg0YfQtdC8IGEuXHJcbiAgICAgICAg0KTRg9C90LrRhtC40Y8gY29tcGFyZUZ1bmN0aW9uKGEsIGIpINC00L7Qu9C20L3QsCDQstGB0LXQs9C00LAg0LLQvtC30LLRgNCw0YnQsNGC0Ywg0L7QtNC40L3QsNC60L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQtNC70Y8g0L7Qv9GA0LXQtNC10LvRkdC90L3QvtC5INC/0LDRgNGLINGN0LvQtdC80LXQvdGC0L7QsiBhINC4IGIuXHJcbiAgICAgICAgICAgINCV0YHQu9C4INCx0YPQtNGD0YIg0LLQvtC30LLRgNCw0YnQsNGC0YzRgdGPINC90LXQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQtSDRgNC10LfRg9C70YzRgtCw0YLRiywg0L/QvtGA0Y/QtNC+0Log0YHQvtGA0YLQuNGA0L7QstC60Lgg0LHRg9C00LXRgiDQvdC1INC+0L/RgNC10LTQtdC70ZHQvS5cclxuICAgICovXHJcbiAgICAvLyBwb2ludHMgY29tcGFyYXRvclxyXG4gICAgY29tcGFyZVBvaW50czogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICAgICAgeDIgPSBiWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGJbMV07XHJcblxyXG4gICAgICAgIGlmICh4MSA+IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPiB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4MSA8IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPCB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeDEgPT09IHgyICYmIHkxID09PSB5Mikge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBhcmVTZWdtZW50czE6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG5cclxuICAgICAgICBpZiAoeTEgPCB5Mykge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh5MSA+IHkzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICAgICAgLy8gZmlyc3QsIGNoZWNrIGxlZnQtZW5kc1xyXG5cclxuICAgICAgICAvLyB2YXIgeCA9IE1hdGgubWF4KE1hdGgubWluKHgxLCB4MiksIE1hdGgubWluKHgzLCB4NCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd4OiAnICsgeCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3kgZnJvbSB4OiAnICsgZ2V0WShiLCB4KSk7XHJcbiAgICAgICAgdmFyIGF5ID0gIGdldFkoYSwgdGhpcy54KTtcclxuICAgICAgICB2YXIgYnkgPSAgZ2V0WShiLCB0aGlzLngpO1xyXG4gICAgICAgIC8vIHJldHVybiBnZXRZKGEsIHgpIDwgZ2V0WShiLCB4KSAtIEVQUztcclxuICAgICAgICAvLyBMLm1hcmtlcihMLmxhdExuZyhbdGhpcy54LCBheV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzEgPiAyJykuYWRkVG8obWFwKTtcclxuICAgICAgICAvLyBMLnBvbHlsaW5lKFtcclxuICAgICAgICAvLyAgICAgTC5sYXRMbmcoW3RoaXMueCwgNTVdLnNsaWNlKCkucmV2ZXJzZSgpKSxcclxuICAgICAgICAvLyAgICAgTC5sYXRMbmcoW3RoaXMueCwgNTddLnNsaWNlKCkucmV2ZXJzZSgpKVxyXG4gICAgICAgIC8vIF0sIHtcclxuICAgICAgICAvLyAgICAgd2VpZ2h0OiAxXHJcbiAgICAgICAgLy8gfSkuYmluZFBvcHVwKCcnICsgdGhpcy54KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIC8vIEwubWFya2VyKEwubGF0TG5nKFt4LCBieV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzIgPiAxJykuYWRkVG8obWFwKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGF5IC0gYnkpID4gRVBTICYmIGF5IDwgYnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoYXkgLSBieSkgPiBFUFMgJiYgYXkgPiBieSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGEubGVmdFBvaW50ID0gYi5sZWZ0UG9pbnRcclxuICAgICAgICAvLyBjaGVjayByaWdodFxyXG5cclxuICAgICAgICB4ID0gTWF0aC5taW4oTWF0aC5tYXgoeDEsIHgyKSwgTWF0aC5tYXgoeDMsIHg0KSk7XHJcbiAgICAgICAgYXkgPSAgZ2V0WShhLCB4KTtcclxuICAgICAgICBieSA9ICBnZXRZKGIsIHgpO1xyXG5cclxuICAgICAgICAvLyBMLm1hcmtlcihMLmxhdExuZyhbdGhpcy54LCBheV0uc2xpY2UoKS5yZXZlcnNlKCkpKS5iaW5kUG9wdXAoJzEgPiAyJykuYWRkVG8obWFwKTtcclxuICAgICAgICBpZiAoTWF0aC5hYnMoYXkgLSBieSkgPiBFUFMgJiYgYXkgPCBieSkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhheSAtIGJ5KSA+IEVQUyAmJiBheSA+IGJ5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcblxyXG5cclxuICAgICAgICAvLyBpZiAoeTEgPCBieSkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmICh5MSA+IGJ5KSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAxO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAwO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcblxyXG4gICAgZmluZEVxdWF0aW9uOiBmdW5jdGlvbiAoc2VnbWVudCkge1xyXG4gICAgICAgIHZhciB4MSA9IHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gc2VnbWVudFswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IHNlZ21lbnRbMV1bMV0sXHJcbiAgICAgICAgICAgIGEgPSB5MSAtIHkyLFxyXG4gICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhhICsgJ3ggKyAnICsgYiArICd5ICsgJyArIGMgKyAnID0gMCcpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBBZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjMxOTgvaG93LWRvLXlvdS1kZXRlY3Qtd2hlcmUtdHdvLWxpbmUtc2VnbWVudHMtaW50ZXJzZWN0LzE5NjgzNDUjMTk2ODM0NVxyXG4gICAgYmV0d2VlbjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcclxuICAgICAgICAvLyB2YXIgZXBzID0gMC4wMDAwMDAxO1xyXG5cclxuICAgICAgICByZXR1cm4gYS1FUFMgPD0gYiAmJiBiIDw9IGMrRVBTO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgICAgIHZhciB4ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgIHZhciB5ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgICAgIGlmIChpc05hTih4KXx8aXNOYU4oeSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDIsIHgsIHgxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeTEgPj0geTIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkyLCB5LCB5MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHgzID49IHg0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4NCwgeCwgeDMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHgzLCB4LCB4NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5MyA+PSB5NCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTQsIHksIHkzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3gsIHldO1xyXG4gICAgfSxcclxuXHJcbiAgICBwb2ludE9uTGluZTogZnVuY3Rpb24gKGxpbmUsIHBvaW50KSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXSxcclxuICAgICAgICAgICAgZW5kID0gbGluZVsxXSxcclxuICAgICAgICAgICAgeDEgPSBiZWdpblswXSxcclxuICAgICAgICAgICAgeTEgPSBiZWdpblsxXSxcclxuICAgICAgICAgICAgeDIgPSBlbmRbMF0sXHJcbiAgICAgICAgICAgIHkyID0gZW5kWzFdLFxyXG4gICAgICAgICAgICB4ID0gcG9pbnRbMF0sXHJcbiAgICAgICAgICAgIHkgPSBwb2ludFsxXTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoeCAtIHgxKSAqICh5MiAtIHkxKSAtICh5IC0geTEpICogKHgyIC0geDEpID09PSAwKSAmJiAoKHggPiB4MSAmJiB4IDwgeDIpIHx8ICh4ID4geDIgJiYgeCA8IHgxKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRZOiBmdW5jdGlvbiAocG9pbnQxLCBwb2ludDIsIHgpIHtcclxuICAgICAgICB2YXIgeDEgPSBwb2ludDFbMF0sXHJcbiAgICAgICAgICAgIHkxID0gcG9pbnQxWzFdLFxyXG4gICAgICAgICAgICB4MiA9IHBvaW50MlswXSxcclxuICAgICAgICAgICAgeTIgPSBwb2ludDJbMV0sXHJcbiAgICAgICAgICAgIGEgPSB5MSAtIHkyLFxyXG4gICAgICAgICAgICBiID0geDIgLSB4MSxcclxuICAgICAgICAgICAgYyA9IHgxICogeTIgLSB4MiAqIHkxO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICgtYyAtIGEgKiB4KSAvIGI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFkoc2VnbWVudCwgeCkge1xyXG4gICAgdmFyIHgxID0gc2VnbWVudFswXVswXSxcclxuICAgICAgICB5MSA9IHNlZ21lbnRbMF1bMV0sXHJcbiAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgIHkyID0gc2VnbWVudFsxXVsxXTtcclxuXHJcbiAgICAvLyDQtdGB0LvQuCDQvtGC0YDQtdC30L7QuiDQs9C+0YDQuNC30L7QvdGC0LDQu9C10L0sXHJcbiAgICAvLyDQstC10YDQvdC10Lwg0L/RgNC+0YHRgtC+IHkg0L/RgNCw0LLQvtCz0L4g0LrQvtC90YbQsFxyXG4gICAgaWYgKE1hdGguYWJzKHgyIC0geDEpIDwgRVBTKSB7XHJcbiAgICAgICAgcmV0dXJuIHkxO1xyXG4gICAgfVxyXG4gICAgLy8g0LIg0L7RgdGC0LDQu9GM0L3Ri9GFINGB0LvRg9GH0LDRj9GFXHJcbiAgICAvLyDQsdC10YDQtdC8INC/0YDQvtC/0L7RgNGG0LjRjlxyXG4gICAgcmV0dXJuIHkxICsgKHkyIC0geTEpICogKHggLSB4MSkgLyAoeDIgLSB4MSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IFV0aWxzO1xyXG4iXX0=
