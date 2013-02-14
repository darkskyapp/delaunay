var Barycentric = require("../lib/barycentric");

(function() {
  "use strict";

  describe("Barycentric", function() {
    var s2 = [
          [ 0  , -Math.sqrt(3) / 3],
          [-0.5,  Math.sqrt(3) / 6],
          [ 0.5,  Math.sqrt(3) / 6]
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

      /* TODO: 3D cases */
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

      /* TODO: 3D cases */
      /* TODO: 3D cases */
    });
  });
}());
