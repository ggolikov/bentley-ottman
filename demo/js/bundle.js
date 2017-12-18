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
    } else if (Math.abs(x1 - x2) < EPS && Math.abs(y1 - y2) < EPS) {
        console.log('x1');
        console.log(Math.abs(x1));
        console.log('x2');
        console.log(Math.abs(x2));
        // console.log(Math.abs(y1 - y2));
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

        // if (!queue.contains(end)) {
        queue.insert(end, end);
        // }
    });
    console.log(queue.keys());
    console.log(queue.keys().length);
    while (!queue.isEmpty()) {
        var point = queue.pop();
        console.log('STEP');

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
        console.log('output.insert from first');
        // console.log(point);
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
        // console.log('point');
        // console.log(point);
        // console.log('intersectionCoords');
        // console.log(intersectionCoords);
        intersectionPoint = new Point(intersectionCoords, 'intersection');
        console.log('output.insert from second');

        queue.insert(intersectionPoint, intersectionPoint);
        output.insert(intersectionPoint, intersectionPoint);
    }
}
module.exports = findIntersections;

},{"./geometry/geometry":5,"./point":6,"./sl":7,"avl":4}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXGdlb21ldHJ5XFxnZW9tZXRyeS5qcyIsInNyY1xccG9pbnQuanMiLCJzcmNcXHNsLmpzIiwic3JjXFxzd2VlcGxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixDQUNiLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FEYSxFQUViLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FGYSxFQUliLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FKYSxFQUtiLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FMYSxFQU1iLENBQUMsQ0FBQyxPQUFELEVBQVMsT0FBVCxDQUFELEVBQW1CLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FBbkIsQ0FOYSxDQUFqQjtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQSxJQUFJLG9CQUFvQixRQUFRLGFBQVIsQ0FBeEI7QUFDQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksTUFBTSxFQUFFLFNBQUYsQ0FBWSxpRUFBWixFQUErRTtBQUNqRixhQUFTLEVBRHdFO0FBRWpGLGlCQUFhO0FBRm9FLENBQS9FLENBQVY7QUFBQSxJQUlJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFULENB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMW5CQSxJQUFJLE1BQU0sSUFBVjtBQUNBOzs7OztBQUtBLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QjtBQUN4QixRQUFJLEtBQUssRUFBRSxDQUFGLENBQVQ7QUFBQSxRQUNJLEtBQUssRUFBRSxDQUFGLENBRFQ7QUFBQSxRQUVJLEtBQUssRUFBRSxDQUFGLENBRlQ7QUFBQSxRQUdJLEtB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LElBQUksR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsS0FBOUIsRUFBcUMsTUFBckMsRUFBNkMsS0FBN0M7QUFDSDs7QUFFRCxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksR0FBRyxNQUF2QixFQUErQixHQUEvQixFQUFvQztBQUNoQyxtQkFBTyxNQUFQLENBQWMsR0FBRyxDQUFILENBQWQ7QUFDSDtBQUNKO0FBQ0QsV0FBTyxNQUFQO0FBQ0g7O0FBRUQsU0FBUyxZQUFULENBQXNCLEVBQXRCLEVBQTBCLEVBQTFCLEVBQThCLEtBQTlCLEVBQXFDLE1BQXJDLEVBQTZDLEtBQTdDLEVBQW9EO0FBQ2hELFFBQUkscUJBQXFCLE1BQU0sd0JBQU4sQ0FBK0IsRUFBL0IsRUFBbUMsRUFBbkMsQ0FBekI7QUFBQSxRQUNJLGlCQURKOztBQUdBLFFBQUksa0JBQUosRUFBd0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsSUFBSSxLQUFKLENBQVUsa0JBQVYsRUFBOEIsY0FBOUIsQ0FBcEI7QUFDQSxnQkFBUSxHQUFSLENBQVksMkJBQVo7O0FBRUEsY0FBTSxNQUFOLENBQWEsaUJBQWIsRUFBZ0MsaUJBQWhDO0FBQ0EsZUFBTyxNQUFQLENBQWMsaUJBQWQsRUFBaUMsaUJBQWpDO0FBQ0g7QUFDSjtBQUNELE9BQU8sT0FBUCxHQUFpQixpQkFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gcmVndWxhciBncmlkXHJcbm1vZHVsZS5leHBvcnRzID0gW1xyXG4gICAgW1szNy41NzY1LDU1Ljc3ODJdLFszNy41NzY1LDU1LjY3ODJdXSxcclxuICAgIFtbMzcuNTg2NSw1NS43NzgyXSxbMzcuNTg2NSw1NS42NzgyXV0sXHJcblxyXG4gICAgW1szNy41NzY1LDU1Ljc3ODJdLFszNy41ODY1LDU1Ljc3ODJdXSxcclxuICAgIFtbMzcuNTc2NSw1NS43MjgyXSxbMzcuNTg2NSw1NS43MjgyXV0sXHJcbiAgICBbWzM3LjU3NjUsNTUuNjc4Ml0sWzM3LjU4NjUsNTUuNjc4Ml1dLFxyXG5dO1xyXG4vLyBlbmQgZXJyb3JcclxuLy8gbW9kdWxlLmV4cG9ydHMgPSBbXHJcbi8vICAgICBbWzM3LjU3NjU4OTA1OTYwODE0Niw1NS43NzgyNzIyOTUzMTQ4MTRdLFszNy41NzU3NDkzNTQyNDI3NSw1NS43MDEwNDMzOTAyMjQ0Ml1dLFxyXG4vLyAgICAgW1szNy41NjI2MDYzODY5NTA1OSw1NS43Mjk0NDA2NTA4MTQ3NF0sWzM3LjYwODg1NzY4NTk4MzgzNSw1NS43Njk1MjQ2ODYyMDU4Ml1dLFxyXG4vLyAgICAgW1szNy42MjA1MjU1MTExNDM1OCw1NS43MTY1ODE1MTU3MjU3NjRdLFszNy43Mzc1ODUyNzA0NzE1MzQsNTUuNjYwNTk5NTE4NDk0NzVdXSxcclxuLy8gICAgIFtbMzcuNTM5NjYyOTY5OTgzNjUsNTUuNzc2MDgxODM3NTA2ODY1XSxbMzcuNzE5NDM0NjE5OTg3OTMsNTUuNzA1Njc2ODU3OTI5ODY2XV0sXHJcbi8vICAgICBbWzM3LjY3ODI2MzE4NjU2NzI1LDU1LjY4MDg4MTQ1NzU5Nzg1Nl0sWzM3LjYzNTQ5MDkzNjYxNzYsNTUuODM4ODQwOTMxNzY5MzA1XV1cclxuLy8gXTtcclxuIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcclxudmFyIGRhdGEgPSByZXF1aXJlKCcuLi9kYXRhL2luZGV4LmpzJyk7XHJcblxyXG52YXIgb3NtID0gTC50aWxlTGF5ZXIoJ2h0dHA6Ly97c30uYmFzZW1hcHMuY2FydG9jZG4uY29tL2xpZ2h0X25vbGFiZWxzL3t6fS97eH0ve3l9LnBuZycsIHtcclxuICAgICAgICBtYXhab29tOiAyMixcclxuICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAub3JnXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPidcclxuICAgIH0pLFxyXG4gICAgcG9pbnQgPSBMLmxhdExuZyhbNTUuNzUzMjEwLCAzNy42MjE3NjZdKSxcclxuICAgIG1hcCA9IG5ldyBMLk1hcCgnbWFwJywge2xheWVyczogW29zbV0sIGNlbnRlcjogcG9pbnQsIHpvb206IDExLCBtYXhab29tOiAyMn0pLFxyXG4gICAgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jyk7XHJcblxyXG53aW5kb3cubWFwID0gbWFwO1xyXG5cclxudmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKSxcclxuICAgIG4gPSBib3VuZHMuX25vcnRoRWFzdC5sYXQsXHJcbiAgICBlID0gYm91bmRzLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgcyA9IGJvdW5kcy5fc291dGhXZXN0LmxhdCxcclxuICAgIHcgPSBib3VuZHMuX3NvdXRoV2VzdC5sbmcsXHJcbiAgICBoZWlnaHQgPSBuIC0gcyxcclxuICAgIHdpZHRoID0gZSAtIHcsXHJcbiAgICBxSGVpZ2h0ID0gaGVpZ2h0IC8gNCxcclxuICAgIHFXaWR0aCA9IHdpZHRoIC8gNCxcclxuICAgIHJhbmRvbSA9IGZhbHNlLFxyXG4gICAgcG9pbnRzQ291bnQgPSAxMCxcclxuICAgIGxpbmVzID0gW107XHJcblxyXG5pZiAocmFuZG9tKSB7XHJcbiAgICBkYXRhID0gW107XHJcbiAgICB2YXIgcG9pbnRzID0gdHVyZi5yYW5kb21Qb2ludChwb2ludHNDb3VudCwge1xyXG4gICAgICAgIGJib3g6IFt3ICsgcVdpZHRoLCBzICsgcUhlaWdodCwgZSAtIHFXaWR0aCwgbiAtIHFIZWlnaHRdXHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgY29vcmRzID0gcG9pbnRzLmZlYXR1cmVzLm1hcChmdW5jdGlvbihmZWF0dXJlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XHJcbiAgICB9KVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgIGRhdGEucHVzaChbY29vcmRzW2ldLCBjb29yZHNbaSsxXV0pO1xyXG4gICAgfVxyXG4gICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG59XHJcblxyXG5cclxuZHJhd0xpbmVzKGRhdGEpO1xyXG4vLyBjb25zb2xlLmxvZyhwb2ludHNDb3VudCAvIDIpO1xyXG5jb25zb2xlLnRpbWUoJ2NvdW50aW5nLi4uJyk7XHJcbnZhciBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGRhdGEsIG1hcCk7XHJcbmNvbnNvbGUudGltZUVuZCgnY291bnRpbmcuLi4nKTtcclxuY29uc29sZS5sb2cocHMpO1xyXG5jb25zb2xlLmxvZyhwcy5sZW5ndGgpO1xyXG5cclxucHMuZm9yRWFjaChmdW5jdGlvbiAocCkge1xyXG4gICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSksIHtyYWRpdXM6IDUsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYmluZFBvcHVwKHBbMF0gKyAnXFxuICcgKyBwWzFdKS5hZGRUbyhtYXApO1xyXG59KVxyXG5cclxuZnVuY3Rpb24gZHJhd0xpbmVzKGFycmF5KSB7XHJcbiAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXS5zbGljZSgpLnJldmVyc2UoKSxcclxuICAgICAgICAgICAgZW5kID0gbGluZVsxXS5zbGljZSgpLnJldmVyc2UoKTtcclxuXHJcbiAgICAgICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoYmVnaW4pLCB7cmFkaXVzOiAyLCBmaWxsQ29sb3I6IFwiI0ZGRkYwMFwiLCB3ZWlnaHQ6IDJ9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGVuZCksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgTC5wb2x5bGluZShbYmVnaW4sIGVuZF0sIHt3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIGNvbnNvbGUubG9nKHBzKTtcclxuIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi9zcmMvc3dlZXBsaW5lLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuYXZsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFByaW50cyB0cmVlIGhvcml6b250YWxseVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBwcmludCAocm9vdCwgcHJpbnROb2RlKSB7XG4gIGlmICggcHJpbnROb2RlID09PSB2b2lkIDAgKSBwcmludE5vZGUgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbi5rZXk7IH07XG5cbiAgdmFyIG91dCA9IFtdO1xuICByb3cocm9vdCwgJycsIHRydWUsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBvdXQucHVzaCh2KTsgfSwgcHJpbnROb2RlKTtcbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBQcmludHMgbGV2ZWwgb2YgdGhlIHRyZWVcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICBwcmVmaXhcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgaXNUYWlsXG4gKiBAcGFyYW0gIHtGdW5jdGlvbihpbjpzdHJpbmcpOnZvaWR9ICAgIG91dFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9ICBwcmludE5vZGVcbiAqL1xuZnVuY3Rpb24gcm93IChyb290LCBwcmVmaXgsIGlzVGFpbCwgb3V0LCBwcmludE5vZGUpIHtcbiAgaWYgKHJvb3QpIHtcbiAgICBvdXQoKFwiXCIgKyBwcmVmaXggKyAoaXNUYWlsID8gJ+KUlOKUgOKUgCAnIDogJ+KUnOKUgOKUgCAnKSArIChwcmludE5vZGUocm9vdCkpICsgXCJcXG5cIikpO1xuICAgIHZhciBpbmRlbnQgPSBwcmVmaXggKyAoaXNUYWlsID8gJyAgICAnIDogJ+KUgiAgICcpO1xuICAgIGlmIChyb290LmxlZnQpICB7IHJvdyhyb290LmxlZnQsICBpbmRlbnQsIGZhbHNlLCBvdXQsIHByaW50Tm9kZSk7IH1cbiAgICBpZiAocm9vdC5yaWdodCkgeyByb3cocm9vdC5yaWdodCwgaW5kZW50LCB0cnVlLCAgb3V0LCBwcmludE5vZGUpOyB9XG4gIH1cbn1cblxuXG4vKipcbiAqIElzIHRoZSB0cmVlIGJhbGFuY2VkIChub25lIG9mIHRoZSBzdWJ0cmVlcyBkaWZmZXIgaW4gaGVpZ2h0IGJ5IG1vcmUgdGhhbiAxKVxuICogQHBhcmFtICB7Tm9kZX0gICAgcm9vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNCYWxhbmNlZChyb290KSB7XG4gIGlmIChyb290ID09PSBudWxsKSB7IHJldHVybiB0cnVlOyB9IC8vIElmIG5vZGUgaXMgZW1wdHkgdGhlbiByZXR1cm4gdHJ1ZVxuXG4gIC8vIEdldCB0aGUgaGVpZ2h0IG9mIGxlZnQgYW5kIHJpZ2h0IHN1YiB0cmVlc1xuICB2YXIgbGggPSBoZWlnaHQocm9vdC5sZWZ0KTtcbiAgdmFyIHJoID0gaGVpZ2h0KHJvb3QucmlnaHQpO1xuXG4gIGlmIChNYXRoLmFicyhsaCAtIHJoKSA8PSAxICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QubGVmdCkgICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QucmlnaHQpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gSWYgd2UgcmVhY2ggaGVyZSB0aGVuIHRyZWUgaXMgbm90IGhlaWdodC1iYWxhbmNlZFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIENvbXB1dGUgdGhlICdoZWlnaHQnIG9mIGEgdHJlZS5cbiAqIEhlaWdodCBpcyB0aGUgbnVtYmVyIG9mIG5vZGVzIGFsb25nIHRoZSBsb25nZXN0IHBhdGhcbiAqIGZyb20gdGhlIHJvb3Qgbm9kZSBkb3duIHRvIHRoZSBmYXJ0aGVzdCBsZWFmIG5vZGUuXG4gKlxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBoZWlnaHQobm9kZSkge1xuICByZXR1cm4gbm9kZSA/ICgxICsgTWF0aC5tYXgoaGVpZ2h0KG5vZGUubGVmdCksIGhlaWdodChub2RlLnJpZ2h0KSkpIDogMDtcbn1cblxuLy8gZnVuY3Rpb24gY3JlYXRlTm9kZSAocGFyZW50LCBsZWZ0LCByaWdodCwgaGVpZ2h0LCBrZXksIGRhdGEpIHtcbi8vICAgcmV0dXJuIHsgcGFyZW50LCBsZWZ0LCByaWdodCwgYmFsYW5jZUZhY3RvcjogaGVpZ2h0LCBrZXksIGRhdGEgfTtcbi8vIH1cblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBwYXJlbnQ6ICAgICAgICBOb2RlfE51bGwsXG4gKiAgIGxlZnQ6ICAgICAgICAgIE5vZGV8TnVsbCxcbiAqICAgcmlnaHQ6ICAgICAgICAgTm9kZXxOdWxsLFxuICogICBiYWxhbmNlRmFjdG9yOiBOdW1iZXIsXG4gKiAgIGtleTogICAgICAgICAgIGFueSxcbiAqICAgZGF0YTogICAgICAgICAgb2JqZWN0P1xuICogfX0gTm9kZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeyp9IEtleVxuICovXG5cbi8qKlxuICogRGVmYXVsdCBjb21wYXJpc29uIGZ1bmN0aW9uXG4gKiBAcGFyYW0geyp9IGFcbiAqIEBwYXJhbSB7Kn0gYlxuICovXG5mdW5jdGlvbiBERUZBVUxUX0NPTVBBUkUgKGEsIGIpIHsgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwOyB9XG5cblxuLyoqXG4gKiBTaW5nbGUgbGVmdCByb3RhdGlvblxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuZnVuY3Rpb24gcm90YXRlTGVmdCAobm9kZSkge1xuICB2YXIgcmlnaHROb2RlID0gbm9kZS5yaWdodDtcbiAgbm9kZS5yaWdodCAgICA9IHJpZ2h0Tm9kZS5sZWZ0O1xuXG4gIGlmIChyaWdodE5vZGUubGVmdCkgeyByaWdodE5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgcmlnaHROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAocmlnaHROb2RlLnBhcmVudCkge1xuICAgIGlmIChyaWdodE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9IHJpZ2h0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5yaWdodCA9IHJpZ2h0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IHJpZ2h0Tm9kZTtcbiAgcmlnaHROb2RlLmxlZnQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAocmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cbiAgcmV0dXJuIHJpZ2h0Tm9kZTtcbn1cblxuXG5mdW5jdGlvbiByb3RhdGVSaWdodCAobm9kZSkge1xuICB2YXIgbGVmdE5vZGUgPSBub2RlLmxlZnQ7XG4gIG5vZGUubGVmdCA9IGxlZnROb2RlLnJpZ2h0O1xuICBpZiAobm9kZS5sZWZ0KSB7IG5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgbGVmdE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChsZWZ0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobGVmdE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5sZWZ0ID0gbGVmdE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5yaWdodCA9IGxlZnROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gbGVmdE5vZGU7XG4gIGxlZnROb2RlLnJpZ2h0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IGxlZnROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByZXR1cm4gbGVmdE5vZGU7XG59XG5cblxuLy8gZnVuY3Rpb24gbGVmdEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgcm90YXRlTGVmdChub2RlLmxlZnQpO1xuLy8gICByZXR1cm4gcm90YXRlUmlnaHQobm9kZSk7XG4vLyB9XG5cblxuLy8gZnVuY3Rpb24gcmlnaHRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHJvdGF0ZVJpZ2h0KG5vZGUucmlnaHQpO1xuLy8gICByZXR1cm4gcm90YXRlTGVmdChub2RlKTtcbi8vIH1cblxuXG52YXIgVHJlZSA9IGZ1bmN0aW9uIFRyZWUgKGNvbXBhcmF0b3IpIHtcbiAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3IgfHwgREVGQVVMVF9DT01QQVJFO1xuICB0aGlzLl9yb290ID0gbnVsbDtcbiAgdGhpcy5fc2l6ZSA9IDA7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBzaXplOiB7fSB9O1xuXG5cbi8qKlxuICogQ2xlYXIgdGhlIHRyZWVcbiAqL1xuVHJlZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICB0aGlzLl9yb290ID0gbnVsbDtcbn07XG5cbi8qKlxuICogTnVtYmVyIG9mIG5vZGVzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbnByb3RvdHlwZUFjY2Vzc29ycy5zaXplLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3NpemU7XG59O1xuXG5cbi8qKlxuICogV2hldGhlciB0aGUgdHJlZSBjb250YWlucyBhIG5vZGUgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMgKGtleSkge1xuICBpZiAodGhpcy5fcm9vdCl7XG4gICAgdmFyIG5vZGUgICAgID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gICAgd2hpbGUgKG5vZGUpe1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3Ioa2V5LCBub2RlLmtleSk7XG4gICAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cbi8qKlxuICogU3VjY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiBuZXh0IChub2RlKSB7XG4gIHZhciBzdWNjZXNzb3IgPSBub2RlO1xuICBpZiAoc3VjY2Vzc29yKSB7XG4gICAgaWYgKHN1Y2Nlc3Nvci5yaWdodCkge1xuICAgICAgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnJpZ2h0O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IubGVmdCkgeyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IubGVmdDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLnJpZ2h0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBzdWNjZXNzb3I7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWNjZXNzb3I7XG59O1xuXG5cbi8qKlxuICogUHJlZGVjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uIHByZXYgKG5vZGUpIHtcbiAgdmFyIHByZWRlY2Vzc29yID0gbm9kZTtcbiAgaWYgKHByZWRlY2Vzc29yKSB7XG4gICAgaWYgKHByZWRlY2Vzc29yLmxlZnQpIHtcbiAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IubGVmdDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5yaWdodCkgeyBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnJpZ2h0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWRlY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IubGVmdCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gcHJlZGVjZXNzb3I7XG4gICAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcHJlZGVjZXNzb3I7XG59O1xuLyogZXNsaW50LWVuYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cblxuLyoqXG4gKiBAcGFyYW17RnVuY3Rpb24obm9kZTpOb2RlKTp2b2lkfSBmblxuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuVHJlZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2ggKGZuKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgZG9uZSA9IGZhbHNlLCBpID0gMDtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICAvLyBSZWFjaCB0aGUgbGVmdCBtb3N0IE5vZGUgb2YgdGhlIGN1cnJlbnQgTm9kZVxuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICAvLyBQbGFjZSBwb2ludGVyIHRvIGEgdHJlZSBub2RlIG9uIHRoZSBzdGFja1xuICAgICAgLy8gYmVmb3JlIHRyYXZlcnNpbmcgdGhlIG5vZGUncyBsZWZ0IHN1YnRyZWVcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJhY2tUcmFjayBmcm9tIHRoZSBlbXB0eSBzdWJ0cmVlIGFuZCB2aXNpdCB0aGUgTm9kZVxuICAgICAgLy8gYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2s7IGhvd2V2ZXIsIGlmIHRoZSBzdGFjayBpc1xuICAgICAgLy8gZW1wdHkgeW91IGFyZSBkb25lXG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICBmbihjdXJyZW50LCBpKyspO1xuXG4gICAgICAgIC8vIFdlIGhhdmUgdmlzaXRlZCB0aGUgbm9kZSBhbmQgaXRzIGxlZnRcbiAgICAgICAgLy8gc3VidHJlZS4gTm93LCBpdCdzIHJpZ2h0IHN1YnRyZWUncyB0dXJuXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBhbGwga2V5cyBpbiBvcmRlclxuICogQHJldHVybiB7QXJyYXk8S2V5Pn1cbiAqL1xuVHJlZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uIGtleXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5rZXkpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYGRhdGFgIGZpZWxkcyBvZiBhbGwgbm9kZXMgaW4gb3JkZXIuXG4gKiBAcmV0dXJuIHtBcnJheTwqPn1cbiAqL1xuVHJlZS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gdmFsdWVzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQuZGF0YSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1pbmltdW0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1pbk5vZGUgPSBmdW5jdGlvbiBtaW5Ob2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtYXgga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1heE5vZGUgPSBmdW5jdGlvbiBtYXhOb2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogTWluIGtleVxuICogQHJldHVybiB7S2V5fVxuICovXG5UcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiBtaW4gKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuLyoqXG4gKiBNYXgga2V5XG4gKiBAcmV0dXJuIHtLZXl8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gbWF4ICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuXG4vKipcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5ICgpIHtcbiAgcmV0dXJuICF0aGlzLl9yb290O1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG5vZGUgd2l0aCBzbWFsbGVzdCBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290LCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gIGlmIChub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgcmV0dXJuVmFsdWUgPSB7IGtleTogbm9kZS5rZXksIGRhdGE6IG5vZGUuZGF0YSB9O1xuICAgIHRoaXMucmVtb3ZlKG5vZGUua2V5KTtcbiAgfVxuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogRmluZCBub2RlIGJ5IGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiBmaW5kIChrZXkpIHtcbiAgdmFyIHJvb3QgPSB0aGlzLl9yb290O1xuICBpZiAocm9vdCA9PT0gbnVsbCkgIHsgcmV0dXJuIG51bGw7IH1cbiAgaWYgKGtleSA9PT0gcm9vdC5rZXkpIHsgcmV0dXJuIHJvb3Q7IH1cblxuICB2YXIgc3VidHJlZSA9IHJvb3QsIGNtcDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB3aGlsZSAoc3VidHJlZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBzdWJ0cmVlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gc3VidHJlZTsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgc3VidHJlZSA9IHN1YnRyZWUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgc3VidHJlZSA9IHN1YnRyZWUucmlnaHQ7IH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuXG4vKipcbiAqIEluc2VydCBhIG5vZGUgaW50byB0aGUgdHJlZVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcGFyYW17Kn0gW2RhdGFdXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCAoa2V5LCBkYXRhKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7XG4gICAgdGhpcy5fcm9vdCA9IHtcbiAgICAgIHBhcmVudDogbnVsbCwgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgICBrZXk6IGtleSwgZGF0YTogZGF0YVxuICAgIH07XG4gICAgdGhpcy5fc2l6ZSsrO1xuICAgIHJldHVybiB0aGlzLl9yb290O1xuICB9XG5cbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB2YXIgbm9kZSAgPSB0aGlzLl9yb290O1xuICB2YXIgcGFyZW50PSBudWxsO1xuICB2YXIgY21wICAgPSAwO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBwYXJlbnQgPSBub2RlO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cblxuICB2YXIgbmV3Tm9kZSA9IHtcbiAgICBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICBwYXJlbnQ6IHBhcmVudCwga2V5OiBrZXksIGRhdGE6IGRhdGEsXG4gIH07XG4gIGlmIChjbXAgPCAwKSB7IHBhcmVudC5sZWZ0PSBuZXdOb2RlOyB9XG4gIGVsc2UgICAgICAgeyBwYXJlbnQucmlnaHQgPSBuZXdOb2RlOyB9XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChjb21wYXJlKHBhcmVudC5rZXksIGtleSkgPCAwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvL2xldCBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gbGV0IG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCQxID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3QkMTsgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICB0aGlzLl9zaXplKys7XG4gIHJldHVybiBuZXdOb2RlO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgdGhlIG5vZGUgZnJvbSB0aGUgdHJlZS4gSWYgbm90IGZvdW5kLCByZXR1cm5zIG51bGwuXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge05vZGU6TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrZXkpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIHZhciBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHZhciByZXR1cm5WYWx1ZSA9IG5vZGUua2V5O1xuXG4gIGlmIChub2RlLmxlZnQpIHtcbiAgICB2YXIgbWF4ID0gbm9kZS5sZWZ0O1xuXG4gICAgd2hpbGUgKG1heC5sZWZ0IHx8IG1heC5yaWdodCkge1xuICAgICAgd2hpbGUgKG1heC5yaWdodCkgeyBtYXggPSBtYXgucmlnaHQ7IH1cblxuICAgICAgbm9kZS5rZXkgPSBtYXgua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgICBpZiAobWF4LmxlZnQpIHtcbiAgICAgICAgbm9kZSA9IG1heDtcbiAgICAgICAgbWF4ID0gbWF4LmxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1heC5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgbm9kZSA9IG1heDtcbiAgfVxuXG4gIGlmIChub2RlLnJpZ2h0KSB7XG4gICAgdmFyIG1pbiA9IG5vZGUucmlnaHQ7XG5cbiAgICB3aGlsZSAobWluLmxlZnQgfHwgbWluLnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWluLmxlZnQpIHsgbWluID0gbWluLmxlZnQ7IH1cblxuICAgICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICAgIGlmIChtaW4ucmlnaHQpIHtcbiAgICAgICAgbm9kZSA9IG1pbjtcbiAgICAgICAgbWluID0gbWluLnJpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgIG5vZGUgPSBtaW47XG4gIH1cblxuICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIHZhciBwcCAgID0gbm9kZTtcblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKHBhcmVudC5sZWZ0ID09PSBwcCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy9sZXQgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIHZhciBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdDtcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gbGV0IG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCQxID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3QkMTsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdCQxO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gLTEgfHwgcGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgYnJlYWs7IH1cblxuICAgIHBwICAgPSBwYXJlbnQ7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIGlmIChub2RlLnBhcmVudCkge1xuICAgIGlmIChub2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7IG5vZGUucGFyZW50LmxlZnQ9IG51bGw7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgIHsgbm9kZS5wYXJlbnQucmlnaHQgPSBudWxsOyB9XG4gIH1cblxuICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkgeyB0aGlzLl9yb290ID0gbnVsbDsgfVxuXG4gIHRoaXMuX3NpemUtLTtcbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHJlZSBpcyBiYWxhbmNlZFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaXNCYWxhbmNlZCA9IGZ1bmN0aW9uIGlzQmFsYW5jZWQkMSAoKSB7XG4gIHJldHVybiBpc0JhbGFuY2VkKHRoaXMuX3Jvb3QpO1xufTtcblxuXG4vKipcbiAqIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJlZSAtIHByaW1pdGl2ZSBob3Jpem9udGFsIHByaW50LW91dFxuICogQHBhcmFte0Z1bmN0aW9uKE5vZGUpOlN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuVHJlZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAocHJpbnROb2RlKSB7XG4gIHJldHVybiBwcmludCh0aGlzLl9yb290LCBwcmludE5vZGUpO1xufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIFRyZWUucHJvdG90eXBlLCBwcm90b3R5cGVBY2Nlc3NvcnMgKTtcblxucmV0dXJuIFRyZWU7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdmwuanMubWFwXG4iLCJ2YXIgRVBTID0gMUUtOTtcclxuLyoqXHJcbiAqIEBwYXJhbSBhIHZlY3RvclxyXG4gKiBAcGFyYW0gYiB2ZWN0b3JcclxuICogQHBhcmFtIGMgdmVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBvblNlZ21lbnQoYSwgYiwgYykge1xyXG4gICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgeDMgPSBjWzBdLFxyXG4gICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICB5MiA9IGJbMV0sXHJcbiAgICAgICAgeTMgPSBjWzFdO1xyXG5cclxuICAgIHJldHVybiAoTWF0aC5taW4oeDEsIHgyKSA8PSB4MykgJiYgKHgzIDw9IE1hdGgubWF4KHgxLCB4MikpICYmXHJcbiAgICAgICAgICAgKE1hdGgubWluKHkxLCB5MikgPD0geTMpICYmICh5MyA8PSBNYXRoLm1heCh5MSwgeTIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIGFjIHggYmNcclxuICogQHBhcmFtIGEgdmVjdG9yXHJcbiAqIEBwYXJhbSBiIHZlY3RvclxyXG4gKiBAcGFyYW0gYyB2ZWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIGRpcmVjdGlvbihhLCBiLCBjKSB7XHJcbiAgICB2YXIgeDEgPSBhWzBdLFxyXG4gICAgICAgIHgyID0gYlswXSxcclxuICAgICAgICB4MyA9IGNbMF0sXHJcbiAgICAgICAgeTEgPSBhWzFdLFxyXG4gICAgICAgIHkyID0gYlsxXSxcclxuICAgICAgICB5MyA9IGNbMV07XHJcblxyXG4gICAgcmV0dXJuICh4MyAtIHgxKSAqICh5MiAtIHkxKSAtICh4MiAtIHgxKSAqICh5MyAtIHkxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBhIHNlZ21lbnQxXHJcbiAqIEBwYXJhbSBiIHNlZ21lbnQyXHJcbiAqL1xyXG5mdW5jdGlvbiBzZWdtZW50c0ludGVyc2VjdChhLCBiKSB7XHJcbiAgICB2YXIgcDEgPSBhWzBdLFxyXG4gICAgICAgIHAyID0gYVsxXSxcclxuICAgICAgICBwMyA9IGJbMF0sXHJcbiAgICAgICAgcDQgPSBiWzFdLFxyXG4gICAgICAgIGQxID0gZGlyZWN0aW9uKHAzLCBwNCwgcDEpLFxyXG4gICAgICAgIGQyID0gZGlyZWN0aW9uKHAzLCBwNCwgcDIpLFxyXG4gICAgICAgIGQzID0gZGlyZWN0aW9uKHAxLCBwMiwgcDMpLFxyXG4gICAgICAgIGQ0ID0gZGlyZWN0aW9uKHAxLCBwMiwgcDQpO1xyXG5cclxuICAgIGlmICgoKGQxID4gMCAmJiBkMiA8IDApIHx8IChkMSA8IDAgJiYgZDIgPiAwKSkgJiYgKChkMyA+IDAgJiYgZDQgPCAwKSB8fCAoZDMgPCAwICYmIGQ0ID4gMCkpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQxID09PSAwICYmIG9uU2VnbWVudChwMywgcDQsIHAxKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkMiA9PT0gMCAmJiBvblNlZ21lbnQocDMsIHA0LCBwMikpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoZDMgPT09IDAgJiYgb25TZWdtZW50KHAxLCBwMiwgcDMpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQ0ID09PSAwICYmIG9uU2VnbWVudChwMSwgcDIsIHA0KSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb24gKGEsIGIpIHtcclxuICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAoKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpKTtcclxuICAgIHZhciB5ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICBpZiAoaXNOYU4oeCl8fGlzTmFOKHkpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoeDEgPj0geDIpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHgyLCB4LCB4MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHkxID49IHkyKSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5MiwgeSwgeTEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh4MyA+PSB4NCkge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeDQsIHgsIHgzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHgzLCB4LCB4NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoeTMgPj0geTQpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHk0LCB5LCB5MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW3gsIHldO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiZXR3ZWVuIChhLCBiLCBjKSB7XHJcbiAgICByZXR1cm4gYS1FUFMgPD0gYiAmJiBiIDw9IGMrRVBTO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY29tcGFyZVNlZ21lbnRzKGEsIGIpIHtcclxuICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG5cclxuICAgIHZhciBjdXJyZW50WCwgICAvLyDRgtC10LrRg9GJ0LjQuSB4INGB0LLQuNC/0LvQsNC50L3QsFxyXG4gICAgICAgIGF5LCAgICAgICAgIC8vIHkg0YLQvtGH0LrQuCDQv9C10YDQtdGB0LXRh9C10L3QuNGPINC+0YLRgNC10LfQutCwINGB0L7QsdGL0YLQuNGPIGEg0YHQviDRgdCy0LjQv9C70LDQudC90L7QvFxyXG4gICAgICAgIGJ5LCAgICAgICAgIC8vIHkg0YLQvtGH0LrQuCDQv9C10YDQtdGB0LXRh9C10L3QuNGPINC+0YLRgNC10LfQutCwINGB0L7QsdGL0YLQuNGPIGIg0YHQviDRgdCy0LjQv9C70LDQudC90L7QvFxyXG4gICAgICAgIGRlbHRhWSwgICAgIC8vINGA0LDQt9C90LjRhtCwIHkg0YLQvtGH0LXQuiDQv9C10YDQtdGB0LXRh9C10L3QuNGPXHJcbiAgICAgICAgZGVsdGFYMSwgICAgLy8g0YDQsNC30L3QuNGG0LAgeCDQvdCw0YfQsNC7INC+0YLRgNC10LfQutC+0LJcclxuICAgICAgICBkZWx0YVgyOyAgICAvLyDRgNCw0LfQvdC40YbQsCB4INC60L7QvdGG0L7QsiDQvtGC0YDQtdC30LrQvtCyXHJcblxyXG4gICAgaWYgKGEgPT09IGIpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBjdXJyZW50WCA9IHRoaXMueDtcclxuICAgIGF5ID0gZ2V0WShhLCBjdXJyZW50WCk7XHJcbiAgICBieSA9IGdldFkoYiwgY3VycmVudFgpO1xyXG4gICAgZGVsdGFZID0gYXkgLSBieTtcclxuXHJcbiAgICAvLyDRgdGA0LDQstC90LXQvdC40LUg0L3QsNC00L4g0L/RgNC+0LLQvtC00LjRgtGMINGBINGN0L/RgdC40LvQvtC90L7QvCxcclxuICAgIC8vINC40L3QsNGH0LUg0LLQvtC30LzQvtC20L3RiyDQvtGI0LjQsdC60Lgg0L7QutGA0YPQs9C70LXQvdC40Y9cclxuICAgIGlmIChNYXRoLmFicyhkZWx0YVkpID4gRVBTKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhWSA8IDAgPyAtMSA6IDE7XHJcbiAgICAvLyDQtdGB0LvQuCB5INC+0LHQtdC40YUg0YHQvtCx0YvRgtC40Lkg0YDQsNCy0L3Ri1xyXG4gICAgLy8g0L/RgNC+0LLQtdGA0Y/QtdC8INGD0LPQvtC7INC/0YDRj9C80YvRhVxyXG4gICAgLy8g0YfQtdC8INC60YDRg9GH0LUg0L/RgNGP0LzQsNGPLCDRgtC10Lwg0L3QuNC20LUg0LXQtSDQu9C10LLRi9C5INC60L7QvdC10YYsINC30L3QsNGH0LjRgiDRgdC+0LHRi9GC0LjQtSDRgNCw0YHQv9C+0LvQsNCz0LDQtdC8INC90LjQttC1XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBhU2xvcGUgPSBnZXRTbG9wZShhKSxcclxuICAgICAgICAgICAgYlNsb3BlID0gZ2V0U2xvcGUoYik7XHJcblxyXG4gICAgICAgIGlmIChhU2xvcGUgIT09IGJTbG9wZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2JlZm9yZScpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhU2xvcGUgPiBiU2xvcGUgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYVNsb3BlID4gYlNsb3BlID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g0L/QvtGB0LvQtSDRgdGA0LDQstC90LXQvdC40Y8g0L/QviB5INC/0LXRgNC10YHQtdGH0LXQvdC40Y8g0YHQviDRgdCy0LjQv9C70LDQudC90L7QvFxyXG4gICAgLy8g0Lgg0YHRgNCw0LLQvdC10L3QuNGPINGD0LrQu9C+0L3QvtCyXHJcbiAgICAvLyDQvtGB0YLQsNC10YLRgdGPINGB0LvRg9GH0LDQuSwg0LrQvtCz0LTQsCDRg9C60LvQvtC90Ysg0YDQsNCy0L3Ri1xyXG4gICAgLy8gKGlmIGFTbG9wZSA9PT0gYlNsb3BlKVxyXG4gICAgLy8g0LggMiDQvtGC0YDQtdC30LrQsCDQu9C10LbQsNGCINC90LAg0L7QtNC90L7QuSDQv9GA0Y/QvNC+0LlcclxuICAgIC8vINCyINGC0LDQutC+0Lwg0YHQu9GD0YfQsNC1XHJcbiAgICAvLyDQv9GA0L7QstC10YDQuNC8INC/0L7Qu9C+0LbQtdC90LjQtSDQutC+0L3RhtC+0LIg0L7RgtGA0LXQt9C60L7QslxyXG4gICAgZGVsdGFYMSA9IHgxIC0geDM7XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LjQvCDQstC30LDQuNC80L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtSDQu9C10LLRi9GFINC60L7QvdGG0L7QslxyXG4gICAgaWYgKGRlbHRhWDEgIT09IDApIHtcclxuICAgICAgICByZXR1cm4gZGVsdGFYMSA8IDAgPyAtMSA6IDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LjQvCDQstC30LDQuNC80L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtSDQv9GA0LDQstGL0YUg0LrQvtC90YbQvtCyXHJcbiAgICBkZWx0YVgyID0geDIgLSB4NDtcclxuXHJcbiAgICBpZiAoZGVsdGFYMiAhPT0gMCkge1xyXG4gICAgICAgIHJldHVybiBkZWx0YVgyIDwgMCA/IC0xIDogMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtGC0YDQtdC30LrQuCDRgdC+0LLQv9Cw0LTQsNGO0YJcclxuICAgIHJldHVybiAwO1xyXG5cclxufTtcclxuXHJcbmZ1bmN0aW9uIGNvbXBhcmVQb2ludHMoYSwgYikge1xyXG4gICAgdmFyIGFJc0FycmF5ID0gQXJyYXkuaXNBcnJheShhKSxcclxuICAgICAgICBiSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoYiksXHJcbiAgICAgICAgeDEgPSBhSXNBcnJheSA/IGFbMF0gOiBhLngsXHJcbiAgICAgICAgeTEgPSBhSXNBcnJheSA/IGFbMV0gOiBhLnksXHJcbiAgICAgICAgeDIgPSBiSXNBcnJheSA/IGJbMF0gOiBiLngsXHJcbiAgICAgICAgeTIgPSBiSXNBcnJheSA/IGJbMV0gOiBiLnk7XHJcblxyXG4gICAgaWYgKHgxID4geDIgfHwgKHgxID09PSB4MiAmJiB5MSA+IHkyKSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfSBlbHNlIGlmICh4MSA8IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPCB5MikpIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9IGVsc2UgaWYgKE1hdGguYWJzKHgxIC0geDIpIDwgRVBTICYmIE1hdGguYWJzKHkxIC0geTIpIDwgRVBTICkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd4MScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKE1hdGguYWJzKHgxKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3gyJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coTWF0aC5hYnMoeDIpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhNYXRoLmFicyh5MSAtIHkyKSk7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNsb3BlKHNlZ21lbnQpIHtcclxuICAgIHZhciB4MSA9IHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgeTEgPSBzZWdtZW50WzBdWzFdLFxyXG4gICAgICAgIHgyID0gc2VnbWVudFsxXVswXSxcclxuICAgICAgICB5MiA9IHNlZ21lbnRbMV1bMV07XHJcblxyXG4gICAgaWYgKHgxID09PSB4Mikge1xyXG4gICAgICAgIHJldHVybiAoeTEgPCB5MikgPyBJbmZpbml0eSA6IC0gSW5maW5pdHk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoeTIgLSB5MSkgLyAoeDIgLSB4MSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBnZXRZKHNlZ21lbnQsIHgpIHtcclxuICAgIHZhciBiZWdpbiA9IHNlZ21lbnRbMF0sXHJcbiAgICAgICAgZW5kID0gc2VnbWVudFsxXSxcclxuICAgICAgICBzcGFuID0gc2VnbWVudFsxXVswXSAtIHNlZ21lbnRbMF1bMF0sXHJcbiAgICAgICAgZGVsdGFYMCwgLy8g0YDQsNC30L3QuNGG0LAg0LzQtdC20LTRgyB4INC4IHgg0L3QsNGH0LDQu9CwINC+0YLRgNC10LfQutCwXHJcbiAgICAgICAgZGVsdGFYMSwgLy8g0YDQsNC30L3QuNGG0LAg0LzQtdC20LTRgyB4INC60L7QvdGG0LAg0L7RgtGA0LXQt9C60LAg0LggeFxyXG4gICAgICAgIGlmYWMsICAgIC8vINC/0YDQvtC/0L7RgNGG0LjRjyBkZWx0YVgwINC6INC/0YDQvtC10LrRhtC40LhcclxuICAgICAgICBmYWM7ICAgICAvLyDQv9GA0L7Qv9C+0YDRhtC40Y8gZGVsdGFYMSDQuiDQv9GA0L7QtdC60YbQuNC4XHJcblxyXG4gICAgLy8g0LIg0YHQu9GD0YfQsNC1LCDQtdGB0LvQuCB4INC90LUg0L/QtdGA0LXRgdC10LrQsNC10YLRgdGPINGBINC/0YDQvtC10LrRhtC40LXQuSDQvtGC0YDQtdC30LrQsCDQvdCwINC+0YHRjCB4LFxyXG4gICAgLy8g0LLQvtC30LLRgNGJ0LDQtdGCIHkg0L3QsNGH0LDQu9CwINC40LvQuCDQutC+0L3RhtCwINC+0YLRgNC10LfQutCwXHJcbiAgICBpZiAoeCA8PSBiZWdpblswXSkge1xyXG4gICAgICAgIHJldHVybiBiZWdpblsxXTtcclxuICAgIH0gZWxzZSBpZiAoeCA+PSBlbmRbMF0pIHtcclxuICAgICAgICByZXR1cm4gZW5kWzFdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC10YHQu9C4IHgg0LvQtdC20LjRgiDQstC90YPRgtGA0Lgg0L/RgNC+0LXQutGG0LjQuCDQvtGC0YDQtdC30LrQsCDQvdCwINC+0YHRjCB4XHJcbiAgICAvLyDQstGL0YfQuNGB0LvRj9C10YIg0L/RgNC+0L/QvtGA0YbQuNC4XHJcbiAgICBkZWx0YVgwID0geCAtIGJlZ2luWzBdO1xyXG4gICAgZGVsdGFYMSA9IGVuZFswXSAtIHg7XHJcblxyXG4gICAgaWYgKGRlbHRhWDAgPiBkZWx0YVgxKSB7XHJcbiAgICAgICAgaWZhYyA9IGRlbHRhWDAgLyBzcGFuXHJcbiAgICAgICAgZmFjID0gMSAtIGlmYWM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZhYyA9IGRlbHRhWDEgLyBzcGFuXHJcbiAgICAgICAgaWZhYyA9IDEgLSBmYWM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChiZWdpblsxXSAqIGZhYykgKyAoZW5kWzFdICogaWZhYyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIEVQUzogRVBTLFxyXG4gICAgb25TZWdtZW50OiBvblNlZ21lbnQsXHJcbiAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgIHNlZ21lbnRzSW50ZXJzZWN0OiBzZWdtZW50c0ludGVyc2VjdCxcclxuICAgIGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbjogZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uLFxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBjb21wYXJlU2VnbWVudHMsXHJcbiAgICBjb21wYXJlUG9pbnRzOiBjb21wYXJlUG9pbnRzXHJcbn1cclxuIiwidmFyIFBvaW50ID0gZnVuY3Rpb24gKGNvb3JkcywgdHlwZSkge1xyXG4gICAgdGhpcy54ID0gY29vcmRzWzBdO1xyXG4gICAgdGhpcy55ID0gY29vcmRzWzFdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcclxuIiwiZnVuY3Rpb24gU3dlZXBsaW5lKHBvc2l0aW9uKSB7XHJcbiAgICB0aGlzLnggPSBudWxsO1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG59XHJcblxyXG5Td2VlcGxpbmUucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbn1cclxuU3dlZXBsaW5lLnByb3RvdHlwZS5zZXRYID0gZnVuY3Rpb24gKHgpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3dlZXBsaW5lO1xyXG4iLCIvLyAxKSBFUFMtcm91bmQgaW50ZXJzZWN0aW9uc1xyXG4vLyAyKSBoYW5kbGUgZW5kc1xyXG52YXIgVHJlZSA9IHJlcXVpcmUoJ2F2bCcpLFxyXG4gICAgU3dlZXBsaW5lID0gcmVxdWlyZSgnLi9zbCcpLFxyXG4gICAgUG9pbnQgPSByZXF1aXJlKCcuL3BvaW50JyksXHJcbiAgICB1dGlscyA9IHJlcXVpcmUoJy4vZ2VvbWV0cnkvZ2VvbWV0cnknKTtcclxuXHJcbi8qKlxyXG4qIEBwYXJhbSB7QXJyYXl9IHNlZ21lbnRzIHNldCBvZiBzZWdtZW50cyBpbnRlcnNlY3Rpbmcgc3dlZXBsaW5lIFtbW3gxLCB5MV0sIFt4MiwgeTJdXSAuLi4gW1t4bSwgeW1dLCBbeG4sIHluXV1dXHJcbiovXHJcbmZ1bmN0aW9uIGZpbmRJbnRlcnNlY3Rpb25zKHNlZ21lbnRzLCBtYXApIHtcclxuICAgIHZhciBzd2VlcGxpbmUgPSBuZXcgU3dlZXBsaW5lKCdiZWZvcmUnKSxcclxuICAgICAgICBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMsIHRydWUpLFxyXG4gICAgICAgIHN0YXR1cyA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVTZWdtZW50cy5iaW5kKHN3ZWVwbGluZSkpLFxyXG4gICAgICAgIG91dHB1dCA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMsIHRydWUpO1xyXG5cclxuICAgIHNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKHNlZ21lbnQsIGksIGEpIHtcclxuICAgICAgICBzZWdtZW50LnNvcnQodXRpbHMuY29tcGFyZVBvaW50cyk7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbmV3IFBvaW50KHNlZ21lbnRbMF0sICdiZWdpbicpLFxyXG4gICAgICAgICAgICBlbmQgPSBuZXcgUG9pbnQoc2VnbWVudFsxXSwgJ2VuZCcpO1xyXG5cclxuICAgICAgICBpZiAoIXF1ZXVlLmNvbnRhaW5zKGJlZ2luKSkge1xyXG4gICAgICAgICAgICBxdWV1ZS5pbnNlcnQoYmVnaW4sIGJlZ2luKTtcclxuICAgICAgICAgICAgYmVnaW4uc2VnbWVudHMucHVzaChzZWdtZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBiZWdpbiA9IHF1ZXVlLmZpbmQoYmVnaW4pLmtleTtcclxuICAgICAgICAgICAgYmVnaW4uc2VnbWVudHMucHVzaChzZWdtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmICghcXVldWUuY29udGFpbnMoZW5kKSkge1xyXG4gICAgICAgICAgICBxdWV1ZS5pbnNlcnQoZW5kLCBlbmQpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0pO1xyXG4gICAgY29uc29sZS5sb2cocXVldWUua2V5cygpKTtcclxuICAgIGNvbnNvbGUubG9nKHF1ZXVlLmtleXMoKS5sZW5ndGgpO1xyXG4gICAgd2hpbGUgKCFxdWV1ZS5pc0VtcHR5KCkpIHtcclxuICAgICAgICB2YXIgcG9pbnQgPSBxdWV1ZS5wb3AoKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnU1RFUCcpO1xyXG5cclxuICAgICAgICBoYW5kbGVFdmVudFBvaW50KHBvaW50LmtleSwgc3RhdHVzLCBvdXRwdXQsIHF1ZXVlLCBzd2VlcGxpbmUsIG1hcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2luZG93LnN0YXR1cyA9IHN0YXR1cztcclxuICAgIC8vIHdpbmRvdy5xdWV1ZSA9IHF1ZXVlO1xyXG4gICAgcmV0dXJuIG91dHB1dC5rZXlzKCkubWFwKGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgcmV0dXJuIFtrZXkueCwga2V5LnldO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUV2ZW50UG9pbnQocG9pbnQsIHN0YXR1cywgb3V0cHV0LCBxdWV1ZSwgc3dlZXBsaW5lLCBtYXApIHtcclxuICAgIC8vIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKFtwb2ludC55LCBwb2ludC54XSksIHtyYWRpdXM6IDUsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYWRkVG8obWFwKTtcclxuICAgIHN3ZWVwbGluZS5zZXRQb3NpdGlvbignYmVmb3JlJyk7XHJcbiAgICBzd2VlcGxpbmUuc2V0WChwb2ludC54KTtcclxuICAgIC8vIHN0ZXAgMVxyXG4gICAgdmFyIFVwID0gcG9pbnQuc2VnbWVudHMsIC8vIHNlZ21lbnRzLCBmb3Igd2hpY2ggdGhpcyBpcyB0aGUgbGVmdCBlbmRcclxuICAgICAgICBMcCA9IFtdLCAgICAgICAgICAgICAvLyBzZWdtZW50cywgZm9yIHdoaWNoIHRoaXMgaXMgdGhlIHJpZ2h0IGVuZFxyXG4gICAgICAgIENwID0gW107ICAgICAgICAgICAgIC8vIC8vIHNlZ21lbnRzLCBmb3Igd2hpY2ggdGhpcyBpcyBhbiBpbm5lciBwb2ludFxyXG5cclxuICAgIC8vIHN0ZXAgMlxyXG4gICAgc3RhdHVzLmZvckVhY2goZnVuY3Rpb24obm9kZSwgaSkge1xyXG4gICAgICAgIHZhciBzZWdtZW50ID0gbm9kZS5rZXksXHJcbiAgICAgICAgICAgIHNlZ21lbnRCZWdpbiA9IHNlZ21lbnRbMF0sXHJcbiAgICAgICAgICAgIHNlZ21lbnRFbmQgPSBzZWdtZW50WzFdO1xyXG5cclxuICAgICAgICAvLyBjb3VudCByaWdodC1lbmRzXHJcbiAgICAgICAgaWYgKHBvaW50LnggPT09IHNlZ21lbnRFbmRbMF0gJiYgcG9pbnQueSA9PT0gc2VnbWVudEVuZFsxXSkge1xyXG4gICAgICAgICAgICBMcC5wdXNoKHNlZ21lbnQpO1xyXG4gICAgICAgIC8vIGNvdW50IGlubmVyIHBvaW50c1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGZpbHRlciBsZWZ0IGVuZHNcclxuICAgICAgICAgICAgaWYgKCEocG9pbnQueCA9PT0gc2VnbWVudEJlZ2luWzBdICYmIHBvaW50LnkgPT09IHNlZ21lbnRCZWdpblsxXSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh1dGlscy5kaXJlY3Rpb24oc2VnbWVudEJlZ2luLCBzZWdtZW50RW5kLCBbcG9pbnQueCwgcG9pbnQueV0pKSA8IHV0aWxzLkVQUyAmJiB1dGlscy5vblNlZ21lbnQoc2VnbWVudEJlZ2luLCBzZWdtZW50RW5kLCBbcG9pbnQueCwgcG9pbnQueV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ3AucHVzaChzZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gc3RlcCAzXHJcbiAgICAvLyBoYW5kbGUgZXZlcnkgaW50ZXJzZWN0aW9uXHJcbiAgICAvLyB0aGVyZSBpcyBhbHdheXMgb25lIG9mIGNhc2VzOiBVcC5sZW5ndGggfHwgQ3AubGVuZ3RoIHx8IExwLmxlbmd0aFxyXG4gICAgLy8gcG9pbnQgaW4gYWx3YXlzIHRoZSBsZWZ0IHx8IHRoZSByaWdodCB8fCBvbi1zZWdtZW50XHJcbiAgICBpZiAoW10uY29uY2F0KFVwLCBMcCwgQ3ApLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnb3V0cHV0Lmluc2VydCBmcm9tIGZpcnN0Jyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocG9pbnQpO1xyXG4gICAgICAgIG91dHB1dC5pbnNlcnQocG9pbnQsIHBvaW50KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gc3RlcCA1XHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IENwLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgc3RhdHVzLnJlbW92ZShDcFtqXSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3dlZXBsaW5lLnNldFBvc2l0aW9uKCdhZnRlcicpO1xyXG5cclxuICAgIC8vIHN0ZXAgNiBJbnNlcnQgaW50ZXJzZWN0aW5nLFxyXG4gICAgLy8gKHN0ZXAgNykgaGVyZSBpcyB0aGUgc2VnbWVudHMgb3JkZXIgY2hhbmdpbmdcclxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgVXAubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICBzdGF0dXMuaW5zZXJ0KFVwW2tdKTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGwgPSAwOyBsIDwgQ3AubGVuZ3RoOyBsKyspIHtcclxuICAgICAgICBzdGF0dXMuaW5zZXJ0KENwW2xdKTtcclxuICAgIH1cclxuICAgIC8vIGhhbmRsZSByaWdodCBlbmQtcG9pbnQgY2FzZVxyXG4gICAgaWYgKFVwLmxlbmd0aCA9PT0gMCAmJiBDcC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IExwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gTHBbaV0sXHJcbiAgICAgICAgICAgICAgICBzTm9kZSA9IHN0YXR1cy5maW5kKHMpLFxyXG4gICAgICAgICAgICAgICAgc2wgPSBzdGF0dXMucHJldihzTm9kZSksXHJcbiAgICAgICAgICAgICAgICBzciA9IHN0YXR1cy5uZXh0KHNOb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzbCAmJiBzcikge1xyXG4gICAgICAgICAgICAgICAgZmluZE5ld0V2ZW50KHNsLmtleSwgc3Iua2V5LCBwb2ludCwgb3V0cHV0LCBxdWV1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN0YXR1cy5yZW1vdmUocyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgVUNwID0gW10uY29uY2F0KFVwLCBDcCkuc29ydCh1dGlscy5jb21wYXJlU2VnbWVudHMpLFxyXG4gICAgICAgICAgICBVQ3BtaW4gPSBVQ3BbMF0sXHJcbiAgICAgICAgICAgIHNsbE5vZGUgPSBzdGF0dXMuZmluZChVQ3BtaW4pLFxyXG4gICAgICAgICAgICBVQ3BtYXggPSBVQ3BbVUNwLmxlbmd0aC0xXSxcclxuICAgICAgICAgICAgc3JyTm9kZSA9IHN0YXR1cy5maW5kKFVDcG1heCksXHJcbiAgICAgICAgICAgIHNsbCA9IHNsbE5vZGUgJiYgc3RhdHVzLnByZXYoc2xsTm9kZSksXHJcbiAgICAgICAgICAgIHNyciA9IHNyck5vZGUgJiYgc3RhdHVzLm5leHQoc3JyTm9kZSk7XHJcblxyXG4gICAgICAgIGlmIChzbGwgJiYgVUNwbWluKSB7XHJcbiAgICAgICAgICAgIGZpbmROZXdFdmVudChzbGwua2V5LCBVQ3BtaW4sIHBvaW50LCBvdXRwdXQsIHF1ZXVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzcnIgJiYgVUNwbWF4KSB7XHJcbiAgICAgICAgICAgIGZpbmROZXdFdmVudChzcnIua2V5LCBVQ3BtYXgsIHBvaW50LCBvdXRwdXQsIHF1ZXVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTHAubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgc3RhdHVzLnJlbW92ZShMcFtqXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZE5ld0V2ZW50KHNsLCBzciwgcG9pbnQsIG91dHB1dCwgcXVldWUpIHtcclxuICAgIHZhciBpbnRlcnNlY3Rpb25Db29yZHMgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2wsIHNyKSxcclxuICAgICAgICBpbnRlcnNlY3Rpb25Qb2ludDtcclxuXHJcbiAgICBpZiAoaW50ZXJzZWN0aW9uQ29vcmRzKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3BvaW50Jyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocG9pbnQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbnRlcnNlY3Rpb25Db29yZHMnKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpbnRlcnNlY3Rpb25Db29yZHMpO1xyXG4gICAgICAgIGludGVyc2VjdGlvblBvaW50ID0gbmV3IFBvaW50KGludGVyc2VjdGlvbkNvb3JkcywgJ2ludGVyc2VjdGlvbicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvdXRwdXQuaW5zZXJ0IGZyb20gc2Vjb25kJyk7XHJcblxyXG4gICAgICAgIHF1ZXVlLmluc2VydChpbnRlcnNlY3Rpb25Qb2ludCwgaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgIG91dHB1dC5pbnNlcnQoaW50ZXJzZWN0aW9uUG9pbnQsIGludGVyc2VjdGlvblBvaW50KTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xyXG4iXX0=
