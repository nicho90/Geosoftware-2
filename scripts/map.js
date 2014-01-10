var mainMap;

var markers = new Array();

//If true, measurements are not loaded with next movement in map
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
			
			//Check if phenomenons are not defined -> add default value
			if(phenomenons.Consumption == undefined){
				var Consumption = new Object();
				Consumption.value = "-";
				Consumption.unit = "l/s";
				phenomenons.Consumption = Consumption;
			}
			if(phenomenons.CO2 == undefined){
				var CO2 = new Object();
				CO2.value = "-";
				CO2.unit = "g/s";
				phenomenons.CO2 = CO2;
			}
			if(phenomenons.MAF == undefined){
				var MAF = new Object();
				MAF.value = "-";
				MAF.unit = "l/s";
				phenomenons.MAF = MAF;
			}
			if(phenomenons.Speed == undefined){
				var Speed = new Object();
				Speed.value = "-";
				Speed.unit = "km/s";
				phenomenons.Speed = Speed;
			}
		
			marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {icon: redDot});
					
			var content = $('<p>Latitude ' + geometry.coordinates[1] + '<br>' +
				'Longitude: ' + geometry.coordinates[0] + '<br>' +
				'Zeitstempel: '  + properties.time + '<br>' +
				'Sensor_ID: ' + sensor.properties.id + '<br>' +
				'Track_ID: ' + '<br>' +
				'Fahrzeugtyp: ' + sensor.properties.manufacturer + ' ' + sensor.properties.model + '<br>' +
				'Spritverbrauch: ' + phenomenons.Consumption.value + ' ' + phenomenons.Consumption.unit + '<br>' +
				'CO2-Ausstoß: ' + phenomenons.CO2.value + ' ' + phenomenons.CO2.unit + '<br>' +
				'MAF: ' + phenomenons.MAF.value + ' ' + phenomenons.MAF.unit + '<br>' +
				'Geschwindigkeit: ' + phenomenons.Speed.value + ' ' + phenomenons.Speed.unit + '<br>' +
				'<a href="#" class="speciallink">Center this point</a></p>').click(function() {
				mainMap.setView([geometry.coordinates[1], geometry.coordinates[0]]);
			})[0];
			
			marker.bindPopup(content);
			
			//Do not load measurements if marker is clicked
			marker.on('click', function(){doNotLoad = true;});
			//Load markers if PopUp is closed
			marker.on('popupclose', function(){drawMeasurements();});
			markers.push(marker);
			
		});
		
		for(var i = 0; i < markers.length; i++){
			mainMap.addLayer(markers[i]);
		}
		
	});
}