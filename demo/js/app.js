require('../../index.js');

var osm = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    point = L.latLng([55.753210, 37.621766]),
    map = new L.Map('map', {layers: [osm], center: point, zoom: 12, maxZoom: 22}),
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

var points = turf.random('points', 36, {
    bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
});

var coords = points.features.map(function(feature) {
    return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
})

console.log(coords);

for (var i = 0; i < coords.length; i+=2) {
    var begin = L.circleMarker(L.latLng(coords[i]), {radius: 2, fillColor: "#FFFF00", weight: 2}).addTo(map);
    var end = L.circleMarker(L.latLng(coords[i+1]), {radius: 2, fillColor: "#FFFF00", weight: 2}).addTo(map);
    var line = L.polyline([coords[i], coords[i+1]], {weight: 1}).addTo(map);
    // lines.push([coords[i], coords[i+1]]);
}

var polylines = L.geoJson(lines).addTo(map);
console.log(lines);
console.log(polylines);
