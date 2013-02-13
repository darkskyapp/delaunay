var Delaunay = require("../lib/delaunay");

describe("Delaunay", function() {
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
  });

  describe("boundingBox", function() {
    it("should return two vertices at the origin given no vertices", function() {
      expect(Delaunay.boundingBox(
        [],
        2,
        undefined
      )).toEqual([
        [0, 0],
        [0, 0]
      ]);
    });

    it("should return two vertices at a vertex if given only that vertex", function() {
      expect(Delaunay.boundingBox(
        [
          [1, 2, 3]
        ],
        3
      )).toEqual([
        [1, 2, 3],
        [1, 2, 3]
      ]);
    });

    it("should return two vertices bounding the given vertices", function() {
      expect(Delaunay.boundingBox(
        [
          [-1, -1],
          [ 1, -1],
          [-1,  1],
          [ 1,  1],
          [ 0,  0]
        ],
        2,
        undefined
      )).toEqual([
        [-1, -1],
        [ 1,  1]
      ]);
    });

    it("should apply a margin around the bounding box if requested", function() {
      expect(Delaunay.boundingBox(
        [
          [1, 2, 3],
          [4, 5, 6]
        ],
        3,
        20
      )).toEqual([
        [-19, -18, -17],
        [ 24,  25,  26]
      ]);
    });
  });

  describe("boundingSimplex", function() {
    it("should return a simplex with each vertex at the origin given no vertices", function() {
      expect(Delaunay.boundingSimplex(
        [],
        2
      )).toEqual([
        [0, 0],
        [0, 0],
        [0, 0]
      ]);
    });

    it("should return n+1 vertices at a vertex if given only that vertex", function() {
      expect(Delaunay.boundingSimplex(
        [
          [1, 2, 3]
        ],
        3
      )).toEqual([
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3]
      ]);
    });

    it("should return a right triangle stretching along each axis bounding the box bounding the vertices", function() {
      expect(Delaunay.boundingSimplex(
        [
          [-1, -1],
          [ 1, -1],
          [-1,  1],
          [ 1,  1],
          [ 0,  0]
        ],
        2
      )).toEqual([
        [-1, -1],
        [ 3, -1],
        [-1,  3]
      ]);
    });

    it("should apply a margin around the bounding simplex if requested", function() {
      expect(Delaunay.boundingSimplex(
        [
          [1, 2, 3],
          [4, 5, 6]
        ],
        3,
        20
      )).toEqual([
        [-19, -18, -17],
        [ 67, -18, -17],
        [-19,  68, -17],
        [-19, -18,  69]
      ]);
    });
  });

  describe("bisectors", function() {
    /* TODO */
  });

  describe("cross", function() {
    it("should give the cross product of a 3x2 matrix", function() {
      expect(Delaunay.cross([
        1, 2, 3,
        4, 5, 6
      ], 2)).toEqual([
        -3, 6, -3
      ]);
    });

    it("should give the cross product of a 4x3 matrix", function() {
      expect(Delaunay.cross([
        1,  2,  3,  4,
        5,  6,  7,  8,
        9, 10, 11, 12
      ], 3)).toEqual([
        0, 0, 0, 0
      ]);
    });
  });

  describe("circumcenter", function() {
    it("should correctly compute a 2D circumcenter", function() {
      expect(Delaunay.circumcenter(
        [
          [0, 0],
          [2, 1],
          [0, 3]
        ],
        2
      )).toEqual([
        0.5, 1.5
      ])
    });

    it("should correctly compute a 3D circumcenter", function() {
      expect(Delaunay.circumcenter(
        [
          [0, 0, 0],
          [2, 0, 0],
          [0, 2, 0],
          [0, 0, 2]
        ],
        3
      )).toEqual([
        1, 1, 1
      ]);
    });
  });

  describe("distanceSquared", function() {
    it("should return the square of the distance between two points", function() {
      expect(Delaunay.distanceSquared(
        [1, 2, 3],
        [4, 5, 6],
        3
      )).toEqual(27);
    });
  });

  describe("distance", function() {
    it("should return the distance between two points", function() {
      expect(Delaunay.distance(
        [1, 2, 3],
        [4, 5, 6],
        3
      )).toEqual(Math.sqrt(27));
    });
  });

  describe("isSameEdge", function() {
    it("should return true if two edges are identical", function() {
      expect(Delaunay.isSameEdge([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("should return false if two edges have at least one vertex not in common", function() {
      expect(Delaunay.isSameEdge([1, 2, 3], [1, 2, 4])).toBe(false);
    });
  });

  describe("removeDuplicateEdges", function() {
    it("should remove all but the first occurrance of an edge from an array", function() {
      var edges = [
            [1, 2, 3],
            [1, 2, 4],
            [1, 2, 3],
            [1, 3, 4],
            [2, 3, 4],
            [2, 3, 4],
            [1, 3, 4],
            [2, 3, 4]
          ];

      Delaunay.removeDuplicateEdges(edges);

      expect(edges).toEqual([
        [1, 2, 3],
        [1, 2, 4],
        [1, 3, 4],
        [2, 3, 4]
      ]);
    });
  });

  describe("triangulate", function() {
    /* TODO */
  });
});
