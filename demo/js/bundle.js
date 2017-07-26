(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('../../index.js');

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
    qWidth = width / 4;

var points = turf.random('points', 100, {
    bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
});

var markers = L.geoJson(points, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, { radius: 5, fillColor: "#FFFF00" });
    }
}).addTo(map);

},{"../../index.js":2}],2:[function(require,module,exports){
require('./src/geometry.js');

// module.exports = geometry;

},{"./src/geometry.js":3}],3:[function(require,module,exports){

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxqc1xcYXBwLmpzIiwiaW5kZXguanMiLCJzcmMvZ2VvbWV0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxRQUFRLGdCQUFSOztBQUVBLElBQUksTUFBTSxFQUFFLFNBQUYsQ0FBWSxpRUFBWixFQUErRTtBQUNqRixhQUFTLEVBRHdFO0FBRWpGLGlCQUFhO0FBRm9FLENBQS9FLENBQVY7QUFBQSxJQUlJLFFBQVEsRUFBRSxNQUFGLENBQVMsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFULENBSlo7QUFBQSxJQUtJLE1BQU0sSUFBSSxFQUFFLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEVBQUMsUUFBUSxDQUFDLEdBQUQsQ0FBVCxFQUFnQixRQUFRLEtBQXhCLEVBQStCLE1BQU0sRUFBckMsRUFBeUMsU0FBUyxFQUFsRCxFQUFqQixDQUxWO0FBQUEsSUFNSSxPQUFPLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQU5YOztBQVFBLElBQUksU0FBUyxJQUFJLFNBQUosRUFBYjtBQUFBLElBQ0ksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FEMUI7QUFBQSxJQUVJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBRjFCO0FBQUEsSUFHSSxJQUFJLE9BQU8sVUFBUCxDQUFrQixHQUgxQjtBQUFBLElBSUksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FKMUI7QUFBQSxJQUtJLFNBQVMsSUFBSSxDQUxqQjtBQUFBLElBTUksUUFBUSxJQUFJLENBTmhCO0FBQUEsSUFPSSxVQUFVLFNBQVMsQ0FQdkI7QUFBQSxJQVFJLFNBQVMsUUFBUSxDQVJyQjs7QUFVQSxJQUFJLFNBQVMsS0FBSyxNQUFMLENBQVksUUFBWixFQUFzQixHQUF0QixFQUEyQjtBQUNwQyxVQUFNLENBQUMsSUFBSSxNQUFMLEVBQWEsSUFBSSxPQUFqQixFQUEwQixJQUFJLE1BQTlCLEVBQXNDLElBQUksT0FBMUM7QUFEOEIsQ0FBM0IsQ0FBYjs7QUFJQSxJQUFJLFVBQVUsRUFBRSxPQUFGLENBQVUsTUFBVixFQUFrQjtBQUM1QixrQkFBYyxVQUFVLE9BQVYsRUFBbUIsTUFBbkIsRUFBMkI7QUFDckMsZUFBTyxFQUFFLFlBQUYsQ0FBZSxNQUFmLEVBQXVCLEVBQUMsUUFBUSxDQUFULEVBQVksV0FBVyxTQUF2QixFQUF2QixDQUFQO0FBQ0g7QUFIMkIsQ0FBbEIsRUFJWCxLQUpXLENBSUwsR0FKSyxDQUFkOzs7QUN4QkEsUUFBUSxtQkFBUjs7QUFFQTs7O0FDRkE7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuLi8uLi9pbmRleC5qcycpO1xyXG5cclxudmFyIG9zbSA9IEwudGlsZUxheWVyKCdodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9ub2xhYmVscy97en0ve3h9L3t5fS5wbmcnLCB7XHJcbiAgICAgICAgbWF4Wm9vbTogMjIsXHJcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4nXHJcbiAgICB9KSxcclxuICAgIHBvaW50ID0gTC5sYXRMbmcoWzU1Ljc1MzIxMCwgMzcuNjIxNzY2XSksXHJcbiAgICBtYXAgPSBuZXcgTC5NYXAoJ21hcCcsIHtsYXllcnM6IFtvc21dLCBjZW50ZXI6IHBvaW50LCB6b29tOiAxMiwgbWF4Wm9vbTogMjJ9KSxcclxuICAgIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xyXG5cclxudmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKSxcclxuICAgIG4gPSBib3VuZHMuX25vcnRoRWFzdC5sYXQsXHJcbiAgICBlID0gYm91bmRzLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgcyA9IGJvdW5kcy5fc291dGhXZXN0LmxhdCxcclxuICAgIHcgPSBib3VuZHMuX3NvdXRoV2VzdC5sbmcsXHJcbiAgICBoZWlnaHQgPSBuIC0gcyxcclxuICAgIHdpZHRoID0gZSAtIHcsXHJcbiAgICBxSGVpZ2h0ID0gaGVpZ2h0IC8gNCxcclxuICAgIHFXaWR0aCA9IHdpZHRoIC8gNDtcclxuXHJcbnZhciBwb2ludHMgPSB0dXJmLnJhbmRvbSgncG9pbnRzJywgMTAwLCB7XHJcbiAgICBiYm94OiBbdyArIHFXaWR0aCwgcyArIHFIZWlnaHQsIGUgLSBxV2lkdGgsIG4gLSBxSGVpZ2h0XVxyXG59KTtcclxuXHJcbnZhciBtYXJrZXJzID0gTC5nZW9Kc29uKHBvaW50cywge1xyXG4gICAgcG9pbnRUb0xheWVyOiBmdW5jdGlvbiAoZmVhdHVyZSwgbGF0bG5nKSB7XHJcbiAgICAgICAgcmV0dXJuIEwuY2lyY2xlTWFya2VyKGxhdGxuZywge3JhZGl1czogNSwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIn0pO1xyXG4gICAgfVxyXG59KS5hZGRUbyhtYXApO1xyXG4iLCJyZXF1aXJlKCcuL3NyYy9nZW9tZXRyeS5qcycpO1xyXG5cclxuLy8gbW9kdWxlLmV4cG9ydHMgPSBnZW9tZXRyeTtcclxuIiwiXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUpuWlc5dFpYUnllUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iXX0=
