/* This is a JavaScript implementation of Delaunay triangulation. Ideally, it
 * would function in any number of dimensions; the only restriction is in
 * calculating the circumsphere of a simplex, and I can't seem to find the
 * algorithm to do it. As such, this code currently just works in 2 or 3
 * dimensions.
 * 
 * The theory behind Delaunay triangulation can be found here:
 * 
 *     http://paulbourke.net/papers/triangulate/
 * 
 * This code has not implemented the relevant optimizations to make it run in
 * subquadratic time; however, such implementations should be straightforward
 * to implement as necessary. */

var Delaunay;

(function() {
  "use strict";

  Delaunay = {
    /* Return the bounding box (two vertices) enclosing each given vertex. */
    boundingBox: function(n, matrix, margin) {
      var box = new Array(n * 2),
          i, j;

      /* If we weren't given at least one vertex, then just return a degenerate
       * boxing box. */
      if(matrix.length < n)
        for(j = 0; j !== n; ++j) {
          box[0 + j] = 0;
          box[n + j] = 0;
        }

      /* Otherwise, find the boxing box of the given vertices and return it. */
      else {
        for(j = 0; j !== n; ++j) {
          box[0 + j] = Number.POSITIVE_INFINITY;
          box[n + j] = Number.NEGATIVE_INFINITY;
        }

        for(i = 0; i < matrix.length; i += n)
          for(j = 0; j !== n; ++j) {
            if(matrix[i + j] < box[0 + j])
              box[0 + j] = matrix[i + j];

            if(matrix[i + j] > box[n + j])
              box[n + j] = matrix[i + j];
          }

        /* Add a margin around the bounding box. */
        if(margin !== undefined)
          for(j = 0; j !== n; ++j) {
            box[0 + j] -= margin;
            box[n + j] += margin;
          }
      }

      return box;
    },
    boundingSimplex: function(n, matrix, margin) {
      var box     = Delaunay.boundingBox(n, matrix, margin),
          simplex = new Array((n + 1) * n),
          i, j;

      /* Double the size of the bounding box. */
      for(j = 0; j !== n; ++j)
        box[n + j] += box[n + j] - box[0 + j];

      /* The first vertex is just the minimum vertex of the bounding box. */
      for(j = 0; j !== n; ++j)
        simplex[j] = box[j];

      /* Every subsequent vertex is the max along that axis. */
      for(i = 0; i !== n; ++i)
        for(j = 0; j !== n; ++j)
          simplex[(i + 1) * n + j] = box[(i === j) * n + j];

      /* Return the simplex. */
      return simplex;
    },
    triangulateMatrix: function(n, matrix) {
      var m = n + 1,
          v = Math.floor(matrix.length / n),
          list, i, j;

      /* If we don't have enough vertices to even make a single simplex, then
       * just bail with an empty triangle list now. */
      if(v < m)
        return [];

      /* Add the bounding simplex's vertices to the end of the vertex array.
       * (Duplicating the vertex array first, because we don't want to ruin
       * any other code's assumptions!) */
      matrix = matrix.slice(0, v * n);
      Array.prototype.push.apply(
        matrix,
        Delaunay.boundingSimplex(n, matrix, 1)
      );

      /* Initialize the triangle list to contain the bounding simplex. */
      list = new Array(m);

      for(j = 0; j !== m; ++j)
        list[j] = v + j;

      /* FIXME */

      /* Remove any simplices that share a vertex with the bounding simplex:
       * they're not part of the Delaunay mesh! */
      for(i = 0; i !== list.length; i += m)
        for(j = 0; j !== m; ++j)
          if(list[i + j] >= v) {
            list.splice(i, m);
            i -= m;
            break;
          }

      return list;
    },
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
    dimensions: function(objects, key) {
      var n = Number.POSITIVE_INFINITY,
          i, t;

      for(i = 0; i !== objects.length; ++i)
        if((t = Delaunay.resolve(objects[i], key).length) < n)
          n = t;

      return isFinite(n) ? n : 0;
    },
    triangulateObjects: function(objects, key) {
      /* FIXME */
    }
  };

  /* If we're in Node, export our module as a Node module. */
  if(typeof module !== "undefined")
    module.exports = Delaunay;
}());
