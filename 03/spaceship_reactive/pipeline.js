/***
 * Excerpted from "Reactive Programming with RxJS",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs for more book information.
***/
Rx.Observable
  .from([1, 2, 3, 4, 5, 6, 7, 8])
  .filter(function(val) { return val % 2;  })
  .map(function(val) { return val * 10; });


