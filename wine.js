
/////////////////////////////////////// BASEMAP LAYERS //////////////////////////////////////

// link to maps with api in config.js
const mapboxLink = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';

// create satellite map layer
const satmap = L.tileLayer(mapboxLink,{
    attribution: attribution,
    maxZoom: 18,
    id: 'mapbox.satellite',
    accessToken: API_KEY
    });

// create light map layer
const lightmap = L.tileLayer(mapboxLink,{
    attribution: attribution,
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: API_KEY
});

// create dark map layer
const darkmap = L.tileLayer(mapboxLink,{
    attribution: attribution,
    maxZoom: 18,
    id: 'mapbox.dark',
    accessToken: API_KEY
});

// create basemap layer with the other maps
const baseMaps = {
    'Satellite Map': satmap,
    'Light Map': lightmap,
    'Dark Map': darkmap
};

/////////////////////////////////////// WINE CONSUMPTION LAYER //////////////////////////////////////

// make variable for wineLayer to adjust later
var wineLayer;
// set countryColor based on consumption of wine
// color choices from http://colorbrewer2.org/?type=sequential&scheme=Purples&n=5
function countryColor(d) {
    return d > 1000000 ? '#54278f' :
        d > 100000 ? '#756bb1' :
        d > 10000 ? '#9e9ac8' :
        d > 1000 ? '#cbc9e2' :
        d > 100 ? '#f2f0f7' :
        'white';
}

// fxn for filling in the countries
function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: countryColor(feature.properties.wineConsumption)
    };
}

// fxn for highlighting outline of country on hover
function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

// fxn to reset the outline of countries when not hovering anymore
function resetHighlight(e) {
    wineLayer.resetStyle(e.target);
    info.update();
}

// fxn to zoom in to each country once clicked
function zoomToFeature(e) {
    myMap.fitBounds(e.target.getBounds());
}

// fxn to bring all previous feature fxns together
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// create wine layer that includes outlines, highlight, resethighlight, and click to zoom
wineLayer = L.geoJson(wineData, {
    style: style,
    onEachFeature: onEachFeature
});

// create overlays
const mapOverlay = {
    'Wine': wineLayer
};

// load satmap and outline as default
const myMap = L.map('map', {
    center: [0,0],
    zoom: 3,
    layers: [lightmap, wineLayer]
});

// add all map layers
L.control.layers(baseMaps, mapOverlay, {
    collapsed: false
}).addTo(myMap);

// control that shows country info on hover
let info = L.control({ position: 'bottomright' });

// add info div to wine layer
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

// update info div whenever hovering over a country
info.update = function (props) {
    this._div.innerHTML = '<h4>World Wine Consumption</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.wineConsumption + ' L'
        : 'Hover over a country<br><br>');
};

// add info div to myMap for wine layer
info.addTo(myMap);

// whenever wine layer is checked, show info div
myMap.on('overlayadd', function(eventLayer){
    if (eventLayer.name === 'Wine'){
        myMap.addControl(info);
    } 
});

// whenever wine layer is unchecked, remove info div
myMap.on('overlayremove', function(eventLayer){
    if (eventLayer.name === 'Wine'){
         myMap.removeControl(info);
    } 
});
