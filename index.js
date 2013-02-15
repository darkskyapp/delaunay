var Barycentric = require("./lib/barycentric"),
    Delaunay    = require("./lib/delaunay");

exports.triangulate = Delaunay.triangulate;
exports.coordinates = Barycentric.coordinates;
exports.contains    = Barycentric.contains;
