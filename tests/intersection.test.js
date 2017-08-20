require('mocha');
var assert = require('chai').assert,
    Tree = require('avl'),
    data = require('../demo/data'),
    utils = require('../src/utils');

describe('intersection test', function() {

    it('should find predecessor for the node', () => {
        var tree = new Tree(utils.compareSegments);
        // console.log(tree.toString());

        data.forEach(function (l) {
            tree.insert(l);
        })

        var values = tree.values();

        console.log(values.length);

        for ( var i = 0; i < values.length; i++) {
            // console.log(tree.find(data[i]));
            // console.log(tree.find(data[i-1]));
            console.log('prev');
            console.log(tree.prev(tree.find(data[i])));
            // assert.strictEqual(tree.prev(tree.find(data[i])), tree.find(data[i-1]));
        }
    });

    it('should find successor for a node', () => {
        var tree = new Tree(utils.compareSegments);

        data.forEach(function (l) {
            tree.insert(l);
        })

        var values = tree.values();

        for ( var i = 0; i < values.length - 1; i++) {
            // console.log(tree.find(data[i]));
            // console.log(tree.find(data[i-1]));
            // console.log(tree.next(tree.find(data[i])));
            assert.strictEqual(tree.next(tree.find(data[i])), tree.find(data[i+1]));
        }
    });
});
