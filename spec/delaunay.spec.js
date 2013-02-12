var Delaunay = require("../lib/delaunay");

describe("Delaunay", function() {
  describe("boundingBox", function() {
    it("should return two vertices at the origin given no vertices", function() {
      expect(Delaunay.boundingBox(2, [
      ])).toEqual([
        0, 0,
        0, 0
      ]);
    });

    it("should return two vertices at a vertex if given only that vertex", function() {
      expect(Delaunay.boundingBox(3, [
        1, 2, 3
      ])).toEqual([
        1, 2, 3,
        1, 2, 3
      ]);
    });

    it("should return two vertices bounding the given vertices", function() {
      expect(Delaunay.boundingBox(2, [
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
         0,  0
      ])).toEqual([
        -1, -1,
         1,  1
      ]);
    });

    it("should apply a margin around the bounding box if requested", function() {
      expect(Delaunay.boundingBox(
        3,
        [
          1, 2, 3,
          4, 5, 6
        ],
        20
      )).toEqual([
        -19, -18, -17,
         24,  25,  26
      ]);
    });
  });

  describe("boundingSimplex", function() {
    it("should return a simplex with each vertex at the origin given no vertices", function() {
      expect(Delaunay.boundingSimplex(2, [
      ])).toEqual([
        0, 0,
        0, 0,
        0, 0
      ]);
    });

    it("should return n+1 vertices at a vertex if given only that vertex", function() {
      expect(Delaunay.boundingSimplex(3, [
        1, 2, 3
      ])).toEqual([
        1, 2, 3,
        1, 2, 3,
        1, 2, 3,
        1, 2, 3
      ]);
    });

    it("should return a right triangle stretching along each axis bounding the box bounding the vertices", function() {
      expect(Delaunay.boundingSimplex(2, [
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
         0,  0
      ])).toEqual([
        -1, -1,
         3, -1,
        -1,  3
      ]);
    });

    it("should apply a margin around the bounding simplex if requested", function() {
      expect(Delaunay.boundingSimplex(
        3,
        [
          1, 2, 3,
          4, 5, 6
        ],
        20
      )).toEqual([
        -19, -18, -17,
         67, -18, -17,
        -19,  68, -17,
        -19, -18,  69
      ]);
    });
  });

  describe("triangulate", function() {
    /* TODO */
  });
});
