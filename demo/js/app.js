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
    qWidth = width / 4;

var points = turf.random('points', 100, {
    bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
});

var markers = L.geoJson(points, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {radius: 5, fillColor: "#FFFF00"});
    }
}).addTo(map);
