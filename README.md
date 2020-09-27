# Bentley-Ottman sweepline

This is a Bentley-Ottman sweepline algorithm implementation, both for Node.js and browser. It finds all intersection in a set of 2D segments, uses balanced avl tree internally.

[Demo](https://ggolikov.github.io/bentley-ottman/)

```javascript
var findIntersections = require('bentley-ottman-sweepline');

var segments = [
    [[0, 1], [3, 1]],
    [[2, 0], [2, 2]]
]

console.log(findIntersections(segments));
```

## Segment traceability

There are several implementations of this algorithm available in JavaScript, see the [NPM repository](https://www.npmjs.com/search?q=keywords%3Aintersect%20keywords%3Asweep).
This is neither the fastest, nor the most reliable (it's known to fail for multiple cartesian intersections; this is obviously fixable with a little TLC).
Having said all that, this particular implementation is the only one which offers segment traceability. That is, you can define your segments as

```javascript
let segments = [
	[[0,0], [1,1]],
	[[1,0], [0,1]]
];

console.log(JSON.stringify(findIntersections(segments)));

// [{"x":0.5,"y":0.5,"segmentID":["0","1"]}]
```

but you can also define your segments as

```javascript
let segments = {
	MySpecialPointA: [[0,0], [1,1]],
	MySpecialPointB: [[1,0], [0,1]],
};

console.log(JSON.stringify(findIntersections(segments)));

// [{"x":0.5,"y":0.5,"segmentID":["MySpecialPointA","MySpecialPointB"]}]
```

This is the only Bentley-Ottman implementation that offers this feature.

## Browser build

In order to use the library in the browser, simply open a console in the root folder and execute

```shell
npx browserify src/findIntersections.js -t babelify -o findIntersectionsBundle.js -s findIntersections
```

You can now use `findIntersectionsBundle.js` in the browser, and you have access to `findIntersections()`. Change `-o findIntersectionsBundle.js` to a different filename if you want to change the name of the output file, and change `-s findIntersections` to some other name if you want to alias function `findIntersections()` for some reason.
