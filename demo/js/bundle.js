(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// regular grid
module.exports = [[[37.5765, 55.7782], [37.5765, 55.6782]], [[37.5865, 55.7782], [37.5865, 55.6782]], [[37.5765, 55.7782], [37.5865, 55.7782]], [[37.5765, 55.7282], [37.5865, 55.7282]], [[37.5765, 55.6782], [37.5865, 55.6782]]];
// end error
module.exports = [
//     // [[37.56149046487677,55.764719438342546],[37.64904110088478,55.68338711861922]],
[[37.55602014443509, 55.67505100237174], [37.666350425310355, 55.707403912410825]], [[37.54093791746321, 55.65833836387149], [37.71052872816336, 55.75066815518673]], [[37.626909807398555, 55.770543489947634], [37.66329685248501, 55.654277810686786]]];

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
    random = false,
    pointsCount = 10;

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
}

drawLines(data);
// console.log(pointsCount / 2);
console.time('counting...');
var ps = [];
var ps = findIntersections(data, map);
console.timeEnd('counting...');
console.log(ps);
console.log(ps.length);
window.data = data;

ps.forEach(function (p) {
    L.circleMarker(L.latLng(p.slice().reverse()), { radius: 5, color: 'blue', fillColor: 'blue' }).bindPopup(p[0] + '\n ' + p[1]).addTo(map);
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

    if (x1 - x2 > EPS || Math.abs(x1 - x2) < EPS && y1 - y2 > EPS) {
        return 1;
    } else if (x2 - x1 > EPS || Math.abs(x1 - x2) < EPS && y2 - y1 > EPS) {
        return -1;
    } else if (Math.abs(x1 - x2) < EPS && Math.abs(y1 - y2) < EPS) {
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
// 1) EPS-round intersections
// 2) handle ends
var Tree = require('avl'),
    Sweepline = require('./sl'),
    Point = require('./point'),
    utils = require('./geometry/geometry');

/**
* @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
*/
function findIntersections(segments, map) {
    var sweepline = new Sweepline('before'),
        queue = new Tree(utils.comparePoints, true),
        status = new Tree(utils.compareSegments.bind(sweepline)),
        output = new Tree(utils.comparePoints, true);

    segments.forEach(function (segment, i, a) {
        segment.sort(utils.comparePoints);
        var begin = new Point(segment[0], 'begin'),
            end = new Point(segment[1], 'end');

        queue.insert(begin, begin);
        begin = queue.find(begin).key;
        begin.segments.push(segment);

        queue.insert(end, end);
    });
    console.log(queue.keys());

    while (!queue.isEmpty()) {
        var point = queue.pop();
        // console.log('STEP');

        handleEventPoint(point.key, status, output, queue, sweepline, map);
        if (queue.keys().length > 15) break;
    }

    return output.keys().map(function (key) {
        return [key.x, key.y];
    });
}

function handleEventPoint(point, status, output, queue, sweepline, map) {
    sweepline.setPosition('before');
    sweepline.setX(point.x);

    console.log(status.toString());

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
        if (Math.abs(point.x - segmentEnd[0]) < utils.EPS && Math.abs(point.y - segmentEnd[1]) < utils.EPS) {
            Lp.push(segment);
            // count inner points
        } else {
            // filter left ends
            if (!(Math.abs(point.x - segmentBegin[0]) < utils.EPS && Math.abs(point.y - segmentBegin[1]) < utils.EPS)) {
                if (Math.abs(utils.direction(segmentBegin, segmentEnd, [point.x, point.y])) < utils.EPS && utils.onSegment(segmentBegin, segmentEnd, [point.x, point.y])) {
                    Cp.push(segment);
                }
            }
        }
    });

    if ([].concat(Up, Lp, Cp).length > 1) {
        output.insert(point, point);
    };

    for (var j = 0; j < Cp.length; j++) {
        status.remove(Cp[j]);
    }

    for (var k = 0; k < Lp.length; k++) {
        // status.remove(Lp[k]);
    }

    sweepline.setPosition('after');

    for (var k = 0; k < Up.length; k++) {
        if (!status.contains(Up[k])) {
            status.insert(Up[k]);
        }
    }
    for (var l = 0; l < Cp.length; l++) {
        if (!status.contains(Cp[l])) {
            status.insert(Cp[l]);
        }
    }

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

        if (!queue.contains(intersectionPoint)) {
            queue.insert(intersectionPoint, intersectionPoint);
        }

        output.insert(intersectionPoint, intersectionPoint);
        // console.log(point);
        // console.log(output.keys());
    }
}
module.exports = findIntersections;

},{"./geometry/geometry":5,"./point":6,"./sl":7,"avl":4}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXGdlb21ldHJ5XFxnZW9tZXRyeS5qcyIsInNyY1xccG9pbnQuanMiLCJzcmNcXHNsLmpzIiwic3JjXFxzd2VlcGxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixDQUNiLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FEYSxFQUViLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FGYSxFQUliLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FKYSxFQUtiLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FMYSxFQU1iLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FOYSxDQUFqQjtBQVFBO0FBQ0EsT0FBTyxPQUFQLEdBQWlCO0FBQ2pCO0FBQ0ksQ0FBQyxDQUFDLGlCQUFELEVBQW1CLGlCQUFuQixDQUFELEVBQXVDLENBQUMsa0JBQUQsRUFBb0Isa0JBQXBCLENBQXZDLENBRmEsRUFHYixDQUFDLENBQUMsaUJBQUQsRUFBbUIsaUJBQW5CLENBQUQsRUFBdUMsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBdkMsQ0FIYSxFQUliLENBQUMsQ0FBQyxrQkFBRCxFQUFvQixrQkFBcEIsQ0FBRCxFQUF5QyxDQUFDLGlCQUFELEVBQW1C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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LElBQUksR0FBRyxNQUF2QixFQUErQixHQUEvQixFQUFvQztBQUNoQyxtQkFBTyxNQUFQLENBQWMsR0FBRyxDQUFILENBQWQ7QUFDSDtBQUNKO0FBQ0QsV0FBTyxNQUFQO0FBQ0g7O0FBRUQsU0FBUyxZQUFULENBQXNCLEVBQXRCLEVBQTBCLEVBQTFCLEVBQThCLEtBQTlCLEVBQXFDLE1BQXJDLEVBQTZDLEtBQTdDLEVBQW9EO0FBQ2hELFFBQUkscUJBQXFCLE1BQU0sd0JBQU4sQ0FBK0IsRUFBL0IsRUFBbUMsRUFBbkMsQ0FBekI7QUFBQSxRQUNJLGlCQURKOztBQUdBLFFBQUksa0JBQUosRUFBd0I7QUFDcEIsNEJBQW9CLElBQUksS0FBSixDQUFVLGtCQUFWLEVBQThCLGNBQTlCLENBQXBCOztBQUVBLFlBQUksQ0FBQyxNQUFNLFFBQU4sQ0FBZSxpQkFBZixDQUFMLEVBQXdDO0FBQ3BDLGtCQUFNLE1BQU4sQ0FBYSxpQkFBYixFQUFnQyxpQkFBaEM7QUFDSDs7QUFFRCxlQUFPLE1BQVAsQ0FBYyxpQkFBZCxFQUFpQyxpQkFBakM7QUFDQTtBQUNBO0FBRUg7QUFDSjtBQUNELE9BQU8sT0FBUCxHQUFpQixpQkFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gcmVndWxhciBncmlkXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgICBbWzM3LjU3NjUsNTUuNzc4Ml0sWzM3LjU3NjUsNTUuNjc4Ml1dLFxuICAgIFtbMzcuNTg2NSw1NS43NzgyXSxbMzcuNTg2NSw1NS42NzgyXV0sXG5cbiAgICBbWzM3LjU3NjUsNTUuNzc4Ml0sWzM3LjU4NjUsNTUuNzc4Ml1dLFxuICAgIFtbMzcuNTc2NSw1NS43MjgyXSxbMzcuNTg2NSw1NS43MjgyXV0sXG4gICAgW1szNy41NzY1LDU1LjY3ODJdLFszNy41ODY1LDU1LjY3ODJdXSxcbl07XG4vLyBlbmQgZXJyb3Jcbm1vZHVsZS5leHBvcnRzID0gW1xuLy8gICAgIC8vIFtbMzcuNTYxNDkwNDY0ODc2NzcsNTUuNzY0NzE5NDM4MzQyNTQ2XSxbMzcuNjQ5MDQxMTAwODg0NzgsNTUuNjgzMzg3MTE4NjE5MjJdXSxcbiAgICBbWzM3LjU1NjAyMDE0NDQzNTA5LDU1LjY3NTA1MTAwMjM3MTc0XSxbMzcuNjY2MzUwNDI1MzEwMzU1LDU1LjcwNzQwMzkxMjQxMDgyNV1dLFxuICAgIFtbMzcuNTQwOTM3OTE3NDYzMjEsNTUuNjU4MzM4MzYzODcxNDldLFszNy43MTA1Mjg3MjgxNjMzNiw1NS43NTA2NjgxNTUxODY3M11dLFxuICAgIFtbMzcuNjI2OTA5ODA3Mzk4NTU1LDU1Ljc3MDU0MzQ4OTk0NzYzNF0sWzM3LjY2MzI5Njg1MjQ4NTAxLDU1LjY1NDI3NzgxMDY4Njc4Nl1dLFxuLy8gICAgIC8vIFtbMzcuNTI3OTg1MzkyNDA0MjEsNTUuNjU4NjM4NTQ2NzEzMDNdLFszNy42NTk0OTk3MjY5OTg1NCw1NS43NjUwMzU2NTMwMzM1ODZdXVxuXVxuLy8gbW9kdWxlLmV4cG9ydHMgPSBbXG4vLyAgICAgW1szNy41Mjg0MzQ4ODY2MjE2Miw1NS42ODk0ODU5MjIxMzc0MV0sWzM3LjcxNDk2MTA5MzU2MjE3NCw1NS42ODUwNzM1ODAxMzk5OF1dLFxuLy8gICAgIFtbMzcuNTAyNjUyODAyNDA3NTgsNTUuODI4MDI0NjkwMjEwNDM0XSxbMzcuNjg4ODk0OTg0MzEyMzM0LDU1LjY3ODA0MjkzMjY2NDhdXSxcbi8vICAgICBbWzM3LjY3NDIzNTgwNDYwNTExLDU1Ljg1MzA2NTYxNzY3MTIyXSxbMzcuNzAyNTcwMDY5OTk1NjE2LDU1LjcwNzU5OTk5Mzk1NjczNF1dLFxuLy8gICAgIFtbMzcuNDgzODIzMTg5MzI4MTcsNTUuODE0NDI3MjM2ODUzMzU1XSxbMzcuNTI3MzQ1MTc1MjQxNDYsNTUuNzc2MDczMDEwNTQ3ODI2XV0sXG4vLyAgICAgW1szNy41MjQ3NTc4MzE5NDgzNjQsNTUuNzA4MzE1ODYwNDk5MjRdLFszNy43MDAxMDE5MTAwNTk3MSw1NS42OTI1NDQ2NDc4MzYyNl1dXG4vLyBdXG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xudmFyIGRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL2luZGV4LmpzJyk7XG5cbnZhciBvc20gPSBMLnRpbGVMYXllcignaHR0cDovL3tzfS5iYXNlbWFwcy5jYXJ0b2Nkbi5jb20vbGlnaHRfbm9sYWJlbHMve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICBtYXhab29tOiAyMixcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4nXG4gICAgfSksXG4gICAgcG9pbnQgPSBMLmxhdExuZyhbNTUuNzUzMjEwLCAzNy42MjE3NjZdKSxcbiAgICBtYXAgPSBuZXcgTC5NYXAoJ21hcCcsIHtsYXllcnM6IFtvc21dLCBjZW50ZXI6IHBvaW50LCB6b29tOiAxMSwgbWF4Wm9vbTogMjJ9KSxcbiAgICByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKTtcblxud2luZG93Lm1hcCA9IG1hcDtcblxudmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKSxcbiAgICBuID0gYm91bmRzLl9ub3J0aEVhc3QubGF0LFxuICAgIGUgPSBib3VuZHMuX25vcnRoRWFzdC5sbmcsXG4gICAgcyA9IGJvdW5kcy5fc291dGhXZXN0LmxhdCxcbiAgICB3ID0gYm91bmRzLl9zb3V0aFdlc3QubG5nLFxuICAgIGhlaWdodCA9IG4gLSBzLFxuICAgIHdpZHRoID0gZSAtIHcsXG4gICAgcUhlaWdodCA9IGhlaWdodCAvIDQsXG4gICAgcVdpZHRoID0gd2lkdGggLyA0LFxuICAgIHJhbmRvbSA9IGZhbHNlLFxuICAgIHBvaW50c0NvdW50ID0gMTA7XG5cbmlmIChyYW5kb20pIHtcbiAgICBkYXRhID0gW107XG4gICAgdmFyIHBvaW50cyA9IHR1cmYucmFuZG9tUG9pbnQocG9pbnRzQ291bnQsIHtcbiAgICAgICAgYmJveDogW3cgKyBxV2lkdGgsIHMgKyBxSGVpZ2h0LCBlIC0gcVdpZHRoLCBuIC0gcUhlaWdodF1cbiAgICB9KTtcblxuICAgIHZhciBjb29yZHMgPSBwb2ludHMuZmVhdHVyZXMubWFwKGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICAgICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgfSlcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSs9Mikge1xuICAgICAgICBkYXRhLnB1c2goW2Nvb3Jkc1tpXSwgY29vcmRzW2krMV1dKTtcbiAgICB9XG59XG5cblxuZHJhd0xpbmVzKGRhdGEpO1xuLy8gY29uc29sZS5sb2cocG9pbnRzQ291bnQgLyAyKTtcbmNvbnNvbGUudGltZSgnY291bnRpbmcuLi4nKTtcbnZhciBwcyA9IFtdO1xudmFyIHBzID0gZmluZEludGVyc2VjdGlvbnMoZGF0YSwgbWFwKTtcbmNvbnNvbGUudGltZUVuZCgnY291bnRpbmcuLi4nKTtcbmNvbnNvbGUubG9nKHBzKTtcbmNvbnNvbGUubG9nKHBzLmxlbmd0aCk7XG53aW5kb3cuZGF0YSA9IGRhdGE7XG5cbnBzLmZvckVhY2goZnVuY3Rpb24gKHApIHtcbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKSwge3JhZGl1czogNSwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5iaW5kUG9wdXAocFswXSArICdcXG4gJyArIHBbMV0pLmFkZFRvKG1hcCk7XG59KVxuXG5mdW5jdGlvbiBkcmF3TGluZXMoYXJyYXkpIHtcbiAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgIHZhciBiZWdpbiA9IGxpbmVbMF0uc2xpY2UoKS5yZXZlcnNlKCksXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdLnNsaWNlKCkucmV2ZXJzZSgpO1xuXG4gICAgICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGJlZ2luKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoZW5kKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcbiAgICAgICAgTC5wb2x5bGluZShbYmVnaW4sIGVuZF0sIHt3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xuICAgIH0pO1xufVxuXG4vLyBjb25zb2xlLmxvZyhwcyk7XG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuL3NyYy9zd2VlcGxpbmUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW50ZXJzZWN0aW9ucztcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5hdmwgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUHJpbnRzIHRyZWUgaG9yaXpvbnRhbGx5XG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHByaW50IChyb290LCBwcmludE5vZGUpIHtcbiAgaWYgKCBwcmludE5vZGUgPT09IHZvaWQgMCApIHByaW50Tm9kZSA9IGZ1bmN0aW9uIChuKSB7IHJldHVybiBuLmtleTsgfTtcblxuICB2YXIgb3V0ID0gW107XG4gIHJvdyhyb290LCAnJywgdHJ1ZSwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG91dC5wdXNoKHYpOyB9LCBwcmludE5vZGUpO1xuICByZXR1cm4gb3V0LmpvaW4oJycpO1xufVxuXG4vKipcbiAqIFByaW50cyBsZXZlbCBvZiB0aGUgdHJlZVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgIHByZWZpeFxuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICBpc1RhaWxcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKGluOnN0cmluZyk6dm9pZH0gICAgb3V0XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gIHByaW50Tm9kZVxuICovXG5mdW5jdGlvbiByb3cgKHJvb3QsIHByZWZpeCwgaXNUYWlsLCBvdXQsIHByaW50Tm9kZSkge1xuICBpZiAocm9vdCkge1xuICAgIG91dCgoXCJcIiArIHByZWZpeCArIChpc1RhaWwgPyAn4pSU4pSA4pSAICcgOiAn4pSc4pSA4pSAICcpICsgKHByaW50Tm9kZShyb290KSkgKyBcIlxcblwiKSk7XG4gICAgdmFyIGluZGVudCA9IHByZWZpeCArIChpc1RhaWwgPyAnICAgICcgOiAn4pSCICAgJyk7XG4gICAgaWYgKHJvb3QubGVmdCkgIHsgcm93KHJvb3QubGVmdCwgIGluZGVudCwgZmFsc2UsIG91dCwgcHJpbnROb2RlKTsgfVxuICAgIGlmIChyb290LnJpZ2h0KSB7IHJvdyhyb290LnJpZ2h0LCBpbmRlbnQsIHRydWUsICBvdXQsIHByaW50Tm9kZSk7IH1cbiAgfVxufVxuXG5cbi8qKlxuICogSXMgdGhlIHRyZWUgYmFsYW5jZWQgKG5vbmUgb2YgdGhlIHN1YnRyZWVzIGRpZmZlciBpbiBoZWlnaHQgYnkgbW9yZSB0aGFuIDEpXG4gKiBAcGFyYW0gIHtOb2RlfSAgICByb290XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0JhbGFuY2VkKHJvb3QpIHtcbiAgaWYgKHJvb3QgPT09IG51bGwpIHsgcmV0dXJuIHRydWU7IH0gLy8gSWYgbm9kZSBpcyBlbXB0eSB0aGVuIHJldHVybiB0cnVlXG5cbiAgLy8gR2V0IHRoZSBoZWlnaHQgb2YgbGVmdCBhbmQgcmlnaHQgc3ViIHRyZWVzXG4gIHZhciBsaCA9IGhlaWdodChyb290LmxlZnQpO1xuICB2YXIgcmggPSBoZWlnaHQocm9vdC5yaWdodCk7XG5cbiAgaWYgKE1hdGguYWJzKGxoIC0gcmgpIDw9IDEgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5sZWZ0KSAgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5yaWdodCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAvLyBJZiB3ZSByZWFjaCBoZXJlIHRoZW4gdHJlZSBpcyBub3QgaGVpZ2h0LWJhbGFuY2VkXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gQ29tcHV0ZSB0aGUgJ2hlaWdodCcgb2YgYSB0cmVlLlxuICogSGVpZ2h0IGlzIHRoZSBudW1iZXIgb2Ygbm9kZXMgYWxvbmcgdGhlIGxvbmdlc3QgcGF0aFxuICogZnJvbSB0aGUgcm9vdCBub2RlIGRvd24gdG8gdGhlIGZhcnRoZXN0IGxlYWYgbm9kZS5cbiAqXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGhlaWdodChub2RlKSB7XG4gIHJldHVybiBub2RlID8gKDEgKyBNYXRoLm1heChoZWlnaHQobm9kZS5sZWZ0KSwgaGVpZ2h0KG5vZGUucmlnaHQpKSkgOiAwO1xufVxuXG4vLyBmdW5jdGlvbiBjcmVhdGVOb2RlIChwYXJlbnQsIGxlZnQsIHJpZ2h0LCBoZWlnaHQsIGtleSwgZGF0YSkge1xuLy8gICByZXR1cm4geyBwYXJlbnQsIGxlZnQsIHJpZ2h0LCBiYWxhbmNlRmFjdG9yOiBoZWlnaHQsIGtleSwgZGF0YSB9O1xuLy8gfVxuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIHBhcmVudDogICAgICAgID9Ob2RlLFxuICogICBsZWZ0OiAgICAgICAgICA/Tm9kZSxcbiAqICAgcmlnaHQ6ICAgICAgICAgP05vZGUsXG4gKiAgIGJhbGFuY2VGYWN0b3I6IG51bWJlcixcbiAqICAga2V5OiAgICAgICAgICAgS2V5LFxuICogICBkYXRhOiAgICAgICAgICBWYWx1ZVxuICogfX0gTm9kZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeyp9IEtleVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeyp9IFZhbHVlXG4gKi9cblxuLyoqXG4gKiBEZWZhdWx0IGNvbXBhcmlzb24gZnVuY3Rpb25cbiAqIEBwYXJhbSB7S2V5fSBhXG4gKiBAcGFyYW0ge0tleX0gYlxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gREVGQVVMVF9DT01QQVJFIChhLCBiKSB7IHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDsgfVxuXG5cbi8qKlxuICogU2luZ2xlIGxlZnQgcm90YXRpb25cbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZUxlZnQgKG5vZGUpIHtcbiAgdmFyIHJpZ2h0Tm9kZSA9IG5vZGUucmlnaHQ7XG4gIG5vZGUucmlnaHQgICAgPSByaWdodE5vZGUubGVmdDtcblxuICBpZiAocmlnaHROb2RlLmxlZnQpIHsgcmlnaHROb2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIHJpZ2h0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAocmlnaHROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LmxlZnQgPSByaWdodE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQucmlnaHQgPSByaWdodE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSByaWdodE5vZGU7XG4gIHJpZ2h0Tm9kZS5sZWZ0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSByaWdodE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG4gIHJldHVybiByaWdodE5vZGU7XG59XG5cblxuZnVuY3Rpb24gcm90YXRlUmlnaHQgKG5vZGUpIHtcbiAgdmFyIGxlZnROb2RlID0gbm9kZS5sZWZ0O1xuICBub2RlLmxlZnQgPSBsZWZ0Tm9kZS5yaWdodDtcbiAgaWYgKG5vZGUubGVmdCkgeyBub2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIGxlZnROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAobGVmdE5vZGUucGFyZW50KSB7XG4gICAgaWYgKGxlZnROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9IGxlZnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQucmlnaHQgPSBsZWZ0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IGxlZnROb2RlO1xuICBsZWZ0Tm9kZS5yaWdodCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmV0dXJuIGxlZnROb2RlO1xufVxuXG5cbi8vIGZ1bmN0aW9uIGxlZnRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHJvdGF0ZUxlZnQobm9kZS5sZWZ0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZVJpZ2h0KG5vZGUpO1xuLy8gfVxuXG5cbi8vIGZ1bmN0aW9uIHJpZ2h0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSByb3RhdGVSaWdodChub2RlLnJpZ2h0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZUxlZnQobm9kZSk7XG4vLyB9XG5cblxudmFyIEFWTFRyZWUgPSBmdW5jdGlvbiBBVkxUcmVlIChjb21wYXJhdG9yLCBub0R1cGxpY2F0ZXMpIHtcbiAgaWYgKCBub0R1cGxpY2F0ZXMgPT09IHZvaWQgMCApIG5vRHVwbGljYXRlcyA9IGZhbHNlO1xuXG4gIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yIHx8IERFRkFVTFRfQ09NUEFSRTtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG4gIHRoaXMuX3NpemUgPSAwO1xuICB0aGlzLl9ub0R1cGxpY2F0ZXMgPSAhIW5vRHVwbGljYXRlcztcbn07XG5cbnZhciBwcm90b3R5cGVBY2Nlc3NvcnMgPSB7IHNpemU6IHt9IH07XG5cblxuLyoqXG4gKiBDbGVhciB0aGUgdHJlZVxuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICB0aGlzLl9yb290ID0gbnVsbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE51bWJlciBvZiBub2Rlc1xuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5wcm90b3R5cGVBY2Nlc3NvcnMuc2l6ZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9zaXplO1xufTtcblxuXG4vKipcbiAqIFdoZXRoZXIgdGhlIHRyZWUgY29udGFpbnMgYSBub2RlIHdpdGggdGhlIGdpdmVuIGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlL2ZhbHNlXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMgKGtleSkge1xuICBpZiAodGhpcy5fcm9vdCl7XG4gICAgdmFyIG5vZGUgICAgID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gICAgd2hpbGUgKG5vZGUpe1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3Ioa2V5LCBub2RlLmtleSk7XG4gICAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cbi8qKlxuICogU3VjY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIG5leHQgKG5vZGUpIHtcbiAgdmFyIHN1Y2Nlc3NvciA9IG5vZGU7XG4gIGlmIChzdWNjZXNzb3IpIHtcbiAgICBpZiAoc3VjY2Vzc29yLnJpZ2h0KSB7XG4gICAgICBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucmlnaHQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5sZWZ0KSB7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5sZWZ0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2Nlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IucmlnaHQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHN1Y2Nlc3Nvcjsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN1Y2Nlc3Nvcjtcbn07XG5cblxuLyoqXG4gKiBQcmVkZWNlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiBwcmV2IChub2RlKSB7XG4gIHZhciBwcmVkZWNlc3NvciA9IG5vZGU7XG4gIGlmIChwcmVkZWNlc3Nvcikge1xuICAgIGlmIChwcmVkZWNlc3Nvci5sZWZ0KSB7XG4gICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLmxlZnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IucmlnaHQpIHsgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5yaWdodDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmVkZWNlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLmxlZnQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHByZWRlY2Vzc29yO1xuICAgICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByZWRlY2Vzc29yO1xufTtcbi8qIGVzbGludC1lbmFibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIGZvckVhY2hcbiAqIEBjYWxsYmFjayBmb3JFYWNoQ2FsbGJhY2tcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gKi9cblxuLyoqXG4gKiBAcGFyYW17Zm9yRWFjaENhbGxiYWNrfSBjYWxsYmFja1xuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2ggKGNhbGxiYWNrKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgZG9uZSA9IGZhbHNlLCBpID0gMDtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICAvLyBSZWFjaCB0aGUgbGVmdCBtb3N0IE5vZGUgb2YgdGhlIGN1cnJlbnQgTm9kZVxuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICAvLyBQbGFjZSBwb2ludGVyIHRvIGEgdHJlZSBub2RlIG9uIHRoZSBzdGFja1xuICAgICAgLy8gYmVmb3JlIHRyYXZlcnNpbmcgdGhlIG5vZGUncyBsZWZ0IHN1YnRyZWVcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJhY2tUcmFjayBmcm9tIHRoZSBlbXB0eSBzdWJ0cmVlIGFuZCB2aXNpdCB0aGUgTm9kZVxuICAgICAgLy8gYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2s7IGhvd2V2ZXIsIGlmIHRoZSBzdGFjayBpc1xuICAgICAgLy8gZW1wdHkgeW91IGFyZSBkb25lXG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICBjYWxsYmFjayhjdXJyZW50LCBpKyspO1xuXG4gICAgICAgIC8vIFdlIGhhdmUgdmlzaXRlZCB0aGUgbm9kZSBhbmQgaXRzIGxlZnRcbiAgICAgICAgLy8gc3VidHJlZS4gTm93LCBpdCdzIHJpZ2h0IHN1YnRyZWUncyB0dXJuXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBhbGwga2V5cyBpbiBvcmRlclxuICogQHJldHVybiB7QXJyYXk8S2V5Pn1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uIGtleXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5rZXkpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYGRhdGFgIGZpZWxkcyBvZiBhbGwgbm9kZXMgaW4gb3JkZXIuXG4gKiBAcmV0dXJuIHtBcnJheTxWYWx1ZT59XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmRhdGEpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSBhdCBnaXZlbiBpbmRleFxuICogQHBhcmFte251bWJlcn0gaW5kZXhcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIGF0IChpbmRleCkge1xuICAvLyByZW1vdmVkIGFmdGVyIGEgY29uc2lkZXJhdGlvbiwgbW9yZSBtaXNsZWFkaW5nIHRoYW4gdXNlZnVsXG4gIC8vIGluZGV4ID0gaW5kZXggJSB0aGlzLnNpemU7XG4gIC8vIGlmIChpbmRleCA8IDApIGluZGV4ID0gdGhpcy5zaXplIC0gaW5kZXg7XG5cbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCBkb25lID0gZmFsc2UsIGkgPSAwO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICBpZiAoaSA9PT0gaW5kZXgpIHsgcmV0dXJuIGN1cnJlbnQ7IH1cbiAgICAgICAgaSsrO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtaW5pbXVtIGtleVxuICogQHJldHVybiB7P05vZGV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm1pbk5vZGUgPSBmdW5jdGlvbiBtaW5Ob2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtYXgga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUubWF4Tm9kZSA9IGZ1bmN0aW9uIG1heE5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBNaW4ga2V5XG4gKiBAcmV0dXJuIHs/S2V5fVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiBtaW4gKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuXG4vKipcbiAqIE1heCBrZXlcbiAqIEByZXR1cm4gez9LZXl9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uIG1heCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cblxuLyoqXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlL2ZhbHNlXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5ICgpIHtcbiAgcmV0dXJuICF0aGlzLl9yb290O1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG5vZGUgd2l0aCBzbWFsbGVzdCBrZXlcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiBwb3AgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3QsIHJldHVyblZhbHVlID0gbnVsbDtcbiAgaWYgKG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICByZXR1cm5WYWx1ZSA9IHsga2V5OiBub2RlLmtleSwgZGF0YTogbm9kZS5kYXRhIH07XG4gICAgdGhpcy5yZW1vdmUobm9kZS5rZXkpO1xuICB9XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBGaW5kIG5vZGUgYnkga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4gez9Ob2RlfVxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gZmluZCAoa2V5KSB7XG4gIHZhciByb290ID0gdGhpcy5fcm9vdDtcbiAgLy8gaWYgKHJvb3QgPT09IG51bGwpICByZXR1cm4gbnVsbDtcbiAgLy8gaWYgKGtleSA9PT0gcm9vdC5rZXkpIHJldHVybiByb290O1xuXG4gIHZhciBzdWJ0cmVlID0gcm9vdCwgY21wO1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHdoaWxlIChzdWJ0cmVlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIHN1YnRyZWUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBzdWJ0cmVlOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBzdWJ0cmVlID0gc3VidHJlZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBzdWJ0cmVlID0gc3VidHJlZS5yaWdodDsgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5cbi8qKlxuICogSW5zZXJ0IGEgbm9kZSBpbnRvIHRoZSB0cmVlXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEBwYXJhbXtWYWx1ZX0gW2RhdGFdXG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0IChrZXksIGRhdGEpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHtcbiAgICB0aGlzLl9yb290ID0ge1xuICAgICAgcGFyZW50OiBudWxsLCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICAgIGtleToga2V5LCBkYXRhOiBkYXRhXG4gICAgfTtcbiAgICB0aGlzLl9zaXplKys7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gIH1cblxuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHZhciBub2RlICA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBwYXJlbnQ9IG51bGw7XG4gIHZhciBjbXAgICA9IDA7XG5cbiAgaWYgKHRoaXMuX25vRHVwbGljYXRlcykge1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgICAgcGFyZW50ID0gbm9kZTtcbiAgICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICAgIHBhcmVudCA9IG5vZGU7XG4gICAgICBpZiAgICAoY21wIDw9IDApeyBub2RlID0gbm9kZS5sZWZ0OyB9IC8vcmV0dXJuIG51bGw7XG4gICAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gICAgfVxuICB9XG5cbiAgdmFyIG5ld05vZGUgPSB7XG4gICAgbGVmdDogbnVsbCxcbiAgICByaWdodDogbnVsbCxcbiAgICBiYWxhbmNlRmFjdG9yOiAwLFxuICAgIHBhcmVudDogcGFyZW50LCBrZXk6IGtleSwgZGF0YTogZGF0YVxuICB9O1xuICB2YXIgbmV3Um9vdDtcbiAgaWYgKGNtcCA8PSAwKSB7IHBhcmVudC5sZWZ0PSBuZXdOb2RlOyB9XG4gIGVsc2UgICAgICAgeyBwYXJlbnQucmlnaHQgPSBuZXdOb2RlOyB9XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGNtcCA9IGNvbXBhcmUocGFyZW50LmtleSwga2V5KTtcbiAgICBpZiAoY21wIDwgMCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy8gaW5saW5lZFxuICAgICAgLy92YXIgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gaW5saW5lZFxuICAgICAgLy8gdmFyIG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICBuZXdSb290ID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgdGhpcy5fc2l6ZSsrO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBub2RlIGZyb20gdGhlIHRyZWUuIElmIG5vdCBmb3VuZCwgcmV0dXJucyBudWxsLlxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHs/Tm9kZX1cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrZXkpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgdmFyIGNtcCA9IDA7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmFyIHJldHVyblZhbHVlID0gbm9kZS5rZXk7XG4gIHZhciBtYXgsIG1pbjtcblxuICBpZiAobm9kZS5sZWZ0KSB7XG4gICAgbWF4ID0gbm9kZS5sZWZ0O1xuXG4gICAgd2hpbGUgKG1heC5sZWZ0IHx8IG1heC5yaWdodCkge1xuICAgICAgd2hpbGUgKG1heC5yaWdodCkgeyBtYXggPSBtYXgucmlnaHQ7IH1cblxuICAgICAgbm9kZS5rZXkgPSBtYXgua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgICBpZiAobWF4LmxlZnQpIHtcbiAgICAgICAgbm9kZSA9IG1heDtcbiAgICAgICAgbWF4ID0gbWF4LmxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1heC5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgbm9kZSA9IG1heDtcbiAgfVxuXG4gIGlmIChub2RlLnJpZ2h0KSB7XG4gICAgbWluID0gbm9kZS5yaWdodDtcblxuICAgIHdoaWxlIChtaW4ubGVmdCB8fCBtaW4ucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtaW4ubGVmdCkgeyBtaW4gPSBtaW4ubGVmdDsgfVxuXG4gICAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgICAgaWYgKG1pbi5yaWdodCkge1xuICAgICAgICBub2RlID0gbWluO1xuICAgICAgICBtaW4gPSBtaW4ucmlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgbm9kZSA9IG1pbjtcbiAgfVxuXG4gIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgdmFyIHBwICAgPSBub2RlO1xuICB2YXIgbmV3Um9vdDtcblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKHBhcmVudC5sZWZ0ID09PSBwcCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy8gaW5saW5lZFxuICAgICAgLy92YXIgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290O1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBpbmxpbmVkXG4gICAgICAvLyB2YXIgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIG5ld1Jvb3QgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdDtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IC0xIHx8IHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IGJyZWFrOyB9XG5cbiAgICBwcCAgID0gcGFyZW50O1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkgeyBub2RlLnBhcmVudC5sZWZ0PSBudWxsOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICB7IG5vZGUucGFyZW50LnJpZ2h0ID0gbnVsbDsgfVxuICB9XG5cbiAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHsgdGhpcy5fcm9vdCA9IG51bGw7IH1cblxuICB0aGlzLl9zaXplLS07XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBCdWxrLWxvYWQgaXRlbXNcbiAqIEBwYXJhbXtBcnJheTxLZXk+fWtleXNcbiAqIEBwYXJhbXtBcnJheTxWYWx1ZT59W3ZhbHVlc11cbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiBsb2FkIChrZXlzLCB2YWx1ZXMpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcbiAgICBpZiAoIGtleXMgPT09IHZvaWQgMCApIGtleXMgPSBbXTtcbiAgICBpZiAoIHZhbHVlcyA9PT0gdm9pZCAwICkgdmFsdWVzID0gW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoa2V5cykpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGhpcyQxLmluc2VydChrZXlzW2ldLCB2YWx1ZXNbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRyZWUgaXMgYmFsYW5jZWRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmlzQmFsYW5jZWQgPSBmdW5jdGlvbiBpc0JhbGFuY2VkJDEgKCkge1xuICByZXR1cm4gaXNCYWxhbmNlZCh0aGlzLl9yb290KTtcbn07XG5cblxuLyoqXG4gKiBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyZWUgLSBwcmltaXRpdmUgaG9yaXpvbnRhbCBwcmludC1vdXRcbiAqIEBwYXJhbXtGdW5jdGlvbihOb2RlKTpzdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKHByaW50Tm9kZSkge1xuICByZXR1cm4gcHJpbnQodGhpcy5fcm9vdCwgcHJpbnROb2RlKTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBBVkxUcmVlLnByb3RvdHlwZSwgcHJvdG90eXBlQWNjZXNzb3JzICk7XG5cbnJldHVybiBBVkxUcmVlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXZsLmpzLm1hcFxuIiwidmFyIEVQUyA9IDFFLTk7XHJcbi8qKlxyXG4gKiBAcGFyYW0gYSB2ZWN0b3JcclxuICogQHBhcmFtIGIgdmVjdG9yXHJcbiAqIEBwYXJhbSBjIHZlY3RvclxyXG4gKi9cclxuZnVuY3Rpb24gb25TZWdtZW50KGEsIGIsIGMpIHtcclxuICAgIHZhciB4MSA9IGFbMF0sXHJcbiAgICAgICAgeDIgPSBiWzBdLFxyXG4gICAgICAgIHgzID0gY1swXSxcclxuICAgICAgICB5MSA9IGFbMV0sXHJcbiAgICAgICAgeTIgPSBiWzFdLFxyXG4gICAgICAgIHkzID0gY1sxXTtcclxuXHJcbiAgICByZXR1cm4gKE1hdGgubWluKHgxLCB4MikgPD0geDMpICYmICh4MyA8PSBNYXRoLm1heCh4MSwgeDIpKSAmJlxyXG4gICAgICAgICAgIChNYXRoLm1pbih5MSwgeTIpIDw9IHkzKSAmJiAoeTMgPD0gTWF0aC5tYXgoeTEsIHkyKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBhYyB4IGJjXHJcbiAqIEBwYXJhbSBhIHZlY3RvclxyXG4gKiBAcGFyYW0gYiB2ZWN0b3JcclxuICogQHBhcmFtIGMgdmVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBkaXJlY3Rpb24oYSwgYiwgYykge1xyXG4gICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgeDMgPSBjWzBdLFxyXG4gICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICB5MiA9IGJbMV0sXHJcbiAgICAgICAgeTMgPSBjWzFdO1xyXG5cclxuICAgIHJldHVybiAoeDMgLSB4MSkgKiAoeTIgLSB5MSkgLSAoeDIgLSB4MSkgKiAoeTMgLSB5MSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gYSBzZWdtZW50MVxyXG4gKiBAcGFyYW0gYiBzZWdtZW50MlxyXG4gKi9cclxuZnVuY3Rpb24gc2VnbWVudHNJbnRlcnNlY3QoYSwgYikge1xyXG4gICAgdmFyIHAxID0gYVswXSxcclxuICAgICAgICBwMiA9IGFbMV0sXHJcbiAgICAgICAgcDMgPSBiWzBdLFxyXG4gICAgICAgIHA0ID0gYlsxXSxcclxuICAgICAgICBkMSA9IGRpcmVjdGlvbihwMywgcDQsIHAxKSxcclxuICAgICAgICBkMiA9IGRpcmVjdGlvbihwMywgcDQsIHAyKSxcclxuICAgICAgICBkMyA9IGRpcmVjdGlvbihwMSwgcDIsIHAzKSxcclxuICAgICAgICBkNCA9IGRpcmVjdGlvbihwMSwgcDIsIHA0KTtcclxuXHJcbiAgICBpZiAoKChkMSA+IDAgJiYgZDIgPCAwKSB8fCAoZDEgPCAwICYmIGQyID4gMCkpICYmICgoZDMgPiAwICYmIGQ0IDwgMCkgfHwgKGQzIDwgMCAmJiBkNCA+IDApKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkMSA9PT0gMCAmJiBvblNlZ21lbnQocDMsIHA0LCBwMSkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoZDIgPT09IDAgJiYgb25TZWdtZW50KHAzLCBwNCwgcDIpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQzID09PSAwICYmIG9uU2VnbWVudChwMSwgcDIsIHAzKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkNCA9PT0gMCAmJiBvblNlZ21lbnQocDEsIHAyLCBwNCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uIChhLCBiKSB7XHJcbiAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgIHk0ID0gYlsxXVsxXTtcclxuICAgIHZhciB4ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICB2YXIgeSA9ICgoeDEgKiB5MiAtIHkxICogeDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzICogeTQgLSB5MyAqIHg0KSkgL1xyXG4gICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgaWYgKGlzTmFOKHgpfHxpc05hTih5KSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHgxID49IHgyKSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih4MiwgeCwgeDEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeDEsIHgsIHgyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh5MSA+PSB5Mikge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeTIsIHksIHkxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHkxLCB5LCB5MikpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoeDMgPj0geDQpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih4MywgeCwgeDQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHkzID49IHk0KSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5NCwgeSwgeTMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeTMsIHksIHk0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFt4LCB5XTtcclxufVxyXG5cclxuZnVuY3Rpb24gYmV0d2VlbiAoYSwgYiwgYykge1xyXG4gICAgcmV0dXJuIGEtRVBTIDw9IGIgJiYgYiA8PSBjK0VQUztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNvbXBhcmVTZWdtZW50cyhhLCBiKSB7XHJcbiAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICB2YXIgY3VycmVudFgsICAgLy8g0YLQtdC60YPRidC40LkgeCDRgdCy0LjQv9C70LDQudC90LBcclxuICAgICAgICBheSwgICAgICAgICAvLyB5INGC0L7Rh9C60Lgg0L/QtdGA0LXRgdC10YfQtdC90LjRjyDQvtGC0YDQtdC30LrQsCDRgdC+0LHRi9GC0LjRjyBhINGB0L4g0YHQstC40L/Qu9Cw0LnQvdC+0LxcclxuICAgICAgICBieSwgICAgICAgICAvLyB5INGC0L7Rh9C60Lgg0L/QtdGA0LXRgdC10YfQtdC90LjRjyDQvtGC0YDQtdC30LrQsCDRgdC+0LHRi9GC0LjRjyBiINGB0L4g0YHQstC40L/Qu9Cw0LnQvdC+0LxcclxuICAgICAgICBkZWx0YVksICAgICAvLyDRgNCw0LfQvdC40YbQsCB5INGC0L7Rh9C10Log0L/QtdGA0LXRgdC10YfQtdC90LjRj1xyXG4gICAgICAgIGRlbHRhWDEsICAgIC8vINGA0LDQt9C90LjRhtCwIHgg0L3QsNGH0LDQuyDQvtGC0YDQtdC30LrQvtCyXHJcbiAgICAgICAgZGVsdGFYMjsgICAgLy8g0YDQsNC30L3QuNGG0LAgeCDQutC+0L3RhtC+0LIg0L7RgtGA0LXQt9C60L7QslxyXG5cclxuICAgIGlmIChhID09PSBiKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgY3VycmVudFggPSB0aGlzLng7XHJcbiAgICBheSA9IGdldFkoYSwgY3VycmVudFgpO1xyXG4gICAgYnkgPSBnZXRZKGIsIGN1cnJlbnRYKTtcclxuICAgIGRlbHRhWSA9IGF5IC0gYnk7XHJcblxyXG4gICAgLy8g0YHRgNCw0LLQvdC10L3QuNC1INC90LDQtNC+INC/0YDQvtCy0L7QtNC40YLRjCDRgSDRjdC/0YHQuNC70L7QvdC+0LwsXHJcbiAgICAvLyDQuNC90LDRh9C1INCy0L7Qt9C80L7QttC90Ysg0L7RiNC40LHQutC4INC+0LrRgNGD0LPQu9C10L3QuNGPXHJcbiAgICBpZiAoTWF0aC5hYnMoZGVsdGFZKSA+IEVQUykge1xyXG4gICAgICAgIHJldHVybiBkZWx0YVkgPCAwID8gLTEgOiAxO1xyXG4gICAgLy8g0LXRgdC70LggeSDQvtCx0LXQuNGFINGB0L7QsdGL0YLQuNC5INGA0LDQstC90YtcclxuICAgIC8vINC/0YDQvtCy0LXRgNGP0LXQvCDRg9Cz0L7QuyDQv9GA0Y/QvNGL0YVcclxuICAgIC8vINGH0LXQvCDQutGA0YPRh9C1INC/0YDRj9C80LDRjywg0YLQtdC8INC90LjQttC1INC10LUg0LvQtdCy0YvQuSDQutC+0L3QtdGGLCDQt9C90LDRh9C40YIg0YHQvtCx0YvRgtC40LUg0YDQsNGB0L/QvtC70LDQs9Cw0LXQvCDQvdC40LbQtVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgYVNsb3BlID0gZ2V0U2xvcGUoYSksXHJcbiAgICAgICAgICAgIGJTbG9wZSA9IGdldFNsb3BlKGIpO1xyXG5cclxuICAgICAgICBpZiAoYVNsb3BlICE9PSBiU2xvcGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICdiZWZvcmUnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYVNsb3BlID4gYlNsb3BlID8gLTEgOiAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFTbG9wZSA+IGJTbG9wZSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vINC/0L7RgdC70LUg0YHRgNCw0LLQvdC10L3QuNGPINC/0L4geSDQv9C10YDQtdGB0LXRh9C10L3QuNGPINGB0L4g0YHQstC40L/Qu9Cw0LnQvdC+0LxcclxuICAgIC8vINC4INGB0YDQsNCy0L3QtdC90LjRjyDRg9C60LvQvtC90L7QslxyXG4gICAgLy8g0L7RgdGC0LDQtdGC0YHRjyDRgdC70YPRh9Cw0LksINC60L7Qs9C00LAg0YPQutC70L7QvdGLINGA0LDQstC90YtcclxuICAgIC8vIChpZiBhU2xvcGUgPT09IGJTbG9wZSlcclxuICAgIC8vINC4IDIg0L7RgtGA0LXQt9C60LAg0LvQtdC20LDRgiDQvdCwINC+0LTQvdC+0Lkg0L/RgNGP0LzQvtC5XHJcbiAgICAvLyDQsiDRgtCw0LrQvtC8INGB0LvRg9GH0LDQtVxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LjQvCDQv9C+0LvQvtC20LXQvdC40LUg0LrQvtC90YbQvtCyINC+0YLRgNC10LfQutC+0LJcclxuICAgIGRlbHRhWDEgPSB4MSAtIHgzO1xyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC40Lwg0LLQt9Cw0LjQvNC90L7QtSDQv9C+0LvQvtC20LXQvdC40LUg0LvQtdCy0YvRhSDQutC+0L3RhtC+0LJcclxuICAgIGlmIChkZWx0YVgxICE9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhWDEgPCAwID8gLTEgOiAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC40Lwg0LLQt9Cw0LjQvNC90L7QtSDQv9C+0LvQvtC20LXQvdC40LUg0L/RgNCw0LLRi9GFINC60L7QvdGG0L7QslxyXG4gICAgZGVsdGFYMiA9IHgyIC0geDQ7XHJcblxyXG4gICAgaWYgKGRlbHRhWDIgIT09IDApIHtcclxuICAgICAgICByZXR1cm4gZGVsdGFYMiA8IDAgPyAtMSA6IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7RgtGA0LXQt9C60Lgg0YHQvtCy0L/QsNC00LDRjtGCXHJcbiAgICByZXR1cm4gMDtcclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBjb21wYXJlUG9pbnRzKGEsIGIpIHtcclxuICAgIHZhciBhSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoYSksXHJcbiAgICAgICAgYklzQXJyYXkgPSBBcnJheS5pc0FycmF5KGIpLFxyXG4gICAgICAgIHgxID0gYUlzQXJyYXkgPyBhWzBdIDogYS54LFxyXG4gICAgICAgIHkxID0gYUlzQXJyYXkgPyBhWzFdIDogYS55LFxyXG4gICAgICAgIHgyID0gYklzQXJyYXkgPyBiWzBdIDogYi54LFxyXG4gICAgICAgIHkyID0gYklzQXJyYXkgPyBiWzFdIDogYi55O1xyXG5cclxuICAgIGlmICh4MSAtIHgyID4gRVBTIHx8IChNYXRoLmFicyh4MSAtIHgyKSA8IEVQUyAmJiB5MSAtIHkyID4gRVBTKSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfSBlbHNlIGlmICh4MiAtIHgxID4gRVBTIHx8IChNYXRoLmFicyh4MSAtIHgyKSA8IEVQUyAmJiB5MiAtIHkxID4gRVBTKSkge1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoeDEgLSB4MikgPCBFUFMgJiYgTWF0aC5hYnMoeTEgLSB5MikgPCBFUFMgKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNsb3BlKHNlZ21lbnQpIHtcclxuICAgIHZhciB4MSA9IHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgeTEgPSBzZWdtZW50WzBdWzFdLFxyXG4gICAgICAgIHgyID0gc2VnbWVudFsxXVswXSxcclxuICAgICAgICB5MiA9IHNlZ21lbnRbMV1bMV07XHJcblxyXG4gICAgaWYgKHgxID09PSB4Mikge1xyXG4gICAgICAgIHJldHVybiAoeTEgPCB5MikgPyBJbmZpbml0eSA6IC0gSW5maW5pdHk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoeTIgLSB5MSkgLyAoeDIgLSB4MSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBnZXRZKHNlZ21lbnQsIHgpIHtcclxuICAgIHZhciBiZWdpbiA9IHNlZ21lbnRbMF0sXHJcbiAgICAgICAgZW5kID0gc2VnbWVudFsxXSxcclxuICAgICAgICBzcGFuID0gc2VnbWVudFsxXVswXSAtIHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgZGVsdGFYMCwgLy8g0YDQsNC30L3QuNGG0LAg0LzQtdC20LTRgyB4INC4IHgg0L3QsNGH0LDQu9CwINC+0YLRgNC10LfQutCwXHJcbiAgICAgICAgZGVsdGFYMSwgLy8g0YDQsNC30L3QuNGG0LAg0LzQtdC20LTRgyB4INC60L7QvdGG0LAg0L7RgtGA0LXQt9C60LAg0LggeFxyXG4gICAgICAgIGlmYWMsICAgIC8vINC/0YDQvtC/0L7RgNGG0LjRjyBkZWx0YVgwINC6INC/0YDQvtC10LrRhtC40LhcclxuICAgICAgICBmYWM7ICAgICAvLyDQv9GA0L7Qv9C+0YDRhtC40Y8gZGVsdGFYMSDQuiDQv9GA0L7QtdC60YbQuNC4XHJcblxyXG4gICAgLy8g0LIg0YHQu9GD0YfQsNC1LCDQtdGB0LvQuCB4INC90LUg0L/QtdGA0LXRgdC10LrQsNC10YLRgdGPINGBINC/0YDQvtC10LrRhtC40LXQuSDQvtGC0YDQtdC30LrQsCDQvdCwINC+0YHRjCB4LFxyXG4gICAgLy8g0LLQvtC30LLRgNGJ0LDQtdGCIHkg0L3QsNGH0LDQu9CwINC40LvQuCDQutC+0L3RhtCwINC+0YLRgNC10LfQutCwXHJcbiAgICBpZiAoeCA8PSBiZWdpblswXSkge1xyXG4gICAgICAgIHJldHVybiBiZWdpblsxXTtcclxuICAgIH0gZWxzZSBpZiAoeCA+PSBlbmRbMF0pIHtcclxuICAgICAgICByZXR1cm4gZW5kWzFdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC10YHQu9C4IHgg0LvQtdC20LjRgiDQstC90YPRgtGA0Lgg0L/RgNC+0LXQutGG0LjQuCDQvtGC0YDQtdC30LrQsCDQvdCwINC+0YHRjCB4XHJcbiAgICAvLyDQstGL0YfQuNGB0LvRj9C10YIg0L/RgNC+0L/QvtGA0YbQuNC4XHJcbiAgICBkZWx0YVgwID0geCAtIGJlZ2luWzBdO1xyXG4gICAgZGVsdGFYMSA9IGVuZFswXSAtIHg7XHJcblxyXG4gICAgaWYgKGRlbHRhWDAgPiBkZWx0YVgxKSB7XHJcbiAgICAgICAgaWZhYyA9IGRlbHRhWDAgLyBzcGFuXHJcbiAgICAgICAgZmFjID0gMSAtIGlmYWM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZhYyA9IGRlbHRhWDEgLyBzcGFuXHJcbiAgICAgICAgaWZhYyA9IDEgLSBmYWM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChiZWdpblsxXSAqIGZhYykgKyAoZW5kWzFdICogaWZhYyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIEVQUzogRVBTLFxyXG4gICAgb25TZWdtZW50OiBvblNlZ21lbnQsXHJcbiAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgIHNlZ21lbnRzSW50ZXJzZWN0OiBzZWdtZW50c0ludGVyc2VjdCxcclxuICAgIGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbjogZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uLFxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBjb21wYXJlU2VnbWVudHMsXHJcbiAgICBjb21wYXJlUG9pbnRzOiBjb21wYXJlUG9pbnRzXHJcbn1cclxuIiwidmFyIFBvaW50ID0gZnVuY3Rpb24gKGNvb3JkcywgdHlwZSkge1xyXG4gICAgdGhpcy54ID0gY29vcmRzWzBdO1xyXG4gICAgdGhpcy55ID0gY29vcmRzWzFdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcclxuIiwiZnVuY3Rpb24gU3dlZXBsaW5lKHBvc2l0aW9uKSB7XHJcbiAgICB0aGlzLnggPSBudWxsO1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG59XHJcblxyXG5Td2VlcGxpbmUucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbn1cclxuU3dlZXBsaW5lLnByb3RvdHlwZS5zZXRYID0gZnVuY3Rpb24gKHgpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3dlZXBsaW5lO1xyXG4iLCIvLyAxKSBFUFMtcm91bmQgaW50ZXJzZWN0aW9uc1xuLy8gMikgaGFuZGxlIGVuZHNcbnZhciBUcmVlID0gcmVxdWlyZSgnYXZsJyksXG4gICAgU3dlZXBsaW5lID0gcmVxdWlyZSgnLi9zbCcpLFxuICAgIFBvaW50ID0gcmVxdWlyZSgnLi9wb2ludCcpLFxuICAgIHV0aWxzID0gcmVxdWlyZSgnLi9nZW9tZXRyeS9nZW9tZXRyeScpO1xuXG4vKipcbiogQHBhcmFtIHtBcnJheX0gc2VnbWVudHMgc2V0IG9mIHNlZ21lbnRzIGludGVyc2VjdGluZyBzd2VlcGxpbmUgW1tbeDEsIHkxXSwgW3gyLCB5Ml1dIC4uLiBbW3htLCB5bV0sIFt4biwgeW5dXV1cbiovXG5mdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9ucyhzZWdtZW50cywgbWFwKSB7XG4gICAgdmFyIHN3ZWVwbGluZSA9IG5ldyBTd2VlcGxpbmUoJ2JlZm9yZScpLFxuICAgICAgICBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMsIHRydWUpLFxuICAgICAgICBzdGF0dXMgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlU2VnbWVudHMuYmluZChzd2VlcGxpbmUpKSxcbiAgICAgICAgb3V0cHV0ID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVBvaW50cywgdHJ1ZSk7XG5cbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50LCBpLCBhKSB7XG4gICAgICAgIHNlZ21lbnQuc29ydCh1dGlscy5jb21wYXJlUG9pbnRzKTtcbiAgICAgICAgdmFyIGJlZ2luID0gbmV3IFBvaW50KHNlZ21lbnRbMF0sICdiZWdpbicpLFxuICAgICAgICAgICAgZW5kID0gbmV3IFBvaW50KHNlZ21lbnRbMV0sICdlbmQnKTtcblxuICAgICAgICBxdWV1ZS5pbnNlcnQoYmVnaW4sIGJlZ2luKTtcbiAgICAgICAgYmVnaW4gPSBxdWV1ZS5maW5kKGJlZ2luKS5rZXk7XG4gICAgICAgIGJlZ2luLnNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG5cbiAgICAgICAgcXVldWUuaW5zZXJ0KGVuZCwgZW5kKTtcblxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKHF1ZXVlLmtleXMoKSk7XG5cbiAgICB3aGlsZSAoIXF1ZXVlLmlzRW1wdHkoKSkge1xuICAgICAgICB2YXIgcG9pbnQgPSBxdWV1ZS5wb3AoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1NURVAnKTtcblxuICAgICAgICBoYW5kbGVFdmVudFBvaW50KHBvaW50LmtleSwgc3RhdHVzLCBvdXRwdXQsIHF1ZXVlLCBzd2VlcGxpbmUsIG1hcCk7XG4gICAgICAgIGlmIChxdWV1ZS5rZXlzKCkubGVuZ3RoID4gMTUpIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXQua2V5cygpLm1hcChmdW5jdGlvbihrZXkpe1xuICAgICAgICByZXR1cm4gW2tleS54LCBrZXkueV07XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUV2ZW50UG9pbnQocG9pbnQsIHN0YXR1cywgb3V0cHV0LCBxdWV1ZSwgc3dlZXBsaW5lLCBtYXApIHtcbiAgICBzd2VlcGxpbmUuc2V0UG9zaXRpb24oJ2JlZm9yZScpO1xuICAgIHN3ZWVwbGluZS5zZXRYKHBvaW50LngpO1xuXG4gICAgY29uc29sZS5sb2coc3RhdHVzLnRvU3RyaW5nKCkpO1xuXG4gICAgdmFyIFVwID0gcG9pbnQuc2VnbWVudHMsIC8vIHNlZ21lbnRzLCBmb3Igd2hpY2ggdGhpcyBpcyB0aGUgbGVmdCBlbmRcbiAgICAgICAgTHAgPSBbXSwgICAgICAgICAgICAgLy8gc2VnbWVudHMsIGZvciB3aGljaCB0aGlzIGlzIHRoZSByaWdodCBlbmRcbiAgICAgICAgQ3AgPSBbXTsgICAgICAgICAgICAgLy8gLy8gc2VnbWVudHMsIGZvciB3aGljaCB0aGlzIGlzIGFuIGlubmVyIHBvaW50XG5cbiAgICAvLyBzdGVwIDJcbiAgICBzdGF0dXMuZm9yRWFjaChmdW5jdGlvbihub2RlLCBpKSB7XG4gICAgICAgIHZhciBzZWdtZW50ID0gbm9kZS5rZXksXG4gICAgICAgICAgICBzZWdtZW50QmVnaW4gPSBzZWdtZW50WzBdLFxuICAgICAgICAgICAgc2VnbWVudEVuZCA9IHNlZ21lbnRbMV07XG5cbiAgICAgICAgLy8gY291bnQgcmlnaHQtZW5kc1xuICAgICAgICBpZiAoTWF0aC5hYnMocG9pbnQueCAtIHNlZ21lbnRFbmRbMF0pIDwgdXRpbHMuRVBTICYmIE1hdGguYWJzKHBvaW50LnkgLSBzZWdtZW50RW5kWzFdKSA8IHV0aWxzLkVQUykge1xuICAgICAgICAgICAgTHAucHVzaChzZWdtZW50KTtcbiAgICAgICAgLy8gY291bnQgaW5uZXIgcG9pbnRzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBmaWx0ZXIgbGVmdCBlbmRzXG4gICAgICAgICAgICBpZiAoIShNYXRoLmFicyhwb2ludC54IC0gc2VnbWVudEJlZ2luWzBdKSA8IHV0aWxzLkVQUyAmJiBNYXRoLmFicyhwb2ludC55IC0gc2VnbWVudEJlZ2luWzFdKSA8IHV0aWxzLkVQUykpIHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModXRpbHMuZGlyZWN0aW9uKHNlZ21lbnRCZWdpbiwgc2VnbWVudEVuZCwgW3BvaW50LngsIHBvaW50LnldKSkgPCB1dGlscy5FUFMgJiYgdXRpbHMub25TZWdtZW50KHNlZ21lbnRCZWdpbiwgc2VnbWVudEVuZCwgW3BvaW50LngsIHBvaW50LnldKSkge1xuICAgICAgICAgICAgICAgICAgICBDcC5wdXNoKHNlZ21lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKFtdLmNvbmNhdChVcCwgTHAsIENwKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIG91dHB1dC5pbnNlcnQocG9pbnQsIHBvaW50KTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBDcC5sZW5ndGg7IGorKykge1xuICAgICAgICBzdGF0dXMucmVtb3ZlKENwW2pdKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrID0gMDsgayA8IExwLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIC8vIHN0YXR1cy5yZW1vdmUoTHBba10pO1xuICAgIH1cblxuICAgIHN3ZWVwbGluZS5zZXRQb3NpdGlvbignYWZ0ZXInKTtcblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgVXAubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgaWYgKCFzdGF0dXMuY29udGFpbnMoVXBba10pKSB7XG4gICAgICAgICAgICBzdGF0dXMuaW5zZXJ0KFVwW2tdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBsID0gMDsgbCA8IENwLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgIGlmICghc3RhdHVzLmNvbnRhaW5zKENwW2xdKSkge1xuICAgICAgICAgICAgc3RhdHVzLmluc2VydChDcFtsXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoVXAubGVuZ3RoID09PSAwICYmIENwLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IExwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IExwW2ldLFxuICAgICAgICAgICAgICAgIHNOb2RlID0gc3RhdHVzLmZpbmQocyksXG4gICAgICAgICAgICAgICAgc2wgPSBzdGF0dXMucHJldihzTm9kZSksXG4gICAgICAgICAgICAgICAgc3IgPSBzdGF0dXMubmV4dChzTm9kZSk7XG5cbiAgICAgICAgICAgIGlmIChzbCAmJiBzcikge1xuICAgICAgICAgICAgICAgIGZpbmROZXdFdmVudChzbC5rZXksIHNyLmtleSwgcG9pbnQsIG91dHB1dCwgcXVldWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdGF0dXMucmVtb3ZlKHMpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIFVDcCA9IFtdLmNvbmNhdChVcCwgQ3ApLnNvcnQodXRpbHMuY29tcGFyZVNlZ21lbnRzKSxcbiAgICAgICAgICAgIFVDcG1pbiA9IFVDcFswXSxcbiAgICAgICAgICAgIHNsbE5vZGUgPSBzdGF0dXMuZmluZChVQ3BtaW4pLFxuICAgICAgICAgICAgVUNwbWF4ID0gVUNwW1VDcC5sZW5ndGgtMV0sXG4gICAgICAgICAgICBzcnJOb2RlID0gc3RhdHVzLmZpbmQoVUNwbWF4KSxcbiAgICAgICAgICAgIHNsbCA9IHNsbE5vZGUgJiYgc3RhdHVzLnByZXYoc2xsTm9kZSksXG4gICAgICAgICAgICBzcnIgPSBzcnJOb2RlICYmIHN0YXR1cy5uZXh0KHNyck5vZGUpO1xuXG4gICAgICAgIGlmIChzbGwgJiYgVUNwbWluKSB7XG4gICAgICAgICAgICBmaW5kTmV3RXZlbnQoc2xsLmtleSwgVUNwbWluLCBwb2ludCwgb3V0cHV0LCBxdWV1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3JyICYmIFVDcG1heCkge1xuICAgICAgICAgICAgZmluZE5ld0V2ZW50KHNyci5rZXksIFVDcG1heCwgcG9pbnQsIG91dHB1dCwgcXVldWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBMcC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgc3RhdHVzLnJlbW92ZShMcFtqXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxuZnVuY3Rpb24gZmluZE5ld0V2ZW50KHNsLCBzciwgcG9pbnQsIG91dHB1dCwgcXVldWUpIHtcbiAgICB2YXIgaW50ZXJzZWN0aW9uQ29vcmRzID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNsLCBzciksXG4gICAgICAgIGludGVyc2VjdGlvblBvaW50O1xuXG4gICAgaWYgKGludGVyc2VjdGlvbkNvb3Jkcykge1xuICAgICAgICBpbnRlcnNlY3Rpb25Qb2ludCA9IG5ldyBQb2ludChpbnRlcnNlY3Rpb25Db29yZHMsICdpbnRlcnNlY3Rpb24nKTtcblxuICAgICAgICBpZiAoIXF1ZXVlLmNvbnRhaW5zKGludGVyc2VjdGlvblBvaW50KSkge1xuICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGludGVyc2VjdGlvblBvaW50LCBpbnRlcnNlY3Rpb25Qb2ludCk7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQuaW5zZXJ0KGludGVyc2VjdGlvblBvaW50LCBpbnRlcnNlY3Rpb25Qb2ludCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBvaW50KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cob3V0cHV0LmtleXMoKSk7XG5cbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xuIl19
