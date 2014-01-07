var mainMap;

var markers = new Array();

//If true, measurements are not loaded with next movement in map
//Used to load PopUps on MapEdge
var doNotLoad = false;

var redDot = L.icon({iconUrl: 'https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png'});

window.onload = function() {
  drawMap();
  drawMeasurements();
}

function drawMap(){
	// create a map in the "map" div, set the view to a given place and zoom
	

    var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
	var google = new L.Google('SATELLITE');
	  
	
	var layer = {
		"OSM": osm,
		"Google": google
	};
	  
	var map = L.map('map', {
		center: new L.LatLng(51.96, 7.62),
		zoom: 18,
		layers: [osm]
	});
	
	L.control.layers(layer).addTo(map);
    
	mainMap = map;
	mainMap.on('moveend', drawMeasurements);
}

function drawMeasurements(){
	if(doNotLoad){doNotLoad = false; return;}

	var bounds = mainMap.getBounds();
	
	var neLat = bounds.getNorthEast().lat;
	var neLng = bounds.getNorthEast().lng;
	var swLat = bounds.getSouthWest().lat;
	var swLng = bounds.getSouthWest().lng;
	
	for(var i=0; i < markers.length; i++){
        mainMap.removeLayer(markers[i]);
    }
	
	$.getJSON("https://envirocar.org/api/stable/rest/measurements?bbox=" + swLng + "," + swLat + "," + neLng + "," + neLat,function(result){
	
		result = result.features;
		
		$.each(result, function(i, measurement){
		
			var geometry = measurement.geometry;
			var properties = measurement.properties;
			var sensor = properties.sensor;
			var phenomenons = properties.phenomenons;
		
			marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {icon: redDot})
				.bindPopup('Latitude ' +  geometry.coordinates[1] + '<br>' + 
					'Longitude: ' + geometry.coordinates[0] + '<br>' + 
					'Zeitstempel: '  + properties.time + '<br>' + 
					'Sensor_ID: ' + sensor.properties.id + '<br>' + 
					'Track_ID: '  + '<br>' + 
					'Fahrzeugtyp: ' + sensor.properties.manufacturer + ' ' + sensor.properties.model + '<br>' + 
					'Spritverbrauch: ' + /*phenomenons.Consumption.value + */'<br>' + 
					'CO2-Ausstoß: ' + /*phenomenons.CO2.value + */'<br>' + 
					'MAF: ' + /*phenomenons.MAF.value + */'<br>' + 
					'Geschwindigkeit: ' + /*phenomenons.Speed.value + */'<br>' + 
					'<a>Zoom to this point</a>');
					
			marker.on('click', function(){doNotLoad=true;});
			markers.push(marker);
		});
		
		for(var i = 0; i < markers.length; i++){
			mainMap.addLayer(markers[i]);
		}
	});
}