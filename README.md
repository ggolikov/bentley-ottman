# Bentley-Ottman sweepline

This is Bentley-Ottman sweepline algorithm implementation, both for Node.js and browser. Finds all intersection in a set of 2D segments, uses balanced avl tree internally.

[Demo](https://ggolikov.github.io/bentley-ottman/)

```javascript
var findIntersections = require('bentley-ottman-sweepline');

var segments = [
    [[0, 1], [3, 1]],
    [[2, 0], [2, 2]]
]

console.log(findIntersections(segments));
// prints [[2, 1]]

```
