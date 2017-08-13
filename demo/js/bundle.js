(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var findIntersections = require('../../index.js');

var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}),
    point = L.latLng([55.753210, 37.621766]),
    map = new L.Map('map', { layers: [osm], center: point, zoom: 12, maxZoom: 22 }),
    root = document.getElementById('content');

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

var points = turf.random('points', 16, {
    bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
});

var coords = points.features.map(function (feature) {
    return feature.geometry.coordinates;
});

for (var i = 0; i < coords.length; i += 2) {
    lines.push([coords[i], coords[i + 1]]);

    var begin = [coords[i][1], coords[i][0]],
        end = [coords[i + 1][1], coords[i + 1][0]];

    L.circleMarker(L.latLng(begin), { radius: 2, fillColor: "#FFFF00", weight: 2 }).addTo(map);
    L.circleMarker(L.latLng(end), { radius: 2, fillColor: "#FFFF00", weight: 2 }).addTo(map);
    L.polyline([begin, end], { weight: 1 }).addTo(map);
}

var ps = findIntersections(lines, map);

ps.forEach(function (p) {
    L.circleMarker(L.latLng(p.slice().reverse()), { radius: 5, color: 'green', fillColor: 'yellow' }).addTo(map);
});
window.map = map;

},{"../../index.js":2}],2:[function(require,module,exports){
var findIntersections = require('./src/sweepline.js');

module.exports = findIntersections;

},{"./src/sweepline.js":5}],3:[function(require,module,exports){
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
var utils = require('./utils');

function handleEventPoint(point, queue, status) {
    var p = point.data.point;
    // 1
    var up = point.data.segment;
    var ups = up ? [up] : [];
    var lps = [];
    var cps = [];

    var result = [];

    // 1. Initialize event queue EQ = all segment endpoints
    status.forEach(function (node) {
        var segment = node.data,
            begin = segment[0],
            end = segment[1];

        // find lower intersection
        if (p[0] === end[0] && p[1] === end[1]) {
            lps.push(segment);
        }

        // find inner intersections
        if (utils.pointOnLine(segment, p)) {
            cps.push(segment);
        }
    });

    // 3
    if (ups.concat(lps).concat(cps).length > 1) {
        // 4
        result.push(p);
    }

    // 5
    removeFromTree(lps, status);
    removeFromTree(cps, status);

    // 6
    insertIntoTree(ups, status);
    insertIntoTree(cps, status);

    // console.log(status);

    return result;
}

function removeFromTree(arr, tree) {
    arr.forEach(function (item) {
        tree.remove(item);
    });
}

function insertIntoTree(arr, tree) {
    arr.forEach(function (item) {
        tree.insert(item);
    });
}

module.exports = handleEventPoint;

},{"./utils":6}],5:[function(require,module,exports){
var Tree = require('avl');
var handleEventPoint = require('./handleeventpoint');
var utils = require('./utils');

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
    var values = queue.values();

    values.forEach(function (value, index, array) {
        var p = value.point;
        var ll = L.latLng([p[1], p[0]]);
        var mrk = L.circleMarker(ll, { radius: 4, color: 'red', fillColor: 'FF00' + 2 ** index }).addTo(map);
        mrk.bindPopup('' + index + '\n' + p[0] + '\n' + p[1]);
    });

    var i = 0;
    /*
     * LOG END
     */
    while (!queue.isEmpty()) {
        var event = queue.pop();

        if (event.data.type === 'begin') {

            status.insert(event.data.segment);
            var segE = status.find(event.data.segment);

            /*
             * LOG
             */
            var adding = segE.key;
            var lls = adding.map(function (p) {
                return L.latLng(p.slice().reverse());
            });
            var line = L.polyline(lls).addTo(map);

            line.bindPopup('' + i);

            i++;

            console.log('now adding segment: ');
            adding.forEach(function (p) {
                console.log('x: ' + p[0] + ' y: ' + p[1]);
            });
            /*
             * LOG END
             */

            var segA = status.prev(segE);
            var segB = status.next(segE);
            console.log(segA);
            console.log(segB);

            if (segA) {
                var eaIntersectionPoint = utils.findSegmentsIntersection(segE.key, segA.key);

                if (eaIntersectionPoint) {
                    var eaIntersectionPointData = {
                        point: eaIntersectionPoint,
                        type: 'intersection',
                        segments: [segE.key, segA.key]
                    };
                    queue.insert(eaIntersectionPoint, eaIntersectionPointData);
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
                }
            }
            //         Else If (E is a right endpoint) {
        } else if (event.data.type === 'end') {
            var segE = status.find(event.data.segment);
            var segA = status.prev(segE);
            var segB = status.next(segE);

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
            result.push(event.data.point);
            //             Let segE1 above segE2 be E's intersecting segments in SL;
            var seg1 = status.find(event.data.segments[0]),
                seg2 = status.find(event.data.segments[1]);

            //             Swap their positions so that segE2 is now above segE1;
            console.log(status);
            // status.prev(seg1) = status.find(seg2);
            // status.next(seg2) = status.find(seg1);
            //             Let segA = the segment above segE2 in SL;
            var segA = status.prev(seg2);
            //             Let segB = the segment below segE1 in SL;
            var segB = status.next(seg1);

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
                    }
                }
            }
        }
    }

    status.values().forEach(function (value, index, array) {

        lls = value.map(function (p) {
            return L.latLng(p.slice().reverse());
        });

        var line = L.polyline(lls).addTo(map);
        line.bindPopup('' + index);
    });
    console.log(result);
    return result;
}

module.exports = findIntersections;

},{"./handleeventpoint":4,"./utils":6,"avl":3}],6:[function(require,module,exports){
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

        // var x3 = a[0][0],
        //     y3 = a[0][1],
        //     x4 = a[1][0],
        //     y4 = a[1][1],
        //     x1 = b[0][0],
        //     y1 = b[0][1],
        //     x2 = b[1][0],
        //     y2 = b[1][1];

        var D = (x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1);

        var v1 = [x2 - x1, y2 - y1],
            v2 = [x4 - x3, y4 - y3];

        var mult = v1[0] * v2[1] - v1[1] * v2[0];

        if (D < 0) {
            return -1;
        } else if (D > 0) {
            return 1;
        } else if (D === 0) {
            return 0;
        }
        // if (y1 > y3) {
        //     return 1;
        // } else if (y1 < y3) {
        //     return -1;
        // } else if (y1 === y3) {
        //     return 0;
        // }
        // if (mult > 0) {
        //     return 1;
        // } else if (mult < 0) {
        //     return -1;
        // } else if (mult === 0) {
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
    }
};

module.exports = utils;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxqc1xcYXBwLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXZsL2Rpc3QvYXZsLmpzIiwic3JjXFxoYW5kbGVldmVudHBvaW50LmpzIiwic3JjXFxzd2VlcGxpbmUuanMiLCJzcmNcXHV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUMsSUFBSSxvQkFBb0IsUUFBUSxnQkFBUixDQUF4Qjs7QUFFRCxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxNQUFNLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJDLEVBQXlDLFNBQVMsRUFBbEQsRUFBakIsQ0FMVjtBQUFBLElBTUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FOWDs7QUFRQSxJQUFJLFNBQVMsSUFBSSxTQUFKLEVBQWI7QUFBQSxJQUNJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBRDFCO0FBQUEsSUFFSSxJQUFJLE9BQU8sVUFBUCxDQUFrQixHQUYxQjtBQUFBLElBR0ksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FIMUI7QUFBQSxJQUlJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBSjFCO0FBQUEsSUFLSSxTQUFTLElBQUksQ0FMakI7QUFBQSxJQU1JLFFBQVEsSUFBSSxDQU5oQjtBQUFBLElBT0ksVUFBVSxTQUFTLENBUHZCO0FBQUEsSUFRSSxTQUFTLFFBQVEsQ0FSckI7QUFBQSxJQVNJLFFBQVEsRUFUWjs7QUFXQSxJQUFJLFNBQVMsS0FBSyxNQUFMLENBQVksUUFBWixFQUFzQixFQUF0QixFQUEwQjtBQUNuQyxVQUFNLENBQUMsSUFBSSxNQUFMLEVBQWEsSUFBSSxPQUFqQixFQUEwQixJQUFJLE1BQTlCLEVBQXNDLElBQUksT0FBMUM7QUFENkIsQ0FBMUIsQ0FBYjs7QUFJQSxJQUFJLFNBQVMsT0FBTyxRQUFQLENBQWdCLEdBQWhCLENBQW9CLFVBQVMsT0FBVCxFQUFrQjtBQUMvQyxXQUFPLFFBQVEsUUFBUixDQUFpQixXQUF4QjtBQUNILENBRlksQ0FBYjs7QUFJQSxLQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxNQUEzQixFQUFtQyxLQUFHLENBQXRDLEVBQXlDO0FBQ3JDLFVBQU0sSUFBTixDQUFXLENBQUMsT0FBTyxDQUFQLENBQUQsRUFBWSxPQUFPLElBQUUsQ0FBVCxDQUFaLENBQVg7O0FBRUEsUUFBSSxRQUFRLENBQUMsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFELEVBQWUsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFmLENBQVo7QUFBQSxRQUNJLE1BQU0sQ0FBQyxPQUFPLElBQUUsQ0FBVCxFQUFZLENBQVosQ0FBRCxFQUFpQixPQUFPLElBQUUsQ0FBVCxFQUFZLENBQVosQ0FBakIsQ0FEVjs7QUFHQSxNQUFFLFlBQUYsQ0FBZSxFQUFFLE1BQUYsQ0FBUyxLQUFULENBQWYsRUFBZ0MsRUFBQyxRQUFRLENBQVQsRUFBWSxXQUFXLFNBQXZCLEVBQWtDLFFBQVEsQ0FBMUMsRUFBaEMsRUFBOEUsS0FBOUUsQ0FBb0YsR0FBcEY7QUFDQSxNQUFFLFlBQUYsQ0FBZSxFQUFFLE1BQUYsQ0FBUyxHQUFULENBQWYsRUFBOEIsRUFBQyxRQUFRLENBQVQsRUFBWSxXQUFXLFNBQXZCLEVBQWtDLFFBQVEsQ0FBMUMsRUFBOUIsRUFBNEUsS0FBNUUsQ0FBa0YsR0FBbEY7QUFDQSxNQUFFLFFBQUYsQ0FBVyxDQUFDLEtBQUQsRUFBUSxHQUFSLENBQVgsRUFBeUIsRUFBQyxRQUFRLENBQVQsRUFBekIsRUFBc0MsS0FBdEMsQ0FBNEMsR0FBNUM7QUFDSDs7QUFFRCxJQUFJLEtBQUssa0JBQWtCLEtBQWxCLEVBQXlCLEdBQXpCLENBQVQ7O0FBRUEsR0FBRyxPQUFILENBQVcsVUFBVSxDQUFWLEVBQWE7QUFDcEIsTUFBRSxZQUFGLENBQWUsRUFBRSxNQUFGLENBQVMsRUFBRSxLQUFGLEdBQVUsT0FBVixFQUFULENBQWYsRUFBOEMsRUFBQyxRQUFRLENBQVQsRUFBWSxPQUFPLE9BQW5CLEVBQTRCLFdBQVcsUUFBdkMsRUFBOUMsRUFBZ0csS0FBaEcsQ0FBc0csR0FBdEc7QUFDSCxDQUZEO0FBR0EsT0FBTyxHQUFQLEdBQWEsR0FBYjs7O0FDN0NBLElBQUksb0JBQW9CLFFBQVEsb0JBQVIsQ0FBeEI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQjs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxbkJBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBWjs7QUFFQSxTQUFTLGdCQUFULENBQTBCLEtBQTFCLEVBQWlDLEtBQWpDLEVBQXdDLE1B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QVBSOztBQVNBLGVBQVEsQ0FBQyxJQUFJLEVBQUwsS0FBWSxLQUFLLEVBQWpCLElBQXVCLENBQUMsSUFBSSxFQUFMLEtBQVksS0FBSyxFQUFqQixDQUF2QixLQUFnRCxDQUFqRCxLQUF5RCxJQUFJLEVBQUosSUFBVSxJQUFJLEVBQWYsSUFBdUIsSUFBSSxFQUFKLElBQVUsSUFBSSxFQUE3RixDQUFQO0FBQ0g7QUF4S08sQ0FBWjs7QUEyS0EsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiB2YXIgZmluZEludGVyc2VjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9pbmRleC5qcycpO1xyXG5cclxudmFyIG9zbSA9IEwudGlsZUxheWVyKCdodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9ub2xhYmVscy97en0ve3h9L3t5fS5wbmcnLCB7XHJcbiAgICAgICAgbWF4Wm9vbTogMjIsXHJcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4nXHJcbiAgICB9KSxcclxuICAgIHBvaW50ID0gTC5sYXRMbmcoWzU1Ljc1MzIxMCwgMzcuNjIxNzY2XSksXHJcbiAgICBtYXAgPSBuZXcgTC5NYXAoJ21hcCcsIHtsYXllcnM6IFtvc21dLCBjZW50ZXI6IHBvaW50LCB6b29tOiAxMiwgbWF4Wm9vbTogMjJ9KSxcclxuICAgIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xyXG5cclxudmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKSxcclxuICAgIG4gPSBib3VuZHMuX25vcnRoRWFzdC5sYXQsXHJcbiAgICBlID0gYm91bmRzLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgcyA9IGJvdW5kcy5fc291dGhXZXN0LmxhdCxcclxuICAgIHcgPSBib3VuZHMuX3NvdXRoV2VzdC5sbmcsXHJcbiAgICBoZWlnaHQgPSBuIC0gcyxcclxuICAgIHdpZHRoID0gZSAtIHcsXHJcbiAgICBxSGVpZ2h0ID0gaGVpZ2h0IC8gNCxcclxuICAgIHFXaWR0aCA9IHdpZHRoIC8gNCxcclxuICAgIGxpbmVzID0gW107XHJcblxyXG52YXIgcG9pbnRzID0gdHVyZi5yYW5kb20oJ3BvaW50cycsIDE2LCB7XHJcbiAgICBiYm94OiBbdyArIHFXaWR0aCwgcyArIHFIZWlnaHQsIGUgLSBxV2lkdGgsIG4gLSBxSGVpZ2h0XVxyXG59KTtcclxuXHJcbnZhciBjb29yZHMgPSBwb2ludHMuZmVhdHVyZXMubWFwKGZ1bmN0aW9uKGZlYXR1cmUpIHtcclxuICAgIHJldHVybiBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xyXG59KVxyXG5cclxuZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICBsaW5lcy5wdXNoKFtjb29yZHNbaV0sIGNvb3Jkc1tpKzFdXSk7XHJcblxyXG4gICAgdmFyIGJlZ2luID0gW2Nvb3Jkc1tpXVsxXSwgY29vcmRzW2ldWzBdXSxcclxuICAgICAgICBlbmQgPSBbY29vcmRzW2krMV1bMV0sIGNvb3Jkc1tpKzFdWzBdXTtcclxuXHJcbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhiZWdpbiksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XHJcbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhlbmQpLCB7cmFkaXVzOiAyLCBmaWxsQ29sb3I6IFwiI0ZGRkYwMFwiLCB3ZWlnaHQ6IDJ9KS5hZGRUbyhtYXApO1xyXG4gICAgTC5wb2x5bGluZShbYmVnaW4sIGVuZF0sIHt3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xyXG59XHJcblxyXG52YXIgcHMgPSBmaW5kSW50ZXJzZWN0aW9ucyhsaW5lcywgbWFwKTtcclxuXHJcbnBzLmZvckVhY2goZnVuY3Rpb24gKHApIHtcclxuICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpLCB7cmFkaXVzOiA1LCBjb2xvcjogJ2dyZWVuJywgZmlsbENvbG9yOiAneWVsbG93J30pLmFkZFRvKG1hcCk7XHJcbn0pXHJcbndpbmRvdy5tYXAgPSBtYXA7XHJcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4vc3JjL3N3ZWVwbGluZS5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW50ZXJzZWN0aW9ucztcclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmF2bCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQcmludHMgdHJlZSBob3Jpem9udGFsbHlcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcHJpbnQgKHJvb3QsIHByaW50Tm9kZSkge1xuICBpZiAoIHByaW50Tm9kZSA9PT0gdm9pZCAwICkgcHJpbnROb2RlID0gZnVuY3Rpb24gKG4pIHsgcmV0dXJuIG4ua2V5OyB9O1xuXG4gIHZhciBvdXQgPSBbXTtcbiAgcm93KHJvb3QsICcnLCB0cnVlLCBmdW5jdGlvbiAodikgeyByZXR1cm4gb3V0LnB1c2godik7IH0sIHByaW50Tm9kZSk7XG4gIHJldHVybiBvdXQuam9pbignJyk7XG59XG5cbi8qKlxuICogUHJpbnRzIGxldmVsIG9mIHRoZSB0cmVlXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgcHJlZml4XG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgIGlzVGFpbFxuICogQHBhcmFtICB7RnVuY3Rpb24oaW46c3RyaW5nKTp2b2lkfSAgICBvdXRcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSAgcHJpbnROb2RlXG4gKi9cbmZ1bmN0aW9uIHJvdyAocm9vdCwgcHJlZml4LCBpc1RhaWwsIG91dCwgcHJpbnROb2RlKSB7XG4gIGlmIChyb290KSB7XG4gICAgb3V0KChcIlwiICsgcHJlZml4ICsgKGlzVGFpbCA/ICfilJTilIDilIAgJyA6ICfilJzilIDilIAgJykgKyAocHJpbnROb2RlKHJvb3QpKSArIFwiXFxuXCIpKTtcbiAgICB2YXIgaW5kZW50ID0gcHJlZml4ICsgKGlzVGFpbCA/ICcgICAgJyA6ICfilIIgICAnKTtcbiAgICBpZiAocm9vdC5sZWZ0KSAgeyByb3cocm9vdC5sZWZ0LCAgaW5kZW50LCBmYWxzZSwgb3V0LCBwcmludE5vZGUpOyB9XG4gICAgaWYgKHJvb3QucmlnaHQpIHsgcm93KHJvb3QucmlnaHQsIGluZGVudCwgdHJ1ZSwgIG91dCwgcHJpbnROb2RlKTsgfVxuICB9XG59XG5cblxuLyoqXG4gKiBJcyB0aGUgdHJlZSBiYWxhbmNlZCAobm9uZSBvZiB0aGUgc3VidHJlZXMgZGlmZmVyIGluIGhlaWdodCBieSBtb3JlIHRoYW4gMSlcbiAqIEBwYXJhbSAge05vZGV9ICAgIHJvb3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQmFsYW5jZWQocm9vdCkge1xuICBpZiAocm9vdCA9PT0gbnVsbCkgeyByZXR1cm4gdHJ1ZTsgfSAvLyBJZiBub2RlIGlzIGVtcHR5IHRoZW4gcmV0dXJuIHRydWVcblxuICAvLyBHZXQgdGhlIGhlaWdodCBvZiBsZWZ0IGFuZCByaWdodCBzdWIgdHJlZXNcbiAgdmFyIGxoID0gaGVpZ2h0KHJvb3QubGVmdCk7XG4gIHZhciByaCA9IGhlaWdodChyb290LnJpZ2h0KTtcblxuICBpZiAoTWF0aC5hYnMobGggLSByaCkgPD0gMSAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LmxlZnQpICAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LnJpZ2h0KSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIElmIHdlIHJlYWNoIGhlcmUgdGhlbiB0cmVlIGlzIG5vdCBoZWlnaHQtYmFsYW5jZWRcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBDb21wdXRlIHRoZSAnaGVpZ2h0JyBvZiBhIHRyZWUuXG4gKiBIZWlnaHQgaXMgdGhlIG51bWJlciBvZiBub2RlcyBhbG9uZyB0aGUgbG9uZ2VzdCBwYXRoXG4gKiBmcm9tIHRoZSByb290IG5vZGUgZG93biB0byB0aGUgZmFydGhlc3QgbGVhZiBub2RlLlxuICpcbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gaGVpZ2h0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPyAoMSArIE1hdGgubWF4KGhlaWdodChub2RlLmxlZnQpLCBoZWlnaHQobm9kZS5yaWdodCkpKSA6IDA7XG59XG5cbi8vIGZ1bmN0aW9uIGNyZWF0ZU5vZGUgKHBhcmVudCwgbGVmdCwgcmlnaHQsIGhlaWdodCwga2V5LCBkYXRhKSB7XG4vLyAgIHJldHVybiB7IHBhcmVudCwgbGVmdCwgcmlnaHQsIGJhbGFuY2VGYWN0b3I6IGhlaWdodCwga2V5LCBkYXRhIH07XG4vLyB9XG5cbi8qKlxuICogQHR5cGVkZWYge3tcbiAqICAgcGFyZW50OiAgICAgICAgTm9kZXxOdWxsLFxuICogICBsZWZ0OiAgICAgICAgICBOb2RlfE51bGwsXG4gKiAgIHJpZ2h0OiAgICAgICAgIE5vZGV8TnVsbCxcbiAqICAgYmFsYW5jZUZhY3RvcjogTnVtYmVyLFxuICogICBrZXk6ICAgICAgICAgICBhbnksXG4gKiAgIGRhdGE6ICAgICAgICAgIG9iamVjdD9cbiAqIH19IE5vZGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsqfSBLZXlcbiAqL1xuXG4vKipcbiAqIERlZmF1bHQgY29tcGFyaXNvbiBmdW5jdGlvblxuICogQHBhcmFtIHsqfSBhXG4gKiBAcGFyYW0geyp9IGJcbiAqL1xuZnVuY3Rpb24gREVGQVVMVF9DT01QQVJFIChhLCBiKSB7IHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDsgfVxuXG5cbi8qKlxuICogU2luZ2xlIGxlZnQgcm90YXRpb25cbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZUxlZnQgKG5vZGUpIHtcbiAgdmFyIHJpZ2h0Tm9kZSA9IG5vZGUucmlnaHQ7XG4gIG5vZGUucmlnaHQgICAgPSByaWdodE5vZGUubGVmdDtcblxuICBpZiAocmlnaHROb2RlLmxlZnQpIHsgcmlnaHROb2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIHJpZ2h0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAocmlnaHROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LmxlZnQgPSByaWdodE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQucmlnaHQgPSByaWdodE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSByaWdodE5vZGU7XG4gIHJpZ2h0Tm9kZS5sZWZ0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSByaWdodE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG4gIHJldHVybiByaWdodE5vZGU7XG59XG5cblxuZnVuY3Rpb24gcm90YXRlUmlnaHQgKG5vZGUpIHtcbiAgdmFyIGxlZnROb2RlID0gbm9kZS5sZWZ0O1xuICBub2RlLmxlZnQgPSBsZWZ0Tm9kZS5yaWdodDtcbiAgaWYgKG5vZGUubGVmdCkgeyBub2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIGxlZnROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAobGVmdE5vZGUucGFyZW50KSB7XG4gICAgaWYgKGxlZnROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9IGxlZnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQucmlnaHQgPSBsZWZ0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IGxlZnROb2RlO1xuICBsZWZ0Tm9kZS5yaWdodCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmV0dXJuIGxlZnROb2RlO1xufVxuXG5cbi8vIGZ1bmN0aW9uIGxlZnRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHJvdGF0ZUxlZnQobm9kZS5sZWZ0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZVJpZ2h0KG5vZGUpO1xuLy8gfVxuXG5cbi8vIGZ1bmN0aW9uIHJpZ2h0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSByb3RhdGVSaWdodChub2RlLnJpZ2h0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZUxlZnQobm9kZSk7XG4vLyB9XG5cblxudmFyIFRyZWUgPSBmdW5jdGlvbiBUcmVlIChjb21wYXJhdG9yKSB7XG4gIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yIHx8IERFRkFVTFRfQ09NUEFSRTtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG4gIHRoaXMuX3NpemUgPSAwO1xufTtcblxudmFyIHByb3RvdHlwZUFjY2Vzc29ycyA9IHsgc2l6ZToge30gfTtcblxuXG4vKipcbiAqIENsZWFyIHRoZSB0cmVlXG4gKi9cblRyZWUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG59O1xuXG4vKipcbiAqIE51bWJlciBvZiBub2Rlc1xuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5wcm90b3R5cGVBY2Nlc3NvcnMuc2l6ZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9zaXplO1xufTtcblxuXG4vKipcbiAqIFdoZXRoZXIgdGhlIHRyZWUgY29udGFpbnMgYSBub2RlIHdpdGggdGhlIGdpdmVuIGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zIChrZXkpIHtcbiAgaWYgKHRoaXMuX3Jvb3Qpe1xuICAgIHZhciBub2RlICAgICA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuICAgIHdoaWxlIChub2RlKXtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGtleSwgbm9kZS5rZXkpO1xuICAgICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblxuLyogZXNsaW50LWRpc2FibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG4vKipcbiAqIFN1Y2Nlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gbmV4dCAobm9kZSkge1xuICB2YXIgc3VjY2Vzc29yID0gbm9kZTtcbiAgaWYgKHN1Y2Nlc3Nvcikge1xuICAgIGlmIChzdWNjZXNzb3IucmlnaHQpIHtcbiAgICAgIHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5yaWdodDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLmxlZnQpIHsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLmxlZnQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5yaWdodCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gc3VjY2Vzc29yOyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3VjY2Vzc29yO1xufTtcblxuXG4vKipcbiAqIFByZWRlY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiBwcmV2IChub2RlKSB7XG4gIHZhciBwcmVkZWNlc3NvciA9IG5vZGU7XG4gIGlmIChwcmVkZWNlc3Nvcikge1xuICAgIGlmIChwcmVkZWNlc3Nvci5sZWZ0KSB7XG4gICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLmxlZnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IucmlnaHQpIHsgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5yaWdodDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmVkZWNlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLmxlZnQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHByZWRlY2Vzc29yO1xuICAgICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByZWRlY2Vzc29yO1xufTtcbi8qIGVzbGludC1lbmFibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG5cbi8qKlxuICogQHBhcmFte0Z1bmN0aW9uKG5vZGU6Tm9kZSk6dm9pZH0gZm5cbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cblRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoIChmbikge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIGRvbmUgPSBmYWxzZSwgaSA9IDA7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgLy8gUmVhY2ggdGhlIGxlZnQgbW9zdCBOb2RlIG9mIHRoZSBjdXJyZW50IE5vZGVcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgLy8gUGxhY2UgcG9pbnRlciB0byBhIHRyZWUgbm9kZSBvbiB0aGUgc3RhY2tcbiAgICAgIC8vIGJlZm9yZSB0cmF2ZXJzaW5nIHRoZSBub2RlJ3MgbGVmdCBzdWJ0cmVlXG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCYWNrVHJhY2sgZnJvbSB0aGUgZW1wdHkgc3VidHJlZSBhbmQgdmlzaXQgdGhlIE5vZGVcbiAgICAgIC8vIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrOyBob3dldmVyLCBpZiB0aGUgc3RhY2sgaXNcbiAgICAgIC8vIGVtcHR5IHlvdSBhcmUgZG9uZVxuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgZm4oY3VycmVudCwgaSsrKTtcblxuICAgICAgICAvLyBXZSBoYXZlIHZpc2l0ZWQgdGhlIG5vZGUgYW5kIGl0cyBsZWZ0XG4gICAgICAgIC8vIHN1YnRyZWUuIE5vdywgaXQncyByaWdodCBzdWJ0cmVlJ3MgdHVyblxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYWxsIGtleXMgaW4gb3JkZXJcbiAqIEByZXR1cm4ge0FycmF5PEtleT59XG4gKi9cblRyZWUucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiBrZXlzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQua2V5KTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGBkYXRhYCBmaWVsZHMgb2YgYWxsIG5vZGVzIGluIG9yZGVyLlxuICogQHJldHVybiB7QXJyYXk8Kj59XG4gKi9cblRyZWUucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmRhdGEpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtaW5pbXVtIGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5taW5Ob2RlID0gZnVuY3Rpb24gbWluTm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWF4IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5tYXhOb2RlID0gZnVuY3Rpb24gbWF4Tm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIE1pbiBrZXlcbiAqIEByZXR1cm4ge0tleX1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gbWluICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cbi8qKlxuICogTWF4IGtleVxuICogQHJldHVybiB7S2V5fE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uIG1heCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cblxuLyoqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eSAoKSB7XG4gIHJldHVybiAhdGhpcy5fcm9vdDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBub2RlIHdpdGggc21hbGxlc3Qga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uIHBvcCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdCwgcmV0dXJuVmFsdWUgPSBudWxsO1xuICBpZiAobm9kZSkge1xuICAgIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIHJldHVyblZhbHVlID0geyBrZXk6IG5vZGUua2V5LCBkYXRhOiBub2RlLmRhdGEgfTtcbiAgICB0aGlzLnJlbW92ZShub2RlLmtleSk7XG4gIH1cbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIEZpbmQgbm9kZSBieSBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gZmluZCAoa2V5KSB7XG4gIHZhciByb290ID0gdGhpcy5fcm9vdDtcbiAgaWYgKHJvb3QgPT09IG51bGwpICB7IHJldHVybiBudWxsOyB9XG4gIGlmIChrZXkgPT09IHJvb3Qua2V5KSB7IHJldHVybiByb290OyB9XG5cbiAgdmFyIHN1YnRyZWUgPSByb290LCBjbXA7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgd2hpbGUgKHN1YnRyZWUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgc3VidHJlZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIHN1YnRyZWU7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IHN1YnRyZWUgPSBzdWJ0cmVlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IHN1YnRyZWUgPSBzdWJ0cmVlLnJpZ2h0OyB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBJbnNlcnQgYSBub2RlIGludG8gdGhlIHRyZWVcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHBhcmFteyp9IFtkYXRhXVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQgKGtleSwgZGF0YSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fcm9vdCkge1xuICAgIHRoaXMuX3Jvb3QgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsLCBiYWxhbmNlRmFjdG9yOiAwLFxuICAgICAga2V5OiBrZXksIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHRoaXMuX3NpemUrKztcbiAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgfVxuXG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgdmFyIG5vZGUgID0gdGhpcy5fcm9vdDtcbiAgdmFyIHBhcmVudD0gbnVsbDtcbiAgdmFyIGNtcCAgID0gMDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgcGFyZW50ID0gbm9kZTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG5cbiAgdmFyIG5ld05vZGUgPSB7XG4gICAgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgcGFyZW50OiBwYXJlbnQsIGtleToga2V5LCBkYXRhOiBkYXRhLFxuICB9O1xuICBpZiAoY21wIDwgMCkgeyBwYXJlbnQubGVmdD0gbmV3Tm9kZTsgfVxuICBlbHNlICAgICAgIHsgcGFyZW50LnJpZ2h0ID0gbmV3Tm9kZTsgfVxuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAoY29tcGFyZShwYXJlbnQua2V5LCBrZXkpIDwgMCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy9sZXQgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIHZhciBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGxldCBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QkMSA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290JDE7IH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgdGhpcy5fc2l6ZSsrO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBub2RlIGZyb20gdGhlIHRyZWUuIElmIG5vdCBmb3VuZCwgcmV0dXJucyBudWxsLlxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlOk51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoa2V5KSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICB2YXIgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB2YXIgcmV0dXJuVmFsdWUgPSBub2RlLmtleTtcblxuICBpZiAobm9kZS5sZWZ0KSB7XG4gICAgdmFyIG1heCA9IG5vZGUubGVmdDtcblxuICAgIHdoaWxlIChtYXgubGVmdCB8fCBtYXgucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtYXgucmlnaHQpIHsgbWF4ID0gbWF4LnJpZ2h0OyB9XG5cbiAgICAgIG5vZGUua2V5ID0gbWF4LmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgICAgaWYgKG1heC5sZWZ0KSB7XG4gICAgICAgIG5vZGUgPSBtYXg7XG4gICAgICAgIG1heCA9IG1heC5sZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtYXgua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgIG5vZGUgPSBtYXg7XG4gIH1cblxuICBpZiAobm9kZS5yaWdodCkge1xuICAgIHZhciBtaW4gPSBub2RlLnJpZ2h0O1xuXG4gICAgd2hpbGUgKG1pbi5sZWZ0IHx8IG1pbi5yaWdodCkge1xuICAgICAgd2hpbGUgKG1pbi5sZWZ0KSB7IG1pbiA9IG1pbi5sZWZ0OyB9XG5cbiAgICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgICBpZiAobWluLnJpZ2h0KSB7XG4gICAgICAgIG5vZGUgPSBtaW47XG4gICAgICAgIG1pbiA9IG1pbi5yaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICBub2RlID0gbWluO1xuICB9XG5cbiAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50O1xuICB2YXIgcHAgICA9IG5vZGU7XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQubGVmdCA9PT0gcHApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vbGV0IG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3Q7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGxldCBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QkMSA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290JDE7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3QkMTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IC0xIHx8IHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IGJyZWFrOyB9XG5cbiAgICBwcCAgID0gcGFyZW50O1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkgeyBub2RlLnBhcmVudC5sZWZ0PSBudWxsOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICB7IG5vZGUucGFyZW50LnJpZ2h0ID0gbnVsbDsgfVxuICB9XG5cbiAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHsgdGhpcy5fcm9vdCA9IG51bGw7IH1cblxuICB0aGlzLl9zaXplLS07XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRyZWUgaXMgYmFsYW5jZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmlzQmFsYW5jZWQgPSBmdW5jdGlvbiBpc0JhbGFuY2VkJDEgKCkge1xuICByZXR1cm4gaXNCYWxhbmNlZCh0aGlzLl9yb290KTtcbn07XG5cblxuLyoqXG4gKiBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyZWUgLSBwcmltaXRpdmUgaG9yaXpvbnRhbCBwcmludC1vdXRcbiAqIEBwYXJhbXtGdW5jdGlvbihOb2RlKTpTdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblRyZWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKHByaW50Tm9kZSkge1xuICByZXR1cm4gcHJpbnQodGhpcy5fcm9vdCwgcHJpbnROb2RlKTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBUcmVlLnByb3RvdHlwZSwgcHJvdG90eXBlQWNjZXNzb3JzICk7XG5cbnJldHVybiBUcmVlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXZsLmpzLm1hcFxuIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXZlbnRQb2ludChwb2ludCwgcXVldWUsIHN0YXR1cykge1xyXG4gICAgdmFyIHAgPSBwb2ludC5kYXRhLnBvaW50O1xyXG4gICAgLy8gMVxyXG4gICAgdmFyIHVwID0gcG9pbnQuZGF0YS5zZWdtZW50O1xyXG4gICAgdmFyIHVwcyA9IHVwID8gW3VwXSA6IFtdO1xyXG4gICAgdmFyIGxwcyA9IFtdO1xyXG4gICAgdmFyIGNwcyA9IFtdO1xyXG5cclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAvLyAxLiBJbml0aWFsaXplIGV2ZW50IHF1ZXVlIEVRID0gYWxsIHNlZ21lbnQgZW5kcG9pbnRzXHJcbiAgICBzdGF0dXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgIHZhciBzZWdtZW50ID0gbm9kZS5kYXRhLFxyXG4gICAgICAgICAgICBiZWdpbiA9IHNlZ21lbnRbMF0sXHJcbiAgICAgICAgICAgIGVuZCA9IHNlZ21lbnRbMV07XHJcblxyXG4gICAgICAgIC8vIGZpbmQgbG93ZXIgaW50ZXJzZWN0aW9uXHJcbiAgICAgICAgaWYgKHBbMF0gPT09IGVuZFswXSAmJiBwWzFdID09PSBlbmRbMV0pIHtcclxuICAgICAgICAgICAgbHBzLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaW5kIGlubmVyIGludGVyc2VjdGlvbnNcclxuICAgICAgICBpZiAodXRpbHMucG9pbnRPbkxpbmUoc2VnbWVudCwgcCkpIHtcclxuICAgICAgICAgICAgY3BzLnB1c2goc2VnbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gM1xyXG4gICAgaWYgKHVwcy5jb25jYXQobHBzKS5jb25jYXQoY3BzKS5sZW5ndGggPiAxKSB7XHJcbiAgICAvLyA0XHJcbiAgICAgICAgcmVzdWx0LnB1c2gocCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIDVcclxuICAgIHJlbW92ZUZyb21UcmVlKGxwcywgc3RhdHVzKTtcclxuICAgIHJlbW92ZUZyb21UcmVlKGNwcywgc3RhdHVzKTtcclxuXHJcbiAgICAvLyA2XHJcbiAgICBpbnNlcnRJbnRvVHJlZSh1cHMsIHN0YXR1cyk7XHJcbiAgICBpbnNlcnRJbnRvVHJlZShjcHMsIHN0YXR1cyk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coc3RhdHVzKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVGcm9tVHJlZShhcnIsIHRyZWUpIHtcclxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdHJlZS5yZW1vdmUoaXRlbSk7XHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRJbnRvVHJlZShhcnIsIHRyZWUpIHtcclxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdHJlZS5pbnNlcnQoaXRlbSk7XHJcbiAgICB9KVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGhhbmRsZUV2ZW50UG9pbnQ7XHJcbiIsInZhciBUcmVlID0gcmVxdWlyZSgnYXZsJyk7XHJcbnZhciBoYW5kbGVFdmVudFBvaW50ID0gcmVxdWlyZSgnLi9oYW5kbGVldmVudHBvaW50Jyk7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50cyBzZXQgb2Ygc2VnbWVudHMgaW50ZXJzZWN0aW5nIHN3ZWVwbGluZSBbW1t4MSwgeTFdLCBbeDIsIHkyXV0gLi4uIFtbeG0sIHltXSwgW3huLCB5bl1dXVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGZpbmRJbnRlcnNlY3Rpb25zKHNlZ21lbnRzLCBtYXApIHtcclxuICAgIHZhciBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpLFxyXG4gICAgICAgIHN0YXR1cyA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVTZWdtZW50cyksXHJcbiAgICAgICAgcmVzdWx0ID0gW107XHJcblxyXG4gICAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2VnbWVudCkge1xyXG4gICAgICAgIHNlZ21lbnQuc29ydCh1dGlscy5jb21wYXJlUG9pbnRzKTtcclxuICAgICAgICB2YXIgYmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBzZWdtZW50WzFdLFxyXG4gICAgICAgICAgICBiZWdpbkRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludDogYmVnaW4sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmVnaW4nLFxyXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbmREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgcG9pbnQ6IGVuZCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdlbmQnLFxyXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIHF1ZXVlLmluc2VydChiZWdpbiwgYmVnaW5EYXRhKTtcclxuICAgICAgICBxdWV1ZS5pbnNlcnQoZW5kLCBlbmREYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBMT0dcclxuICAgICAqL1xyXG4gICAgdmFyIHZhbHVlcyA9IHF1ZXVlLnZhbHVlcygpO1xyXG5cclxuICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIGFycmF5KSB7XHJcbiAgICAgICAgdmFyIHAgPSB2YWx1ZS5wb2ludDtcclxuICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xyXG4gICAgICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdyZWQnLCBmaWxsQ29sb3I6ICdGRjAwJyArIDIgKiogaW5kZXh9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIG1yay5iaW5kUG9wdXAoJycgKyBpbmRleCArICdcXG4nICsgcFswXSArICdcXG4nICsgcFsxXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICAvKlxyXG4gICAgICogTE9HIEVORFxyXG4gICAgICovXHJcbiAgICB3aGlsZSAoIXF1ZXVlLmlzRW1wdHkoKSkge1xyXG4gICAgICAgIHZhciBldmVudCA9IHF1ZXVlLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnYmVnaW4nKSB7XHJcblxyXG4gICAgICAgICAgICBzdGF0dXMuaW5zZXJ0KGV2ZW50LmRhdGEuc2VnbWVudCk7XG4gICAgICAgICAgICB2YXIgc2VnRSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBMT0dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBhZGRpbmcgPSBzZWdFLmtleTtcclxuICAgICAgICAgICAgdmFyIGxscyA9IGFkZGluZy5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XHJcbiAgICAgICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMpLmFkZFRvKG1hcCk7XHJcblxyXG4gICAgICAgICAgICBsaW5lLmJpbmRQb3B1cCgnJyArIGkpO1xyXG5cclxuICAgICAgICAgICAgaSsrO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vdyBhZGRpbmcgc2VnbWVudDogJyk7XHJcbiAgICAgICAgICAgIGFkZGluZy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygneDogJyArIHBbMF0gKyAnIHk6ICcgKyBwWzFdKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTE9HIEVORFxyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHZhciBzZWdBID0gc3RhdHVzLnByZXYoc2VnRSk7XHJcbiAgICAgICAgICAgIHZhciBzZWdCID0gc3RhdHVzLm5leHQoc2VnRSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlZ0EpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWdCKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWdBKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdFLmtleSwgc2VnQS5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlYUludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVhSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogZWFJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnRS5rZXksIHNlZ0Eua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoZWFJbnRlcnNlY3Rpb25Qb2ludCwgZWFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGViSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnRS5rZXksIHNlZ0Iua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWJJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlYkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGViSW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Uua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGViSW50ZXJzZWN0aW9uUG9pbnQsIGViSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIEVsc2UgSWYgKEUgaXMgYSByaWdodCBlbmRwb2ludCkge1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnZW5kJykge1xyXG4gICAgICAgICAgICB2YXIgc2VnRSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudCk7XHJcbiAgICAgICAgICAgIHZhciBzZWdBID0gc3RhdHVzLnByZXYoc2VnRSk7XHJcbiAgICAgICAgICAgIHZhciBzZWdCID0gc3RhdHVzLm5leHQoc2VnRSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQSAmJiBzZWdCKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWJJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdBLmtleSwgc2VnQi5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhYkludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFxdWV1ZS5maW5kKGFiSW50ZXJzZWN0aW9uUG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhYkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBhYkludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Eua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgSW5zZXJ0IEkgaW50byBFUTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGFiSW50ZXJzZWN0aW9uUG9pbnQsIGFiSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTE9HXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBEZWxldGUgc2VnRSBmcm9tIFNMO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndHJlZSBiZWZvcmUgcmVtb3Zpbmcgc2VnbWVudDogJyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cy50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgLy8gdmFyIHJlbW92aW5nID0gc2VnRS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25vdyByZW1vdmluZyBzZWdtZW50OiAnKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3RhdHVzLmZpbmQoc2VnRS5rZXkpKTtcclxuICAgICAgICAgICAgLy8gcmVtb3ZpbmcuZm9yRWFjaChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3g6ICcgKyBwWzBdICsgJyB5OiAnICsgcFsxXSk7XHJcbiAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIExPRyBFTkRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHN0YXR1cy5yZW1vdmUoc2VnRS5rZXkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGV2ZW50LmRhdGEucG9pbnQpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnRTEgYWJvdmUgc2VnRTIgYmUgRSdzIGludGVyc2VjdGluZyBzZWdtZW50cyBpbiBTTDtcclxuICAgICAgICAgICAgdmFyIHNlZzEgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnRzWzBdKSxcclxuICAgICAgICAgICAgICAgIHNlZzIgPSBzdGF0dXMuZmluZChldmVudC5kYXRhLnNlZ21lbnRzWzFdKTtcclxuXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIFN3YXAgdGhlaXIgcG9zaXRpb25zIHNvIHRoYXQgc2VnRTIgaXMgbm93IGFib3ZlIHNlZ0UxO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG4gICAgICAgICAgICAvLyBzdGF0dXMucHJldihzZWcxKSA9IHN0YXR1cy5maW5kKHNlZzIpO1xyXG4gICAgICAgICAgICAvLyBzdGF0dXMubmV4dChzZWcyKSA9IHN0YXR1cy5maW5kKHNlZzEpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnQSA9IHRoZSBzZWdtZW50IGFib3ZlIHNlZ0UyIGluIFNMO1xyXG4gICAgICAgICAgICB2YXIgc2VnQSA9IHN0YXR1cy5wcmV2KHNlZzIpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnQiA9IHRoZSBzZWdtZW50IGJlbG93IHNlZ0UxIGluIFNMO1xyXG4gICAgICAgICAgICB2YXIgc2VnQiA9IHN0YXR1cy5uZXh0KHNlZzEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ0EpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhMkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZzIua2V5LCBzZWdBLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGEySW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXF1ZXVlLmZpbmQoYTJJbnRlcnNlY3Rpb25Qb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEySW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IGEySW50ZXJzZWN0aW9uUG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnMi5rZXksIHNlZ0Eua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChhMkludGVyc2VjdGlvblBvaW50LCBhMkludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWdCKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYjFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWcxLmtleSwgc2VnQi5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiMUludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFxdWV1ZS5maW5kKGIxSW50ZXJzZWN0aW9uUG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiMUludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBiMUludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZzEua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoYjFJbnRlcnNlY3Rpb25Qb2ludCwgYjFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0dXMudmFsdWVzKCkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBhcnJheSkge1xyXG5cclxuICAgICAgICBsbHMgPSB2YWx1ZS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XHJcblxyXG4gICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMpLmFkZFRvKG1hcCk7XHJcbiAgICAgICAgbGluZS5iaW5kUG9wdXAoJycgKyBpbmRleCk7XHJcbiAgICB9KTtcclxuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xyXG4iLCJ2YXIgdXRpbHMgPSB7XHJcblxyXG4gICAgLypcclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LzQtdC90YzRiNC1IDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L7RgdGC0LDQstC40YIgYSDQv9C+INC80LXQvdGM0YjQtdC80YMg0LjQvdC00LXQutGB0YMsINGH0LXQvCBiLCDRgtC+INC10YHRgtGMLCBhINC40LTRkdGCINC/0LXRgNCy0YvQvC5cclxuICAgICAgICDQldGB0LvQuCBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LLQtdGA0L3RkdGCIDAsINGB0L7RgNGC0LjRgNC+0LLQutCwINC+0YHRgtCw0LLQuNGCIGEg0LggYiDQvdC10LjQt9C80LXQvdC90YvQvNC4INC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC00YDRg9CzINC6INC00YDRg9Cz0YMsXHJcbiAgICAgICAgICAgINC90L4g0L7RgtGB0L7RgNGC0LjRgNGD0LXRgiDQuNGFINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC60L4g0LLRgdC10Lwg0LTRgNGD0LPQuNC8INGN0LvQtdC80LXQvdGC0LDQvC5cclxuICAgICAgICAgICAg0J7QsdGA0LDRgtC40YLQtSDQstC90LjQvNCw0L3QuNC1OiDRgdGC0LDQvdC00LDRgNGCIEVDTUFzY3JpcHQg0L3QtSDQs9Cw0YDQsNC90YLQuNGA0YPQtdGCINC00LDQvdC90L7QtSDQv9C+0LLQtdC00LXQvdC40LUsINC4INC10LzRgyDRgdC70LXQtNGD0Y7RgiDQvdC1INCy0YHQtSDQsdGA0LDRg9C30LXRgNGLXHJcbiAgICAgICAgICAgICjQvdCw0L/RgNC40LzQtdGALCDQstC10YDRgdC40LggTW96aWxsYSDQv9C+INC60YDQsNC50L3QtdC5INC80LXRgNC1LCDQtNC+IDIwMDMg0LPQvtC00LApLlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQsdC+0LvRjNGI0LUgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QvtGB0YLQsNCy0LjRgiBiINC/0L4g0LzQtdC90YzRiNC10LzRgyDQuNC90LTQtdC60YHRgywg0YfQtdC8IGEuXHJcbiAgICAgICAg0KTRg9C90LrRhtC40Y8gY29tcGFyZUZ1bmN0aW9uKGEsIGIpINC00L7Qu9C20L3QsCDQstGB0LXQs9C00LAg0LLQvtC30LLRgNCw0YnQsNGC0Ywg0L7QtNC40L3QsNC60L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQtNC70Y8g0L7Qv9GA0LXQtNC10LvRkdC90L3QvtC5INC/0LDRgNGLINGN0LvQtdC80LXQvdGC0L7QsiBhINC4IGIuXHJcbiAgICAgICAgICAgINCV0YHQu9C4INCx0YPQtNGD0YIg0LLQvtC30LLRgNCw0YnQsNGC0YzRgdGPINC90LXQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90YvQtSDRgNC10LfRg9C70YzRgtCw0YLRiywg0L/QvtGA0Y/QtNC+0Log0YHQvtGA0YLQuNGA0L7QstC60Lgg0LHRg9C00LXRgiDQvdC1INC+0L/RgNC10LTQtdC70ZHQvS5cclxuICAgICovXHJcbiAgICAvLyBwb2ludHMgY29tcGFyYXRvclxyXG4gICAgY29tcGFyZVBvaW50czogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICAgICAgeDIgPSBiWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGJbMV07XHJcblxyXG4gICAgICAgIGlmICh4MSA+IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPiB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4MSA8IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPCB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeDEgPT09IHgyICYmIHkxID09PSB5Mikge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIC8vINC90YPQttC90L4g0LLQtdGA0L3Rg9GC0Ywg0YHQtdCz0LzQtdC90YIsINC60L7RgtC+0YDRi9C5INCyINC00LDQvdC90L7QuSDRgtC+0YfQutC1XHJcbiAgICAgICAgLy8g0Y/QstC70Y/QtdGC0YHRjyDQv9C10YDQstGL0Lwg0LHQu9C40LbQsNC50YjQuNC8INC/0L4geCDQuNC70LggeVxyXG5cclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDQv9C+IHkg0LIg0YLQvtGH0LrQtSDRgSDQtNCw0L3QvdC+0Lkg0LrQvtC+0YDQtNC40L3QsNGC0L7QuSB4XHJcblxyXG4gICAgICAgIC8vINC90LDQudGC0LgsINGBINC60LDQutC+0Lkg0YHRgtC+0YDQvtC90Ysg0LvQtdC20LjRgiDQu9C10LLQsNGPINGC0L7Rh9C60LAgYiDQv9C+INC+0YLQvdC+0YjQtdC90LjRjiDQuiBhXHJcblxyXG4gICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICAgICAgLy8gdmFyIHgzID0gYVswXVswXSxcclxuICAgICAgICAvLyAgICAgeTMgPSBhWzBdWzFdLFxyXG4gICAgICAgIC8vICAgICB4NCA9IGFbMV1bMF0sXHJcbiAgICAgICAgLy8gICAgIHk0ID0gYVsxXVsxXSxcclxuICAgICAgICAvLyAgICAgeDEgPSBiWzBdWzBdLFxyXG4gICAgICAgIC8vICAgICB5MSA9IGJbMF1bMV0sXHJcbiAgICAgICAgLy8gICAgIHgyID0gYlsxXVswXSxcclxuICAgICAgICAvLyAgICAgeTIgPSBiWzFdWzFdO1xyXG5cclxuICAgICAgICB2YXIgRCA9ICh4MyAtIHgxKSAqICh5MiAtIHkxKSAtICh5MyAtIHkxKSAqICh4MiAtIHgxKTtcclxuXHJcbiAgICAgICAgdmFyIHYxID0gW3gyIC0geDEsIHkyIC0geTFdLFxyXG4gICAgICAgICAgICB2MiA9IFt4NCAtIHgzLCB5NCAtIHkzXTtcclxuXHJcbiAgICAgICAgdmFyIG11bHQgPSB2MVswXSAqIHYyWzFdIC0gdjFbMV0gKiB2MlswXTtcclxuXHJcbiAgICAgICAgaWYgKEQgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2UgaWYgKEQgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoRCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgKHkxID4geTMpIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmICh5MSA8IHkzKSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAtMTtcclxuICAgICAgICAvLyB9IGVsc2UgaWYgKHkxID09PSB5Mykge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gMDtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gaWYgKG11bHQgPiAwKSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAxO1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAobXVsdCA8IDApIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAobXVsdCA9PT0gMCkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gMDtcclxuICAgICAgICAvLyB9XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbmRFcXVhdGlvbjogZnVuY3Rpb24gKHNlZ21lbnQpIHtcclxuICAgICAgICB2YXIgeDEgPSBzZWdtZW50WzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IHNlZ21lbnRbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gc2VnbWVudFsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBzZWdtZW50WzFdWzFdLFxyXG4gICAgICAgICAgICBhID0geTEgLSB5MixcclxuICAgICAgICAgICAgYiA9IHgyIC0geDEsXHJcbiAgICAgICAgICAgIGMgPSB4MSAqIHkyIC0geDIgKiB5MTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYSArICd4ICsgJyArIGIgKyAneSArICcgKyBjICsgJyA9IDAnKTtcclxuICAgIH0sXHJcblxyXG4gICAgZmluZEludGVyc2VjdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgeDEgPSBhWzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGFbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBhWzFdWzFdLFxyXG4gICAgICAgICAgICB4MyA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDQgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5NCA9IGJbMV1bMV07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MzE5OC9ob3ctZG8teW91LWRldGVjdC13aGVyZS10d28tbGluZS1zZWdtZW50cy1pbnRlcnNlY3QvMTk2ODM0NSMxOTY4MzQ1XHJcbiAgICBiZXR3ZWVuOiBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gICAgICAgIHZhciBlcHMgPSAwLjAwMDAwMDE7XHJcblxyXG4gICAgICAgIHJldHVybiBhLWVwcyA8PSBiICYmIGIgPD0gYytlcHM7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBmaW5kU2VnbWVudHNJbnRlcnNlY3Rpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgICAgICAgICAgeDMgPSBiWzBdWzBdLFxyXG4gICAgICAgICAgICB5MyA9IGJbMF1bMV0sXHJcbiAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgICAgICAgICAgeTQgPSBiWzFdWzFdO1xyXG4gICAgICAgIHZhciB4PSgoeDEqeTIteTEqeDIpKih4My14NCktKHgxLXgyKSooeDMqeTQteTMqeDQpKSAvXHJcbiAgICAgICAgICAgICgoeDEteDIpKih5My15NCktKHkxLXkyKSooeDMteDQpKTtcclxuICAgICAgICB2YXIgeT0oKHgxKnkyLXkxKngyKSooeTMteTQpLSh5MS15MikqKHgzKnk0LXkzKng0KSkgL1xyXG4gICAgICAgICAgICAoKHgxLXgyKSooeTMteTQpLSh5MS15MikqKHgzLXg0KSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHgpfHxpc05hTih5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHgxPj14Mikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDIsIHgsIHgxKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeTE+PXkyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MiwgeSwgeTEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkxLCB5LCB5MikpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh4Mz49eDQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDMsIHgsIHg0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkzPj15NCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTQsIHksIHkzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3gsIHldO1xyXG4gICAgfSxcclxuXHJcbiAgICBwb2ludE9uTGluZTogZnVuY3Rpb24gKGxpbmUsIHBvaW50KSB7XHJcbiAgICAgICAgdmFyIGJlZ2luID0gbGluZVswXSxcclxuICAgICAgICAgICAgZW5kID0gbGluZVsxXSxcclxuICAgICAgICAgICAgeDEgPSBiZWdpblswXSxcclxuICAgICAgICAgICAgeTEgPSBiZWdpblsxXSxcclxuICAgICAgICAgICAgeDIgPSBlbmRbMF0sXHJcbiAgICAgICAgICAgIHkyID0gZW5kWzFdLFxyXG4gICAgICAgICAgICB4ID0gcG9pbnRbMF0sXHJcbiAgICAgICAgICAgIHkgPSBwb2ludFsxXTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoeCAtIHgxKSAqICh5MiAtIHkxKSAtICh5IC0geTEpICogKHgyIC0geDEpID09PSAwKSAmJiAoKHggPiB4MSAmJiB4IDwgeDIpIHx8ICh4ID4geDIgJiYgeCA8IHgxKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7XHJcbiJdfQ==
