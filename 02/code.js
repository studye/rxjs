var quakes = Rx.Observable.create(function(observer) {
    window.eqfeed_callback = function(response) {
        var quakes = response.features;
        quakes.forEach(function(quake) {
            observer.onNext(quake);
        });
    };

    loadJSONP(QUAKE_URL);
});

quakes.subscribe(function(quake) {
    var coords = quake.geometry.coordinates;
    var size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
});
