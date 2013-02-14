var Barycentric = require("../lib/barycentric");

(function() {
  "use strict";

  describe("Barycentric", function() {
    var a  = Math.sqrt(3) / 6,
        b  = 2 / Math.sqrt(6),
        s2 = [
          [ 0  , a * -2],
          [-0.5, a     ],
          [ 0.5, a     ]
        ],
        s3 = [
          [ b,  b,  b],
          [ b, -b, -b],
          [-b,  b, -b],
          [-b, -b,  b]
        ];

    describe("coordinates", function() {
      it("should return 0,0 for the first coord of the reference triangle", function() {
        expect(Barycentric.coordinates(s2, s2[0])).toEqual([0, 0]);
      });

      it("should return 1,0 for the second coord of the reference triangle", function() {
        expect(Barycentric.coordinates(s2, s2[1])).toEqual([1, 0]);
      });

      it("should return 0,1 for the third coord of the reference triangle", function() {
        expect(Barycentric.coordinates(s2, s2[2])).toEqual([0, 1]);
      });

      it("should return 1/3,1/3 for 0,0 in the reference triangle", function() {
        var bary = Barycentric.coordinates(s2, [0, 0]);
        expect(Array.isArray(bary)).toBeTruthy();
        expect(bary.length).toBe(2);
        expect(bary[0]).toBeCloseTo(1/3, 4);
        expect(bary[1]).toBeCloseTo(1/3, 4);
      });

      it("should return -0.244,-0.244 for 0,-1 in the reference triangle", function() {
        var bary = Barycentric.coordinates(s2, [0, -1]);
        expect(Array.isArray(bary)).toBeTruthy();
        expect(bary.length).toBe(2);
        expect(bary[0]).toBeCloseTo(-0.244, 3);
        expect(bary[1]).toBeCloseTo(-0.244, 3);
      });

      it("should return 1.488,1.488 for 0,2 in the reference triangle", function() {
        var bary = Barycentric.coordinates(s2, [0, 2]);
        expect(Array.isArray(bary)).toBeTruthy();
        expect(bary.length).toBe(2);
        expect(bary[0]).toBeCloseTo(1.488, 3);
        expect(bary[1]).toBeCloseTo(1.488, 3);
      });

      it("should return 0,0,0 for the first coord of the reference tetrahedron", function() {
        expect(Barycentric.coordinates(s3, s3[0])).toEqual([0, 0, 0]);
      });

      it("should return 1,0,0 for the second coord of the reference tetrahedron", function() {
        expect(Barycentric.coordinates(s3, s3[1])).toEqual([1, 0, 0]);
      });

      it("should return 0,1,0 for the third coord of the reference tetrahedron", function() {
        expect(Barycentric.coordinates(s3, s3[2])).toEqual([0, 1, 0]);
      });

      it("should return 0,0,1 for the fourth coord of the reference tetrahedron", function() {
        expect(Barycentric.coordinates(s3, s3[3])).toEqual([0, 0, 1]);
      });

      it("should return 1/4,1/4,1/4 for 0,0,0 in the reference tetrahedron", function() {
        expect(Barycentric.coordinates(s3, [0, 0, 0])).toEqual([1/4, 1/4, 1/4]);
      });

      it("should return 0.556,0.556,-0.056 for 0,0,-1 in the reference tetrahedron", function() {
        var bary = Barycentric.coordinates(s3, [0, 0, -1]);
        expect(Array.isArray(bary)).toBeTruthy();
        expect(bary.length).toBe(3);
        expect(bary[0]).toBeCloseTo( 0.556, 3);
        expect(bary[1]).toBeCloseTo( 0.556, 3);
        expect(bary[2]).toBeCloseTo(-0.056, 3);
      });

      it("should return -0.056,0.556,0.556 for 0,0,1 in the reference tetrahedron", function() {
        var bary = Barycentric.coordinates(s3, [0, 0, 1]);
        expect(Array.isArray(bary)).toBeTruthy();
        expect(bary.length).toBe(3);
        expect(bary[0]).toBeCloseTo(-0.056, 3);
        expect(bary[1]).toBeCloseTo(-0.056, 3);
        expect(bary[2]).toBeCloseTo( 0.556, 3);
      });
    });

    describe("contains", function() {
      it("should return 0,0 for the first coord of the reference triangle", function() {
        expect(Barycentric.contains(s2, s2[0])).toEqual([0, 0]);
      });

      it("should return 1,0 for the second coord of the reference triangle", function() {
        expect(Barycentric.contains(s2, s2[1])).toEqual([1, 0]);
      });

      it("should return 0,1 for the third coord of the reference triangle", function() {
        expect(Barycentric.contains(s2, s2[2])).toEqual([0, 1]);
      });

      it("should return 1/3,1/3 for 0,0 in the reference triangle", function() {
        var bary = Barycentric.contains(s2, [0, 0]);
        expect(Array.isArray(bary)).toBeTruthy();
        expect(bary.length).toBe(2);
        expect(bary[0]).toBeCloseTo(1/3, 4);
        expect(bary[1]).toBeCloseTo(1/3, 4);
      });

      it("should return null for 0,-1 in the reference triangle", function() {
        expect(Barycentric.contains(s2, [0, -1])).toBeNull();
      });

      it("should return null for 0,2 in the reference triangle", function() {
        expect(Barycentric.contains(s2, [0, 2])).toBeNull();
      });

      it("should return 0,0,0 for the first coord of the reference tetrahedron", function() {
        expect(Barycentric.contains(s3, s3[0])).toEqual([0, 0, 0]);
      });

      it("should return 1,0,0 for the second coord of the reference tetrahedron", function() {
        expect(Barycentric.contains(s3, s3[1])).toEqual([1, 0, 0]);
      });

      it("should return 0,1,0 for the third coord of the reference tetrahedron", function() {
        expect(Barycentric.contains(s3, s3[2])).toEqual([0, 1, 0]);
      });

      it("should return 0,0,1 for the fourth coord of the reference tetrahedron", function() {
        expect(Barycentric.contains(s3, s3[3])).toEqual([0, 0, 1]);
      });

      it("should return 1/4,1/4,1/4 for 0,0,0 in the reference tetrahedron", function() {
        expect(Barycentric.contains(s3, [0, 0, 0])).toEqual([1/4, 1/4, 1/4]);
      });

      it("should return null for 0,0,-1 in the reference tetrahedron", function() {
        expect(Barycentric.contains(s3, [0, 0, -1])).toBeNull();
      });

      it("should return null for 0,0,1 in the reference tetrahedron", function() {
        expect(Barycentric.contains(s3, [0, 0, 1])).toBeNull();
      });
    });
  });
}());
