var quakes = Rx.DOM.jsonRequest({
    url: QUAKE_URL,
    jsonpCallBack: 'eqfeed_callback'
}).flatMap(function transform(response){
    return Rx.Observable.from(response.features);
});

quakes.subscribe(function(quake) {
    var coords = quake.geometry.coordinates;
    var size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
});
