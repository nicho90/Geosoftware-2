/********************************************************************************************
		Control
		
This file contains all functions needed for interaction with our provided tools.
You will find functions for activating functions and their influence on map interactions.
There are also some functions that control the visulization of our tools.

********************************************************************************************
Content

1. Choose Selection
	1.1 Single Point Selection
	1.2 Track Selection
	1.3 Polygon Selection
	1.4 Selectionbuttons Visualization
	
2. Reset Visualization
	2.1 Reset All Visualizations
	2.2 Reset Visualisation-Buttons + Legend

3. Set Maximal Measurements

*********************************************************************************************/


/***********************
	1. Choose Selection
***********************/

// 1.1 Single Point-Selection 
// Description: User wants to add measurement for analysis by clicking on a single point on the map
// Authors: René Unrau & Nicholas Schiestel

function chooseSingleSelection(id) {
    
    // check if trackSelection or polygonSelection
    if(trackSelection || polygonSelection){
		var dialog = $('<p>Es ist noch ein anderes Werkzeug aktiv, bitte schlie&szlig;en Sie dieses zuerst.</p>').dialog({
			modal: true,
            width:600,
            title: "Error 201",
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
    }
    
    // if no other Selcetionmode is active, then continue with singlePointSelection
    else {
        if(singlePointSelection){
		    singlePointSelection = false;
            colorize('chooseSinglePoint');   
        }
        else {
            singlePointSelection = true;
            colorize('chooseSinglePoint');
        } 
    }	
}



// 1.2 Track Selection
// Description: A user can search for a track-ID and select this track and visualize this track on the map
// Authors: René Unrau & Nicholas Schiestel

function chooseTrackSelection() {  
    // check if singlePointSelection or polygonSelection is active
    if(singlePointSelection || polygonSelection){
		var dialog = $('<p>Es ist noch ein anderes Werkzeug aktiv, bitte schlie&szlig;en Sie dieses zuerst.</p>').dialog({
			modal: true,
            width:600,
            title: "Error 201",
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
}
    
    // if no other selcetionmode is active, then continue with singlePointSelection
    else {
        if(trackSelection){
            trackSelection = false;
            colorize('chooseTrack');
            toggle_visibility('selectTrack');
			document.getElementById('Track_ID').value = '';
        }
        else {
            trackSelection = true;
            colorize('chooseTrack');
            toggle_visibility('selectTrack');
        }
    }
}

// 1.3 Polygon Selection 
// Description: User wants to add measurements by drawing a polygon on the map
// Authors: René Unrau, Johanna, Oli K. & Nicholas Schiestel
function choosePolygonSelection() {
    
    // check if singlePointSelection or trackSelection is active
    if(singlePointSelection || trackSelection){
		var dialog = $('<p>Es ist noch ein anderes Werkzeug aktiv, bitte schlie&szlig;en Sie dieses zuerst.</p>').dialog({
			modal: true,
            width:600,
            title: "Error 201",
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
    }
    
    // if no other selectionmode is active, then continue with polygonSelection
    else {
        if(polygonSelection){
            polygonSelection = false;
            colorize('choosePolygon');
            toggle_visibility('drawingPolygon');
            polygon.disable();
			
			// Clear polygon-tool and all possible (and maybe not visible) Polygons from map
			polygon.disable();
			if(polygonLayer != null || polygonLayer != undefined){
				mainMap.removeLayer(polygonLayer);
				polygonLayer = null;
			}
        }
        else {
            polygonSelection = true;
            colorize('choosePolygon');
            toggle_visibility('drawingPolygon');
            drawPolygon();
        }
    }
}


// 1.4 Selectionsbuttons Visualization
// Selectionsbuttons change their color from green to orange, if they are active
// Author: Nicholas Schiestel

function colorize(button) {
    // for singlePointSelection
    if(button == 'chooseSinglePoint'){
        if(button1 == false) {
            var li = document.getElementById(button);
            var atag = li.getElementsByTagName('a');
            for (var i = 0; i<atag.length; i++) {
                atag[i].style.border="3px solid rgb(255,165,0)";
            }
            button1=true;
        }
        else {
            var li = document.getElementById(button);
            var atag = li.getElementsByTagName('a');
            for (var i = 0; i<atag.length; i++) {
                atag[i].style.border="3px solid rgb(140,188,62)";
            }
            button1=false;
        }
    }
    
    else {
        // for trackSelection
        if(button == 'chooseTrack'){
            if(button2 == false) {
                var li = document.getElementById(button);
                var atag = li.getElementsByTagName('a');
                for (var i = 0; i<atag.length; i++) {
                    atag[i].style.border="3px solid rgb(255,165,0)";
                }
                button2=true;
            }
            else {
                var li = document.getElementById(button);
                var atag = li.getElementsByTagName('a');
                for (var i = 0; i<atag.length; i++) {
                    atag[i].style.border="3px solid rgb(140,188,62)";
                }
                button2=false;
            }
        } 
        else {
            // for polygonSelection
            if(button == 'choosePolygon'){
                if(button3 == false) {
                    var li = document.getElementById(button);
                    var atag = li.getElementsByTagName('a');
                    for (var i = 0; i<atag.length; i++) {
                        atag[i].style.border="3px solid rgb(255,165,0)";
                    }
                    button3=true;
                }
                else {
                    var li = document.getElementById(button);
                    var atag = li.getElementsByTagName('a');
                    for (var i = 0; i<atag.length; i++) {
                        atag[i].style.border="3px solid rgb(140,188,62)";
                    }
                    button3=false;
                }
            }
            else {
				var dialog = $('<p>Error! Es ist kein Auswahlwerkzeug aktiv.</p>').dialog({
					modal: true,
					buttons: {
						"OK":  function() {dialog.dialog('close');}
					}
				});
            }
        } 
    }
}


/***********************
	2. Reset Visualizations
***********************/

// 2.1 Reset all Visualizations
// Description: Resets all visualizations and return to normal mode
// Author: René Unrau

function resetVisualization(){

	if(trackLine != undefined){
		mainMap.removeLayer(trackLine);
	}
	
	if(document.getElementById("intLines").checked){
		for(var i = 0; i < interpolationLines.length; i++){
			mainMap.removeLayer(interpolationLines[i]);
		}
	}
	
	if(markers.length > 0){
		for(var i = 0; i < markers.length; i++) {
			mainMap.removeLayer(markers[i]);	
		}
	}
	
	if(document.getElementById("intMeasurements").checked){
		for(var i = 0; i < markers.length; i++){
			mainMap.removeLayer(markers[i]);
		}
	}
	
	if(document.getElementById("intPoints").checked){
		for(var i = 0; i < interpolated.marker.length; i++){
			mainMap.removeLayer(interpolated.marker[i]);
		}
	}
	
	document.getElementById('Track_ID').value = '';
	
	resetVisButtons();
	
	drawMeasurements();
    
    visualizationActive = false;
	
	mainMap.on('moveend', drawMeasurements);
}

// 2.2 Reset all Visualizations-Buttons + Legend
// Description: Resets all visualizations-buttons
// Author: René Unrau

function resetVisButtons(){

	//reset and hide visualisation button on the map
	if(button4){
		toggle_visibility('visualisation');
		button4 = false;
	}
    
    //reset and hide the download button, if it is active
    if(button5){
        toggle_visibility('interpolationDownload');
        button5 = false;
    }
    else{
        toggle_visibility('interpolationDownload');
        button5 = false;
        toggle_visibility('interpolationDownload');   
    }
    
    //reset and hide the legend, if it is active
    if(legend==true){
        toggle_visibility('legende');
        legend = false;
    }
    else{
        toggle_visibility('legende');
        legend = false;
        toggle_visibility('legende');   
    }
}


/***********************
	3. Set Maximum Measurements
***********************/

// 3 Set Maximum Measurements
// Description: Sets the maximum amount of measurements drawn at once
// Author: René Unrau

function setMaxMeas(){

	var e = document.getElementById("measurementNumber");
	if(e.options[e.selectedIndex].value == '100'){
		maxMeas = 1;
	}else if(e.options[e.selectedIndex].value == '200'){
		maxMeas = 2;
	}else if(e.options[e.selectedIndex].value == '300'){
		maxMeas = 3;
	}else if(e.options[e.selectedIndex].value == '400'){
		maxMeas = 4;
	}else if(e.options[e.selectedIndex].value == '500'){
		maxMeas = 5;
	}else if(e.options[e.selectedIndex].value == '600'){
		maxMeas = 6;
	}else if(e.options[e.selectedIndex].value == '700'){
		maxMeas = 7;
	}else if(e.options[e.selectedIndex].value == '800'){
		maxMeas = 8;
	}else if(e.options[e.selectedIndex].value == '900'){
		maxMeas = 9;
	}else if(e.options[e.selectedIndex].value == '1000'){
		maxMeas = 10;
	}else if(e.options[e.selectedIndex].value == '2000'){
		maxMeas = 20;
	}else if(e.options[e.selectedIndex].value == '3000'){
		maxMeas = 30;
	}else if(e.options[e.selectedIndex].value == '4000'){
		maxMeas = 40;
	}else if(e.options[e.selectedIndex].value == '5000'){
		maxMeas = 50;
	}else if(e.options[e.selectedIndex].value == '6000'){
		maxMeas = 60;
	}else if(e.options[e.selectedIndex].value == '7000'){
		maxMeas = 70;
	}else if(e.options[e.selectedIndex].value == '8000'){
		maxMeas = 80;
	}else if(e.options[e.selectedIndex].value == '9000'){
		maxMeas = 90;
	}else if(e.options[e.selectedIndex].value == '10000'){
		maxMeas = 100;    
	}
    
	
    drawMeasurements();
}