/***********************
	Global variables
***********************/
var mainMap;

var markers = new Array();

//variables needed for drawing a polygon
var polygon;
var polygonLayer;
var drawnItems;
var drawControl;

var selection = new Array();

//If true measurements are not loaded with next movement in map
var doNotLoad = false;

//If true user adds points to selection by clicking on them
var singlePointSelection = false;


// Visualisation of the points
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
function drawMap() {
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
    
    //create a new FeatureGroup to store drawn items
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    //create a drawControl
    //will be invisible since the draw action will be fired by our draw buttons
    drawControl = new L.Control.Draw( {
        draw: {
            position: 'topleft',
            circle: false,
            rectangle: false,
            marker: false,
            polyline: false,
            polygon: false
        },
            edit: {
                featureGroup: drawnItems,
                remove:false,
                edit:false
                
            }
    } );
    
    map.addControl(drawControl);
    
    //eventListener after a draw is created it will be added as a layer to the map
    map.on('draw:created', function (e) {
        var type = e.layerType;
        polygonLayer = e.layer;

        //space for our actions
        map.addLayer(polygonLayer);
    } );
   
    
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
function drawMeasurements() {
    
	if(doNotLoad) {
        doNotLoad = false; 
        return;
    }
    
	//the values which are filled in the form
    var filtStart = document.filterFormular.Start.value;
    var filtEnde = document.filterFormular.Ende.value;
    var filtTyp = document.filterFormular.Typ.value;
    var filtSensor = document.filterFormular.Sensor_ID.value;
    
    var splitStart = filtStart.split("/");
	var filtStartMonth = parseInt(splitStart[0]);
	var filtStartDay = parseInt(splitStart[1]); 
	var filtStartYear = parseInt(splitStart[2]);

	var splitEnd = filtEnde.split("/");
	var filtEndMonth = parseInt(splitEnd[0]);
	var filtEndDay = parseInt(splitEnd[1]);
	var filtEndYear = parseInt(splitEnd[2]);

	var bounds = mainMap.getBounds();
	
	var neLat = bounds.getNorthEast().lat;
	var neLng = bounds.getNorthEast().lng;
	var swLat = bounds.getSouthWest().lat;
	var swLng = bounds.getSouthWest().lng;
	
	for (var i=0; i < markers.length; i++) {
        mainMap.removeLayer(markers[i]);
    }
	
	//set the array 'markers' to a new array
	markers = new Array();
	
	$.getJSON("https://envirocar.org/api/stable/rest/measurements?bbox=" + swLng + "," + swLat + "," + neLng + "," + neLat,function(result) {
	
		result = result.features;
		
		$.each(result, function(i, measurement){
		
			var geometry = measurement.geometry;
			var properties = measurement.properties;
			var sensor = properties.sensor;
			var phenomenons = properties.phenomenons;
			
			//Check if phenomenons are not defined -> add default value
			if(phenomenons.Consumption == undefined) {
				var Consumption = new Object();
				Consumption.value = "-";
				Consumption.unit = "l/s";
				phenomenons.Consumption = Consumption;
			}
			if(phenomenons.CO2 == undefined) {
				var CO2 = new Object();
				CO2.value = "-";
				CO2.unit = "g/s";
				phenomenons.CO2 = CO2;
			}
			if(phenomenons.MAF == undefined) {
				var MAF = new Object();
				MAF.value = "-";
				MAF.unit = "l/s";
				phenomenons.MAF = MAF;
			}
			if(phenomenons.Speed == undefined) {
				var Speed = new Object();
				Speed.value = "-";
				Speed.unit = "km/s";
				phenomenons.Speed = Speed;
			}
		
			marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {icon: redDot});
			
			var container = $('<div/>');

			container.on('click', '#centerPoint', function() {
				doNotLoad = true;
				mainMap.setView([geometry.coordinates[1], geometry.coordinates[0]],18);
			} );
			container.on('click', '#showTrack', function() {
				showTrack(properties.id);
			} );

			container.html('<html><table><tr><td><b>Latitude</b></td><td>' + geometry.coordinates[1] + '</td></tr>' +
				'<tr><td><b>Longitude</b></td><td>' + geometry.coordinates[0] + '</td></tr>' +
				'<tr><td><b>Zeitstempel</b></td><td>'  + properties.time + '</td></tr>' +
				'<tr><td><b>Sensor-ID</b></td><td>' + sensor.properties.id + '</td></tr>' +
				'<tr><td><b>Fahrzeugtyp</b></td><td>' + sensor.properties.manufacturer + ' ' + sensor.properties.model + '</td></tr>' +
				'<tr><td><b>Spritverbrauch</b></td><td>' + phenomenons.Consumption.value + ' ' + phenomenons.Consumption.unit + '</td></tr>' +
				'<tr><td><b>CO2-Ausstoß</b></td><td>' + phenomenons.CO2.value + ' ' + phenomenons.CO2.unit + '</td></tr>' +
				'<tr><td><b>MAF</b></td><td>' + phenomenons.MAF.value + ' ' + phenomenons.MAF.unit + '</td></tr>' +
				'<tr><td><b>Geschwindigkeit</b></td><td>' + phenomenons.Speed.value + ' ' + phenomenons.Speed.unit + '</td></tr>' +
				'<tr><td><a href="#" id="centerPoint" class="link">Auf Punkt zentrieren</a></td><td><a href="#" id="showTrack" class="link">Zugehörigen Track anzeigen</a></td></tr></table></html>');

			// Insert the container into the popup
			marker.bindPopup(container[0]);
			
			//Do not load measurements if marker is clicked
			marker.on('click', function(){
				doNotLoad = true
				if(singlePointSelection) {
					mainMap.closePopup();
					addSinglePoint(measurement);
				}
			} );
			
			//add all points to the array 'markers'
			markers.push(marker);
			
			//split the time into 'day', 'month', 'year'
			var splitTime = properties.time.split("-");
			var year = parseInt(splitTime[0]);
			var month = parseInt(splitTime[1]);
			var day = parseInt(splitTime[2].substring(0,2));

            		var cartype = sensor.properties.manufacturer + " " + sensor.properties.model;
            
			//filter the points
            		if(filtStart != "" && filtEnde  != "") {
                		//delete the points which not fit to the filter 'period of time'
                		if(year < filtStartYear) {
					markers.pop();
				} else if(year > filtStartYear) {
					
				} else {
					if(month < filtStartMonth) {
						markers.pop();
					} else if(month > filtStartMonth) {

					} else {
						if(day < filtStartYear) {
							markers.pop();
						}
					}
				}
				
				if(year > filtEndYear) {
					markers.pop();
				} else if(year < filtEndYear) {
					
				} else {
					if(month > filtEndMonth) {
						markers.pop();
					} else if(month < filtEndMonth) {

					} else {
						if(day > filtStartYear) {
							markers.pop();
						}
					}
				}
				
            		}
            		if(filtTyp != "") {
                		//delete the points which not fit to the filter 'type'
				if(cartype.indexOf(filtTyp) == -1) {
					markers.pop();
				}
            		}        		
            		if(filtSensor != "") {
                		//delete the points which not fit to the filter 'sensor-id'
                		if(sensor.properties.id.indexOf(filtSensor) == -1) {
                    			markers.pop();
                		}	
            		}
			
		} );
		
		for(var i = 0; i < markers.length; i++) {
			mainMap.addLayer(markers[i]);
		}
    } );

}

// Choose Single Point-Selection in Sidebar
// Description: User wants to add measurement for analysis by clicking on single points
// Author: René Unrau
function chooseSingleSelection(id) {
	if(singlePointSelection){
		singlePointSelection = false;
        var li = document.getElementById(id);
        var atag = li.getElementsByTagName('a');
            for (var i = 0; i<atag.length; i++) {
            atag[i].style.border="3px solid rgb(140,188,62)";
            }
    }
    else {
		singlePointSelection = true;
        var li = document.getElementById(id);
        var atag = li.getElementsByTagName('a');
            for (var i = 0; i<atag.length; i++) {
            atag[i].style.border="3px solid rgb(255,165,0)";
	       } 
    }
}


// Show Track
// Description: Searches for TrackID for a given Measurement in the current BoundingBox
// Author: René Unrau
function showTrack(pointID) {
	
	//Get all Tracks in current BBox
	var bounds = mainMap.getBounds();
	
	var neLat = bounds.getNorthEast().lat;
	var neLng = bounds.getNorthEast().lng;
	var swLat = bounds.getSouthWest().lat;
	var swLng = bounds.getSouthWest().lng;
	
	//Loop all Tracks that have measurements within the current BoundingBox
	$.getJSON("https://envirocar.org/api/stable/rest/tracks?bbox=" + swLng + "," + swLat + "," + neLng + "," + neLat,function(result){
		
		var tracks = result.tracks;
		//For each Track that has measurements in the current BoundingBox
		$.each(tracks, function(i, track){
		
			//Get all measurements of the current Track
			$.getJSON("https://envirocar.org/api/stable/rest/tracks/" + track.id,function(measurements){
				
				//Loop all measurements within the current Track
				for(var i = 0; i < measurements.features.length; i++){
				
					//If measurement matches with searched pointID
					if(measurements.features[i].properties.id == pointID){
						alert('Dieser Punkt ist Teil des Tracks: ' + track.id);
						return;
					}
				}
			});
		});
	});
}

// Add Single Measurement
// Description: Adds a single measurement to the selection
// Author: René Unrau
function addSinglePoint(measurement){
	//TODO: Check if Measurement is already inside
	selection.push(measurement);
	updateSelectionList();
}

// Update Selection-List
// Description: Refreshes the List of the selected Measurements
// Author: René Unrau
function updateSelectionList() {
	var updatedList = $("<table id='selectionTable'>" + 
		"<tr><th></th>" + 
		"<th>Punkt</th>" + 
		"<th>ID</th>" + 
		"<th>Koordinaten</th>" + 
		"<th>Sensor-ID</th>" + 
		"<th>Zeitpunkt</th>" + 
		"<th>Fahrzeugmarke</th>" + 
		"<th>Modell</th>" + 
		"<th>Spritverbrauch</th>" + 
		"<th>CO2-Ausstoß</th>" + 
		"<th>Geschwindigkeit</th>" + 
		"<th>MAF</th></tr>"
	);
	
	for(var i = 0; i < selection.length; i++) {
		lat = selection[i].geometry.coordinates[1];
		lon = selection[i].geometry.coordinates[0];
		point = i + 1;
	
		var div = $("<tr>");
		div.append("<td><input type='checkbox' class='chk' name='point_id' value='point_id'></td>");
		div.append("<td>" + point + "</td>");
		div.append("<td>" + selection[i].properties.id + "</td>");
		div.append("<td><a href='#' class='link'>" + lat + ", "  + lon + "</a></td>");
		div.append("<td>" + selection[i].properties.sensor.properties.id + "</td>");
		div.append("<td>" + selection[i].properties.time + "</td>");
		div.append("<td>" + selection[i].properties.sensor.properties.manufacturer + "</td>");
		div.append("<td>" + selection[i].properties.sensor.properties.model + "</td>");
		div.append("<td>" + selection[i].properties.phenomenons.Consumption.value + "</td>");
		div.append("<td>" + selection[i].properties.phenomenons.CO2.value + "</td>");
		div.append("<td>" + selection[i].properties.phenomenons.MAF.value + "</td>");
		div.append("<td>" + selection[i].properties.phenomenons.Speed.value + "</td>");
		div.append("</tr>");
		div.find("a").click(function(){
				mainMap.setView([lat,lon],18);
			});
		updatedList.append(div);
	}
	updatedList.append("</table>");
	$('#selectionTable').replaceWith(updatedList);
}

//Draw a polygon
function drawPolygon(){
    polygon = new L.Draw.Polygon(mainMap, drawControl.options.polygon);
    polygon.enable();
}

//Delete polygon
function deletePolygon(){
    polygon.disable();
    mainMap.removeLayer(polygonLayer);
}
