/********************************************************************************************
		Polygon
		
This file contains all functions needed for drawing, confirming and deleting a polygon
You will find functions that check wether a point is in the polygon or not.

********************************************************************************************
Content

1. Draw Polygon

2. Reset Polygon

3. Confirm Polygon

4. Center Polygon

*********************************************************************************************/


/***********************
	1. Draw Polygon
***********************/

// 1 Draw a polygon
// Description: function to draw a polygon on the map for selecting points insinde of the borders
// Author: Oliver Kosky
function drawPolygon(){
    
	// if there is already a polygon -> remove it from map
    if(mainMap.hasLayer(polygonLayer)){
        mainMap.removeLayer(polygonLayer);
    }
    polygon = new L.Draw.Polygon(mainMap, drawControl.options.polygon);
    polygon.enable();
}

/***********************
	2. Reset Polygon
***********************/

// 2 Reset polygon
// Description: Delete polygon layer from map
// Author: Oliver Kosky
function resetPolygon(){

	// If not closed -> delete unfinished Polygon
	if(polygonLayer == undefined){
		polygon.disable();
	// If closed -> delete completed Polygon
	}else{
		mainMap.removeLayer(polygonLayer);
	}
	
	//Remove all completed (maybe not visible) polygons
	polygonLayer = null;
	
	// Allow user to draw new polygon
	polygon = new L.Draw.Polygon(mainMap, drawControl.options.polygon);
	polygon.enable();
}

/***********************
	3. Confirm Polygon
***********************/

// 3 Confirm the Polygon Selection
// Description: Confirm Polygon and check for measurements
// Author: Rene Unrau, Oliver Kosky
function confirmPolygon(){

	// Check if Polygon is closed
	if(polygonLayer == undefined){
		var dialog = $('<p>Bitte zeichnen Sie zuerst ein geschlossenes Polygon.</p>').dialog({
			modal: true,
            width:600,
            title: "Error 202",
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
		return;
	}
	
	// get all corners for algorithm
	var polygonCorners = polygonLayer.getLatLngs();
	
	duplicate = false;
	
    polygon.disable;
	centerPolygon(polygonCorners);
	//For each measurement in current map-bounds check if polaygon contains it
	for(var i = 0; i < currentMeasurements.length; i++){
	
		//Check if it is in Polygon
		var oddNodes = false;
		k = polygonCorners.length - 1;
		for(var j = 0; j < polygonCorners.length; j++){
		
			if(polygonCorners[j].lat < currentMeasurements[i].geometry.coordinates[1] && polygonCorners[k].lat >= currentMeasurements[i].geometry.coordinates[1] ||
				polygonCorners[k].lat < currentMeasurements[i].geometry.coordinates[1] && polygonCorners[j].lat >= currentMeasurements[i].geometry.coordinates[1]){
				if(polygonCorners[j].lng + (currentMeasurements[i].geometry.coordinates[1] - polygonCorners[j].lat) / (polygonCorners[k].lat - polygonCorners[j].lat) * (polygonCorners[k].lng - polygonCorners[j].lng) < currentMeasurements[i].geometry.coordinates[0]){
					if(oddNodes){oddNodes = false;}
					else{oddNodes = true;}
				}
			}
		
		k = j;
		}
		if(oddNodes){
			duplicate = addSinglePoint(currentMeasurements[i]);
		}
	
	}
	
	// Check if there were already some points in selction -> throw warning
	if(!duplicate){
	
		$('#infodialog').html('Punkte wurden hinzugef&uuml;gt.');
		$('#infodialog').dialog({
			width: 300,
			autoOpen: true,   
			modal: true, 
			open: function(event, ui) { 
				setTimeout(function(){ 
				$('#infodialog').dialog('close'); }, 500); 
			} 
		});
		
	}else{
	
		$('#infodialog3').html('Die ausgew&auml;hlten Punkte wurden hinzugef&uuml;gt. Einige Punkte befinden sich bereits in Ihrer Auswahl und wurde deshalb nicht erneut hinzugef&uuml;gt.');
		$('#infodialog3').dialog({ 
			width: 600,
			autoOpen: true,
            title: "Error 203",
			open: function(event, ui) { 
				setTimeout(function(){ 
				$('#infodialog3').dialog('close'); }, 5000); 
			} 
		});
	}
	
	// delete polygon from map
    mainMap.removeLayer(polygonLayer);
    
	// disable tool
    polygonSelection = false;
    colorize('choosePolygon');
    toggle_visibility('drawingPolygon');
}


/***********************
	4 Center Polygon
***********************/

// 4 Center Polygon
// Description: Center map-view on polygon
// Author: Johanna Moellmann
function centerPolygon(polygonCorners){

	// get polygon corners
	var xmin = polygonCorners[0].lat;
	var xmax = polygonCorners[0].lat;
	var ymin = polygonCorners[0].lng;
	var ymax = polygonCorners[0].lng;
	var cornerNr = polygonCorners.length;
	
	for (var i = 1;  cornerNr > i ; i++) {
		var point = polygonCorners[i];
		var xnew = parseFloat(polygonCorners[i].lat);
		var ynew = parseFloat(polygonCorners[i].lng);
		if (xnew < xmin){
			xmin = xnew;
		}
		if (xnew > xmax){
			xmax = xnew;
		}
		if (ynew < ymin){
			ymin = ynew;
		}
		if (ynew > ymax){
			ymax = ynew;
		} 
	}
	
	var southWest = L.latLng(xmin, ymin),  northEast = L.latLng(xmax, ymax);
	var bounds = L.latLngBounds(southWest, northEast);
	
	// set map-bounds
	mainMap.fitBounds(bounds);
}