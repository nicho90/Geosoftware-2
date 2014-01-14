/***********************
	Global variables
***********************/
var mainMap;

var markers = new Array();

var selection = new Array();

//If true measurements are not loaded with next movement in map
var doNotLoad = false;

//If true user adds points to selection by clicking on them
var singlePointSelection = false;

var redDot = L.icon({iconUrl: 'https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png'});


/***********************
	Event register
***********************/
window.onload = function() {
  drawMap();
  drawMeasurements();
}


/***********************
	Functions
***********************/

// Draw MainMap
// Description: Initializes main map and navigation-elements
// Author: René Unrau
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
	
	// navigation elements
	// allows the user to pan with the give navigation elements
	//Author: Johanna Möllmann
	document.getElementById('left').onclick = function() {
    		map.panBy([-300, 0]);;
	};

	document.getElementById('right').onclick = function() {
    	map.panBy([300, 0]);
	};

	document.getElementById('down').onclick = function() {
    	map.panBy([0, 300]);
	};

	document.getElementById('up').onclick = function() {
    	map.panBy([0, -300]);
	};
	
	L.control.layers(layer).addTo(map);
    
	mainMap = map;
	mainMap.on('moveend', drawMeasurements);
}

// Draw Measurements
// Description: Adds dots to the map and controls click events
// Author: René Unrau
function drawMeasurements(){
	if(doNotLoad){doNotLoad = false; return;}
    
    var filtStart = document.filterFormular.Start.value;
    var filtEnde = document.filterFormular.Ende.value;
    var filtTyp = document.filterFormular.Typ.value;
    var filtTrack = document.filterFormular.Track_ID.value;
    var filtSensor = document.filterFormular.Sensor_ID.value;

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
			
			var container = $('<div/>');

			container.on('click', '.centerPoint', function() {
				doNotLoad = true;
				mainMap.setView([geometry.coordinates[1], geometry.coordinates[0]],18);
			});
			container.on('click', '.showTrack', function() {
				showTrack(properties.id);
			});

			container.html('<html><table><tr><td><b>Latitude</b></td><td>' + geometry.coordinates[1] + '</td></tr>' +
				'<tr><td><b>Longitude</b></td><td>' + geometry.coordinates[0] + '</td></tr>' +
				'<tr><td><b>Zeitstempel</b></td><td>'  + properties.time + '</td></tr>' +
				'<tr><td><b>Sensor-ID</b></td><td>' + sensor.properties.id + '</td></tr>' +
				'<tr><td><b>Fahrzeugtyp</b></td><td>' + sensor.properties.manufacturer + ' ' + sensor.properties.model + '</td></tr>' +
				'<tr><td><b>Spritverbrauch</b></td><td>' + phenomenons.Consumption.value + ' ' + phenomenons.Consumption.unit + '</td></tr>' +
				'<tr><td><b>CO2-Ausstoß</b></td><td>' + phenomenons.CO2.value + ' ' + phenomenons.CO2.unit + '</td></tr>' +
				'<tr><td><b>MAF</b></td><td>' + phenomenons.MAF.value + ' ' + phenomenons.MAF.unit + '</td></tr>' +
				'<tr><td><b>Geschwindigkeit</b></td><td>' + phenomenons.Speed.value + ' ' + phenomenons.Speed.unit + '</td></tr>' +
				'<tr><td><a href="#" class="centerPoint">Auf Punkt zentrieren</a></td><td><a href="#" class="showTrack">Zugehörigen Track anzeigen</a></td></tr></table></html>');

			// Insert the container into the popup
			marker.bindPopup(container[0]);
			
			//Do not load measurements if marker is clicked
			marker.on('click', function(){
				doNotLoad = true
				if(singlePointSelection){
					addSinglePoint(measurement);
				}
			});
			markers.push(marker);
            
            if(filtStart != "" &&filtEnde  != "") {
                //alle Punkte, die nicht im Zeitintervall liegen, entfernen
            }
            if(filtTyp != "") {
                //alle Punkte, die nicht zu dem entsprechenden Autotyp passen, entfernen
                
            }
            if(filtTrack != "") {
                //alle Punkte, die nicht zur entsprechenden Track-ID passen, entfernen
                
            }
            if(filtSensor != "") {
                //alle Punkte, die nicht zur entsprechenden Sensor-ID passen, entfernen
                if(sensor.properties.id.indexOf(filtSensor) == -1) {
                    markers.pop(marker);
                }
            }
			
		});
		
		for(var i = 0; i < markers.length; i++){
			mainMap.addLayer(markers[i]);
		}
		
	});

}

// Choose Single Point-Selection in Sidebar
// Description: User wants to add measurement for analysis by clicking on single points
// Author: René Unrau
function chooseSingleSelection(){
	if(singlePointSelection){
		singlePointSelection = false;
	}else{
		singlePointSelection = true;
	}
}

// Show Track
// Description: Searches for TrackID for a given Measurement
// Author: René Unrau
function showTrack(pointID){
	alert('This function searches for the TrackID of this Point: ' + pointID);
}

// Add Single Measurement
// Description: Adds a single measurement to the selection
// Author: René Unrau
function addSinglePoint(measurement){
	selection.push(measurement);
	alert('You\'ve added this measurement to your selection');
}
