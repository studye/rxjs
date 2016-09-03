/***
 * Excerpted from "Reactive Programming with RxJS",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs for more book information.
***/
var subject = new Rx.Subject();

subject.onNext(1);

subject.subscribe(function(n) {
  console.log('Received value:', n);
});

subject.onNext(2);
subject.onNext(3);
var subject = new Rx.ReplaySubject();

subject.onNext(1);

subject.subscribe(function(n) {
  console.log('Received value:', n);
});

subject.onNext(2);
subject.onNext(3);
var subject = new Rx.ReplaySubject(2); // Buffer size of 2

subject.onNext(1);
subject.onNext(2);
subject.onNext(3);

subject.subscribe(function(n) {
  console.log('Received value:', n);
});
var subject = new Rx.ReplaySubject(null, 200); // Buffer size of 200ms

setTimeout(function() { subject.onNext(1); }, 100);
setTimeout(function() { subject.onNext(2); }, 200);
setTimeout(function() { subject.onNext(3); }, 300);
setTimeout(function() {
  subject.subscribe(function(n) {
    console.log('Received value:', n);
  });

  subject.onNext(4);
}, 350);
