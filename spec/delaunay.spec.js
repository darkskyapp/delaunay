var Delaunay = require("../lib/delaunay");

(function() {
  "use strict";

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
    });

    /* FIXME: boundingSimplex adds a positively psychotic amount of padding
     * around the bounding vertices. This is gross! There must be a better
     * way. */
    describe("boundingSimplex", function() {
      it("should return a simplex with each vertex at the origin given no vertices", function() {
        expect(Delaunay.boundingSimplex(
          [],
          2
        )).toEqual([
          [-2048, -2048],
          [ 6144, -2048],
          [-2048,  6144]
        ]);
      });

      it("should return n+1 vertices at a vertex if given only that vertex", function() {
        expect(Delaunay.boundingSimplex(
          [
            [1, 2, 3]
          ],
          3
        )).toEqual([
          [-2047, -2046, -2045],
          [ 6145, -2046, -2045],
          [-2047,  6146, -2045],
          [-2047, -2046,  6147]
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
          [-2051, -2051],
          [ 6151, -2051],
          [-2051,  6151]
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
      it("should remove all edges that appear twice in an array", function() {
        var edges = [
              [1, 2, 3],
              [1, 2, 4],
              [1, 2, 3],
              [1, 3, 4],
              [2, 3, 4],
              [2, 3, 4]
            ];

        Delaunay.removeDuplicateEdges(edges);

        expect(edges).toEqual([
          [1, 2, 4],
          [1, 3, 4]
        ]);
      });
    });

    describe("triangulate", function() {
      it("should correctly triangulate points in 2D", function() {
        expect(Delaunay.triangulate(
          [
            [223,   1],
            [ 92,  46],
            [200,  97],
            [325, 120],
            [  2, 148],
            [126, 177],
            [ 88, 262],
            [206, 255],
            [330, 267]
          ]
        )).toEqual([
          8, 3, 7,
          8, 7, 6,
          3, 0, 2,
          3, 7, 2,
          7, 2, 5,
          0, 2, 1,
          7, 5, 6,
          2, 5, 1,
          5, 6, 4,
          5, 1, 4
        ]);
      });
    });
  });
}());
