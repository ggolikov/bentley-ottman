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

var points = turf.random('points', 10, {
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

findIntersections(lines, map);
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

function print(root, printNode) {
  if ( printNode === void 0 ) printNode = function (n) { return n.key; };

  var out = [];
  row(root, '', true, function (v) { return out.push(v); }, printNode);
  return out.join('');
}

function row(root, prefix, isTail, out, printNode) {
  if (root) {
    out(("" + prefix + (isTail ? '└── ' : '├── ') + (printNode(root)) + "\n"));
    var indent = prefix + (isTail ? '    ' : '│   ');
    if (root.left)  { row(root.left,  indent, false, out, printNode); }
    if (root.right) { row(root.right, indent, true,  out, printNode); }
  }
}


function isBalanced(root) {
  // If node is empty then return true
  if (root === null) { return true; }

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


function DEFAULT_COMPARE (a, b) { return a > b ? 1 : a < b ? -1 : 0; }


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


Tree.prototype.destroy = function destroy () {
  this._root = null;
};

prototypeAccessors.size.get = function () {
  return this._size;
};


Tree.prototype.contains = function contains (key) {
  if (this._root){
    var node     = this._root;
    var comparator = this._comparator;
    while (node){
      var cmp = comparator(key, node.key);
      if    (cmp === 0)   { return true; }
      else if (cmp === -1) { node = node.left; }
      else                  { node = node.right; }
    }
  }
  return false;
};


/* eslint-disable class-methods-use-this */
Tree.prototype.next = function next (node) {
  var sucessor = node.right;
  while (sucessor && sucessor.left) { sucessor = sucessor.left; }
  return sucessor;
};


Tree.prototype.prev = function prev (node) {
  var predecessor = node.left;
  while (predecessor && predecessor.right) { predecessor = predecessor.right; }
  return predecessor;
};
/* eslint-enable class-methods-use-this */


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


Tree.prototype.minNode = function minNode () {
  var node = this._root;
  while (node && node.left) { node = node.left; }
  return node;
};


Tree.prototype.maxNode = function maxNode () {
  var node = this._root;
  while (node && node.right) { node = node.right; }
  return node;
};


Tree.prototype.min = function min () {
  return this.minNode().key;
};


Tree.prototype.max = function max () {
  return this.maxNode().key;
};


Tree.prototype.isEmpty = function isEmpty () {
  return !this._root;
};


Tree.prototype.pop = function pop () {
  var node = this._root;
  while (node.left) { node = node.left; }
  var returnValue = { key: node.key, data: node.data };
  this.remove(node.key);
  return returnValue;
};


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


Tree.prototype.insert = function insert (key, data) {
    var this$1 = this;

  // if (this.contains(key)) return null;

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


Tree.prototype.remove = function remove (key) {
    var this$1 = this;

  if (!this._root) { return null; }

  // if (!this.contains(key)) return null;

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


Tree.prototype.isBalanced = function isBalanced$1 () {
  return isBalanced(this._root);
};


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
// first we define a sweepline
// sweepline has to update its status

/**
 *  balanced AVL BST for storing an event queue and sweepline status
 */

// (1) Initialize event queue EQ = all segment endpoints;
// (2) Sort EQ by increasing x and y;
// (3) Initialize sweep line SL to be empty;
// (4) Initialize output intersection list IL to be empty;
//
// (5) While (EQ is nonempty) {
//     (6) Let E = the next event from EQ;
//     (7) If (E is a left endpoint) {
//             Let segE = E's segment;
//             Add segE to SL;
//             Let segA = the segment Above segE in SL;
//             Let segB = the segment Below segE in SL;
//             If (I = Intersect( segE with segA) exists)
//                 Insert I into EQ;
//             If (I = Intersect( segE with segB) exists)
//                 Insert I into EQ;
//         }
//         Else If (E is a right endpoint) {
//             Let segE = E's segment;
//             Let segA = the segment Above segE in SL;
//             Let segB = the segment Below segE in SL;
//             Delete segE from SL;
//             If (I = Intersect( segA with segB) exists)
//                 If (I is not in EQ already)
//                     Insert I into EQ;
//         }
//         Else {  // E is an intersection event
//             Add E’s intersect point to the output list IL;
//             Let segE1 above segE2 be E's intersecting segments in SL;
//             Swap their positions so that segE2 is now above segE1;
//             Let segA = the segment above segE2 in SL;
//             Let segB = the segment below segE1 in SL;
//             If (I = Intersect(segE2 with segA) exists)
//                 If (I is not in EQ already)
//                     Insert I into EQ;
//             If (I = Intersect(segE1 with segB) exists)
//                 If (I is not in EQ already)
//                     Insert I into EQ;
//         }
//         remove E from EQ;
//     }
//     return IL;
// }


var Tree = require('avl');
var handleEventPoint = require('./handleeventpoint');
var utils = require('./utils');

/**
 * @param {Array} segments set of segments intersecting sweepline [[[x1, y1], [x2, y2]] ... [[xm, ym], [xn, yn]]]
 */

function findIntersections(segments, map) {

    // (1) Initialize event queue EQ = all segment endpoints;
    // (2) Sort EQ by increasing x and y;
    var queue = new Tree(utils.comparePoints);

    // (3) Initialize sweep line SL to be empty;
    var status = new Tree(utils.comparePoints);

    // (4) Initialize output intersection list IL to be empty;
    var result = [];

    // store event points corresponding to their coordinates
    segments.forEach(function (segment) {
        // 2. Sort EQ by increasing x and y;
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

        // status.insert(segment, segment);
    });

    // console.log(queue.values());
    // console.log(queue);
    var values = queue.values();
    var v = values[0];
    // vv = [v.point[0], v.point[1]];
    // console.log(v.point);
    // // console.log(vv);
    // // console.log(v);
    // console.log(queue.next(v.point));
    // console.log(queue.find(v.point));
    // queue.forEach(function (n) {
    //     console.log(n.left, n.right);
    // });
    // console.log(queue.toString());

    values.forEach(function (value, index, array) {
        var p = value.point;
        var ll = L.latLng([p[1], p[0]]);
        var mrk = L.circleMarker(ll, { radius: 4, color: 'red', fillColor: 'FF00' + 2 ** index }).addTo(map);
        mrk.bindPopup('' + index + '\n' + p[0] + '\n' + p[1]);
    });

    // (5) While (EQ is nonempty) {
    while (!queue.isEmpty()) {
        //     (6) Let E = the next event from EQ;
        var event = queue.pop();

        //     (7) If (E is a left endpoint) {
        if (event.data.type === 'begin') {
            //             Let segE = E's segment;
            var segE = event.data.segment;
            //             Add segE to SL;
            status.insert(segE, segE);
            //             Let segA = the segment Above segE in SL;
            var segA = status.prev(segE);
            //             Let segB = the segment Below segE in SL;
            var segB = status.next(segE);

            // console.log(status.toString());

            // console.log(status.values());
            var ss = status.find(segE);

            // console.log(tree);
            // console.log(ss);
            status.forEach(function (n) {
                console.log(n);
            });

            console.log('----');

            // console.log(segA);
            // console.log(segB);
        }
        //             If (I = Intersect( segE with segA) exists)
        //                 Insert I into EQ;
        //             If (I = Intersect( segE with segB) exists)
        //                 Insert I into EQ;
        //         }
    }

    var sValues = status.values();
    var f = sValues[0];
    // console.log(status.next(f));

    // status.forEach(function (n) {
    // console.log(n);
    // });

    console.log(status);

    console.log(status.toString());

    sValues.forEach(function (value, index, array) {
        lls = value.map(function (p) {
            return L.latLng(p.slice().reverse());
        });

        var line = L.polyline(lls).addTo(map);
        line.bindPopup('' + index);
    });
    // console.log(status.values());

}

module.exports = findIntersections;

},{"./handleeventpoint":4,"./utils":6,"avl":3}],6:[function(require,module,exports){
var utils = {
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
        var x1 = a[0][0],
            y1 = a[0][1],
            x2 = a[1][0],
            y2 = a[1][1],
            x3 = b[0][0],
            y3 = b[0][1],
            x4 = b[1][0],
            y4 = b[1][1];

        var v1 = [x2 - x1, y2 - y1],
            v2 = [x4 - x3, y4 - y3];

        var mult = v1[0] * v2[1] - v1[1] * v2[0];

        if (y1 > y3) {
            return 1;
        } else if (y1 < y3) {
            return -1;
        } else if (y1 === y3) {
            return 0;
        }
        // if (mult > 0) {
        //     return 1;
        // } else if (mult < 0) {
        //     return -1;
        // } else if (mult === 0) {
        //     return 0;
        // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxqc1xcYXBwLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXZsL2Rpc3QvYXZsLmpzIiwic3JjXFxoYW5kbGVldmVudHBvaW50LmpzIiwic3JjXFxzd2VlcGxpbmUuanMiLCJzcmNcXHV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSxvQkFBb0IsUUFBUSxnQkFBUixDQUF4Qjs7QUFFQSxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxNQUFNLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJDLEVBQXlDLFNBQVMsRUFBbEQsRUFBakIsQ0FMVjtBQUFBLElBTUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FOWDs7QUFRQSxJQUFJLFNBQVMsSUFBSSxTQUFKLEVBQWI7QUFBQSxJQUNJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBRDFCO0FBQUEsSUFFSSxJQUFJLE9BQU8sVUFBUCxDQUFrQixHQUYxQjtBQUFBLElBR0ksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FIMUI7QUFBQSxJQUlJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBSjFCO0FBQUEsSUFLSSxTQUFTLElBQUksQ0FMakI7QUFBQSxJQU1JLFFBQVEsSUFBSSxDQU5oQjtBQUFBLElBT0ksVUFBVSxTQUFTLENBUHZCO0FBQUEsSUFRSSxTQUFTLFFBQVEsQ0FSckI7QUFBQSxJQVNJLFFBQVEsRUFUWjs7QUFXQSxJQUFJLFNBQVMsS0FBSyxN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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuZUEsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaOztBQUVBLFNBQVMsZ0JBQVQsQ0FBMEIsS0FBMUIsRUFBaUMsS0FBakMsRUFBd0MsTUFBeEMsRUFBZ0Q7QUFDNUMsUUFBSSxJQUFJLE1BQU0sSUFBTixDQUFXLEtBQW5CO0FBQ0E7QUFDQSxRQUFJLEtBQUss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QUFPLENBQUMsQ0FBUjtBQUNILFNBRk0sTUFFQSxJQUFJLE9BQU8sRUFBWCxFQUFlO0FBQ2xCLG1CQUFPLENBQVA7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsS0FoRE87O0FBa0RSLGlCQUFhLFVBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QjtBQUNoQyxZQUFJLFFBQVEsS0FBSyxDQUFMLENBQVo7QUFBQSxZQUNJLE1BQU0sS0FBSyxDQUFMLENBRFY7QUFBQSxZQUVJLEtBQUssTUFBTSxDQUFOLENBRlQ7QUFBQSxZQUdJLEtBQUssTUFBTSxDQUFOLENBSFQ7QUFBQSxZQUlJLEtBQUssSUFBSSxDQUFKLENBSlQ7QUFBQSxZQUtJLEtBQUssSUFBSSxDQUFKLENBTFQ7QUFBQSxZQU1JLElBQUksTUFBTSxDQUFOLENBTlI7QUFBQSxZQU9JLElBQUksTUFBTSxDQUFOLENBUFI7O0FBU0EsZUFBUSxDQUFDLElBQUksRUFBTCxLQUFZLEtBQUssRUFBakIsSUFBdUIsQ0FBQyxJQUFJLEVBQUwsS0FBWSxLQUFLLEVBQWpCLENBQXZCLEtBQWdELENBQWpELEtBQXlELElBQUksRUFBSixJQUFVLElBQUksRUFBZixJQUF1QixJQUFJLEVBQUosSUFBVSxJQUFJLEVBQTdGLENBQVA7QUFDSDtBQTdETyxDQUFaOztBQWdFQSxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGZpbmRJbnRlcnNlY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vaW5kZXguanMnKTtcblxudmFyIG9zbSA9IEwudGlsZUxheWVyKCdodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9ub2xhYmVscy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgIG1heFpvb206IDIyLFxuICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAub3JnXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPidcbiAgICB9KSxcbiAgICBwb2ludCA9IEwubGF0TG5nKFs1NS43NTMyMTAsIDM3LjYyMTc2Nl0pLFxuICAgIG1hcCA9IG5ldyBMLk1hcCgnbWFwJywge2xheWVyczogW29zbV0sIGNlbnRlcjogcG9pbnQsIHpvb206IDEyLCBtYXhab29tOiAyMn0pLFxuICAgIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xuXG52YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpLFxuICAgIG4gPSBib3VuZHMuX25vcnRoRWFzdC5sYXQsXG4gICAgZSA9IGJvdW5kcy5fbm9ydGhFYXN0LmxuZyxcbiAgICBzID0gYm91bmRzLl9zb3V0aFdlc3QubGF0LFxuICAgIHcgPSBib3VuZHMuX3NvdXRoV2VzdC5sbmcsXG4gICAgaGVpZ2h0ID0gbiAtIHMsXG4gICAgd2lkdGggPSBlIC0gdyxcbiAgICBxSGVpZ2h0ID0gaGVpZ2h0IC8gNCxcbiAgICBxV2lkdGggPSB3aWR0aCAvIDQsXG4gICAgbGluZXMgPSBbXTtcblxudmFyIHBvaW50cyA9IHR1cmYucmFuZG9tKCdwb2ludHMnLCAxMCwge1xuICAgIGJib3g6IFt3ICsgcVdpZHRoLCBzICsgcUhlaWdodCwgZSAtIHFXaWR0aCwgbiAtIHFIZWlnaHRdXG59KTtcblxudmFyIGNvb3JkcyA9IHBvaW50cy5mZWF0dXJlcy5tYXAoZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xufSlcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKz0yKSB7XG4gICAgbGluZXMucHVzaChbY29vcmRzW2ldLCBjb29yZHNbaSsxXV0pO1xuXG4gICAgdmFyIGJlZ2luID0gW2Nvb3Jkc1tpXVsxXSwgY29vcmRzW2ldWzBdXSxcbiAgICAgICAgZW5kID0gW2Nvb3Jkc1tpKzFdWzFdLCBjb29yZHNbaSsxXVswXV07XG5cbiAgICBMLmNpcmNsZU1hcmtlcihMLmxhdExuZyhiZWdpbiksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XG4gICAgTC5jaXJjbGVNYXJrZXIoTC5sYXRMbmcoZW5kKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcbiAgICBMLnBvbHlsaW5lKFtiZWdpbiwgZW5kXSwge3dlaWdodDogMX0pLmFkZFRvKG1hcCk7XG59XG5cbmZpbmRJbnRlcnNlY3Rpb25zKGxpbmVzLCBtYXApO1xud2luZG93Lm1hcCA9IG1hcDtcbiIsInZhciBmaW5kSW50ZXJzZWN0aW9ucyA9IHJlcXVpcmUoJy4vc3JjL3N3ZWVwbGluZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbnRlcnNlY3Rpb25zO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmF2bCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gcHJpbnQocm9vdCwgcHJpbnROb2RlKSB7XG4gIGlmICggcHJpbnROb2RlID09PSB2b2lkIDAgKSBwcmludE5vZGUgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gbi5rZXk7IH07XG5cbiAgdmFyIG91dCA9IFtdO1xuICByb3cocm9vdCwgJycsIHRydWUsIGZ1bmN0aW9uICh2KSB7IHJldHVybiBvdXQucHVzaCh2KTsgfSwgcHJpbnROb2RlKTtcbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gcm93KHJvb3QsIHByZWZpeCwgaXNUYWlsLCBvdXQsIHByaW50Tm9kZSkge1xuICBpZiAocm9vdCkge1xuICAgIG91dCgoXCJcIiArIHByZWZpeCArIChpc1RhaWwgPyAn4pSU4pSA4pSAICcgOiAn4pSc4pSA4pSAICcpICsgKHByaW50Tm9kZShyb290KSkgKyBcIlxcblwiKSk7XG4gICAgdmFyIGluZGVudCA9IHByZWZpeCArIChpc1RhaWwgPyAnICAgICcgOiAn4pSCICAgJyk7XG4gICAgaWYgKHJvb3QubGVmdCkgIHsgcm93KHJvb3QubGVmdCwgIGluZGVudCwgZmFsc2UsIG91dCwgcHJpbnROb2RlKTsgfVxuICAgIGlmIChyb290LnJpZ2h0KSB7IHJvdyhyb290LnJpZ2h0LCBpbmRlbnQsIHRydWUsICBvdXQsIHByaW50Tm9kZSk7IH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGlzQmFsYW5jZWQocm9vdCkge1xuICAvLyBJZiBub2RlIGlzIGVtcHR5IHRoZW4gcmV0dXJuIHRydWVcbiAgaWYgKHJvb3QgPT09IG51bGwpIHsgcmV0dXJuIHRydWU7IH1cblxuICAvLyBHZXQgdGhlIGhlaWdodCBvZiBsZWZ0IGFuZCByaWdodCBzdWIgdHJlZXNcbiAgdmFyIGxoID0gaGVpZ2h0KHJvb3QubGVmdCk7XG4gIHZhciByaCA9IGhlaWdodChyb290LnJpZ2h0KTtcblxuICBpZiAoTWF0aC5hYnMobGggLSByaCkgPD0gMSAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LmxlZnQpICAmJlxuICAgICAgaXNCYWxhbmNlZChyb290LnJpZ2h0KSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIElmIHdlIHJlYWNoIGhlcmUgdGhlbiB0cmVlIGlzIG5vdCBoZWlnaHQtYmFsYW5jZWRcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBDb21wdXRlIHRoZSAnaGVpZ2h0JyBvZiBhIHRyZWUuXG4gKiBIZWlnaHQgaXMgdGhlIG51bWJlciBvZiBub2RlcyBhbG9uZyB0aGUgbG9uZ2VzdCBwYXRoXG4gKiBmcm9tIHRoZSByb290IG5vZGUgZG93biB0byB0aGUgZmFydGhlc3QgbGVhZiBub2RlLlxuICpcbiAqIEBwYXJhbSAge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gaGVpZ2h0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPyAoMSArIE1hdGgubWF4KGhlaWdodChub2RlLmxlZnQpLCBoZWlnaHQobm9kZS5yaWdodCkpKSA6IDA7XG59XG5cbi8vIGZ1bmN0aW9uIGNyZWF0ZU5vZGUgKHBhcmVudCwgbGVmdCwgcmlnaHQsIGhlaWdodCwga2V5LCBkYXRhKSB7XG4vLyAgIHJldHVybiB7IHBhcmVudCwgbGVmdCwgcmlnaHQsIGJhbGFuY2VGYWN0b3I6IGhlaWdodCwga2V5LCBkYXRhIH07XG4vLyB9XG5cblxuZnVuY3Rpb24gREVGQVVMVF9DT01QQVJFIChhLCBiKSB7IHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDsgfVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZUxlZnQgKG5vZGUpIHtcbiAgdmFyIHJpZ2h0Tm9kZSA9IG5vZGUucmlnaHQ7XG4gIG5vZGUucmlnaHQgICAgPSByaWdodE5vZGUubGVmdDtcblxuICBpZiAocmlnaHROb2RlLmxlZnQpIHsgcmlnaHROb2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIHJpZ2h0Tm9kZS5wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgaWYgKHJpZ2h0Tm9kZS5wYXJlbnQpIHtcbiAgICBpZiAocmlnaHROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICByaWdodE5vZGUucGFyZW50LmxlZnQgPSByaWdodE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJpZ2h0Tm9kZS5wYXJlbnQucmlnaHQgPSByaWdodE5vZGU7XG4gICAgfVxuICB9XG5cbiAgbm9kZS5wYXJlbnQgICAgPSByaWdodE5vZGU7XG4gIHJpZ2h0Tm9kZS5sZWZ0ID0gbm9kZTtcblxuICBub2RlLmJhbGFuY2VGYWN0b3IgKz0gMTtcbiAgaWYgKHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSByaWdodE5vZGUuYmFsYW5jZUZhY3RvcjtcbiAgfVxuXG4gIHJpZ2h0Tm9kZS5iYWxhbmNlRmFjdG9yICs9IDE7XG4gIGlmIChub2RlLmJhbGFuY2VGYWN0b3IgPiAwKSB7XG4gICAgcmlnaHROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG4gIHJldHVybiByaWdodE5vZGU7XG59XG5cblxuZnVuY3Rpb24gcm90YXRlUmlnaHQgKG5vZGUpIHtcbiAgdmFyIGxlZnROb2RlID0gbm9kZS5sZWZ0O1xuICBub2RlLmxlZnQgPSBsZWZ0Tm9kZS5yaWdodDtcbiAgaWYgKG5vZGUubGVmdCkgeyBub2RlLmxlZnQucGFyZW50ID0gbm9kZTsgfVxuXG4gIGxlZnROb2RlLnBhcmVudCA9IG5vZGUucGFyZW50O1xuICBpZiAobGVmdE5vZGUucGFyZW50KSB7XG4gICAgaWYgKGxlZnROb2RlLnBhcmVudC5sZWZ0ID09PSBub2RlKSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQubGVmdCA9IGxlZnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0Tm9kZS5wYXJlbnQucmlnaHQgPSBsZWZ0Tm9kZTtcbiAgICB9XG4gIH1cblxuICBub2RlLnBhcmVudCAgICA9IGxlZnROb2RlO1xuICBsZWZ0Tm9kZS5yaWdodCA9IG5vZGU7XG5cbiAgbm9kZS5iYWxhbmNlRmFjdG9yIC09IDE7XG4gIGlmIChsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yID4gMCkge1xuICAgIG5vZGUuYmFsYW5jZUZhY3RvciAtPSBsZWZ0Tm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgbGVmdE5vZGUuYmFsYW5jZUZhY3RvciAtPSAxO1xuICBpZiAobm9kZS5iYWxhbmNlRmFjdG9yIDwgMCkge1xuICAgIGxlZnROb2RlLmJhbGFuY2VGYWN0b3IgKz0gbm9kZS5iYWxhbmNlRmFjdG9yO1xuICB9XG5cbiAgcmV0dXJuIGxlZnROb2RlO1xufVxuXG5cbi8vIGZ1bmN0aW9uIGxlZnRCYWxhbmNlIChub2RlKSB7XG4vLyAgIGlmIChub2RlLmxlZnQuYmFsYW5jZUZhY3RvciA9PT0gLTEpIHJvdGF0ZUxlZnQobm9kZS5sZWZ0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZVJpZ2h0KG5vZGUpO1xuLy8gfVxuXG5cbi8vIGZ1bmN0aW9uIHJpZ2h0QmFsYW5jZSAobm9kZSkge1xuLy8gICBpZiAobm9kZS5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSByb3RhdGVSaWdodChub2RlLnJpZ2h0KTtcbi8vICAgcmV0dXJuIHJvdGF0ZUxlZnQobm9kZSk7XG4vLyB9XG5cblxudmFyIFRyZWUgPSBmdW5jdGlvbiBUcmVlIChjb21wYXJhdG9yKSB7XG4gIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yIHx8IERFRkFVTFRfQ09NUEFSRTtcbiAgdGhpcy5fcm9vdCA9IG51bGw7XG4gIHRoaXMuX3NpemUgPSAwO1xufTtcblxudmFyIHByb3RvdHlwZUFjY2Vzc29ycyA9IHsgc2l6ZToge30gfTtcblxuXG5UcmVlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gIHRoaXMuX3Jvb3QgPSBudWxsO1xufTtcblxucHJvdG90eXBlQWNjZXNzb3JzLnNpemUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fc2l6ZTtcbn07XG5cblxuVHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyAoa2V5KSB7XG4gIGlmICh0aGlzLl9yb290KXtcbiAgICB2YXIgbm9kZSAgICAgPSB0aGlzLl9yb290O1xuICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgICB3aGlsZSAobm9kZSl7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcihrZXksIG5vZGUua2V5KTtcbiAgICAgIGlmICAgIChjbXAgPT09IDApICAgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgZWxzZSBpZiAoY21wID09PSAtMSkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgICBlbHNlICAgICAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbi8qIGVzbGludC1kaXNhYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblRyZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiBuZXh0IChub2RlKSB7XG4gIHZhciBzdWNlc3NvciA9IG5vZGUucmlnaHQ7XG4gIHdoaWxlIChzdWNlc3NvciAmJiBzdWNlc3Nvci5sZWZ0KSB7IHN1Y2Vzc29yID0gc3VjZXNzb3IubGVmdDsgfVxuICByZXR1cm4gc3VjZXNzb3I7XG59O1xuXG5cblRyZWUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiBwcmV2IChub2RlKSB7XG4gIHZhciBwcmVkZWNlc3NvciA9IG5vZGUubGVmdDtcbiAgd2hpbGUgKHByZWRlY2Vzc29yICYmIHByZWRlY2Vzc29yLnJpZ2h0KSB7IHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucmlnaHQ7IH1cbiAgcmV0dXJuIHByZWRlY2Vzc29yO1xufTtcbi8qIGVzbGludC1lbmFibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuXG5cblRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoIChmbikge1xuICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gIHZhciBzID0gW10sIGRvbmUgPSBmYWxzZSwgaSA9IDA7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgLy8gUmVhY2ggdGhlIGxlZnQgbW9zdCBOb2RlIG9mIHRoZSBjdXJyZW50IE5vZGVcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgLy8gUGxhY2UgcG9pbnRlciB0byBhIHRyZWUgbm9kZSBvbiB0aGUgc3RhY2tcbiAgICAgIC8vIGJlZm9yZSB0cmF2ZXJzaW5nIHRoZSBub2RlJ3MgbGVmdCBzdWJ0cmVlXG4gICAgICBzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCYWNrVHJhY2sgZnJvbSB0aGUgZW1wdHkgc3VidHJlZSBhbmQgdmlzaXQgdGhlIE5vZGVcbiAgICAgIC8vIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrOyBob3dldmVyLCBpZiB0aGUgc3RhY2sgaXNcbiAgICAgIC8vIGVtcHR5IHlvdSBhcmUgZG9uZVxuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjdXJyZW50ID0gcy5wb3AoKTtcbiAgICAgICAgZm4oY3VycmVudCwgaSsrKTtcblxuICAgICAgICAvLyBXZSBoYXZlIHZpc2l0ZWQgdGhlIG5vZGUgYW5kIGl0cyBsZWZ0XG4gICAgICAgIC8vIHN1YnRyZWUuIE5vdywgaXQncyByaWdodCBzdWJ0cmVlJ3MgdHVyblxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG5UcmVlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24ga2V5cyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmtleSk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfSBlbHNlIHsgZG9uZSA9IHRydWU7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG5cblRyZWUucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyAoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgdmFyIHMgPSBbXSwgciA9IFtdLCBkb25lID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFkb25lKSB7XG4gICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgIHMucHVzaChjdXJyZW50KTtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3VycmVudCA9IHMucG9wKCk7XG4gICAgICAgIHIucHVzaChjdXJyZW50LmRhdGEpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH0gZWxzZSB7IGRvbmUgPSB0cnVlOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuXG5UcmVlLnByb3RvdHlwZS5taW5Ob2RlID0gZnVuY3Rpb24gbWluTm9kZSAoKSB7XG4gIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgd2hpbGUgKG5vZGUgJiYgbm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG5cblRyZWUucHJvdG90eXBlLm1heE5vZGUgPSBmdW5jdGlvbiBtYXhOb2RlICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICB3aGlsZSAobm9kZSAmJiBub2RlLnJpZ2h0KSB7IG5vZGUgPSBub2RlLnJpZ2h0OyB9XG4gIHJldHVybiBub2RlO1xufTtcblxuXG5UcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiBtaW4gKCkge1xuICByZXR1cm4gdGhpcy5taW5Ob2RlKCkua2V5O1xufTtcblxuXG5UcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiBtYXggKCkge1xuICByZXR1cm4gdGhpcy5tYXhOb2RlKCkua2V5O1xufTtcblxuXG5UcmVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eSAoKSB7XG4gIHJldHVybiAhdGhpcy5fcm9vdDtcbn07XG5cblxuVHJlZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICB3aGlsZSAobm9kZS5sZWZ0KSB7IG5vZGUgPSBub2RlLmxlZnQ7IH1cbiAgdmFyIHJldHVyblZhbHVlID0geyBrZXk6IG5vZGUua2V5LCBkYXRhOiBub2RlLmRhdGEgfTtcbiAgdGhpcy5yZW1vdmUobm9kZS5rZXkpO1xuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5cblRyZWUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiBmaW5kIChrZXkpIHtcbiAgdmFyIHJvb3QgPSB0aGlzLl9yb290O1xuICBpZiAocm9vdCA9PT0gbnVsbCkgIHsgcmV0dXJuIG51bGw7IH1cbiAgaWYgKGtleSA9PT0gcm9vdC5rZXkpIHsgcmV0dXJuIHJvb3Q7IH1cblxuICB2YXIgc3VidHJlZSA9IHJvb3QsIGNtcDtcbiAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICB3aGlsZSAoc3VidHJlZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBzdWJ0cmVlLmtleSk7XG4gICAgaWYgICAgKGNtcCA9PT0gMCkgeyByZXR1cm4gc3VidHJlZTsgfVxuICAgIGVsc2UgaWYgKGNtcCA8IDApIHsgc3VidHJlZSA9IHN1YnRyZWUubGVmdDsgfVxuICAgIGVsc2UgICAgICAgICAgICAgIHsgc3VidHJlZSA9IHN1YnRyZWUucmlnaHQ7IH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuXG5UcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQgKGtleSwgZGF0YSkge1xuICAgIHZhciB0aGlzJDEgPSB0aGlzO1xuXG4gIC8vIGlmICh0aGlzLmNvbnRhaW5zKGtleSkpIHJldHVybiBudWxsO1xuXG4gIGlmICghdGhpcy5fcm9vdCkge1xuICAgIHRoaXMuX3Jvb3QgPSB7XG4gICAgICBwYXJlbnQ6IG51bGwsIGxlZnQ6IG51bGwsIHJpZ2h0OiBudWxsLCBiYWxhbmNlRmFjdG9yOiAwLFxuICAgICAga2V5OiBrZXksIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHRoaXMuX3NpemUrKztcbiAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgfVxuXG4gIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgdmFyIG5vZGUgID0gdGhpcy5fcm9vdDtcbiAgdmFyIHBhcmVudD0gbnVsbDtcbiAgdmFyIGNtcCAgID0gMDtcblxuICB3aGlsZSAobm9kZSkge1xuICAgIGNtcCA9IGNvbXBhcmUoa2V5LCBub2RlLmtleSk7XG4gICAgcGFyZW50ID0gbm9kZTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG5cbiAgdmFyIG5ld05vZGUgPSB7XG4gICAgbGVmdDogbnVsbCwgcmlnaHQ6IG51bGwsIGJhbGFuY2VGYWN0b3I6IDAsXG4gICAgcGFyZW50OiBwYXJlbnQsIGtleToga2V5LCBkYXRhOiBkYXRhLFxuICB9O1xuICBpZiAoY21wIDwgMCkgeyBwYXJlbnQubGVmdD0gbmV3Tm9kZTsgfVxuICBlbHNlICAgICAgIHsgcGFyZW50LnJpZ2h0ID0gbmV3Tm9kZTsgfVxuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAoY29tcGFyZShwYXJlbnQua2V5LCBrZXkpIDwgMCkgeyBwYXJlbnQuYmFsYW5jZUZhY3RvciAtPSAxOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPCAtMSkge1xuICAgICAgLy9sZXQgbmV3Um9vdCA9IHJpZ2h0QmFsYW5jZShwYXJlbnQpO1xuICAgICAgaWYgKHBhcmVudC5yaWdodC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IHJvdGF0ZVJpZ2h0KHBhcmVudC5yaWdodCk7IH1cbiAgICAgIHZhciBuZXdSb290ID0gcm90YXRlTGVmdChwYXJlbnQpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzJDEuX3Jvb3QpIHsgdGhpcyQxLl9yb290ID0gbmV3Um9vdDsgfVxuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGxldCBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QkMSA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290JDE7IH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG5cbiAgdGhpcy5fc2l6ZSsrO1xuICByZXR1cm4gbmV3Tm9kZTtcbn07XG5cblxuVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrZXkpIHtcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcblxuICBpZiAoIXRoaXMuX3Jvb3QpIHsgcmV0dXJuIG51bGw7IH1cblxuICAvLyBpZiAoIXRoaXMuY29udGFpbnMoa2V5KSkgcmV0dXJuIG51bGw7XG5cbiAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICB2YXIgY21wID0gY29tcGFyZShrZXksIG5vZGUua2V5KTtcbiAgICBpZiAgICAoY21wID09PSAwKSB7IGJyZWFrOyB9XG4gICAgZWxzZSBpZiAoY21wIDwgMCkgeyBub2RlID0gbm9kZS5sZWZ0OyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgeyBub2RlID0gbm9kZS5yaWdodDsgfVxuICB9XG4gIGlmICghbm9kZSkgeyByZXR1cm4gbnVsbDsgfVxuICB2YXIgcmV0dXJuVmFsdWUgPSBub2RlLmtleTtcblxuICBpZiAobm9kZS5sZWZ0KSB7XG4gICAgdmFyIG1heCA9IG5vZGUubGVmdDtcblxuICAgIHdoaWxlIChtYXgubGVmdCB8fCBtYXgucmlnaHQpIHtcbiAgICAgIHdoaWxlIChtYXgucmlnaHQpIHsgbWF4ID0gbWF4LnJpZ2h0OyB9XG5cbiAgICAgIG5vZGUua2V5ID0gbWF4LmtleTtcbiAgICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgICAgaWYgKG1heC5sZWZ0KSB7XG4gICAgICAgIG5vZGUgPSBtYXg7XG4gICAgICAgIG1heCA9IG1heC5sZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUua2V5PSBtYXgua2V5O1xuICAgIG5vZGUuZGF0YSA9IG1heC5kYXRhO1xuICAgIG5vZGUgPSBtYXg7XG4gIH1cblxuICBpZiAobm9kZS5yaWdodCkge1xuICAgIHZhciBtaW4gPSBub2RlLnJpZ2h0O1xuXG4gICAgd2hpbGUgKG1pbi5sZWZ0IHx8IG1pbi5yaWdodCkge1xuICAgICAgd2hpbGUgKG1pbi5sZWZ0KSB7IG1pbiA9IG1pbi5sZWZ0OyB9XG5cbiAgICAgIG5vZGUua2V5PSBtaW4ua2V5O1xuICAgICAgbm9kZS5kYXRhID0gbWluLmRhdGE7XG4gICAgICBpZiAobWluLnJpZ2h0KSB7XG4gICAgICAgIG5vZGUgPSBtaW47XG4gICAgICAgIG1pbiA9IG1pbi5yaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmtleT0gbWluLmtleTtcbiAgICBub2RlLmRhdGEgPSBtaW4uZGF0YTtcbiAgICBub2RlID0gbWluO1xuICB9XG5cbiAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50O1xuICB2YXIgcHAgICA9IG5vZGU7XG5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQubGVmdCA9PT0gcHApIHsgcGFyZW50LmJhbGFuY2VGYWN0b3IgLT0gMTsgfVxuICAgIGVsc2UgICAgICAgICAgICAgICAgICB7IHBhcmVudC5iYWxhbmNlRmFjdG9yICs9IDE7IH1cblxuICAgIGlmICAgICAgKHBhcmVudC5iYWxhbmNlRmFjdG9yIDwgLTEpIHtcbiAgICAgIC8vbGV0IG5ld1Jvb3QgPSByaWdodEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQucmlnaHQuYmFsYW5jZUZhY3RvciA9PT0gMSkgeyByb3RhdGVSaWdodChwYXJlbnQucmlnaHQpOyB9XG4gICAgICB2YXIgbmV3Um9vdCA9IHJvdGF0ZUxlZnQocGFyZW50KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gdGhpcyQxLl9yb290KSB7IHRoaXMkMS5fcm9vdCA9IG5ld1Jvb3Q7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3Q7XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuYmFsYW5jZUZhY3RvciA+IDEpIHtcbiAgICAgIC8vIGxldCBuZXdSb290ID0gbGVmdEJhbGFuY2UocGFyZW50KTtcbiAgICAgIGlmIChwYXJlbnQubGVmdC5iYWxhbmNlRmFjdG9yID09PSAtMSkgeyByb3RhdGVMZWZ0KHBhcmVudC5sZWZ0KTsgfVxuICAgICAgdmFyIG5ld1Jvb3QkMSA9IHJvdGF0ZVJpZ2h0KHBhcmVudCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMkMS5fcm9vdCkgeyB0aGlzJDEuX3Jvb3QgPSBuZXdSb290JDE7IH1cbiAgICAgIHBhcmVudCA9IG5ld1Jvb3QkMTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50LmJhbGFuY2VGYWN0b3IgPT09IC0xIHx8IHBhcmVudC5iYWxhbmNlRmFjdG9yID09PSAxKSB7IGJyZWFrOyB9XG5cbiAgICBwcCAgID0gcGFyZW50O1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cblxuICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICBpZiAobm9kZS5wYXJlbnQubGVmdCA9PT0gbm9kZSkgeyBub2RlLnBhcmVudC5sZWZ0PSBudWxsOyB9XG4gICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICB7IG5vZGUucGFyZW50LnJpZ2h0ID0gbnVsbDsgfVxuICB9XG5cbiAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHsgdGhpcy5fcm9vdCA9IG51bGw7IH1cblxuICB0aGlzLl9zaXplLS07XG4gIHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cblxuVHJlZS5wcm90b3R5cGUuaXNCYWxhbmNlZCA9IGZ1bmN0aW9uIGlzQmFsYW5jZWQkMSAoKSB7XG4gIHJldHVybiBpc0JhbGFuY2VkKHRoaXMuX3Jvb3QpO1xufTtcblxuXG5UcmVlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nIChwcmludE5vZGUpIHtcbiAgcmV0dXJuIHByaW50KHRoaXMuX3Jvb3QsIHByaW50Tm9kZSk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyggVHJlZS5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xuXG5yZXR1cm4gVHJlZTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF2bC5qcy5tYXBcbiIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUV2ZW50UG9pbnQocG9pbnQsIHF1ZXVlLCBzdGF0dXMpIHtcclxuICAgIHZhciBwID0gcG9pbnQuZGF0YS5wb2ludDtcclxuICAgIC8vIDFcclxuICAgIHZhciB1cCA9IHBvaW50LmRhdGEuc2VnbWVudDtcclxuICAgIHZhciB1cHMgPSB1cCA/IFt1cF0gOiBbXTtcclxuICAgIHZhciBscHMgPSBbXTtcclxuICAgIHZhciBjcHMgPSBbXTtcclxuXHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gICAgLy8gMS4gSW5pdGlhbGl6ZSBldmVudCBxdWV1ZSBFUSA9IGFsbCBzZWdtZW50IGVuZHBvaW50c1xyXG4gICAgc3RhdHVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICB2YXIgc2VnbWVudCA9IG5vZGUuZGF0YSxcclxuICAgICAgICAgICAgYmVnaW4gPSBzZWdtZW50WzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBzZWdtZW50WzFdO1xyXG5cclxuICAgICAgICAvLyBmaW5kIGxvd2VyIGludGVyc2VjdGlvblxyXG4gICAgICAgIGlmIChwWzBdID09PSBlbmRbMF0gJiYgcFsxXSA9PT0gZW5kWzFdKSB7XHJcbiAgICAgICAgICAgIGxwcy5wdXNoKHNlZ21lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmluZCBpbm5lciBpbnRlcnNlY3Rpb25zXHJcbiAgICAgICAgaWYgKHV0aWxzLnBvaW50T25MaW5lKHNlZ21lbnQsIHApKSB7XHJcbiAgICAgICAgICAgIGNwcy5wdXNoKHNlZ21lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIDNcclxuICAgIGlmICh1cHMuY29uY2F0KGxwcykuY29uY2F0KGNwcykubGVuZ3RoID4gMSkge1xyXG4gICAgLy8gNFxyXG4gICAgICAgIHJlc3VsdC5wdXNoKHApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyA1XHJcbiAgICByZW1vdmVGcm9tVHJlZShscHMsIHN0YXR1cyk7XHJcbiAgICByZW1vdmVGcm9tVHJlZShjcHMsIHN0YXR1cyk7XHJcblxyXG4gICAgLy8gNlxyXG4gICAgaW5zZXJ0SW50b1RyZWUodXBzLCBzdGF0dXMpO1xyXG4gICAgaW5zZXJ0SW50b1RyZWUoY3BzLCBzdGF0dXMpO1xyXG5cclxuXHJcblxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlRnJvbVRyZWUoYXJyLCB0cmVlKSB7XHJcbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHRyZWUucmVtb3ZlKGl0ZW0pO1xyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0SW50b1RyZWUoYXJyLCB0cmVlKSB7XHJcbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHRyZWUuaW5zZXJ0KGl0ZW0pO1xyXG4gICAgfSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBoYW5kbGVFdmVudFBvaW50O1xyXG4iLCIvLyBmaXJzdCB3ZSBkZWZpbmUgYSBzd2VlcGxpbmVcbi8vIHN3ZWVwbGluZSBoYXMgdG8gdXBkYXRlIGl0cyBzdGF0dXNcblxuLyoqXG4gKiAgYmFsYW5jZWQgQVZMIEJTVCBmb3Igc3RvcmluZyBhbiBldmVudCBxdWV1ZSBhbmQgc3dlZXBsaW5lIHN0YXR1c1xuICovXG5cblxuIC8vICgxKSBJbml0aWFsaXplIGV2ZW50IHF1ZXVlIEVRID0gYWxsIHNlZ21lbnQgZW5kcG9pbnRzO1xuIC8vICgyKSBTb3J0IEVRIGJ5IGluY3JlYXNpbmcgeCBhbmQgeTtcbiAvLyAoMykgSW5pdGlhbGl6ZSBzd2VlcCBsaW5lIFNMIHRvIGJlIGVtcHR5O1xuIC8vICg0KSBJbml0aWFsaXplIG91dHB1dCBpbnRlcnNlY3Rpb24gbGlzdCBJTCB0byBiZSBlbXB0eTtcbiAvL1xuIC8vICg1KSBXaGlsZSAoRVEgaXMgbm9uZW1wdHkpIHtcbiAvLyAgICAgKDYpIExldCBFID0gdGhlIG5leHQgZXZlbnQgZnJvbSBFUTtcbiAvLyAgICAgKDcpIElmIChFIGlzIGEgbGVmdCBlbmRwb2ludCkge1xuIC8vICAgICAgICAgICAgIExldCBzZWdFID0gRSdzIHNlZ21lbnQ7XG4gLy8gICAgICAgICAgICAgQWRkIHNlZ0UgdG8gU0w7XG4gLy8gICAgICAgICAgICAgTGV0IHNlZ0EgPSB0aGUgc2VnbWVudCBBYm92ZSBzZWdFIGluIFNMO1xuIC8vICAgICAgICAgICAgIExldCBzZWdCID0gdGhlIHNlZ21lbnQgQmVsb3cgc2VnRSBpbiBTTDtcbiAvLyAgICAgICAgICAgICBJZiAoSSA9IEludGVyc2VjdCggc2VnRSB3aXRoIHNlZ0EpIGV4aXN0cylcbiAvLyAgICAgICAgICAgICAgICAgSW5zZXJ0IEkgaW50byBFUTtcbiAvLyAgICAgICAgICAgICBJZiAoSSA9IEludGVyc2VjdCggc2VnRSB3aXRoIHNlZ0IpIGV4aXN0cylcbiAvLyAgICAgICAgICAgICAgICAgSW5zZXJ0IEkgaW50byBFUTtcbiAvLyAgICAgICAgIH1cbiAvLyAgICAgICAgIEVsc2UgSWYgKEUgaXMgYSByaWdodCBlbmRwb2ludCkge1xuIC8vICAgICAgICAgICAgIExldCBzZWdFID0gRSdzIHNlZ21lbnQ7XG4gLy8gICAgICAgICAgICAgTGV0IHNlZ0EgPSB0aGUgc2VnbWVudCBBYm92ZSBzZWdFIGluIFNMO1xuIC8vICAgICAgICAgICAgIExldCBzZWdCID0gdGhlIHNlZ21lbnQgQmVsb3cgc2VnRSBpbiBTTDtcbiAvLyAgICAgICAgICAgICBEZWxldGUgc2VnRSBmcm9tIFNMO1xuIC8vICAgICAgICAgICAgIElmIChJID0gSW50ZXJzZWN0KCBzZWdBIHdpdGggc2VnQikgZXhpc3RzKVxuIC8vICAgICAgICAgICAgICAgICBJZiAoSSBpcyBub3QgaW4gRVEgYWxyZWFkeSlcbiAvLyAgICAgICAgICAgICAgICAgICAgIEluc2VydCBJIGludG8gRVE7XG4gLy8gICAgICAgICB9XG4gLy8gICAgICAgICBFbHNlIHsgIC8vIEUgaXMgYW4gaW50ZXJzZWN0aW9uIGV2ZW50XG4gLy8gICAgICAgICAgICAgQWRkIEXigJlzIGludGVyc2VjdCBwb2ludCB0byB0aGUgb3V0cHV0IGxpc3QgSUw7XG4gLy8gICAgICAgICAgICAgTGV0IHNlZ0UxIGFib3ZlIHNlZ0UyIGJlIEUncyBpbnRlcnNlY3Rpbmcgc2VnbWVudHMgaW4gU0w7XG4gLy8gICAgICAgICAgICAgU3dhcCB0aGVpciBwb3NpdGlvbnMgc28gdGhhdCBzZWdFMiBpcyBub3cgYWJvdmUgc2VnRTE7XG4gLy8gICAgICAgICAgICAgTGV0IHNlZ0EgPSB0aGUgc2VnbWVudCBhYm92ZSBzZWdFMiBpbiBTTDtcbiAvLyAgICAgICAgICAgICBMZXQgc2VnQiA9IHRoZSBzZWdtZW50IGJlbG93IHNlZ0UxIGluIFNMO1xuIC8vICAgICAgICAgICAgIElmIChJID0gSW50ZXJzZWN0KHNlZ0UyIHdpdGggc2VnQSkgZXhpc3RzKVxuIC8vICAgICAgICAgICAgICAgICBJZiAoSSBpcyBub3QgaW4gRVEgYWxyZWFkeSlcbiAvLyAgICAgICAgICAgICAgICAgICAgIEluc2VydCBJIGludG8gRVE7XG4gLy8gICAgICAgICAgICAgSWYgKEkgPSBJbnRlcnNlY3Qoc2VnRTEgd2l0aCBzZWdCKSBleGlzdHMpXG4gLy8gICAgICAgICAgICAgICAgIElmIChJIGlzIG5vdCBpbiBFUSBhbHJlYWR5KVxuIC8vICAgICAgICAgICAgICAgICAgICAgSW5zZXJ0IEkgaW50byBFUTtcbiAvLyAgICAgICAgIH1cbiAvLyAgICAgICAgIHJlbW92ZSBFIGZyb20gRVE7XG4gLy8gICAgIH1cbiAvLyAgICAgcmV0dXJuIElMO1xuIC8vIH1cblxuXG5cbnZhciBUcmVlID0gcmVxdWlyZSgnYXZsJyk7XG52YXIgaGFuZGxlRXZlbnRQb2ludCA9IHJlcXVpcmUoJy4vaGFuZGxlZXZlbnRwb2ludCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXl9IHNlZ21lbnRzIHNldCBvZiBzZWdtZW50cyBpbnRlcnNlY3Rpbmcgc3dlZXBsaW5lIFtbW3gxLCB5MV0sIFt4MiwgeTJdXSAuLi4gW1t4bSwgeW1dLCBbeG4sIHluXV1dXG4gKi9cblxuZnVuY3Rpb24gZmluZEludGVyc2VjdGlvbnMoc2VnbWVudHMsIG1hcCkge1xuXG4gICAgLy8gKDEpIEluaXRpYWxpemUgZXZlbnQgcXVldWUgRVEgPSBhbGwgc2VnbWVudCBlbmRwb2ludHM7XG4gICAgLy8gKDIpIFNvcnQgRVEgYnkgaW5jcmVhc2luZyB4IGFuZCB5O1xuICAgIHZhciBxdWV1ZSA9IG5ldyBUcmVlKHV0aWxzLmNvbXBhcmVQb2ludHMpO1xuXG4gICAgLy8gKDMpIEluaXRpYWxpemUgc3dlZXAgbGluZSBTTCB0byBiZSBlbXB0eTtcbiAgICB2YXIgc3RhdHVzID0gbmV3IFRyZWUodXRpbHMuY29tcGFyZVBvaW50cyk7XG5cbiAgICAvLyAoNCkgSW5pdGlhbGl6ZSBvdXRwdXQgaW50ZXJzZWN0aW9uIGxpc3QgSUwgdG8gYmUgZW1wdHk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgLy8gc3RvcmUgZXZlbnQgcG9pbnRzIGNvcnJlc3BvbmRpbmcgdG8gdGhlaXIgY29vcmRpbmF0ZXNcbiAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50KSB7XG4gICAgICAgIC8vIDIuIFNvcnQgRVEgYnkgaW5jcmVhc2luZyB4IGFuZCB5O1xuICAgICAgICBzZWdtZW50LnNvcnQodXRpbHMuY29tcGFyZVBvaW50cyk7XG4gICAgICAgIHZhciBiZWdpbiA9IHNlZ21lbnRbMF0sXG4gICAgICAgICAgICBlbmQgPSBzZWdtZW50WzFdLFxuICAgICAgICAgICAgYmVnaW5EYXRhID0ge1xuICAgICAgICAgICAgICAgIHBvaW50OiBiZWdpbixcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmVnaW4nLFxuICAgICAgICAgICAgICAgIHNlZ21lbnQ6IHNlZ21lbnRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmREYXRhID0ge1xuICAgICAgICAgICAgICAgIHBvaW50OiBlbmQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2VuZCcsXG4gICAgICAgICAgICAgICAgc2VnbWVudDogc2VnbWVudFxuICAgICAgICAgICAgfTtcbiAgICAgICAgcXVldWUuaW5zZXJ0KGJlZ2luLCBiZWdpbkRhdGEpO1xuICAgICAgICBxdWV1ZS5pbnNlcnQoZW5kLCBlbmREYXRhKTtcblxuICAgICAgICAvLyBzdGF0dXMuaW5zZXJ0KHNlZ21lbnQsIHNlZ21lbnQpO1xuICAgIH0pO1xuXG4gICAgLy8gY29uc29sZS5sb2cocXVldWUudmFsdWVzKCkpO1xuICAgIC8vIGNvbnNvbGUubG9nKHF1ZXVlKTtcbiAgICB2YXIgdmFsdWVzID0gcXVldWUudmFsdWVzKCk7XG4gICAgdmFyIHYgPSB2YWx1ZXNbMF07XG4gICAgLy8gdnYgPSBbdi5wb2ludFswXSwgdi5wb2ludFsxXV07XG4gICAgLy8gY29uc29sZS5sb2codi5wb2ludCk7XG4gICAgLy8gLy8gY29uc29sZS5sb2codnYpO1xuICAgIC8vIC8vIGNvbnNvbGUubG9nKHYpO1xuICAgIC8vIGNvbnNvbGUubG9nKHF1ZXVlLm5leHQodi5wb2ludCkpO1xuICAgIC8vIGNvbnNvbGUubG9nKHF1ZXVlLmZpbmQodi5wb2ludCkpO1xuICAgIC8vIHF1ZXVlLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2cobi5sZWZ0LCBuLnJpZ2h0KTtcbiAgICAvLyB9KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocXVldWUudG9TdHJpbmcoKSk7XG5cbiAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBhcnJheSkge1xuICAgICAgICB2YXIgcCA9IHZhbHVlLnBvaW50O1xuICAgICAgICB2YXIgbGwgPSBMLmxhdExuZyhbcFsxXSwgcFswXV0pO1xuICAgICAgICB2YXIgbXJrID0gTC5jaXJjbGVNYXJrZXIobGwsIHtyYWRpdXM6IDQsIGNvbG9yOiAncmVkJywgZmlsbENvbG9yOiAnRkYwMCcgKyAyICoqIGluZGV4fSkuYWRkVG8obWFwKTtcbiAgICAgICAgbXJrLmJpbmRQb3B1cCgnJyArIGluZGV4ICsgJ1xcbicgKyBwWzBdICsgJ1xcbicgKyBwWzFdKTtcbiAgICB9KTtcblxuICAgIC8vICg1KSBXaGlsZSAoRVEgaXMgbm9uZW1wdHkpIHtcbiAgICB3aGlsZSAoIXF1ZXVlLmlzRW1wdHkoKSkge1xuICAgICAgICAgLy8gICAgICg2KSBMZXQgRSA9IHRoZSBuZXh0IGV2ZW50IGZyb20gRVE7XG4gICAgICAgIHZhciBldmVudCA9IHF1ZXVlLnBvcCgpO1xuXG4gICAgICAgIC8vICAgICAoNykgSWYgKEUgaXMgYSBsZWZ0IGVuZHBvaW50KSB7XG4gICAgICAgIGlmIChldmVudC5kYXRhLnR5cGUgPT09ICdiZWdpbicpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIExldCBzZWdFID0gRSdzIHNlZ21lbnQ7XG4gICAgICAgICAgICB2YXIgc2VnRSA9IGV2ZW50LmRhdGEuc2VnbWVudDtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIEFkZCBzZWdFIHRvIFNMO1xuICAgICAgICAgICAgc3RhdHVzLmluc2VydChzZWdFLCBzZWdFKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIExldCBzZWdBID0gdGhlIHNlZ21lbnQgQWJvdmUgc2VnRSBpbiBTTDtcbiAgICAgICAgICAgIHZhciBzZWdBID0gc3RhdHVzLnByZXYoc2VnRSk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBMZXQgc2VnQiA9IHRoZSBzZWdtZW50IEJlbG93IHNlZ0UgaW4gU0w7XG4gICAgICAgICAgICB2YXIgc2VnQiA9IHN0YXR1cy5uZXh0KHNlZ0UpO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdGF0dXMudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cy52YWx1ZXMoKSk7XG4gICAgICAgICAgICB2YXIgc3MgPSBzdGF0dXMuZmluZChzZWdFKTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codHJlZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzcyk7XG4gICAgICAgICAgICBzdGF0dXMuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG4pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tJyk7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNlZ0EpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2VnQik7XG5cbiAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICBJZiAoSSA9IEludGVyc2VjdCggc2VnRSB3aXRoIHNlZ0EpIGV4aXN0cylcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIEluc2VydCBJIGludG8gRVE7XG4gICAgICAgIC8vICAgICAgICAgICAgIElmIChJID0gSW50ZXJzZWN0KCBzZWdFIHdpdGggc2VnQikgZXhpc3RzKVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgSW5zZXJ0IEkgaW50byBFUTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNWYWx1ZXMgPSBzdGF0dXMudmFsdWVzKCk7XG4gICAgdmFyIGYgPSBzVmFsdWVzWzBdO1xuICAgIC8vIGNvbnNvbGUubG9nKHN0YXR1cy5uZXh0KGYpKTtcblxuICAgIC8vIHN0YXR1cy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG4pO1xuICAgIC8vIH0pO1xuXG4gICAgY29uc29sZS5sb2coc3RhdHVzKTtcblxuICAgIGNvbnNvbGUubG9nKHN0YXR1cy50b1N0cmluZygpKTtcblxuICAgIHNWYWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBhcnJheSkge1xuICAgICAgICBsbHMgPSB2YWx1ZS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIEwubGF0TG5nKHAuc2xpY2UoKS5yZXZlcnNlKCkpfSk7XG5cbiAgICAgICAgdmFyIGxpbmUgPSBMLnBvbHlsaW5lKGxscykuYWRkVG8obWFwKTtcbiAgICAgICAgbGluZS5iaW5kUG9wdXAoJycgKyBpbmRleCk7XG4gICAgfSk7XG4gICAgLy8gY29uc29sZS5sb2coc3RhdHVzLnZhbHVlcygpKTtcblxuXG5cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZEludGVyc2VjdGlvbnM7XG4iLCJ2YXIgdXRpbHMgPSB7XHJcbiAgICAvLyBwb2ludHMgY29tcGFyYXRvclxyXG4gICAgY29tcGFyZVBvaW50czogZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVsxXSxcclxuICAgICAgICAgICAgeDIgPSBiWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGJbMV07XHJcblxyXG4gICAgICAgIGlmICh4MSA+IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPiB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4MSA8IHgyIHx8ICh4MSA9PT0geDIgJiYgeTEgPCB5MikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoeDEgPT09IHgyICYmIHkxID09PSB5Mikge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgY29tcGFyZVNlZ21lbnRzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciB4MSA9IGFbMF1bMF0sXHJcbiAgICAgICAgICAgIHkxID0gYVswXVsxXSxcclxuICAgICAgICAgICAgeDIgPSBhWzFdWzBdLFxyXG4gICAgICAgICAgICB5MiA9IGFbMV1bMV0sXHJcbiAgICAgICAgICAgIHgzID0gYlswXVswXSxcclxuICAgICAgICAgICAgeTMgPSBiWzBdWzFdLFxyXG4gICAgICAgICAgICB4NCA9IGJbMV1bMF0sXHJcbiAgICAgICAgICAgIHk0ID0gYlsxXVsxXTtcclxuXHJcbiAgICAgICAgdmFyIHYxID0gW3gyIC0geDEsIHkyIC0geTFdLFxyXG4gICAgICAgICAgICB2MiA9IFt4NCAtIHgzLCB5NCAtIHkzXTtcclxuXHJcbiAgICAgICAgdmFyIG11bHQgPSB2MVswXSAqIHYyWzFdIC0gdjFbMV0gKiB2MlswXTtcclxuXHJcbiAgICAgICAgaWYgKHkxID4geTMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh5MSA8IHkzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHkxID09PSB5Mykge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgKG11bHQgPiAwKSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiAxO1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAobXVsdCA8IDApIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAobXVsdCA9PT0gMCkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gMDtcclxuICAgICAgICAvLyB9XHJcbiAgICB9LFxyXG5cclxuICAgIHBvaW50T25MaW5lOiBmdW5jdGlvbiAobGluZSwgcG9pbnQpIHtcclxuICAgICAgICB2YXIgYmVnaW4gPSBsaW5lWzBdLFxyXG4gICAgICAgICAgICBlbmQgPSBsaW5lWzFdLFxyXG4gICAgICAgICAgICB4MSA9IGJlZ2luWzBdLFxyXG4gICAgICAgICAgICB5MSA9IGJlZ2luWzFdLFxyXG4gICAgICAgICAgICB4MiA9IGVuZFswXSxcclxuICAgICAgICAgICAgeTIgPSBlbmRbMV0sXHJcbiAgICAgICAgICAgIHggPSBwb2ludFswXSxcclxuICAgICAgICAgICAgeSA9IHBvaW50WzFdO1xyXG5cclxuICAgICAgICByZXR1cm4gKCh4IC0geDEpICogKHkyIC0geTEpIC0gKHkgLSB5MSkgKiAoeDIgLSB4MSkgPT09IDApICYmICgoeCA+IHgxICYmIHggPCB4MikgfHwgKHggPiB4MiAmJiB4IDwgeDEpKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1dGlscztcclxuIl19
