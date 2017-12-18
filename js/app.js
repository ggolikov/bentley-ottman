window.findIntersections = require('../../index');
var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    point = L.latLng([55.753210, 37.621766]),
    lmap = new L.Map('map', {layers: [osm], center: point, zoom: 11, maxZoom: 22}),
    root = document.getElementById('content'),
    generateButton = document.getElementsByClassName('generate')[0],
    linesNumberButton = document.getElementsByClassName('segments-number')[0],
    markers, lines;

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

    coords = points.features.map(function(feature) {
        return feature.geometry.coordinates;
    })

    for (var i = 0; i < coords.length; i+=2) {
        data.push([coords[i], coords[i+1]]);
    }

    markers = L.layerGroup().addTo(lmap);

    ps = findIntersections(data);
    ps.forEach(function (p) {
        markers.addLayer(L.circleMarker(L.latLng(p.slice().reverse()), {radius: 5, color: 'blue', fillColor: 'blue'}).bindPopup(p[0] + '\n ' + p[1]));
    })

    lines = L.layerGroup().addTo(lmap);

    data.forEach(function (line) {
        var begin = line[0].slice().reverse(),
        end = line[1].slice().reverse();

        lines.addLayer(L.circleMarker(L.latLng(begin), {radius: 2, fillColor: "#FFFF00", weight: 2}));
        lines.addLayer(L.circleMarker(L.latLng(end), {radius: 2, fillColor: "#FFFF00", weight: 2}));
        lines.addLayer(L.polyline([begin, end], {weight: 1}));
    });
}

generateButton.onclick = drawLines;

drawLines();
