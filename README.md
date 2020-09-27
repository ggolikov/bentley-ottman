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

## Browser build

In order to use the library in the browser, simply open a console in the root folder and execute

```shell
npx browserify src/findIntersections.js -t babelify -o findIntersectionsBundle.js -s findIntersections
```

You can now use `findIntersectionsBundle.js` in the browser, and you have access to `findIntersections()`. Change `-o findIntersectionsBundle.js` to a different filename if you want to change the name of the output file, and change `-s findIntersections` to some other name if you want to alias function `findIntersections()` for some reason.
