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
	
2. Filter
	2.1 Start Filter
	2.2 Reset Filter
	
3. Reset Visualization
	3.1 Reset Track Visualization
	3.2 Reset All Visualizations

4. Set Maximal Measurements

*********************************************************************************************/


/***********************
	1. Choose Selection
***********************/

// 1.1 Single Point-Selection 
// Description: User wants to add measurement for analysis by clicking on a single point on the map
<<<<<<< HEAD
<<<<<<< HEAD
// Authors: Rene Unrau & Nicholas Schiestel
=======
// Authors: René Unrau & Nicholas Schiestel
>>>>>>> FETCH_HEAD
=======
// Authors: René Unrau & Nicholas Schiestel
>>>>>>> FETCH_HEAD
function chooseSingleSelection(id) {
    
    // check if trackSelection or polygonSelection
    if(trackSelection || polygonSelection){
<<<<<<< HEAD
<<<<<<< HEAD
        alert("Es ist noch ein anderes Werkzeug aktiv, bitte schlie�en Sie dieses zuerst.");
=======
=======
>>>>>>> FETCH_HEAD
		var dialog = $('<p>Es ist noch ein anderes Werkzeug aktiv, bitte schließen Sie dieses zuerst.</p>').dialog({
			modal: true,
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
        
<<<<<<< HEAD
>>>>>>> FETCH_HEAD
=======
>>>>>>> FETCH_HEAD
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
<<<<<<< HEAD
<<<<<<< HEAD
// Authors: Rene Unrau & Nicholas Schiestel
=======
// Authors: René Unrau & Nicholas Schiestel
>>>>>>> FETCH_HEAD
=======
// Authors: René Unrau & Nicholas Schiestel
>>>>>>> FETCH_HEAD
function chooseTrackSelection() {
    
    // check if singlePointSelection or polygonSelection is active
    if(singlePointSelection || polygonSelection){
<<<<<<< HEAD
<<<<<<< HEAD
        alert("Es ist noch ein anderes Werkzeug aktiv, bitte schlie�en Sie dieses zuerst.");
=======
=======
>>>>>>> FETCH_HEAD
		var dialog = $('<p>Es ist noch ein anderes Werkzeug aktiv, bitte schließen Sie dieses zuerst.</p>').dialog({
			modal: true,
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});
        
<<<<<<< HEAD
>>>>>>> FETCH_HEAD
=======
>>>>>>> FETCH_HEAD
    }
    
    // if no other selcetionmode is active, then continue with singlePointSelection
    else {
        if(trackSelection){
            trackSelection = false;
            colorize('chooseTrack');
            toggle_visibility('selectTrack');
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
// Authors: Rene Unrau, Johanna, Oli K. & Nicholas Schiestel
function choosePolygonSelection() {
    
    // check if singlePointSelection or trackSelection is active
    if(singlePointSelection || trackSelection){
<<<<<<< HEAD
<<<<<<< HEAD
        alert("Es ist noch ein anderes Werkzeug aktiv, bitte schlie�en Sie dieses zuerst.");
=======
=======
>>>>>>> FETCH_HEAD
		var dialog = $('<p>Es ist noch ein anderes Werkzeug aktiv, bitte schließen Sie dieses zuerst.</p>').dialog({
			modal: true,
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
		});

<<<<<<< HEAD
>>>>>>> FETCH_HEAD
=======
>>>>>>> FETCH_HEAD
    }
    
    // if no other selcetionmode is active, then continue with polygonSelection
    else {
        if(polygonSelection){
            polygonSelection = false;
            colorize('choosePolygon');
            toggle_visibility('drawingPolygon');
            polygon.disable();
            mainMap.removeLayer(polygonLayer);
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
	2. Filter
***********************/

// 2.1 Start Filter
// Description: Start the filter if button 'OK' is pressed 
// Author: Christian Peters
function startFilter() {
    startForm = document.filterFormular.Start.value;
    endForm = document.filterFormular.Ende.value;
    typForm = document.filterFormular.Typ.value;
    sensorForm = document.filterFormular.Sensor_ID.value;
    
    drawMeasurements();
}


// 2.2 Reset Filter
// Description: Reset the filter to update the measurements
// Author: Christian Peters
function resetFilter() {
    document.filterFormular.Start.value = "";
    document.filterFormular.Ende.value = "";
    document.filterFormular.Typ.value = "";
    document.filterFormular.Sensor_ID.value = "";
    
    startFilter();
}


/***********************
	3. Reset Visualizations
***********************/

// 3.1 Reset Track Visualization
// Description: Deletes Track and draws standard measurements
<<<<<<< HEAD
<<<<<<< HEAD
// Authors: Rene Unrau & Nicholas Schiestel
=======
// Authors: René Unrau & Nicholas Schiestel
>>>>>>> FETCH_HEAD
=======
// Authors: René Unrau & Nicholas Schiestel
>>>>>>> FETCH_HEAD
function resetTrackSelection(){
	mainMap.removeLayer(trackLine);
	for(var i = 0; i < markers.length; i++) {
		mainMap.removeLayer(markers[i]);	
	}
	drawMeasurements();
	document.getElementById('Track_ID').value = '';
	mainMap.on('moveend', drawMeasurements);
    
    
    //reset and hide visualisation button on the map
    toggle_visibility('visualisation');
    button4 = false;
    
    //reset and hide the download button, if it is active
    if(button5==true){
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

// 3.2 Reset all Visualizations
// Description: Resets all visualizations and return to normal mode
<<<<<<< HEAD
<<<<<<< HEAD
// Author: Rene Unrau
=======
// Author: René Unrau
>>>>>>> FETCH_HEAD
=======
// Author: René Unrau
>>>>>>> FETCH_HEAD
function resetVisualization(){
	
	if(document.getElementById("intLines").checked){
		for(var i = 0; i < interpolationLines.length; i++){
			mainMap.removeLayer(interpolationLines[i]);
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
	
	resetTrackSelection();
	drawMeasurements();
}

/***********************
	4. Set Maximum Measurements
***********************/

// 4 Set Maximum Measurements
// Description: Sets the maximum amount of measurements drawn at once
<<<<<<< HEAD
<<<<<<< HEAD
// Author: Rene Unrau
=======
// Author: René Unrau
>>>>>>> FETCH_HEAD
=======
// Author: René Unrau
>>>>>>> FETCH_HEAD
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
	}
	
    drawMeasurements();
}