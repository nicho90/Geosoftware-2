/********************************************************************************************
		Polygon
		
This file contains all functions needed for drawing, confirming and deleting a polygon
You will find functions that check wether a point is in the polygon or not.

********************************************************************************************
Content

1. Draw Polygon

2. Delete Polygon

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
    
        if(mainMap.hasLayer(polygonLayer)){
            mainMap.removeLayer(polygonLayer);
        }
        polygon = new L.Draw.Polygon(mainMap, drawControl.options.polygon);
        polygon.enable();
}

/***********************
	2. Delete Polygon
***********************/

// 2 Delete polygon
// Description: Delete polygon layer from map
// Author: Oliver Kosky
function deletePolygon(){
    mainMap.removeLayer(polygonLayer);
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
            height:200,
            width:600,
            title: "Error 202",
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
		return;
	}
	
	var polygonCorners = polygonLayer.getLatLngs();
	
	duplicate = false;
	
    polygon.disable;
	centerPolygon(polygonCorners);
	//For each measurement in current map-bounds
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
	
	//Open and Close info-popup
	//Authors: Nicholas Schiestel and Johanna Moellmann
	if(!duplicate){
	
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
		
	}else{
	
		$('#infodialog').html('Die ausgew&auml;hlten Punkte wurden hinzugef&uuml;gt. Einige Punkte befinden sich bereits in Ihrer Auswahl und wurde deshalb nicht erneut hinzugef&uuml;gt.');
		$('#infodialog').dialog({ 
			height: 160,
			width: 400,
			autoOpen: true,   
			modal: true,
            title: "Error 203",
			open: function(event, ui) { 
				setTimeout(function(){ 
				$('#infodialog').dialog('close'); }, 5000); 
			} 
		});
	}
	
    mainMap.removeLayer(polygonLayer);
       
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
	mainMap.fitBounds(bounds);
	
}