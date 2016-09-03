/***
 * Excerpted from "Reactive Programming with RxJS",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs for more book information.
***/
var subject = new Rx.Subject();
var source = Rx.Observable.interval(300)
  .map(function(v) { return 'Interval message #' + v; })
  .take(5);

source.subscribe(subject);

var subscription = subject.subscribe(
  function onNext(x) { console.log('onNext: ' + x); },
  function onError(e) { console.log('onError: ' + e.message); },
  function onCompleted() { console.log('onCompleted'); }
);

subject.onNext('Our message #1');
subject.onNext('Our message #2');

setTimeout(function() {
  subject.onCompleted();
}, 1000);
var delayedRange = Rx.Observable.range(0, 5).delay(1000);
var subject = new Rx.AsyncSubject();

delayedRange.subscribe(subject);

subject.subscribe(
  function onNext(item) { console.log('Value:', item); },
  function onError(err) { console.log('Error:', err); },
  function onCompleted() { console.log('Completed.'); }
);
function getProducts(url) {
  var subject;

  return Rx.Observable.create(function(observer) { //(1)
    if (!subject) {
      subject = new Rx.AsyncSubject();
      Rx.DOM.get(url).subscribe(subject); //(2)
    }
    return subject.subscribe(observer); //(3)
  });
}

var products = getProducts('/products'); //(4)
// Will trigger request and receive the response when read
products.subscribe( //(5)
  function onNext(result) { console.log('Result 1:', result.response); },
  function onError(error) { console.log('ERROR', error); }
);

// Will receive the result immediately because it's cached
setTimeout(function() { //(6)
  products.subscribe(
    function onNext(result) { console.log('Result 2:', result.response); },
    function onError(error) { console.log('ERROR', error); }
  );
}, 5000);
