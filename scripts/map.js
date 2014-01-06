var mainMap;

var markers = new Array();

var redDot = L.icon({iconUrl: 'https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png'});

window.onload = function() {
  drawMap();
  drawMeasurements();
}

function drawMap(){
	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([51.96, 7.62], 18);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
	mainMap = map;
	mainMap.on('moveend', drawMeasurements);
}

function drawMeasurements(){
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
		
		$.each(result, function(i, result){
		
			marker = L.marker([result.geometry.coordinates[1], result.geometry.coordinates[0]], {icon: redDot});
				
			markers.push(marker);
		});
	
		for(var i=0; i < markers.length; i++){
			mainMap.addLayer(markers[i]);
		}
	});
	
	
}