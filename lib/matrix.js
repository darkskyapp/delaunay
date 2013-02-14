/* This is a crappy, half-formed matrix library that only works in 2 or 3
 * dimensions. It should be replaced with a real, grown-up matrix library. */

var Matrix;

(function() {
  "use strict";

  Matrix = {
    determinant: function(matrix) {
      switch(matrix.length) {
        case 4:
          return matrix[0] * matrix[3] - matrix[1] * matrix[2];

        case 9:
          return matrix[0] * (matrix[4] * matrix[8] - matrix[5] * matrix[7]) +
                 matrix[1] * (matrix[5] * matrix[6] - matrix[3] * matrix[8]) +
                 matrix[2] * (matrix[3] * matrix[7] - matrix[4] * matrix[6]) ;

        default:
          throw new Error("FIXME");
      }
    },
    invert: function(matrix) {
      var det = Matrix.determinant(matrix);

      if(det === 0)
        throw new Error("Cannot invert a matrix with a determinant of zero.");

      switch(matrix.length) {
        case 4:
          return [
             matrix[3] / det,
            -matrix[1] / det,
            -matrix[2] / det,
             matrix[0] / det
          ];

        case 9:
          return [
            (matrix[4] * matrix[8] - matrix[5] * matrix[7]) / det,
            (matrix[2] * matrix[7] - matrix[1] * matrix[8]) / det,
            (matrix[1] * matrix[5] - matrix[2] * matrix[4]) / det,

            (matrix[5] * matrix[6] - matrix[3] * matrix[8]) / det,
            (matrix[0] * matrix[8] - matrix[2] * matrix[6]) / det,
            (matrix[2] * matrix[3] - matrix[0] * matrix[5]) / det,

            (matrix[3] * matrix[7] - matrix[4] * matrix[6]) / det,
            (matrix[6] * matrix[1] - matrix[0] * matrix[7]) / det,
            (matrix[0] * matrix[4] - matrix[1] * matrix[3]) / det
          ];

        default:
          throw new Error("FIXME");
      }
    },
    multiply: function(a, b) {
      var n, c, i, j;

      /* Matrix times matrix. */
      if(a.length === b.length)
        throw new Error("FIXME");

      /* Matrix times column vector. */
      else if(a.length === b.length * b.length) {
        n = b.length;
        c = new Array(n);

        for(i = n; i--; ) {
          c[i] = 0;

          for(j = n; j--; )
            c[i] += a[i * n + j] * b[j];
        }

        return c;
      }

      else
        throw new Error("Matrix mismatch.");
    }
  };

  if(typeof module !== "undefined")
    module.exports = Matrix;
}());
