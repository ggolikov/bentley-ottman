(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [
// 37.589515382683196,55.77106897938384,37.626150698232244,55.764167997424565
// 37.600537975688596,55.77799843256274,37.622784153768166,55.73719541784778
// 37.60068929512651,55.72478975782792,37.63859217466702,55.773973569856224
// 37.62910041534928,55.75466067552722,37.6516817906304,55.72766819729573
[[37.589515382683196, 55.77106897938384], [37.626150698232244, 55.764167997424565]], [[37.600537975688596, 55.77799843256274], [37.622784153768166, 55.73719541784778]], [[37.60068929512651, 55.72478975782792], [37.63859217466702, 55.773973569856224]], [[37.62910041534928, 55.75466067552722], [37.6516817906304, 55.72766819729573]]];

},{}],2:[function(require,module,exports){
var findIntersections = require('../../index');
var data = require('../data/index.js');

var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}),
    point = L.latLng([55.753210, 37.621766]),
    map = new L.Map('map', { layers: [osm], center: point, zoom: 12, maxZoom: 22 }),
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

console.log(ps);

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
// почему-то первыми иногда приходят события end
// некоторые точки не видны?


var Tree = require('avl'),
    utils = require('./utils');

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
    // var values = queue.values();

    // values.forEach(function (value, index, array) {
    //     var ll = L.latLng([p[1], p[0]]);
    //     var mrk = L.circleMarker(ll, {radius: 4, color: 'red', fillColor: 'FF00' + 2 ** index}).addTo(map);
    //     mrk.bindPopup('' + index + '\n' + p[0] + '\n' + p[1]);
    // });

    var i = 0;
    /*
     * LOG END
     */

    // debug:
    // L.marker(L.latLng([].slice().reverse())).addTo(map);
    while (!queue.isEmpty()) {
        var event = queue.pop();
        var p = event.data.point;

        console.log(i + ') current point: ' + event.data.point.toString());
        console.log('   point type: ' + event.data.type);
        // console.log('   queue: ' + queue.toString());
        console.log('   status: ' + status.toString());

        if (event.data.type === 'begin') {

            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, { radius: 4, color: 'green', fillColor: 'green' }).addTo(map);

            status.insert(event.data.segment);
            var segE = status.find(event.data.segment);

            /*
             * LOG
             */
            var lls = segE.key.map(function (p) {
                return L.latLng(p.slice().reverse());
            });
            var line = L.polyline(lls, { color: 'green' }).addTo(map);

            line.bindPopup('added' + i);

            // console.log('now adding segment: ');
            segE.key.forEach(function (p) {
                // console.log('x: ' + p[0] + ' y: ' + p[1]);
            });
            /*
             * LOG END
             */

            var segA = status.prev(segE);
            var segB = status.next(segE);
            // console.log(segA);
            // console.log(segB);

            if (segA) {
                var eaIntersectionPoint = utils.findSegmentsIntersection(segE.key, segA.key);

                if (eaIntersectionPoint) {
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
                        segments: [segE.key, segB.key]
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

                if (abIntersectionPoint) {
                    if (!queue.find(abIntersectionPoint)) {
                        var abIntersectionPointData = {
                            point: abIntersectionPoint,
                            type: 'intersection',
                            segments: [segA.key, segB.key]
                            //                 Insert I into EQ;
                        };queue.insert(abIntersectionPoint, abIntersectionPointData);
                        console.log('inserted abIntersectionPoint:' + abIntersectionPoint.toString());
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
            var ll = L.latLng([p[1], p[0]]);
            var mrk = L.circleMarker(ll, { radius: 4, color: 'blue', fillColor: 'blue' }).addTo(map);
            result.push(event.data.point);
            //             Let segE1 above segE2 be E's intersecting segments in SL;
            var seg1 = status.find(event.data.segments[0]),
                seg2 = status.find(event.data.segments[1]);

            //             Swap their positions so that segE2 is now above segE1;
            // console.log(status);
            // status.prev(seg1) = status.find(seg2);
            // status.next(seg2) = status.find(seg1);
            //             Let segA = the segment above segE2 in SL;
            var segA = status.next(seg1);
            //             Let segB = the segment below segE1 in SL;
            var segB = status.prev(seg2);

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
                        console.log('inserted a2IntersectionPoint:' + a2IntersectionPoint.toString());
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
                        console.log('inserted b1IntersectionPoint:' + b1IntersectionPoint.toString());
                    }
                }
            }
        }
        i++;
    }

    status.values().forEach(function (value, index, array) {

        lls = value.map(function (p) {
            return L.latLng(p.slice().reverse());
        });

        var line = L.polyline(lls).addTo(map);
        line.bindPopup('' + index);
    });

    window.status = status;
    window.queue = queue;

    // console.log(result);
    return result;
}

module.exports = findIntersections;

},{"./utils":6,"avl":4}],6:[function(require,module,exports){
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

    compareSegments: function (a, b) {
        var x1 = b[0][0],
            y1 = b[0][1],
            x2 = b[1][0],
            y2 = b[1][1],
            x3 = a[0][0],
            y3 = a[0][1],
            x4 = a[1][0],
            y4 = a[1][1];

        if (y3 > y1) {
            return -1;
        } else if (y3 < y1) {
            return 1;
        } else {
            return 0;
        }
    },

    // compareSegments3: function (a, b) {
    //     var x1 = b[0][0],
    //         y1 = b[0][1],
    //         x2 = b[1][0],
    //         y2 = b[1][1],
    //         x3 = a[0][0],
    //         y3 = a[0][1],
    //         x4 = a[1][0],
    //         y4 = a[1][1],
    //         intersectionPoint = findSegmentsIntersection(a, b);
    //
    //     // console.log(intersectionPoint);
    //     if (!intersectionPoint) {
    //         // находим векторное произведение векторов b и b[0]a[0]
    //         var Dba1 = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
    //         // находим векторное произведение векторов b и b[0]a[1]
    //         var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
    //         // находим знак векторных произведений
    //         var D = Dba1 * Dba2;
    //
    //         if (D < 0) {
    //             return -1;
    //         } else if (D > 0) {
    //             return 1;
    //         } else if (D === 0) {
    //             return 0;
    //         }
    //     } else {
    //         console.log('they are intersecting');
    //         var intersectionX = intersectionPoint[0];
    //         var intersectionY = intersectionPoint[1];
    //
    //         // if (y3 < intersectionY) {
    //         //     return -1
    //         // } else if (y3 > intersectionY) {
    //         //     return 1;
    //         // } else if (y3 === intersectionY) {
    //         //     return 0;
    //         // }
    //         // if (x3 < intersectionX) {
    //         //     return - 1
    //         // } else if (x3 > intersectionX) {
    //         //     return 1;
    //         // } else if (x3 === intersectionX) {
    //         //     return 0;
    //         // }
    //         if (y3 < y1) {
    //             return -1
    //         } else if (y3 > y1) {
    //             return 1;
    //         } else if (y3 === y1) {
    //             return 0;
    //         }
    //
    //         // находим векторное произведение векторов b и b[0]a[0]
    //         var D = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
    //         // находим векторное произведение векторов b и b[0]a[1]
    //         // var Dba2 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
    //         // находим знак векторных произведений
    //         // var D = Dba1 * Dba2;
    //
    //         if (D < 0) {
    //             return -1;
    //         } else if (D > 0) {
    //             return 1;
    //         } else if (D === 0) {
    //             return 0;
    //         }
    //
    //
    //         return 0;
    //     }
    //
    //
    //     function between(a, b, c) {
    //         var eps = 0.0000001;
    //
    //         return a-eps <= b && b <= c+eps;
    //     }
    //
    //     function findSegmentsIntersection(a, b) {
    //         var x1 = a[0][0],
    //             y1 = a[0][1],
    //             x2 = a[1][0],
    //             y2 = a[1][1],
    //             x3 = b[0][0],
    //             y3 = b[0][1],
    //             x4 = b[1][0],
    //             y4 = b[1][1];
    //         var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    //             ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    //         var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    //             ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    //         if (isNaN(x)||isNaN(y)) {
    //             return false;
    //         } else {
    //             if (x1 >= x2) {
    //                 if (between(x2, x, x1)) {return false;}
    //             } else {
    //                 if (between(x1, x, x2)) {return false;}
    //             }
    //             if (y1 >= y2) {
    //                 if (between(y2, y, y1)) {return false;}
    //             } else {
    //                 if (between(y1, y, y2)) {return false;}
    //             }
    //             if (x3 >= x4) {
    //                 if (between(x4, x, x3)) {return false;}
    //             } else {
    //                 if (between(x3, x, x4)) {return false;}
    //             }
    //             if (y3 >= y4) {
    //                 if (between(y4, y, y3)) {return false;}
    //             } else {
    //                 if (between(y3, y, y4)) {return false;}
    //             }
    //         }
    //         return [x, y];
    //     }
    //
    // },

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

module.exports = new Utils();

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxkYXRhXFxpbmRleC5qcyIsImRlbW9cXGpzXFxhcHAuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hdmwvZGlzdC9hdmwuanMiLCJzcmNcXHN3ZWVwbGluZS5qcyIsInNyY1xcdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQyxrQkFBRCxFQUFvQixpQkFBcEIsQ0FBRCxFQUF3QyxDQUFDLGtCQUFELEVBQW9CLGtCQUFwQixDQUF4QyxDQUxhLEVBTWIsQ0FBQyxDQUFDLGtCQUFELEVBQW9CLGlCQUFwQixDQUFELEVBQXdDLENBQUMsa0JBQUQsRUFBb0IsaUJBQXBCLENBQXhDLENBTmEsRUFPYixDQUFDLENBQUMsaUJBQUQsRUFBbUIsaUJBQW5CLENBQUQsRUFBdUMsQ0FBQyxpQkFBRCxFQUFtQixrQkFBbkIsQ0FBdkMsQ0FQYSxFQVFiLENBQUMsQ0FBQyxpQkFBRCxFQUFtQixpQkFBbkIsQ0FBRCxFQUF1QyxDQUFDLGdCQUFELEVBQWtCLGlCQUFsQixDQUF2QyxDQVJhLENBQWpCOzs7QUNBQSxJQUFJLG9CQUFvQixRQUFRLGFBQVIsQ0FBeEI7QUFDQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksTUFBTSxFQUFFLFNBQUYsQ0FBWSxpRUFBWixFQUErRTtBQUNqRixhQUFTLEVBRHdFO0FBRWpGLGlCQUFhO0FBRm9FLENBQS9FLENBQVY7QUFBQSxJQUlJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFULENBSlo7QUFBQSxJQUtJLE1BQU0sSUFBSSxFQUFFLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEVBQUMsUUFBUSxDQUFDLEdBQUQsQ0FBVCxFQUFnQixRQUFRLEtBQXhCLEVBQStCLE1BQU0sRUFBckMs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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUF5RCxJQUFJLEVBQUosSUFBVSxJQUFJLEVBQWYsSUFBdUIsSUFBSSxFQUFKLElBQVUsSUFBSSxFQUE3RixDQUFQO0FBQ0gsS0EvT2E7O0FBaVBkLFdBQU8sVUFBVSxNQUFWLEVBQWtCLE1BQWxCLEVBQTBCLENBQTFCLEVBQTZCO0FBQ2hDLFlBQUksS0FBSyxPQUFPLENBQVAsQ0FBVDtBQUFBLFlBQ0ksS0FBSyxPQUFPLENBQVAsQ0FEVDtBQUFBLFlBRUksS0FBSyxPQUFPLENBQVAsQ0FGVDtBQUFBLFlBR0ksS0FBSyxPQUFPLENBQVAsQ0FIVDtBQUFBLFlBSUksSUFBSSxLQUFLLEVBSmI7QUFBQSxZQUtJLElBQUksS0FBSyxFQUxiO0FBQUEsWUFNSSxJQUFJLEtBQUssRUFBTCxHQUFVLEtBQUssRUFOdkI7O0FBUUksZUFBTyxDQUFDLENBQUMsQ0FBRCxHQUFLLElBQUksQ0FBVixJQUFlLENBQXRCO0FBQ1A7QUEzUGEsQ0FBbEI7O0FBOFBBLE9BQU8sT0FBUCxHQUFpQixJQUFJLEtBQUosRUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcbiAgICAvLyAzNy41ODk1MTUzODI2ODMxOTYsNTUuNzcxMDY4OTc5MzgzODQsMzcuNjI2MTUwNjk4MjMyMjQ0LDU1Ljc2NDE2Nzk5NzQyNDU2NVxyXG4gICAgLy8gMzcuNjAwNTM3OTc1Njg4NTk2LDU1Ljc3Nzk5ODQzMjU2Mjc0LDM3LjYyMjc4NDE1Mzc2ODE2Niw1NS43MzcxOTU0MTc4NDc3OFxyXG4gICAgLy8gMzcuNjAwNjg5Mjk1MTI2NTEsNTUuNzI0Nzg5NzU3ODI3OTIsMzcuNjM4NTkyMTc0NjY3MDIsNTUuNzczOTczNTY5ODU2MjI0XHJcbiAgICAvLyAzNy42MjkxMDA0MTUzNDkyOCw1NS43NTQ2NjA2NzU1MjcyMiwzNy42NTE2ODE3OTA2MzA0LDU1LjcyNzY2ODE5NzI5NTczXHJcbiAgICBbWzM3LjU4OTUxNTM4MjY4MzE5Niw1NS43NzEwNjg5NzkzODM4NF0sWzM3LjYyNjE1MDY5ODIzMjI0NCw1NS43NjQxNjc5OTc0MjQ1NjVdXSxcclxuICAgIFtbMzcuNjAwNTM3OTc1Njg4NTk2LDU1Ljc3Nzk5ODQzMjU2Mjc0XSxbMzcuNjIyNzg0MTUzNzY4MTY2LDU1LjczNzE5NTQxNzg0Nzc4XV0sXHJcbiAgICBbWzM3LjYwMDY4OTI5NTEyNjUxLDU1LjcyNDc4OTc1NzgyNzkyXSxbMzcuNjM4NTkyMTc0NjY3MDIsNTUuNzczOTczNTY5ODU2MjI0XV0sXHJcbiAgICBbWzM3LjYyOTEwMDQxNTM0OTI4LDU1Ljc1NDY2MDY3NTUyNzIyXSxbMzcuNjUxNjgxNzkwNjMwNCw1NS43Mjc2NjgxOTcyOTU3M11dXHJcbl07XHJcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XHJcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vZGF0YS9pbmRleC5qcycpO1xyXG5cclxudmFyIG9zbSA9IEwudGlsZUxheWVyKCdodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9ub2xhYmVscy97en0ve3h9L3t5fS5wbmcnLCB7XHJcbiAgICAgICAgbWF4Wm9vbTogMjIsXHJcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4nXHJcbiAgICB9KSxcclxuICAgIHBvaW50ID0gTC5sYXRMbmcoWzU1Ljc1MzIxMCwgMzcuNjIxNzY2XSksXHJcbiAgICBtYXAgPSBuZXcgTC5NYXAoJ21hcCcsIHtsYXllcnM6IFtvc21dLCBjZW50ZXI6IHBvaW50LCB6b29tOiAxMiwgbWF4Wm9vbTogMjJ9KSxcclxuICAgIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xyXG5cclxud2luZG93Lm1hcCA9IG1hcDtcclxuXHJcbnZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCksXHJcbiAgICBuID0gYm91bmRzLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgZSA9IGJvdW5kcy5fbm9ydGhFYXN0LmxuZyxcclxuICAgIHMgPSBib3VuZHMuX3NvdXRoV2VzdC5sYXQsXHJcbiAgICB3ID0gYm91bmRzLl9zb3V0aFdlc3QubG5nLFxyXG4gICAgaGVpZ2h0ID0gbiAtIHMsXHJcbiAgICB3aWR0aCA9IGUgLSB3LFxyXG4gICAgcUhlaWdodCA9IGhlaWdodCAvIDQsXHJcbiAgICBxV2lkdGggPSB3aWR0aCAvIDQsXHJcbiAgICBsaW5lcyA9IFtdO1xyXG5cclxudmFyIHBvaW50cyA9IHR1cmYucmFuZG9tKCdwb2ludHMnLCA4LCB7XHJcbiAgICBiYm94OiBbdyArIHFXaWR0aCwgcyArIHFIZWlnaHQsIGUgLSBxV2lkdGgsIG4gLSBxSGVpZ2h0XVxyXG59KTtcclxuXHJcbnZhciBjb29yZHMgPSBwb2ludHMuZmVhdHVyZXMubWFwKGZ1bmN0aW9uKGZlYXR1cmUpIHtcclxuICAgIHJldHVybiBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xyXG59KVxyXG5cclxuZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICBsaW5lcy5wdXNoKFtjb29yZHNbaV0sIGNvb3Jkc1tpKzFdXSk7XHJcbn1cclxuXHJcbi8vIGRyYXdMaW5lcyhsaW5lcyk7XHJcbmRyYXdMaW5lcyhkYXRhKTtcclxuXHJcbi8vIHZhciBwcyA9IGZpbmRJbnRlcnNlY3Rpb25zKGxpbmVzLCBtYXApO1xyXG52YXIgcHMgPSBmaW5kSW50ZXJzZWN0aW9ucyhkYXRhLCBtYXApO1xyXG5cclxucHMuZm9yRWFjaChmdW5jdGlvbiAocCkge1xyXG4gICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcocC5zbGljZSgpLnJldmVyc2UoKSksIHtyYWRpdXM6IDUsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYWRkVG8obWFwKTtcclxufSlcclxuXHJcbmZ1bmN0aW9uIGRyYXdMaW5lcyhhcnJheSkge1xyXG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xyXG4gICAgICAgIHZhciBiZWdpbiA9IGxpbmVbMF0sXHJcbiAgICAgICAgICAgIGVuZCA9IGxpbmVbMV07XHJcblxyXG4gICAgICAgIEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGJlZ2luKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcclxuICAgICAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhlbmQpLCB7cmFkaXVzOiAyLCBmaWxsQ29sb3I6IFwiI0ZGRkYwMFwiLCB3ZWlnaHQ6IDJ9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgIEwucG9seWxpbmUoW2JlZ2luLCBlbmRdLCB7d2VpZ2h0OiAxfSkuYWRkVG8obWFwKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5jb25zb2xlLmxvZyhwcyk7XHJcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4vc3JjL3N3ZWVwbGluZS5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW50ZXJzZWN0aW9ucztcclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmF2bCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQcmludHMgdHJlZSBob3Jpem9udGFsbHlcbiAqIEBwYXJhbSAge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICByb290XG4gKiBAcGFyYW0gIHtGdW5jdGlvbihub2RlOk5vZGUpOlN0cmluZ30gW3ByaW50Tm9kZV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcHJpbnQgKHJvb3QsIHByaW50Tm9kZSkge1xuICBpZiAoIHByaW50Tm9kZSA9PT0gdm9pZCAwICkgcHJpbnROb2RlID0gZnVuY3Rpb24gKG4pIHsgcmV0dXJuIG4ua2V5OyB9O1xuXG4gIHZhciBvdXQgPSBbXTtcbiAgcm93KHJvb3QsICcnLCB0cnVlLCBmdW5jdGlvbiAodikgeyByZXR1cm4gb3V0LnB1c2godik7IH0sIHByaW50Tm9kZSk7XG4gIHJldHVybiBvdXQuam9pbignJyk7XG59XG5cbi8qKlxuICogUHJpbnRzIGxldmVsIG9mIHRoZSB0cmVlXG4gKiBAcGFyYW0gIHtOb2RlfSAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgcHJlZml4XG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgIGlzVGFpbFxuICogQHBhcmFtICB7RnVuY3Rpb24oaW46c3RyaW5nKTp2b2lkfSAgICBvdXRcbiAqIEBwYXJhbSAge0Z1bmN0aW9uKG5vZGU6Tm9kZSk6U3RyaW5nfSAgcHJpbnROb2RlXG4gKi9cbmZ1bmN0aW9uIHJvdyAocm9vdCwgcHJlZml4LCBpc1RhaWwsIG91dCwgcHJpbnROb2RlKSB7XG4gIGlmIChyb290KSB7XG4gICAgb3V0KChcIlwiICsgcHJlZml4ICsgKGlzVGFpbCA/ICfilJTilIDilIAgJyA6ICfilJzilIDilIAgJykgKyAocHJpbnROb2RlKHJvb3QpKSArIFwiXFxuXCIpKTtcbiAgICB2YXIgaW5kZW50ID0gcHJlZml4ICsgKGlzVGFpbCA/ICcgICAgJyA6ICfilIIgICAnKTtcbiAgICBpZiAocm9vdC5sZWZ0KSAgeyByb3cocm9vdC5sZWZ0LCAgaW5kZW50LCBmYWxzZSwgb3V0LCBwcmludE5vZGUpOyB9XG4gICAgaWYgKHJvb3QucmlnaHQpIHsgcm93KHJvb3QucmlnaHQsIGluZGVudCwgdHJ1ZSwgIG91dCwgcHJpbnROb2RlKTsgfVxuICB9XG59XG5cblxuLyoqXG4gKiBJcyB0aGUgdHJlZSBiYWxhbmNlZCAobm9uZSBvZiB0aGUgc3VidHJlZXMgZGlmZmVyIGluIGhlaWdodCBieSBtb3JlIHRoYW4gMSlcbiAqIEBwYXJhbSAge05vZGV9ICAgIHJvb3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQmFsYW5jZWQocm9vdCkge1xuICBpZiAocm9vdCA9PT0gbnVsbCkgeyByZXR1cm4gdHJ1ZTsgfSAvLyBJZiBub2RlIGlzIGVtcHR5IHRoZW4gcmV0dXJuIHRydWVcblxuICAvLyBHZXQgdGhlIGhlaWdodCBvZiBsZWZ0IGFuZCByaWdodCBzdWIgdHJlZXNcbiAgdmFyIGxoID0gaGVpZ2h0KHJvb3QubGVmdCk7XG4gIHZhciByaCA9IGhlaWdodChyb290LnJpZ2h0KTtcblxuICBpZiAoTWF0aC5hYnMobGggLSByaCkgPD0gMSAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LmxlZnQpICAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LnJpZ2h0KSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIElmIHdlIHJlYWNoIGhlcmUgdGhlbiB0cmVlIGlzIG5vdCBoZWlnaHQtYmFsYW5jZWRcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBDb21wdXRlIHRoZSAnaGVpZ2h0JyBvZiBhIHRyZWUuXG4gKiBIZWlnaHQgaXMgdGhlIG51bWJlciBvZiBub2RlcyBhbG9uZyB0aGUgbG9uZ2VzdCBwYXRoXG4gKiBmcm9tIHRoZSByb290IG5vZGUgZG93biB0byB0aGUgZmFydGhlc3QgbGVhZiBub2RlLlxuICpcbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gaGVpZ2h0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPyAoMSArIE1hdGgubWF4KGhlaWdodChub2RlLmxlZnQpLCBoZWlnaHQobm9kZS5yaWdodCkpKSA6IDA7XG59XG5cbi8vIGZ1bmN0aW9uIGNyZWF0ZU5vZGUgKHBhcmVudCwgbGVmdCwgcmlnaHQsIGhlaWdodCwga2V5LCBkYXRhKSB7XG4vLyAgIHJldHVybiB7IHBhcmVudCwgbGVmdCwgcmlnaHQsIGJhbGFuY2VGYWN0b3I6IGhlaWdodCwga2V5LCBkYXRhIH07XG4vLyB9XG5cbi8qKlxuICogQHR5cGVkZWYge3tcbiAqICAgcGFyZW50OiAgICAgICAgTm9kZXxOdWxsLFxuICogICBsZWZ0OiAgICAgICAgICBOb2RlfE51bGwsXG4gKiAgIHJpZ2h0OiAgICAgICAgIE5vZGV8TnVsbCxcbiAqICAgYmFsYW5jZUZhY3RvcjogTnVtYmVyLFxuICogICBrZXk6ICAgICAgICAgICBhbnksXG4gKiAgIGRhdGE6ICAgICAgICAgIG9iamVjdD9cbiAqIH19IE5vZGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsqfSBLZXlcbiAqL1xuXG4vKipcbiAqIERlZmF1bHQgY29tcGFyaXNvbiBmdW5jdGlvblxuICogQHBhcmFtIHsqfSBhXG4gKiBAcGFyYW0geyp9IGJcbiAqL1xuZnVuY3Rpb24gREVGQVVMVF9DT01QQVJFIChhLCBiKSB7IHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDsgfVxuXG5cbi8qKlxuICogU2luZ2xlIGxlZnQgcm90YXRpb25cbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZUxlZnQgKG5vZGUpIHtcbiAgdmFyIHJpZ2h0Tm9kZSA9IG5vZGUucmlnaHQ7XG4gIG5vZGUucmlnaHQgICAgPSByaWdodE5vZGUubGVmdDtcblxuICBpZiAocmlnaHROb2RlLmxlZnQpIHsgcmlnaHROb2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIHJpZ2h0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAocmlnaHROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LmxlZnQgPSByaWdodE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQucmlnaHQgPSByaWdodE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSByaWdodE5vZGU7XG4gIHJpZ2h0Tm9kZS5sZWZ0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSByaWdodE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG4gIHJldHVybiByaWdodE5vZGU7XG59XG5cblxuZnVuY3Rpb24gcm90YXRlUmlnaHQgKG5vZGUpIHtcbiAgdmFyIGxlZnROb2RlID0gbm9kZS5sZWZ0O1xuICBub2RlLmxlZnQgPSBsZWZ0Tm9kZS5yaWdodDtcbiAgaWYgKG5vZGUubGVmdCkgeyBub2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIGxlZnROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAobGVmdE5vZGUucGFyZW50KSB7XG4gICAgaWYgKGxlZnROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9IGxlZnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQucmlnaHQgPSBsZWZ0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IGxlZnROb2RlO1xuICBsZWZ0Tm9kZS5yaWdodCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmV0dXJuIGxlZnROb2RlO1xufVxuXG5cbi8vIGZ1bmN0aW9uIGxlZnRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHJvdGF0ZUxlZnQobm9kZS5sZWZ0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZVJpZ2h0KG5vZGUpO1xuLy8gfVxuXG5cbi8vIGZ1bmN0aW9uIHJpZ2h0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSByb3RhdGVSaWdodChub2RlLnJpZ2h0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZUxlZnQobm9kZSk7XG4vLyB9XG5cblxudmFyIFRyZWUgPSBmdW5jdGlvbiBUcmVlIChjb21wYXJhdG9yKSB7XG4gIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yIHx8IERFRkFVTFRfQ09NUEFSRTtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG4gIHRoaXMuX3NpemUgPSAwO1xufTtcblxudmFyIHByb3RvdHlwZUFjY2Vzc29ycyA9IHsgc2l6ZToge30gfTtcblxuXG4vKipcbiAqIENsZWFyIHRoZSB0cmVlXG4gKi9cblRyZWUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95ICgpIHtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG59O1xuXG4vKipcbiAqIE51bWJlciBvZiBub2Rlc1xuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5wcm90b3R5cGVBY2Nlc3NvcnMuc2l6ZS5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9zaXplO1xufTtcblxuXG4vKipcbiAqIFdoZXRoZXIgdGhlIHRyZWUgY29udGFpbnMgYSBub2RlIHdpdGggdGhlIGdpdmVuIGtleVxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zIChrZXkpIHtcbiAgaWYgKHRoaXMuX3Jvb3Qpe1xuICAgIHZhciBub2RlICAgICA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuICAgIHdoaWxlIChub2RlKXtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGtleSwgbm9kZS5rZXkpO1xuICAgICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgICBlbHNlICAgICAgICAgICAgICB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblxuLyogZXNsaW50LWRpc2FibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG4vKipcbiAqIFN1Y2Nlc3NvciBub2RlXG4gKiBAcGFyYW17Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gbmV4dCAobm9kZSkge1xuICB2YXIgc3VjY2Vzc29yID0gbm9kZTtcbiAgaWYgKHN1Y2Nlc3Nvcikge1xuICAgIGlmIChzdWNjZXNzb3IucmlnaHQpIHtcbiAgICAgIHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5yaWdodDtcbiAgICAgIHdoaWxlIChzdWNjZXNzb3IgJiYgc3VjY2Vzc29yLmxlZnQpIHsgc3VjY2Vzc29yID0gc3VjY2Vzc29yLmxlZnQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2Vzc29yID0gbm9kZS5wYXJlbnQ7XG4gICAgICB3aGlsZSAoc3VjY2Vzc29yICYmIHN1Y2Nlc3Nvci5yaWdodCA9PT0gbm9kZSkge1xuICAgICAgICBub2RlID0gc3VjY2Vzc29yOyBzdWNjZXNzb3IgPSBzdWNjZXNzb3IucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3VjY2Vzc29yO1xufTtcblxuXG4vKipcbiAqIFByZWRlY2Vzc29yIG5vZGVcbiAqIEBwYXJhbXtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiBwcmV2IChub2RlKSB7XG4gIHZhciBwcmVkZWNlc3NvciA9IG5vZGU7XG4gIGlmIChwcmVkZWNlc3Nvcikge1xuICAgIGlmIChwcmVkZWNlc3Nvci5sZWZ0KSB7XG4gICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLmxlZnQ7XG4gICAgICB3aGlsZSAocHJlZGVjZXNzb3IgJiYgcHJlZGVjZXNzb3IucmlnaHQpIHsgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5yaWdodDsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmVkZWNlc3NvciA9IG5vZGUucGFyZW50O1xuICAgICAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLmxlZnQgPT09IG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHByZWRlY2Vzc29yO1xuICAgICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByZWRlY2Vzc29yO1xufTtcbi8qIGVzbGludC1lbmFibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG5cbi8qKlxuICogQHBhcmFte0Z1bmN0aW9uKG5vZGU6Tm9kZSk6dm9pZH0gZm5cbiAqIEByZXR1cm4ge0FWTFRyZWV9XG4gKi9cblRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoIChmbikge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIGRvbmUgPSBmYWxzZSwgaSA9IDA7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgLy8gUmVhY2ggdGhlIGxlZnQgbW9zdCBOb2RlIG9mIHRoZSBjdXJyZW50IE5vZGVcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgLy8gUGxhY2UgcG9pbnRlciB0byBhIHRyZWUgbm9kZSBvbiB0aGUgc3RhY2tcbiAgICAgIC8vIGJlZm9yZSB0cmF2ZXJzaW5nIHRoZSBub2RlJ3MgbGVmdCBzdWJ0cmVlXG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCYWNrVHJhY2sgZnJvbSB0aGUgZW1wdHkgc3VidHJlZSBhbmQgdmlzaXQgdGhlIE5vZGVcbiAgICAgIC8vIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrOyBob3dldmVyLCBpZiB0aGUgc3RhY2sgaXNcbiAgICAgIC8vIGVtcHR5IHlvdSBhcmUgZG9uZVxuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgZm4oY3VycmVudCwgaSsrKTtcblxuICAgICAgICAvLyBXZSBoYXZlIHZpc2l0ZWQgdGhlIG5vZGUgYW5kIGl0cyBsZWZ0XG4gICAgICAgIC8vIHN1YnRyZWUuIE5vdywgaXQncyByaWdodCBzdWJ0cmVlJ3MgdHVyblxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYWxsIGtleXMgaW4gb3JkZXJcbiAqIEByZXR1cm4ge0FycmF5PEtleT59XG4gKi9cblRyZWUucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiBrZXlzICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICB2YXIgcyA9IFtdLCByID0gW10sIGRvbmUgPSBmYWxzZTtcblxuICB3aGlsZSAoIWRvbmUpIHtcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgcy5wdXNoKGN1cnJlbnQpO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgci5wdXNoKGN1cnJlbnQua2V5KTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9IGVsc2UgeyBkb25lID0gdHJ1ZTsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGBkYXRhYCBmaWVsZHMgb2YgYWxsIG5vZGVzIGluIG9yZGVyLlxuICogQHJldHVybiB7QXJyYXk8Kj59XG4gKi9cblRyZWUucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmRhdGEpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgbm9kZSB3aXRoIHRoZSBtaW5pbXVtIGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5taW5Ob2RlID0gZnVuY3Rpb24gbWluTm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICByZXR1cm4gbm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIG5vZGUgd2l0aCB0aGUgbWF4IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5tYXhOb2RlID0gZnVuY3Rpb24gbWF4Tm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG4vKipcbiAqIE1pbiBrZXlcbiAqIEByZXR1cm4ge0tleX1cbiAqL1xuVHJlZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gbWluICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICBpZiAoIW5vZGUpIHsgcmV0dXJuIG51bGw7IH1cbiAgd2hpbGUgKG5vZGUubGVmdCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cbi8qKlxuICogTWF4IGtleVxuICogQHJldHVybiB7S2V5fE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uIG1heCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgaWYgKCFub2RlKSB7IHJldHVybiBudWxsOyB9XG4gIHdoaWxlIChub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlLmtleTtcbn07XG5cblxuLyoqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5UcmVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eSAoKSB7XG4gIHJldHVybiAhdGhpcy5fcm9vdDtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBub2RlIHdpdGggc21hbGxlc3Qga2V5XG4gKiBAcmV0dXJuIHtOb2RlfE51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uIHBvcCAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdCwgcmV0dXJuVmFsdWUgPSBudWxsO1xuICBpZiAobm9kZSkge1xuICAgIHdoaWxlIChub2RlLmxlZnQpIHsgbm9kZSA9IG5vZGUubGVmdDsgfVxuICAgIHJldHVyblZhbHVlID0geyBrZXk6IG5vZGUua2V5LCBkYXRhOiBub2RlLmRhdGEgfTtcbiAgICB0aGlzLnJlbW92ZShub2RlLmtleSk7XG4gIH1cbiAgcmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuXG4vKipcbiAqIEZpbmQgbm9kZSBieSBrZXlcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gZmluZCAoa2V5KSB7XG4gIHZhciByb290ID0gdGhpcy5fcm9vdDtcbiAgaWYgKHJvb3QgPT09IG51bGwpICB7IHJldHVybiBudWxsOyB9XG4gIGlmIChrZXkgPT09IHJvb3Qua2V5KSB7IHJldHVybiByb290OyB9XG5cbiAgdmFyIHN1YnRyZWUgPSByb290LCBjbXA7XG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgd2hpbGUgKHN1YnRyZWUpIHtcbiAgICBjbXAgPSBjb21wYXJlKGtleSwgc3VidHJlZS5rZXkpO1xuICAgIGlmICAgIChjbXAgPT09IDApIHsgcmV0dXJuIHN1YnRyZWU7IH1cbiAgICBlbHNlIGlmIChjbXAgPCAwKSB7IHN1YnRyZWUgPSBzdWJ0cmVlLmxlZnQ7IH1cbiAgICBlbHNlICAgICAgICAgICAgICB7IHN1YnRyZWUgPSBzdWJ0cmVlLnJpZ2h0OyB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBJbnNlcnQgYSBub2RlIGludG8gdGhlIHRyZWVcbiAqIEBwYXJhbXtLZXl9IGtleVxuICogQHBhcmFteyp9IFtkYXRhXVxuICogQHJldHVybiB7Tm9kZXxOdWxsfVxuICovXG5UcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQgKGtleSwgZGF0YSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fcm9vdCkge1xuICAgIHRoaXMuX3Jvb3QgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsLCBiYWxhbmNlRmFjdG9yOiAwLFxuICAgICAga2V5OiBrZXksIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHRoaXMuX3NpemUrKztcbiAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgfVxuXG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgdmFyIG5vZGUgID0gdGhpcy5fcm9vdDtcbiAgdmFyIHBhcmVudD0gbnVsbDtcbiAgdmFyIGNtcCAgID0gMDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgcGFyZW50ID0gbm9kZTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG5cbiAgdmFyIG5ld05vZGUgPSB7XG4gICAgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgcGFyZW50OiBwYXJlbnQsIGtleToga2V5LCBkYXRhOiBkYXRhLFxuICB9O1xuICBpZiAoY21wIDwgMCkgeyBwYXJlbnQubGVmdD0gbmV3Tm9kZTsgfVxuICBlbHNlICAgICAgIHsgcGFyZW50LnJpZ2h0ID0gbmV3Tm9kZTsgfVxuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAoY29tcGFyZShwYXJlbnQua2V5LCBrZXkpIDwgMCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy9sZXQgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIHZhciBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGxldCBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QkMSA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290JDE7IH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgdGhpcy5fc2l6ZSsrO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBub2RlIGZyb20gdGhlIHRyZWUuIElmIG5vdCBmb3VuZCwgcmV0dXJucyBudWxsLlxuICogQHBhcmFte0tleX0ga2V5XG4gKiBAcmV0dXJuIHtOb2RlOk51bGx9XG4gKi9cblRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoa2V5KSB7XG4gICAgdmFyIHRoaXMkMSA9IHRoaXM7XG5cbiAgaWYgKCF0aGlzLl9yb290KSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICB2YXIgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB2YXIgcmV0dXJuVmFsdWUgPSBub2RlLmtleTtcblxuICBpZiAobm9kZS5sZWZ0KSB7XG4gICAgdmFyIG1heCA9IG5vZGUubGVmdDtcblxuICAgIHdoaWxlIChtYXgubGVmdCB8fCBtYXgucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtYXgucmlnaHQpIHsgbWF4ID0gbWF4LnJpZ2h0OyB9XG5cbiAgICAgIG5vZGUua2V5ID0gbWF4LmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgICAgaWYgKG1heC5sZWZ0KSB7XG4gICAgICAgIG5vZGUgPSBtYXg7XG4gICAgICAgIG1heCA9IG1heC5sZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtYXgua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgIG5vZGUgPSBtYXg7XG4gIH1cblxuICBpZiAobm9kZS5yaWdodCkge1xuICAgIHZhciBtaW4gPSBub2RlLnJpZ2h0O1xuXG4gICAgd2hpbGUgKG1pbi5sZWZ0IHx8IG1pbi5yaWdodCkge1xuICAgICAgd2hpbGUgKG1pbi5sZWZ0KSB7IG1pbiA9IG1pbi5sZWZ0OyB9XG5cbiAgICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgICBpZiAobWluLnJpZ2h0KSB7XG4gICAgICAgIG5vZGUgPSBtaW47XG4gICAgICAgIG1pbiA9IG1pbi5yaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICBub2RlID0gbWluO1xuICB9XG5cbiAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50O1xuICB2YXIgcHAgICA9IG5vZGU7XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQubGVmdCA9PT0gcHApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vbGV0IG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3Q7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGxldCBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QkMSA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290JDE7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3QkMTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IC0xIHx8IHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IGJyZWFrOyB9XG5cbiAgICBwcCAgID0gcGFyZW50O1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkgeyBub2RlLnBhcmVudC5sZWZ0PSBudWxsOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICB7IG5vZGUucGFyZW50LnJpZ2h0ID0gbnVsbDsgfVxuICB9XG5cbiAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHsgdGhpcy5fcm9vdCA9IG51bGw7IH1cblxuICB0aGlzLl9zaXplLS07XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHRyZWUgaXMgYmFsYW5jZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblRyZWUucHJvdG90eXBlLmlzQmFsYW5jZWQgPSBmdW5jdGlvbiBpc0JhbGFuY2VkJDEgKCkge1xuICByZXR1cm4gaXNCYWxhbmNlZCh0aGlzLl9yb290KTtcbn07XG5cblxuLyoqXG4gKiBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyZWUgLSBwcmltaXRpdmUgaG9yaXpvbnRhbCBwcmludC1vdXRcbiAqIEBwYXJhbXtGdW5jdGlvbihOb2RlKTpTdHJpbmd9IFtwcmludE5vZGVdXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblRyZWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKHByaW50Tm9kZSkge1xuICByZXR1cm4gcHJpbnQodGhpcy5fcm9vdCwgcHJpbnROb2RlKTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBUcmVlLnByb3RvdHlwZSwgcHJvdG90eXBlQWNjZXNzb3JzICk7XG5cbnJldHVybiBUcmVlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXZsLmpzLm1hcFxuIiwiLy8g0L/QvtGH0LXQvNGDLdGC0L4g0L/QtdGA0LLRi9C80Lgg0LjQvdC+0LPQtNCwINC/0YDQuNGF0L7QtNGP0YIg0YHQvtCx0YvRgtC40Y8gZW5kXHJcbi8vINC90LXQutC+0YLQvtGA0YvQtSDRgtC+0YfQutC4INC90LUg0LLQuNC00L3Riz9cclxuXHJcblxyXG5cclxudmFyIFRyZWUgPSByZXF1aXJlKCdhdmwnKSxcclxuICAgIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7QXJyYXl9IHNlZ21lbnRzIHNldCBvZiBzZWdtZW50cyBpbnRlcnNlY3Rpbmcgc3dlZXBsaW5lIFtbW3gxLCB5MV0sIFt4MiwgeTJdXSAuLi4gW1t4bSwgeW1dLCBbeG4sIHluXV1dXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZmluZEludGVyc2VjdGlvbnMoc2VnbWVudHMsIG1hcCkge1xyXG4gICAgdmFyIHF1ZXVlID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVBvaW50cyksXHJcbiAgICAgICAgc3RhdHVzID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVNlZ21lbnRzKSxcclxuICAgICAgICByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50KSB7XHJcbiAgICAgICAgc2VnbWVudC5zb3J0KHV0aWxzLmNvbXBhcmVQb2ludHMpO1xyXG4gICAgICAgIHZhciBiZWdpbiA9IHNlZ21lbnRbMF0sXHJcbiAgICAgICAgICAgIGVuZCA9IHNlZ21lbnRbMV0sXHJcbiAgICAgICAgICAgIGJlZ2luRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIHBvaW50OiBiZWdpbixcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdiZWdpbicsXHJcbiAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVuZERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludDogZW5kLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2VuZCcsXHJcbiAgICAgICAgICAgICAgICBzZWdtZW50OiBzZWdtZW50XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgcXVldWUuaW5zZXJ0KGJlZ2luLCBiZWdpbkRhdGEpO1xyXG4gICAgICAgIHF1ZXVlLmluc2VydChlbmQsIGVuZERhdGEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLypcclxuICAgICAqIExPR1xyXG4gICAgICovXHJcbiAgICAvLyB2YXIgdmFsdWVzID0gcXVldWUudmFsdWVzKCk7XHJcblxyXG4gICAgLy8gdmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgYXJyYXkpIHtcclxuICAgIC8vICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xyXG4gICAgLy8gICAgIHZhciBtcmsgPSBMLmNpcmNsZU1hcmtlcihsbCwge3JhZGl1czogNCwgY29sb3I6ICdyZWQnLCBmaWxsQ29sb3I6ICdGRjAwJyArIDIgKiogaW5kZXh9KS5hZGRUbyhtYXApO1xyXG4gICAgLy8gICAgIG1yay5iaW5kUG9wdXAoJycgKyBpbmRleCArICdcXG4nICsgcFswXSArICdcXG4nICsgcFsxXSk7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICAvKlxyXG4gICAgICogTE9HIEVORFxyXG4gICAgICovXHJcblxyXG4gICAgLy8gZGVidWc6XHJcbiAgICAvLyBMLm1hcmtlcihMLmxhdExuZyhbXS5zbGljZSgpLnJldmVyc2UoKSkpLmFkZFRvKG1hcCk7XHJcbiAgICB3aGlsZSAoIXF1ZXVlLmlzRW1wdHkoKSkge1xyXG4gICAgICAgIHZhciBldmVudCA9IHF1ZXVlLnBvcCgpO1xyXG4gICAgICAgIHZhciBwID0gZXZlbnQuZGF0YS5wb2ludDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coaSArICcpIGN1cnJlbnQgcG9pbnQ6ICcgKyBldmVudC5kYXRhLnBvaW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCcgICBwb2ludCB0eXBlOiAnICsgZXZlbnQuZGF0YS50eXBlKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnICAgcXVldWU6ICcgKyBxdWV1ZS50b1N0cmluZygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnICAgc3RhdHVzOiAnICsgc3RhdHVzLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnQuZGF0YS50eXBlID09PSAnYmVnaW4nKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xyXG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAnZ3JlZW4nLCBmaWxsQ29sb3I6ICdncmVlbid9KS5hZGRUbyhtYXApO1xyXG5cclxuICAgICAgICAgICAgc3RhdHVzLmluc2VydChldmVudC5kYXRhLnNlZ21lbnQpO1xyXG4gICAgICAgICAgICB2YXIgc2VnRSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBMT0dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBsbHMgPSBzZWdFLmtleS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XHJcbiAgICAgICAgICAgIHZhciBsaW5lID0gTC5wb2x5bGluZShsbHMsIHtjb2xvcjogJ2dyZWVuJ30pLmFkZFRvKG1hcCk7XHJcblxyXG4gICAgICAgICAgICBsaW5lLmJpbmRQb3B1cCgnYWRkZWQnICsgaSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3cgYWRkaW5nIHNlZ21lbnQ6ICcpO1xyXG4gICAgICAgICAgICBzZWdFLmtleS5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygneDogJyArIHBbMF0gKyAnIHk6ICcgKyBwWzFdKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTE9HIEVORFxyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHZhciBzZWdBID0gc3RhdHVzLnByZXYoc2VnRSk7XHJcbiAgICAgICAgICAgIHZhciBzZWdCID0gc3RhdHVzLm5leHQoc2VnRSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNlZ0EpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWdCKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWdBKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWFJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdFLmtleSwgc2VnQS5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlYUludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVhSW50ZXJzZWN0aW9uUG9pbnREYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogZWFJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbc2VnRS5rZXksIHNlZ0Eua2V5XVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5pbnNlcnQoZWFJbnRlcnNlY3Rpb25Qb2ludCwgZWFJbnRlcnNlY3Rpb25Qb2ludERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnRlZCBwb2ludDonICsgZWFJbnRlcnNlY3Rpb25Qb2ludC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ0IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlYkludGVyc2VjdGlvblBvaW50ID0gdXRpbHMuZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKHNlZ0Uua2V5LCBzZWdCLmtleSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGViSW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWJJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBlYkludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJzZWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWdFLmtleSwgc2VnQi5rZXldXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLmluc2VydChlYkludGVyc2VjdGlvblBvaW50LCBlYkludGVyc2VjdGlvblBvaW50RGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGViSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGViSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgICAgICBFbHNlIElmIChFIGlzIGEgcmlnaHQgZW5kcG9pbnQpIHtcclxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ2VuZCcpIHtcclxuICAgICAgICAgICAgdmFyIGxsID0gTC5sYXRMbmcoW3BbMV0sIHBbMF1dKTtcclxuICAgICAgICAgICAgdmFyIG1yayA9IEwuY2lyY2xlTWFya2VyKGxsLCB7cmFkaXVzOiA0LCBjb2xvcjogJ3JlZCcsIGZpbGxDb2xvcjogJ3JlZCd9KS5hZGRUbyhtYXApO1xyXG4gICAgICAgICAgICB2YXIgc2VnRSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudCk7XHJcbiAgICAgICAgICAgIHZhciBzZWdBID0gc3RhdHVzLnByZXYoc2VnRSk7XHJcbiAgICAgICAgICAgIHZhciBzZWdCID0gc3RhdHVzLm5leHQoc2VnRSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBMT0dcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICB2YXIgbGxzID0gc2VnRS5rZXkubWFwKGZ1bmN0aW9uKHApe3JldHVybiBMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKX0pO1xyXG4gICAgICAgICAgICAgdmFyIGxpbmUgPSBMLnBvbHlsaW5lKGxscywge2NvbG9yOiAncmVkJ30pLmFkZFRvKG1hcCk7XHJcblxyXG4gICAgICAgICAgICAgbGluZS5iaW5kUG9wdXAoJ3JlbW92ZWQnICsgaSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQSAmJiBzZWdCKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWJJbnRlcnNlY3Rpb25Qb2ludCA9IHV0aWxzLmZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihzZWdBLmtleSwgc2VnQi5rZXkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhYkludGVyc2VjdGlvblBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFxdWV1ZS5maW5kKGFiSW50ZXJzZWN0aW9uUG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhYkludGVyc2VjdGlvblBvaW50RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBhYkludGVyc2VjdGlvblBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyc2VjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW3NlZ0Eua2V5LCBzZWdCLmtleV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgSW5zZXJ0IEkgaW50byBFUTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGFiSW50ZXJzZWN0aW9uUG9pbnQsIGFiSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGFiSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGFiSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIExPR1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgRGVsZXRlIHNlZ0UgZnJvbSBTTDtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RyZWUgYmVmb3JlIHJlbW92aW5nIHNlZ21lbnQ6ICcpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdGF0dXMudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIC8vIHZhciByZW1vdmluZyA9IHNlZ0UuZGF0YTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3cgcmVtb3Zpbmcgc2VnbWVudDogJyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cy5maW5kKHNlZ0Uua2V5KSk7XHJcbiAgICAgICAgICAgIC8vIHJlbW92aW5nLmZvckVhY2goZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd4OiAnICsgcFswXSArICcgeTogJyArIHBbMV0pO1xyXG4gICAgICAgICAgICAvLyB9KVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBMT0cgRU5EXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzdGF0dXMucmVtb3ZlKHNlZ0Uua2V5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xyXG4gICAgICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAnYmx1ZScsIGZpbGxDb2xvcjogJ2JsdWUnfSkuYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goZXZlbnQuZGF0YS5wb2ludCk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIExldCBzZWdFMSBhYm92ZSBzZWdFMiBiZSBFJ3MgaW50ZXJzZWN0aW5nIHNlZ21lbnRzIGluIFNMO1xyXG4gICAgICAgICAgICB2YXIgc2VnMSA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudHNbMF0pLFxyXG4gICAgICAgICAgICAgICAgc2VnMiA9IHN0YXR1cy5maW5kKGV2ZW50LmRhdGEuc2VnbWVudHNbMV0pO1xyXG5cclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgU3dhcCB0aGVpciBwb3NpdGlvbnMgc28gdGhhdCBzZWdFMiBpcyBub3cgYWJvdmUgc2VnRTE7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcbiAgICAgICAgICAgIC8vIHN0YXR1cy5wcmV2KHNlZzEpID0gc3RhdHVzLmZpbmQoc2VnMik7XHJcbiAgICAgICAgICAgIC8vIHN0YXR1cy5uZXh0KHNlZzIpID0gc3RhdHVzLmZpbmQoc2VnMSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIExldCBzZWdBID0gdGhlIHNlZ21lbnQgYWJvdmUgc2VnRTIgaW4gU0w7XHJcbiAgICAgICAgICAgIHZhciBzZWdBID0gc3RhdHVzLm5leHQoc2VnMSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIExldCBzZWdCID0gdGhlIHNlZ21lbnQgYmVsb3cgc2VnRTEgaW4gU0w7XHJcbiAgICAgICAgICAgIHZhciBzZWdCID0gc3RhdHVzLnByZXYoc2VnMik7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnQSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGEySW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnMi5rZXksIHNlZ0Eua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYTJJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcXVldWUuZmluZChhMkludGVyc2VjdGlvblBvaW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYTJJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogYTJJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWcyLmtleSwgc2VnQS5rZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGEySW50ZXJzZWN0aW9uUG9pbnQsIGEySW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGEySW50ZXJzZWN0aW9uUG9pbnQ6JyArIGEySW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VnQikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIxSW50ZXJzZWN0aW9uUG9pbnQgPSB1dGlscy5maW5kU2VnbWVudHNJbnRlcnNlY3Rpb24oc2VnMS5rZXksIHNlZ0Iua2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYjFJbnRlcnNlY3Rpb25Qb2ludCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcXVldWUuZmluZChiMUludGVyc2VjdGlvblBvaW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYjFJbnRlcnNlY3Rpb25Qb2ludERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludDogYjFJbnRlcnNlY3Rpb25Qb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnRlcnNlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtzZWcxLmtleSwgc2VnQi5rZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWUuaW5zZXJ0KGIxSW50ZXJzZWN0aW9uUG9pbnQsIGIxSW50ZXJzZWN0aW9uUG9pbnREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luc2VydGVkIGIxSW50ZXJzZWN0aW9uUG9pbnQ6JyArIGIxSW50ZXJzZWN0aW9uUG9pbnQudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdHVzLnZhbHVlcygpLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgYXJyYXkpIHtcclxuXHJcbiAgICAgICAgbGxzID0gdmFsdWUubWFwKGZ1bmN0aW9uKHApe3JldHVybiBMLmxhdExuZyhwLnNsaWNlKCkucmV2ZXJzZSgpKX0pO1xyXG5cclxuICAgICAgICB2YXIgbGluZSA9IEwucG9seWxpbmUobGxzKS5hZGRUbyhtYXApO1xyXG4gICAgICAgIGxpbmUuYmluZFBvcHVwKCcnICsgaW5kZXgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgd2luZG93LnN0YXR1cyA9IHN0YXR1cztcclxuICAgIHdpbmRvdy5xdWV1ZSA9IHF1ZXVlO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW50ZXJzZWN0aW9ucztcclxuIiwiZnVuY3Rpb24gVXRpbHMoKSB7fTtcclxuXHJcblV0aWxzLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQvNC10L3RjNGI0LUgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L/QvtGB0YLQsNCy0LjRgiBhINC/0L4g0LzQtdC90YzRiNC10LzRgyDQuNC90LTQtdC60YHRgywg0YfQtdC8IGIsINGC0L4g0LXRgdGC0YwsIGEg0LjQtNGR0YIg0L/QtdGA0LLRi9C8LlxyXG4gICAgICAgINCV0YHQu9C4IGNvbXBhcmVGdW5jdGlvbihhLCBiKSDQstC10YDQvdGR0YIgMCwg0YHQvtGA0YLQuNGA0L7QstC60LAg0L7RgdGC0LDQstC40YIgYSDQuCBiINC90LXQuNC30LzQtdC90L3Ri9C80Lgg0L/QviDQvtGC0L3QvtGI0LXQvdC40Y4g0LTRgNGD0LMg0Log0LTRgNGD0LPRgyxcclxuICAgICAgICAgICAg0L3QviDQvtGC0YHQvtGA0YLQuNGA0YPQtdGCINC40YUg0L/QviDQvtGC0L3QvtGI0LXQvdC40Y4g0LrQviDQstGB0LXQvCDQtNGA0YPQs9C40Lwg0Y3Qu9C10LzQtdC90YLQsNC8LlxyXG4gICAgICAgICAgICDQntCx0YDQsNGC0LjRgtC1INCy0L3QuNC80LDQvdC40LU6INGB0YLQsNC90LTQsNGA0YIgRUNNQXNjcmlwdCDQvdC1INCz0LDRgNCw0L3RgtC40YDRg9C10YIg0LTQsNC90L3QvtC1INC/0L7QstC10LTQtdC90LjQtSwg0Lgg0LXQvNGDINGB0LvQtdC00YPRjtGCINC90LUg0LLRgdC1INCx0YDQsNGD0LfQtdGA0YtcclxuICAgICAgICAgICAgKNC90LDQv9GA0LjQvNC10YAsINCy0LXRgNGB0LjQuCBNb3ppbGxhINC/0L4g0LrRgNCw0LnQvdC10Lkg0LzQtdGA0LUsINC00L4gMjAwMyDQs9C+0LTQsCkuXHJcbiAgICAgICAg0JXRgdC70LggY29tcGFyZUZ1bmN0aW9uKGEsIGIpINCx0L7Qu9GM0YjQtSAwLCDRgdC+0YDRgtC40YDQvtCy0LrQsCDQv9C+0YHRgtCw0LLQuNGCIGIg0L/QviDQvNC10L3RjNGI0LXQvNGDINC40L3QtNC10LrRgdGDLCDRh9C10LwgYS5cclxuICAgICAgICDQpNGD0L3QutGG0LjRjyBjb21wYXJlRnVuY3Rpb24oYSwgYikg0LTQvtC70LbQvdCwINCy0YHQtdCz0LTQsCDQstC+0LfQstGA0LDRidCw0YLRjCDQvtC00LjQvdCw0LrQvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1INC00LvRjyDQvtC/0YDQtdC00LXQu9GR0L3QvdC+0Lkg0L/QsNGA0Ysg0Y3Qu9C10LzQtdC90YLQvtCyIGEg0LggYi5cclxuICAgICAgICAgICAg0JXRgdC70Lgg0LHRg9C00YPRgiDQstC+0LfQstGA0LDRidCw0YLRjNGB0Y8g0L3QtdC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3Ri9C1INGA0LXQt9GD0LvRjNGC0LDRgtGLLCDQv9C+0YDRj9C00L7QuiDRgdC+0YDRgtC40YDQvtCy0LrQuCDQsdGD0LTQtdGCINC90LUg0L7Qv9GA0LXQtNC10LvRkdC9LlxyXG4gICAgKi9cclxuICAgIC8vIHBvaW50cyBjb21wYXJhdG9yXHJcbiAgICBjb21wYXJlUG9pbnRzOiBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgdmFyIHgxID0gYVswXSxcclxuICAgICAgICAgICAgeTEgPSBhWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGJbMF0sXHJcbiAgICAgICAgICAgIHkyID0gYlsxXTtcclxuXHJcbiAgICAgICAgaWYgKHgxID4geDIgfHwgKHgxID09PSB4MiAmJiB5MSA+IHkyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHgxIDwgeDIgfHwgKHgxID09PSB4MiAmJiB5MSA8IHkyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4MSA9PT0geDIgJiYgeTEgPT09IHkyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGJbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYlswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBiWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGJbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYVswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBhWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGFbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYVsxXVsxXTtcclxuXHJcbiAgICAgICAgaWYgKHkzID4geTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeTMgPCB5MSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNvbXBhcmVTZWdtZW50czM6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAvLyAgICAgdmFyIHgxID0gYlswXVswXSxcclxuICAgIC8vICAgICAgICAgeTEgPSBiWzBdWzFdLFxyXG4gICAgLy8gICAgICAgICB4MiA9IGJbMV1bMF0sXHJcbiAgICAvLyAgICAgICAgIHkyID0gYlsxXVsxXSxcclxuICAgIC8vICAgICAgICAgeDMgPSBhWzBdWzBdLFxyXG4gICAgLy8gICAgICAgICB5MyA9IGFbMF1bMV0sXHJcbiAgICAvLyAgICAgICAgIHg0ID0gYVsxXVswXSxcclxuICAgIC8vICAgICAgICAgeTQgPSBhWzFdWzFdLFxyXG4gICAgLy8gICAgICAgICBpbnRlcnNlY3Rpb25Qb2ludCA9IGZpbmRTZWdtZW50c0ludGVyc2VjdGlvbihhLCBiKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgLy8gICAgIGlmICghaW50ZXJzZWN0aW9uUG9pbnQpIHtcclxuICAgIC8vICAgICAgICAgLy8g0L3QsNGF0L7QtNC40Lwg0LLQtdC60YLQvtGA0L3QvtC1INC/0YDQvtC40LfQstC10LTQtdC90LjQtSDQstC10LrRgtC+0YDQvtCyIGIg0LggYlswXWFbMF1cclxuICAgIC8vICAgICAgICAgdmFyIERiYTEgPSAoeDIgLSB4MSkgKiAoeTMgLSB5MSkgLSAoeTIgLSB5MSkgKiAoeDMgLSB4MSk7XHJcbiAgICAvLyAgICAgICAgIC8vINC90LDRhdC+0LTQuNC8INCy0LXQutGC0L7RgNC90L7QtSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LUg0LLQtdC60YLQvtGA0L7QsiBiINC4IGJbMF1hWzFdXHJcbiAgICAvLyAgICAgICAgIHZhciBEYmEyID0gKHgyIC0geDEpICogKHk0IC0geTEpIC0gKHkyIC0geTEpICogKHg0IC0geDEpO1xyXG4gICAgLy8gICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQt9C90LDQuiDQstC10LrRgtC+0YDQvdGL0YUg0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC5XHJcbiAgICAvLyAgICAgICAgIHZhciBEID0gRGJhMSAqIERiYTI7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICBpZiAoRCA8IDApIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgIC8vICAgICAgICAgfSBlbHNlIGlmIChEID4gMCkge1xyXG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAvLyAgICAgICAgIH0gZWxzZSBpZiAoRCA9PT0gMCkge1xyXG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZygndGhleSBhcmUgaW50ZXJzZWN0aW5nJyk7XHJcbiAgICAvLyAgICAgICAgIHZhciBpbnRlcnNlY3Rpb25YID0gaW50ZXJzZWN0aW9uUG9pbnRbMF07XHJcbiAgICAvLyAgICAgICAgIHZhciBpbnRlcnNlY3Rpb25ZID0gaW50ZXJzZWN0aW9uUG9pbnRbMV07XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAvLyBpZiAoeTMgPCBpbnRlcnNlY3Rpb25ZKSB7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICByZXR1cm4gLTFcclxuICAgIC8vICAgICAgICAgLy8gfSBlbHNlIGlmICh5MyA+IGludGVyc2VjdGlvblkpIHtcclxuICAgIC8vICAgICAgICAgLy8gICAgIHJldHVybiAxO1xyXG4gICAgLy8gICAgICAgICAvLyB9IGVsc2UgaWYgKHkzID09PSBpbnRlcnNlY3Rpb25ZKSB7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICByZXR1cm4gMDtcclxuICAgIC8vICAgICAgICAgLy8gfVxyXG4gICAgLy8gICAgICAgICAvLyBpZiAoeDMgPCBpbnRlcnNlY3Rpb25YKSB7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICByZXR1cm4gLSAxXHJcbiAgICAvLyAgICAgICAgIC8vIH0gZWxzZSBpZiAoeDMgPiBpbnRlcnNlY3Rpb25YKSB7XHJcbiAgICAvLyAgICAgICAgIC8vICAgICByZXR1cm4gMTtcclxuICAgIC8vICAgICAgICAgLy8gfSBlbHNlIGlmICh4MyA9PT0gaW50ZXJzZWN0aW9uWCkge1xyXG4gICAgLy8gICAgICAgICAvLyAgICAgcmV0dXJuIDA7XHJcbiAgICAvLyAgICAgICAgIC8vIH1cclxuICAgIC8vICAgICAgICAgaWYgKHkzIDwgeTEpIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiAtMVxyXG4gICAgLy8gICAgICAgICB9IGVsc2UgaWYgKHkzID4geTEpIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgLy8gICAgICAgICB9IGVsc2UgaWYgKHkzID09PSB5MSkge1xyXG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIC8vINC90LDRhdC+0LTQuNC8INCy0LXQutGC0L7RgNC90L7QtSDQv9GA0L7QuNC30LLQtdC00LXQvdC40LUg0LLQtdC60YLQvtGA0L7QsiBiINC4IGJbMF1hWzBdXHJcbiAgICAvLyAgICAgICAgIHZhciBEID0gKHgyIC0geDEpICogKHkzIC0geTEpIC0gKHkyIC0geTEpICogKHgzIC0geDEpO1xyXG4gICAgLy8gICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQstC10LrRgtC+0YDQvdC+0LUg0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LXQutGC0L7RgNC+0LIgYiDQuCBiWzBdYVsxXVxyXG4gICAgLy8gICAgICAgICAvLyB2YXIgRGJhMiA9ICh4MiAtIHgxKSAqICh5NCAtIHkxKSAtICh5MiAtIHkxKSAqICh4NCAtIHgxKTtcclxuICAgIC8vICAgICAgICAgLy8g0L3QsNGF0L7QtNC40Lwg0LfQvdCw0Log0LLQtdC60YLQvtGA0L3Ri9GFINC/0YDQvtC40LfQstC10LTQtdC90LjQuVxyXG4gICAgLy8gICAgICAgICAvLyB2YXIgRCA9IERiYTEgKiBEYmEyO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgaWYgKEQgPCAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAvLyAgICAgICAgIH0gZWxzZSBpZiAoRCA+IDApIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgLy8gICAgICAgICB9IGVsc2UgaWYgKEQgPT09IDApIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vXHJcbiAgICAvLyAgICAgZnVuY3Rpb24gYmV0d2VlbihhLCBiLCBjKSB7XHJcbiAgICAvLyAgICAgICAgIHZhciBlcHMgPSAwLjAwMDAwMDE7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICByZXR1cm4gYS1lcHMgPD0gYiAmJiBiIDw9IGMrZXBzO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgZnVuY3Rpb24gZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uKGEsIGIpIHtcclxuICAgIC8vICAgICAgICAgdmFyIHgxID0gYVswXVswXSxcclxuICAgIC8vICAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgIC8vICAgICAgICAgICAgIHgyID0gYVsxXVswXSxcclxuICAgIC8vICAgICAgICAgICAgIHkyID0gYVsxXVsxXSxcclxuICAgIC8vICAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgIC8vICAgICAgICAgICAgIHkzID0gYlswXVsxXSxcclxuICAgIC8vICAgICAgICAgICAgIHg0ID0gYlsxXVswXSxcclxuICAgIC8vICAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuICAgIC8vICAgICAgICAgdmFyIHggPSAoKHgxICogeTIgLSB5MSAqIHgyKSAqICh4MyAtIHg0KSAtICh4MSAtIHgyKSAqICh4MyAqIHk0IC0geTMgKiB4NCkpIC9cclxuICAgIC8vICAgICAgICAgICAgICgoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCkpO1xyXG4gICAgLy8gICAgICAgICB2YXIgeSA9ICgoeDEgKiB5MiAtIHkxICogeDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzICogeTQgLSB5MyAqIHg0KSkgL1xyXG4gICAgLy8gICAgICAgICAgICAgKCh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KSk7XHJcbiAgICAvLyAgICAgICAgIGlmIChpc05hTih4KXx8aXNOYU4oeSkpIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHgyLCB4LCB4MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4MSwgeCwgeDIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIGlmICh5MSA+PSB5Mikge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHkyLCB5LCB5MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5MSwgeSwgeTIpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIGlmICh4MyA+PSB4NCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHg0LCB4LCB4MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih4MywgeCwgeDQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIGlmICh5MyA+PSB5NCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChiZXR3ZWVuKHk0LCB5LCB5MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoYmV0d2Vlbih5MywgeSwgeTQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICByZXR1cm4gW3gsIHldO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyB9LFxyXG5cclxuICAgIGZpbmRFcXVhdGlvbjogZnVuY3Rpb24gKHNlZ21lbnQpIHtcclxuICAgICAgICB2YXIgeDEgPSBzZWdtZW50WzBdWzBdLFxyXG4gICAgICAgICAgICB5MSA9IHNlZ21lbnRbMF1bMV0sXHJcbiAgICAgICAgICAgIHgyID0gc2VnbWVudFsxXVswXSxcclxuICAgICAgICAgICAgeTIgPSBzZWdtZW50WzFdWzFdLFxyXG4gICAgICAgICAgICBhID0geTEgLSB5MixcclxuICAgICAgICAgICAgYiA9IHgyIC0geDEsXHJcbiAgICAgICAgICAgIGMgPSB4MSAqIHkyIC0geDIgKiB5MTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYSArICd4ICsgJyArIGIgKyAneSArICcgKyBjICsgJyA9IDAnKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gQWRhcHRlZCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYzMTk4L2hvdy1kby15b3UtZGV0ZWN0LXdoZXJlLXR3by1saW5lLXNlZ21lbnRzLWludGVyc2VjdC8xOTY4MzQ1IzE5NjgzNDVcclxuICAgIGJldHdlZW46IGZ1bmN0aW9uIChhLCBiLCBjKSB7XHJcbiAgICAgICAgdmFyIGVwcyA9IDAuMDAwMDAwMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGEtZXBzIDw9IGIgJiYgYiA8PSBjK2VwcztcclxuICAgIH0sXHJcblxyXG4gICAgZmluZFNlZ21lbnRzSW50ZXJzZWN0aW9uOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuICAgICAgICB2YXIgeCA9ICgoeDEgKiB5MiAtIHkxICogeDIpICogKHgzIC0geDQpIC0gKHgxIC0geDIpICogKHgzICogeTQgLSB5MyAqIHg0KSkgL1xyXG4gICAgICAgICAgICAoKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpKTtcclxuICAgICAgICB2YXIgeSA9ICgoeDEgKiB5MiAtIHkxICogeDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzICogeTQgLSB5MyAqIHg0KSkgL1xyXG4gICAgICAgICAgICAoKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpKTtcclxuICAgICAgICBpZiAoaXNOYU4oeCl8fGlzTmFOKHkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoeDEgPj0geDIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHgyLCB4LCB4MSkpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDEsIHgsIHgyKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkxID49IHkyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih5MiwgeSwgeTEpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHkxLCB5LCB5MikpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh4MyA+PSB4NCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeDQsIHgsIHgzKSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmV0d2Vlbih4MywgeCwgeDQpKSB7cmV0dXJuIGZhbHNlO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeTMgPj0geTQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5iZXR3ZWVuKHk0LCB5LCB5MykpIHtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJldHdlZW4oeTMsIHksIHk0KSkge3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcclxuICAgIH0sXHJcblxyXG4gICAgcG9pbnRPbkxpbmU6IGZ1bmN0aW9uIChsaW5lLCBwb2ludCkge1xyXG4gICAgICAgIHZhciBiZWdpbiA9IGxpbmVbMF0sXHJcbiAgICAgICAgICAgIGVuZCA9IGxpbmVbMV0sXHJcbiAgICAgICAgICAgIHgxID0gYmVnaW5bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYmVnaW5bMV0sXHJcbiAgICAgICAgICAgIHgyID0gZW5kWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGVuZFsxXSxcclxuICAgICAgICAgICAgeCA9IHBvaW50WzBdLFxyXG4gICAgICAgICAgICB5ID0gcG9pbnRbMV07XHJcblxyXG4gICAgICAgIHJldHVybiAoKHggLSB4MSkgKiAoeTIgLSB5MSkgLSAoeSAtIHkxKSAqICh4MiAtIHgxKSA9PT0gMCkgJiYgKCh4ID4geDEgJiYgeCA8IHgyKSB8fCAoeCA+IHgyICYmIHggPCB4MSkpO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaW5kWTogZnVuY3Rpb24gKHBvaW50MSwgcG9pbnQyLCB4KSB7XHJcbiAgICAgICAgdmFyIHgxID0gcG9pbnQxWzBdLFxyXG4gICAgICAgICAgICB5MSA9IHBvaW50MVsxXSxcclxuICAgICAgICAgICAgeDIgPSBwb2ludDJbMF0sXHJcbiAgICAgICAgICAgIHkyID0gcG9pbnQyWzFdLFxyXG4gICAgICAgICAgICBhID0geTEgLSB5MixcclxuICAgICAgICAgICAgYiA9IHgyIC0geDEsXHJcbiAgICAgICAgICAgIGMgPSB4MSAqIHkyIC0geDIgKiB5MTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoLWMgLSBhICogeCkgLyBiO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBVdGlscztcclxuIl19
