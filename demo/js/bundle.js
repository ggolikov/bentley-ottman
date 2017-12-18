(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.findIntersections = require('../../index');
var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}),
    point = L.latLng([55.753210, 37.621766]),
    lmap = new L.Map('map', { layers: [osm], center: point, zoom: 11, maxZoom: 22 }),
    root = document.getElementById('content'),
    generateButton = document.getElementsByClassName('generate')[0],
    linesNumberButton = document.getElementsByClassName('segments-number')[0],
    markers,
    lines;

function drawLines() {
    if (markers) {
        lmap.removeLayer(markers);
    }

    if (lines) {
        lmap.removeLayer(lines);
    }

    var bounds = lmap.getBounds(),
        n = bounds._northEast.lat,
        e = bounds._northEast.lng,
        s = bounds._southWest.lat,
        w = bounds._southWest.lng,
        height = n - s,
        width = e - w,
        qHeight = height / 4,
        qWidth = width / 4,
        data = [],
        ps,
        points,
        coords;

    points = turf.randomPoint(linesNumberButton.value * 2, {
        bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
    });

    coords = points.features.map(function (feature) {
        return feature.geometry.coordinates;
    });

    for (var i = 0; i < coords.length; i += 2) {
        data.push([coords[i], coords[i + 1]]);
    }

    markers = L.layerGroup().addTo(lmap);

    ps = findIntersections(data);
    ps.forEach(function (p) {
        markers.addLayer(L.circleMarker(L.latLng(p.slice().reverse()), { radius: 5, color: 'blue', fillColor: 'blue' }).bindPopup(p[0] + '\n ' + p[1]));
    });

    lines = L.layerGroup().addTo(lmap);

    data.forEach(function (line) {
        var begin = line[0].slice().reverse(),
            end = line[1].slice().reverse();

        lines.addLayer(L.circleMarker(L.latLng(begin), { radius: 2, fillColor: "#FFFF00", weight: 2 }));
        lines.addLayer(L.circleMarker(L.latLng(end), { radius: 2, fillColor: "#FFFF00", weight: 2 }));
        lines.addLayer(L.polyline([begin, end], { weight: 1 }));
    });
}

generateButton.onclick = drawLines;

drawLines();

},{"../../index":2}],2:[function(require,module,exports){
var findIntersections = require('./src/findIntersections.js');

module.exports = findIntersections;

},{"./src/findIntersections.js":4}],3:[function(require,module,exports){
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


},{}],4:[function(require,module,exports){
var Tree = require('avl'),
    Sweepline = require('./sweepline'),
    Point = require('./point'),
    utils = require('./geometry/geometry');

/**
* @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
*/
function findIntersections(segments, map) {
    var sweepline = new Sweepline('before'),
        queue = new Tree(utils.comparePoints, true),
        status = new Tree(utils.compareSegments.bind(sweepline), true),
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

    while (!queue.isEmpty()) {
        var point = queue.pop();
        handleEventPoint(point.key, status, output, queue, sweepline, map);
    }

    return output.keys().map(function (key) {
        return [key.x, key.y];
    });
}

function handleEventPoint(point, status, output, queue, sweepline, map) {
    sweepline.setPosition('before');
    sweepline.setX(point.x);

    var Up = point.segments,
        // segments, for which this is the left end
    Lp = [],
        // segments, for which this is the right end
    Cp = []; // // segments, for which this is an inner point

    // step 2
    status.forEach(function (node) {
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

        if (!output.contains(intersectionPoint)) {
            queue.insert(intersectionPoint, intersectionPoint);
        }

        output.insert(intersectionPoint, intersectionPoint);
    }
}

module.exports = findIntersections;

},{"./geometry/geometry":5,"./point":6,"./sweepline":7,"avl":3}],5:[function(require,module,exports){
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

/**
 * @param a segment1
 * @param b segment2
 */
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

/**
 * @param a segment1
 * @param b segment2
 */
function compareSegments(a, b) {
    var x1 = a[0][0],
        y1 = a[0][1],
        x2 = a[1][0],
        y2 = a[1][1],
        x3 = b[0][0],
        y3 = b[0][1],
        x4 = b[1][0],
        y4 = b[1][1];

    var currentX, ay, by, deltaY, deltaX1, deltaX2;

    if (a === b) {
        return 0;
    }

    currentX = this.x;
    ay = getY(a, currentX);
    by = getY(b, currentX);
    deltaY = ay - by;

    if (Math.abs(deltaY) > EPS) {
        return deltaY < 0 ? -1 : 1;
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
    deltaX1 = x1 - x3;

    if (deltaX1 !== 0) {
        return deltaX1 < 0 ? -1 : 1;
    }

    deltaX2 = x2 - x4;

    if (deltaX2 !== 0) {
        return deltaX2 < 0 ? -1 : 1;
    }

    return 0;
};

/**
 * @param a point1
 * @param b point2
 */
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
        deltaX1,
        ifac,
        fac;

    if (x <= begin[0]) {
        return begin[1];
    } else if (x >= end[0]) {
        return end[1];
    }

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxqc1xcYXBwLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXZsL2Rpc3QvYXZsLmpzIiwic3JjXFxmaW5kSW50ZXJzZWN0aW9ucy5qcyIsInNyY1xcZ2VvbWV0cnlcXGdlb21ldHJ5LmpzIiwic3JjXFxwb2ludC5qcyIsInNyY1xcc3dlZXBsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBTyxpQkFBUCxHQUEyQixRQUFRLGFBQVIsQ0FBM0I7QUFDQSxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxPQUFPLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJDLEVBQXlDLFNBQVMsRUFBbEQsRUFBakIsQ0FMWDtBQUFBLElBTUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FOWDtBQUFBLElBT0ksaUJBQWlCLFNBQVMsc0JBQVQsQ0FBZ0MsVUFBaEMsRUFBNEMsQ0FBNUMsQ0FQckI7QUFBQSxJQVFJLG9CQUFvQixTQUFTLHNCQUFULENBQWdDLGlCQUFoQyxFQUFtRCxDQUFuRCxDQVJ4QjtBQUFBLElBU0ksT0FUSjtBQUFBLElBU2EsS0FUYjs7QUFXQSxTQUFTLFNBQVQsR0FBcUI7QUFDakIsUUFBSSxPQUFKLEVBQWE7QUFDVCxhQUFLLFdBQUwsQ0FBaUIsT0FBakI7QUFDSDs7QUFFRCxRQUFJLEtBQUosRUFBVztBQUNQLGFBQUssV0FBTCxDQUFpQixLQUFqQjtBQUNIOztBQUVELFFBQUksU0FBUyxL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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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RkQ7QUFHQSxVQUFVLFNBQVYsQ0FBb0IsSUFBcEIsR0FBMkIsVUFBVSxDQUFWLEVBQWE7QUFDcEMsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNILENBRkQ7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5maW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XHJcbnZhciBvc20gPSBMLnRpbGVMYXllcignaHR0cDovL3tzfS5iYXNlbWFwcy5jYXJ0b2Nkbi5jb20vbGlnaHRfbm9sYWJlbHMve3p9L3t4fS97eX0ucG5nJywge1xyXG4gICAgICAgIG1heFpvb206IDIyLFxyXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5vcmdcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+J1xyXG4gICAgfSksXHJcbiAgICBwb2ludCA9IEwubGF0TG5nKFs1NS43NTMyMTAsIDM3LjYyMTc2Nl0pLFxyXG4gICAgbG1hcCA9IG5ldyBMLk1hcCgnbWFwJywge2xheWVyczogW29zbV0sIGNlbnRlcjogcG9pbnQsIHpvb206IDExLCBtYXhab29tOiAyMn0pLFxyXG4gICAgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JyksXHJcbiAgICBnZW5lcmF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2dlbmVyYXRlJylbMF0sXHJcbiAgICBsaW5lc051bWJlckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlZ21lbnRzLW51bWJlcicpWzBdLFxyXG4gICAgbWFya2VycywgbGluZXM7XHJcblxyXG5mdW5jdGlvbiBkcmF3TGluZXMoKSB7XHJcbiAgICBpZiAobWFya2Vycykge1xyXG4gICAgICAgIGxtYXAucmVtb3ZlTGF5ZXIobWFya2Vycyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxpbmVzKSB7XHJcbiAgICAgICAgbG1hcC5yZW1vdmVMYXllcihsaW5lcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJvdW5kcyA9IGxtYXAuZ2V0Qm91bmRzKCksXHJcbiAgICAgICAgbiA9IGJvdW5kcy5fbm9ydGhFYXN0LmxhdCxcclxuICAgICAgICBlID0gYm91bmRzLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgICAgIHMgPSBib3VuZHMuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICAgICAgdyA9IGJvdW5kcy5fc291dGhXZXN0LmxuZyxcclxuICAgICAgICBoZWlnaHQgPSBuIC0gcyxcclxuICAgICAgICB3aWR0aCA9IGUgLSB3LFxyXG4gICAgICAgIHFIZWlnaHQgPSBoZWlnaHQgLyA0LFxyXG4gICAgICAgIHFXaWR0aCA9IHdpZHRoIC8gNCxcclxuICAgICAgICBkYXRhID0gW10sXHJcbiAgICAgICAgcHMsXHJcbiAgICAgICAgcG9pbnRzLFxyXG4gICAgICAgIGNvb3JkcztcclxuXHJcbiAgICBwb2ludHMgPSB0dXJmLnJhbmRvbVBvaW50KGxpbmVzTnVtYmVyQnV0dG9uLnZhbHVlICogMiwge1xyXG4gICAgICAgIGJib3g6IFt3ICsgcVdpZHRoLCBzICsgcUhlaWdodCwgZSAtIHFXaWR0aCwgbiAtIHFIZWlnaHRdXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb29yZHMgPSBwb2ludHMuZmVhdHVyZXMubWFwKGZ1bmN0aW9uKGZlYXR1cmUpIHtcclxuICAgICAgICByZXR1cm4gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcclxuICAgIH0pXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgZGF0YS5wdXNoKFtjb29yZHNbaV0sIGNvb3Jkc1tpKzFdXSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFya2VycyA9IEwubGF5ZXJHcm91cCgpLmFkZFRvKGxtYXApO1xyXG5cclxuICAgIHBzID0gZmluZEludGVyc2VjdGlvbnMoZGF0YSk7XHJcbiAgICBwcy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgbWFya2Vycy5hZGRMYXllcihMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKSwge3JhZGl1czogNSwgY29sb3I6ICdibHVlJywgZmlsbENvbG9yOiAnYmx1ZSd9KS5iaW5kUG9wdXAocFswXSArICdcXG4gJyArIHBbMV0pKTtcclxuICAgIH0pXHJcblxyXG4gICAgbGluZXMgPSBMLmxheWVyR3JvdXAoKS5hZGRUbyhsbWFwKTtcclxuXHJcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcclxuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLnNsaWNlKCkucmV2ZXJzZSgpLFxyXG4gICAgICAgIGVuZCA9IGxpbmVbMV0uc2xpY2UoKS5yZXZlcnNlKCk7XHJcblxyXG4gICAgICAgIGxpbmVzLmFkZExheWVyKEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGJlZ2luKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkpO1xyXG4gICAgICAgIGxpbmVzLmFkZExheWVyKEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGVuZCksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pKTtcclxuICAgICAgICBsaW5lcy5hZGRMYXllcihMLnBvbHlsaW5lKFtiZWdpbiwgZW5kXSwge3dlaWdodDogMX0pKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5nZW5lcmF0ZUJ1dHRvbi5vbmNsaWNrID0gZHJhd0xpbmVzO1xyXG5cclxuZHJhd0xpbmVzKCk7XHJcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4vc3JjL2ZpbmRJbnRlcnNlY3Rpb25zLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuYXZsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFByaW50cyB0cmVlIGhvcml6b250YWxseVxuICogQHBhcmFtICB7Tm9kZX0gICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSBbcHJpbnROb2RlXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBwcmludCAocm9vdCwgcHJpbnROb2RlKSB7XG4gIGlmICggcHJpbnROb2RlID09PSB2b2lkIDAgKSBwcmludE5vZGUgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbi5rZXk7IH07XG5cbiAgdmFyIG91dCA9IFtdO1xuICByb3cocm9vdCwgJycsIHRydWUsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBvdXQucHVzaCh2KTsgfSwgcHJpbnROb2RlKTtcbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBQcmludHMgbGV2ZWwgb2YgdGhlIHRyZWVcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICBwcmVmaXhcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgaXNUYWlsXG4gKiBAcGFyYW0gIHtGdW5jdGlvbihpbjpzdHJpbmcpOnZvaWR9ICAgIG91dFxuICogQHBhcmFtICB7RnVuY3Rpb24obm9kZTpOb2RlKTpTdHJpbmd9ICBwcmludE5vZGVcbiAqL1xuZnVuY3Rpb24gcm93IChyb290LCBwcmVmaXgsIGlzVGFpbCwgb3V0LCBwcmludE5vZGUpIHtcbiAgaWYgKHJvb3QpIHtcbiAgICBvdXQoKFwiXCIgKyBwcmVmaXggKyAoaXNUYWlsID8gJ+KUlOKUgOKUgCAnIDogJ+KUnOKUgOKUgCAnKSArIChwcmludE5vZGUocm9vdCkpICsgXCJcXG5cIikpO1xuICAgIHZhciBpbmRlbnQgPSBwcmVmaXggKyAoaXNUYWlsID8gJyAgICAnIDogJ+KUgiAgICcpO1xuICAgIGlmIChyb290LmxlZnQpICB7IHJvdyhyb290LmxlZnQsICBpbmRlbnQsIGZhbHNlLCBvdXQsIHByaW50Tm9kZSk7IH1cbiAgICBpZiAocm9vdC5yaWdodCkgeyByb3cocm9vdC5yaWdodCwgaW5kZW50LCB0cnVlLCAgb3V0LCBwcmludE5vZGUpOyB9XG4gIH1cbn1cblxuXG4vKipcbiAqIElzIHRoZSB0cmVlIGJhbGFuY2VkIChub25lIG9mIHRoZSBzdWJ0cmVlcyBkaWZmZXIgaW4gaGVpZ2h0IGJ5IG1vcmUgdGhhbiAxKVxuICogQHBhcmFtICB7Tm9kZX0gICAgcm9vdFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNCYWxhbmNlZChyb290KSB7XG4gIGlmIChyb290ID09PSBudWxsKSB7IHJldHVybiB0cnVlOyB9IC8vIElmIG5vZGUgaXMgZW1wdHkgdGhlbiByZXR1cm4gdHJ1ZVxuXG4gIC8vIEdldCB0aGUgaGVpZ2h0IG9mIGxlZnQgYW5kIHJpZ2h0IHN1YiB0cmVlc1xuICB2YXIgbGggPSBoZWlnaHQocm9vdC5sZWZ0KTtcbiAgdmFyIHJoID0gaGVpZ2h0KHJvb3QucmlnaHQpO1xuXG4gIGlmIChNYXRoLmFicyhsaCAtIHJoKSA8PSAxICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QubGVmdCkgICYmXG4gICAgICBpc0JhbGFuY2VkKHJvb3QucmlnaHQpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgLy8gSWYgd2UgcmVhY2ggaGVyZSB0aGVuIHRyZWUgaXMgbm90IGhlaWdodC1iYWxhbmNlZFxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGZ1bmN0aW9uIENvbXB1dGUgdGhlICdoZWlnaHQnIG9mIGEgdHJlZS5cbiAqIEhlaWdodCBpcyB0aGUgbnVtYmVyIG9mIG5vZGVzIGFsb25nIHRoZSBsb25nZXN0IHBhdGhcbiAqIGZyb20gdGhlIHJvb3Qgbm9kZSBkb3duIHRvIHRoZSBmYXJ0aGVzdCBsZWFmIG5vZGUuXG4gKlxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBoZWlnaHQobm9kZSkge1xuICByZXR1cm4gbm9kZSA/ICgxICsgTWF0aC5tYXgoaGVpZ2h0KG5vZGUubGVmdCksIGhlaWdodChub2RlLnJpZ2h0KSkpIDogMDtcbn1cblxuLy8gZnVuY3Rpb24gY3JlYXRlTm9kZSAocGFyZW50LCBsZWZ0LCByaWdodCwgaGVpZ2h0LCBrZXksIGRhdGEpIHtcbi8vICAgcmV0dXJuIHsgcGFyZW50LCBsZWZ0LCByaWdodCwgYmFsYW5jZUZhY3RvcjogaGVpZ2h0LCBrZXksIGRhdGEgfTtcbi8vIH1cblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBwYXJlbnQ6ICAgICAgICBOb2RlfE51bGwsXG4gKiAgIGxlZnQ6ICAgICAgICAgIE5vZGV8TnVsbCxcbiAqICAgcmlnaHQ6ICAgICAgICAgTm9kZXxOdWxsLFxuICogICBiYWxhbmNlRmFjdG9yOiBOdW1iZXIsXG4gKiAgIGtleTogICAgICAgICAgIGFueSxcbiAqICAgZGF0YTogICAgICAgICAgb2JqZWN0P1xuICogfX0gTm9kZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeyp9IEtleVxuICovXG5cbi8qKlxuICogRGVmYXVsdCBjb21wYXJpc29uIGZ1bmN0aW9uXG4gKiBAcGFyYW0geyp9IGFcbiAqIEBwYXJhbSB7Kn0gYlxuICovXG5mdW5jdGlvbiBERUZBVUxUX0NPTVBBUkUgKGEsIGIpIHsgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwOyB9XG5cblxuLyoqXG4gKiBTaW5nbGUgbGVmdCByb3RhdGlvblxuICogQHBhcmFtICB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuZnVuY3Rpb24gcm90YXRlTGVmdCAobm9kZSkge1xuICB2YXIgcmlnaHROb2RlID0gbm9kZS5yaWdodDtcbiAgbm9kZS5yaWdodCAgICA9IHJpZ2h0Tm9kZS5sZWZ0O1xuXG4gIGlmIChyaWdodE5vZGUubGVmdCkgeyByaWdodE5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgcmlnaHROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAocmlnaHROb2RlLnBhcmVudCkge1xuICAgIGlmIChyaWdodE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQubGVmdCA9IHJpZ2h0Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmlnaHROb2RlLnBhcmVudC5yaWdodCA9IHJpZ2h0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IHJpZ2h0Tm9kZTtcbiAgcmlnaHROb2RlLmxlZnQgPSBub2RlO1xuXG4gIG5vZGUuYmFsYW5jZUZhY3RvciArPSAxO1xuICBpZiAocmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKG5vZGUuYmFsYW5jZUZhY3RvciA+IDApIHtcbiAgICByaWdodE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cbiAgcmV0dXJuIHJpZ2h0Tm9kZTtcbn1cblxuXG5mdW5jdGlvbiByb3RhdGVSaWdodCAobm9kZSkge1xuICB2YXIgbGVmdE5vZGUgPSBub2RlLmxlZnQ7XG4gIG5vZGUubGVmdCA9IGxlZnROb2RlLnJpZ2h0O1xuICBpZiAobm9kZS5sZWZ0KSB7IG5vZGUubGVmdC5wYXJlbnQgPSBub2RlOyB9XG5cbiAgbGVmdE5vZGUucGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIGlmIChsZWZ0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobGVmdE5vZGUucGFyZW50LmxlZnQgPT09IG5vZGUpIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5sZWZ0ID0gbGVmdE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnROb2RlLnBhcmVudC5yaWdodCA9IGxlZnROb2RlO1xuICAgIH1cbiAgfVxuXG4gIG5vZGUucGFyZW50ICAgID0gbGVmdE5vZGU7XG4gIGxlZnROb2RlLnJpZ2h0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgLT0gMTtcbiAgaWYgKGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IGxlZnROb2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPCAwKSB7XG4gICAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciArPSBub2RlLmJhbGFuY2VGYWN0b3I7XG4gIH1cblxuICByZXR1cm4gbGVmdE5vZGU7XG59XG5cblxuLy8gZnVuY3Rpb24gbGVmdEJhbGFuY2UgKG5vZGUpIHtcbi8vICAgaWYgKG5vZGUubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgcm90YXRlTGVmdChub2RlLmxlZnQpO1xuLy8gICByZXR1cm4gcm90YXRlUmlnaHQobm9kZSk7XG4vLyB9XG5cblxuLy8gZnVuY3Rpb24gcmlnaHRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHJvdGF0ZVJpZ2h0KG5vZGUucmlnaHQpO1xuLy8gICByZXR1cm4gcm90YXRlTGVmdChub2RlKTtcbi8vIH1cblxuXG52YXIgVHJlZSA9IGZ1bmN0aW9uIFRyZWUgKGNvbXBhcmF0b3IpIHtcbiAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3IgfHwgREVGQVVMVF9DT01QQVJFO1xuICB0aGlzLl9yb290ID0gbnVsbDtcbiAgdGhpcy5fc2l6ZSA9IDA7XG59O1xuXG52YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyBzaXplOiB7fSB9O1xuXG5cbi8qKlxuICogQ2xlYXIgdGhlIHRyZWVcbiAqL1xuVHJlZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3kgKCkge1xuICB0aGlzLl9yb290ID0gbnVsbDtcbn07XG5cbi8qKlxuICogTnVtYmVyIG9mIG5vZGVzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbnByb3RvdHlwZUFjY2Vzc29ycy5zaXplLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX3NpemU7XG59O1xuXG5cbi8qKlxuICogV2hldGhlciB0aGUgdHJlZSBjb250YWlucyBhIG5vZGUgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMgKGtleSkge1xuICBpZiAodGhpcy5fcm9vdCl7XG4gICAgdmFyIG5vZGUgICAgID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gICAgd2hpbGUgKG5vZGUpe1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3Ioa2V5LCBub2RlLmtleSk7XG4gICAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICAgIGVsc2UgICAgICAgICAgICAgIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cbi8qKlxuICogU3VjY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiBuZXh0IChub2RlKSB7XG4gIHZhciBzdWNjZXNzb3IgPSBub2RlO1xuICBpZiAoc3VjY2Vzc29yKSB7XG4gICAgaWYgKHN1Y2Nlc3Nvci5yaWdodCkge1xuICAgICAgc3VjY2Vzc29yID0gc3VjY2Vzc29yLnJpZ2h0O1xuICAgICAgd2hpbGUgKHN1Y2Nlc3NvciAmJiBzdWNjZXNzb3IubGVmdCkgeyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IubGVmdDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZXNzb3IgPSBub2RlLnBhcmVudDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLnJpZ2h0ID09PSBub2RlKSB7XG4gICAgICAgIG5vZGUgPSBzdWNjZXNzb3I7IHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWNjZXNzb3I7XG59O1xuXG5cbi8qKlxuICogUHJlZGVjZXNzb3Igbm9kZVxuICogQHBhcmFte05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uIHByZXYgKG5vZGUpIHtcbiAgdmFyIHByZWRlY2Vzc29yID0gbm9kZTtcbiAgaWYgKHByZWRlY2Vzc29yKSB7XG4gICAgaWYgKHByZWRlY2Vzc29yLmxlZnQpIHtcbiAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IubGVmdDtcbiAgICAgIHdoaWxlIChwcmVkZWNlc3NvciAmJiBwcmVkZWNlc3Nvci5yaWdodCkgeyBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnJpZ2h0OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWRlY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IubGVmdCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gcHJlZGVjZXNzb3I7XG4gICAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcHJlZGVjZXNzb3I7XG59O1xuLyogZXNsaW50LWVuYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXG5cblxuLyoqXG4gKiBAcGFyYW17RnVuY3Rpb24obm9kZTpOb2RlKTp2b2lkfSBmblxuICogQHJldHVybiB7QVZMVHJlZX1cbiAqL1xuVHJlZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2ggKGZuKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgZG9uZSA9IGZhbHNlLCBpID0gMDtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICAvLyBSZWFjaCB0aGUgbGVmdCBtb3N0IE5vZGUgb2YgdGhlIGN1cnJlbnQgTm9kZVxuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICAvLyBQbGFjZSBwb2ludGVyIHRvIGEgdHJlZSBub2RlIG9uIHRoZSBzdGFja1xuICAgICAgLy8gYmVmb3JlIHRyYXZlcnNpbmcgdGhlIG5vZGUncyBsZWZ0IHN1YnRyZWVcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJhY2tUcmFjayBmcm9tIHRoZSBlbXB0eSBzdWJ0cmVlIGFuZCB2aXNpdCB0aGUgTm9kZVxuICAgICAgLy8gYXQgdGhlIHRvcCBvZiB0aGUgc3RhY2s7IGhvd2V2ZXIsIGlmIHRoZSBzdGFjayBpc1xuICAgICAgLy8gZW1wdHkgeW91IGFyZSBkb25lXG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICBmbihjdXJyZW50LCBpKyspO1xuXG4gICAgICAgIC8vIFdlIGhhdmUgdmlzaXRlZCB0aGUgbm9kZSBhbmQgaXRzIGxlZnRcbiAgICAgICAgLy8gc3VidHJlZS4gTm93LCBpdCdzIHJpZ2h0IHN1YnRyZWUncyB0dXJuXG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBhbGwga2V5cyBpbiBvcmRlclxuICogQHJldHVybiB7QXJyYXk8S2V5Pn1cbiAqL1xuVHJlZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uIGtleXMgKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIHIgPSBbXSwgZG9uZSA9IGZhbHNlO1xuXG4gIHdoaWxlICghZG9uZSkge1xuICAgIGlmIChjdXJyZW50KSB7XG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN1cnJlbnQgPSBzLnBvcCgpO1xuICAgICAgICByLnB1c2goY3VycmVudC5rZXkpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYGRhdGFgIGZpZWxkcyBvZiBhbGwgbm9kZXMgaW4gb3JkZXIuXG4gKiBAcmV0dXJuIHtBcnJheTwqPn1cbiAqL1xuVHJlZS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gdmFsdWVzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQuZGF0YSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyBub2RlIHdpdGggdGhlIG1pbmltdW0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1pbk5vZGUgPSBmdW5jdGlvbiBtaW5Ob2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtYXgga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1heE5vZGUgPSBmdW5jdGlvbiBtYXhOb2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8qKlxuICogTWluIGtleVxuICogQHJldHVybiB7S2V5fVxuICovXG5UcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiBtaW4gKCkge1xuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuLyoqXG4gKiBNYXgga2V5XG4gKiBAcmV0dXJuIHtLZXl8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gbWF4ICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUucmlnaHQpIHsgbm9kZSA9IG5vZGUucmlnaHQ7IH1cbiAgcmV0dXJuIG5vZGUua2V5O1xufTtcblxuXG4vKipcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5ICgpIHtcbiAgcmV0dXJuICF0aGlzLl9yb290O1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG5vZGUgd2l0aCBzbWFsbGVzdCBrZXlcbiAqIEByZXR1cm4ge05vZGV8TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290LCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gIGlmIChub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgcmV0dXJuVmFsdWUgPSB7IGtleTogbm9kZS5rZXksIGRhdGE6IG5vZGUuZGF0YSB9O1xuICAgIHRoaXMucmVtb3ZlKG5vZGUua2V5KTtcbiAgfVxuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cbi8qKlxuICogRmluZCBub2RlIGJ5IGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiBmaW5kIChrZXkpIHtcbiAgdmFyIHJvb3QgPSB0aGlzLl9yb290O1xuICBpZiAocm9vdCA9PT0gbnVsbCkgIHsgcmV0dXJuIG51bGw7IH1cbiAgaWYgKGtleSA9PT0gcm9vdC5rZXkpIHsgcmV0dXJuIHJvb3Q7IH1cblxuICB2YXIgc3VidHJlZSA9IHJvb3QsIGNtcDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB3aGlsZSAoc3VidHJlZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBzdWJ0cmVlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gc3VidHJlZTsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgc3VidHJlZSA9IHN1YnRyZWUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgc3VidHJlZSA9IHN1YnRyZWUucmlnaHQ7IH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuXG4vKipcbiAqIEluc2VydCBhIG5vZGUgaW50byB0aGUgdHJlZVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcGFyYW17Kn0gW2RhdGFdXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCAoa2V5LCBkYXRhKSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7XG4gICAgdGhpcy5fcm9vdCA9IHtcbiAgICAgIHBhcmVudDogbnVsbCwgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgICBrZXk6IGtleSwgZGF0YTogZGF0YVxuICAgIH07XG4gICAgdGhpcy5fc2l6ZSsrO1xuICAgIHJldHVybiB0aGlzLl9yb290O1xuICB9XG5cbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB2YXIgbm9kZSAgPSB0aGlzLl9yb290O1xuICB2YXIgcGFyZW50PSBudWxsO1xuICB2YXIgY21wICAgPSAwO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBwYXJlbnQgPSBub2RlO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cblxuICB2YXIgbmV3Tm9kZSA9IHtcbiAgICBsZWZ0OiBudWxsLCByaWdodDogbnVsbCwgYmFsYW5jZUZhY3RvcjogMCxcbiAgICBwYXJlbnQ6IHBhcmVudCwga2V5OiBrZXksIGRhdGE6IGRhdGEsXG4gIH07XG4gIGlmIChjbXAgPCAwKSB7IHBhcmVudC5sZWZ0PSBuZXdOb2RlOyB9XG4gIGVsc2UgICAgICAgeyBwYXJlbnQucmlnaHQgPSBuZXdOb2RlOyB9XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChjb21wYXJlKHBhcmVudC5rZXksIGtleSkgPCAwKSB7IHBhcmVudC5iYWxhbmNlRmFjdG9yIC09IDE7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA8IC0xKSB7XG4gICAgICAvL2xldCBuZXdSb290ID0gcmlnaHRCYWxhbmNlKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50LnJpZ2h0LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgcm90YXRlUmlnaHQocGFyZW50LnJpZ2h0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QgPSByb3RhdGVMZWZ0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290OyB9XG4gICAgICBicmVhaztcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gbGV0IG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCQxID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3QkMTsgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICB0aGlzLl9zaXplKys7XG4gIHJldHVybiBuZXdOb2RlO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZXMgdGhlIG5vZGUgZnJvbSB0aGUgdHJlZS4gSWYgbm90IGZvdW5kLCByZXR1cm5zIG51bGwuXG4gKiBAcGFyYW17S2V5fSBrZXlcbiAqIEByZXR1cm4ge05vZGU6TnVsbH1cbiAqL1xuVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrZXkpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIHZhciBjbXAgPSBjb21wYXJlKGtleSwgbm9kZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgYnJlYWs7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIH1cbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHZhciByZXR1cm5WYWx1ZSA9IG5vZGUua2V5O1xuXG4gIGlmIChub2RlLmxlZnQpIHtcbiAgICB2YXIgbWF4ID0gbm9kZS5sZWZ0O1xuXG4gICAgd2hpbGUgKG1heC5sZWZ0IHx8IG1heC5yaWdodCkge1xuICAgICAgd2hpbGUgKG1heC5yaWdodCkgeyBtYXggPSBtYXgucmlnaHQ7IH1cblxuICAgICAgbm9kZS5rZXkgPSBtYXgua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgICBpZiAobWF4LmxlZnQpIHtcbiAgICAgICAgbm9kZSA9IG1heDtcbiAgICAgICAgbWF4ID0gbWF4LmxlZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZS5rZXk9IG1heC5rZXk7XG4gICAgbm9kZS5kYXRhID0gbWF4LmRhdGE7XG4gICAgbm9kZSA9IG1heDtcbiAgfVxuXG4gIGlmIChub2RlLnJpZ2h0KSB7XG4gICAgdmFyIG1pbiA9IG5vZGUucmlnaHQ7XG5cbiAgICB3aGlsZSAobWluLmxlZnQgfHwgbWluLnJpZ2h0KSB7XG4gICAgICB3aGlsZSAobWluLmxlZnQpIHsgbWluID0gbWluLmxlZnQ7IH1cblxuICAgICAgbm9kZS5rZXk9IG1pbi5rZXk7XG4gICAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICAgIGlmIChtaW4ucmlnaHQpIHtcbiAgICAgICAgbm9kZSA9IG1pbjtcbiAgICAgICAgbWluID0gbWluLnJpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1pbi5kYXRhO1xuICAgIG5vZGUgPSBtaW47XG4gIH1cblxuICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gIHZhciBwcCAgID0gbm9kZTtcblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgaWYgKHBhcmVudC5sZWZ0ID09PSBwcCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgKz0gMTsgfVxuXG4gICAgaWYgICAgICAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy9sZXQgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIHZhciBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdDtcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5iYWxhbmNlRmFjdG9yID4gMSkge1xuICAgICAgLy8gbGV0IG5ld1Jvb3QgPSBsZWZ0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5sZWZ0LmJhbGFuY2VGYWN0b3IgPT09IC0xKSB7IHJvdGF0ZUxlZnQocGFyZW50LmxlZnQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCQxID0gcm90YXRlUmlnaHQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3QkMTsgfVxuICAgICAgcGFyZW50ID0gbmV3Um9vdCQxO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA9PT0gLTEgfHwgcGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IDEpIHsgYnJlYWs7IH1cblxuICAgIHBwICAgPSBwYXJlbnQ7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxuXG4gIGlmIChub2RlLnBhcmVudCkge1xuICAgIGlmIChub2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7IG5vZGUucGFyZW50LmxlZnQ9IG51bGw7IH1cbiAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgIHsgbm9kZS5wYXJlbnQucmlnaHQgPSBudWxsOyB9XG4gIH1cblxuICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkgeyB0aGlzLl9yb290ID0gbnVsbDsgfVxuXG4gIHRoaXMuX3NpemUtLTtcbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHJlZSBpcyBiYWxhbmNlZFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVHJlZS5wcm90b3R5cGUuaXNCYWxhbmNlZCA9IGZ1bmN0aW9uIGlzQmFsYW5jZWQkMSAoKSB7XG4gIHJldHVybiBpc0JhbGFuY2VkKHRoaXMuX3Jvb3QpO1xufTtcblxuXG4vKipcbiAqIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJlZSAtIHByaW1pdGl2ZSBob3Jpem9udGFsIHByaW50LW91dFxuICogQHBhcmFte0Z1bmN0aW9uKE5vZGUpOlN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuVHJlZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAocHJpbnROb2RlKSB7XG4gIHJldHVybiBwcmludCh0aGlzLl9yb290LCBwcmludE5vZGUpO1xufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIFRyZWUucHJvdG90eXBlLCBwcm90b3R5cGVBY2Nlc3NvcnMgKTtcblxucmV0dXJuIFRyZWU7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdmwuanMubWFwXG4iLCJ2YXIgVHJlZSA9IHJlcXVpcmUoJ2F2bCcpLFxyXG4gICAgU3dlZXBsaW5lID0gcmVxdWlyZSgnLi9zd2VlcGxpbmUnKSxcclxuICAgIFBvaW50ID0gcmVxdWlyZSgnLi9wb2ludCcpLFxyXG4gICAgdXRpbHMgPSByZXF1aXJlKCcuL2dlb21ldHJ5L2dlb21ldHJ5Jyk7XHJcblxyXG4vKipcclxuKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50cyBzZXQgb2Ygc2VnbWVudHMgaW50ZXJzZWN0aW5nIHN3ZWVwbGluZSBbW1t4MSwgeTFdLCBbeDIsIHkyXV0gLi4uIFtbeG0sIHltXSwgW3huLCB5bl1dXVxyXG4qL1xyXG5mdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9ucyhzZWdtZW50cywgbWFwKSB7XHJcbiAgICB2YXIgc3dlZXBsaW5lID0gbmV3IFN3ZWVwbGluZSgnYmVmb3JlJyksXHJcbiAgICAgICAgcXVldWUgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlUG9pbnRzLCB0cnVlKSxcclxuICAgICAgICBzdGF0dXMgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlU2VnbWVudHMuYmluZChzd2VlcGxpbmUpLCB0cnVlKSxcclxuICAgICAgICBvdXRwdXQgPSBuZXcgVHJlZSh1dGlscy5jb21wYXJlUG9pbnRzLCB0cnVlKTtcclxuXHJcbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50LCBpLCBhKSB7XHJcbiAgICAgICAgc2VnbWVudC5zb3J0KHV0aWxzLmNvbXBhcmVQb2ludHMpO1xyXG4gICAgICAgIHZhciBiZWdpbiA9IG5ldyBQb2ludChzZWdtZW50WzBdLCAnYmVnaW4nKSxcclxuICAgICAgICAgICAgZW5kID0gbmV3IFBvaW50KHNlZ21lbnRbMV0sICdlbmQnKTtcclxuXHJcbiAgICAgICAgcXVldWUuaW5zZXJ0KGJlZ2luLCBiZWdpbik7XHJcbiAgICAgICAgYmVnaW4gPSBxdWV1ZS5maW5kKGJlZ2luKS5rZXk7XHJcbiAgICAgICAgYmVnaW4uc2VnbWVudHMucHVzaChzZWdtZW50KTtcclxuXHJcbiAgICAgICAgcXVldWUuaW5zZXJ0KGVuZCwgZW5kKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICB3aGlsZSAoIXF1ZXVlLmlzRW1wdHkoKSkge1xyXG4gICAgICAgIHZhciBwb2ludCA9IHF1ZXVlLnBvcCgpO1xyXG4gICAgICAgIGhhbmRsZUV2ZW50UG9pbnQocG9pbnQua2V5LCBzdGF0dXMsIG91dHB1dCwgcXVldWUsIHN3ZWVwbGluZSwgbWFwKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3V0cHV0LmtleXMoKS5tYXAoZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICByZXR1cm4gW2tleS54LCBrZXkueV07XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXZlbnRQb2ludChwb2ludCwgc3RhdHVzLCBvdXRwdXQsIHF1ZXVlLCBzd2VlcGxpbmUsIG1hcCkge1xyXG4gICAgc3dlZXBsaW5lLnNldFBvc2l0aW9uKCdiZWZvcmUnKTtcclxuICAgIHN3ZWVwbGluZS5zZXRYKHBvaW50LngpO1xyXG5cclxuICAgIHZhciBVcCA9IHBvaW50LnNlZ21lbnRzLCAvLyBzZWdtZW50cywgZm9yIHdoaWNoIHRoaXMgaXMgdGhlIGxlZnQgZW5kXHJcbiAgICAgICAgTHAgPSBbXSwgICAgICAgICAgICAgLy8gc2VnbWVudHMsIGZvciB3aGljaCB0aGlzIGlzIHRoZSByaWdodCBlbmRcclxuICAgICAgICBDcCA9IFtdOyAgICAgICAgICAgICAvLyAvLyBzZWdtZW50cywgZm9yIHdoaWNoIHRoaXMgaXMgYW4gaW5uZXIgcG9pbnRcclxuXHJcbiAgICAvLyBzdGVwIDJcclxuICAgIHN0YXR1cy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICB2YXIgc2VnbWVudCA9IG5vZGUua2V5LFxyXG4gICAgICAgICAgICBzZWdtZW50QmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgICAgICBzZWdtZW50RW5kID0gc2VnbWVudFsxXTtcclxuXHJcbiAgICAgICAgLy8gY291bnQgcmlnaHQtZW5kc1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhwb2ludC54IC0gc2VnbWVudEVuZFswXSkgPCB1dGlscy5FUFMgJiYgTWF0aC5hYnMocG9pbnQueSAtIHNlZ21lbnRFbmRbMV0pIDwgdXRpbHMuRVBTKSB7XHJcbiAgICAgICAgICAgIExwLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgLy8gY291bnQgaW5uZXIgcG9pbnRzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gZmlsdGVyIGxlZnQgZW5kc1xyXG4gICAgICAgICAgICBpZiAoIShNYXRoLmFicyhwb2ludC54IC0gc2VnbWVudEJlZ2luWzBdKSA8IHV0aWxzLkVQUyAmJiBNYXRoLmFicyhwb2ludC55IC0gc2VnbWVudEJlZ2luWzFdKSA8IHV0aWxzLkVQUykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh1dGlscy5kaXJlY3Rpb24oc2VnbWVudEJlZ2luLCBzZWdtZW50RW5kLCBbcG9pbnQueCwgcG9pbnQueV0pKSA8IHV0aWxzLkVQUyAmJiB1dGlscy5vblNlZ21lbnQoc2VnbWVudEJlZ2luLCBzZWdtZW50RW5kLCBbcG9pbnQueCwgcG9pbnQueV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ3AucHVzaChzZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChbXS5jb25jYXQoVXAsIExwLCBDcCkubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIG91dHB1dC5pbnNlcnQocG9pbnQsIHBvaW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBDcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHN0YXR1cy5yZW1vdmUoQ3Bbal0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgTHAubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAvLyBzdGF0dXMucmVtb3ZlKExwW2tdKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2VlcGxpbmUuc2V0UG9zaXRpb24oJ2FmdGVyJyk7XHJcblxyXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBVcC5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgIGlmICghc3RhdHVzLmNvbnRhaW5zKFVwW2tdKSkge1xyXG4gICAgICAgICAgICBzdGF0dXMuaW5zZXJ0KFVwW2tdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBsID0gMDsgbCA8IENwLmxlbmd0aDsgbCsrKSB7XHJcbiAgICAgICAgaWYgKCFzdGF0dXMuY29udGFpbnMoQ3BbbF0pKSB7XHJcbiAgICAgICAgICAgIHN0YXR1cy5pbnNlcnQoQ3BbbF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoVXAubGVuZ3RoID09PSAwICYmIENwLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBMcFtpXSxcclxuICAgICAgICAgICAgICAgIHNOb2RlID0gc3RhdHVzLmZpbmQocyksXHJcbiAgICAgICAgICAgICAgICBzbCA9IHN0YXR1cy5wcmV2KHNOb2RlKSxcclxuICAgICAgICAgICAgICAgIHNyID0gc3RhdHVzLm5leHQoc05vZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNsICYmIHNyKSB7XHJcbiAgICAgICAgICAgICAgICBmaW5kTmV3RXZlbnQoc2wua2V5LCBzci5rZXksIHBvaW50LCBvdXRwdXQsIHF1ZXVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3RhdHVzLnJlbW92ZShzKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBVQ3AgPSBbXS5jb25jYXQoVXAsIENwKS5zb3J0KHV0aWxzLmNvbXBhcmVTZWdtZW50cyksXHJcbiAgICAgICAgICAgIFVDcG1pbiA9IFVDcFswXSxcclxuICAgICAgICAgICAgc2xsTm9kZSA9IHN0YXR1cy5maW5kKFVDcG1pbiksXHJcbiAgICAgICAgICAgIFVDcG1heCA9IFVDcFtVQ3AubGVuZ3RoLTFdLFxyXG4gICAgICAgICAgICBzcnJOb2RlID0gc3RhdHVzLmZpbmQoVUNwbWF4KSxcclxuICAgICAgICAgICAgc2xsID0gc2xsTm9kZSAmJiBzdGF0dXMucHJldihzbGxOb2RlKSxcclxuICAgICAgICAgICAgc3JyID0gc3JyTm9kZSAmJiBzdGF0dXMubmV4dChzcnJOb2RlKTtcclxuXHJcbiAgICAgICAgaWYgKHNsbCAmJiBVQ3BtaW4pIHtcclxuICAgICAgICAgICAgZmluZE5ld0V2ZW50KHNsbC5rZXksIFVDcG1pbiwgcG9pbnQsIG91dHB1dCwgcXVldWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNyciAmJiBVQ3BtYXgpIHtcclxuICAgICAgICAgICAgZmluZE5ld0V2ZW50KHNyci5rZXksIFVDcG1heCwgcG9pbnQsIG91dHB1dCwgcXVldWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBMcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBzdGF0dXMucmVtb3ZlKExwW2pdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kTmV3RXZlbnQoc2wsIHNyLCBwb2ludCwgb3V0cHV0LCBxdWV1ZSkge1xyXG4gICAgdmFyIGludGVyc2VjdGlvbkNvb3JkcyA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzbCwgc3IpLFxyXG4gICAgICAgIGludGVyc2VjdGlvblBvaW50O1xyXG5cclxuICAgIGlmIChpbnRlcnNlY3Rpb25Db29yZHMpIHtcclxuICAgICAgICBpbnRlcnNlY3Rpb25Qb2ludCA9IG5ldyBQb2ludChpbnRlcnNlY3Rpb25Db29yZHMsICdpbnRlcnNlY3Rpb24nKTtcclxuXHJcbiAgICAgICAgaWYgKCFvdXRwdXQuY29udGFpbnMoaW50ZXJzZWN0aW9uUG9pbnQpKSB7XHJcbiAgICAgICAgICAgIHF1ZXVlLmluc2VydChpbnRlcnNlY3Rpb25Qb2ludCwgaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3V0cHV0Lmluc2VydChpbnRlcnNlY3Rpb25Qb2ludCwgaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xyXG4iLCJ2YXIgRVBTID0gMUUtOTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gYSB2ZWN0b3JcclxuICogQHBhcmFtIGIgdmVjdG9yXHJcbiAqIEBwYXJhbSBjIHZlY3RvclxyXG4gKi9cclxuZnVuY3Rpb24gb25TZWdtZW50KGEsIGIsIGMpIHtcclxuICAgIHZhciB4MSA9IGFbMF0sXHJcbiAgICAgICAgeDIgPSBiWzBdLFxyXG4gICAgICAgIHgzID0gY1swXSxcclxuICAgICAgICB5MSA9IGFbMV0sXHJcbiAgICAgICAgeTIgPSBiWzFdLFxyXG4gICAgICAgIHkzID0gY1sxXTtcclxuXHJcbiAgICByZXR1cm4gKE1hdGgubWluKHgxLCB4MikgPD0geDMpICYmICh4MyA8PSBNYXRoLm1heCh4MSwgeDIpKSAmJlxyXG4gICAgICAgICAgIChNYXRoLm1pbih5MSwgeTIpIDw9IHkzKSAmJiAoeTMgPD0gTWF0aC5tYXgoeTEsIHkyKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBhYyB4IGJjXHJcbiAqIEBwYXJhbSBhIHZlY3RvclxyXG4gKiBAcGFyYW0gYiB2ZWN0b3JcclxuICogQHBhcmFtIGMgdmVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBkaXJlY3Rpb24oYSwgYiwgYykge1xyXG4gICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgeDMgPSBjWzBdLFxyXG4gICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICB5MiA9IGJbMV0sXHJcbiAgICAgICAgeTMgPSBjWzFdO1xyXG5cclxuICAgIHJldHVybiAoeDMgLSB4MSkgKiAoeTIgLSB5MSkgLSAoeDIgLSB4MSkgKiAoeTMgLSB5MSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gYSBzZWdtZW50MVxyXG4gKiBAcGFyYW0gYiBzZWdtZW50MlxyXG4gKi9cclxuZnVuY3Rpb24gc2VnbWVudHNJbnRlcnNlY3QoYSwgYikge1xyXG4gICAgdmFyIHAxID0gYVswXSxcclxuICAgICAgICBwMiA9IGFbMV0sXHJcbiAgICAgICAgcDMgPSBiWzBdLFxyXG4gICAgICAgIHA0ID0gYlsxXSxcclxuICAgICAgICBkMSA9IGRpcmVjdGlvbihwMywgcDQsIHAxKSxcclxuICAgICAgICBkMiA9IGRpcmVjdGlvbihwMywgcDQsIHAyKSxcclxuICAgICAgICBkMyA9IGRpcmVjdGlvbihwMSwgcDIsIHAzKSxcclxuICAgICAgICBkNCA9IGRpcmVjdGlvbihwMSwgcDIsIHA0KTtcclxuXHJcbiAgICBpZiAoKChkMSA+IDAgJiYgZDIgPCAwKSB8fCAoZDEgPCAwICYmIGQyID4gMCkpICYmICgoZDMgPiAwICYmIGQ0IDwgMCkgfHwgKGQzIDwgMCAmJiBkNCA+IDApKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkMSA9PT0gMCAmJiBvblNlZ21lbnQocDMsIHA0LCBwMSkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoZDIgPT09IDAgJiYgb25TZWdtZW50KHAzLCBwNCwgcDIpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQzID09PSAwICYmIG9uU2VnbWVudChwMSwgcDIsIHAzKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkNCA9PT0gMCAmJiBvblNlZ21lbnQocDEsIHAyLCBwNCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBhIHNlZ21lbnQxXHJcbiAqIEBwYXJhbSBiIHNlZ21lbnQyXHJcbiAqL1xyXG5mdW5jdGlvbiBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb24gKGEsIGIpIHtcclxuICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAoKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpKTtcclxuICAgIHZhciB5ID0gKCh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpKSAvXHJcbiAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICBpZiAoaXNOYU4oeCl8fGlzTmFOKHkpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoeDEgPj0geDIpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHgyLCB4LCB4MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHkxID49IHkyKSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5MiwgeSwgeTEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeTEsIHksIHkyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh4MyA+PSB4NCkge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeDQsIHgsIHgzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHgzLCB4LCB4NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoeTMgPj0geTQpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHk0LCB5LCB5MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW3gsIHldO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiZXR3ZWVuIChhLCBiLCBjKSB7XHJcbiAgICByZXR1cm4gYSAtIEVQUyA8PSBiICYmIGIgPD0gYyArIEVQUztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBhIHNlZ21lbnQxXHJcbiAqIEBwYXJhbSBiIHNlZ21lbnQyXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21wYXJlU2VnbWVudHMoYSwgYikge1xyXG4gICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICB5NCA9IGJbMV1bMV07XHJcblxyXG4gICAgdmFyIGN1cnJlbnRYLFxyXG4gICAgICAgIGF5LFxyXG4gICAgICAgIGJ5LFxyXG4gICAgICAgIGRlbHRhWSxcclxuICAgICAgICBkZWx0YVgxLFxyXG4gICAgICAgIGRlbHRhWDI7XHJcblxyXG4gICAgaWYgKGEgPT09IGIpIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBjdXJyZW50WCA9IHRoaXMueDtcclxuICAgIGF5ID0gZ2V0WShhLCBjdXJyZW50WCk7XHJcbiAgICBieSA9IGdldFkoYiwgY3VycmVudFgpO1xyXG4gICAgZGVsdGFZID0gYXkgLSBieTtcclxuXHJcbiAgICBpZiAoTWF0aC5hYnMoZGVsdGFZKSA+IEVQUykge1xyXG4gICAgICAgIHJldHVybiBkZWx0YVkgPCAwID8gLTEgOiAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgYVNsb3BlID0gZ2V0U2xvcGUoYSksXHJcbiAgICAgICAgICAgIGJTbG9wZSA9IGdldFNsb3BlKGIpO1xyXG5cclxuICAgICAgICBpZiAoYVNsb3BlICE9PSBiU2xvcGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICdiZWZvcmUnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYVNsb3BlID4gYlNsb3BlID8gLTEgOiAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFTbG9wZSA+IGJTbG9wZSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRlbHRhWDEgPSB4MSAtIHgzO1xyXG5cclxuICAgIGlmIChkZWx0YVgxICE9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhWDEgPCAwID8gLTEgOiAxO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbHRhWDIgPSB4MiAtIHg0O1xyXG5cclxuICAgIGlmIChkZWx0YVgyICE9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhWDIgPCAwID8gLTEgOiAxO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBhIHBvaW50MVxyXG4gKiBAcGFyYW0gYiBwb2ludDJcclxuICovXHJcbmZ1bmN0aW9uIGNvbXBhcmVQb2ludHMoYSwgYikge1xyXG4gICAgdmFyIGFJc0FycmF5ID0gQXJyYXkuaXNBcnJheShhKSxcclxuICAgICAgICBiSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoYiksXHJcbiAgICAgICAgeDEgPSBhSXNBcnJheSA/IGFbMF0gOiBhLngsXHJcbiAgICAgICAgeTEgPSBhSXNBcnJheSA/IGFbMV0gOiBhLnksXHJcbiAgICAgICAgeDIgPSBiSXNBcnJheSA/IGJbMF0gOiBiLngsXHJcbiAgICAgICAgeTIgPSBiSXNBcnJheSA/IGJbMV0gOiBiLnk7XHJcblxyXG4gICAgaWYgKHgxIC0geDIgPiBFUFMgfHwgKE1hdGguYWJzKHgxIC0geDIpIDwgRVBTICYmIHkxIC0geTIgPiBFUFMpKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9IGVsc2UgaWYgKHgyIC0geDEgPiBFUFMgfHwgKE1hdGguYWJzKHgxIC0geDIpIDwgRVBTICYmIHkyIC0geTEgPiBFUFMpKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSBlbHNlIGlmIChNYXRoLmFicyh4MSAtIHgyKSA8IEVQUyAmJiBNYXRoLmFicyh5MSAtIHkyKSA8IEVQUyApIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2xvcGUoc2VnbWVudCkge1xyXG4gICAgdmFyIHgxID0gc2VnbWVudFswXVswXSxcclxuICAgICAgICB5MSA9IHNlZ21lbnRbMF1bMV0sXHJcbiAgICAgICAgeDIgPSBzZWdtZW50WzFdWzBdLFxyXG4gICAgICAgIHkyID0gc2VnbWVudFsxXVsxXTtcclxuXHJcbiAgICBpZiAoeDEgPT09IHgyKSB7XHJcbiAgICAgICAgcmV0dXJuICh5MSA8IHkyKSA/IEluZmluaXR5IDogLSBJbmZpbml0eTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICh5MiAtIHkxKSAvICh4MiAtIHgxKTtcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGdldFkoc2VnbWVudCwgeCkge1xyXG4gICAgdmFyIGJlZ2luID0gc2VnbWVudFswXSxcclxuICAgICAgICBlbmQgPSBzZWdtZW50WzFdLFxyXG4gICAgICAgIHNwYW4gPSBzZWdtZW50WzFdWzBdIC0gc2VnbWVudFswXVswXSxcclxuICAgICAgICBkZWx0YVgwLFxyXG4gICAgICAgIGRlbHRhWDEsXHJcbiAgICAgICAgaWZhYyxcclxuICAgICAgICBmYWM7XHJcblxyXG4gICAgaWYgKHggPD0gYmVnaW5bMF0pIHtcclxuICAgICAgICByZXR1cm4gYmVnaW5bMV07XHJcbiAgICB9IGVsc2UgaWYgKHggPj0gZW5kWzBdKSB7XHJcbiAgICAgICAgcmV0dXJuIGVuZFsxXTtcclxuICAgIH1cclxuXHJcbiAgICBkZWx0YVgwID0geCAtIGJlZ2luWzBdO1xyXG4gICAgZGVsdGFYMSA9IGVuZFswXSAtIHg7XHJcblxyXG4gICAgaWYgKGRlbHRhWDAgPiBkZWx0YVgxKSB7XHJcbiAgICAgICAgaWZhYyA9IGRlbHRhWDAgLyBzcGFuXHJcbiAgICAgICAgZmFjID0gMSAtIGlmYWM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZhYyA9IGRlbHRhWDEgLyBzcGFuXHJcbiAgICAgICAgaWZhYyA9IDEgLSBmYWM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChiZWdpblsxXSAqIGZhYykgKyAoZW5kWzFdICogaWZhYyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIEVQUzogRVBTLFxyXG4gICAgb25TZWdtZW50OiBvblNlZ21lbnQsXHJcbiAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgIHNlZ21lbnRzSW50ZXJzZWN0OiBzZWdtZW50c0ludGVyc2VjdCxcclxuICAgIGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbjogZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uLFxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBjb21wYXJlU2VnbWVudHMsXHJcbiAgICBjb21wYXJlUG9pbnRzOiBjb21wYXJlUG9pbnRzXHJcbn1cclxuIiwidmFyIFBvaW50ID0gZnVuY3Rpb24gKGNvb3JkcywgdHlwZSkge1xyXG4gICAgdGhpcy54ID0gY29vcmRzWzBdO1xyXG4gICAgdGhpcy55ID0gY29vcmRzWzFdO1xyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcclxuIiwiZnVuY3Rpb24gU3dlZXBsaW5lKHBvc2l0aW9uKSB7XHJcbiAgICB0aGlzLnggPSBudWxsO1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG59XHJcblxyXG5Td2VlcGxpbmUucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbn1cclxuU3dlZXBsaW5lLnByb3RvdHlwZS5zZXRYID0gZnVuY3Rpb24gKHgpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3dlZXBsaW5lO1xyXG4iXX0=
