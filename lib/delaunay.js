/* This is a JavaScript implementation of Delaunay triangulation. Ideally, it
 * would function in any number of dimensions; the only restriction is in
 * calculating the circumsphere of a simplex, and I can't seem to find the
 * algorithm to do it. As such, this code currently just works in 2 or 3
 * dimensions.
 * 
 * The theory behind Delaunay triangulation can be found here:
 * 
 * http://paulbourke.net/papers/triangulate/ */

var Delaunay;

(function() {
  "use strict";

  var Simplex = function(indices, vertices, n) {
        var list = new Array(indices.length),
            i;

        for(i = list.length; i--; )
          list[i] = vertices[indices[i]];

        this.vertices = indices;
        this.center   = Delaunay.circumcenter(list, n);
        this.radius   = Delaunay.distanceSquared(this.center, list[0], n);
      };

  Simplex.prototype = {
    contains: function(vertex, n) {
      var r = Delaunay.distanceSquared(this.center, vertex, n);
      return r <= this.radius;
    },
    addEdges: function(n, edges) {
      var edge, i, j;

      for(i = n + 1; i--; ) {
        edge = new Array(n);

        for(j = n; j--; )
          edge[j] = this.vertices[(i + j) % this.vertices.length];

        edge.sort();
        edges.push(edge);
      }
    }
  };

  Delaunay = {
    resolve: function(obj, key) {
      var i;

      if(key !== undefined) {
        if(Array.isArray(key))
          for(i = 0; obj !== undefined && i !== key.length; ++i)
            obj = obj[key[i]];

        else if(obj !== undefined)
          obj = obj[key];
      }

      return obj;
    },
    dimensions: function(vertices) {
      return vertices.length &&
             Math.min.apply(null, vertices.map(function(x) {
               return x.length
             }));
    },
    /* Return the bounding box (two vertices) enclosing each given vertex. */
    boundingBox: function(vertices, n, margin) {
      var min = new Array(n),
          max = new Array(n),
          i, j, pos;

      /* Given some objects, find the bounding box of those objects. */
      if(vertices.length) {
        for(j = n; j--; ) {
          min[j] = Number.POSITIVE_INFINITY;
          max[j] = Number.NEGATIVE_INFINITY;
        }

        for(i = vertices.length; i--; ) {
          pos = vertices[i];

          for(j = n; j--; ) {
            if(pos[j] < min[j])
              min[j] = pos[j];

            if(pos[j] > max[j])
              max[j] = pos[j];
          }
        }

        if(margin !== undefined)
          for(j = n; j--; ) {
            min[j] -= margin;
            max[j] += margin;
          }
      }

      /* No points? Well then, you get a degenerate bounding box. Dumbface. */
      else
        for(j = n; j--; ) {
          min[j] = 0;
          max[j] = 0;
        }

      return [min, max];
    },
    boundingSimplex: function(vertices, n, margin) {
      var box = Delaunay.boundingBox(vertices, n, margin),
          min = box[0],
          max = box[1],
          simplex = new Array(n + 1),
          i, j, w, pos;

      /* Scale up the bounding box. FIXME: This is something of a fudge, in
       * order to make all triangles formed against the super triangle super
       * long and skinny, so that the triangles will be formed against the hull
       * of shapes, instead. That's kludgy. It'd be better to make the
       * algorithm as a whole robust against that kind of silliness. */
      for(j = n; j--; ) {
        w = max[j] - min[j];

        min[j] -= w * 1000;
        max[j] += w * 1002;
      }

      /* The first vertex is just the minimum vertex of the bounding box. */
      simplex[0] = min;

      /* Every subsequent vertex is the max along that axis. */
      for(i = n; i--; ) {
        pos = simplex[1 + i] = new Array(n);

        for(j = n; j--; )
          pos[j] = (i !== j ? min : max)[j];
      }

      /* Return the simplex. */
      return simplex;
    },
    bisectors: function(vertices, n) {
      var m = n + 1,
          matrix = new Array(m * n),
          i, j, a, b, c;

      for(i = n; i--; ) {
        a = vertices[i + 0];
        b = vertices[i + 1];
        c = 0;

        for(j = n; j--; )
          c += (a[j] + b[j]) * (matrix[i * m + j] = a[j] - b[j]);

        matrix[i * m + n] = c * -0.5;
      }

      return matrix;
    },
    cross: function(matrix, n) {
      if(matrix.length !== n * n + n)
        throw new Error("Invalid matrix shape.");

      switch(n) {
        case 2:
          return [
            matrix[1] * matrix[5] - matrix[2] * matrix[4],
            matrix[2] * matrix[3] - matrix[0] * matrix[5],
            matrix[0] * matrix[4] - matrix[1] * matrix[3]
          ];

        case 3:
          return [
            matrix[1] * (matrix[6] * matrix[11] - matrix[7] * matrix[10]) +
            matrix[2] * (matrix[7] * matrix[ 9] - matrix[5] * matrix[11]) +
            matrix[3] * (matrix[5] * matrix[10] - matrix[6] * matrix[ 9]) ,

            matrix[0] * (matrix[7] * matrix[10] - matrix[6] * matrix[11]) +
            matrix[2] * (matrix[4] * matrix[11] - matrix[7] * matrix[ 8]) +
            matrix[3] * (matrix[6] * matrix[ 8] - matrix[4] * matrix[10]) ,

            matrix[0] * (matrix[5] * matrix[11] - matrix[7] * matrix[ 9]) +
            matrix[1] * (matrix[7] * matrix[ 8] - matrix[4] * matrix[11]) +
            matrix[3] * (matrix[4] * matrix[ 9] - matrix[5] * matrix[ 8]) ,

            matrix[0] * (matrix[6] * matrix[ 9] - matrix[5] * matrix[10]) +
            matrix[1] * (matrix[4] * matrix[10] - matrix[6] * matrix[ 8]) +
            matrix[2] * (matrix[5] * matrix[ 8] - matrix[4] * matrix[ 9])
          ];

        default:
          throw new Error("FIXME: Delaunay.cross has not been generalized to 4 or more dimensions!");
      }
    },
    /* FIXME: This should probably test the points for collinearity and use a
     * different algorithm in that case, in order to improve robustness. */
    circumcenter: function(vertices, n) {
      if(vertices.length !== n + 1)
        throw new Error("A " + n + "-simplex requires " + (n + 1) + " vertices.");

      /* Find the position of the circumcenter in homogeneous coordinates. */
      var matrix = Delaunay.bisectors(vertices, n),
          center = Delaunay.cross(matrix, n),
          j;

      /* Convert into Euclidean coordinates. */
      for(j = n; j--; )
        center[j] /= center[n];

      center.length = n;

      /* Return the results. */
      return center;
    },
    distanceSquared: function(a, b, n) {
      var d = 0,
          i, t;

      for(i = n; i--; ) {
        t  = b[i] - a[i];
        d += t * t;
      }

      return d;
    },
    distance: function(a, b, n) {
      return Math.sqrt(Delaunay.distanceSquared(a, b, n));
    },
    isSameEdge: function(a, b) {
      var i;

      if(a.length !== b.length)
        return false;

      for(i = a.length; i--; )
        if(a[i] !== b[i])
          return false;

      return true;
    },
    /* FIXME: By using a set data structure, this can be made O(n log n). */
    removeDuplicateEdges: function(edges) {
      var i, j;

      for(i = edges.length; i--; )
        for(j = i; j--; )
          if(Delaunay.isSameEdge(edges[i], edges[j])) {
            edges.splice(i, 1);
            edges.splice(j, 1);
            --i;
            break;
          }
    },
    /* FIXME: By sorting the objects on an axis (preferably the longest axis),
     * this function can be made O(n log n). */
    triangulate: function(objects, key) {
      var v = objects.length,
          i, j;

      /* Resolve all objects, so we never have to do it again. */
      objects = objects.slice(0);
      for(i = objects.length; i--; )
        objects[i] = Delaunay.resolve(objects[i], key);

      /* Get the dimensionality of the objects. */
      var n = Delaunay.dimensions(objects);

      /* Add the vertices of the bounding simplex to the object list. */
      Array.prototype.push.apply(
        objects,
        Delaunay.boundingSimplex(objects, n)
      );

      /* Initialize the simplex list to the bounding simplex. */
      var list = new Array(n + 1);

      for(i = list.length; i--; )
        list[i] = v + i;

      var simplices = [new Simplex(list, objects, n)],
          edges = [];

      for(i = v; i--; edges.length = 0) {
        for(j = simplices.length; j--; )
          if(simplices[j].contains(objects[i], n)) {
            simplices[j].addEdges(n, edges);
            simplices.splice(j, 1);
          }

        Delaunay.removeDuplicateEdges(edges);

        for(j = edges.length; j--; ) {
          edges[j].unshift(i);
          simplices.push(new Simplex(edges[j], objects, n));
        }
      }

      /* Build and return the final list of simplex vertex indices. */
      list.length = 0;

      simplex: for(i = simplices.length; i--; ) {
        /* If any of the vertices are from the bounding simplex, skip adding
         * this simplex to the output list. */
        for(j = simplices[i].vertices.length; j--; )
          if(simplices[i].vertices[j] >= v)
            continue simplex;

        Array.prototype.push.apply(list, simplices[i].vertices);
      }

      return list;
    }
  };

  /* If we're in Node, export our module as a Node module. */
  if(typeof module !== "undefined")
    module.exports = Delaunay;
}());
