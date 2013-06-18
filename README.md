Delaunay
========

This is a little JavaScript library (for both the browser and Node.JS) that
computes Delaunay triangulations in arbitrary dimensions.

Well, actually, that's a lie. It only works in 2 or 3 dimensions. But! The code
is written such that it would be very easy to get it to work in any number of
dimensions! We just havn't had the need. (To do so, just generalize the
algorithms in `lib/matrix.js`.)

For examples on how to use the code, please look in the `examples/` directory.

This code isn't especially efficient; in particular, it runs in quadratic time.
There are very clever divide-and-conquer algorithms for Delaunay triangulation
(even in arbitrary dimensions!) that are O(n log n). That said, it should be
fast enough for most purposes.

This code has been in production use in the [Forecast
API](http://developer.forecast.io/) for some months, and should be stable
enough for general use.
