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
function findIntersections(segments) {
    var sweepline = new Sweepline('before'),
        queue = new Tree(utils.comparePoints, true),
        status = new Tree(utils.compareSegments.bind(sweepline), true),
        output = new Tree(utils.comparePoints, true);

    segments.forEach(function (segment) {
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
        handleEventPoint(point.key, status, output, queue, sweepline);
    }

    return output.keys().map(function (key) {
        return [key.x, key.y];
    });
}

function handleEventPoint(point, status, output, queue, sweepline) {
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

        for (var p = 0; p < Lp.length; p++) {
            status.remove(Lp[p]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxqc1xcYXBwLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXZsL2Rpc3QvYXZsLmpzIiwic3JjXFxmaW5kSW50ZXJzZWN0aW9ucy5qcyIsInNyY1xcZ2VvbWV0cnlcXGdlb21ldHJ5LmpzIiwic3JjXFxwb2ludC5qcyIsInNyY1xcc3dlZXBsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBTyxpQkFBUCxHQUEyQixRQUFRLGFBQVIsQ0FBM0I7QUFDQSxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxPQUFPLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJDLEVBQXlDLFNBQVMsRUFBbEQsRUFBakIsQ0FMWDtBQUFBLElBTUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FOWDtBQUFBLElBT0ksaUJBQWlCLFNBQVMsc0JBQVQsQ0FBZ0MsVUFBaEMsRUFBNEMsQ0FBNUMsQ0FQckI7QUFBQSxJQVFJLG9CQUFvQixTQUFTLHNCQUFULENBQWdDLGlCQUFoQyxFQUFtRCxDQUFuRCxDQVJ4QjtBQUFBLElBU0ksT0FUSjtBQUFBLElBU2EsS0FUYjs7QUFXQSxTQUFTLFNBQVQsR0FBcUI7QUFDakIsUUFBSSxPQUFKLEVBQWE7QUFDVCxhQUFLLFdBQUwsQ0FBaUIsT0FBakI7QUFDSDs7QUFFRCxRQUFJLEtBQUosRUFBVztBQUNQLGFBQUssV0FBTCxDQUFpQixLQUFqQjtBQUNIOztBQUVELFFBQUksU0FBUyxL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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cuZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9pbmRleCcpO1xyXG52YXIgb3NtID0gTC50aWxlTGF5ZXIoJ2h0dHA6Ly97c30uYmFzZW1hcHMuY2FydG9jZG4uY29tL2xpZ2h0X25vbGFiZWxzL3t6fS97eH0ve3l9LnBuZycsIHtcclxuICAgICAgICBtYXhab29tOiAyMixcclxuICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAub3JnXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPidcclxuICAgIH0pLFxyXG4gICAgcG9pbnQgPSBMLmxhdExuZyhbNTUuNzUzMjEwLCAzNy42MjE3NjZdKSxcclxuICAgIGxtYXAgPSBuZXcgTC5NYXAoJ21hcCcsIHtsYXllcnM6IFtvc21dLCBjZW50ZXI6IHBvaW50LCB6b29tOiAxMSwgbWF4Wm9vbTogMjJ9KSxcclxuICAgIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLFxyXG4gICAgZ2VuZXJhdGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdnZW5lcmF0ZScpWzBdLFxyXG4gICAgbGluZXNOdW1iZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWdtZW50cy1udW1iZXInKVswXSxcclxuICAgIG1hcmtlcnMsIGxpbmVzO1xyXG5cclxuZnVuY3Rpb24gZHJhd0xpbmVzKCkge1xyXG4gICAgaWYgKG1hcmtlcnMpIHtcclxuICAgICAgICBsbWFwLnJlbW92ZUxheWVyKG1hcmtlcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChsaW5lcykge1xyXG4gICAgICAgIGxtYXAucmVtb3ZlTGF5ZXIobGluZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBib3VuZHMgPSBsbWFwLmdldEJvdW5kcygpLFxyXG4gICAgICAgIG4gPSBib3VuZHMuX25vcnRoRWFzdC5sYXQsXHJcbiAgICAgICAgZSA9IGJvdW5kcy5fbm9ydGhFYXN0LmxuZyxcclxuICAgICAgICBzID0gYm91bmRzLl9zb3V0aFdlc3QubGF0LFxyXG4gICAgICAgIHcgPSBib3VuZHMuX3NvdXRoV2VzdC5sbmcsXHJcbiAgICAgICAgaGVpZ2h0ID0gbiAtIHMsXHJcbiAgICAgICAgd2lkdGggPSBlIC0gdyxcclxuICAgICAgICBxSGVpZ2h0ID0gaGVpZ2h0IC8gNCxcclxuICAgICAgICBxV2lkdGggPSB3aWR0aCAvIDQsXHJcbiAgICAgICAgZGF0YSA9IFtdLFxyXG4gICAgICAgIHBzLFxyXG4gICAgICAgIHBvaW50cyxcclxuICAgICAgICBjb29yZHM7XHJcblxyXG4gICAgcG9pbnRzID0gdHVyZi5yYW5kb21Qb2ludChsaW5lc051bWJlckJ1dHRvbi52YWx1ZSAqIDIsIHtcclxuICAgICAgICBiYm94OiBbdyArIHFXaWR0aCwgcyArIHFIZWlnaHQsIGUgLSBxV2lkdGgsIG4gLSBxSGVpZ2h0XVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29vcmRzID0gcG9pbnRzLmZlYXR1cmVzLm1hcChmdW5jdGlvbihmZWF0dXJlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XHJcbiAgICB9KVxyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgIGRhdGEucHVzaChbY29vcmRzW2ldLCBjb29yZHNbaSsxXV0pO1xyXG4gICAgfVxyXG5cclxuICAgIG1hcmtlcnMgPSBMLmxheWVyR3JvdXAoKS5hZGRUbyhsbWFwKTtcclxuXHJcbiAgICBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGRhdGEpO1xyXG4gICAgcHMuZm9yRWFjaChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgIG1hcmtlcnMuYWRkTGF5ZXIoTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSksIHtyYWRpdXM6IDUsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYmluZFBvcHVwKHBbMF0gKyAnXFxuICcgKyBwWzFdKSk7XHJcbiAgICB9KVxyXG5cclxuICAgIGxpbmVzID0gTC5sYXllckdyb3VwKCkuYWRkVG8obG1hcCk7XHJcblxyXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXS5zbGljZSgpLnJldmVyc2UoKSxcclxuICAgICAgICBlbmQgPSBsaW5lWzFdLnNsaWNlKCkucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICBsaW5lcy5hZGRMYXllcihMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhiZWdpbiksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pKTtcclxuICAgICAgICBsaW5lcy5hZGRMYXllcihMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhlbmQpLCB7cmFkaXVzOiAyLCBmaWxsQ29sb3I6IFwiI0ZGRkYwMFwiLCB3ZWlnaHQ6IDJ9KSk7XHJcbiAgICAgICAgbGluZXMuYWRkTGF5ZXIoTC5wb2x5bGluZShbYmVnaW4sIGVuZF0sIHt3ZWlnaHQ6IDF9KSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZ2VuZXJhdGVCdXR0b24ub25jbGljayA9IGRyYXdMaW5lcztcclxuXHJcbmRyYXdMaW5lcygpO1xyXG4iLCJ2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuL3NyYy9maW5kSW50ZXJzZWN0aW9ucy5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW50ZXJzZWN0aW9ucztcclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmF2bCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQcmludHMgdHJlZSBob3Jpem9udGFsbHlcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcHJpbnQgKHJvb3QsIHByaW50Tm9kZSkge1xuICBpZiAoIHByaW50Tm9kZSA9PT0gdm9pZCAwICkgcHJpbnROb2RlID0gZnVuY3Rpb24gKG4pIHsgcmV0dXJuIG4ua2V5OyB9O1xuXG4gIHZhciBvdXQgPSBbXTtcbiAgcm93KHJvb3QsICcnLCB0cnVlLCBmdW5jdGlvbiAodikgeyByZXR1cm4gb3V0LnB1c2godik7IH0sIHByaW50Tm9kZSk7XG4gIHJldHVybiBvdXQuam9pbignJyk7XG59XG5cbi8qKlxuICogUHJpbnRzIGxldmVsIG9mIHRoZSB0cmVlXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgcHJlZml4XG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgIGlzVGFpbFxuICogQHBhcmFtICB7RnVuY3Rpb24oaW46c3RyaW5nKTp2b2lkfSAgICBvdXRcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSAgcHJpbnROb2RlXG4gKi9cbmZ1bmN0aW9uIHJvdyAocm9vdCwgcHJlZml4LCBpc1RhaWwsIG91dCwgcHJpbnROb2RlKSB7XG4gIGlmIChyb290KSB7XG4gICAgb3V0KChcIlwiICsgcHJlZml4ICsgKGlzVGFpbCA/ICfilJTilIDilIAgJyA6ICfilJzilIDilIAgJykgKyAocHJpbnROb2RlKHJvb3QpKSArIFwiXFxuXCIpKTtcbiAgICB2YXIgaW5kZW50ID0gcHJlZml4ICsgKGlzVGFpbCA/ICcgICAgJyA6ICfilIIgICAnKTtcbiAgICBpZiAocm9vdC5sZWZ0KSAgeyByb3cocm9vdC5sZWZ0LCAgaW5kZW50LCBmYWxzZSwgb3V0LCBwcmludE5vZGUpOyB9XG4gICAgaWYgKHJvb3QucmlnaHQpIHsgcm93KHJvb3QucmlnaHQsIGluZGVudCwgdHJ1ZSwgIG91dCwgcHJpbnROb2RlKTsgfVxuICB9XG59XG5cblxuLyoqXG4gKiBJcyB0aGUgdHJlZSBiYWxhbmNlZCAobm9uZSBvZiB0aGUgc3VidHJlZXMgZGlmZmVyIGluIGhlaWdodCBieSBtb3JlIHRoYW4gMSlcbiAqIEBwYXJhbSAge05vZGV9ICAgIHJvb3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQmFsYW5jZWQocm9vdCkge1xuICBpZiAocm9vdCA9PT0gbnVsbCkgeyByZXR1cm4gdHJ1ZTsgfSAvLyBJZiBub2RlIGlzIGVtcHR5IHRoZW4gcmV0dXJuIHRydWVcblxuICAvLyBHZXQgdGhlIGhlaWdodCBvZiBsZWZ0IGFuZCByaWdodCBzdWIgdHJlZXNcbiAgdmFyIGxoID0gaGVpZ2h0KHJvb3QubGVmdCk7XG4gIHZhciByaCA9IGhlaWdodChyb290LnJpZ2h0KTtcblxuICBpZiAoTWF0aC5hYnMobGggLSByaCkgPD0gMSAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LmxlZnQpICAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LnJpZ2h0KSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIElmIHdlIHJlYWNoIGhlcmUgdGhlbiB0cmVlIGlzIG5vdCBoZWlnaHQtYmFsYW5jZWRcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBDb21wdXRlIHRoZSAnaGVpZ2h0JyBvZiBhIHRyZWUuXG4gKiBIZWlnaHQgaXMgdGhlIG51bWJlciBvZiBub2RlcyBhbG9uZyB0aGUgbG9uZ2VzdCBwYXRoXG4gKiBmcm9tIHRoZSByb290IG5vZGUgZG93biB0byB0aGUgZmFydGhlc3QgbGVhZiBub2RlLlxuICpcbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gaGVpZ2h0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPyAoMSArIE1hdGgubWF4KGhlaWdodChub2RlLmxlZnQpLCBoZWlnaHQobm9kZS5yaWdodCkpKSA6IDA7XG59XG5cbi8vIGZ1bmN0aW9uIGNyZWF0ZU5vZGUgKHBhcmVudCwgbGVmdCwgcmlnaHQsIGhlaWdodCwga2V5LCBkYXRhKSB7XG4vLyAgIHJldHVybiB7IHBhcmVudCwgbGVmdCwgcmlnaHQsIGJhbGFuY2VGYWN0b3I6IGhlaWdodCwga2V5LCBkYXRhIH07XG4vLyB9XG5cbi8qKlxuICogQHR5cGVkZWYge3tcbiAqICAgcGFyZW50OiAgICAgICAgTm9kZXxOdWxsLFxuICogICBsZWZ0OiAgICAgICAgICBOb2RlfE51bGwsXG4gKiAgIHJpZ2h0OiAgICAgICAgIE5vZGV8TnVsbCxcbiAqICAgYmFsYW5jZUZhY3RvcjogTnVtYmVyLFxuICogICBrZXk6ICAgICAgICAgICBhbnksXG4gKiAgIGRhdGE6ICAgICAgICAgIG9iamVjdD9cbiAqIH19IE5vZGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsqfSBLZXlcbiAqL1xuXG4vKipcbiAqIERlZmF1bHQgY29tcGFyaXNvbiBmdW5jdGlvblxuICogQHBhcmFtIHsqfSBhXG4gKiBAcGFyYW0geyp9IGJcbiAqL1xuZnVuY3Rpb24gREVGQVVMVF9DT01QQVJFIChhLCBiKSB7IHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDsgfVxuXG5cbi8qKlxuICogU2luZ2xlIGxlZnQgcm90YXRpb25cbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZUxlZnQgKG5vZGUpIHtcbiAgdmFyIHJpZ2h0Tm9kZSA9IG5vZGUucmlnaHQ7XG4gIG5vZGUucmlnaHQgICAgPSByaWdodE5vZGUubGVmdDtcblxuICBpZiAocmlnaHROb2RlLmxlZnQpIHsgcmlnaHROb2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIHJpZ2h0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAocmlnaHROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LmxlZnQgPSByaWdodE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQucmlnaHQgPSByaWdodE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSByaWdodE5vZGU7XG4gIHJpZ2h0Tm9kZS5sZWZ0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSByaWdodE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG4gIHJldHVybiByaWdodE5vZGU7XG59XG5cblxuZnVuY3Rpb24gcm90YXRlUmlnaHQgKG5vZGUpIHtcbiAgdmFyIGxlZnROb2RlID0gbm9kZS5sZWZ0O1xuICBub2RlLmxlZnQgPSBsZWZ0Tm9kZS5yaWdodDtcbiAgaWYgKG5vZGUubGVmdCkgeyBub2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIGxlZnROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAobGVmdE5vZGUucGFyZW50KSB7XG4gICAgaWYgKGxlZnROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9IGxlZnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQucmlnaHQgPSBsZWZ0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IGxlZnROb2RlO1xuICBsZWZ0Tm9kZS5yaWdodCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmV0dXJuIGxlZnROb2RlO1xufVxuXG5cbi8vIGZ1bmN0aW9uIGxlZnRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHJvdGF0ZUxlZnQobm9kZS5sZWZ0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZVJpZ2h0KG5vZGUpO1xuLy8gfVxuXG5cbi8vIGZ1bmN0aW9uIHJpZ2h0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSByb3RhdGVSaWdodChub2RlLnJpZ2h0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZUxlZnQobm9kZSk7XG4vLyB9XG5cblxudmFyIFRyZWUgPSBmdW5jdGlvbiBUcmVlIChjb21wYXJhdG9yKSB7XG4gIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yIHx8IERFRkFVTFRfQ09NUEFSRTtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG4gIHRoaXMuX3NpemUgPSAwO1xufTtcblxudmFyIHByb3RvdHlwZUFjY2Vzc29ycyA9IHsgc2l6ZToge30gfTtcblxuXG4vKipcbiAqIENsZWFyIHRoZSB0cmVlXG4gKi9cblRyZWUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG59O1xuXG4vKipcbiAqIE51bWJlciBvZiBub2Rlc1xuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5wcm90b3R5cGVBY2Nlc3NvcnMuc2l6ZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9zaXplO1xufTtcblxuXG4vKipcbiAqIFdoZXRoZXIgdGhlIHRyZWUgY29udGFpbnMgYSBub2RlIHdpdGggdGhlIGdpdmVuIGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zIChrZXkpIHtcbiAgaWYgKHRoaXMuX3Jvb3Qpe1xuICAgIHZhciBub2RlICAgICA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuICAgIHdoaWxlIChub2RlKXtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGtleSwgbm9kZS5rZXkpO1xuICAgICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblxuLyogZXNsaW50LWRpc2FibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG4vKipcbiAqIFN1Y2Nlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gbmV4dCAobm9kZSkge1xuICB2YXIgc3VjY2Vzc29yID0gbm9kZTtcbiAgaWYgKHN1Y2Nlc3Nvcikge1xuICAgIGlmIChzdWNjZXNzb3IucmlnaHQpIHtcbiAgICAgIHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5yaWdodDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLmxlZnQpIHsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLmxlZnQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5yaWdodCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gc3VjY2Vzc29yOyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3VjY2Vzc29yO1xufTtcblxuXG4vKipcbiAqIFByZWRlY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiBwcmV2IChub2RlKSB7XG4gIHZhciBwcmVkZWNlc3NvciA9IG5vZGU7XG4gIGlmIChwcmVkZWNlc3Nvcikge1xuICAgIGlmIChwcmVkZWNlc3Nvci5sZWZ0KSB7XG4gICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLmxlZnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IucmlnaHQpIHsgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5yaWdodDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmVkZWNlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLmxlZnQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHByZWRlY2Vzc29yO1xuICAgICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByZWRlY2Vzc29yO1xufTtcbi8qIGVzbGludC1lbmFibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG5cbi8qKlxuICogQHBhcmFte0Z1bmN0aW9uKG5vZGU6Tm9kZSk6dm9pZH0gZm5cbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cblRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoIChmbikge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIGRvbmUgPSBmYWxzZSwgaSA9IDA7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgLy8gUmVhY2ggdGhlIGxlZnQgbW9zdCBOb2RlIG9mIHRoZSBjdXJyZW50IE5vZGVcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgLy8gUGxhY2UgcG9pbnRlciB0byBhIHRyZWUgbm9kZSBvbiB0aGUgc3RhY2tcbiAgICAgIC8vIGJlZm9yZSB0cmF2ZXJzaW5nIHRoZSBub2RlJ3MgbGVmdCBzdWJ0cmVlXG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCYWNrVHJhY2sgZnJvbSB0aGUgZW1wdHkgc3VidHJlZSBhbmQgdmlzaXQgdGhlIE5vZGVcbiAgICAgIC8vIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrOyBob3dldmVyLCBpZiB0aGUgc3RhY2sgaXNcbiAgICAgIC8vIGVtcHR5IHlvdSBhcmUgZG9uZVxuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgZm4oY3VycmVudCwgaSsrKTtcblxuICAgICAgICAvLyBXZSBoYXZlIHZpc2l0ZWQgdGhlIG5vZGUgYW5kIGl0cyBsZWZ0XG4gICAgICAgIC8vIHN1YnRyZWUuIE5vdywgaXQncyByaWdodCBzdWJ0cmVlJ3MgdHVyblxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYWxsIGtleXMgaW4gb3JkZXJcbiAqIEByZXR1cm4ge0FycmF5PEtleT59XG4gKi9cblRyZWUucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiBrZXlzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQua2V5KTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGBkYXRhYCBmaWVsZHMgb2YgYWxsIG5vZGVzIGluIG9yZGVyLlxuICogQHJldHVybiB7QXJyYXk8Kj59XG4gKi9cblRyZWUucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmRhdGEpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtaW5pbXVtIGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5taW5Ob2RlID0gZnVuY3Rpb24gbWluTm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWF4IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5tYXhOb2RlID0gZnVuY3Rpb24gbWF4Tm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIE1pbiBrZXlcbiAqIEByZXR1cm4ge0tleX1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gbWluICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cbi8qKlxuICogTWF4IGtleVxuICogQHJldHVybiB7S2V5fE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uIG1heCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cblxuLyoqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eSAoKSB7XG4gIHJldHVybiAhdGhpcy5fcm9vdDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBub2RlIHdpdGggc21hbGxlc3Qga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uIHBvcCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdCwgcmV0dXJuVmFsdWUgPSBudWxsO1xuICBpZiAobm9kZSkge1xuICAgIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIHJldHVyblZhbHVlID0geyBrZXk6IG5vZGUua2V5LCBkYXRhOiBub2RlLmRhdGEgfTtcbiAgICB0aGlzLnJlbW92ZShub2RlLmtleSk7XG4gIH1cbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIEZpbmQgbm9kZSBieSBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gZmluZCAoa2V5KSB7XG4gIHZhciByb290ID0gdGhpcy5fcm9vdDtcbiAgaWYgKHJvb3QgPT09IG51bGwpICB7IHJldHVybiBudWxsOyB9XG4gIGlmIChrZXkgPT09IHJvb3Qua2V5KSB7IHJldHVybiByb290OyB9XG5cbiAgdmFyIHN1YnRyZWUgPSByb290LCBjbXA7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgd2hpbGUgKHN1YnRyZWUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgc3VidHJlZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIHN1YnRyZWU7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IHN1YnRyZWUgPSBzdWJ0cmVlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IHN1YnRyZWUgPSBzdWJ0cmVlLnJpZ2h0OyB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBJbnNlcnQgYSBub2RlIGludG8gdGhlIHRyZWVcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHBhcmFteyp9IFtkYXRhXVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQgKGtleSwgZGF0YSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fcm9vdCkge1xuICAgIHRoaXMuX3Jvb3QgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsLCBiYWxhbmNlRmFjdG9yOiAwLFxuICAgICAga2V5OiBrZXksIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHRoaXMuX3NpemUrKztcbiAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgfVxuXG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgdmFyIG5vZGUgID0gdGhpcy5fcm9vdDtcbiAgdmFyIHBhcmVudD0gbnVsbDtcbiAgdmFyIGNtcCAgID0gMDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgcGFyZW50ID0gbm9kZTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG5cbiAgdmFyIG5ld05vZGUgPSB7XG4gICAgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgcGFyZW50OiBwYXJlbnQsIGtleToga2V5LCBkYXRhOiBkYXRhLFxuICB9O1xuICBpZiAoY21wIDwgMCkgeyBwYXJlbnQubGVmdD0gbmV3Tm9kZTsgfVxuICBlbHNlICAgICAgIHsgcGFyZW50LnJpZ2h0ID0gbmV3Tm9kZTsgfVxuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAoY29tcGFyZShwYXJlbnQua2V5LCBrZXkpIDwgMCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy9sZXQgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIHZhciBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGxldCBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QkMSA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290JDE7IH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgdGhpcy5fc2l6ZSsrO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBub2RlIGZyb20gdGhlIHRyZWUuIElmIG5vdCBmb3VuZCwgcmV0dXJucyBudWxsLlxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlOk51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoa2V5KSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICB2YXIgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB2YXIgcmV0dXJuVmFsdWUgPSBub2RlLmtleTtcblxuICBpZiAobm9kZS5sZWZ0KSB7XG4gICAgdmFyIG1heCA9IG5vZGUubGVmdDtcblxuICAgIHdoaWxlIChtYXgubGVmdCB8fCBtYXgucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtYXgucmlnaHQpIHsgbWF4ID0gbWF4LnJpZ2h0OyB9XG5cbiAgICAgIG5vZGUua2V5ID0gbWF4LmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgICAgaWYgKG1heC5sZWZ0KSB7XG4gICAgICAgIG5vZGUgPSBtYXg7XG4gICAgICAgIG1heCA9IG1heC5sZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtYXgua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgIG5vZGUgPSBtYXg7XG4gIH1cblxuICBpZiAobm9kZS5yaWdodCkge1xuICAgIHZhciBtaW4gPSBub2RlLnJpZ2h0O1xuXG4gICAgd2hpbGUgKG1pbi5sZWZ0IHx8IG1pbi5yaWdodCkge1xuICAgICAgd2hpbGUgKG1pbi5sZWZ0KSB7IG1pbiA9IG1pbi5sZWZ0OyB9XG5cbiAgICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgICBpZiAobWluLnJpZ2h0KSB7XG4gICAgICAgIG5vZGUgPSBtaW47XG4gICAgICAgIG1pbiA9IG1pbi5yaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICBub2RlID0gbWluO1xuICB9XG5cbiAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50O1xuICB2YXIgcHAgICA9IG5vZGU7XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQubGVmdCA9PT0gcHApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vbGV0IG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3Q7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGxldCBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QkMSA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290JDE7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3QkMTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IC0xIHx8IHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IGJyZWFrOyB9XG5cbiAgICBwcCAgID0gcGFyZW50O1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkgeyBub2RlLnBhcmVudC5sZWZ0PSBudWxsOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICB7IG5vZGUucGFyZW50LnJpZ2h0ID0gbnVsbDsgfVxuICB9XG5cbiAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHsgdGhpcy5fcm9vdCA9IG51bGw7IH1cblxuICB0aGlzLl9zaXplLS07XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRyZWUgaXMgYmFsYW5jZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmlzQmFsYW5jZWQgPSBmdW5jdGlvbiBpc0JhbGFuY2VkJDEgKCkge1xuICByZXR1cm4gaXNCYWxhbmNlZCh0aGlzLl9yb290KTtcbn07XG5cblxuLyoqXG4gKiBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyZWUgLSBwcmltaXRpdmUgaG9yaXpvbnRhbCBwcmludC1vdXRcbiAqIEBwYXJhbXtGdW5jdGlvbihOb2RlKTpTdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblRyZWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKHByaW50Tm9kZSkge1xuICByZXR1cm4gcHJpbnQodGhpcy5fcm9vdCwgcHJpbnROb2RlKTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBUcmVlLnByb3RvdHlwZSwgcHJvdG90eXBlQWNjZXNzb3JzICk7XG5cbnJldHVybiBUcmVlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXZsLmpzLm1hcFxuIiwidmFyIFRyZWUgPSByZXF1aXJlKCdhdmwnKSxcclxuICAgIFN3ZWVwbGluZSA9IHJlcXVpcmUoJy4vc3dlZXBsaW5lJyksXHJcbiAgICBQb2ludCA9IHJlcXVpcmUoJy4vcG9pbnQnKSxcclxuICAgIHV0aWxzID0gcmVxdWlyZSgnLi9nZW9tZXRyeS9nZW9tZXRyeScpO1xyXG5cclxuLyoqXHJcbiogQHBhcmFtIHtBcnJheX0gc2VnbWVudHMgc2V0IG9mIHNlZ21lbnRzIGludGVyc2VjdGluZyBzd2VlcGxpbmUgW1tbeDEsIHkxXSwgW3gyLCB5Ml1dIC4uLiBbW3htLCB5bV0sIFt4biwgeW5dXV1cclxuKi9cclxuZnVuY3Rpb24gZmluZEludGVyc2VjdGlvbnMoc2VnbWVudHMpIHtcclxuICAgIHZhciBzd2VlcGxpbmUgPSBuZXcgU3dlZXBsaW5lKCdiZWZvcmUnKSxcclxuICAgICAgICBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMsIHRydWUpLFxyXG4gICAgICAgIHN0YXR1cyA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVTZWdtZW50cy5iaW5kKHN3ZWVwbGluZSksIHRydWUpLFxyXG4gICAgICAgIG91dHB1dCA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMsIHRydWUpO1xyXG5cclxuICAgIHNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKHNlZ21lbnQpIHtcclxuICAgICAgICBzZWdtZW50LnNvcnQodXRpbHMuY29tcGFyZVBvaW50cyk7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbmV3IFBvaW50KHNlZ21lbnRbMF0sICdiZWdpbicpLFxyXG4gICAgICAgICAgICBlbmQgPSBuZXcgUG9pbnQoc2VnbWVudFsxXSwgJ2VuZCcpO1xyXG5cclxuICAgICAgICBxdWV1ZS5pbnNlcnQoYmVnaW4sIGJlZ2luKTtcclxuICAgICAgICBiZWdpbiA9IHF1ZXVlLmZpbmQoYmVnaW4pLmtleTtcclxuICAgICAgICBiZWdpbi5zZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xyXG5cclxuICAgICAgICBxdWV1ZS5pbnNlcnQoZW5kLCBlbmQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgd2hpbGUgKCFxdWV1ZS5pc0VtcHR5KCkpIHtcclxuICAgICAgICB2YXIgcG9pbnQgPSBxdWV1ZS5wb3AoKTtcclxuICAgICAgICBoYW5kbGVFdmVudFBvaW50KHBvaW50LmtleSwgc3RhdHVzLCBvdXRwdXQsIHF1ZXVlLCBzd2VlcGxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvdXRwdXQua2V5cygpLm1hcChmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIHJldHVybiBba2V5LngsIGtleS55XTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFdmVudFBvaW50KHBvaW50LCBzdGF0dXMsIG91dHB1dCwgcXVldWUsIHN3ZWVwbGluZSkge1xyXG4gICAgc3dlZXBsaW5lLnNldFBvc2l0aW9uKCdiZWZvcmUnKTtcclxuICAgIHN3ZWVwbGluZS5zZXRYKHBvaW50LngpO1xyXG5cclxuICAgIHZhciBVcCA9IHBvaW50LnNlZ21lbnRzLCAvLyBzZWdtZW50cywgZm9yIHdoaWNoIHRoaXMgaXMgdGhlIGxlZnQgZW5kXHJcbiAgICAgICAgTHAgPSBbXSwgICAgICAgICAgICAgLy8gc2VnbWVudHMsIGZvciB3aGljaCB0aGlzIGlzIHRoZSByaWdodCBlbmRcclxuICAgICAgICBDcCA9IFtdOyAgICAgICAgICAgICAvLyAvLyBzZWdtZW50cywgZm9yIHdoaWNoIHRoaXMgaXMgYW4gaW5uZXIgcG9pbnRcclxuXHJcbiAgICAvLyBzdGVwIDJcclxuICAgIHN0YXR1cy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICB2YXIgc2VnbWVudCA9IG5vZGUua2V5LFxyXG4gICAgICAgICAgICBzZWdtZW50QmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgICAgICBzZWdtZW50RW5kID0gc2VnbWVudFsxXTtcclxuXHJcbiAgICAgICAgLy8gY291bnQgcmlnaHQtZW5kc1xyXG4gICAgICAgIGlmIChNYXRoLmFicyhwb2ludC54IC0gc2VnbWVudEVuZFswXSkgPCB1dGlscy5FUFMgJiYgTWF0aC5hYnMocG9pbnQueSAtIHNlZ21lbnRFbmRbMV0pIDwgdXRpbHMuRVBTKSB7XHJcbiAgICAgICAgICAgIExwLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgLy8gY291bnQgaW5uZXIgcG9pbnRzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gZmlsdGVyIGxlZnQgZW5kc1xyXG4gICAgICAgICAgICBpZiAoIShNYXRoLmFicyhwb2ludC54IC0gc2VnbWVudEJlZ2luWzBdKSA8IHV0aWxzLkVQUyAmJiBNYXRoLmFicyhwb2ludC55IC0gc2VnbWVudEJlZ2luWzFdKSA8IHV0aWxzLkVQUykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh1dGlscy5kaXJlY3Rpb24oc2VnbWVudEJlZ2luLCBzZWdtZW50RW5kLCBbcG9pbnQueCwgcG9pbnQueV0pKSA8IHV0aWxzLkVQUyAmJiB1dGlscy5vblNlZ21lbnQoc2VnbWVudEJlZ2luLCBzZWdtZW50RW5kLCBbcG9pbnQueCwgcG9pbnQueV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ3AucHVzaChzZWdtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChbXS5jb25jYXQoVXAsIExwLCBDcCkubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIG91dHB1dC5pbnNlcnQocG9pbnQsIHBvaW50KTtcclxuICAgIH07XHJcblxyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBDcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHN0YXR1cy5yZW1vdmUoQ3Bbal0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN3ZWVwbGluZS5zZXRQb3NpdGlvbignYWZ0ZXInKTtcclxuXHJcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IFVwLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgaWYgKCFzdGF0dXMuY29udGFpbnMoVXBba10pKSB7XHJcbiAgICAgICAgICAgIHN0YXR1cy5pbnNlcnQoVXBba10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIGwgPSAwOyBsIDwgQ3AubGVuZ3RoOyBsKyspIHtcclxuICAgICAgICBpZiAoIXN0YXR1cy5jb250YWlucyhDcFtsXSkpIHtcclxuICAgICAgICAgICAgc3RhdHVzLmluc2VydChDcFtsXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChVcC5sZW5ndGggPT09IDAgJiYgQ3AubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBMcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcyA9IExwW2ldLFxyXG4gICAgICAgICAgICAgICAgc05vZGUgPSBzdGF0dXMuZmluZChzKSxcclxuICAgICAgICAgICAgICAgIHNsID0gc3RhdHVzLnByZXYoc05vZGUpLFxyXG4gICAgICAgICAgICAgICAgc3IgPSBzdGF0dXMubmV4dChzTm9kZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2wgJiYgc3IpIHtcclxuICAgICAgICAgICAgICAgIGZpbmROZXdFdmVudChzbC5rZXksIHNyLmtleSwgcG9pbnQsIG91dHB1dCwgcXVldWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzdGF0dXMucmVtb3ZlKHMpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIFVDcCA9IFtdLmNvbmNhdChVcCwgQ3ApLnNvcnQodXRpbHMuY29tcGFyZVNlZ21lbnRzKSxcclxuICAgICAgICAgICAgVUNwbWluID0gVUNwWzBdLFxyXG4gICAgICAgICAgICBzbGxOb2RlID0gc3RhdHVzLmZpbmQoVUNwbWluKSxcclxuICAgICAgICAgICAgVUNwbWF4ID0gVUNwW1VDcC5sZW5ndGgtMV0sXHJcbiAgICAgICAgICAgIHNyck5vZGUgPSBzdGF0dXMuZmluZChVQ3BtYXgpLFxyXG4gICAgICAgICAgICBzbGwgPSBzbGxOb2RlICYmIHN0YXR1cy5wcmV2KHNsbE5vZGUpLFxyXG4gICAgICAgICAgICBzcnIgPSBzcnJOb2RlICYmIHN0YXR1cy5uZXh0KHNyck5vZGUpO1xyXG5cclxuICAgICAgICBpZiAoc2xsICYmIFVDcG1pbikge1xyXG4gICAgICAgICAgICBmaW5kTmV3RXZlbnQoc2xsLmtleSwgVUNwbWluLCBwb2ludCwgb3V0cHV0LCBxdWV1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3JyICYmIFVDcG1heCkge1xyXG4gICAgICAgICAgICBmaW5kTmV3RXZlbnQoc3JyLmtleSwgVUNwbWF4LCBwb2ludCwgb3V0cHV0LCBxdWV1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IExwLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgIHN0YXR1cy5yZW1vdmUoTHBbcF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmROZXdFdmVudChzbCwgc3IsIHBvaW50LCBvdXRwdXQsIHF1ZXVlKSB7XHJcbiAgICB2YXIgaW50ZXJzZWN0aW9uQ29vcmRzID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNsLCBzciksXHJcbiAgICAgICAgaW50ZXJzZWN0aW9uUG9pbnQ7XHJcblxyXG4gICAgaWYgKGludGVyc2VjdGlvbkNvb3Jkcykge1xyXG4gICAgICAgIGludGVyc2VjdGlvblBvaW50ID0gbmV3IFBvaW50KGludGVyc2VjdGlvbkNvb3JkcywgJ2ludGVyc2VjdGlvbicpO1xyXG5cclxuICAgICAgICBpZiAoIW91dHB1dC5jb250YWlucyhpbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGludGVyc2VjdGlvblBvaW50LCBpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvdXRwdXQuaW5zZXJ0KGludGVyc2VjdGlvblBvaW50LCBpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XHJcbiIsInZhciBFUFMgPSAxRS05O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBhIHZlY3RvclxyXG4gKiBAcGFyYW0gYiB2ZWN0b3JcclxuICogQHBhcmFtIGMgdmVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBvblNlZ21lbnQoYSwgYiwgYykge1xyXG4gICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgeDMgPSBjWzBdLFxyXG4gICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICB5MiA9IGJbMV0sXHJcbiAgICAgICAgeTMgPSBjWzFdO1xyXG5cclxuICAgIHJldHVybiAoTWF0aC5taW4oeDEsIHgyKSA8PSB4MykgJiYgKHgzIDw9IE1hdGgubWF4KHgxLCB4MikpICYmXHJcbiAgICAgICAgICAgKE1hdGgubWluKHkxLCB5MikgPD0geTMpICYmICh5MyA8PSBNYXRoLm1heCh5MSwgeTIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIGFjIHggYmNcclxuICogQHBhcmFtIGEgdmVjdG9yXHJcbiAqIEBwYXJhbSBiIHZlY3RvclxyXG4gKiBAcGFyYW0gYyB2ZWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIGRpcmVjdGlvbihhLCBiLCBjKSB7XHJcbiAgICB2YXIgeDEgPSBhWzBdLFxyXG4gICAgICAgIHgyID0gYlswXSxcclxuICAgICAgICB4MyA9IGNbMF0sXHJcbiAgICAgICAgeTEgPSBhWzFdLFxyXG4gICAgICAgIHkyID0gYlsxXSxcclxuICAgICAgICB5MyA9IGNbMV07XHJcblxyXG4gICAgcmV0dXJuICh4MyAtIHgxKSAqICh5MiAtIHkxKSAtICh4MiAtIHgxKSAqICh5MyAtIHkxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBhIHNlZ21lbnQxXHJcbiAqIEBwYXJhbSBiIHNlZ21lbnQyXHJcbiAqL1xyXG5mdW5jdGlvbiBzZWdtZW50c0ludGVyc2VjdChhLCBiKSB7XHJcbiAgICB2YXIgcDEgPSBhWzBdLFxyXG4gICAgICAgIHAyID0gYVsxXSxcclxuICAgICAgICBwMyA9IGJbMF0sXHJcbiAgICAgICAgcDQgPSBiWzFdLFxyXG4gICAgICAgIGQxID0gZGlyZWN0aW9uKHAzLCBwNCwgcDEpLFxyXG4gICAgICAgIGQyID0gZGlyZWN0aW9uKHAzLCBwNCwgcDIpLFxyXG4gICAgICAgIGQzID0gZGlyZWN0aW9uKHAxLCBwMiwgcDMpLFxyXG4gICAgICAgIGQ0ID0gZGlyZWN0aW9uKHAxLCBwMiwgcDQpO1xyXG5cclxuICAgIGlmICgoKGQxID4gMCAmJiBkMiA8IDApIHx8IChkMSA8IDAgJiYgZDIgPiAwKSkgJiYgKChkMyA+IDAgJiYgZDQgPCAwKSB8fCAoZDMgPCAwICYmIGQ0ID4gMCkpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQxID09PSAwICYmIG9uU2VnbWVudChwMywgcDQsIHAxKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChkMiA9PT0gMCAmJiBvblNlZ21lbnQocDMsIHA0LCBwMikpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoZDMgPT09IDAgJiYgb25TZWdtZW50KHAxLCBwMiwgcDMpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGQ0ID09PSAwICYmIG9uU2VnbWVudChwMSwgcDIsIHA0KSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogQHBhcmFtIGEgc2VnbWVudDFcclxuICogQHBhcmFtIGIgc2VnbWVudDJcclxuICovXHJcbmZ1bmN0aW9uIGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbiAoYSwgYikge1xyXG4gICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICB2YXIgeCA9ICgoeDEgKiB5MiAtIHkxICogeDIpICogKHgzIC0geDQpIC0gKHgxIC0geDIpICogKHgzICogeTQgLSB5MyAqIHg0KSkgL1xyXG4gICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgdmFyIHkgPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgICAgICAoKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpKTtcclxuICAgIGlmIChpc05hTih4KXx8aXNOYU4oeSkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh4MSA+PSB4Mikge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeDIsIHgsIHgxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHgxLCB4LCB4MikpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoeTEgPj0geTIpIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHkyLCB5LCB5MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih5MSwgeSwgeTIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHgzID49IHg0KSB7XHJcbiAgICAgICAgICAgIGlmICghYmV0d2Vlbih4NCwgeCwgeDMpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeDMsIHgsIHg0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh5MyA+PSB5NCkge1xyXG4gICAgICAgICAgICBpZiAoIWJldHdlZW4oeTQsIHksIHkzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFiZXR3ZWVuKHkzLCB5LCB5NCkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBbeCwgeV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJldHdlZW4gKGEsIGIsIGMpIHtcclxuICAgIHJldHVybiBhIC0gRVBTIDw9IGIgJiYgYiA8PSBjICsgRVBTO1xyXG59XHJcblxyXG4vKipcclxuICogQHBhcmFtIGEgc2VnbWVudDFcclxuICogQHBhcmFtIGIgc2VnbWVudDJcclxuICovXHJcbmZ1bmN0aW9uIGNvbXBhcmVTZWdtZW50cyhhLCBiKSB7XHJcbiAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICB2YXIgY3VycmVudFgsXHJcbiAgICAgICAgYXksXHJcbiAgICAgICAgYnksXHJcbiAgICAgICAgZGVsdGFZLFxyXG4gICAgICAgIGRlbHRhWDEsXHJcbiAgICAgICAgZGVsdGFYMjtcclxuXHJcbiAgICBpZiAoYSA9PT0gYikge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGN1cnJlbnRYID0gdGhpcy54O1xyXG4gICAgYXkgPSBnZXRZKGEsIGN1cnJlbnRYKTtcclxuICAgIGJ5ID0gZ2V0WShiLCBjdXJyZW50WCk7XHJcbiAgICBkZWx0YVkgPSBheSAtIGJ5O1xyXG5cclxuICAgIGlmIChNYXRoLmFicyhkZWx0YVkpID4gRVBTKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhWSA8IDAgPyAtMSA6IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBhU2xvcGUgPSBnZXRTbG9wZShhKSxcclxuICAgICAgICAgICAgYlNsb3BlID0gZ2V0U2xvcGUoYik7XHJcblxyXG4gICAgICAgIGlmIChhU2xvcGUgIT09IGJTbG9wZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2JlZm9yZScpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhU2xvcGUgPiBiU2xvcGUgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYVNsb3BlID4gYlNsb3BlID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsdGFYMSA9IHgxIC0geDM7XHJcblxyXG4gICAgaWYgKGRlbHRhWDEgIT09IDApIHtcclxuICAgICAgICByZXR1cm4gZGVsdGFYMSA8IDAgPyAtMSA6IDE7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsdGFYMiA9IHgyIC0geDQ7XHJcblxyXG4gICAgaWYgKGRlbHRhWDIgIT09IDApIHtcclxuICAgICAgICByZXR1cm4gZGVsdGFYMiA8IDAgPyAtMSA6IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIDA7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIGEgcG9pbnQxXHJcbiAqIEBwYXJhbSBiIHBvaW50MlxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGFyZVBvaW50cyhhLCBiKSB7XHJcbiAgICB2YXIgYUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGEpLFxyXG4gICAgICAgIGJJc0FycmF5ID0gQXJyYXkuaXNBcnJheShiKSxcclxuICAgICAgICB4MSA9IGFJc0FycmF5ID8gYVswXSA6IGEueCxcclxuICAgICAgICB5MSA9IGFJc0FycmF5ID8gYVsxXSA6IGEueSxcclxuICAgICAgICB4MiA9IGJJc0FycmF5ID8gYlswXSA6IGIueCxcclxuICAgICAgICB5MiA9IGJJc0FycmF5ID8gYlsxXSA6IGIueTtcclxuXHJcbiAgICBpZiAoeDEgLSB4MiA+IEVQUyB8fCAoTWF0aC5hYnMoeDEgLSB4MikgPCBFUFMgJiYgeTEgLSB5MiA+IEVQUykpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH0gZWxzZSBpZiAoeDIgLSB4MSA+IEVQUyB8fCAoTWF0aC5hYnMoeDEgLSB4MikgPCBFUFMgJiYgeTIgLSB5MSA+IEVQUykpIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9IGVsc2UgaWYgKE1hdGguYWJzKHgxIC0geDIpIDwgRVBTICYmIE1hdGguYWJzKHkxIC0geTIpIDwgRVBTICkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTbG9wZShzZWdtZW50KSB7XHJcbiAgICB2YXIgeDEgPSBzZWdtZW50WzBdWzBdLFxyXG4gICAgICAgIHkxID0gc2VnbWVudFswXVsxXSxcclxuICAgICAgICB4MiA9IHNlZ21lbnRbMV1bMF0sXHJcbiAgICAgICAgeTIgPSBzZWdtZW50WzFdWzFdO1xyXG5cclxuICAgIGlmICh4MSA9PT0geDIpIHtcclxuICAgICAgICByZXR1cm4gKHkxIDwgeTIpID8gSW5maW5pdHkgOiAtIEluZmluaXR5O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKHkyIC0geTEpIC8gKHgyIC0geDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0WShzZWdtZW50LCB4KSB7XHJcbiAgICB2YXIgYmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgIGVuZCA9IHNlZ21lbnRbMV0sXHJcbiAgICAgICAgc3BhbiA9IHNlZ21lbnRbMV1bMF0gLSBzZWdtZW50WzBdWzBdLFxyXG4gICAgICAgIGRlbHRhWDAsXHJcbiAgICAgICAgZGVsdGFYMSxcclxuICAgICAgICBpZmFjLFxyXG4gICAgICAgIGZhYztcclxuXHJcbiAgICBpZiAoeCA8PSBiZWdpblswXSkge1xyXG4gICAgICAgIHJldHVybiBiZWdpblsxXTtcclxuICAgIH0gZWxzZSBpZiAoeCA+PSBlbmRbMF0pIHtcclxuICAgICAgICByZXR1cm4gZW5kWzFdO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbHRhWDAgPSB4IC0gYmVnaW5bMF07XHJcbiAgICBkZWx0YVgxID0gZW5kWzBdIC0geDtcclxuXHJcbiAgICBpZiAoZGVsdGFYMCA+IGRlbHRhWDEpIHtcclxuICAgICAgICBpZmFjID0gZGVsdGFYMCAvIHNwYW5cclxuICAgICAgICBmYWMgPSAxIC0gaWZhYztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmFjID0gZGVsdGFYMSAvIHNwYW5cclxuICAgICAgICBpZmFjID0gMSAtIGZhYztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKGJlZ2luWzFdICogZmFjKSArIChlbmRbMV0gKiBpZmFjKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgRVBTOiBFUFMsXHJcbiAgICBvblNlZ21lbnQ6IG9uU2VnbWVudCxcclxuICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgc2VnbWVudHNJbnRlcnNlY3Q6IHNlZ21lbnRzSW50ZXJzZWN0LFxyXG4gICAgZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uOiBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb24sXHJcbiAgICBjb21wYXJlU2VnbWVudHM6IGNvbXBhcmVTZWdtZW50cyxcclxuICAgIGNvbXBhcmVQb2ludHM6IGNvbXBhcmVQb2ludHNcclxufVxyXG4iLCJ2YXIgUG9pbnQgPSBmdW5jdGlvbiAoY29vcmRzLCB0eXBlKSB7XHJcbiAgICB0aGlzLnggPSBjb29yZHNbMF07XHJcbiAgICB0aGlzLnkgPSBjb29yZHNbMV07XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgdGhpcy5zZWdtZW50cyA9IFtdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xyXG4iLCJmdW5jdGlvbiBTd2VlcGxpbmUocG9zaXRpb24pIHtcclxuICAgIHRoaXMueCA9IG51bGw7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbn1cclxuXHJcblN3ZWVwbGluZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcclxuICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxufVxyXG5Td2VlcGxpbmUucHJvdG90eXBlLnNldFggPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgdGhpcy54ID0geDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTd2VlcGxpbmU7XHJcbiJdfQ==
