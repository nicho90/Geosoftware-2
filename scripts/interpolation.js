/********************************************************************************************
		Interpolation
		
This file contains all functions needed for executing the different interpolation.
You will find all functions for computing and visualizing the interpolation.
The last functions in this file are used for controlling the visualization

********************************************************************************************
Content

1. Compute Interpolation
	1.1 Start Interpolation
	1.2 IDW Interpolation
	1.3 Kriging Interpolation

2. Visualize Interpolation

3. Helper Functions
	3.1 Check Interpolation-Requirements
	3.2 Check Interpolation-Attributes
	3.3 Compute Coordinates for Interpolation

4. Visualization Control
	4.1 Switch Interpolation-Line
	4.2 Switch Interpolation-Measurements
	4.3 Switch Interpolation-Points

*********************************************************************************************/

/****************************
	1. Compute Interpolation
****************************/

// 1.1 Start Interpolation
// Description: Checks which interpolation is choosed and starts it
// Author: René Unrau
function startInterpolation(){
	
	if(selection.length == 0){
		var dialog = $('<p>Es befindet sich kein Track in Ihrer Auswahl.</p>').dialog({
			modal: true,
            title: "Error 601",
            height:200,
            width:600,
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
		return;
	}
	
	// Check which attributes are available for this track
	var consumption = false;
	var co2 = false;
	var maf = false;
	var speed = false;
	if(selection[0].properties.phenomenons.Consumption.value != '-'){consumption = true;}
	if(selection[0].properties.phenomenons.CO2.value != '-'){co2 = true;}
	if(selection[0].properties.phenomenons.MAF.value != '-'){maf = true;}
	if(selection[0].properties.phenomenons.Speed.value != '-'){speed = true;}

	// Check if Interpolation is allowed
	if(!checkIntRequirements(consumption, co2, maf, speed)){
		return;
	}
	
	// Remove old markers
	for(var i=0; i < markers.length; i++) {
		mainMap.removeLayer(markers[i]);
	}
	
	// Clear old array from markers
	markers = new Array();
	
	// Check if there has been already an interpolation and if yes: remove old interpolated-points from map
	if(interpolated != undefined){
		for(var i = 0; i < interpolated.marker.length; i++){
		
			mainMap.removeLayer(interpolated.marker[i]);
		}
	}	
	
	// Delete Track visualization if there was one
	if(trackLine != undefined){
		mainMap.removeLayer(trackLine);
	}
	
	// Map should not draw measurements but keep this interpolation
	mainMap.off('moveend', drawMeasurements);
	
	// Define interpolation Object
	interpolated = new Object();
	interpolated.latitude = new Array();
	interpolated.longitude = new Array();
	interpolated.phenomenons = new Object();
	interpolated.phenomenons.Consumption = new Array();
	interpolated.phenomenons.CO2 = new Array();
	interpolated.phenomenons.MAF = new Array();
	interpolated.phenomenons.Speed = new Array();
	interpolated.marker = new Array();
	
	//Compute Coords if interpolated values
	computeCoords();
	
	/*
	// Add all markers from array to map
	for(var i = 0; i < selection.length; i++) {
		markers.push(L.marker([selection[i].geometry.coordinates[1], selection[i].geometry.coordinates[0]], {icon: blueDot}));
	}
	*/
	markers = new Array();
	
	$.each(selection, function(i, measurement){
	
		var geometry = measurement.geometry;
		var properties = measurement.properties;
		var sensor = properties.sensor;
		var phenomenons = properties.phenomenons;
		
		marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {icon: blueDot});
		
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
			'<tr><td><b>Geschwindigkeit</b></td><td>' + phenomenons.Speed.value + ' ' + phenomenons.Speed.unit + '</td></tr>' +
			'<tr><td><b>CO2-Ausstoß</b></td><td>' + phenomenons.CO2.value + ' ' + phenomenons.CO2.unit + '</td></tr>' +
			'<tr><td><b>Spritverbrauch</b></td><td>' + phenomenons.Consumption.value + ' ' + phenomenons.Consumption.unit + '</td></tr>' +
			'<tr><td><b>MAF</b></td><td>' + phenomenons.MAF.value + ' ' + phenomenons.MAF.unit + '</td></tr>' +
			'<tr><td><a href="#" id="centerPoint" class="link">Auf Punkt zentrieren</a></td><td><a href="#" id="showTrack" class="link">Zugehörigen Track anzeigen</a></td></tr></table></html>');
					
		// Insert the container into the popup
		marker.bindPopup(container[0]);
		
		markers.push(marker);
	});
	
	// Choose interpolaton
    if(document.interpolation.interpolationMethod[0].checked?"0":"1" == '0') {
        idwInterpolation(consumption, co2, maf, speed);
    }
    
    else if(document.interpolation.interpolationMethod[1].checked?"0":"1" == '1') {
        krigingInterpolation(consumption, co2, maf, speed);
    }
	
	// show legende on the map
    if(legend!=true){
        toggle_visibility('legende');
        legend = true;
    }
    else{
        toggle_visibility('legende');
        legend = true;
        toggle_visibility('legende');
    }
        
        
    //show visualisation button on the map (only when it isn't already active)
    if(button4 != true){
         toggle_visibility('visualisation');
        button4 = true;
    }else{
        toggle_visibility('visualisation');
        button4 = true;
        toggle_visibility('visualisation');
    }
        
    //show downloadbutton for the result of the interpolation on the map (only when it isn't already active)
    if(button5 != true){
        toggle_visibility('interpolationDownload');
        button5 = true;
    }else{
        toggle_visibility('interpolationDownload');
        button5 = true;
        toggle_visibility('interpolationDownload');
    }
	
	document.legendAttributs.interpolationAttribut[0].checked = true;
	checkVisualizationAttr();
}

// 1.2 IDW Interpolation
// Description: Compute Interpolation, Draw Points and start Line visualization
// Author: René Unrau
function idwInterpolation(consumption, co2, maf, speed){
		
	for(var i = 1; i < selection.length; i++){
		//Interpolate Consumption
		if(consumption){
			var firstsum = 0;
			var secondsum = 0;
			
			for(var j = 0; j < selection.length; j++){
				var value = selection[j].properties.phenomenons.Consumption.value;				
				
				var dist = Math.sqrt(Math.pow(interpolated.latitude[i-1] - selection[j].geometry.coordinates[1],2) + Math.pow(interpolated.longitude[i-1] - selection[j].geometry.coordinates[0],2));
				
				//  use measurement only if distance to interpolated point is not zero
				if(dist != 0){
					firstsum = firstsum + (value / dist);
				
					secondsum = secondsum + (1 / dist);
				}
			}
			
			interpolated.phenomenons.Consumption[i-1] = firstsum / secondsum;
		}else{
			interpolated.phenomenons.Consumption[i-1] = '-';
		}
		
		//Interpolate CO2
		if(co2){
			var firstsum = 0;
			var secondsum = 0;
			
			for(var j = 0; j < selection.length; j++){
				var value = selection[j].properties.phenomenons.CO2.value;
				var dist = Math.sqrt(Math.pow(interpolated.latitude[i-1] - selection[j].geometry.coordinates[1],2) + Math.pow(interpolated.longitude[i-1] - selection[j].geometry.coordinates[0],2));
				
				//  use measurement only if distance to interpolated point is not zero
				if(dist != 0){
					firstsum = firstsum + (value / dist);
				
					secondsum = secondsum + (1 / dist);
				}
			}
			
			interpolated.phenomenons.CO2[i-1] = firstsum / secondsum;
		}else{
			interpolated.phenomenons.CO2[i-1] = '-';
		}
		
		//Interpolate MAF
		if(maf){
			var firstsum = 0;
			var secondsum = 0;
			
			for(var j = 0; j < selection.length; j++){
				var value = selection[j].properties.phenomenons.MAF.value;
				var dist = Math.sqrt(Math.pow(interpolated.latitude[i-1] - selection[j].geometry.coordinates[1],2) + Math.pow(interpolated.longitude[i-1] - selection[j].geometry.coordinates[0],2));
				
				//  use measurement only if distance to interpolated point is not zero
				if(dist != 0){
					firstsum = firstsum + (value / dist);
				
					secondsum = secondsum + (1 / dist);
				}
			}
			
			interpolated.phenomenons.MAF[i-1] = firstsum / secondsum;
		}else{
			interpolated.phenomenons.MAF[i-1] = '-';
		}
		
		//Interpolate Speed
		if(speed){
			var firstsum = 0;
			var secondsum = 0;
			
			for(var j = 0; j < selection.length; j++){
				var value = selection[j].properties.phenomenons.Speed.value;
				var dist = Math.sqrt(Math.pow(interpolated.latitude[i-1] - selection[j].geometry.coordinates[1],2) + Math.pow(interpolated.longitude[i-1] - selection[j].geometry.coordinates[0],2));
				
				//  use measurement only if distance to interpolated point is not zero
				if(dist != 0){
					firstsum = firstsum + (value / dist);
				
					secondsum = secondsum + (1 / dist);
				}
			}
			
			interpolated.phenomenons.Speed[i-1] = firstsum / secondsum;
		}else{
			interpolated.phenomenons.Speed[i-1] = '-';
		}
		
		// Add interpolations to map
		interpolated.marker[i-1] = L.marker([interpolated.latitude[i-1], interpolated.longitude[i-1]], {icon: yellowDot});
		
		var container = $('<div/>');
		
		container.html('<html><table><tr><td><b>Speed</b></td><td>' + interpolated.phenomenons.Speed[i-1] + ' km/h</td></tr>' + 
			'<tr><td><b>CO2</b></td><td>' + interpolated.phenomenons.CO2[i-1] + ' g/s</td></tr>' + 
			'<tr><td><b>Consumption</b></td><td>' + interpolated.phenomenons.Consumption[i-1] + ' l/h</td></tr>' +
			'<tr><td><b>MAF</b></td><td>' + interpolated.phenomenons.MAF[i-1] + ' l/s</td></tr>' + 
			'</table></html>');
			
		// Insert the container into the popup
		interpolated.marker[i-1].bindPopup(container[0]);
	}
}


// 1.3 Kriging Interpolation
// Description: Compute Interpolation, Draw Points and start Line visualization
// Author: René Unrau
function krigingInterpolation(consumption, co2, maf, speed){
	
	// Kriging parameters, independent of target variables
	var model =  document.krigingParameters.krigingModel.value;	//'gaussian', 'exponential', 'spherical'
	var sigma2 =  parseInt(document.krigingParameters.SigmaTwo.value);		// 5
	var alpha =  document.krigingParameters.Alpha.value;					// 90
	
	var x = new Array();
	var y = new Array();
	
	
	// Create new Array from coordinates of selected Measurements
	for(var i = 0; i < selection.length; i++){
		x.push(selection[i].geometry.coordinates[1]);
		y.push(selection[i].geometry.coordinates[0]);
	}
	
	// Create empty variograms for kriging-interpolation
	var consumptionVariogram;
	var co2Variogram;
	var mafVariogram;
	var speedVariogram;
	
	
	// Define Kriging Parameters for all available target variables
	if(consumption){
		var consumptionValues = new Array();
		for(var i = 0; i < selection.length; i++){
			consumptionValues.push(selection[i].properties.phenomenons.Consumption.value);
		}
		consumptionVariogram = kriging.train(consumptionValues, x, y, model, sigma2, alpha);
	}
	
	if(co2){
		var co2Values = new Array();
		for(var i = 0; i < selection.length; i++){
			co2Values.push(selection[i].properties.phenomenons.CO2.value);
		}
		co2Variogram = kriging.train(co2Values, x, y, model, sigma2, alpha);
	}
	
	if(maf){
		var mafValues = new Array();
		for(var i = 0; i < selection.length; i++){
			mafValues.push(selection[i].properties.phenomenons.MAF.value);
		}
		mafVariogram = kriging.train(mafValues, x, y, model, sigma2, alpha);
	}
	
	if(speed){
		var speedValues = new Array();
		for(var i = 0; i < selection.length; i++){
			speedValues.push(selection[i].properties.phenomenons.Speed.value);
		}
		speedVariogram = kriging.train(speedValues, x, y, model, sigma2, alpha);
	}

	
	
	for(var i = 1; i < selection.length; i++){
		
		//Interpolate Consumption
		if(consumption){
			
			interpolated.phenomenons.Consumption[i-1] = kriging.predict(interpolated.latitude[i-1], interpolated.longitude[i-1], consumptionVariogram);
			
		}else{
			interpolated.phenomenons.Consumption[i-1] = '-';
		}
		
		//Interpolate CO2
		if(co2){
			
			interpolated.phenomenons.CO2[i-1] = kriging.predict(interpolated.latitude[i-1], interpolated.longitude[i-1], co2Variogram);
			
		}else{
			interpolated.phenomenons.CO2[i-1] = '-';
		}
		
		//Interpolate MAF
		if(maf){
			
			interpolated.phenomenons.MAF[i-1] = kriging.predict(interpolated.latitude[i-1], interpolated.longitude[i-1], mafVariogram);
			
		}else{
			interpolated.phenomenons.MAF[i-1] = '-';
		}
		
		//Interpolate Speed
		if(speed){
			
			interpolated.phenomenons.Speed[i-1] = kriging.predict(interpolated.latitude[i-1], interpolated.longitude[i-1], speedVariogram);
			
		}else{
			interpolated.phenomenons.Speed[i-1] = '-';
		}
		
		// Add interpolations to map
		interpolated.marker[i-1] = L.marker([interpolated.latitude[i-1], interpolated.longitude[i-1]], {icon: yellowDot});
		
		var container = $('<div/>');
		
		container.html('<html><table><tr><td><b>Speed</b></td><td>' + interpolated.phenomenons.Speed[i-1] + ' km/h</td></tr>' + 
			'<tr><td><b>CO2</b></td><td>' + interpolated.phenomenons.CO2[i-1] + ' g/s</td></tr>' + 
			'<tr><td><b>Consumption</b></td><td>' + interpolated.phenomenons.Consumption[i-1] + ' l/h</td></tr>' +
			'<tr><td><b>MAF</b></td><td>' + interpolated.phenomenons.MAF[i-1] + ' l/s</td></tr>' + 
			'</table></html>');
			
		// Insert the container into the popup
		interpolated.marker[i-1].bindPopup(container[0]);
        
       
	}
}

/****************************
	2. Visualize Interpolation
****************************/

// 2 Visualize Interpolation
// Description Draws colored line between measurements, based on selected attributes
// Author: René Unrau
function visualizeInterpolation(phenomenon){
	
	// Remove old InterpolationLines from Map
	for(var i = 0; i < interpolationLines.length; i++){
	
		mainMap.removeLayer(interpolationLines[i]);
	
	}

	// Compute steps for coloring
	max = getMax(phenomenon).value;
	min = getMin(phenomenon).value;
	firstFifth = min + ((max - min) * 0.20);
	secondFifth = min + ((max - min) * 0.40);
	thirdFifth = min + ((max - min) * 0.60);
	fourthFifth = min + ((max - min) * 0.80);
	
	
	// Prepare Legend on map
	if(phenomenon == 'IntConsumption'){
		document.getElementById('darkGreenValue').innerHTML = '< ' + Math.round(firstFifth*10000)/10000 + ' l/h';
		document.getElementById('greenValue').innerHTML = '< ' + Math.round(secondFifth*10000)/10000 + ' l/h';
		document.getElementById('yellowValue').innerHTML = '< ' + Math.round(thirdFifth*10000)/10000 + ' l/h';
		document.getElementById('orangeValue').innerHTML = '< ' + Math.round(fourthFifth*10000)/10000 + ' l/h';
		document.getElementById('redValue').innerHTML = '> ' + Math.round(fourthFifth*10000)/10000 + ' l/h';
	}else if(phenomenon == 'IntSpeed'){
		document.getElementById('darkGreenValue').innerHTML = '< ' + Math.round(firstFifth*10000)/10000 + ' km/h';
		document.getElementById('greenValue').innerHTML = '< ' + Math.round(secondFifth*10000)/10000 + ' km/h';
		document.getElementById('yellowValue').innerHTML = '< ' + Math.round(thirdFifth*10000)/10000 + ' km/h';
		document.getElementById('orangeValue').innerHTML = '< ' + Math.round(fourthFifth*10000)/10000 + ' km/h';
		document.getElementById('redValue').innerHTML = '> ' + Math.round(fourthFifth*10000)/10000 + ' km/h';
	}else if(phenomenon == 'IntCO2'){
		document.getElementById('darkGreenValue').innerHTML = '< ' + Math.round(firstFifth*10000)/10000 + ' g/s';
		document.getElementById('greenValue').innerHTML = '< ' + Math.round(secondFifth*10000)/10000 + ' g/s';
		document.getElementById('yellowValue').innerHTML = '< ' + Math.round(thirdFifth*10000)/10000 + ' g/s';
		document.getElementById('orangeValue').innerHTML = '< ' + Math.round(fourthFifth*10000)/10000 + ' g/s';
		document.getElementById('redValue').innerHTML = '> ' + Math.round(fourthFifth*10000)/10000 + ' g/s';
	}else if(phenomenon == 'IntMAF'){
		document.getElementById('darkGreenValue').innerHTML = '< ' + Math.round(firstFifth*10000)/10000 + ' l/s';
		document.getElementById('greenValue').innerHTML = '< ' + Math.round(secondFifth*10000)/10000 + ' l/s';
		document.getElementById('yellowValue').innerHTML = '< ' + Math.round(thirdFifth*10000)/10000 + ' l/s';
		document.getElementById('orangeValue').innerHTML = '< ' + Math.round(fourthFifth*10000)/10000 + ' l/s';
		document.getElementById('redValue').innerHTML = '> ' + Math.round(fourthFifth*10000)/10000 + ' l/s';
	}
	
	//Start drawing lines
	for(var i = 0; i < (selection.length-1); i++){
	
		// Compute Coordinates for current section
		var pointA = new L.LatLng(selection[i].geometry.coordinates[1],selection[i].geometry.coordinates[0]);
		var pointB = new L.LatLng(selection[i+1].geometry.coordinates[1],selection[i+1].geometry.coordinates[0]);
		var pointList = [pointA, pointB];
	
		// Choose phenomenon and draw line with corresponding color
		if(phenomenon == 'IntConsumption'){
	
			if(selection[i].properties.phenomenons.Consumption.value < firstFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#228b22'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.Consumption.value < secondFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#8cbc3e'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.Consumption.value < thirdFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#ffff00'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.Consumption.value < fourthFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#ffa500'}).addTo(mainMap);
				
			}else{
				interpolationLines[i] = L.polyline(pointList, {color: '#ff0000'}).addTo(mainMap);
			}
		
		}else if(phenomenon == 'IntSpeed'){
	
			if(selection[i].properties.phenomenons.Speed.value < firstFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#228b22'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.Speed.value < secondFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#8cbc3e'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.Speed.value < thirdFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#ffff00'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.Speed.value < fourthFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#ffa500'}).addTo(mainMap);
				
			}else{
				interpolationLines[i] = L.polyline(pointList, {color: '#ff0000'}).addTo(mainMap);
			}
		
		}else if(phenomenon == 'IntCO2'){
	
			if(selection[i].properties.phenomenons.CO2.value < firstFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#228b22'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.CO2.value < secondFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#8cbc3e'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.CO2.value < thirdFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#ffff00'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.CO2.value < fourthFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#ffa500'}).addTo(mainMap);
				
			}else{
				interpolationLines[i] = L.polyline(pointList, {color: '#ff0000'}).addTo(mainMap);
			}
		
		}else if(phenomenon == 'IntMAF'){
	
			if(selection[i].properties.phenomenons.MAF.value < firstFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#228b22'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.MAF.value < secondFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#8cbc3e'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.MAF.value < thirdFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#ffff00'}).addTo(mainMap);
				
			}else if(selection[i].properties.phenomenons.MAF.value < fourthFifth){
				interpolationLines[i] = L.polyline(pointList, {color: '#ffa500'}).addTo(mainMap);
				
			}else{
				interpolationLines[i] = L.polyline(pointList, {color: '#ff0000'}).addTo(mainMap);
			}
		
		}
	}
	
	for(var i = 0; i < interpolationLines.length; i++){
	
		mainMap.addLayer(interpolationLines[i]);
	}
	
	document.getElementById("intMeasurements").checked = false;
	document.getElementById("intPoints").checked = false;
	document.getElementById("intLines").checked = true;
}

/****************************
	3. Helper Functions
****************************/

// 3.1 Check Interpolation-Requirements
// Description: This function checks if a interpolation is allowed
// Author: René Unrau
function checkIntRequirements(consumption, co2, maf, speed){
	
	// Cancel if there are measurements in selection from more than one track
	if(!onlyOneTrack){
		var dialog = $('<p>Bitte wählen sie für eine Interpolation genau einen Track aus.</p>').dialog({
			modal: true,
            width:600,
            height:200,
            title: "Error 602",
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
		return false;
	}
	
	if(!consumption && !co2 && !maf && !speed){

		var dialog = $('<p>Der ausgewählte Track enthält keine Attribute die Interpoliert werden können.</p>').dialog({
			modal: true,
            width:600,
            height:200,
            title: "Error 603",
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
		return false;
	}

	return true;
}

// 3.2 Check visualization-attribute
// Looks for checkboxes and chooses Attribute to visualize
// Author: René Unrau
function checkVisualizationAttr(){

	var attribut = document.getElementsByName('legendAttributs').value;

	if(document.legendAttributs.interpolationAttribut[0].checked){
	
		if(!isNaN(interpolated.phenomenons.Speed[0])){
		
			visualizeInterpolation('IntSpeed');
		}else{
			var dialog = $('<p>Dieser Track enthält dieses Attribut nicht.</p>').dialog({
				modal: true,
                width:600,
                height:200,
                title: "Error 604: Geschwindigkeit",
				buttons: {
					"OK":  function() {dialog.dialog('close');}
				}
			});
			return;
		}
	}else if(document.legendAttributs.interpolationAttribut[1].checked){
		if(!isNaN(interpolated.phenomenons.CO2[0])){
		
			visualizeInterpolation('IntCO2');
		}else{
			var dialog = $('<p>Dieser Track enthält dieses Attribut nicht.</p>').dialog({
				modal: true,
                width:600,
                height:200,
                title: "Error 604: CO2",
				buttons: {
					"OK":  function() {dialog.dialog('close');}
				}
			});
			document.legendAttributs.interpolationAttribut[0].checked = true;
			checkVisualizationAttr();
		}
	}else if(document.legendAttributs.interpolationAttribut[2].checked){
		if(!isNaN(interpolated.phenomenons.Consumption[0])){
		
			visualizeInterpolation('IntConsumption');
		}else{
			var dialog = $('<p>Dieser Track enthält dieses Attribut nicht.</p>').dialog({
				modal: true,
                width:600,
                height:200,
                title: "Error 604: Spritverbrauch",
				buttons: {
					"OK":  function() {dialog.dialog('close');}
				}
			});
			document.legendAttributs.interpolationAttribut[0].checked = true;
			checkVisualizationAttr();
		}
	}else if(document.legendAttributs.interpolationAttribut[3].checked){
		if(!isNaN(interpolated.phenomenons.MAF[0])){
		
			visualizeInterpolation('IntMAF');
		}else{
			var dialog = $('<p>Dieser Track enthält dieses Attribut nicht.</p>').dialog({
				modal: true,
                width:600,
                height:200,
                title: "Error 604: MAF",
				buttons: {
					"OK":  function() {dialog.dialog('close');}
				}
			});
			document.legendAttributs.interpolationAttribut[0].checked = true;
			checkVisualizationAttr();
		}
	}
}


// 3.3 Compute coordinates for Interpolation
// Description: Compute Coordinates between selected measurements
// Author: René Unrau
function computeCoords(){

	for(var i = 1; i < selection.length; i++){
	
		// Create coordinates of new interpolated locations
		halfDifference = Math.abs(selection[i].geometry.coordinates[1] - selection[i-1].geometry.coordinates[1]) / 2;
		minimum = Math.min(selection[i].geometry.coordinates[1],selection[i-1].geometry.coordinates[1]);
	
		interpolated.latitude[i-1] = halfDifference + minimum;
		
		halfDifference = Math.abs(selection[i].geometry.coordinates[0] - selection[i-1].geometry.coordinates[0]) / 2;
		minimum = Math.min(selection[i].geometry.coordinates[0],selection[i-1].geometry.coordinates[0]);
	
		interpolated.longitude[i-1] = halfDifference + minimum;
	}
}

/****************************
	4. Visualization Control
****************************/

// 4.1 Switch interpolation line
// Description: turn draw/remove interpolation-line-layer
// Author: René Unrau
function switchIntLine(){

	if(!document.getElementById("intLines").checked){

		for(var i = 0; i < interpolationLines.length; i++){
	
			mainMap.removeLayer(interpolationLines[i]);
		}
	}else{
		
		for(var i = 0; i < interpolationLines.length; i++){
	
			mainMap.addLayer(interpolationLines[i]);
		}
	}
}


// 4.2 Switch interpolation measurements
// Description: turn draw/remove interpolation-measurements-layer
// Author: René Unrau
function switchIntMeasurements(){

	if(!document.getElementById("intMeasurements").checked){

		for(var i = 0; i < markers.length; i++){
	
			mainMap.removeLayer(markers[i]);
		}
	}else{
		
		for(var i = 0; i < markers.length; i++){
	
			mainMap.addLayer(markers[i]);
		}
	}
}


// 4.3 Switch interpolated points
// Description: turn draw/remove interpolated-points-layer
// Author: René Unrau
function switchIntPoints(){

	if(!document.getElementById("intPoints").checked){

		for(var i = 0; i < interpolated.marker.length; i++){
	
			mainMap.removeLayer(interpolated.marker[i]);
		}
	}else{
		
		for(var i = 0; i < interpolated.marker.length; i++){
	
			mainMap.addLayer(interpolated.marker[i]);
		}
	}
}