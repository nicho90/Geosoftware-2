/********************************************************************************************
		Track
		
This file contains all functions needed for searching and displaying a track.

********************************************************************************************
Content

1. Show Track

2. Visualize Track

3. Search/Add Track

*********************************************************************************************/

/***********************
	1. Show Track
***********************/

// 1 Show Track
// Description: Searches for TrackID for a given Measurement in the current BoundingBox
// Author: René Unrau
function showTrack(pointID) {
		
	//Get all Tracks in current BBox
	var bounds = mainMap.getBounds();
	
	var neLat = bounds.getNorthEast().lat;
	var neLng = bounds.getNorthEast().lng;
	var swLat = bounds.getSouthWest().lat;
	var swLng = bounds.getSouthWest().lng;
    
    var dialog = $('<div class="loading_box"><img src=images/loading.gif class="loading_picture"></div>').dialog(
	            {  
                    height: 220,
	                width: 600,
	                modal: true
	            });
	
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
						   dialog.dialog('close');
                                dialog = $('<p>Dieser Punkt ist Teil des Tracks: <b>' + track.id + '</b><br><br>M&ouml;chten Sie diesen Track:</p>').dialog(
							{
	 								width: 600,
	 								modal: true,
	 								buttons: {
                                        "Visualisieren": function() {visualizeTrack(track.id);dialog.dialog('close');},
                                        "Zur Auswahl hinzufügen":  function() {addTrackToSelection(measurements);dialog.dialog('close');},
	 									"Abbrechen":  function() {dialog.dialog('close');}
	 								}
	 							});										
									
						return;
					}
				}
			});
		});
	});
}


/***********************
	2. Visualize Track
***********************/

// 2 Visualize Track
// Description: Visualizes track on map and deletes other measurements
// Author: René Unrau
function visualizeTrack(trackID){
	
	// Get TrackJSON from enviroCar
	$.getJSON("https://envirocar.org/api/stable/rest/tracks/" + trackID,function(track){
		
		// Remove old markers
		for (var i=0; i < markers.length; i++) {
			mainMap.removeLayer(markers[i]);
		}
	
		// Clear old array from markers
		markers = new Array();
		
		meas = track.features;
		
		trackLine = L.polyline([], {color: 'red'}).addTo(mainMap);
		
		$.each(meas, function(i, measurement){
		
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
		
			marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {icon: greenDot});
			
			var container = $('<div/>');

			container.on('click', '#centerPoint', function() {
				doNotLoad = true;
				mainMap.setView([geometry.coordinates[1], geometry.coordinates[0]],18);
			} );
			container.on('click', '#addToSelection', function() {
				addTrackToSelection(track);
			} );

			container.html('<html><table><tr><td><b>Latitude</b></td><td>' + geometry.coordinates[1] + '</td></tr>' +
				'<tr><td><b>Longitude</b></td><td>' + geometry.coordinates[0] + '</td></tr>' +
				'<tr><td><b>Zeitstempel</b></td><td>'  + properties.time + '</td></tr>' +
				'<tr><td><b>Sensor-ID</b></td><td>' + track.properties.sensor.properties.id + '</td></tr>' +
				'<tr><td><b>Fahrzeugtyp</b></td><td>' + track.properties.sensor.properties.manufacturer + ' ' + track.properties.sensor.properties.model + '</td></tr>' +
				'<tr><td><b>Geschwindigkeit</b></td><td>' + phenomenons.Speed.value + ' ' + phenomenons.Speed.unit + '</td></tr>' +
				'<tr><td><b>CO2-Ausstoß</b></td><td>' + phenomenons.CO2.value + ' ' + phenomenons.CO2.unit + '</td></tr>' +
				'<tr><td><b>Spritverbrauch</b></td><td>' + phenomenons.Consumption.value + ' ' + phenomenons.Consumption.unit + '</td></tr>' +
				'<tr><td><b>MAF</b></td><td>' + phenomenons.MAF.value + ' ' + phenomenons.MAF.unit + '</td></tr>' +
				'<tr><td><a href="#" id="centerPoint" class="link">Auf Punkt zentrieren</a></td><td><a href="#" id="addToSelection" class="link">Track zur Auswahl hinzufügen</a></td></tr></table></html>');

			// Insert the container into the popup
			marker.bindPopup(container[0]);
			
			//Do not load measurements if marker is clicked
			marker.on('click', function(){
				doNotLoad = true
				if(singlePointSelection) {
					mainMap.closePopup();
					addSinglePointFromTrack(measurement, track);
				}
			});
			
			// Add this marker to the array, allows deletion
			markers.push(marker);
			
			// Add element to polyline
			trackLine.addLatLng([geometry.coordinates[1], geometry.coordinates[0]]) ;
		});
		// Map should not draw measurements but keep this track
		mainMap.off('moveend', drawMeasurements);
		
		// Add all markers from array to map
		for(var i = 0; i < markers.length; i++) {
				mainMap.addLayer(markers[i]);	
		}
		
		// Set bounds of map to track
		mainMap.fitBounds(trackLine.getBounds());
        
        //show visualisation button on the map
        toggle_visibility('visualisation');
		button4 = true;
		
		return track;
	});
}

/***********************
	3. Track-Selection-Tool
***********************/

// 3.1 Search/Add Track
// Description: Search Track by ID and adds it to selection
// Author: René Unrau
function addTrack(){
	
    var trackID = document.getElementById('Track_ID').value;
	
	jQuery.ajax({
		async : false,
		url: "https://envirocar.org/api/stable/rest/tracks/" + trackID,
		success: function(track){
			//Reset Visualization
			resetVisualization();
			//Add Track to selection
			addTrackToSelection(track);
			// Close Track-Selection Tool
			chooseTrackSelection();
		},
        error: function(jqXHR, textStatus, errorThrown){
			dialog = $('<p>Es wurde kein Track gefunden.<br>Bitte überprüfen sie ihre Eingabe</p>').dialog({
				width: 600,
				modal: true,
				buttons: {
					"OK":  function() {dialog.dialog('close');}
	 			}
	 		});	
			document.getElementById('Track_ID').value = '';
        }    
    });
}

// 3.2 VisualizeTrack from Selection Tool
// Description: Search Track by ID and adds it to selection
// Author: René Unrau
function visualizeTrackFromTool(){
	
    var trackID = document.getElementById('Track_ID').value;
	
	visualizeTrack(trackID);
}


