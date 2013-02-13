var Barycentric;

(function() {
  "use strict";

  Barycentric = {
    coordinates: function(vertices, point) {
      /* 2D */
      if(point.length === 2) {
        if(vertices.length    !== 3 ||
           vertices[0].length !== 2 ||
           vertices[1].length !== 2 ||
           vertices[2].length !== 2)
          throw new Error("Invalid 2-simplex.");

        var v0_x  = vertices[1][0] - vertices[0][0],
            v0_y  = vertices[1][1] - vertices[0][1],
            v1_x  = vertices[2][0] - vertices[0][0],
            v1_y  = vertices[2][1] - vertices[0][1],
            v2_x  = point[0] - vertices[0][0],
            v2_y  = point[1] - vertices[0][1],
            dot00 = v0_x * v0_x + v0_y * v0_y,
            dot01 = v0_x * v1_x + v0_y * v1_y,
            dot02 = v0_x * v2_x + v0_y * v2_y,
            dot11 = v1_x * v1_x + v1_y * v1_y,
            dot12 = v1_x * v2_x + v1_y * v2_y,
            denom = dot00 * dot11 - dot01 * dot01;

        return [
          (dot11 * dot02 - dot01 * dot12) / denom,
          (dot00 * dot12 - dot01 * dot02) / denom
        ];
      }

      /* 3D */
      else if(point.length === 3) {
        if(vertices.length    !== 4 ||
           vertices[0].length !== 3 ||
           vertices[1].length !== 3 ||
           vertices[2].length !== 3 ||
           vertices[3].length !== 3)
          throw new Error("Invalid 3-simplex.");

        /* FIXME */
      }

      else
        throw new Error("Barycentric coordinates can be defined for " + point.length + "-simplexes, but this library does not yet support them.");
    },
    /* Barycentric.contains() is like coordinates(), above, except that it only
     * returns the coordinates if the point is within the given simplex; if the
     * point is outside, then null is returned. */
    contains: function(vertices, point) {
      var coordinates = Barycentric.coordinates(vertices, point),
          sum = 0,
          i;

      for(i = coordinates.length; i--; ) {
        if(coordinates[i] < 0)
          return null;

        sum += coordinates[i];
      }

      return sum <= 1 ? coordinates : null;
    }
  };

  if(typeof module !== "undefined")
    module.exports = Barycentric;
}());
