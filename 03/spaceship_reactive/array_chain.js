/***
 * Excerpted from "Reactive Programming with RxJS",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs for more book information.
***/
stringArray // represents an array of 1,000 strings
  .map(function(str) {
    return str.toUpperCase(); //(1)
  })
  .filter(function(str) { //(2)
    return /^[A-Z]+$/.test(str);
  })
  .forEach(function(str) { //(3)
    console.log(str);
  });
stringObservable  // represents an observable emitting 1,000 strings
  .map(function(str) {
    return str.toUpperCase(); //(4)
  })
  .filter(function(str) { //(5)
    return /^[A-Z]+$/.test(str);
  })
  .subscribe(function(str) { //(6)
    console.log(str);
  });
stringObservable
  .map(function(str) {
    return str.toUpperCase();
  })
  .filter(function(str) {
    return /^[A-Z]+$/.test(str);
  })
  .take(5)
  .subscribe(function(str) {
    console.log(str);
  });
