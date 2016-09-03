/***
 * Excerpted from "Reactive Programming with RxJS",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs for more book information.
***/
var subject = new Rx.BehaviorSubject('Waiting for content');

subject.subscribe(
  function(result) {
    document.body.textContent = result.response || result;
  },
  function(err) {
    document.body.textContent = 'There was an error retrieving content';
  }
);

Rx.DOM.get('/remote/content').subscribe(subject);
