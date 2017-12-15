var findIntersections = require('../../index');
var data = require('../data/index.js');

var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    point = L.latLng([55.753210, 37.621766]),
    map = new L.Map('map', {layers: [osm], center: point, zoom: 11, maxZoom: 22}),
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
    random = true,
    pointsCount = 30,
    lines = [];

if (random) {
    data = [];
    var points = turf.randomPoint(pointsCount, {
        bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
    });

    var coords = points.features.map(function(feature) {
        return feature.geometry.coordinates;
    })

    for (var i = 0; i < coords.length; i+=2) {
        data.push([coords[i], coords[i+1]]);
    }
    // console.log(JSON.stringify(data));
}


// drawLines(data);
console.log(pointsCount / 2);
console.time('counting...');
var ps = findIntersections(data, map);
console.timeEnd('counting...');
console.log(ps);
console.log(ps.length);

ps.forEach(function (p) {
    // L.circleMarker(L.latLng(p.slice().reverse()), {radius: 5, color: 'blue', fillColor: 'blue'}).addTo(map);
})

function drawLines(array) {
    array.forEach(function (line) {
        var begin = line[0].slice().reverse(),
            end = line[1].slice().reverse();

        L.circleMarker(L.latLng(begin), {radius: 2, fillColor: "#FFFF00", weight: 2}).addTo(map);
        L.circleMarker(L.latLng(end), {radius: 2, fillColor: "#FFFF00", weight: 2}).addTo(map);
        L.polyline([begin, end], {weight: 1}).addTo(map);
    });
}

// console.log(ps);
