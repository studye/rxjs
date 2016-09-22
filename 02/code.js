var quakes = Rx.DOM.jsonpRequest ({
    url: QUAKE_URL,
    jsonpCallback: 'eqfeed_callback'
}).flatMap(function transform(result){
    return Rx.Observable.from(result.response.features);
});

quakes.subscribe(function(quake) {
    var coords = quake.geometry.coordinates;
    var size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
});
