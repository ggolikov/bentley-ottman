(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// regular grid
module.exports = [[[37.5765, 55.7782], [37.5765, 55.6782]], [[37.5865, 55.7782], [37.5865, 55.6782]], [[37.5765, 55.7782], [37.5865, 55.7782]], [[37.5765, 55.7282], [37.5865, 55.7282]], [[37.5765, 55.6782], [37.5865, 55.6782]]];
// end error
// module.exports = [
//     [[37.576589059608146,55.778272295314814],[37.57574935424275,55.70104339022442]],
//     [[37.56260638695059,55.72944065081474],[37.608857685983835,55.76952468620582]],
//     [[37.62052551114358,55.716581515725764],[37.737585270471534,55.66059951849475]],
//     [[37.53966296998365,55.776081837506865],[37.71943461998793,55.705676857929866]],
//     [[37.67826318656725,55.680881457597856],[37.6354909366176,55.838840931769305]]
// ];

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
    pointsCount = 10,
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

drawLines(data);
// console.log(pointsCount / 2);
console.time('counting...');
var ps = findIntersections(data, map);
console.timeEnd('counting...');
console.log(ps);
console.log(ps.length);

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
var EPS = 1E-9;
var EPS2 = 0.04;
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
    } else if (Math.abs(x1 - x2) < EPS2 && Math.abs(y1 - y2) < EPS2) {
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
    console.log(queue.keys());
    console.log(queue.keys().length);
    while (!queue.isEmpty()) {
        var point = queue.pop();
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
                if (Math.abs(utils.direction(segmentBegin, segmentEnd, [point.x, point.y])) < utils.EPS && utils.onSegment(segmentBegin, segmentEnd, [point.x, point.y])) {
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
        if (!output.contains(point)) {
            console.log('output.insert');
            output.insert(point, point);
        }
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
        // console.log('point');
        // console.log(point);
        // console.log('intersectionCoords');
        // console.log(intersectionCoords);
        intersectionPoint = new Point(intersectionCoords, 'intersection');

        queue.insert(intersectionPoint, intersectionPoint);
        output.insert(intersectionPoint, intersectionPoint);
    }
}
module.exports = findIntersections;

},{"./geometry/geometry":5,"./point":6,"./sl":7,"avl":4}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXGdlb21ldHJ5XFxnZW9tZXRyeS5qcyIsInNyY1xccG9pbnQuanMiLCJzcmNcXHNsLmpzIiwic3JjXFxzd2VlcGxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixDQUNiLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FEYSxFQUViLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FGYSxFQUliLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FKYSxFQUtiLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FMYSxFQU1iLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FOYSxDQUFqQjtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQSxJQUFJLG9CQUFvQixRQUFRLGFBQVIsQ0FBeEI7QUFDQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksTUFBTSxFQUFFLFNBQUYsQ0FBWSxpRUFBWixFQUErRTtBQUNqRixhQUFTLEVBRHdFO0FBRWpGLGlCQUFhO0FBRm9FLENBQS9FLENBQVY7QUFBQSxJQUlJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFULENB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMW5CQSxJQUFJLE1BQU0sSUFBVjtBQUNBLElBQUksT0FBTyxJQUFYO0FBQ0E7Ozs7O0FBS0EsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCO0FBQ3hCLFFBQUksS0FBSyxFQUFFLENBQUYsQ0FBVDtBQUFBLFFBQ0ksS0FBSyxFQUFFLENBQUYsQ0FEVDtBQUFBLFFBRUksS0FBSyxFQUFFLENB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OztBQUVELGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxHQUFHLE1BQXZCLEVBQStCLEdBQS9CLEVBQW9DO0FBQ2hDLG1CQUFPLE1BQVAsQ0FBYyxHQUFHLENBQUgsQ0FBZDtBQUNIO0FBQ0o7QUFDRCxXQUFPLE1BQVA7QUFDSDs7QUFFRCxTQUFTLFlBQVQsQ0FBc0IsRUFBdEIsRUFBMEIsRUFBMUIsRUFBOEIsS0FBOUIsRUFBcUMsTUFBckMsRUFBNkMsS0FBN0MsRUFBb0Q7QUFDaEQsUUFBSSxxQkFBcUIsTUFBTSx3QkFBTixDQUErQixFQUEvQixFQUFtQyxFQUFuQyxDQUF6QjtBQUFBLFFBQ0ksaUJBREo7O0FBR0EsUUFBSSxrQkFBSixFQUF3QjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixJQUFJLEtBQUosQ0FBVSxrQkFBVixFQUE4QixjQUE5QixDQUFwQjs7QUFFQSxjQUFNLE1BQU4sQ0FBYSxpQkFBYixFQUFnQyxpQkFBaEM7QUFDQSxlQUFPLE1BQVAsQ0FBYyxpQkFBZCxFQUFpQyxpQkFBakM7QUFDSDtBQUNKO0FBQ0QsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyByZWd1bGFyIGdyaWRcclxubW9kdWxlLmV4cG9ydHMgPSBbXHJcbiAgICBbWzM3LjU3NjUsNTUuNzc4Ml0sWzM3LjU3NjUsNTUuNjc4Ml1dLFxyXG4gICAgW1szNy41ODY1LDU1Ljc3ODJdLFszNy41ODY1LDU1LjY3ODJdXSxcclxuXHJcbiAgICBbWzM3LjU3NjUsNTUuNzc4Ml0sWzM3LjU4NjUsNTUuNzc4Ml1dLFxyXG4gICAgW1szNy41NzY1LDU1LjcyODJdLFszNy41ODY1LDU1LjcyODJdXSxcclxuICAgIFtbMzcuNTc2NSw1NS42NzgyXSxbMzcuNTg2NSw1NS42NzgyXV0sXHJcbl07XHJcbi8vIGVuZCBlcnJvclxyXG4vLyBtb2R1bGUuZXhwb3J0cyA9IFtcclxuLy8gICAgIFtbMzcuNTc2NTg5MDU5NjA4MTQ2LDU1Ljc3ODI3MjI5NTMxNDgxNF0sWzM3LjU3NTc0OTM1NDI0Mjc1LDU1LjcwMTA0MzM5MDIyNDQyXV0sXHJcbi8vICAgICBbWzM3LjU2MjYwNjM4Njk1MDU5LDU1LjcyOTQ0MDY1MDgxNDc0XSxbMzcuNjA4ODU3Njg1OTgzODM1LDU1Ljc2OTUyNDY4NjIwNTgyXV0sXHJcbi8vICAgICBbWzM3LjYyMDUyNTUxMTE0MzU4LDU1LjcxNjU4MTUxNTcyNTc2NF0sWzM3LjczNzU4NTI3MDQ3MTUzNCw1NS42NjA1OTk1MTg0OTQ3NV1dLFxyXG4vLyAgICAgW1szNy41Mzk2NjI5Njk5ODM2NSw1NS43NzYwODE4Mzc1MDY4NjVdLFszNy43MTk0MzQ2MTk5ODc5Myw1NS43MDU2NzY4NTc5Mjk4NjZdXSxcclxuLy8gICAgIFtbMzcuNjc4MjYzMTg2NTY3MjUsNTUuNjgwODgxNDU3NTk3ODU2XSxbMzcuNjM1NDkwOTM2NjE3Niw1NS44Mzg4NDA5MzE3NjkzMDVdXVxyXG4vLyBdO1xyXG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xyXG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEvaW5kZXguanMnKTtcclxuXHJcbnZhciBvc20gPSBMLnRpbGVMYXllcignaHR0cDovL3tzfS5iYXNlbWFwcy5jYXJ0b2Nkbi5jb20vbGlnaHRfbm9sYWJlbHMve3p9L3t4fS97eX0ucG5nJywge1xyXG4gICAgICAgIG1heFpvb206IDIyLFxyXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5vcmdcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+J1xyXG4gICAgfSksXHJcbiAgICBwb2ludCA9IEwubGF0TG5nKFs1NS43NTMyMTAsIDM3LjYyMTc2Nl0pLFxyXG4gICAgbWFwID0gbmV3IEwuTWFwKCdtYXAnLCB7bGF5ZXJzOiBbb3NtXSwgY2VudGVyOiBwb2ludCwgem9vbTogMTEsIG1heFpvb206IDIyfSksXHJcbiAgICByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKTtcclxuXHJcbndpbmRvdy5tYXAgPSBtYXA7XHJcblxyXG52YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpLFxyXG4gICAgbiA9IGJvdW5kcy5fbm9ydGhFYXN0LmxhdCxcclxuICAgIGUgPSBib3VuZHMuX25vcnRoRWFzdC5sbmcsXHJcbiAgICBzID0gYm91bmRzLl9zb3V0aFdlc3QubGF0LFxyXG4gICAgdyA9IGJvdW5kcy5fc291dGhXZXN0LmxuZyxcclxuICAgIGhlaWdodCA9IG4gLSBzLFxyXG4gICAgd2lkdGggPSBlIC0gdyxcclxuICAgIHFIZWlnaHQgPSBoZWlnaHQgLyA0LFxyXG4gICAgcVdpZHRoID0gd2lkdGggLyA0LFxyXG4gICAgcmFuZG9tID0gZmFsc2UsXHJcbiAgICBwb2ludHNDb3VudCA9IDEwLFxyXG4gICAgbGluZXMgPSBbXTtcclxuXHJcbmlmIChyYW5kb20pIHtcclxuICAgIGRhdGEgPSBbXTtcclxuICAgIHZhciBwb2ludHMgPSB0dXJmLnJhbmRvbVBvaW50KHBvaW50c0NvdW50LCB7XHJcbiAgICAgICAgYmJveDogW3cgKyBxV2lkdGgsIHMgKyBxSGVpZ2h0LCBlIC0gcVdpZHRoLCBuIC0gcUhlaWdodF1cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBjb29yZHMgPSBwb2ludHMuZmVhdHVyZXMubWFwKGZ1bmN0aW9uKGZlYXR1cmUpIHtcclxuICAgICAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcclxuICAgIH0pXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgZGF0YS5wdXNoKFtjb29yZHNbaV0sIGNvb3Jkc1tpKzFdXSk7XHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuXHJcblxyXG5kcmF3TGluZXMoZGF0YSk7XHJcbi8vIGNvbnNvbGUubG9nKHBvaW50c0NvdW50IC8gMik7XHJcbmNvbnNvbGUudGltZSgnY291bnRpbmcuLi4nKTtcclxudmFyIHBzID0gZmluZEludGVyc2VjdGlvbnMoZGF0YSwgbWFwKTtcclxuY29uc29sZS50aW1lRW5kKCdjb3VudGluZy4uLicpO1xyXG5jb25zb2xlLmxvZyhwcyk7XHJcbmNvbnNvbGUubG9nKHBzLmxlbmd0aCk7XHJcblxyXG5wcy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKSwge3JhZGl1czogNSwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5iaW5kUG9wdXAocFswXSArICdcXG4gJyArIHBbMV0pLmFkZFRvKG1hcCk7XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBkcmF3TGluZXMoYXJyYXkpIHtcclxuICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcclxuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLnNsaWNlKCkucmV2ZXJzZSgpLFxyXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdLnNsaWNlKCkucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhiZWdpbiksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoZW5kKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcclxuICAgICAgICBMLnBvbHlsaW5lKFtiZWdpbiwgZW5kXSwge3dlaWdodDogMX0pLmFkZFRvKG1hcCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gY29uc29sZS5sb2cocHMpO1xyXG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuL3NyYy9zd2VlcGxpbmUuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XHJcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5hdmwgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUHJpbnRzIHRyZWUgaG9yaXpvbnRhbGx5XG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHByaW50IChyb290LCBwcmludE5vZGUpIHtcbiAgaWYgKCBwcmludE5vZGUgPT09IHZvaWQgMCApIHByaW50Tm9kZSA9IGZ1bmN0aW9uIChuKSB7IHJldHVybiBuLmtleTsgfTtcblxuICB2YXIgb3V0ID0gW107XG4gIHJvdyhyb290LCAnJywgdHJ1ZSwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG91dC5wdXNoKHYpOyB9LCBwcmludE5vZGUpO1xuICByZXR1cm4gb3V0LmpvaW4oJycpO1xufVxuXG4vKipcbiAqIFByaW50cyBsZXZlbCBvZiB0aGUgdHJlZVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgIHByZWZpeFxuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICBpc1RhaWxcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKGluOnN0cmluZyk6dm9pZH0gICAgb3V0XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gIHByaW50Tm9kZVxuICovXG5mdW5jdGlvbiByb3cgKHJvb3QsIHByZWZpeCwgaXNUYWlsLCBvdXQsIHByaW50Tm9kZSkge1xuICBpZiAocm9vdCkge1xuICAgIG91dCgoXCJcIiArIHByZWZpeCArIChpc1RhaWwgPyAn4pSU4pSA4pSAICcgOiAn4pSc4pSA4pSAICcpICsgKHByaW50Tm9kZShyb290KSkgKyBcIlxcblwiKSk7XG4gICAgdmFyIGluZGVudCA9IHByZWZpeCArIChpc1RhaWwgPyAnICAgICcgOiAn4pSCICAgJyk7XG4gICAgaWYgKHJvb3QubGVmdCkgIHsgcm93KHJvb3QubGVmdCwgIGluZGVudCwgZmFsc2UsIG91dCwgcHJpbnROb2RlKTsgfVxuICAgIGlmIChyb290LnJpZ2h0KSB7IHJvdyhyb290LnJpZ2h0LCBpbmRlbnQsIHRydWUsICBvdXQsIHByaW50Tm9kZSk7IH1cbiAgfVxufVxuXG5cbi8qKlxuICogSXMgdGhlIHRyZWUgYmFsYW5jZWQgKG5vbmUgb2YgdGhlIHN1YnRyZWVzIGRpZmZlciBpbiBoZWlnaHQgYnkgbW9yZSB0aGFuIDEpXG4gKiBAcGFyYW0gIHtOb2RlfSAgICByb290XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0JhbGFuY2VkKHJvb3QpIHtcbiAgaWYgKHJvb3QgPT09IG51bGwpIHsgcmV0dXJuIHRydWU7IH0gLy8gSWYgbm9kZSBpcyBlbXB0eSB0aGVuIHJldHVybiB0cnVlXG5cbiAgLy8gR2V0IHRoZSBoZWlnaHQgb2YgbGVmdCBhbmQgcmlnaHQgc3ViIHRyZWVzXG4gIHZhciBsaCA9IGhlaWdodChyb290LmxlZnQpO1xuICB2YXIgcmggPSBoZWlnaHQocm9vdC5yaWdodCk7XG5cbiAgaWYgKE1hdGguYWJzKGxoIC0gcmgpIDw9IDEgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5sZWZ0KSAgJiZcbiAgICAgIGlzQmFsYW5jZWQocm9vdC5yaWdodCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAvLyBJZiB3ZSByZWFjaCBoZXJlIHRoZW4gdHJlZSBpcyBub3QgaGVpZ2h0LWJhbGFuY2VkXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgZnVuY3Rpb24gQ29tcHV0ZSB0aGUgJ2hlaWdodCcgb2YgYSB0cmVlLlxuICogSGVpZ2h0IGlzIHRoZSBudW1iZXIgb2Ygbm9kZXMgYWxvbmcgdGhlIGxvbmdlc3QgcGF0aFxuICogZnJvbSB0aGUgcm9vdCBub2RlIGRvd24gdG8gdGhlIGZhcnRoZXN0IGxlYWYgbm9kZS5cbiAqXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGhlaWdodChub2RlKSB7XG4gIHJldHVybiBub2RlID8gKDEgKyBNYXRoLm1heChoZWlnaHQobm9kZS5sZWZ0KSwgaGVpZ2h0KG5vZGUucmlnaHQpKSkgOiAwO1xufVxuXG4vLyBmdW5jdGlvbiBjcmVhdGVOb2RlIChwYXJlbnQsIGxlZnQsIHJpZ2h0LCBoZWlnaHQsIGtleSwgZGF0YSkge1xuLy8gICByZXR1cm4geyBwYXJlbnQsIGxlZnQsIHJpZ2h0LCBiYWxhbmNlRmFjdG9yOiBoZWlnaHQsIGtleSwgZGF0YSB9O1xuLy8gfVxuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIHBhcmVudDogICAgICAgIE5vZGV8TnVsbCxcbiAqICAgbGVmdDogICAgICAgICAgTm9kZXxOdWxsLFxuICogICByaWdodDogICAgICAgICBOb2RlfE51bGwsXG4gKiAgIGJhbGFuY2VGYWN0b3I6IE51bWJlcixcbiAqICAga2V5OiAgICAgICAgICAgYW55LFxuICogICBkYXRhOiAgICAgICAgICBvYmplY3Q/XG4gKiB9fSBOb2RlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7Kn0gS2V5XG4gKi9cblxuLyoqXG4gKiBEZWZhdWx0IGNvbXBhcmlzb24gZnVuY3Rpb25cbiAqIEBwYXJhbSB7Kn0gYVxuICogQHBhcmFtIHsqfSBiXG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfQ09NUEFSRSAoYSwgYikgeyByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7IH1cblxuXG4vKipcbiAqIFNpbmdsZSBsZWZ0IHJvdGF0aW9uXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5mdW5jdGlvbiByb3RhdGVMZWZ0IChub2RlKSB7XG4gIHZhciByaWdodE5vZGUgPSBub2RlLnJpZ2h0O1xuICBub2RlLnJpZ2h0ICAgID0gcmlnaHROb2RlLmxlZnQ7XG5cbiAgaWYgKHJpZ2h0Tm9kZS5sZWZ0KSB7IHJpZ2h0Tm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICByaWdodE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChyaWdodE5vZGUucGFyZW50KSB7XG4gICAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5sZWZ0ID0gcmlnaHROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LnJpZ2h0ID0gcmlnaHROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gcmlnaHROb2RlO1xuICByaWdodE5vZGUubGVmdCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChyaWdodE5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gcmlnaHROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuICByZXR1cm4gcmlnaHROb2RlO1xufVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZVJpZ2h0IChub2RlKSB7XG4gIHZhciBsZWZ0Tm9kZSA9IG5vZGUubGVmdDtcbiAgbm9kZS5sZWZ0ID0gbGVmdE5vZGUucmlnaHQ7XG4gIGlmIChub2RlLmxlZnQpIHsgbm9kZS5sZWZ0LnBhcmVudCA9IG5vZGU7IH1cblxuICBsZWZ0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKGxlZnROb2RlLnBhcmVudCkge1xuICAgIGlmIChsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkge1xuICAgICAgbGVmdE5vZGUucGFyZW50LmxlZnQgPSBsZWZ0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdE5vZGUucGFyZW50LnJpZ2h0ID0gbGVmdE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSBsZWZ0Tm9kZTtcbiAgbGVmdE5vZGUucmlnaHQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobGVmdE5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gbGVmdE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA8IDApIHtcbiAgICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IG5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJldHVybiBsZWZ0Tm9kZTtcbn1cblxuXG4vLyBmdW5jdGlvbiBsZWZ0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSByb3RhdGVMZWZ0KG5vZGUubGVmdCk7XG4vLyAgIHJldHVybiByb3RhdGVSaWdodChub2RlKTtcbi8vIH1cblxuXG4vLyBmdW5jdGlvbiByaWdodEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgcm90YXRlUmlnaHQobm9kZS5yaWdodCk7XG4vLyAgIHJldHVybiByb3RhdGVMZWZ0KG5vZGUpO1xuLy8gfVxuXG5cbnZhciBUcmVlID0gZnVuY3Rpb24gVHJlZSAoY29tcGFyYXRvcikge1xuICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvciB8fCBERUZBVUxUX0NPTVBBUkU7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xuICB0aGlzLl9zaXplID0gMDtcbn07XG5cbnZhciBwcm90b3R5cGVBY2Nlc3NvcnMgPSB7IHNpemU6IHt9IH07XG5cblxuLyoqXG4gKiBDbGVhciB0aGUgdHJlZVxuICovXG5UcmVlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xufTtcblxuLyoqXG4gKiBOdW1iZXIgb2Ygbm9kZXNcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xucHJvdG90eXBlQWNjZXNzb3JzLnNpemUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc2l6ZTtcbn07XG5cblxuLyoqXG4gKiBXaGV0aGVyIHRoZSB0cmVlIGNvbnRhaW5zIGEgbm9kZSB3aXRoIHRoZSBnaXZlbiBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyAoa2V5KSB7XG4gIGlmICh0aGlzLl9yb290KXtcbiAgICB2YXIgbm9kZSAgICAgPSB0aGlzLl9yb290O1xuICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgICB3aGlsZSAobm9kZSl7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcihrZXksIG5vZGUua2V5KTtcbiAgICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qIGVzbGludC1kaXNhYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuLyoqXG4gKiBTdWNjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIG5leHQgKG5vZGUpIHtcbiAgdmFyIHN1Y2Nlc3NvciA9IG5vZGU7XG4gIGlmIChzdWNjZXNzb3IpIHtcbiAgICBpZiAoc3VjY2Vzc29yLnJpZ2h0KSB7XG4gICAgICBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucmlnaHQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5sZWZ0KSB7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5sZWZ0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2Nlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IucmlnaHQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHN1Y2Nlc3Nvcjsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN1Y2Nlc3Nvcjtcbn07XG5cblxuLyoqXG4gKiBQcmVkZWNlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gcHJldiAobm9kZSkge1xuICB2YXIgcHJlZGVjZXNzb3IgPSBub2RlO1xuICBpZiAocHJlZGVjZXNzb3IpIHtcbiAgICBpZiAocHJlZGVjZXNzb3IubGVmdCkge1xuICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5sZWZ0O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLnJpZ2h0KSB7IHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucmlnaHQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZGVjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5sZWZ0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBwcmVkZWNlc3NvcjtcbiAgICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwcmVkZWNlc3Nvcjtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuXG4vKipcbiAqIEBwYXJhbXtGdW5jdGlvbihub2RlOk5vZGUpOnZvaWR9IGZuXG4gKiBAcmV0dXJuIHtBVkxUcmVlfVxuICovXG5UcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaCAoZm4pIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCBkb25lID0gZmFsc2UsIGkgPSAwO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIC8vIFJlYWNoIHRoZSBsZWZ0IG1vc3QgTm9kZSBvZiB0aGUgY3VycmVudCBOb2RlXG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIC8vIFBsYWNlIHBvaW50ZXIgdG8gYSB0cmVlIG5vZGUgb24gdGhlIHN0YWNrXG4gICAgICAvLyBiZWZvcmUgdHJhdmVyc2luZyB0aGUgbm9kZSdzIGxlZnQgc3VidHJlZVxuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQmFja1RyYWNrIGZyb20gdGhlIGVtcHR5IHN1YnRyZWUgYW5kIHZpc2l0IHRoZSBOb2RlXG4gICAgICAvLyBhdCB0aGUgdG9wIG9mIHRoZSBzdGFjazsgaG93ZXZlciwgaWYgdGhlIHN0YWNrIGlzXG4gICAgICAvLyBlbXB0eSB5b3UgYXJlIGRvbmVcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIGZuKGN1cnJlbnQsIGkrKyk7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSB2aXNpdGVkIHRoZSBub2RlIGFuZCBpdHMgbGVmdFxuICAgICAgICAvLyBzdWJ0cmVlLiBOb3csIGl0J3MgcmlnaHQgc3VidHJlZSdzIHR1cm5cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBrZXlzIGluIG9yZGVyXG4gKiBAcmV0dXJuIHtBcnJheTxLZXk+fVxuICovXG5UcmVlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24ga2V5cyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmtleSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBgZGF0YWAgZmllbGRzIG9mIGFsbCBub2RlcyBpbiBvcmRlci5cbiAqIEByZXR1cm4ge0FycmF5PCo+fVxuICovXG5UcmVlLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiB2YWx1ZXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5kYXRhKTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWluaW11bSBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWluTm9kZSA9IGZ1bmN0aW9uIG1pbk5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1heCBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWF4Tm9kZSA9IGZ1bmN0aW9uIG1heE5vZGUgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBNaW4ga2V5XG4gKiBAcmV0dXJuIHtLZXl9XG4gKi9cblRyZWUucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uIG1pbiAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG4vKipcbiAqIE1heCBrZXlcbiAqIEByZXR1cm4ge0tleXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiBtYXggKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5yaWdodCkgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICByZXR1cm4gbm9kZS5rZXk7XG59O1xuXG5cbi8qKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uIGlzRW1wdHkgKCkge1xuICByZXR1cm4gIXRoaXMuX3Jvb3Q7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgbm9kZSB3aXRoIHNtYWxsZXN0IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiBwb3AgKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3QsIHJldHVyblZhbHVlID0gbnVsbDtcbiAgaWYgKG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICByZXR1cm5WYWx1ZSA9IHsga2V5OiBub2RlLmtleSwgZGF0YTogbm9kZS5kYXRhIH07XG4gICAgdGhpcy5yZW1vdmUobm9kZS5rZXkpO1xuICB9XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBGaW5kIG5vZGUgYnkga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIGZpbmQgKGtleSkge1xuICB2YXIgcm9vdCA9IHRoaXMuX3Jvb3Q7XG4gIGlmIChyb290ID09PSBudWxsKSAgeyByZXR1cm4gbnVsbDsgfVxuICBpZiAoa2V5ID09PSByb290LmtleSkgeyByZXR1cm4gcm9vdDsgfVxuXG4gIHZhciBzdWJ0cmVlID0gcm9vdCwgY21wO1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHdoaWxlIChzdWJ0cmVlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIHN1YnRyZWUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBzdWJ0cmVlOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBzdWJ0cmVlID0gc3VidHJlZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBzdWJ0cmVlID0gc3VidHJlZS5yaWdodDsgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5cbi8qKlxuICogSW5zZXJ0IGEgbm9kZSBpbnRvIHRoZSB0cmVlXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEBwYXJhbXsqfSBbZGF0YV1cbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0IChrZXksIGRhdGEpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHtcbiAgICB0aGlzLl9yb290ID0ge1xuICAgICAgcGFyZW50OiBudWxsLCBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICAgIGtleToga2V5LCBkYXRhOiBkYXRhXG4gICAgfTtcbiAgICB0aGlzLl9zaXplKys7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gIH1cblxuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gIHZhciBub2RlICA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBwYXJlbnQ9IG51bGw7XG4gIHZhciBjbXAgICA9IDA7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIHBhcmVudCA9IG5vZGU7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgfVxuXG4gIHZhciBuZXdOb2RlID0ge1xuICAgIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsLCBiYWxhbmNlRmFjdG9yOiAwLFxuICAgIHBhcmVudDogcGFyZW50LCBrZXk6IGtleSwgZGF0YTogZGF0YSxcbiAgfTtcbiAgaWYgKGNtcCA8IDApIHsgcGFyZW50LmxlZnQ9IG5ld05vZGU7IH1cbiAgZWxzZSAgICAgICB7IHBhcmVudC5yaWdodCA9IG5ld05vZGU7IH1cblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKGNvbXBhcmUocGFyZW50LmtleSwga2V5KSA8IDApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vbGV0IG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBsZXQgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIHZhciBuZXdSb290JDEgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdCQxOyB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIHRoaXMuX3NpemUrKztcbiAgcmV0dXJuIG5ld05vZGU7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgbm9kZSBmcm9tIHRoZSB0cmVlLiBJZiBub3QgZm91bmQsIHJldHVybnMgbnVsbC5cbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Tm9kZTpOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGtleSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fcm9vdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgdmFyIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyBicmVhazsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgfVxuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgdmFyIHJldHVyblZhbHVlID0gbm9kZS5rZXk7XG5cbiAgaWYgKG5vZGUubGVmdCkge1xuICAgIHZhciBtYXggPSBub2RlLmxlZnQ7XG5cbiAgICB3aGlsZSAobWF4LmxlZnQgfHwgbWF4LnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWF4LnJpZ2h0KSB7IG1heCA9IG1heC5yaWdodDsgfVxuXG4gICAgICBub2RlLmtleSA9IG1heC5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtYXguZGF0YTtcbiAgICAgIGlmIChtYXgubGVmdCkge1xuICAgICAgICBub2RlID0gbWF4O1xuICAgICAgICBtYXggPSBtYXgubGVmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWF4LmtleTtcbiAgICBub2RlLmRhdGEgPSBtYXguZGF0YTtcbiAgICBub2RlID0gbWF4O1xuICB9XG5cbiAgaWYgKG5vZGUucmlnaHQpIHtcbiAgICB2YXIgbWluID0gbm9kZS5yaWdodDtcblxuICAgIHdoaWxlIChtaW4ubGVmdCB8fCBtaW4ucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtaW4ubGVmdCkgeyBtaW4gPSBtaW4ubGVmdDsgfVxuXG4gICAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgICAgaWYgKG1pbi5yaWdodCkge1xuICAgICAgICBub2RlID0gbWluO1xuICAgICAgICBtaW4gPSBtaW4ucmlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgbm9kZSA9IG1pbjtcbiAgfVxuXG4gIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgdmFyIHBwICAgPSBub2RlO1xuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50LmxlZnQgPT09IHBwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciArPSAxOyB9XG5cbiAgICBpZiAgICAgIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvL2xldCBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290O1xuICAgIH0gZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPiAxKSB7XG4gICAgICAvLyBsZXQgbmV3Um9vdCA9IGxlZnRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHsgcm90YXRlTGVmdChwYXJlbnQubGVmdCk7IH1cbiAgICAgIHZhciBuZXdSb290JDEgPSByb3RhdGVSaWdodChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdCQxOyB9XG4gICAgICBwYXJlbnQgPSBuZXdSb290JDE7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAtMSB8fCBwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyBicmVhazsgfVxuXG4gICAgcHAgICA9IHBhcmVudDtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgaWYgKG5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHsgbm9kZS5wYXJlbnQubGVmdD0gbnVsbDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgeyBub2RlLnBhcmVudC5yaWdodCA9IG51bGw7IH1cbiAgfVxuXG4gIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7IHRoaXMuX3Jvb3QgPSBudWxsOyB9XG5cbiAgdGhpcy5fc2l6ZS0tO1xuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB0cmVlIGlzIGJhbGFuY2VkXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5pc0JhbGFuY2VkID0gZnVuY3Rpb24gaXNCYWxhbmNlZCQxICgpIHtcbiAgcmV0dXJuIGlzQmFsYW5jZWQodGhpcy5fcm9vdCk7XG59O1xuXG5cbi8qKlxuICogU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmVlIC0gcHJpbWl0aXZlIGhvcml6b250YWwgcHJpbnQtb3V0XG4gKiBAcGFyYW17RnVuY3Rpb24oTm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5UcmVlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nIChwcmludE5vZGUpIHtcbiAgcmV0dXJuIHByaW50KHRoaXMuX3Jvb3QsIHByaW50Tm9kZSk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyggVHJlZS5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xuXG5yZXR1cm4gVHJlZTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF2bC5qcy5tYXBcbiIsInZhciBFUFMgPSAxRS05O1xyXG52YXIgRVBTMiA9IDAuMDQ7XHJcbi8qKlxyXG4gKiBAcGFyYW0gYSB2ZWN0b3JcclxuICogQHBhcmFtIGIgdmVjdG9yXHJcbiAqIEBwYXJhbSBjIHZlY3RvclxyXG4gKi9cclxuZnVuY3Rpb24gb25TZWdtZW50KGEsIGIsIGMpIHtcclxuICAgIHZhciB4MSA9IGFbMF0sXHJcbiAgICAgICAgeDIgPSBiWzBdLFxyXG4gICAgICAgIHgzID0gY1swXSxcclxuICAgICAgICB5MSA9IGFbMV0sXHJcbiAgICAgICAgeTIgPSBiWzFdLFxyXG4gICAgICAgIHkzID0gY1sxXTtcclxuXHJcbiAgICByZXR1cm4gKE1hdGgubWluKHgxLCB4MikgPD0geDMpICYmICh4MyA8PSBNYXRoLm1heCh4MSwgeDIpKSAmJlxyXG4gICAgICAgICAgIChNYXRoLm1pbih5MSwgeTIpIDw9IHkzKSAmJiAoeTMgPD0gTWF0aC5tYXgoeTEsIHkyKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBhYyB4IGJjXHJcbiAqIEBwYXJhbSBhIHZlY3RvclxyXG4gKiBAcGFyYW0gYiB2ZWN0b3JcclxuICogQHBhcmFtIGMgdmVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBkaXJlY3Rpb24oYSwgYiwgYykge1xyXG4gICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgeDMgPSBjWzBdLFxyXG4gICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICB5MiA9IGJbMV0sXHJcbiAgICAgICAgeTMgPSBjWzFdO1xyXG5cclxuICAgIHJldHVybiAoeDMgLSB4MSkgKiAoeTIgLSB5MSkgLSAoeDIgLSB4MSkgKiAoeTMgLSB5MSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gYSBzZWdtZW50MVxyXG4gKiBAcGFyYW0gYiBzZWdtZW50MlxyXG4gKi9cclxuZnVuY3Rpb24gc2VnbWVudHNJbnRlcnNlY3QoYSwgYikge1xyXG4gICAgdmFyIHAxID0gYVswXSxcclxuICAgICAgICBwMiA9IGFbMV0sXHJcbiAgICAgICAgcDMgPSBiWzBdLFxyXG4gICAgICAgIHA0ID0gYlsxXSxcclxuICAgICAgICBkMSA9IGRpcmVjdGlvbihwMywgcDQsIHAxKSxcclxuICAgICAgICBkMiA9IGRpcmVjdGlvbihwMywgcDQsIHAyKSxcclxuICAgICAgICBkMyA9IGRpcmVjdGlvbihwMSwgcDIsIHAzKSxcclxuICAgICAgICBkNCA9IGRpcmVjdGlvbihwMSwgcDIsIHA0KTtcclxuXHJcbiAgICBpZiAoKChkMSA+IDAgJiYgZDIgPCAwKSB8fCAoZDEgPCAwICYmIGQyID4gMCkpICYmICgoZDMgPiAwICYmIGQ0IDwgMCkgfHwgKGQzIDwgMCAmJiBkNCA+IDApKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkMSA9PT0gMCAmJiBvblNlZ21lbnQocDMsIHA0LCBwMSkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoZDIgPT09IDAgJiYgb25TZWdtZW50KHAzLCBwNCwgcDIpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQzID09PSAwICYmIG9uU2VnbWVudChwMSwgcDIsIHAzKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkNCA9PT0gMCAmJiBvblNlZ21lbnQocDEsIHAyLCBwNCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uIChhLCBiKSB7XHJcbiAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgIHk0ID0gYlsxXVsxXTtcclxuICAgIHZhciB4ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICB2YXIgeSA9ICgoeDEgKiB5MiAtIHkxICogeDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzICogeTQgLSB5MyAqIHg0KSkgL1xyXG4gICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgaWYgKGlzTmFOKHgpfHxpc05hTih5KSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHgxID49IHgyKSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih4MiwgeCwgeDEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeDEsIHgsIHgyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh5MSA+PSB5Mikge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeTIsIHksIHkxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHkxLCB5LCB5MikpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoeDMgPj0geDQpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih4MywgeCwgeDQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHkzID49IHk0KSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5NCwgeSwgeTMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeTMsIHksIHk0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFt4LCB5XTtcclxufVxyXG5cclxuZnVuY3Rpb24gYmV0d2VlbiAoYSwgYiwgYykge1xyXG4gICAgcmV0dXJuIGEtRVBTIDw9IGIgJiYgYiA8PSBjK0VQUztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNvbXBhcmVTZWdtZW50cyhhLCBiKSB7XHJcbiAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICB2YXIgY3VycmVudFgsICAgLy8g0YLQtdC60YPRidC40LkgeCDRgdCy0LjQv9C70LDQudC90LBcclxuICAgICAgICBheSwgICAgICAgICAvLyB5INGC0L7Rh9C60Lgg0L/QtdGA0LXRgdC10YfQtdC90LjRjyDQvtGC0YDQtdC30LrQsCDRgdC+0LHRi9GC0LjRjyBhINGB0L4g0YHQstC40L/Qu9Cw0LnQvdC+0LxcclxuICAgICAgICBieSwgICAgICAgICAvLyB5INGC0L7Rh9C60Lgg0L/QtdGA0LXRgdC10YfQtdC90LjRjyDQvtGC0YDQtdC30LrQsCDRgdC+0LHRi9GC0LjRjyBiINGB0L4g0YHQstC40L/Qu9Cw0LnQvdC+0LxcclxuICAgICAgICBkZWx0YVksICAgICAvLyDRgNCw0LfQvdC40YbQsCB5INGC0L7Rh9C10Log0L/QtdGA0LXRgdC10YfQtdC90LjRj1xyXG4gICAgICAgIGRlbHRhWDEsICAgIC8vINGA0LDQt9C90LjRhtCwIHgg0L3QsNGH0LDQuyDQvtGC0YDQtdC30LrQvtCyXHJcbiAgICAgICAgZGVsdGFYMjsgICAgLy8g0YDQsNC30L3QuNGG0LAgeCDQutC+0L3RhtC+0LIg0L7RgtGA0LXQt9C60L7QslxyXG5cclxuICAgIGlmIChhID09PSBiKSB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgY3VycmVudFggPSB0aGlzLng7XHJcbiAgICBheSA9IGdldFkoYSwgY3VycmVudFgpO1xyXG4gICAgYnkgPSBnZXRZKGIsIGN1cnJlbnRYKTtcclxuICAgIGRlbHRhWSA9IGF5IC0gYnk7XHJcblxyXG4gICAgLy8g0YHRgNCw0LLQvdC10L3QuNC1INC90LDQtNC+INC/0YDQvtCy0L7QtNC40YLRjCDRgSDRjdC/0YHQuNC70L7QvdC+0LwsXHJcbiAgICAvLyDQuNC90LDRh9C1INCy0L7Qt9C80L7QttC90Ysg0L7RiNC40LHQutC4INC+0LrRgNGD0LPQu9C10L3QuNGPXHJcbiAgICBpZiAoTWF0aC5hYnMoZGVsdGFZKSA+IEVQUykge1xyXG4gICAgICAgIHJldHVybiBkZWx0YVkgPCAwID8gLTEgOiAxO1xyXG4gICAgLy8g0LXRgdC70LggeSDQvtCx0LXQuNGFINGB0L7QsdGL0YLQuNC5INGA0LDQstC90YtcclxuICAgIC8vINC/0YDQvtCy0LXRgNGP0LXQvCDRg9Cz0L7QuyDQv9GA0Y/QvNGL0YVcclxuICAgIC8vINGH0LXQvCDQutGA0YPRh9C1INC/0YDRj9C80LDRjywg0YLQtdC8INC90LjQttC1INC10LUg0LvQtdCy0YvQuSDQutC+0L3QtdGGLCDQt9C90LDRh9C40YIg0YHQvtCx0YvRgtC40LUg0YDQsNGB0L/QvtC70LDQs9Cw0LXQvCDQvdC40LbQtVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgYVNsb3BlID0gZ2V0U2xvcGUoYSksXHJcbiAgICAgICAgICAgIGJTbG9wZSA9IGdldFNsb3BlKGIpO1xyXG5cclxuICAgICAgICBpZiAoYVNsb3BlICE9PSBiU2xvcGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICdiZWZvcmUnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYVNsb3BlID4gYlNsb3BlID8gLTEgOiAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFTbG9wZSA+IGJTbG9wZSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vINC/0L7RgdC70LUg0YHRgNCw0LLQvdC10L3QuNGPINC/0L4geSDQv9C10YDQtdGB0LXRh9C10L3QuNGPINGB0L4g0YHQstC40L/Qu9Cw0LnQvdC+0LxcclxuICAgIC8vINC4INGB0YDQsNCy0L3QtdC90LjRjyDRg9C60LvQvtC90L7QslxyXG4gICAgLy8g0L7RgdGC0LDQtdGC0YHRjyDRgdC70YPRh9Cw0LksINC60L7Qs9C00LAg0YPQutC70L7QvdGLINGA0LDQstC90YtcclxuICAgIC8vIChpZiBhU2xvcGUgPT09IGJTbG9wZSlcclxuICAgIC8vINC4IDIg0L7RgtGA0LXQt9C60LAg0LvQtdC20LDRgiDQvdCwINC+0LTQvdC+0Lkg0L/RgNGP0LzQvtC5XHJcbiAgICAvLyDQsiDRgtCw0LrQvtC8INGB0LvRg9GH0LDQtVxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LjQvCDQv9C+0LvQvtC20LXQvdC40LUg0LrQvtC90YbQvtCyINC+0YLRgNC10LfQutC+0LJcclxuICAgIGRlbHRhWDEgPSB4MSAtIHgzO1xyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC40Lwg0LLQt9Cw0LjQvNC90L7QtSDQv9C+0LvQvtC20LXQvdC40LUg0LvQtdCy0YvRhSDQutC+0L3RhtC+0LJcclxuICAgIGlmIChkZWx0YVgxICE9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhWDEgPCAwID8gLTEgOiAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC40Lwg0LLQt9Cw0LjQvNC90L7QtSDQv9C+0LvQvtC20LXQvdC40LUg0L/RgNCw0LLRi9GFINC60L7QvdGG0L7QslxyXG4gICAgZGVsdGFYMiA9IHgyIC0geDQ7XHJcblxyXG4gICAgaWYgKGRlbHRhWDIgIT09IDApIHtcclxuICAgICAgICByZXR1cm4gZGVsdGFYMiA8IDAgPyAtMSA6IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7RgtGA0LXQt9C60Lgg0YHQvtCy0L/QsNC00LDRjtGCXHJcbiAgICByZXR1cm4gMDtcclxuXHJcbn07XHJcblxyXG5mdW5jdGlvbiBjb21wYXJlUG9pbnRzKGEsIGIpIHtcclxuICAgIHZhciBhSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoYSksXHJcbiAgICAgICAgYklzQXJyYXkgPSBBcnJheS5pc0FycmF5KGIpLFxyXG4gICAgICAgIHgxID0gYUlzQXJyYXkgPyBhWzBdIDogYS54LFxyXG4gICAgICAgIHkxID0gYUlzQXJyYXkgPyBhWzFdIDogYS55LFxyXG4gICAgICAgIHgyID0gYklzQXJyYXkgPyBiWzBdIDogYi54LFxyXG4gICAgICAgIHkyID0gYklzQXJyYXkgPyBiWzFdIDogYi55O1xyXG5cclxuICAgIGlmICh4MSA+IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPiB5MikpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH0gZWxzZSBpZiAoeDEgPCB4MiB8fCAoeDEgPT09IHgyICYmIHkxIDwgeTIpKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSBlbHNlIGlmIChNYXRoLmFicyh4MSAtIHgyKSA8IEVQUzIgJiYgTWF0aC5hYnMoeTEgLSB5MikgPCBFUFMyICkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTbG9wZShzZWdtZW50KSB7XHJcbiAgICB2YXIgeDEgPSBzZWdtZW50WzBdWzBdLFxyXG4gICAgICAgIHkxID0gc2VnbWVudFswXVsxXSxcclxuICAgICAgICB4MiA9IHNlZ21lbnRbMV1bMF0sXHJcbiAgICAgICAgeTIgPSBzZWdtZW50WzFdWzFdO1xyXG5cclxuICAgIGlmICh4MSA9PT0geDIpIHtcclxuICAgICAgICByZXR1cm4gKHkxIDwgeTIpID8gSW5maW5pdHkgOiAtIEluZmluaXR5O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKHkyIC0geTEpIC8gKHgyIC0geDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0WShzZWdtZW50LCB4KSB7XHJcbiAgICB2YXIgYmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgIGVuZCA9IHNlZ21lbnRbMV0sXHJcbiAgICAgICAgc3BhbiA9IHNlZ21lbnRbMV1bMF0gLSBzZWdtZW50WzBdWzBdLFxyXG4gICAgICAgIGRlbHRhWDAsIC8vINGA0LDQt9C90LjRhtCwINC80LXQttC00YMgeCDQuCB4INC90LDRh9Cw0LvQsCDQvtGC0YDQtdC30LrQsFxyXG4gICAgICAgIGRlbHRhWDEsIC8vINGA0LDQt9C90LjRhtCwINC80LXQttC00YMgeCDQutC+0L3RhtCwINC+0YLRgNC10LfQutCwINC4IHhcclxuICAgICAgICBpZmFjLCAgICAvLyDQv9GA0L7Qv9C+0YDRhtC40Y8gZGVsdGFYMCDQuiDQv9GA0L7QtdC60YbQuNC4XHJcbiAgICAgICAgZmFjOyAgICAgLy8g0L/RgNC+0L/QvtGA0YbQuNGPIGRlbHRhWDEg0Log0L/RgNC+0LXQutGG0LjQuFxyXG5cclxuICAgIC8vINCyINGB0LvRg9GH0LDQtSwg0LXRgdC70LggeCDQvdC1INC/0LXRgNC10YHQtdC60LDQtdGC0YHRjyDRgSDQv9GA0L7QtdC60YbQuNC10Lkg0L7RgtGA0LXQt9C60LAg0L3QsCDQvtGB0YwgeCxcclxuICAgIC8vINCy0L7Qt9Cy0YDRidCw0LXRgiB5INC90LDRh9Cw0LvQsCDQuNC70Lgg0LrQvtC90YbQsCDQvtGC0YDQtdC30LrQsFxyXG4gICAgaWYgKHggPD0gYmVnaW5bMF0pIHtcclxuICAgICAgICByZXR1cm4gYmVnaW5bMV07XHJcbiAgICB9IGVsc2UgaWYgKHggPj0gZW5kWzBdKSB7XHJcbiAgICAgICAgcmV0dXJuIGVuZFsxXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQtdGB0LvQuCB4INC70LXQttC40YIg0LLQvdGD0YLRgNC4INC/0YDQvtC10LrRhtC40Lgg0L7RgtGA0LXQt9C60LAg0L3QsCDQvtGB0YwgeFxyXG4gICAgLy8g0LLRi9GH0LjRgdC70Y/QtdGCINC/0YDQvtC/0L7RgNGG0LjQuFxyXG4gICAgZGVsdGFYMCA9IHggLSBiZWdpblswXTtcclxuICAgIGRlbHRhWDEgPSBlbmRbMF0gLSB4O1xyXG5cclxuICAgIGlmIChkZWx0YVgwID4gZGVsdGFYMSkge1xyXG4gICAgICAgIGlmYWMgPSBkZWx0YVgwIC8gc3BhblxyXG4gICAgICAgIGZhYyA9IDEgLSBpZmFjO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmYWMgPSBkZWx0YVgxIC8gc3BhblxyXG4gICAgICAgIGlmYWMgPSAxIC0gZmFjO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoYmVnaW5bMV0gKiBmYWMpICsgKGVuZFsxXSAqIGlmYWMpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBFUFM6IEVQUyxcclxuICAgIG9uU2VnbWVudDogb25TZWdtZW50LFxyXG4gICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICBzZWdtZW50c0ludGVyc2VjdDogc2VnbWVudHNJbnRlcnNlY3QsXHJcbiAgICBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb246IGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbixcclxuICAgIGNvbXBhcmVTZWdtZW50czogY29tcGFyZVNlZ21lbnRzLFxyXG4gICAgY29tcGFyZVBvaW50czogY29tcGFyZVBvaW50c1xyXG59XHJcbiIsInZhciBQb2ludCA9IGZ1bmN0aW9uIChjb29yZHMsIHR5cGUpIHtcclxuICAgIHRoaXMueCA9IGNvb3Jkc1swXTtcclxuICAgIHRoaXMueSA9IGNvb3Jkc1sxXTtcclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLnNlZ21lbnRzID0gW107XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XHJcbiIsImZ1bmN0aW9uIFN3ZWVwbGluZShwb3NpdGlvbikge1xyXG4gICAgdGhpcy54ID0gbnVsbDtcclxuICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxufVxyXG5cclxuU3dlZXBsaW5lLnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG59XHJcblN3ZWVwbGluZS5wcm90b3R5cGUuc2V0WCA9IGZ1bmN0aW9uICh4KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN3ZWVwbGluZTtcclxuIiwiLy8gMSkgRVBTLXJvdW5kIGludGVyc2VjdGlvbnNcclxuLy8gMikgaGFuZGxlIGVuZHNcclxudmFyIFRyZWUgPSByZXF1aXJlKCdhdmwnKSxcclxuICAgIFN3ZWVwbGluZSA9IHJlcXVpcmUoJy4vc2wnKSxcclxuICAgIFBvaW50ID0gcmVxdWlyZSgnLi9wb2ludCcpLFxyXG4gICAgdXRpbHMgPSByZXF1aXJlKCcuL2dlb21ldHJ5L2dlb21ldHJ5Jyk7XHJcblxyXG4vKipcclxuKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50cyBzZXQgb2Ygc2VnbWVudHMgaW50ZXJzZWN0aW5nIHN3ZWVwbGluZSBbW1t4MSwgeTFdLCBbeDIsIHkyXV0gLi4uIFtbeG0sIHltXSwgW3huLCB5bl1dXVxyXG4qL1xyXG5mdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9ucyhzZWdtZW50cywgbWFwKSB7XHJcbiAgICB2YXIgc3dlZXBsaW5lID0gbmV3IFN3ZWVwbGluZSgnYmVmb3JlJyksXHJcbiAgICAgICAgcXVldWUgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlUG9pbnRzLCB0cnVlKSxcclxuICAgICAgICBzdGF0dXMgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlU2VnbWVudHMuYmluZChzd2VlcGxpbmUpKSxcclxuICAgICAgICBvdXRwdXQgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlUG9pbnRzLCB0cnVlKTtcclxuXHJcbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50LCBpLCBhKSB7XHJcbiAgICAgICAgc2VnbWVudC5zb3J0KHV0aWxzLmNvbXBhcmVQb2ludHMpO1xyXG4gICAgICAgIHZhciBiZWdpbiA9IG5ldyBQb2ludChzZWdtZW50WzBdLCAnYmVnaW4nKSxcclxuICAgICAgICAgICAgZW5kID0gbmV3IFBvaW50KHNlZ21lbnRbMV0sICdlbmQnKTtcclxuXHJcbiAgICAgICAgaWYgKCFxdWV1ZS5jb250YWlucyhiZWdpbikpIHtcclxuICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGJlZ2luLCBiZWdpbik7XHJcbiAgICAgICAgICAgIGJlZ2luLnNlZ21lbnRzLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYmVnaW4gPSBxdWV1ZS5maW5kKGJlZ2luKS5rZXk7XHJcbiAgICAgICAgICAgIGJlZ2luLnNlZ21lbnRzLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXF1ZXVlLmNvbnRhaW5zKGVuZCkpIHtcclxuICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGVuZCwgZW5kKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnNvbGUubG9nKHF1ZXVlLmtleXMoKSk7XHJcbiAgICBjb25zb2xlLmxvZyhxdWV1ZS5rZXlzKCkubGVuZ3RoKTtcclxuICAgIHdoaWxlICghcXVldWUuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgdmFyIHBvaW50ID0gcXVldWUucG9wKCk7XHJcbiAgICAgICAgaGFuZGxlRXZlbnRQb2ludChwb2ludC5rZXksIHN0YXR1cywgb3V0cHV0LCBxdWV1ZSwgc3dlZXBsaW5lLCBtYXApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHdpbmRvdy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAvLyB3aW5kb3cucXVldWUgPSBxdWV1ZTtcclxuICAgIHJldHVybiBvdXRwdXQua2V5cygpLm1hcChmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIHJldHVybiBba2V5LngsIGtleS55XTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFdmVudFBvaW50KHBvaW50LCBzdGF0dXMsIG91dHB1dCwgcXVldWUsIHN3ZWVwbGluZSwgbWFwKSB7XHJcbiAgICAvLyBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhbcG9pbnQueSwgcG9pbnQueF0pLCB7cmFkaXVzOiA1LCBjb2xvcjogJ2JsdWUnLCBmaWxsQ29sb3I6ICdibHVlJ30pLmFkZFRvKG1hcCk7XHJcbiAgICBzd2VlcGxpbmUuc2V0UG9zaXRpb24oJ2JlZm9yZScpO1xyXG4gICAgc3dlZXBsaW5lLnNldFgocG9pbnQueCk7XHJcbiAgICAvLyBzdGVwIDFcclxuICAgIHZhciBVcCA9IHBvaW50LnNlZ21lbnRzLCAvLyBzZWdtZW50cywgZm9yIHdoaWNoIHRoaXMgaXMgdGhlIGxlZnQgZW5kXHJcbiAgICAgICAgTHAgPSBbXSwgICAgICAgICAgICAgLy8gc2VnbWVudHMsIGZvciB3aGljaCB0aGlzIGlzIHRoZSByaWdodCBlbmRcclxuICAgICAgICBDcCA9IFtdOyAgICAgICAgICAgICAvLyAvLyBzZWdtZW50cywgZm9yIHdoaWNoIHRoaXMgaXMgYW4gaW5uZXIgcG9pbnRcclxuXHJcbiAgICAvLyBzdGVwIDJcclxuICAgIHN0YXR1cy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUsIGkpIHtcclxuICAgICAgICB2YXIgc2VnbWVudCA9IG5vZGUua2V5LFxyXG4gICAgICAgICAgICBzZWdtZW50QmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgICAgICBzZWdtZW50RW5kID0gc2VnbWVudFsxXTtcclxuXHJcbiAgICAgICAgLy8gY291bnQgcmlnaHQtZW5kc1xyXG4gICAgICAgIGlmIChwb2ludC54ID09PSBzZWdtZW50RW5kWzBdICYmIHBvaW50LnkgPT09IHNlZ21lbnRFbmRbMV0pIHtcclxuICAgICAgICAgICAgTHAucHVzaChzZWdtZW50KTtcclxuICAgICAgICAvLyBjb3VudCBpbm5lciBwb2ludHNcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBmaWx0ZXIgbGVmdCBlbmRzXHJcbiAgICAgICAgICAgIGlmICghKHBvaW50LnggPT09IHNlZ21lbnRCZWdpblswXSAmJiBwb2ludC55ID09PSBzZWdtZW50QmVnaW5bMV0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModXRpbHMuZGlyZWN0aW9uKHNlZ21lbnRCZWdpbiwgc2VnbWVudEVuZCwgW3BvaW50LngsIHBvaW50LnldKSkgPCB1dGlscy5FUFMgJiYgdXRpbHMub25TZWdtZW50KHNlZ21lbnRCZWdpbiwgc2VnbWVudEVuZCwgW3BvaW50LngsIHBvaW50LnldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIENwLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIHN0ZXAgM1xyXG4gICAgLy8gaGFuZGxlIGV2ZXJ5IGludGVyc2VjdGlvblxyXG4gICAgLy8gdGhlcmUgaXMgYWx3YXlzIG9uZSBvZiBjYXNlczogVXAubGVuZ3RoIHx8IENwLmxlbmd0aCB8fCBMcC5sZW5ndGhcclxuICAgIC8vIHBvaW50IGluIGFsd2F5cyB0aGUgbGVmdCB8fCB0aGUgcmlnaHQgfHwgb24tc2VnbWVudFxyXG4gICAgaWYgKFtdLmNvbmNhdChVcCwgTHAsIENwKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgaWYgKCFvdXRwdXQuY29udGFpbnMocG9pbnQpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvdXRwdXQuaW5zZXJ0Jyk7XHJcbiAgICAgICAgICAgIG91dHB1dC5pbnNlcnQocG9pbnQsIHBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHN0ZXAgNVxyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBDcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHN0YXR1cy5yZW1vdmUoQ3Bbal0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN3ZWVwbGluZS5zZXRQb3NpdGlvbignYWZ0ZXInKTtcclxuXHJcbiAgICAvLyBzdGVwIDYgSW5zZXJ0IGludGVyc2VjdGluZyxcclxuICAgIC8vIChzdGVwIDcpIGhlcmUgaXMgdGhlIHNlZ21lbnRzIG9yZGVyIGNoYW5naW5nXHJcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IFVwLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgc3RhdHVzLmluc2VydChVcFtrXSk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBsID0gMDsgbCA8IENwLmxlbmd0aDsgbCsrKSB7XHJcbiAgICAgICAgc3RhdHVzLmluc2VydChDcFtsXSk7XHJcbiAgICB9XHJcbiAgICAvLyBoYW5kbGUgcmlnaHQgZW5kLXBvaW50IGNhc2VcclxuICAgIGlmIChVcC5sZW5ndGggPT09IDAgJiYgQ3AubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBMcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcyA9IExwW2ldLFxyXG4gICAgICAgICAgICAgICAgc05vZGUgPSBzdGF0dXMuZmluZChzKSxcclxuICAgICAgICAgICAgICAgIHNsID0gc3RhdHVzLnByZXYoc05vZGUpLFxyXG4gICAgICAgICAgICAgICAgc3IgPSBzdGF0dXMubmV4dChzTm9kZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2wgJiYgc3IpIHtcclxuICAgICAgICAgICAgICAgIGZpbmROZXdFdmVudChzbC5rZXksIHNyLmtleSwgcG9pbnQsIG91dHB1dCwgcXVldWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzdGF0dXMucmVtb3ZlKHMpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIFVDcCA9IFtdLmNvbmNhdChVcCwgQ3ApLnNvcnQodXRpbHMuY29tcGFyZVNlZ21lbnRzKSxcclxuICAgICAgICAgICAgVUNwbWluID0gVUNwWzBdLFxyXG4gICAgICAgICAgICBzbGxOb2RlID0gc3RhdHVzLmZpbmQoVUNwbWluKSxcclxuICAgICAgICAgICAgVUNwbWF4ID0gVUNwW1VDcC5sZW5ndGgtMV0sXHJcbiAgICAgICAgICAgIHNyck5vZGUgPSBzdGF0dXMuZmluZChVQ3BtYXgpLFxyXG4gICAgICAgICAgICBzbGwgPSBzbGxOb2RlICYmIHN0YXR1cy5wcmV2KHNsbE5vZGUpLFxyXG4gICAgICAgICAgICBzcnIgPSBzcnJOb2RlICYmIHN0YXR1cy5uZXh0KHNyck5vZGUpO1xyXG5cclxuICAgICAgICBpZiAoc2xsICYmIFVDcG1pbikge1xyXG4gICAgICAgICAgICBmaW5kTmV3RXZlbnQoc2xsLmtleSwgVUNwbWluLCBwb2ludCwgb3V0cHV0LCBxdWV1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3JyICYmIFVDcG1heCkge1xyXG4gICAgICAgICAgICBmaW5kTmV3RXZlbnQoc3JyLmtleSwgVUNwbWF4LCBwb2ludCwgb3V0cHV0LCBxdWV1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IExwLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIHN0YXR1cy5yZW1vdmUoTHBbal0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmROZXdFdmVudChzbCwgc3IsIHBvaW50LCBvdXRwdXQsIHF1ZXVlKSB7XHJcbiAgICB2YXIgaW50ZXJzZWN0aW9uQ29vcmRzID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNsLCBzciksXHJcbiAgICAgICAgaW50ZXJzZWN0aW9uUG9pbnQ7XHJcblxyXG4gICAgaWYgKGludGVyc2VjdGlvbkNvb3Jkcykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwb2ludCcpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBvaW50KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnaW50ZXJzZWN0aW9uQ29vcmRzJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coaW50ZXJzZWN0aW9uQ29vcmRzKTtcclxuICAgICAgICBpbnRlcnNlY3Rpb25Qb2ludCA9IG5ldyBQb2ludChpbnRlcnNlY3Rpb25Db29yZHMsICdpbnRlcnNlY3Rpb24nKTtcclxuXHJcbiAgICAgICAgcXVldWUuaW5zZXJ0KGludGVyc2VjdGlvblBvaW50LCBpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgb3V0cHV0Lmluc2VydChpbnRlcnNlY3Rpb25Qb2ludCwgaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XHJcbiJdfQ==
