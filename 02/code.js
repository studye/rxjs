var quakes = Rx.Observable.create(function(observer) {
    window.eqfeed_callback = function(response) {
        observer.onNext(response);
        observer.onCompleted();
    };

    loadJSONP(QUAKE_URL);
}).flatMap(function transform(dataset){
    return Rx.Observable.from(dataset.features);
});

quakes.subscribe(function(quake) {
    var coords = quake.geometry.coordinates;
    var size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
});
