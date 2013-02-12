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

  describe("triangulateMatrix", function() {
    /* TODO */
  });

  describe("resolve", function() {
    var a = [1, 2, 3];

    it("should return an object verbatim given no key", function() {
      expect(Delaunay.resolve(a)).toBe(a);
    });

    it("should return an object's property given a string", function() {
      expect(Delaunay.resolve({"foo": a}, "foo")).toBe(a);
    });

    it("should return a nested object's value given an array of strings", function() {
      expect(Delaunay.resolve({"foo": {"bar": a}}, ["foo", "bar"])).toBe(a);
    });
  });

  describe("dimensions", function() {
    it("should return 0 given an empty array", function() {
      expect(Delaunay.dimensions([])).toBe(0);
    });

    it("should return the minimum dimensionality of the given position vectors", function() {
      expect(Delaunay.dimensions([[1, 2, 3], [1, 2], [1, 2, 3, 4]])).toBe(2);
    });

    it("should utilize Delaunay.resolve() on each given object given a property argument", function() {
      expect(Delaunay.dimensions(
        [
          {"foo": [1, 2, 3]},
          {"foo": [4, 5, 6]},
          {"foo": [7, 8, 9]},
          {"foo": [0, 1, 2]},
          {"foo": [3, 4, 5]},
          {"foo": [6, 7, 8]},
          {"foo": [9, 0, 1]}
        ],
        "foo"
      )).toBe(3);
    });
  });

  describe("triangulateObjects", function() {
    /* TODO */
  });
});
