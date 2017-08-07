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
    qWidth = width / 4,
    lines = [];

var points = turf.random('points', 36, {
    bbox: [w + qWidth, s + qHeight, e - qWidth, n - qHeight]
});

var coords = points.features.map(function (feature) {
    return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
});

console.log(coords);

for (var i = 0; i < coords.length; i += 2) {
    var begin = L.circleMarker(L.latLng(coords[i]), { radius: 2, fillColor: "#FFFF00", weight: 2 }).addTo(map);
    var end = L.circleMarker(L.latLng(coords[i + 1]), { radius: 2, fillColor: "#FFFF00", weight: 2 }).addTo(map);
    var line = L.polyline([coords[i], coords[i + 1]], { weight: 1 }).addTo(map);
    // lines.push([coords[i], coords[i+1]]);
}

var polylines = L.geoJson(lines).addTo(map);
console.log(lines);
console.log(polylines);

},{"../../index.js":2}],2:[function(require,module,exports){
require('./src/sweepline.js');

// module.exports = geometry;

},{"./src/sweepline.js":3}],3:[function(require,module,exports){

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vXFxqc1xcYXBwLmpzIiwiaW5kZXguanMiLCJzcmMvc3dlZXBsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsUUFBUSxnQkFBUjs7QUFFQSxJQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksaUVBQVosRUFBK0U7QUFDakYsYUFBUyxFQUR3RTtBQUVqRixpQkFBYTtBQUZvRSxDQUEvRSxDQUFWO0FBQUEsSUFJSSxRQUFRLEVBQUUsTUFBRixDQUFTLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBVCxDQUpaO0FBQUEsSUFLSSxNQUFNLElBQUksRUFBRSxHQUFOLENBQVUsS0FBVixFQUFpQixFQUFDLFFBQVEsQ0FBQyxHQUFELENBQVQsRUFBZ0IsUUFBUSxLQUF4QixFQUErQixNQUFNLEVBQXJDLEVBQXlDLFNBQVMsRUFBbEQsRUFBakIsQ0FMVjtBQUFBLElBTUksT0FBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FOWDs7QUFRQSxJQUFJLFNBQVMsSUFBSSxTQUFKLEVBQWI7QUFBQSxJQUNJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBRDFCO0FBQUEsSUFFSSxJQUFJLE9BQU8sVUFBUCxDQUFrQixHQUYxQjtBQUFBLElBR0ksSUFBSSxPQUFPLFVBQVAsQ0FBa0IsR0FIMUI7QUFBQSxJQUlJLElBQUksT0FBTyxVQUFQLENBQWtCLEdBSjFCO0FBQUEsSUFLSSxTQUFTLElBQUksQ0FMakI7QUFBQSxJQU1JLFFBQVEsSUFBSSxDQU5oQjtBQUFBLElBT0ksVUFBVSxTQUFTLENBUHZCO0FBQUEsSUFRSSxTQUFTLFFBQVEsQ0FSckI7QUFBQSxJQVNJLFFBQVEsRUFUWjs7QUFXQSxJQUFJLFNBQVMsS0FBSyxNQUFMLENBQVksUUFBWixFQUFzQixFQUF0QixFQUEwQjtBQUNuQyxVQUFNLENBQUMsSUFBSSxNQUFMLEVBQWEsSUFBSSxPQUFqQixFQUEwQixJQUFJLE1BQTlCLEVBQXNDLElBQUksT0FBMUM7QUFENkIsQ0FBMUIsQ0FBYjs7QUFJQSxJQUFJLFNBQVMsT0FBTyxRQUFQLENBQWdCLEdBQWhCLENBQW9CLFVBQVMsT0FBVCxFQUFrQjtBQUMvQyxXQUFPLENBQUMsUUFBUSxRQUFSLENBQWlCLFdBQWpCLENBQTZCLENBQTdCLENBQUQsRUFBa0MsUUFBUSxRQUFSLENBQWlCLFdBQWpCLENBQTZCLENBQTdCLENBQWxDLENBQVA7QUFDSCxDQUZZLENBQWI7O0FBSUEsUUFBUSxHQUFSLENBQVksTUFBWjs7QUFFQSxLQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxNQUEzQixFQUFtQyxLQUFHLENBQXRDLEVBQXlDO0FBQ3JDLFFBQUksUUFBUSxFQUFFLFlBQUYsQ0FBZSxFQUFFLE1BQUYsQ0FBUyxPQUFPLENBQVAsQ0FBVCxDQUFmLEVBQW9DLEVBQUMsUUFBUSxDQUFULEVBQVksV0FBVyxTQUF2QixFQUFrQyxRQUFRLENBQTFDLEVBQXBDLEVBQWtGLEtBQWxGLENBQXdGLEdBQXhGLENBQVo7QUFDQSxRQUFJLE1BQU0sRUFBRSxZQUFGLENBQWUsRUFBRSxNQUFGLENBQVMsT0FBTyxJQUFFLENBQVQsQ0FBVCxDQUFmLEVBQXNDLEVBQUMsUUFBUSxDQUFULEVBQVksV0FBVyxTQUF2QixFQUFrQyxRQUFRLENBQTFDLEVBQXRDLEVBQW9GLEtBQXBGLENBQTBGLEdBQTFGLENBQVY7QUFDQSxRQUFJLE9BQU8sRUFBRSxRQUFGLENBQVcsQ0FBQyxPQUFPLENBQVAsQ0FBRCxFQUFZLE9BQU8sSUFBRSxDQUFULENBQVosQ0FBWCxFQUFxQyxFQUFDLFFBQVEsQ0FBVCxFQUFyQyxFQUFrRCxLQUFsRCxDQUF3RCxHQUF4RCxDQUFYO0FBQ0E7QUFDSDs7QUFFRCxJQUFJLFlBQVksRUFBRSxPQUFGLENBQVUsS0FBVixFQUFpQixLQUFqQixDQUF1QixHQUF2QixDQUFoQjtBQUNBLFFBQVEsR0FBUixDQUFZLEtBQVo7QUFDQSxRQUFRLEdBQVIsQ0FBWSxTQUFaOzs7QUN4Q0EsUUFBUSxvQkFBUjs7QUFFQTs7O0FDRkE7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuLi8uLi9pbmRleC5qcycpO1xuXG52YXIgb3NtID0gTC50aWxlTGF5ZXIoJ2h0dHA6Ly97c30uYmFzZW1hcHMuY2FydG9jZG4uY29tL2xpZ2h0X25vbGFiZWxzL3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgbWF4Wm9vbTogMjIsXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5vcmdcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+J1xuICAgIH0pLFxuICAgIHBvaW50ID0gTC5sYXRMbmcoWzU1Ljc1MzIxMCwgMzcuNjIxNzY2XSksXG4gICAgbWFwID0gbmV3IEwuTWFwKCdtYXAnLCB7bGF5ZXJzOiBbb3NtXSwgY2VudGVyOiBwb2ludCwgem9vbTogMTIsIG1heFpvb206IDIyfSksXG4gICAgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50Jyk7XG5cbnZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCksXG4gICAgbiA9IGJvdW5kcy5fbm9ydGhFYXN0LmxhdCxcbiAgICBlID0gYm91bmRzLl9ub3J0aEVhc3QubG5nLFxuICAgIHMgPSBib3VuZHMuX3NvdXRoV2VzdC5sYXQsXG4gICAgdyA9IGJvdW5kcy5fc291dGhXZXN0LmxuZyxcbiAgICBoZWlnaHQgPSBuIC0gcyxcbiAgICB3aWR0aCA9IGUgLSB3LFxuICAgIHFIZWlnaHQgPSBoZWlnaHQgLyA0LFxuICAgIHFXaWR0aCA9IHdpZHRoIC8gNCxcbiAgICBsaW5lcyA9IFtdO1xuXG52YXIgcG9pbnRzID0gdHVyZi5yYW5kb20oJ3BvaW50cycsIDM2LCB7XG4gICAgYmJveDogW3cgKyBxV2lkdGgsIHMgKyBxSGVpZ2h0LCBlIC0gcVdpZHRoLCBuIC0gcUhlaWdodF1cbn0pO1xuXG52YXIgY29vcmRzID0gcG9pbnRzLmZlYXR1cmVzLm1hcChmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgcmV0dXJuIFtmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLCBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdXTtcbn0pXG5cbmNvbnNvbGUubG9nKGNvb3Jkcyk7XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzLmxlbmd0aDsgaSs9Mikge1xuICAgIHZhciBiZWdpbiA9IEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGNvb3Jkc1tpXSksIHtyYWRpdXM6IDIsIGZpbGxDb2xvcjogXCIjRkZGRjAwXCIsIHdlaWdodDogMn0pLmFkZFRvKG1hcCk7XG4gICAgdmFyIGVuZCA9IEwuY2lyY2xlTWFya2VyKEwubGF0TG5nKGNvb3Jkc1tpKzFdKSwge3JhZGl1czogMiwgZmlsbENvbG9yOiBcIiNGRkZGMDBcIiwgd2VpZ2h0OiAyfSkuYWRkVG8obWFwKTtcbiAgICB2YXIgbGluZSA9IEwucG9seWxpbmUoW2Nvb3Jkc1tpXSwgY29vcmRzW2krMV1dLCB7d2VpZ2h0OiAxfSkuYWRkVG8obWFwKTtcbiAgICAvLyBsaW5lcy5wdXNoKFtjb29yZHNbaV0sIGNvb3Jkc1tpKzFdXSk7XG59XG5cbnZhciBwb2x5bGluZXMgPSBMLmdlb0pzb24obGluZXMpLmFkZFRvKG1hcCk7XG5jb25zb2xlLmxvZyhsaW5lcyk7XG5jb25zb2xlLmxvZyhwb2x5bGluZXMpO1xuIiwicmVxdWlyZSgnLi9zcmMvc3dlZXBsaW5lLmpzJyk7XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gZ2VvbWV0cnk7XG4iLCJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKemQyVmxjR3hwYm1VdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXMTE5Il19
