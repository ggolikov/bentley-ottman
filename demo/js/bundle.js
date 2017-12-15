(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [
// [[37.576589059608146,55.778272295314814],[37.57574935424275,55.70104339022442]],
// [[37.56260638695059,55.72944065081474],[37.608857685983835,55.76952468620582]],
// [[37.62052551114358,55.716581515725764],[37.737585270471534,55.66059951849475]],
[[37.53966296998365, 55.776081837506865], [37.71943461998793, 55.705676857929866]], [[37.67826318656725, 55.680881457597856], [37.6354909366176, 55.838840931769305]]];

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
    random = true,
    pointsCount = 30,
    lines = [];

if (random) {
    data = [];
    var points = turf.randomPoint(pointsCount, {
        bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
    });

    var coords = points.features.map(function (feature) {
        return feature.geometry.coordinates;
    });

    for (var i = 0; i < coords.length; i += 2) {
        data.push([coords[i], coords[i + 1]]);
    }
    // console.log(JSON.stringify(data));
}

// drawLines(data);
console.log(pointsCount / 2);
console.time('counting...');
var ps = findIntersections(data, map);
console.timeEnd('counting...');
console.log(ps);
console.log(ps.length);

ps.forEach(function (p) {
    // L.circleMarker(L.latLng(p.slice().reverse()), {radius: 5, color: 'blue', fillColor: 'blue'}).addTo(map);
});

function drawLines(array) {
    array.forEach(function (line) {
        var begin = line[0].slice().reverse(),
            end = line[1].slice().reverse();

        L.circleMarker(L.latLng(begin), { radius: 2, fillColor: "#FFFF00", weight: 2 }).addTo(map);
        L.circleMarker(L.latLng(end), { radius: 2, fillColor: "#FFFF00", weight: 2 }).addTo(map);
        L.polyline([begin, end], { weight: 1 }).addTo(map);
    });
}

// console.log(ps);

},{"../../index":3,"../data/index.js":1}],3:[function(require,module,exports){
var findIntersections = require('./src/sweepline.js');

module.exports = findIntersections;

},{"./src/sweepline.js":8}],4:[function(require,module,exports){
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
var EPS = 1E-9;
/**
 * @param a vector
 * @param b vector
 * @param c vector
 */
function onSegment(a, b, c) {
    var x1 = a[0],
        x2 = b[0],
        x3 = c[0],
        y1 = a[1],
        y2 = b[1],
        y3 = c[1];

    return Math.min(x1, x2) <= x3 && x3 <= Math.max(x1, x2) && Math.min(y1, y2) <= y3 && y3 <= Math.max(y1, y2);
}

/**
 * ac x bc
 * @param a vector
 * @param b vector
 * @param c vector
 */
function direction(a, b, c) {
    var x1 = a[0],
        x2 = b[0],
        x3 = c[0],
        y1 = a[1],
        y2 = b[1],
        y3 = c[1];

    return (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1);
}

/**
 * @param a segment1
 * @param b segment2
 */
function segmentsIntersect(a, b) {
    var p1 = a[0],
        p2 = a[1],
        p3 = b[0],
        p4 = b[1],
        d1 = direction(p3, p4, p1),
        d2 = direction(p3, p4, p2),
        d3 = direction(p1, p2, p3),
        d4 = direction(p1, p2, p4);

    if ((d1 > 0 && d2 < 0 || d1 < 0 && d2 > 0) && (d3 > 0 && d4 < 0 || d3 < 0 && d4 > 0)) {
        return true;
    } else if (d1 === 0 && onSegment(p3, p4, p1)) {
        return true;
    } else if (d2 === 0 && onSegment(p3, p4, p2)) {
        return true;
    } else if (d3 === 0 && onSegment(p1, p2, p3)) {
        return true;
    } else if (d4 === 0 && onSegment(p1, p2, p4)) {
        return true;
    }
    return false;
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
            if (!between(x2, x, x1)) {
                return false;
            }
        } else {
            if (!between(x1, x, x2)) {
                return false;
            }
        }
        if (y1 >= y2) {
            if (!between(y2, y, y1)) {
                return false;
            }
        } else {
            if (!between(y1, y, y2)) {
                return false;
            }
        }
        if (x3 >= x4) {
            if (!between(x4, x, x3)) {
                return false;
            }
        } else {
            if (!between(x3, x, x4)) {
                return false;
            }
        }
        if (y3 >= y4) {
            if (!between(y4, y, y3)) {
                return false;
            }
        } else {
            if (!between(y3, y, y4)) {
                return false;
            }
        }
    }
    return [x, y];
}

function between(a, b, c) {
    return a - EPS <= b && b <= c + EPS;
}

function compareSegments(a, b) {
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
            if (this.position === 'before') {
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
};

function comparePoints(a, b) {
    var aIsArray = Array.isArray(a),
        bIsArray = Array.isArray(b),
        x1 = aIsArray ? a[0] : a.x,
        y1 = aIsArray ? a[1] : a.y,
        x2 = bIsArray ? b[0] : b.x,
        y2 = bIsArray ? b[1] : b.y;

    if (x1 > x2 || x1 === x2 && y1 > y2) {
        return 1;
    } else if (x1 < x2 || x1 === x2 && y1 < y2) {
        return -1;
    } else if (x1 === x2 && y1 === y2) {
        return 0;
    }
}

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
};

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
};

module.exports = {
    EPS: EPS,
    onSegment: onSegment,
    direction: direction,
    segmentsIntersect: segmentsIntersect,
    findSegmentsIntersection: findSegmentsIntersection,
    compareSegments: compareSegments,
    comparePoints: comparePoints
};

},{}],6:[function(require,module,exports){
var Point = function (coords, type) {
    this.x = coords[0];
    this.y = coords[1];
    this.type = type;
    this.segments = [];
};

module.exports = Point;

},{}],7:[function(require,module,exports){
function Sweepline(position) {
    this.x = null;
    this.position = position;
}

Sweepline.prototype.setPosition = function (position) {
    this.position = position;
};
Sweepline.prototype.setX = function (x) {
    this.x = x;
};

module.exports = Sweepline;

},{}],8:[function(require,module,exports){
var Tree = require('avl'),
    Sweepline = require('./sl'),
    Point = require('./point'),
    utils = require('./geometry/geometry');

// var sweepline = new Sweepline('before'),
//     queue = new Tree(utils.comparePoints),
//     status = new Tree(utils.compareSegments.bind(sweepline)),
//     output = new Tree(utils.comparePoints);

/**
* @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
*/
function findIntersections(segments, map) {
    var sweepline = new Sweepline('before'),
        queue = new Tree(utils.comparePoints),
        status = new Tree(utils.compareSegments.bind(sweepline)),
        output = new Tree(utils.comparePoints);

    segments.forEach(function (segment, i, a) {
        segment.sort(utils.comparePoints);
        var begin = new Point(segment[0], 'begin'),
            end = new Point(segment[1], 'end');

        if (!queue.contains(begin)) {
            queue.insert(begin, begin);
            begin.segments.push(segment);
        } else {
            begin = queue.find(begin).key;
            begin.segments.push(segment);
        }

        if (!queue.contains(end)) {
            queue.insert(end, end);
        }
    });
    while (!queue.isEmpty()) {
        var point = queue.pop();
        // console.log(status.toString());
        handleEventPoint(point.key, status, output, queue, sweepline, map);
    }

    // window.status = status;
    // window.queue = queue;
    return output.keys().map(function (key) {
        return [key.x, key.y];
    });
}

function handleEventPoint(point, status, output, queue, sweepline, map) {
    // L.circleMarker(L.latLng([point.y, point.x]), {radius: 5, color: 'blue', fillColor: 'blue'}).addTo(map);
    sweepline.setPosition('before');
    sweepline.setX(point.x);
    // step 1
    var Up = point.segments,
        // segments, for which this is the left end
    Lp = [],
        // segments, for which this is the right end
    Cp = []; // // segments, for which this is an inner point

    // step 2
    status.forEach(function (node, i) {
        var segment = node.key,
            segmentBegin = segment[0],
            segmentEnd = segment[1];

        // count right-ends
        if (point.x === segmentEnd[0] && point.y === segmentEnd[1]) {
            Lp.push(segment);
            // count inner points
        } else {
            // filter left ends
            if (!(point.x === segmentBegin[0] && point.y === segmentBegin[1])) {
                if (utils.direction(segmentBegin, segmentEnd, [point.x, point.y]) < utils.EPS && utils.onSegment(segmentBegin, segmentEnd, [point.x, point.y])) {
                    Cp.push(segment);
                }
            }
        }
    });
    // step 3
    // handle every intersection
    // there is always one of cases: Up.length || Cp.length || Lp.length
    // point in always the left || the right || on-segment
    if ([].concat(Up, Lp, Cp).length > 1) {
        output.insert(point, point);
    };

    // step 5
    for (var j = 0; j < Cp.length; j++) {
        status.remove(Cp[j]);
    }

    sweepline.setPosition('after');

    // step 6 Insert intersecting,
    // (step 7) here is the segments order changing
    for (var k = 0; k < Up.length; k++) {
        status.insert(Up[k]);
    }
    for (var l = 0; l < Cp.length; l++) {
        status.insert(Cp[l]);
    }
    // handle right end-point case
    if (Up.length === 0 && Cp.length === 0) {
        for (var i = 0; i < Lp.length; i++) {
            var s = Lp[i],
                sNode = status.find(s),
                sl = status.prev(sNode),
                sr = status.next(sNode);

            if (sl && sr) {
                findNewEvent(sl.key, sr.key, point, output, queue);
            }

            status.remove(s);
        }
    } else {
        var UCp = [].concat(Up, Cp).sort(utils.compareSegments),
            UCpmin = UCp[0],
            sllNode = status.find(UCpmin),
            UCpmax = UCp[UCp.length - 1],
            srrNode = status.find(UCpmax),
            sll = sllNode && status.prev(sllNode),
            srr = srrNode && status.next(srrNode);

        if (sll && UCpmin) {
            findNewEvent(sll.key, UCpmin, point, output, queue);
        }

        if (srr && UCpmax) {
            findNewEvent(srr.key, UCpmax, point, output, queue);
        }

        for (var j = 0; j < Lp.length; j++) {
            status.remove(Lp[j]);
        }
    }
    return output;
}

function findNewEvent(sl, sr, point, output, queue) {
    var intersectionCoords = utils.findSegmentsIntersection(sl, sr),
        intersectionPoint;

    if (intersectionCoords) {
        intersectionPoint = new Point(intersectionCoords, 'intersection');
        queue.insert(intersectionPoint, intersectionPoint);
        if (!output.contains(intersectionPoint)) {
            output.insert(intersectionPoint, intersectionPoint);
        }
    }
}
module.exports = findIntersections;
// module.exports = {
//     findIntersections: findIntersections,
//     handleEventPoint: handleEventPoint
// };

},{"./geometry/geometry":5,"./point":6,"./sl":7,"avl":4}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXGdlb21ldHJ5XFxnZW9tZXRyeS5qcyIsInNyY1xccG9pbnQuanMiLCJzcmNcXHNsLmpzIiwic3JjXFxzd2VlcGxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDYjtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUMsaUJBQUQsRUFBbUIsa0JBQW5CLENBQUQsRUFBd0MsQ0FBQyxpQkFBRCxFQUFtQixrQkFBbkIsQ0FBeEMsQ0FKYSxFQUtiLENBQUMsQ0FBQyxpQkFBRCxFQUFtQixrQkFBbkIsQ0FBRCxFQUF3QyxDQUFDLGdCQUFELEVBQWtCLGtCQUFsQixDQUF4QyxDQUxhLENBQWpCOzs7QUNBQSxJQUFJLG9CQUFvQixRQUFRLGFBQVIsQ0FBeEI7QUFDQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksTUFBTSxFQUFFLFNBQUYsQ0FBWSxpRUFBWixFQUErRTtBQUNqRixhQUFTLEVBRHdFO0FBRWpGLGlCQUFhO0FBRm9FLENBQS9FLENBQVY7QUFBQSxJQUlJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFULENBSlo7QUFBQSxJQUtJLE1BQU0sSUFBSSxFQUFFLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEVBQUMsUUFBUSxDQUFDLEdBQUQsQ0FBVCxFQUFnQixRQUFRLEtBQXhCLEVBQStCLE1BQU0sRUFBckMsRUFBeUMsU0FBUyxFQUFsRCxFQUFqQixDQUxWO0FBQUEsSUFNSSxPQUFPLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQU5YOztBQVFBLE9BQU8sR0FBUCxHQUFhLEdBQWI7O0FBRUEsSUFBSSxTQUFTLElBQUksU0FBSixF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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbnRCQSxJQUFJLE1BQU0sSUFBVjtBQUNBOzs7OztBQUtBLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QjtBQUN4QixRQUFJLEtBQUssRUFBRSxDQUFGLENBQVQ7QUFBQSxRQUNJLEtBQUssRUFBRSxDQUFGLENBRFQ7QUFBQSxRQUVJLEtBQUss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QixNQUFNLHdCQUFOLENBQStCLEVBQS9CLEVBQW1DLEVBQW5DLENBQXpCO0FBQUEsUUFDSSxpQkFESjs7QUFHQSxRQUFJLGtCQUFKLEVBQXdCO0FBQ3BCLDRCQUFvQixJQUFJLEtBQUosQ0FBVSxrQkFBVixFQUE4QixjQUE5QixDQUFwQjtBQUNBLGNBQU0sTUFBTixDQUFhLGlCQUFiLEVBQWdDLGlCQUFoQztBQUNBLFlBQUksQ0FBQyxPQUFPLFFBQVAsQ0FBZ0IsaUJBQWhCLENBQUwsRUFBeUM7QUFDckMsbUJBQU8sTUFBUCxDQUFjLGlCQUFkLEVBQWlDLGlCQUFqQztBQUNIO0FBQ0o7QUFDSjtBQUNELE9BQU8sT0FBUCxHQUFpQixpQkFBakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICAvLyBbWzM3LjU3NjU4OTA1OTYwODE0Niw1NS43NzgyNzIyOTUzMTQ4MTRdLFszNy41NzU3NDkzNTQyNDI3NSw1NS43MDEwNDMzOTAyMjQ0Ml1dLFxuICAgIC8vIFtbMzcuNTYyNjA2Mzg2OTUwNTksNTUuNzI5NDQwNjUwODE0NzRdLFszNy42MDg4NTc2ODU5ODM4MzUsNTUuNzY5NTI0Njg2MjA1ODJdXSxcbiAgICAvLyBbWzM3LjYyMDUyNTUxMTE0MzU4LDU1LjcxNjU4MTUxNTcyNTc2NF0sWzM3LjczNzU4NTI3MDQ3MTUzNCw1NS42NjA1OTk1MTg0OTQ3NV1dLFxuICAgIFtbMzcuNTM5NjYyOTY5OTgzNjUsNTUuNzc2MDgxODM3NTA2ODY1XSxbMzcuNzE5NDM0NjE5OTg3OTMsNTUuNzA1Njc2ODU3OTI5ODY2XV0sXG4gICAgW1szNy42NzgyNjMxODY1NjcyNSw1NS42ODA4ODE0NTc1OTc4NTZdLFszNy42MzU0OTA5MzY2MTc2LDU1LjgzODg0MDkzMTc2OTMwNV1dXG5dO1xuIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9pbmRleC5qcycpO1xuXG52YXIgb3NtID0gTC50aWxlTGF5ZXIoJ2h0dHA6Ly97c30uYmFzZW1hcHMuY2FydG9jZG4uY29tL2xpZ2h0X25vbGFiZWxzL3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgbWF4Wm9vbTogMjIsXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5vcmdcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+J1xuICAgIH0pLFxuICAgIHBvaW50ID0gTC5sYXRMbmcoWzU1Ljc1MzIxMCwgMzcuNjIxNzY2XSksXG4gICAgbWFwID0gbmV3IEwuTWFwKCdtYXAnLCB7bGF5ZXJzOiBbb3NtXSwgY2VudGVyOiBwb2ludCwgem9vbTogMTEsIG1heFpvb206IDIyfSksXG4gICAgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jyk7XG5cbndpbmRvdy5tYXAgPSBtYXA7XG5cbnZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCksXG4gICAgbiA9IGJvdW5kcy5fbm9ydGhFYXN0LmxhdCxcbiAgICBlID0gYm91bmRzLl9ub3J0aEVhc3QubG5nLFxuICAgIHMgPSBib3VuZHMuX3NvdXRoV2VzdC5sYXQsXG4gICAgdyA9IGJvdW5kcy5fc291dGhXZXN0LmxuZyxcbiAgICBoZWlnaHQgPSBuIC0gcyxcbiAgICB3aWR0aCA9IGUgLSB3LFxuICAgIHFIZWlnaHQgPSBoZWlnaHQgLyA0LFxuICAgIHFXaWR0aCA9IHdpZHRoIC8gNCxcbiAgICByYW5kb20gPSB0cnVlLFxuICAgIHBvaW50c0NvdW50ID0gMzAsXG4gICAgbGluZXMgPSBbXTtcblxuaWYgKHJhbmRvbSkge1xuICAgIGRhdGEgPSBbXTtcbiAgICB2YXIgcG9pbnRzID0gdHVyZi5yYW5kb21Qb2ludChwb2ludHNDb3VudCwge1xuICAgICAgICBiYm94OiBbdyArIHFXaWR0aCwgcyArIHFIZWlnaHQsIGUgLSBxV2lkdGgsIG4gLSBxSGVpZ2h0XVxuICAgIH0pO1xuXG4gICAgdmFyIGNvb3JkcyA9IHBvaW50cy5mZWF0dXJlcy5tYXAoZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgICAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICB9KVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKz0yKSB7XG4gICAgICAgIGRhdGEucHVzaChbY29vcmRzW2ldLCBjb29yZHNbaSsxXV0pO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cblxuLy8gZHJhd0xpbmVzKGRhdGEpO1xuY29uc29sZS5sb2cocG9pbnRzQ291bnQgLyAyKTtcbmNvbnNvbGUudGltZSgnY291bnRpbmcuLi4nKTtcbnZhciBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGRhdGEsIG1hcCk7XG5jb25zb2xlLnRpbWVFbmQoJ2NvdW50aW5nLi4uJyk7XG5jb25zb2xlLmxvZyhwcyk7XG5jb25zb2xlLmxvZyhwcy5sZW5ndGgpO1xuXG5wcy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgLy8gTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSksIHtyYWRpdXM6IDUsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYWRkVG8obWFwKTtcbn0pXG5cbmZ1bmN0aW9uIGRyYXdMaW5lcyhhcnJheSkge1xuICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXS5zbGljZSgpLnJldmVyc2UoKSxcbiAgICAgICAgICAgIGVuZCA9IGxpbmVbMV0uc2xpY2UoKS5yZXZlcnNlKCk7XG5cbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoYmVnaW4pLCB7cmFkaXVzOiAyLCBmaWxsQ29sb3I6IFwiI0ZGRkYwMFwiLCB3ZWlnaHQ6IDJ9KS5hZGRUbyhtYXApO1xuICAgICAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhlbmQpLCB7cmFkaXVzOiAyLCBmaWxsQ29sb3I6IFwiI0ZGRkYwMFwiLCB3ZWlnaHQ6IDJ9KS5hZGRUbyhtYXApO1xuICAgICAgICBMLnBvbHlsaW5lKFtiZWdpbiwgZW5kXSwge3dlaWdodDogMX0pLmFkZFRvKG1hcCk7XG4gICAgfSk7XG59XG5cbi8vIGNvbnNvbGUubG9nKHBzKTtcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4vc3JjL3N3ZWVwbGluZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmF2bCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQcmludHMgdHJlZSBob3Jpem9udGFsbHlcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcHJpbnQgKHJvb3QsIHByaW50Tm9kZSkge1xuICBpZiAoIHByaW50Tm9kZSA9PT0gdm9pZCAwICkgcHJpbnROb2RlID0gZnVuY3Rpb24gKG4pIHsgcmV0dXJuIG4ua2V5OyB9O1xuXG4gIHZhciBvdXQgPSBbXTtcbiAgcm93KHJvb3QsICcnLCB0cnVlLCBmdW5jdGlvbiAodikgeyByZXR1cm4gb3V0LnB1c2godik7IH0sIHByaW50Tm9kZSk7XG4gIHJldHVybiBvdXQuam9pbignJyk7XG59XG5cbi8qKlxuICogUHJpbnRzIGxldmVsIG9mIHRoZSB0cmVlXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgcHJlZml4XG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgIGlzVGFpbFxuICogQHBhcmFtICB7RnVuY3Rpb24oaW46c3RyaW5nKTp2b2lkfSAgICBvdXRcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSAgcHJpbnROb2RlXG4gKi9cbmZ1bmN0aW9uIHJvdyAocm9vdCwgcHJlZml4LCBpc1RhaWwsIG91dCwgcHJpbnROb2RlKSB7XG4gIGlmIChyb290KSB7XG4gICAgb3V0KChcIlwiICsgcHJlZml4ICsgKGlzVGFpbCA/ICfilJTilIDilIAgJyA6ICfilJzilIDilIAgJykgKyAocHJpbnROb2RlKHJvb3QpKSArIFwiXFxuXCIpKTtcbiAgICB2YXIgaW5kZW50ID0gcHJlZml4ICsgKGlzVGFpbCA/ICcgICAgJyA6ICfilIIgICAnKTtcbiAgICBpZiAocm9vdC5sZWZ0KSAgeyByb3cocm9vdC5sZWZ0LCAgaW5kZW50LCBmYWxzZSwgb3V0LCBwcmludE5vZGUpOyB9XG4gICAgaWYgKHJvb3QucmlnaHQpIHsgcm93KHJvb3QucmlnaHQsIGluZGVudCwgdHJ1ZSwgIG91dCwgcHJpbnROb2RlKTsgfVxuICB9XG59XG5cblxuLyoqXG4gKiBJcyB0aGUgdHJlZSBiYWxhbmNlZCAobm9uZSBvZiB0aGUgc3VidHJlZXMgZGlmZmVyIGluIGhlaWdodCBieSBtb3JlIHRoYW4gMSlcbiAqIEBwYXJhbSAge05vZGV9ICAgIHJvb3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQmFsYW5jZWQocm9vdCkge1xuICBpZiAocm9vdCA9PT0gbnVsbCkgeyByZXR1cm4gdHJ1ZTsgfSAvLyBJZiBub2RlIGlzIGVtcHR5IHRoZW4gcmV0dXJuIHRydWVcblxuICAvLyBHZXQgdGhlIGhlaWdodCBvZiBsZWZ0IGFuZCByaWdodCBzdWIgdHJlZXNcbiAgdmFyIGxoID0gaGVpZ2h0KHJvb3QubGVmdCk7XG4gIHZhciByaCA9IGhlaWdodChyb290LnJpZ2h0KTtcblxuICBpZiAoTWF0aC5hYnMobGggLSByaCkgPD0gMSAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LmxlZnQpICAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LnJpZ2h0KSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIElmIHdlIHJlYWNoIGhlcmUgdGhlbiB0cmVlIGlzIG5vdCBoZWlnaHQtYmFsYW5jZWRcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBDb21wdXRlIHRoZSAnaGVpZ2h0JyBvZiBhIHRyZWUuXG4gKiBIZWlnaHQgaXMgdGhlIG51bWJlciBvZiBub2RlcyBhbG9uZyB0aGUgbG9uZ2VzdCBwYXRoXG4gKiBmcm9tIHRoZSByb290IG5vZGUgZG93biB0byB0aGUgZmFydGhlc3QgbGVhZiBub2RlLlxuICpcbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gaGVpZ2h0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPyAoMSArIE1hdGgubWF4KGhlaWdodChub2RlLmxlZnQpLCBoZWlnaHQobm9kZS5yaWdodCkpKSA6IDA7XG59XG5cbi8vIGZ1bmN0aW9uIGNyZWF0ZU5vZGUgKHBhcmVudCwgbGVmdCwgcmlnaHQsIGhlaWdodCwga2V5LCBkYXRhKSB7XG4vLyAgIHJldHVybiB7IHBhcmVudCwgbGVmdCwgcmlnaHQsIGJhbGFuY2VGYWN0b3I6IGhlaWdodCwga2V5LCBkYXRhIH07XG4vLyB9XG5cbi8qKlxuICogQHR5cGVkZWYge3tcbiAqICAgcGFyZW50OiAgICAgICAgP05vZGUsXG4gKiAgIGxlZnQ6ICAgICAgICAgID9Ob2RlLFxuICogICByaWdodDogICAgICAgICA/Tm9kZSxcbiAqICAgYmFsYW5jZUZhY3RvcjogbnVtYmVyLFxuICogICBrZXk6ICAgICAgICAgICBLZXksXG4gKiAgIGRhdGE6ICAgICAgICAgIFZhbHVlXG4gKiB9fSBOb2RlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7Kn0gS2V5XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7Kn0gVmFsdWVcbiAqL1xuXG4vKipcbiAqIERlZmF1bHQgY29tcGFyaXNvbiBmdW5jdGlvblxuICogQHBhcmFtIHtLZXl9IGFcbiAqIEBwYXJhbSB7S2V5fSBiXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBERUZBVUxUX0NPTVBBUkUgKGEsIGIpIHsgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwOyB9XG5cblxuLyoqXG4gKiBTaW5nbGUgbGVmdCByb3RhdGlvblxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuZnVuY3Rpb24gcm90YXRlTGVmdCAobm9kZSkge1xuICB2YXIgcmlnaHROb2RlID0gbm9kZS5yaWdodDtcbiAgbm9kZS5yaWdodCAgICA9IHJpZ2h0Tm9kZS5sZWZ0O1xuXG4gIGlmIChyaWdodE5vZGUubGVmdCkgeyByaWdodE5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgcmlnaHROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAocmlnaHROb2RlLnBhcmVudCkge1xuICAgIGlmIChyaWdodE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9IHJpZ2h0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5yaWdodCA9IHJpZ2h0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IHJpZ2h0Tm9kZTtcbiAgcmlnaHROb2RlLmxlZnQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAocmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cbiAgcmV0dXJuIHJpZ2h0Tm9kZTtcbn1cblxuXG5mdW5jdGlvbiByb3RhdGVSaWdodCAobm9kZSkge1xuICB2YXIgbGVmdE5vZGUgPSBub2RlLmxlZnQ7XG4gIG5vZGUubGVmdCA9IGxlZnROb2RlLnJpZ2h0O1xuICBpZiAobm9kZS5sZWZ0KSB7IG5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgbGVmdE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChsZWZ0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobGVmdE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5sZWZ0ID0gbGVmdE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5yaWdodCA9IGxlZnROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gbGVmdE5vZGU7XG4gIGxlZnROb2RlLnJpZ2h0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IGxlZnROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByZXR1cm4gbGVmdE5vZGU7XG59XG5cblxuLy8gZnVuY3Rpb24gbGVmdEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgcm90YXRlTGVmdChub2RlLmxlZnQpO1xuLy8gICByZXR1cm4gcm90YXRlUmlnaHQobm9kZSk7XG4vLyB9XG5cblxuLy8gZnVuY3Rpb24gcmlnaHRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHJvdGF0ZVJpZ2h0KG5vZGUucmlnaHQpO1xuLy8gICByZXR1cm4gcm90YXRlTGVmdChub2RlKTtcbi8vIH1cblxuXG52YXIgQVZMVHJlZSA9IGZ1bmN0aW9uIEFWTFRyZWUgKGNvbXBhcmF0b3IsIG5vRHVwbGljYXRlcykge1xuICBpZiAoIG5vRHVwbGljYXRlcyA9PT0gdm9pZCAwICkgbm9EdXBsaWNhdGVzID0gZmFsc2U7XG5cbiAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3IgfHwgREVGQVVMVF9DT01QQVJFO1xuICB0aGlzLl9yb290ID0gbnVsbDtcbiAgdGhpcy5fc2l6ZSA9IDA7XG4gIHRoaXMuX25vRHVwbGljYXRlcyA9ICEhbm9EdXBsaWNhdGVzO1xufTtcblxudmFyIHByb3RvdHlwZUFjY2Vzc29ycyA9IHsgc2l6ZToge30gfTtcblxuXG4vKipcbiAqIENsZWFyIHRoZSB0cmVlXG4gKiBAcmV0dXJuIHtBVkxUcmVlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTnVtYmVyIG9mIG5vZGVzXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbnByb3RvdHlwZUFjY2Vzc29ycy5zaXplLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3NpemU7XG59O1xuXG5cbi8qKlxuICogV2hldGhlciB0aGUgdHJlZSBjb250YWlucyBhIG5vZGUgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUvZmFsc2VcbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyAoa2V5KSB7XG4gIGlmICh0aGlzLl9yb290KXtcbiAgICB2YXIgbm9kZSAgICAgPSB0aGlzLl9yb290O1xuICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgICB3aGlsZSAobm9kZSl7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcihrZXksIG5vZGUua2V5KTtcbiAgICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qIGVzbGludC1kaXNhYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuLyoqXG4gKiBTdWNjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gbmV4dCAobm9kZSkge1xuICB2YXIgc3VjY2Vzc29yID0gbm9kZTtcbiAgaWYgKHN1Y2Nlc3Nvcikge1xuICAgIGlmIChzdWNjZXNzb3IucmlnaHQpIHtcbiAgICAgIHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5yaWdodDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLmxlZnQpIHsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLmxlZnQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5yaWdodCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gc3VjY2Vzc29yOyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3VjY2Vzc29yO1xufTtcblxuXG4vKipcbiAqIFByZWRlY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uIHByZXYgKG5vZGUpIHtcbiAgdmFyIHByZWRlY2Vzc29yID0gbm9kZTtcbiAgaWYgKHByZWRlY2Vzc29yKSB7XG4gICAgaWYgKHByZWRlY2Vzc29yLmxlZnQpIHtcbiAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IubGVmdDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5yaWdodCkgeyBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnJpZ2h0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWRlY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IubGVmdCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gcHJlZGVjZXNzb3I7XG4gICAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcHJlZGVjZXNzb3I7XG59O1xuLyogZXNsaW50LWVuYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgZm9yRWFjaFxuICogQGNhbGxiYWNrIGZvckVhY2hDYWxsYmFja1xuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAqL1xuXG4vKipcbiAqIEBwYXJhbXtmb3JFYWNoQ2FsbGJhY2t9IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtBVkxUcmVlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaCAoY2FsbGJhY2spIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCBkb25lID0gZmFsc2UsIGkgPSAwO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIC8vIFJlYWNoIHRoZSBsZWZ0IG1vc3QgTm9kZSBvZiB0aGUgY3VycmVudCBOb2RlXG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIC8vIFBsYWNlIHBvaW50ZXIgdG8gYSB0cmVlIG5vZGUgb24gdGhlIHN0YWNrXG4gICAgICAvLyBiZWZvcmUgdHJhdmVyc2luZyB0aGUgbm9kZSdzIGxlZnQgc3VidHJlZVxuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQmFja1RyYWNrIGZyb20gdGhlIGVtcHR5IHN1YnRyZWUgYW5kIHZpc2l0IHRoZSBOb2RlXG4gICAgICAvLyBhdCB0aGUgdG9wIG9mIHRoZSBzdGFjazsgaG93ZXZlciwgaWYgdGhlIHN0YWNrIGlzXG4gICAgICAvLyBlbXB0eSB5b3UgYXJlIGRvbmVcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIGNhbGxiYWNrKGN1cnJlbnQsIGkrKyk7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSB2aXNpdGVkIHRoZSBub2RlIGFuZCBpdHMgbGVmdFxuICAgICAgICAvLyBzdWJ0cmVlLiBOb3csIGl0J3MgcmlnaHQgc3VidHJlZSdzIHR1cm5cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBrZXlzIGluIG9yZGVyXG4gKiBAcmV0dXJuIHtBcnJheTxLZXk+fVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24ga2V5cyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmtleSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBgZGF0YWAgZmllbGRzIG9mIGFsbCBub2RlcyBpbiBvcmRlci5cbiAqIEByZXR1cm4ge0FycmF5PFZhbHVlPn1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gdmFsdWVzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQuZGF0YSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIGF0IGdpdmVuIGluZGV4XG4gKiBAcGFyYW17bnVtYmVyfSBpbmRleFxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmF0ID0gZnVuY3Rpb24gYXQgKGluZGV4KSB7XG4gIC8vIHJlbW92ZWQgYWZ0ZXIgYSBjb25zaWRlcmF0aW9uLCBtb3JlIG1pc2xlYWRpbmcgdGhhbiB1c2VmdWxcbiAgLy8gaW5kZXggPSBpbmRleCAlIHRoaXMuc2l6ZTtcbiAgLy8gaWYgKGluZGV4IDwgMCkgaW5kZXggPSB0aGlzLnNpemUgLSBpbmRleDtcblxuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIGRvbmUgPSBmYWxzZSwgaSA9IDA7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIGlmIChpID09PSBpbmRleCkgeyByZXR1cm4gY3VycmVudDsgfVxuICAgICAgICBpKys7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1pbmltdW0ga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubWluTm9kZSA9IGZ1bmN0aW9uIG1pbk5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1heCBrZXlcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5tYXhOb2RlID0gZnVuY3Rpb24gbWF4Tm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIE1pbiBrZXlcbiAqIEByZXR1cm4gez9LZXl9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uIG1pbiAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG5cbi8qKlxuICogTWF4IGtleVxuICogQHJldHVybiB7P0tleX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gbWF4ICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuXG4vKipcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUvZmFsc2VcbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uIGlzRW1wdHkgKCkge1xuICByZXR1cm4gIXRoaXMuX3Jvb3Q7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgbm9kZSB3aXRoIHNtYWxsZXN0IGtleVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uIHBvcCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdCwgcmV0dXJuVmFsdWUgPSBudWxsO1xuICBpZiAobm9kZSkge1xuICAgIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIHJldHVyblZhbHVlID0geyBrZXk6IG5vZGUua2V5LCBkYXRhOiBub2RlLmRhdGEgfTtcbiAgICB0aGlzLnJlbW92ZShub2RlLmtleSk7XG4gIH1cbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIEZpbmQgbm9kZSBieSBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiBmaW5kIChrZXkpIHtcbiAgdmFyIHJvb3QgPSB0aGlzLl9yb290O1xuICAvLyBpZiAocm9vdCA9PT0gbnVsbCkgIHJldHVybiBudWxsO1xuICAvLyBpZiAoa2V5ID09PSByb290LmtleSkgcmV0dXJuIHJvb3Q7XG5cbiAgdmFyIHN1YnRyZWUgPSByb290LCBjbXA7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgd2hpbGUgKHN1YnRyZWUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgc3VidHJlZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIHN1YnRyZWU7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IHN1YnRyZWUgPSBzdWJ0cmVlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IHN1YnRyZWUgPSBzdWJ0cmVlLnJpZ2h0OyB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBJbnNlcnQgYSBub2RlIGludG8gdGhlIHRyZWVcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHBhcmFte1ZhbHVlfSBbZGF0YV1cbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQgKGtleSwgZGF0YSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fcm9vdCkge1xuICAgIHRoaXMuX3Jvb3QgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsLCBiYWxhbmNlRmFjdG9yOiAwLFxuICAgICAga2V5OiBrZXksIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHRoaXMuX3NpemUrKztcbiAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgfVxuXG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgdmFyIG5vZGUgID0gdGhpcy5fcm9vdDtcbiAgdmFyIHBhcmVudD0gbnVsbDtcbiAgdmFyIGNtcCAgID0gMDtcblxuICBpZiAodGhpcy5fbm9EdXBsaWNhdGVzKSB7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgICBwYXJlbnQgPSBub2RlO1xuICAgICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgICAgcGFyZW50ID0gbm9kZTtcbiAgICAgIGlmICAgIChjbXAgPD0gMCl7IG5vZGUgPSBub2RlLmxlZnQ7IH0gLy9yZXR1cm4gbnVsbDtcbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH1cblxuICB2YXIgbmV3Tm9kZSA9IHtcbiAgICBsZWZ0OiBudWxsLFxuICAgIHJpZ2h0OiBudWxsLFxuICAgIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgcGFyZW50OiBwYXJlbnQsIGtleToga2V5LCBkYXRhOiBkYXRhXG4gIH07XG4gIHZhciBuZXdSb290O1xuICBpZiAoY21wIDw9IDApIHsgcGFyZW50LmxlZnQ9IG5ld05vZGU7IH1cbiAgZWxzZSAgICAgICB7IHBhcmVudC5yaWdodCA9IG5ld05vZGU7IH1cblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgY21wID0gY29tcGFyZShwYXJlbnQua2V5LCBrZXkpO1xuICAgIGlmIChjbXAgPCAwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvLyBpbmxpbmVkXG4gICAgICAvL3ZhciBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBpbmxpbmVkXG4gICAgICAvLyB2YXIgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIG5ld1Jvb3QgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICB0aGlzLl9zaXplKys7XG4gIHJldHVybiBuZXdOb2RlO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgdGhlIG5vZGUgZnJvbSB0aGUgdHJlZS4gSWYgbm90IGZvdW5kLCByZXR1cm5zIG51bGwuXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGtleSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fcm9vdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB2YXIgY21wID0gMDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgfVxuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cblxuICB2YXIgcmV0dXJuVmFsdWUgPSBub2RlLmtleTtcbiAgdmFyIG1heCwgbWluO1xuXG4gIGlmIChub2RlLmxlZnQpIHtcbiAgICBtYXggPSBub2RlLmxlZnQ7XG5cbiAgICB3aGlsZSAobWF4LmxlZnQgfHwgbWF4LnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWF4LnJpZ2h0KSB7IG1heCA9IG1heC5yaWdodDsgfVxuXG4gICAgICBub2RlLmtleSA9IG1heC5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtYXguZGF0YTtcbiAgICAgIGlmIChtYXgubGVmdCkge1xuICAgICAgICBub2RlID0gbWF4O1xuICAgICAgICBtYXggPSBtYXgubGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWF4LmtleTtcbiAgICBub2RlLmRhdGEgPSBtYXguZGF0YTtcbiAgICBub2RlID0gbWF4O1xuICB9XG5cbiAgaWYgKG5vZGUucmlnaHQpIHtcbiAgICBtaW4gPSBub2RlLnJpZ2h0O1xuXG4gICAgd2hpbGUgKG1pbi5sZWZ0IHx8IG1pbi5yaWdodCkge1xuICAgICAgd2hpbGUgKG1pbi5sZWZ0KSB7IG1pbiA9IG1pbi5sZWZ0OyB9XG5cbiAgICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgICBpZiAobWluLnJpZ2h0KSB7XG4gICAgICAgIG5vZGUgPSBtaW47XG4gICAgICAgIG1pbiA9IG1pbi5yaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICBub2RlID0gbWluO1xuICB9XG5cbiAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50O1xuICB2YXIgcHAgICA9IG5vZGU7XG4gIHZhciBuZXdSb290O1xuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50LmxlZnQgPT09IHBwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvLyBpbmxpbmVkXG4gICAgICAvL3ZhciBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3Q7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGlubGluZWRcbiAgICAgIC8vIHZhciBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgbmV3Um9vdCA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290O1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gLTEgfHwgcGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgYnJlYWs7IH1cblxuICAgIHBwICAgPSBwYXJlbnQ7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIGlmIChub2RlLnBhcmVudCkge1xuICAgIGlmIChub2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7IG5vZGUucGFyZW50LmxlZnQ9IG51bGw7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgIHsgbm9kZS5wYXJlbnQucmlnaHQgPSBudWxsOyB9XG4gIH1cblxuICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkgeyB0aGlzLl9yb290ID0gbnVsbDsgfVxuXG4gIHRoaXMuX3NpemUtLTtcbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIEJ1bGstbG9hZCBpdGVtc1xuICogQHBhcmFte0FycmF5PEtleT59a2V5c1xuICogQHBhcmFte0FycmF5PFZhbHVlPn1bdmFsdWVzXVxuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIGxvYWQgKGtleXMsIHZhbHVlcykge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuICAgIGlmICgga2V5cyA9PT0gdm9pZCAwICkga2V5cyA9IFtdO1xuICAgIGlmICggdmFsdWVzID09PSB2b2lkIDAgKSB2YWx1ZXMgPSBbXTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShrZXlzKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0aGlzJDEuaW5zZXJ0KGtleXNbaV0sIHZhbHVlc1tpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHJlZSBpcyBiYWxhbmNlZFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuaXNCYWxhbmNlZCA9IGZ1bmN0aW9uIGlzQmFsYW5jZWQkMSAoKSB7XG4gIHJldHVybiBpc0JhbGFuY2VkKHRoaXMuX3Jvb3QpO1xufTtcblxuXG4vKipcbiAqIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJlZSAtIHByaW1pdGl2ZSBob3Jpem9udGFsIHByaW50LW91dFxuICogQHBhcmFte0Z1bmN0aW9uKE5vZGUpOnN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAocHJpbnROb2RlKSB7XG4gIHJldHVybiBwcmludCh0aGlzLl9yb290LCBwcmludE5vZGUpO1xufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIEFWTFRyZWUucHJvdG90eXBlLCBwcm90b3R5cGVBY2Nlc3NvcnMgKTtcblxucmV0dXJuIEFWTFRyZWU7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdmwuanMubWFwXG4iLCJ2YXIgRVBTID0gMUUtOTtcclxuLyoqXHJcbiAqIEBwYXJhbSBhIHZlY3RvclxyXG4gKiBAcGFyYW0gYiB2ZWN0b3JcclxuICogQHBhcmFtIGMgdmVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBvblNlZ21lbnQoYSwgYiwgYykge1xyXG4gICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgeDMgPSBjWzBdLFxyXG4gICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICB5MiA9IGJbMV0sXHJcbiAgICAgICAgeTMgPSBjWzFdO1xyXG5cclxuICAgIHJldHVybiAoTWF0aC5taW4oeDEsIHgyKSA8PSB4MykgJiYgKHgzIDw9IE1hdGgubWF4KHgxLCB4MikpICYmXHJcbiAgICAgICAgICAgKE1hdGgubWluKHkxLCB5MikgPD0geTMpICYmICh5MyA8PSBNYXRoLm1heCh5MSwgeTIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIGFjIHggYmNcclxuICogQHBhcmFtIGEgdmVjdG9yXHJcbiAqIEBwYXJhbSBiIHZlY3RvclxyXG4gKiBAcGFyYW0gYyB2ZWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIGRpcmVjdGlvbihhLCBiLCBjKSB7XHJcbiAgICB2YXIgeDEgPSBhWzBdLFxyXG4gICAgICAgIHgyID0gYlswXSxcclxuICAgICAgICB4MyA9IGNbMF0sXHJcbiAgICAgICAgeTEgPSBhWzFdLFxyXG4gICAgICAgIHkyID0gYlsxXSxcclxuICAgICAgICB5MyA9IGNbMV07XHJcblxyXG4gICAgcmV0dXJuICh4MyAtIHgxKSAqICh5MiAtIHkxKSAtICh4MiAtIHgxKSAqICh5MyAtIHkxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBhIHNlZ21lbnQxXHJcbiAqIEBwYXJhbSBiIHNlZ21lbnQyXHJcbiAqL1xyXG5mdW5jdGlvbiBzZWdtZW50c0ludGVyc2VjdChhLCBiKSB7XHJcbiAgICB2YXIgcDEgPSBhWzBdLFxyXG4gICAgICAgIHAyID0gYVsxXSxcclxuICAgICAgICBwMyA9IGJbMF0sXHJcbiAgICAgICAgcDQgPSBiWzFdLFxyXG4gICAgICAgIGQxID0gZGlyZWN0aW9uKHAzLCBwNCwgcDEpLFxyXG4gICAgICAgIGQyID0gZGlyZWN0aW9uKHAzLCBwNCwgcDIpLFxyXG4gICAgICAgIGQzID0gZGlyZWN0aW9uKHAxLCBwMiwgcDMpLFxyXG4gICAgICAgIGQ0ID0gZGlyZWN0aW9uKHAxLCBwMiwgcDQpO1xyXG5cclxuICAgIGlmICgoKGQxID4gMCAmJiBkMiA8IDApIHx8IChkMSA8IDAgJiYgZDIgPiAwKSkgJiYgKChkMyA+IDAgJiYgZDQgPCAwKSB8fCAoZDMgPCAwICYmIGQ0ID4gMCkpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQxID09PSAwICYmIG9uU2VnbWVudChwMywgcDQsIHAxKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkMiA9PT0gMCAmJiBvblNlZ21lbnQocDMsIHA0LCBwMikpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoZDMgPT09IDAgJiYgb25TZWdtZW50KHAxLCBwMiwgcDMpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQ0ID09PSAwICYmIG9uU2VnbWVudChwMSwgcDIsIHA0KSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb24gKGEsIGIpIHtcclxuICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAoKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpKTtcclxuICAgIHZhciB5ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICBpZiAoaXNOYU4oeCl8fGlzTmFOKHkpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoeDEgPj0geDIpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHgyLCB4LCB4MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHkxID49IHkyKSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5MiwgeSwgeTEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh4MyA+PSB4NCkge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeDQsIHgsIHgzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHgzLCB4LCB4NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoeTMgPj0geTQpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHk0LCB5LCB5MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW3gsIHldO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiZXR3ZWVuIChhLCBiLCBjKSB7XHJcbiAgICByZXR1cm4gYS1FUFMgPD0gYiAmJiBiIDw9IGMrRVBTO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY29tcGFyZVNlZ21lbnRzKGEsIGIpIHtcclxuICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG5cclxuICAgIHZhciBjdXJyZW50WCwgICAvLyDRgtC10LrRg9GJ0LjQuSB4INGB0LLQuNC/0LvQsNC50L3QsFxyXG4gICAgICAgIGF5LCAgICAgICAgIC8vIHkg0YLQvtGH0LrQuCDQv9C10YDQtdGB0LXRh9C10L3QuNGPINC+0YLRgNC10LfQutCwINGB0L7QsdGL0YLQuNGPIGEg0YHQviDRgdCy0LjQv9C70LDQudC90L7QvFxyXG4gICAgICAgIGJ5LCAgICAgICAgIC8vIHkg0YLQvtGH0LrQuCDQv9C10YDQtdGB0LXRh9C10L3QuNGPINC+0YLRgNC10LfQutCwINGB0L7QsdGL0YLQuNGPIGIg0YHQviDRgdCy0LjQv9C70LDQudC90L7QvFxyXG4gICAgICAgIGRlbHRhWSwgICAgIC8vINGA0LDQt9C90LjRhtCwIHkg0YLQvtGH0LXQuiDQv9C10YDQtdGB0LXRh9C10L3QuNGPXHJcbiAgICAgICAgZGVsdGFYMSwgICAgLy8g0YDQsNC30L3QuNGG0LAgeCDQvdCw0YfQsNC7INC+0YLRgNC10LfQutC+0LJcclxuICAgICAgICBkZWx0YVgyOyAgICAvLyDRgNCw0LfQvdC40YbQsCB4INC60L7QvdGG0L7QsiDQvtGC0YDQtdC30LrQvtCyXHJcblxyXG4gICAgaWYgKGEgPT09IGIpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBjdXJyZW50WCA9IHRoaXMueDtcclxuICAgIGF5ID0gZ2V0WShhLCBjdXJyZW50WCk7XHJcbiAgICBieSA9IGdldFkoYiwgY3VycmVudFgpO1xyXG4gICAgZGVsdGFZID0gYXkgLSBieTtcclxuXHJcbiAgICAvLyDRgdGA0LDQstC90LXQvdC40LUg0L3QsNC00L4g0L/RgNC+0LLQvtC00LjRgtGMINGBINGN0L/RgdC40LvQvtC90L7QvCxcclxuICAgIC8vINC40L3QsNGH0LUg0LLQvtC30LzQvtC20L3RiyDQvtGI0LjQsdC60Lgg0L7QutGA0YPQs9C70LXQvdC40Y9cclxuICAgIGlmIChNYXRoLmFicyhkZWx0YVkpID4gRVBTKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhWSA8IDAgPyAtMSA6IDE7XHJcbiAgICAvLyDQtdGB0LvQuCB5INC+0LHQtdC40YUg0YHQvtCx0YvRgtC40Lkg0YDQsNCy0L3Ri1xyXG4gICAgLy8g0L/RgNC+0LLQtdGA0Y/QtdC8INGD0LPQvtC7INC/0YDRj9C80YvRhVxyXG4gICAgLy8g0YfQtdC8INC60YDRg9GH0LUg0L/RgNGP0LzQsNGPLCDRgtC10Lwg0L3QuNC20LUg0LXQtSDQu9C10LLRi9C5INC60L7QvdC10YYsINC30L3QsNGH0LjRgiDRgdC+0LHRi9GC0LjQtSDRgNCw0YHQv9C+0LvQsNCz0LDQtdC8INC90LjQttC1XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBhU2xvcGUgPSBnZXRTbG9wZShhKSxcclxuICAgICAgICAgICAgYlNsb3BlID0gZ2V0U2xvcGUoYik7XHJcblxyXG4gICAgICAgIGlmIChhU2xvcGUgIT09IGJTbG9wZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2JlZm9yZScpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhU2xvcGUgPiBiU2xvcGUgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYVNsb3BlID4gYlNsb3BlID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g0L/QvtGB0LvQtSDRgdGA0LDQstC90LXQvdC40Y8g0L/QviB5INC/0LXRgNC10YHQtdGH0LXQvdC40Y8g0YHQviDRgdCy0LjQv9C70LDQudC90L7QvFxyXG4gICAgLy8g0Lgg0YHRgNCw0LLQvdC10L3QuNGPINGD0LrQu9C+0L3QvtCyXHJcbiAgICAvLyDQvtGB0YLQsNC10YLRgdGPINGB0LvRg9GH0LDQuSwg0LrQvtCz0LTQsCDRg9C60LvQvtC90Ysg0YDQsNCy0L3Ri1xyXG4gICAgLy8gKGlmIGFTbG9wZSA9PT0gYlNsb3BlKVxyXG4gICAgLy8g0LggMiDQvtGC0YDQtdC30LrQsCDQu9C10LbQsNGCINC90LAg0L7QtNC90L7QuSDQv9GA0Y/QvNC+0LlcclxuICAgIC8vINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1XHJcbiAgICAvLyDQv9GA0L7QstC10YDQuNC8INC/0L7Qu9C+0LbQtdC90LjQtSDQutC+0L3RhtC+0LIg0L7RgtGA0LXQt9C60L7QslxyXG4gICAgZGVsdGFYMSA9IHgxIC0geDM7XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LjQvCDQstC30LDQuNC80L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtSDQu9C10LLRi9GFINC60L7QvdGG0L7QslxyXG4gICAgaWYgKGRlbHRhWDEgIT09IDApIHtcclxuICAgICAgICByZXR1cm4gZGVsdGFYMSA8IDAgPyAtMSA6IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LjQvCDQstC30LDQuNC80L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtSDQv9GA0LDQstGL0YUg0LrQvtC90YbQvtCyXHJcbiAgICBkZWx0YVgyID0geDIgLSB4NDtcclxuXHJcbiAgICBpZiAoZGVsdGFYMiAhPT0gMCkge1xyXG4gICAgICAgIHJldHVybiBkZWx0YVgyIDwgMCA/IC0xIDogMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtGC0YDQtdC30LrQuCDRgdC+0LLQv9Cw0LTQsNGO0YJcclxuICAgIHJldHVybiAwO1xyXG5cclxufTtcclxuXHJcbmZ1bmN0aW9uIGNvbXBhcmVQb2ludHMoYSwgYikge1xyXG4gICAgdmFyIGFJc0FycmF5ID0gQXJyYXkuaXNBcnJheShhKSxcclxuICAgICAgICBiSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoYiksXHJcbiAgICAgICAgeDEgPSBhSXNBcnJheSA/IGFbMF0gOiBhLngsXHJcbiAgICAgICAgeTEgPSBhSXNBcnJheSA/IGFbMV0gOiBhLnksXHJcbiAgICAgICAgeDIgPSBiSXNBcnJheSA/IGJbMF0gOiBiLngsXHJcbiAgICAgICAgeTIgPSBiSXNBcnJheSA/IGJbMV0gOiBiLnk7XHJcblxyXG4gICAgaWYgKHgxID4geDIgfHwgKHgxID09PSB4MiAmJiB5MSA+IHkyKSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfSBlbHNlIGlmICh4MSA8IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPCB5MikpIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9IGVsc2UgaWYgKHgxID09PSB4MiAmJiB5MSA9PT0geTIpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2xvcGUoc2VnbWVudCkge1xyXG4gICAgdmFyIHgxID0gc2VnbWVudFswXVswXSxcclxuICAgICAgICB5MSA9IHNlZ21lbnRbMF1bMV0sXHJcbiAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgIHkyID0gc2VnbWVudFsxXVsxXTtcclxuXHJcbiAgICBpZiAoeDEgPT09IHgyKSB7XHJcbiAgICAgICAgcmV0dXJuICh5MSA8IHkyKSA/IEluZmluaXR5IDogLSBJbmZpbml0eTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICh5MiAtIHkxKSAvICh4MiAtIHgxKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGdldFkoc2VnbWVudCwgeCkge1xyXG4gICAgdmFyIGJlZ2luID0gc2VnbWVudFswXSxcclxuICAgICAgICBlbmQgPSBzZWdtZW50WzFdLFxyXG4gICAgICAgIHNwYW4gPSBzZWdtZW50WzFdWzBdIC0gc2VnbWVudFswXVswXSxcclxuICAgICAgICBkZWx0YVgwLCAvLyDRgNCw0LfQvdC40YbQsCDQvNC10LbQtNGDIHgg0LggeCDQvdCw0YfQsNC70LAg0L7RgtGA0LXQt9C60LBcclxuICAgICAgICBkZWx0YVgxLCAvLyDRgNCw0LfQvdC40YbQsCDQvNC10LbQtNGDIHgg0LrQvtC90YbQsCDQvtGC0YDQtdC30LrQsCDQuCB4XHJcbiAgICAgICAgaWZhYywgICAgLy8g0L/RgNC+0L/QvtGA0YbQuNGPIGRlbHRhWDAg0Log0L/RgNC+0LXQutGG0LjQuFxyXG4gICAgICAgIGZhYzsgICAgIC8vINC/0YDQvtC/0L7RgNGG0LjRjyBkZWx0YVgxINC6INC/0YDQvtC10LrRhtC40LhcclxuXHJcbiAgICAvLyDQsiDRgdC70YPRh9Cw0LUsINC10YHQu9C4IHgg0L3QtSDQv9C10YDQtdGB0LXQutCw0LXRgtGB0Y8g0YEg0L/RgNC+0LXQutGG0LjQtdC5INC+0YLRgNC10LfQutCwINC90LAg0L7RgdGMIHgsXHJcbiAgICAvLyDQstC+0LfQstGA0YnQsNC10YIgeSDQvdCw0YfQsNC70LAg0LjQu9C4INC60L7QvdGG0LAg0L7RgtGA0LXQt9C60LBcclxuICAgIGlmICh4IDw9IGJlZ2luWzBdKSB7XHJcbiAgICAgICAgcmV0dXJuIGJlZ2luWzFdO1xyXG4gICAgfSBlbHNlIGlmICh4ID49IGVuZFswXSkge1xyXG4gICAgICAgIHJldHVybiBlbmRbMV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LXRgdC70LggeCDQu9C10LbQuNGCINCy0L3Rg9GC0YDQuCDQv9GA0L7QtdC60YbQuNC4INC+0YLRgNC10LfQutCwINC90LAg0L7RgdGMIHhcclxuICAgIC8vINCy0YvRh9C40YHQu9GP0LXRgiDQv9GA0L7Qv9C+0YDRhtC40LhcclxuICAgIGRlbHRhWDAgPSB4IC0gYmVnaW5bMF07XHJcbiAgICBkZWx0YVgxID0gZW5kWzBdIC0geDtcclxuXHJcbiAgICBpZiAoZGVsdGFYMCA+IGRlbHRhWDEpIHtcclxuICAgICAgICBpZmFjID0gZGVsdGFYMCAvIHNwYW5cclxuICAgICAgICBmYWMgPSAxIC0gaWZhYztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmFjID0gZGVsdGFYMSAvIHNwYW5cclxuICAgICAgICBpZmFjID0gMSAtIGZhYztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKGJlZ2luWzFdICogZmFjKSArIChlbmRbMV0gKiBpZmFjKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgRVBTOiBFUFMsXHJcbiAgICBvblNlZ21lbnQ6IG9uU2VnbWVudCxcclxuICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgc2VnbWVudHNJbnRlcnNlY3Q6IHNlZ21lbnRzSW50ZXJzZWN0LFxyXG4gICAgZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uOiBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb24sXHJcbiAgICBjb21wYXJlU2VnbWVudHM6IGNvbXBhcmVTZWdtZW50cyxcclxuICAgIGNvbXBhcmVQb2ludHM6IGNvbXBhcmVQb2ludHNcclxufVxyXG4iLCJ2YXIgUG9pbnQgPSBmdW5jdGlvbiAoY29vcmRzLCB0eXBlKSB7XHJcbiAgICB0aGlzLnggPSBjb29yZHNbMF07XHJcbiAgICB0aGlzLnkgPSBjb29yZHNbMV07XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5zZWdtZW50cyA9IFtdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xyXG4iLCJmdW5jdGlvbiBTd2VlcGxpbmUocG9zaXRpb24pIHtcclxuICAgIHRoaXMueCA9IG51bGw7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbn1cclxuXHJcblN3ZWVwbGluZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcclxuICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxufVxyXG5Td2VlcGxpbmUucHJvdG90eXBlLnNldFggPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgdGhpcy54ID0geDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTd2VlcGxpbmU7XHJcbiIsInZhciBUcmVlID0gcmVxdWlyZSgnYXZsJyksXG4gICAgU3dlZXBsaW5lID0gcmVxdWlyZSgnLi9zbCcpLFxuICAgIFBvaW50ID0gcmVxdWlyZSgnLi9wb2ludCcpLFxuICAgIHV0aWxzID0gcmVxdWlyZSgnLi9nZW9tZXRyeS9nZW9tZXRyeScpO1xuXG5cbi8vIHZhciBzd2VlcGxpbmUgPSBuZXcgU3dlZXBsaW5lKCdiZWZvcmUnKSxcbi8vICAgICBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpLFxuLy8gICAgIHN0YXR1cyA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVTZWdtZW50cy5iaW5kKHN3ZWVwbGluZSkpLFxuLy8gICAgIG91dHB1dCA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpO1xuXG4vKipcbiogQHBhcmFtIHtBcnJheX0gc2VnbWVudHMgc2V0IG9mIHNlZ21lbnRzIGludGVyc2VjdGluZyBzd2VlcGxpbmUgW1tbeDEsIHkxXSwgW3gyLCB5Ml1dIC4uLiBbW3htLCB5bV0sIFt4biwgeW5dXV1cbiovXG5mdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9ucyhzZWdtZW50cywgbWFwKSB7XG4gICAgdmFyIHN3ZWVwbGluZSA9IG5ldyBTd2VlcGxpbmUoJ2JlZm9yZScpLFxuICAgICAgICBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpLFxuICAgICAgICBzdGF0dXMgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlU2VnbWVudHMuYmluZChzd2VlcGxpbmUpKSxcbiAgICAgICAgb3V0cHV0ID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVBvaW50cyk7XG5cbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50LCBpLCBhKSB7XG4gICAgICAgIHNlZ21lbnQuc29ydCh1dGlscy5jb21wYXJlUG9pbnRzKTtcbiAgICAgICAgdmFyIGJlZ2luID0gbmV3IFBvaW50KHNlZ21lbnRbMF0sICdiZWdpbicpLFxuICAgICAgICAgICAgZW5kID0gbmV3IFBvaW50KHNlZ21lbnRbMV0sICdlbmQnKTtcblxuICAgICAgICBpZiAoIXF1ZXVlLmNvbnRhaW5zKGJlZ2luKSkge1xuICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGJlZ2luLCBiZWdpbik7XG4gICAgICAgICAgICBiZWdpbi5zZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmVnaW4gPSBxdWV1ZS5maW5kKGJlZ2luKS5rZXk7XG4gICAgICAgICAgICBiZWdpbi5zZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFxdWV1ZS5jb250YWlucyhlbmQpKSB7XG4gICAgICAgICAgICBxdWV1ZS5pbnNlcnQoZW5kLCBlbmQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgd2hpbGUgKCFxdWV1ZS5pc0VtcHR5KCkpIHtcbiAgICAgICAgdmFyIHBvaW50ID0gcXVldWUucG9wKCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cy50b1N0cmluZygpKTtcbiAgICAgICAgaGFuZGxlRXZlbnRQb2ludChwb2ludC5rZXksIHN0YXR1cywgb3V0cHV0LCBxdWV1ZSwgc3dlZXBsaW5lLCBtYXApO1xuICAgIH1cblxuICAgIC8vIHdpbmRvdy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgLy8gd2luZG93LnF1ZXVlID0gcXVldWU7XG4gICAgcmV0dXJuIG91dHB1dC5rZXlzKCkubWFwKGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHJldHVybiBba2V5LngsIGtleS55XTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXZlbnRQb2ludChwb2ludCwgc3RhdHVzLCBvdXRwdXQsIHF1ZXVlLCBzd2VlcGxpbmUsIG1hcCkge1xuICAgIC8vIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKFtwb2ludC55LCBwb2ludC54XSksIHtyYWRpdXM6IDUsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYWRkVG8obWFwKTtcbiAgICBzd2VlcGxpbmUuc2V0UG9zaXRpb24oJ2JlZm9yZScpO1xuICAgIHN3ZWVwbGluZS5zZXRYKHBvaW50LngpO1xuICAgIC8vIHN0ZXAgMVxuICAgIHZhciBVcCA9IHBvaW50LnNlZ21lbnRzLCAvLyBzZWdtZW50cywgZm9yIHdoaWNoIHRoaXMgaXMgdGhlIGxlZnQgZW5kXG4gICAgICAgIExwID0gW10sICAgICAgICAgICAgIC8vIHNlZ21lbnRzLCBmb3Igd2hpY2ggdGhpcyBpcyB0aGUgcmlnaHQgZW5kXG4gICAgICAgIENwID0gW107ICAgICAgICAgICAgIC8vIC8vIHNlZ21lbnRzLCBmb3Igd2hpY2ggdGhpcyBpcyBhbiBpbm5lciBwb2ludFxuXG4gICAgLy8gc3RlcCAyXG4gICAgc3RhdHVzLmZvckVhY2goZnVuY3Rpb24obm9kZSwgaSkge1xuICAgICAgICB2YXIgc2VnbWVudCA9IG5vZGUua2V5LFxuICAgICAgICAgICAgc2VnbWVudEJlZ2luID0gc2VnbWVudFswXSxcbiAgICAgICAgICAgIHNlZ21lbnRFbmQgPSBzZWdtZW50WzFdO1xuXG4gICAgICAgIC8vIGNvdW50IHJpZ2h0LWVuZHNcbiAgICAgICAgaWYgKHBvaW50LnggPT09IHNlZ21lbnRFbmRbMF0gJiYgcG9pbnQueSA9PT0gc2VnbWVudEVuZFsxXSkge1xuICAgICAgICAgICAgTHAucHVzaChzZWdtZW50KTtcbiAgICAgICAgLy8gY291bnQgaW5uZXIgcG9pbnRzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBmaWx0ZXIgbGVmdCBlbmRzXG4gICAgICAgICAgICBpZiAoIShwb2ludC54ID09PSBzZWdtZW50QmVnaW5bMF0gJiYgcG9pbnQueSA9PT0gc2VnbWVudEJlZ2luWzFdKSkge1xuICAgICAgICAgICAgICAgIGlmICh1dGlscy5kaXJlY3Rpb24oc2VnbWVudEJlZ2luLCBzZWdtZW50RW5kLCBbcG9pbnQueCwgcG9pbnQueV0pIDwgdXRpbHMuRVBTICYmIHV0aWxzLm9uU2VnbWVudChzZWdtZW50QmVnaW4sIHNlZ21lbnRFbmQsIFtwb2ludC54LCBwb2ludC55XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgQ3AucHVzaChzZWdtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBzdGVwIDNcbiAgICAvLyBoYW5kbGUgZXZlcnkgaW50ZXJzZWN0aW9uXG4gICAgLy8gdGhlcmUgaXMgYWx3YXlzIG9uZSBvZiBjYXNlczogVXAubGVuZ3RoIHx8IENwLmxlbmd0aCB8fCBMcC5sZW5ndGhcbiAgICAvLyBwb2ludCBpbiBhbHdheXMgdGhlIGxlZnQgfHwgdGhlIHJpZ2h0IHx8IG9uLXNlZ21lbnRcbiAgICBpZiAoW10uY29uY2F0KFVwLCBMcCwgQ3ApLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgb3V0cHV0Lmluc2VydChwb2ludCwgcG9pbnQpO1xuICAgIH07XG5cbiAgICAvLyBzdGVwIDVcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IENwLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHN0YXR1cy5yZW1vdmUoQ3Bbal0pO1xuICAgIH1cblxuICAgIHN3ZWVwbGluZS5zZXRQb3NpdGlvbignYWZ0ZXInKTtcblxuICAgIC8vIHN0ZXAgNiBJbnNlcnQgaW50ZXJzZWN0aW5nLFxuICAgIC8vIChzdGVwIDcpIGhlcmUgaXMgdGhlIHNlZ21lbnRzIG9yZGVyIGNoYW5naW5nXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBVcC5sZW5ndGg7IGsrKykge1xuICAgICAgICBzdGF0dXMuaW5zZXJ0KFVwW2tdKTtcbiAgICB9XG4gICAgZm9yICh2YXIgbCA9IDA7IGwgPCBDcC5sZW5ndGg7IGwrKykge1xuICAgICAgICBzdGF0dXMuaW5zZXJ0KENwW2xdKTtcbiAgICB9XG4gICAgLy8gaGFuZGxlIHJpZ2h0IGVuZC1wb2ludCBjYXNlXG4gICAgaWYgKFVwLmxlbmd0aCA9PT0gMCAmJiBDcC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBMcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHMgPSBMcFtpXSxcbiAgICAgICAgICAgICAgICBzTm9kZSA9IHN0YXR1cy5maW5kKHMpLFxuICAgICAgICAgICAgICAgIHNsID0gc3RhdHVzLnByZXYoc05vZGUpLFxuICAgICAgICAgICAgICAgIHNyID0gc3RhdHVzLm5leHQoc05vZGUpO1xuXG4gICAgICAgICAgICBpZiAoc2wgJiYgc3IpIHtcbiAgICAgICAgICAgICAgICBmaW5kTmV3RXZlbnQoc2wua2V5LCBzci5rZXksIHBvaW50LCBvdXRwdXQsIHF1ZXVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhdHVzLnJlbW92ZShzKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBVQ3AgPSBbXS5jb25jYXQoVXAsIENwKS5zb3J0KHV0aWxzLmNvbXBhcmVTZWdtZW50cyksXG4gICAgICAgICAgICBVQ3BtaW4gPSBVQ3BbMF0sXG4gICAgICAgICAgICBzbGxOb2RlID0gc3RhdHVzLmZpbmQoVUNwbWluKSxcbiAgICAgICAgICAgIFVDcG1heCA9IFVDcFtVQ3AubGVuZ3RoLTFdLFxuICAgICAgICAgICAgc3JyTm9kZSA9IHN0YXR1cy5maW5kKFVDcG1heCksXG4gICAgICAgICAgICBzbGwgPSBzbGxOb2RlICYmIHN0YXR1cy5wcmV2KHNsbE5vZGUpLFxuICAgICAgICAgICAgc3JyID0gc3JyTm9kZSAmJiBzdGF0dXMubmV4dChzcnJOb2RlKTtcblxuICAgICAgICBpZiAoc2xsICYmIFVDcG1pbikge1xuICAgICAgICAgICAgZmluZE5ld0V2ZW50KHNsbC5rZXksIFVDcG1pbiwgcG9pbnQsIG91dHB1dCwgcXVldWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNyciAmJiBVQ3BtYXgpIHtcbiAgICAgICAgICAgIGZpbmROZXdFdmVudChzcnIua2V5LCBVQ3BtYXgsIHBvaW50LCBvdXRwdXQsIHF1ZXVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTHAubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHN0YXR1cy5yZW1vdmUoTHBbal0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG5cbmZ1bmN0aW9uIGZpbmROZXdFdmVudChzbCwgc3IsIHBvaW50LCBvdXRwdXQsIHF1ZXVlKSB7XG4gICAgdmFyIGludGVyc2VjdGlvbkNvb3JkcyA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzbCwgc3IpLFxuICAgICAgICBpbnRlcnNlY3Rpb25Qb2ludDtcblxuICAgIGlmIChpbnRlcnNlY3Rpb25Db29yZHMpIHtcbiAgICAgICAgaW50ZXJzZWN0aW9uUG9pbnQgPSBuZXcgUG9pbnQoaW50ZXJzZWN0aW9uQ29vcmRzLCAnaW50ZXJzZWN0aW9uJyk7XG4gICAgICAgIHF1ZXVlLmluc2VydChpbnRlcnNlY3Rpb25Qb2ludCwgaW50ZXJzZWN0aW9uUG9pbnQpO1xuICAgICAgICBpZiAoIW91dHB1dC5jb250YWlucyhpbnRlcnNlY3Rpb25Qb2ludCkpIHtcbiAgICAgICAgICAgIG91dHB1dC5pbnNlcnQoaW50ZXJzZWN0aW9uUG9pbnQsIGludGVyc2VjdGlvblBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcbi8vICAgICBmaW5kSW50ZXJzZWN0aW9uczogZmluZEludGVyc2VjdGlvbnMsXG4vLyAgICAgaGFuZGxlRXZlbnRQb2ludDogaGFuZGxlRXZlbnRQb2ludFxuLy8gfTtcbiJdfQ==
