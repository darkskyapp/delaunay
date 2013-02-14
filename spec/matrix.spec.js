var Matrix = require("../lib/matrix");

(function() {
  "use strict";

  describe("Matrix", function() {
    describe("determinant", function() {
      it("should correctly calculate the determinant of a 2x2 matrix", function() {
        expect(Matrix.determinant([1, 2, 3, 4])).toEqual(-2);
      });

      it("should correctly calculate the determinant of a 3x3 matrix", function() {
        expect(Matrix.determinant([1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual(0);
      });
    });

    describe("invert", function() {
      it("should correctly invert a 2x2 matrix", function() {
        expect(Matrix.invert([1, 2, 3, 4])).toEqual([-2, 1, 1.5, -0.5]);
      });

      it("should correctly invert a 3x3 matrix", function() {
        expect(Matrix.invert([
          -1,  3, -3,
           0, -6,  5,
          -5, -3,  1
        ])).toEqual([
            3/2,    1, -1/2,
          -25/6, -8/3,  5/6,
             -5,   -3,    1
        ]);
      });
    });

    describe("multiply", function() {
      it("should correctly multiply a 2x2 matrix by a 2 vector", function() {
        expect(Matrix.multiply(
          [1, 2, 3, 4],
          [5, 6]
        )).toEqual(
          [17, 39]
        );
      });

      it("should correctly multiply a 3x3 matrix by a 3 vector", function() {
        expect(Matrix.multiply(
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          [10, 11, 12]
        )).toEqual(
          [68, 167, 266]
        );
      });
    });
  });
}());
