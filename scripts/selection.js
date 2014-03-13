/********************************************************************************************
		Selection
		
This file contains all functions needed for adding and deleting measurement to/from the selection.
You will find also functions for changing the map-dots depending wether they are selected or not.
This file contains also a function for opening the new window with a detailed view of all measurements.

********************************************************************************************
Content

1. Add to Selection
	1.1 From Standard-View
	1.2 After Track-Visualization
	1.3 Complete Track

2. Delete from Selection
	2.1 Single Measurement
	2.2 Clear complete Selection

3. Visualize Selection

4. Update List

5. Show Details
	
*********************************************************************************************/

/****************************
	1. Add to Selection
****************************/

// 1.1 Add Single Measurement to Selection
// Description: Adds a single measurement to the selection
// Author: René Unrau
function addSinglePoint(measurement){

	//Transform CO2 kg/h to g/s and Consumption l/s to l/h
	if(measurement.properties.phenomenons.Consumption.unit == 'l/s'){
		measurement.properties.phenomenons.Consumption.value = measurement.properties.phenomenons.Consumption.value * 3600;
		measurement.properties.phenomenons.Consumption.unit = 'l/h';
	}
	
	if(measurement.properties.phenomenons.CO2.unit == 'kg/h'){
		measurement.properties.phenomenons.CO2.value = measurement.properties.phenomenons.CO2.value / 3.6;
		measurement.properties.phenomenons.CO2.unit = 'g/s';
	}
	
	
	// If selection is empty, add to selection, update-sidebar-selection-list and current-analysis
	if(selection.length == 0){
		selection.push(measurement);
	
		updateSelectionList();
		refreshManufacturers();
		refreshAnalysis();
		visualizeSelection();
		
		onlyOneTrack = false;

	
        //Open and Close info-popup
        //Authors: Nicholas Schiestel and Johanna Moellmann
		$('#infodialog').html('Punkt wurde hinzugef&uuml;gt.');
		$('#infodialog').dialog({ 
		height: 100,
		width: 300,
		autoOpen: true,   
		modal: true, 
		open: function(event, ui) { 
			setTimeout(function(){ 
			$('#infodialog').dialog('close'); }, 1000); } });
        
    }
    
    else{
        
		// Loop already selected measurements and check if measurement-to-be-added is already inside selection
		for(var i = 0; i < selection.length; i++){
			// If already inside, do not add and throw alert
			if(measurement.properties.id == selection[i].properties.id){
                $('#infodialog').html('Der Messpunkt: ' + measurement.properties.id + ' befindet sich bereits in Ihrer Auswahl');
                $('#infodialog').dialog({ 
                    height: 100,
                    width: 300,
                    autoOpen: true,   
                    modal: true, 
                    title: "Error 204",
                    open: function(event, ui) { 
                        setTimeout(function(){ 
                            $('#infodialog').dialog('close'); 
                        }, 1000); 
                    } 
                });
                
				return true;;
			}
		}
		//If not already inside, add to selection, update-sidebar-selection-list and current-analysis
		selection.push(measurement);
		
		updateSelectionList();
		refreshManufacturers();
		refreshAnalysis();
		visualizeSelection();
		
		onlyOneTrack = false;
		
		//Open and Close info-popup
		//Authors: Nicholas Schiestel and Johanna Moellmann	
		$('#infodialog').html('Punkt wurde hinzugef&uuml;gt.');
		$('#infodialog').dialog({ 
		height: 100,
		width: 300,
		autoOpen: true,   
		modal: true, 
		open: function(event, ui) { 
			setTimeout(function(){ 
			$('#infodialog').dialog('close'); }, 500); } });
	}
	
}

// 1.2 Add Single Measurement to Selection from a Track
// Description: Adds a single measurement to the selection from a track
// Measurement-object needs to be changed before insert
// Author: René Unrau
function addSinglePointFromTrack(trackMeasurement, track){

	var measurement = new Object();
		
	// Adjust parameters, so that are similar to single measurements from EnviroCar
	measurement.geometry = new Object();
	measurement.geometry.coordinates = new Array();
	measurement.properties = new Object();
	measurement.properties.sensor = new Object();
	measurement.properties.sensor.properties = new Object();
	measurement.properties.phenomenons = new Object();
	measurement.properties.sensor = track.properties.sensor;
	measurement.properties.id = trackMeasurement.properties.id;
	measurement.properties.time = trackMeasurement.properties.time;
	measurement.geometry.coordinates[0] = trackMeasurement.geometry.coordinates[0];
	measurement.geometry.coordinates[1] = trackMeasurement.geometry.coordinates[1];
	
	//Check if phenomenons are not defined -> add default value
	//Transform CO2 kg/h to g/s and Consumption l/s to l/h
		if(trackMeasurement.properties.phenomenons.Consumption == undefined) {
			var Consumption = new Object();
			Consumption.value = "-";
			Consumption.unit = "l/s";
			trackMeasurement.properties.phenomenons.Consumption = Consumption;
			
		}else if(trackMeasurement.properties.phenomenons.Consumption.unit == 'l/s'){
			trackMeasurement.properties.phenomenons.Consumption.value = trackMeasurement.properties.phenomenons.Consumption.value * 3600;
			trackMeasurement.properties.phenomenons.Consumption.unit = 'l/h';
		}
		
		if(trackMeasurement.properties.phenomenons.CO2 == undefined) {
			var CO2 = new Object();
			CO2.value = "-";
			CO2.unit = "g/s";
			trackMeasurement.properties.phenomenons.CO2 = CO2;
			
		}else if(trackMeasurement.properties.phenomenons.CO2.unit == 'kg/h'){
			trackMeasurement.properties.phenomenons.CO2.value = trackMeasurement.properties.phenomenons.CO2.value / 3.6;
			trackMeasurement.properties.phenomenons.CO2.unit = 'g/s';
		}
		if(trackMeasurement.properties.phenomenons.MAF == undefined) {
			var MAF = new Object();
			MAF.value = "-";
			MAF.unit = "l/h";
			trackMeasurement.properties.phenomenons.MAF = MAF;
		}
		if(trackMeasurement.properties.phenomenons.Speed == undefined) {
			var Speed = new Object();
			Speed.value = "-";
			Speed.unit = "km/s";
			trackMeasurement.properties.phenomenons.Speed = Speed;
		}
	measurement.properties.phenomenons = trackMeasurement.properties.phenomenons;
	
	// If selection is empty, add to selection, update-sidebar-selection-list and current-analysis
	if(selection.length == 0){
		selection.push(measurement);
		
		updateSelectionList();
		refreshManufacturers();
		refreshAnalysis();
		visualizeSelection();
		
		onlyOneTrack = false;
	}else{
		// Loop already selected measurements and check if measurement-to-be-added is already inside selection
		for(var i = 0; i < selection.length; i++){
			// If already inside, do not add and throw alert
			if(measurement.properties.id == selection[i].properties.id){
                $('#infodialog').html('Der Messpunkt: ' + measurement.properties.id + ' befindet sich bereits in Ihrer Auswahl');
                $('#infodialog').dialog({ 
                    height: 100,
                    width: 300,
                    autoOpen: true,   
                    modal: true, 
                    title: "Error 205",
                    open: function(event, ui) { 
                        setTimeout(function(){ 
                            $('#infodialog').dialog('close'); 
                        }, 1000); 
                    } 
                });
                
				return;
			}
		}
		//If not already inside, add to selection, update-sidebar-selection-list and current-analysis
		selection.push(measurement);
		
		updateSelectionList();
		refreshManufacturers();
		refreshAnalysis();
		visualizeSelection();
		
		onlyOneTrack = false;
	}	
}


// 1.3 Add Single Track to Selection
// Description: Adds a single track to the selection
// Author: René Unrau
function addTrackToSelection(track){
	var measurements = track.features
	
	// If selection is empty before adding track -> now there is only one track in selection
	if(selection.length == 0){
		onlyOneTrack = true;
	}
	
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
		//Transform CO2 kg/h to g/s and Consumption l/s to l/h
			if(measurements[i].properties.phenomenons.Consumption == undefined) {
				var Consumption = new Object();
				Consumption.value = "-";
				Consumption.unit = "l/s";
				measurements[i].properties.phenomenons.Consumption = Consumption;
				
			}else if(measurements[i].properties.phenomenons.Consumption.unit == 'l/s'){
				measurements[i].properties.phenomenons.Consumption.value = measurements[i].properties.phenomenons.Consumption.value * 3600;
				measurements[i].properties.phenomenons.Consumption.unit = 'l/h';
			}
			
			if(measurements[i].properties.phenomenons.CO2 == undefined) {
				var CO2 = new Object();
				CO2.value = "-";
				CO2.unit = "g/s";
				measurements[i].properties.phenomenons.CO2 = CO2;
				
			}else if(measurements[i].properties.phenomenons.CO2.unit == 'kg/h'){
				measurements[i].properties.phenomenons.CO2.value = measurements[i].properties.phenomenons.CO2.value / 3.6;
				measurements[i].properties.phenomenons.CO2.unit = 'g/s';
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
	refreshManufacturers();
	refreshAnalysis();
	visualizeSelection();    
    
	//Open and Close info-popup
	//Authors: Nicholas Schiestel and Johanna Moellmann	
	$('#infodialog').html('Punkte wurden hinzugef&uuml;gt.');
	$('#infodialog').dialog({ 
		height: 100,
		width: 300,
		autoOpen: true,   
		modal: true, 
		open: function(event, ui) {
			setTimeout(function(){ 
			$('#infodialog').dialog('close'); }, 500); 
		}
	});
    
    
    // If a track is selected, show the interpolationbox
    var e = document.getElementById('interpolationBox');
    e.style.display = 'block';
    
}

/****************************
	2. Delete from Selection
****************************/

// 2.1 Delete Single Measurement
// Description: Delete Single Measurement from Selection by ID
// Author: René Unrau
function deleteSingleMeasurement(measurementID){

	for(var i = 0; i < selection.length; i++){
	
		if(selection[i].properties.id == measurementID){
			selection.splice(i,1);
			updateSelectionList();
			refreshManufacturers();
			refreshAnalysis();
			drawMeasurements();
		}
	}
}

// 2.2 Delete measurements from selection
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
	refreshManufacturers()
	refreshAnalysis();
	
	if(dialogTable != undefined && dialogTable.dialog('isOpen')) {
	dialogTable.dialog('close');
	showMeasurementDetails();
	} else {
		var dialog = $('<p>Es wurden noch keine Messpunkte selektiert.</p>').dialog({
            width:600,
			buttons: {
				"OK": function() {dialog.dialog('close');},
			}
		});	
	}
}


/****************************
	3. Visualize Selection
****************************/

// 3 Visualize Selection
// Description: Searches for selected Measurements in BBox and change Color
// Auhtor: René Unrau
function visualizeSelection(){

	for(var i = 0; i < markers.length; i++){
	
		for(var j = 0; j < selection.length; j++){
	
			if(markers[i].getLatLng().lat == selection[j].geometry.coordinates[1] && markers[i].getLatLng().lng == selection[j].geometry.coordinates[0]){
			
				currentMeasurement = selection[j];
			
				mainMap.removeLayer(markers[i]);
				
				marker = L.marker([selection[j].geometry.coordinates[1], selection[j].geometry.coordinates[0]], {icon: blueDot});
			
				var container = $('<div/>');

				container.on('click', '#centerPoint', function() {
					doNotLoad = true;
					mainMap.setView([currentMeasurement.geometry.coordinates[1], currentMeasurement.geometry.coordinates[0]],18);
				} );
				container.on('click', '#showTrack', function() {
					doNotLoad = true;
					mainMap.setView([currentMeasurement.geometry.coordinates[1], currentMeasurement.geometry.coordinates[0]],18);
					showTrack(currentMeasurement.properties.id);
				} );

				container.html('<html><table><tr><td><b>Latitude</b></td><td>' + selection[j].geometry.coordinates[1] + '</td></tr>' +
					'<tr><td><b>Longitude</b></td><td>' + selection[j].geometry.coordinates[0] + '</td></tr>' +
					'<tr><td><b>Zeitstempel</b></td><td>'  + selection[j].properties.time + '</td></tr>' +
					'<tr><td><b>Sensor-ID</b></td><td>' + selection[j].properties.sensor.properties.id + '</td></tr>' +
					'<tr><td><b>Fahrzeugtyp</b></td><td>' + selection[j].properties.sensor.properties.manufacturer + ' ' + selection[j].properties.sensor.properties.model + '</td></tr>' +
                    '<tr><td><b>Geschwindigkeit</b></td><td>' + selection[j].properties.phenomenons.Speed.value + ' ' + selection[j].properties.phenomenons.Speed.unit + '</td></tr>' +
					'<tr><td><b>CO2-Ausstoß</b></td><td>' + selection[j].properties.phenomenons.CO2.value + ' ' + selection[j].properties.phenomenons.CO2.unit + '</td></tr>' +
					'<tr><td><b>Spritverbrauch</b></td><td>' + selection[j].properties.phenomenons.Consumption.value + ' ' + selection[j].properties.phenomenons.Consumption.unit + '</td></tr>' +
					'<tr><td><b>MAF</b></td><td>' + selection[j].properties.phenomenons.MAF.value + ' ' + selection[j].properties.phenomenons.MAF.unit + '</td></tr>' +
					'<tr><td><a href="#" id="centerPoint" class="link">Auf Punkt zentrieren</a></td><td><a href="#" id="showTrack" class="link">Zugehörigen Track anzeigen</a></td></tr></table></html>');

				// Insert the container into the popup
				marker.bindPopup(container[0]);
			
				measurement = selection[j];
				
				//Do not load measurements if marker is clicked
				marker.on('click', function(){
					doNotLoad = true;
					if(singlePointSelection) {
						mainMap.closePopup();
						var dialog = $('<p>Möchten Sie diesen Punkt von der Auswahl entfernen?</p>').dialog({
                            width:600,
							buttons: {
								"Ja": function() {deleteSingleMeasurement(measurement.properties.id);dialog.dialog('close');},
								"Nein":  function() {dialog.dialog('close');}
							}
						});	
					}
				});
				
				markers[i] = marker;
				mainMap.addLayer(markers[i]);
			
			}
		}
	}
}

/****************************
	4. Update List
****************************/

// 4 Update Selection-List
// Description: Refreshes the List of the selected Measurements
// Author: René Unrau
function updateSelectionList() {
        var updatedList = $("<table class=points>" +
        "<tr><th></th>" +
        "<th>Punkt</th>" + 
        "<th>Koordinaten</th></tr>");
    
	$.each(selection, function(i, measurement){
		lat = selection[i].geometry.coordinates[1];
        lon = selection[i].geometry.coordinates[0];
        point = i + 1;
        
		var div = $("<tr>");
        div.append("<td><input type='checkbox' class='chk' name='point_id' id='" + i + "'></td>");
		div.append("<td>" + point + "</td>");
		div.append("<td><a href='#' class='link'>" + lat + ", " + lon + "</a></td>");
		div.append("</tr>");
		div.find("a").click(function(){
			mainMap.setView([selection[i].geometry.coordinates[1],selection[i].geometry.coordinates[0]],18);
			for(var j = 0; j < markers.length; j++){
				if(markers[j].getLatLng().lat == selection[i].geometry.coordinates[1] && markers[j].getLatLng().lng == selection[i].geometry.coordinates[0]){
					doNotLoad = true;
					markers[j].openPopup();
					break;
				}
			}
		});
		updatedList.append(div);
	});
	updatedList.append("</table>");
	$('#pointTable').html(updatedList);    
    
    // If two points are selected and in the list, show the analysebox
    if(selection.length>0) {
        var e = document.getElementById('selectedPointsBox');
        e.style.display = 'block';
    }
    
    // If two points are selected and in the list, show the analysebox
    if(selection.length>1) {
        var e = document.getElementById('analyseBox');
        e.style.display = 'block';
    }
    
}

/****************************
	5. Show Details
****************************/

// Show all measurementdetails of the selected Points
// Description: Creates a more detailed list of selected points in a popup
// Author: Christian Peters & Oli Kosky
function showMeasurementDetails() {

    var updatedList = $("<table>" + 
		 
		"<th>Punkt</th>" +
		"<th>Koordinaten</th>" + 
		"<th>Sensor-ID</th>" + 
		"<th>Zeitpunkt</th>" + 
		"<th>Fahrzeugmarke</th>" + 
		"<th>Modell</th>" + 
        "<th>Geschwindigkeit [km/h]</th>" + 
		"<th>CO2-Ausstoß[g/s]</th>" + 
		"<th>Spritverbrauch [l/h]</th>" + 
		"<th>MAF [l/s]</th></tr>"
	);

	$.each(selection, function(i, measurement){
		lat = selection[i].geometry.coordinates[1];
        lon = selection[i].geometry.coordinates[0];
        point = i + 1;
        
		var div = $("<tr>");
        
		div.append("<td>" + point + "</td>");
		div.append("<td><a href='#' class='link'>" + lat + ", " + lon + "</a></td>");
		div.append("<td>" + measurement.properties.sensor.properties.id + "</td>");
		div.append("<td>" + measurement.properties.time + "</td>");
		div.append("<td>" + measurement.properties.sensor.properties.manufacturer + "</td>");
		div.append("<td>" + measurement.properties.sensor.properties.model + "</td>");
		div.append("<td>" + measurement.properties.phenomenons.Speed.value + "</td>");
		div.append("<td>" + measurement.properties.phenomenons.CO2.value + "</td>");
        div.append("<td>" + measurement.properties.phenomenons.Consumption.value + "</td>");
		div.append("<td>" + measurement.properties.phenomenons.MAF.value + "</td>");
		div.append("</tr>");
		div.find("a").click(function(){
			mainMap.setView([selection[i].geometry.coordinates[1],selection[i].geometry.coordinates[0]],18);
		});
		updatedList.append(div);
	});

    updatedList.append("</table>");
	//$('#selectionTable').replaceWith(updatedList);
	
	var table = $("<div id=measurementDetails>");
	table.append(updatedList);
	table.append("</div>");
	
    dialogTable=$(table).dialog(
        {
		height: 620,
		width: 900,
		title: "Alle ausgewählten Messwerte"
        });
}