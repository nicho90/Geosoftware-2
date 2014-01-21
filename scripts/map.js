/***********************
	Global variables
***********************/
var mainMap;

var markers = {};

//variables for saving the input in the form of the filter
var startForm = "";
var endForm = "";
var typForm = "";
var sensorForm = "";

//variables needed for drawing a polygon
var polygon;
var polygonLayer;
var drawnItems;
var drawControl;

// Current Measurement Selection
var selection = new Array();

// Current Frequency of Manufacturer in Selection
var manufacturerSelection = new Array();

//If true user adds points to selection by clicking on them
var singlePointSelection = false;

// Polyline of currently selected track
var trackLine;

//If true measurements are not loaded with next movement in map
var doNotLoad = false;

// Visualisation of the points
var redDot = L.icon({iconUrl: 'images/dots/redDot.png'});

var greenDot = L.icon({iconUrl: 'images/dots/greenDot.png'});


/***********************
	Event register
***********************/
window.onload = function() {
  drawMap();
  drawMeasurements();
  mainMap.on('moveend', drawMeasurements);
  
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
	
	// locate me - function 
	// map pans to current position of the user 
	//Author: Johanna Möllmann
	
	document.getElementById('locateMe').onclick = function() {
       function handler(locateme){
	   var longitude = locateme.coords.longitude;
	   var latitude = locateme.coords.latitude;
	   map.panTo(new L.LatLng(latitude, longitude));}
       navigator.geolocation.getCurrentPosition(handler);
	};
	
	L.control.layers(layer).addTo(map);
    
	mainMap = map;
}

// Draw Measurements
// Description: Adds dots to the map and controls click events
// Author: René Unrau
function drawMeasurements() {
	if(doNotLoad){
		doNotLoad = false;
		return;
	}
    
	//the values which are filled in the form
    var filtStart = startForm;
    var filtEnde = endForm;
    var filtTyp = typForm;
    var filtSensor = sensorForm;
    
    //Fill the form with the currently activated filter
    document.filterFormular.Start.value = startForm;
    document.filterFormular.Ende.value = endForm;
    document.filterFormular.Typ.value = typForm;
    document.filterFormular.Sensor_ID.value = sensorForm;
    
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
	
	for (var i=0; i < markers.length; i++){
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
				doNotLoad = true;
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
			
            //If true the marker is already deleted. If false the marker is not deleted
			var isDeleted = false;
			//filter the points
            if(filtStart != "" && isDeleted == false) {
                //delete the points which not fit to the filter 'period of time'
                if(year < filtStartYear) {
					markers.pop();
					isDeleted = true;
				} else if(year > filtStartYear) {
					
				} else {
					if(month < filtStartMonth) {
						markers.pop();
						isDeleted = true;
					} else if(month > filtStartMonth) {

					} else {
						if(day < filtStartDay) {
							markers.pop();
							isDeleted = true;
						}
					}
				}
			}
			if(filtEnde != "" && isDeleted == false) {	
				if(year > filtEndYear) {
					markers.pop();
					isDeleted = true;
				} else if(year < filtEndYear) {
					
				} else {
					if(month > filtEndMonth) {
						markers.pop();
						isDeleted = true;
					} else if(month < filtEndMonth) {

					} else {
						if(day > filtEndDay) {
							markers.pop();
							isDeleted = true;
						}
					}
				}
				
            }
            if(filtTyp != "" && isDeleted == false) {
                //delete the points which not fit to the filter 'type'
				if(cartype.indexOf(filtTyp) == -1) {
					markers.pop();
					isDeleted = true;
				}
            }        		
            if(filtSensor != "" && isDeleted == false) {
                //delete the points which not fit to the filter 'sensor-id'
                if(sensor.properties.id.indexOf(filtSensor) == -1) {
                    markers.pop();
					isDeleted = true;
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
						var dialog = $('<p>Dieser Punkt ist Teil des Tracks: ' + track.id + 'Möchten sie diesen Track:</p>').dialog({
							buttons: {
								"visualisieren": function() {visualizeTrack(track.id);dialog.dialog('close');},
								"zur Auswahl hinzufügen":  function() {addTrackToSelection(measurements);dialog.dialog('close');},
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

// Add Single Measurement to Selection
// Description: Adds a single measurement to the selection
// Author: René Unrau
function addSinglePoint(measurement){
	// If selection is empty, add to selection, update-sidebar-selection-list and current-analysis
	if(selection.length == 0){
		selection.push(measurement);
		updateSelectionList();
		updateCurrentAnalysis();
	}else{
		// Loop already selected measurements and check if measurement-to-be-added is already inside selection
		for(var i = 0; i < selection.length; i++){
			// If already inside, do not add and throw alert
			if(measurement.properties.id == selection[i].properties.id){
				alert('Der Messpunkt: ' + measurement.properties.id + ' befindet sich bereits in ihrer Auswahl');
				return;
			}
		}
		//If not already inside, add to selection, update-sidebar-selection-list and current-analysis
		selection.push(measurement);
		updateSelectionList();
		updateCurrentAnalysis();
	}	
}


// Add Single Track to Selection
// Description: Adds a single track to the selection
// Author: René Unrau
function addTrackToSelection(track){
	var measurements = track.features
	
	for(var i = 0; i < measurements.length; i++){
		var measurement = new Object();
		
		// Adjust parameters, so that are similar to single measurements from EnviroCar
		measurement.geometry = new Object();
		measurement.geometry.coordinates = new Array();
		measurement.properties = new Object();
		measurement.properties.sensor = new Object();
		measurement.properties.sensor.properties = new Object();
		measurement.properties.phenomenons = new Object();
		measurement.properties.sensor = track.properties.sensor;
		measurement.properties.id = measurements[i].properties.id;
		measurement.properties.time = measurements[i].properties.time;
		measurement.geometry.coordinates[0] = measurements[i].geometry.coordinates[0];
		measurement.geometry.coordinates[1] = measurements[i].geometry.coordinates[1];
		
		//Check if phenomenons are not defined -> add default value
			if(measurements[i].properties.phenomenons.Consumption == undefined) {
				var Consumption = new Object();
				Consumption.value = "-";
				Consumption.unit = "l/s";
				measurements[i].properties.phenomenons.Consumption = Consumption;
			}
			if(measurements[i].properties.phenomenons.CO2 == undefined) {
				var CO2 = new Object();
				CO2.value = "-";
				CO2.unit = "g/s";
				measurements[i].properties.phenomenons.CO2 = CO2;
			}
			if(measurements[i].properties.phenomenons.MAF == undefined) {
				var MAF = new Object();
				MAF.value = "-";
				MAF.unit = "l/s";
				measurements[i].properties.phenomenons.MAF = MAF;
			}
			if(measurements[i].properties.phenomenons.Speed == undefined) {
				var Speed = new Object();
				Speed.value = "-";
				Speed.unit = "km/s";
				measurements[i].properties.phenomenons.Speed = Speed;
			}
		measurement.properties.phenomenons = measurements[i].properties.phenomenons;
		
		selection.push(measurement);
	}
	updateSelectionList();
	updateCurrentAnalysis();
}

// Update Current Analysis
// Description: Refreshes the currently selected Analysis
// Author: René Unrau
function updateCurrentAnalysis(){
	var e = document.getElementById("analysisSelectionBox");
	if(e.options[e.selectedIndex].text == 'Geschwindigkeit'){
		refreshSpeedAnalysis();
	}else if(e.options[e.selectedIndex].text == 'CO2-Ausstoß'){
		refreshCO2Analysis();
	}else if(e.options[e.selectedIndex].text == 'Spritverbrauch'){
		refreshConsumptionAnalysis();
	}else if(e.options[e.selectedIndex].text == 'MAF'){
		refreshMAFAnalysis();
	}else if(e.options[e.selectedIndex].text == 'Fahrzeugtyp'){
		refreshManuAnalysis();
	}
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
	
	$.each(selection, function(i, measurement){
		lat = selection[i].geometry.coordinates[1];
        lon = selection[i].geometry.coordinates[0];
        point = i + 1;
        
		var div = $("<tr>");
        div.append("<td><input type='checkbox' class='chk' name='point_id' id='" + i + "'></td>");
		div.append("<td>" + point + "</td>");
		div.append("<td>" + measurement.properties.id + "</td>");
		div.append("<td><a href='#' class='link'>" + lat + ", " + lon + "</a></td>");
		div.append("<td>" + measurement.properties.sensor.properties.id + "</td>");
		div.append("<td>" + measurement.properties.time + "</td>");
		div.append("<td>" + measurement.properties.sensor.properties.manufacturer + "</td>");
		div.append("<td>" + measurement.properties.sensor.properties.model + "</td>");
		div.append("<td>" + measurement.properties.phenomenons.Consumption.value + "</td>");
		div.append("<td>" + measurement.properties.phenomenons.CO2.value + "</td>");
		div.append("<td>" + measurement.properties.phenomenons.Speed.value + "</td>");
		div.append("<td>" + measurement.properties.phenomenons.MAF.value + "</td>");
		div.append("</tr>");
		div.find("a").click(function(){
			mainMap.setView([selection[i].geometry.coordinates[1],selection[i].geometry.coordinates[0]],18);
		});
		updatedList.append(div);
	});
		
	updatedList.append("</table>");
	$('#selectionTable').replaceWith(updatedList);
}

// Delete measurements from selection
// Description: Deletes selected measurements from selection-list
// Author: René Unrau
function clearSelection(){

	var deletions = new Array();
	
	// Get indices of measurements within selection that should be deleted
	for(var i = 0; i < selection.length; i++){
		if(document.getElementById('' + i).checked){
			deletions.push(i);
		}
	}
	
	// Start deleting from the ending
	deletions.reverse();
	
	for(var i = 0; i < deletions.length; i++){
		selection.splice(deletions[i],1);
	}
	
	updateSelectionList();
	updateCurrentAnalysis();
	
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

//Reset the filter to update the measurements
function resetFilter() {
    document.filterFormular.Start.value = "";
    document.filterFormular.Ende.value = "";
    document.filterFormular.Typ.value = "";
    document.filterFormular.Sensor_ID.value = "";
    
    startFilter();
}

//Start the filter if button 'OK' is pressed 
function startFilter() {
    startForm = document.filterFormular.Start.value;
    endForm = document.filterFormular.Ende.value;
    typForm = document.filterFormular.Typ.value;
    sensorForm = document.filterFormular.Sensor_ID.value;
    
    drawMeasurements();
}


// Update SpeedAnalysis
// Description: Refreshes the List of Speed-Parameters
// Author: René Unrau
function refreshSpeedAnalysis(){

	var result = $("<div id='textualresults' class='analyseElement'><table>");
        result.append("<tr><td><td>Mittelwert</td><td>" + getMean('Speed') + "</td><td>km/h</td></tr>");
		result.append("<tr><td><td>Standardabweichung</td><td>" + getSD('Speed') + "</td><td>km/h</td></tr>");
		result.append("<tr><td><td>Minimum</td><td>" + getMin('Speed') + "</td><td>km/h</td></tr>");
		result.append("<tr><td><td>Maximum</td><td>" + getMax('Speed') + "</td><td>km/h</td></tr></table></div>");
	
	$('#textualresults').replaceWith(result);
}


// Update CO2Analysis
// Description: Refreshes the List of CO2-Parameters
// Author: René Unrau
function refreshCO2Analysis(){

	var result = $("<div id='textualresults' class='analyseElement'><table>");
        result.append("<tr><td><td>Mittelwert</td><td>" + getMean('CO2') + "</td><td>g/s</td></tr>");
		result.append("<tr><td><td>Standardabweichung</td><td>" + getSD('CO2') + "</td><td>g/s</td></tr>");
		result.append("<tr><td><td>Minimum</td><td>" + getMin('CO2') + "</td><td>g/s</td></tr>");
		result.append("<tr><td><td>Maximum</td><td>" + getMax('CO2') + "</td><td>g/s</td></tr></table></div>");
	
	$('#textualresults').replaceWith(result);
}


// Update ConsumptionAnalysis
// Description: Refreshes the List of Consumption-Parameters
// Author: René Unrau
function refreshConsumptionAnalysis(){

	var result = $("<div id='textualresults' class='analyseElement'><table>");
        result.append("<tr><td><td>Mittelwert</td><td>" + getMean('Consumption') + "</td><td>l/s</td></tr>");
		result.append("<tr><td><td>Standardabweichung</td><td>" + getSD('Consumption') + "</td><td>l/s</td></tr>");
		result.append("<tr><td><td>Minimum</td><td>" + getMin('Consumption') + "</td><td>l/s</td></tr>");
		result.append("<tr><td><td>Maximum</td><td>" + getMax('Consumption') + "</td><td>l/s</td></tr></table></div>");
	
	$('#textualresults').replaceWith(result);
}


// Update MAFAnalysis
// Description: Refreshes the List of MAF-Parameters
// Author: René Unrau
function refreshMAFAnalysis(){

	var result = $("<div id='textualresults' class='analyseElement'><table>");
        result.append("<tr><td><td>Mittelwert</td><td>" + getMean('MAF') + "</td><td>l/s</td></tr>");
		result.append("<tr><td><td>Standardabweichung</td><td>" + getSD('MAF') + "</td><td>l/s</td></tr>");
		result.append("<tr><td><td>Minimum</td><td>" + getMin('MAF') + "</td><td>l/s</td></tr>");
		result.append("<tr><td><td>Maximum</td><td>" + getMax('MAF') + "</td><td>l/s</td></tr></table></div>");
	
	$('#textualresults').replaceWith(result);
}

// Update ManufacturerAnalysis
// Description: Refreshes the List of Manufacturer-Parameters
// Author: René Unrau
function refreshManuAnalysis(){
	var mostFreqManu = getMostFreqManu();

	var result = $("<div id='textualresults' class='analyseElement'><table>");
		result.append("<tr><td><td>Häufigster Fahrzeugtyp: </td><td>" + mostFreqManu + "(" + manufacturerSelection[mostFreqManu] + ")</td></tr></table></div>");
	
	$('#textualresults').replaceWith(result);
}

// Get Mean Value
// Description: Returns mean for a given phenomenon
// Author: René Unrau
function getMean(phenomenon){

	var sum = 0;
	var n = 0;
	
	
	
	//For phenomenon "Speed"
	if(phenomenon == 'Speed'){
		for(var i = 0; i < selection.length; i++){
			//If Speed is not undefined
			if(selection[i].properties.phenomenons.Speed.value != '-'){
				n++;
				sum = sum + selection[i].properties.phenomenons.Speed.value;
			}
		}
		return sum/n;
		
	//For phenomenon "CO2"
	}else if(phenomenon == 'CO2'){
		for(var i = 0; i < selection.length; i++){
			//If CO2 is not undefined
			if(selection[i].properties.phenomenons.CO2.value != '-'){
				sum = sum + selection[i].properties.phenomenons.CO2.value;
				n++;
			}
		}
		return sum/n;
	
	//For phenomenon "Consumption"
	}else if(phenomenon == 'Consumption'){
		for(var i = 0; i < selection.length; i++){
			//If Consumption is not undefined
			if(selection[i].properties.phenomenons.Consumption.value != '-'){
				sum = sum + selection[i].properties.phenomenons.Consumption.value;
				n++;
			}
		}
		return sum/n;
	
	//For phenomenon "MAF"
	}else if(phenomenon == 'MAF'){
		for(var i = 0; i < selection.length; i++){
			//If MAF is not undefined
			if(selection[i].properties.phenomenons.MAF.value != '-'){
				sum = sum + selection[i].properties.phenomenons.MAF.value;
				n++;
			}
		}
		return sum/n;
	}
}

// Get StandardDeviation
// Description: Returns standard deviation for a given phenomenon
// Author: René Unrau
function getSD(phenomenon){

	var pre = 0;
	var n = 0;

	//For phenomenon "Speed"
	// Modified by Leon Vogel
	if(phenomenon == 'Speed'){
	
		var mean = getMean(phenomenon);
		for(var i = 0; i < selection.length; i++){
			//If Speed is not undefined
			if(selection[i].properties.phenomenons.Speed.value != '-'){
				pre = pre + Math.pow(selection[i].properties.phenomenons.Speed.value - mean, 2);
				n++;
			}
		}
		var sd = Math.sqrt((1 / (n - 1)) * pre);
		return Math.round(sd*100)/ 100;
	
	//For phenomenon "CO2"
	}else if(phenomenon == 'CO2'){
	
		var mean = getMean(phenomenon);
		for(var i = 0; i < selection.length; i++){
			//If CO2 is not undefined
			if(selection[i].properties.phenomenons.CO2.value != '-'){
				pre = pre + Math.pow(selection[i].properties.phenomenons.CO2.value - mean, 2);
				n++;
			}
		}
		var sd = Math.sqrt((1 / (n - 1)) * pre);
		return Math.round(sd*100)/ 100;
	
	//For phenomenon "Consumption"
	}else if(phenomenon == 'Consumption'){
	
		var mean = getMean(phenomenon);
		for(var i = 0; i < selection.length; i++){
			//If Consumption is not undefined
			if(selection[i].properties.phenomenons.Consumption.value != '-'){
				pre = pre + Math.pow(selection[i].properties.phenomenons.Consumption.value - mean, 2);
				n++;
			}
		}
		var sd = Math.sqrt((1 / (n - 1)) * pre);
		return Math.round(sd*100)/ 100;
		
	//For phenomenon "MAF"
	}else if(phenomenon == 'MAF'){
	
		var mean = getMean(phenomenon);
		for(var i = 0; i < selection.length; i++){
			//If MAF is not undefined
			if(selection[i].properties.phenomenons.MAF.value != '-'){
				pre = pre + Math.pow(selection[i].properties.phenomenons.MAF.value - mean, 2);
				n++;
			}
		}
		var sd = Math.sqrt((1 / (n - 1)) * pre);
		return Math.round(sd*100)/ 100;
	}
}

// Get Minimum
// Description: Returns minimum for a given phenomenon
// Author: René Unrau
function getMin(phenomenon){

	var min = 999;
	
	//For phenomenon "Speed"
	if(phenomenon == 'Speed'){
	
		for(var i = 0; i < selection.length; i++){
			//If Speed is not undefined
			if(selection[i].properties.phenomenons.Speed.value != '-'){
				//If current Value is smaller than current min
				if(min > selection[i].properties.phenomenons.Speed.value){
					min = selection[i].properties.phenomenons.Speed.value;
				}
			}
		}
		return min;
	
	//For phenomenon "CO2"
	}else if(phenomenon == 'CO2'){
	
		for(var i = 0; i < selection.length; i++){
			//If CO2 is not undefined
			if(selection[i].properties.phenomenons.CO2.value != '-'){
				//If current Value is smaller than current min
				if(min > selection[i].properties.phenomenons.CO2.value){
					min = selection[i].properties.phenomenons.CO2.value;
				}
			}
		}
		return min;

	//For phenomenon "Consumption"
	}else if(phenomenon == 'Consumption'){
	
		for(var i = 0; i < selection.length; i++){
			//If Consumption is not undefined
			if(selection[i].properties.phenomenons.Consumption.value != '-'){
				//If current Value is smaller than current min
				if(min > selection[i].properties.phenomenons.Consumption.value){
					min = selection[i].properties.phenomenons.Consumption.value;
				}
			}
		}
		return min;

	//For phenomenon "MAF"
	}else if(phenomenon == 'MAF'){
	
		for(var i = 0; i < selection.length; i++){
			//If MAF is not undefined
			if(selection[i].properties.phenomenons.MAF.value != '-'){
				//If current Value is smaller than current min
				if(min > selection[i].properties.phenomenons.MAF.value){
					min = selection[i].properties.phenomenons.MAF.value;
				}
			}
		}
		return min;
	}
}

// Get Maximum
// Description: Returns maximum for a given phenomenon
// Author: René Unrau
function getMax(phenomenon){

	var max = 0;
	
	//For phenomenon "Speed"
	if(phenomenon == 'Speed'){
	
		for(var i = 0; i < selection.length; i++){
			//If Speed is not undefined
			if(selection[i].properties.phenomenons.Speed.value != '-'){
				//If current Value is bigger than current max
				if(max < selection[i].properties.phenomenons.Speed.value){
					max = selection[i].properties.phenomenons.Speed.value;
				}
			}
		}
		return max;
	
	//For phenomenon "CO2"
	}else if(phenomenon == 'CO2'){
	
		for(var i = 0; i < selection.length; i++){
			//If CO2 is not undefined
			if(selection[i].properties.phenomenons.CO2.value != '-'){
				//If current Value is bigger than current max
				if(max < selection[i].properties.phenomenons.CO2.value){
					max = selection[i].properties.phenomenons.CO2.value;
				}
			}
		}
		return max;
		
	
	//For phenomenon "Consumption"
	}else if(phenomenon == 'Consumption'){
	
		for(var i = 0; i < selection.length; i++){
			//If Consumption is not undefined
			if(selection[i].properties.phenomenons.Consumption.value != '-'){
				//If current Value is bigger than current max
				if(max < selection[i].properties.phenomenons.Consumption.value){
					max = selection[i].properties.phenomenons.Consumption.value;
				}
			}
		}
		return max;
		
	//For phenomenon "MAF"
	}else if(phenomenon == 'MAF'){
	
		for(var i = 0; i < selection.length; i++){
			//If MAF is not undefined
			if(selection[i].properties.phenomenons.MAF.value != '-'){
				//If current Value is bigger than current max
				if(max < selection[i].properties.phenomenons.MAF.value){
					max = selection[i].properties.phenomenons.MAF.value;
				}
			}
		}
		return max;
	
	//For phenomenon "Manufacturer"
	}else if(phenomenon == 'Manufacturer'){
		
		var maxkey;
		var first = true;
		
		for (var key in manufacturerSelection){
			// Take first value as start-maximum
			if(first){
				maxkey = key;
				first = false;
			// Check for higher maximum
			}else{
				if(manufacturerSelection[maxkey] < manufacturerSelection[key])
				maxkey = key;
			}
		}
		return maxkey;
	}
}

// Get Most Frequent Manufacturer
// Description: Returns manufactures which is most frequent in selection
// Author: René Unrau
function getMostFreqManu(){
	manufacturerSelection = {};

	// Loop all measurements
	for(var i = 0; i < selection.length; i++){
		// if manufacturer is already in map do +1
		if(selection[i].properties.sensor.properties.manufacturer in manufacturerSelection){
			manufacturerSelection[selection[i].properties.sensor.properties.manufacturer]++;
		// if not, create new element
		}else{
			manufacturerSelection[selection[i].properties.sensor.properties.manufacturer] = 1;
		}
	}
	
	// Get and return maximum
	return getMax('Manufacturer');
}

// Choose Track for Selection
// Description: Gets trackID from userinput and visualizes track
// Author: René Unrau
function chooseTrackSelection(){
	var trackID = document.getElementById('Track_ID').value;
	
	visualizeTrack(trackID);
}

// Visualize Track
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
				'<tr><td><b>Spritverbrauch</b></td><td>' + phenomenons.Consumption.value + ' ' + phenomenons.Consumption.unit + '</td></tr>' +
				'<tr><td><b>CO2-Ausstoß</b></td><td>' + phenomenons.CO2.value + ' ' + phenomenons.CO2.unit + '</td></tr>' +
				'<tr><td><b>MAF</b></td><td>' + phenomenons.MAF.value + ' ' + phenomenons.MAF.unit + '</td></tr>' +
				'<tr><td><b>Geschwindigkeit</b></td><td>' + phenomenons.Speed.value + ' ' + phenomenons.Speed.unit + '</td></tr>' +
				'<tr><td><a href="#" id="centerPoint" class="link">Auf Punkt zentrieren</a></td><td><a href="#" id="addToSelection" class="link">Track zur Auswahl hinzufügen</a></td></tr></table></html>');

			// Insert the container into the popup
			marker.bindPopup(container[0]);
			
			//Do not load measurements if marker is clicked
			marker.on('click', function(){
				doNotLoad = true
				if(singlePointSelection) {
					mainMap.closePopup();
					addSinglePoint(measurement);
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
		
	});
}

// Reset Track Selection
// Description: Deletes Track and draws standard measurements
// Author: René Unrau
function resetTrackSelection(){
	mainMap.removeLayer(trackLine);
	drawMeasurements();
	document.getElementById('Track_ID').value = '';
	mainMap.on('moveend', drawMeasurements);
}