var Barycentric;

(function() {
  "use strict";

  var M = typeof Matrix !== "undefined" ? Matrix : require("./matrix");

  Barycentric = {
    coordinates: function(vertices, point) {
      var n = point.length,
          vector = new Array(n),
          matrix = new Array(n * n),
          i, j;

      /* Sanity check the given simplex. */
      if(vertices.length !== n + 1)
        throw new Error("Invalid simplex.");

      for(i = n + 1; i--; )
        if(vertices[i].length !== n)
          throw new Error("Invalid simplex.");

      /* Set up our input vector and matrix. */
      for(i = n; i--; ) {
        vector[i] = point[i] - vertices[0][i];

        for(j = n; j--; )
          matrix[i * n + j] = vertices[j + 1][i] - vertices[0][i];
      }

      /* Compute the barycentric coordinates and return them. */
      return M.multiply(M.invert(matrix), vector);
    },
    /* Barycentric.contains() is like coordinates(), above, except that it only
     * returns the coordinates if the point is within the given simplex; if the
     * point is outside, then null is returned. */
    contains: function(vertices, point) {
      var coordinates = Barycentric.coordinates(vertices, point),
          sum = 0,
          i;

      for(i = coordinates.length; i--; ) {
        if(coordinates[i] < 0.0)
          return null;

        sum += coordinates[i];
      }

      return sum <= 1.0 ? coordinates : null;
    }
  };

  if(typeof module !== "undefined")
    module.exports = Barycentric;
}());
