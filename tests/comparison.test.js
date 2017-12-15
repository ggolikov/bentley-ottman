require('mocha');
var assert = require('chai').assert,
    Tree = require('avl'),
    Sweepline = require('../src/sl'),
    utils = require('../src/geometry/geometry'),
    sl = require('../src/sweepline'),
    segments = [
        [[-1, 1], [1, -1]],
        [[-2, -2], [2, 2]]
    ];

describe('test comparison', function() {
    it('1 above 0', () => {
        var sweepline = new Sweepline('before'),
            compareSegments = utils.compareSegments.bind(sweepline);

        sweepline.setX(-1);

        assert.equal(compareSegments(segments[0], segments[1]), 1, '0 above 1');
    });

    it('0 above 1', () => {
        var sweepline = new Sweepline('before'),
            compareSegments = utils.compareSegments.bind(sweepline);

        sweepline.setX(-1);

        assert.equal(compareSegments(segments[1], segments[0]), -1, '1 above 0');
    });
    it('the same for before at 0: 0 above 1', () => {
        var sweepline = new Sweepline('before'),
            compareSegments = utils.compareSegments.bind(sweepline);

        sweepline.setX(0);
        // sweepline.setPosition('after');

        assert.equal(compareSegments(segments[0], segments[1]), 1, '0 above 1');
    });
    it('the same for before at 0: 1 above 0', () => {
        var sweepline = new Sweepline('before'),
            compareSegments = utils.compareSegments.bind(sweepline);

        sweepline.setX(0);
        // sweepline.setPosition('after');

        assert.equal(compareSegments(segments[1], segments[0]), -1, '1 above 0');
    });
    it('the same for after at 0: 0 above 1', () => {
        var sweepline = new Sweepline('before'),
            compareSegments = utils.compareSegments.bind(sweepline);

        sweepline.setX(0);
        sweepline.setPosition('after');

        assert.equal(compareSegments(segments[0], segments[1]), -1, '0 above 1');
    });
    it('the same for after at 0: 1 above 0', () => {
        var sweepline = new Sweepline('before'),
            compareSegments = utils.compareSegments.bind(sweepline);

        sweepline.setX(0);
        sweepline.setPosition('after');

        assert.equal(compareSegments(segments[1], segments[0]), 1, '1 above 0');
    });
    it('the same for after at 0: 0 above 1', () => {
        var sweepline = new Sweepline('before'),
            compareSegments = utils.compareSegments.bind(sweepline);

        sweepline.setX(1);
        // sweepline.setPosition('after');

        assert.equal(compareSegments(segments[0], segments[1]), -1, '0 above 1');
    });
    it('the same for after at 0: 1 above 0', () => {
        var sweepline = new Sweepline('before'),
            compareSegments = utils.compareSegments.bind(sweepline);

        sweepline.setX(1);
        // sweepline.setPosition('after');

        assert.equal(compareSegments(segments[1], segments[0]), 1, '1 above 0');
    });
});
