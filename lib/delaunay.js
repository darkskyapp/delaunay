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

  var M = typeof Matrix !== "undefined" ? Matrix : require("./matrix"),
      Simplex = function(indices, vertices, n) {
        var list = new Array(indices.length),
            i;

        for(i = list.length; i--; )
          list[i] = vertices[indices[i]];

        this.vertices = indices;
        this.center   = Delaunay.circumcenter(list, n);
        this.radius   = Delaunay.distanceSquared(this.center, list[0], n);
      };

  Simplex.prototype = {
    passed: function(vertex, n) {
      var d = vertex[0] - this.center[0];
      return d > 0.0 && d * d > this.radius;
    },
    contains: function(vertex, n) {
      return Delaunay.distanceSquared(this.center, vertex, n) <= this.radius;
    },
    /* FIXME: This can be done more efficiently, since the vertices are already
     * in sorted order, there's no need to do another sort. Just iterate every
     * array formed by removing one vertex. */
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
      var d = 0,
          i = vertices.length;

      if(i) {
        d = vertices[--i].length;

        while(i--)
          if(vertices[i].length < d)
            d = vertices[i].length;
      }

      return d;
    },
    /* Return the bounding box (two vertices) enclosing each given vertex. */
    boundingBox: function(vertices, n) {
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
      }

      /* No points? Well then, you get a degenerate bounding box. Dumbface. */
      else
        for(j = n; j--; ) {
          min[j] = 0;
          max[j] = 0;
        }

      return [min, max];
    },
    boundingSimplex: function(vertices, n) {
      var box = Delaunay.boundingBox(vertices, n),
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
        w = 2048 + max[j] - min[j];
        min[j] -= w * 1;
        max[j] += w * 3;
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

      var m = n + 1,
          sgn = 1,
          vec = new Array(m),
          sq  = new Array(n * n),
          i, j, k;

      for(i = 0; i !== m; ++i) {
        /* If it's the first time through the loop, initialize the square
         * matrix to hold every column but the first. */
        if(i === 0)
          for(j = n; j--; )
            for(k = n; k--; )
              sq[j * n + k] = matrix[j * m + k + 1];

        /* Every other time, just replace the one column that's no longer
         * relevant. */
        else {
          k = i - 1;
          for(j = n; j--; )
            sq[j * n + k] = matrix[j * m + k];
        }

        vec[i] = sgn * M.determinant(sq);
        sgn    = -sgn;
      }

      return vec;
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
    triangulate: function(objects, key) {
      var v = objects.length,
          i, j;

      /* Resolve all objects, so we never have to do it again. */
      objects = objects.slice(0);
      for(i = objects.length; i--; )
        objects[i] = Delaunay.resolve(objects[i], key);

      /* Get the dimensionality of the objects. */
      var n = Delaunay.dimensions(objects);

      if(n < 2 || n > 3)
        throw new Error("The Delaunay module currently only supports 2D or 3D data.");

      /* Sort the objects on an axis so we can get O(n log n) behavior. Sadly,
       * we also need to keep track of their original position in the array, so
       * we wrap the objects to track that and then unwrap them again. */
      for(i = objects.length; i--; )
        objects[i] = {index: i, position: objects[i]};

      /* FIXME: It'd be better to sort on the longest axis, rather than on an
       * arbitrary axis, since it'll lower the constant factor. */
      objects.sort(function(a, b) { return b.position[0] - a.position[0]; });

      var indices = new Array(objects.length);

      for(i = objects.length; i--; ) {
        indices[i] = objects[i].index;
        objects[i] = objects[i].position;
      }

      /* Add the vertices of the bounding simplex to the object list. It's okay
       * that these vertices aren't sorted like the others, since they're never
       * going to be iterated over. */
      Array.prototype.push.apply(
        objects,
        Delaunay.boundingSimplex(objects, n)
      );

      /* Initialize the simplex list to the bounding simplex. */
      var list = new Array(n + 1);

      for(i = list.length; i--; )
        list[i] = v + i;

      var open   = [new Simplex(list, objects, n)],
          closed = [],
          edges  = [];

      for(i = v; i--; edges.length = 0) {
        for(j = open.length; j--; ) {
          /* If this vertex is past the simplex, then we're never going to
           * intersect it again, so remove it from the open list and move it to
           * the closed list. */
          if(open[j].passed(objects[i], n)) {
            closed.push(open[j]);
            open.splice(j, 1);
          }

          /* Otherwise, if the simplex contains the vertex, it needs to get
           * split apart. */
          else if(open[j].contains(objects[i], n)) {
            open[j].addEdges(n, edges);
            open.splice(j, 1);
          }
        }

        Delaunay.removeDuplicateEdges(edges);

        for(j = edges.length; j--; ) {
          edges[j].unshift(i);
          open.push(new Simplex(edges[j], objects, n));
        }
      }

      /* Move all open simplices into the closed list. */
      Array.prototype.push.apply(closed, open);
      open.length = 0;

      /* Build and return the final list of simplex vertex indices. */
      list.length = 0;

      simplex: for(i = closed.length; i--; ) {
        /* If any of the vertices are from the bounding simplex, skip adding
         * this simplex to the output list. */
        for(j = closed[i].vertices.length; j--; )
          if(closed[i].vertices[j] >= v)
            continue simplex;

        for(j = 0; j < closed[i].vertices.length; j++)
          list.push(indices[closed[i].vertices[j]]);
      }

      return list;
    }
  };

  /* If we're in Node, export our module as a Node module. */
  if(typeof module !== "undefined")
    module.exports = Delaunay;
}());
