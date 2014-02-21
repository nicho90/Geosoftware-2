/***********************
	Global variables
***********************/
var mainMap;

// Maximum amount of measurements drawn at once (Counted in Pages of 100 measurements)
var maxMeas;

var markers = new Array();
var currentMeasurements = new Array();

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

// Dialog-box for the table of the measurements
var dialogTable;

// Current Frequency of Manufacturer in Selection
var manufacturerSelection = new Array();

// "manufacturerSelection" -> splitted up
var manufacturerNames = new Array();
var manufacturerFrequency = new Array();

//If true, user adds points to selection by clicking on them
var singlePointSelection = false;

//If true, user searches for tracks and select them
var trackSelection = false;

//If true, user searches for tracks and select them
var polygonSelection = false;

// If true: Selection contains measurements of exact one track
var onlyOneTrack = false;

// Activity of the selectionsbuttons 
var button1 = false;
var button2 = false;
var button3 = false;

// Activity of the visualisation button
var button4 = false;

// Activity of the download button
var button5 = false;

// Activity of the legende
var legend = false;

// Polyline of currently selected track
var trackLine;

// Marker-Array of interpolated points
var interpolated;

// Array of Line Segments between Measurements after Interpolation
var interpolationLines = new Array();

//If true measurements are not loaded with next movement in map
var doNotLoad = false;

// Visualisation of the points
var redDot = L.icon({iconUrl: 'images/dots/redDot.png'});

var greenDot = L.icon({iconUrl: 'images/dots/greenDot.png'});

var blueDot = L.icon({iconUrl: 'images/dots/blueDot.png'});

var yellowDot = L.icon({iconUrl: 'images/dots/yellowDot.png'});


/***********************
	Event register
***********************/
window.onload = function() {
	document.getElementById('interpolationMethod')[0].checked = true;
	document.legendAttributs.interpolationAttribut[0].checked = true;
	drawMap();
	setMaxMeas();
	mainMap.on('moveend', drawMeasurements);
}


/***********************
	Functions
***********************/

/**********************************************

    Initial Functions
    
    1	drawMap
    2	drawMeasurements
    
**********************************************/

// Draw MainMap
// Description: Initializes main map and navigation-elements
// Author: René Unrau
function drawMap() {
	// create a map in the "map" div, set the view to a given place and zoom
	

    var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
	var google = new L.Google('SATELLITE');
   
    //add DTK10, a topographic map of NRW, coloured
    var DTK10 = L.tileLayer.wms('http://www.wms.nrw.de/geobasis/wms_nw_dtk10', {
     attribution: '| &copy Geobasis NRW 2013',
	layers: 'nw_dtk10_pan,nw_dtk10_res,NW_DTK10_col,WMS_NW_DTK10',
    format: 'image/png'
});
    
    //add DTK10, panchromatic
    var DTK10_panchromatic=L.tileLayer.wms('http://www.wms.nrw.de/geobasis/wms_nw_dtk10',{
   attribution: '| &copy Geobasis NRW 2013',
	layers: 'NW_DTK10_pan',
    format: 'image/png'
});
    
    var topo = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        minZoom: 5,
        maxZoom: 15
    });
	  

	var layer = {
		"OpenStreetMap": osm,
        "OpenTopoMap":topo,
        "DTK10 (NRW)": DTK10,
        "DTK10 (NRW) panchromatisch ": DTK10_panchromatic,
        "Google Maps (Satellite)": google
        
	};
	  
	var map = L.map('map', {
		center: new L.LatLng(51.96, 7.62),
		zoom: 15,
		layers: [osm]
	});
    
    
    //adds zoomListener to ensure a map is displayed in case the zoom level is too 
    //low for DTK10 or DTK10_panchromatic layers
    
    map.on('zoomend', onZoomend);
    
    function onZoomend(){
        
        //old code:
        
      /*  //if osm-layer is selected check, whether a DTK10 or DTK10_panchromatic
        //is selected as well. Is this the case, the map zoomed out too far
        //for these two and the osm-layer has been displayed instead.
        //Since we enter DTK10's and DTK10_panchromatic's bounds again, the osm layer
        //can be removed
        //Note: DTK10 and DTK10_panchromatic disappear if zoom level is below 14
        //OpenTopomap works within zoom level 5 to 15 only
        if(map.hasLayer(osm)){
            
            if(map.getZoom()>=14&&(map.hasLayer(DTK10) ||   map.hasLayer(DTK10_panchromatic))){
                map.removeLayer(osm);
            }
        }
        
        //maps has DTK10 or DTK10_panchromatic and is about to leave their bounds
        //Thus, the osm-layer is selected and displayed instead.
        else{           
            if(map.getZoom()<14&&(map.hasLayer(DTK10) ||   map.hasLayer(DTK10_panchromatic))){
                map.addLayer(osm);
            }
        }*/
        if(map.hasLayer(topo)) {
            if(map.getZoom()<=5) 
                map.setZoom(5);
            if(map.getZoom()>=15)
                map.setZoom(15);
        }
        
        if(map.hasLayer(DTK10)||map.hasLayer(DTK10_panchromatic)){
            if(map.getZoom()<14)
                map.setZoom(14);
        
    }
    }
    
    //adds listener being fired while baselayer is changed
    //ensures that if DTK10, DTK10_panchromatic or openTopoMap are chosen the maps are not out of zoom bounds
    //and thus can be displayed
    map.on('baselayerchange', onBaseLayerChange);
    
    function onBaseLayerChange(){
        if(map.hasLayer(topo)) {
            if(map.getZoom()<=5) 
                map.setZoom(5);
            if(map.getZoom()>=15)
                map.setZoom(15);
        }
        
        if(map.hasLayer(DTK10)||map.hasLayer(DTK10_panchromatic)){
            if(map.getZoom()<14)
                map.setZoom(14);
    }
    }
    
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
        map.panBy([-300, 0]);
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
	
    
    
	// Locate me - function 
	// map pans to current position of the user and sets a marker
	// Author: Johanna Möllmann
	document.getElementById('locateMe').onclick = function() {
       function handler(locateme){
           var longitude = locateme.coords.longitude;
           var latitude = locateme.coords.latitude;
           map.panTo(new L.LatLng(latitude, longitude));
           var markerIcon = L.divIcon({ className: 'locationIcon',
                                        html: '<div class=pin bounce></div><div class=pulse></div>'
                                      });
           var location = L.marker([latitude, longitude],{icon: markerIcon}).addTo(map).bindPopup("Ihre Position: " + longitude + ", " + latitude);
       }
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
	currentMeasurements = new Array();
	markers = new Array();
	
	for(var i = 0; i < maxMeas; i++){
	
		jQuery.ajax({
			async : false,
			url: "https://envirocar.org/api/stable/rest/measurements?bbox=" + swLng + "," + swLat + "," + neLng + "," + neLat + "&limit=100&page=" + i,
			success: function(result){
				
				for(var j = 0; j < result.features.length; j++){
					currentMeasurements.push(result.features[j]);
				}
			}
		});
	}
		
	$.each(currentMeasurements, function(i, measurement){
	
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
		
		var marker;
		var found = false;
		
		//Check if Measurement is already in selection
		for(var j = 0; j < selection.length; j++){
		
			// If measurement was already selected:
			if(selection[j].properties.id == measurement.properties.id){
				var propertiesID = selection[j].properties.id;
			
				marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {icon: blueDot});
		
				var container = $('<div/>');
					container.on('click', '#centerPoint', function() {
					doNotLoad = true;
					mainMap.setView([geometry.coordinates[1], geometry.coordinates[0]],18);
				});
			
				container.on('click', '#showTrack', function() {
					doNotLoad = true;
					mainMap.setView([geometry.coordinates[1], geometry.coordinates[0]],18);
					showTrack(propertiesID);
				});
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
		
				//Do not load measurements if marker is clicked
				marker.on('click', function(){
					doNotLoad = true;
					if(singlePointSelection) {
						mainMap.closePopup();
						var dialog = $('<p>Möchten sie diesen Punkt von der Auswahl entfernen?</p>').dialog({
							buttons: {
								"Ja": function() {deleteSingleMeasurement(measurement.properties.id);dialog.dialog('close');},
								"Nein":  function() {dialog.dialog('close');}
							}
						});	
					}
				});
			
			found = true;
			}
		}
			
		if(!found){
	
			marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {icon: redDot});
		
			var container = $('<div/>');
				container.on('click', '#centerPoint', function() {
				doNotLoad = true;
				mainMap.setView([geometry.coordinates[1], geometry.coordinates[0]],18);
			});
			
			container.on('click', '#showTrack', function() {
			    mainMap.setView([geometry.coordinates[1], geometry.coordinates[0]],18);
				showTrack(properties.id);
			});
			
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
			
			//Do not load measurements if marker is clicked
			marker.on('click', function(){
				doNotLoad = true;
				if(singlePointSelection) {
					mainMap.closePopup();
					addSinglePoint(measurement);
				}
			});
		}
		
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
				
			}else if(year > filtStartYear) {
				
			}else {
			
				if(month < filtStartMonth) {
				
					markers.pop();
					isDeleted = true;
					
				}else if(month > filtStartMonth) {
				
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
			if(cartype.toLowerCase().indexOf(filtTyp.toLowerCase()) == -1) {
			
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
			
	});
		
	for(var i = 0; i < markers.length; i++) {
		mainMap.addLayer(markers[i]);
	}
}



/**********************************************

    Selectionoptions in Sidebar
    
    1) chooseSinglePointSelection
    2) chooseTrackSelection
    3) choosePolygonSelection
    3.1) Draw a polygon
    3.2) Delete a polygon
    3.3) Confirm the polygon selection
	3.4) Center Polygon
    
**********************************************/

// 1) Single Point-Selection 
// Description: User wants to add measurement for analysis by clicking on a single point on the map
// Authors: René Unrau & Nicholas Schiestel
function chooseSingleSelection(id) {
    
    // check if trackSelection or polygonSelection
    if(trackSelection || polygonSelection){
        alert("Es ist noch ein anderes Werkzeug aktiv, bitte schließen Sie dieses zuerst.");
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



// 2) Track Selection
// Description: A user can search for a track-ID and select this track and visualize this track on the map
// Authors: René Unrau & Nicholas Schiestel
function chooseTrackSelection() {
    
    // check if singlePointSelection or polygonSelection is active
    if(singlePointSelection || polygonSelection){
        alert("Es ist noch ein anderes Werkzeug aktiv, bitte schließen Sie dieses zuerst.");
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
            var trackID = document.getElementById('Track_ID').value;
            visualizeTrack(trackID);
        }
    }
}



// 3) Polygon Selection 
// Description: User wants to add measurements by drawing a polygon on the map
// Authors: René Unrau, Johanna, Oli K. & Nicholas Schiestel
function choosePolygonSelection() {
    
    // check if singlePointSelection or trackSelection is active
    if(singlePointSelection || trackSelection){
        alert("Es ist noch ein anderes Werkzeug aktiv, bitte schließen Sie dieses zuerst.");
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

// 3.1) Draw a polygon
// Description: function to draw a polygon on the map for selecting points insinde of the borders
// Author: Oliver Kosky
function drawPolygon(){
    
        if(mainMap.hasLayer(polygonLayer)){
            mainMap.removeLayer(polygonLayer);
        }
        polygon = new L.Draw.Polygon(mainMap, drawControl.options.polygon);
        polygon.enable();
}


// 3.2) Delete a polygon layer
// Author: ?? 
function deletePolygon(){
    mainMap.removeLayer(polygonLayer);
}


// 3.3) Confirm the Polygon Selection
// Confirm Polygon and check for measurements
// Author: Rene Unrau, Oliver Kosky
function confirmPolygon(){

	// Check if Polygon is closed
	if(polygonLayer == undefined){
		alert('Bitte zeichnen sie zuerst ein geschlossenes Polygon');
		return;
	}
	
	var polygonCorners = polygonLayer.getLatLngs();
	
	duplicate = false;
	
    polygon.disable;
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
	centerPolygon(polygonCorners);
	
	//Open and Close info-popup
	//Authors: Nicholas Schiestel and Johanna Möllmann
	if(!duplicate){
	
		$('#infodialog').html('Punkte wurden hinzugefügt.');
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
	
		$('#infodialog').html('Die ausgewählten Punkte wurden hinzugefügt. Einige Punkte befinden sich bereits in der Auswahl und wurde deshalb nicht erneut hinzugefügt.');
		$('#infodialog').dialog({ 
			height: 160,
			width: 400,
			autoOpen: true,   
			modal: true, 
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


// 3.4) Center Polygon
// Center map-view on polygon
// Author: Johanna Möllmann
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
                                dialog = $('<p>Dieser Punkt ist Teil des Tracks: ' + track.id + '. <br> Möchten sie diesen Track:</p>').dialog(
							{
	 								height: 220,
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

// Add Single Measurement to Selection
// Description: Adds a single measurement to the selection
// Author: René Unrau
function addSinglePoint(measurement){
	// If selection is empty, add to selection, update-sidebar-selection-list and current-analysis
	if(selection.length == 0){
		selection.push(measurement);
	
		updateSelectionList();
		refreshManufacturers();
		refreshAnalysis();
		visualizeSelection();
		
		onlyOneTrack = false;

	
        //Open and Close info-popup
        //Authors: Nicholas Schiestel and Johanna Möllmann
		$('#infodialog').html('Punkt wurde hinzugefügt.');
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
                $('#infodialog').html('Der Messpunkt: ' + measurement.properties.id + ' befindet sich bereits in ihrer Auswahl');
                $('#infodialog').dialog({ 
                    height: 100,
                    width: 300,
                    autoOpen: true,   
                    modal: true, 
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
		//Authors: Nicholas Schiestel and Johanna Möllmann	
		$('#infodialog').html('Punkt wurde hinzugefügt.');
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

// Add Single Measurement to Selection from a Track
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
		if(trackMeasurement.properties.phenomenons.Consumption == undefined) {
			var Consumption = new Object();
			Consumption.value = "-";
			Consumption.unit = "l/s";
			trackMeasurement.properties.phenomenons.Consumption = Consumption;
		}
		if(trackMeasurement.properties.phenomenons.CO2 == undefined) {
			var CO2 = new Object();
			CO2.value = "-";
			CO2.unit = "g/s";
			trackMeasurement.properties.phenomenons.CO2 = CO2;
		}
		if(trackMeasurement.properties.phenomenons.MAF == undefined) {
			var MAF = new Object();
			MAF.value = "-";
			MAF.unit = "l/s";
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
                $('#infodialog').html('Der Messpunkt: ' + measurement.properties.id + ' befindet sich bereits in ihrer Auswahl');
                $('#infodialog').dialog({ 
                    height: 100,
                    width: 300,
                    autoOpen: true,   
                    modal: true, 
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


// Add Single Track to Selection
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
	refreshManufacturers();
	refreshAnalysis();
	visualizeSelection();
    
    
	//Open and Close info-popup
	//Authors: Nicholas Schiestel and Johanna Möllmann	
	$('#infodialog').html('Punkte wurden hinzugefügt.');
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

// Delete Single Measurement
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

// Visualize Selection
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
						var dialog = $('<p>Möchten sie diesen Punkt von der Auswahl entfernen?</p>').dialog({
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



// Update Selection-List
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
	refreshManufacturers()
	refreshAnalysis();
	
	if(dialogTable.dialog('isOpen')) {
	dialogTable.dialog('close');
	showMeasurementDetails();
	}
	
}

// Show all measurementdetails of the selected Points
// Description: Creates a more detailed list of selected points in a popup
// Author: Christian & Oli K.
function showMeasurementDetails() {

    var updatedList = $("<table>" + 
		 
		"<th>Punkt</th>" +
		"<th>Koordinaten</th>" + 
		"<th>Sensor-ID</th>" + 
		"<th>Zeitpunkt</th>" + 
		"<th>Fahrzeugmarke</th>" + 
		"<th>Modell</th>" + 
        "<th>Geschwindigkeit [km/h]</th>" + 
		"<th>CO2-Ausstoß [g/s]</th>" + 
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


// Update Analysis
// Description: Refreshes the current Analysis
// Author: René Unrau
function refreshAnalysis(){
	var e = document.getElementById('analysisSelectionBox');
	
	var result = $("<table>");

	if(e.options[e.selectedIndex].value == 'Geschwindigkeit'){
		var min = getMin('Speed');
		var max = getMax('Speed');
		
		if(isNaN(min.value)){
		
			result.append("Sie haben noch keine Messpunkte selektiert oder diese enthalten das Attribut \"Geschwindigkeit\" nicht.</table>");
		}else{

			result.append("<tr><td><td><b>Mittelwert</b></td><td>" + getMean('Speed') + "</td><td>km/h</td></tr>");
			result.append("<tr><td><td><b>Standardabweichung</b></td><td>" + getSD('Speed') + "</td><td>km/h</td></tr>");
			result.append("<tr><td><td><b>Minimum</b></td><td><a id='centerMin' class='link'>" + min.value + "</a></td><td>km/h</td></tr>");
			result.append("<tr><td><td><b>Maximum</b></td><td><a id='centerMax' class='link'>" + max.value + "</a></td><td>km/h</td></tr></table>");
		}
	
	}else if(e.options[e.selectedIndex].value == 'CO2'){
		var min = getMin('CO2');
		var max = getMax('CO2');
		
		if(isNaN(min.value)){
		
			result.append("Sie haben noch keine Messpunkte selektiert oder diese enthalten das Attribut \"CO2\" nicht.</table>");
		}else{
	
			result.append("<tr><td><td><b>Mittelwert</b></td><td>" + getMean('CO2') + "</td><td>g/s</td></tr>");
			result.append("<tr><td><td><b>Standardabweichung</b></td><td>" + getSD('CO2') + "</td><td>g/s</td></tr>");
			result.append("<tr><td><td><b>Minimum</b></td><td><a id='centerMin' class='link'>" + min.value + "</a></td><td>g/s</td></tr>");
			result.append("<tr><td><td><b>Maximum</b></td><td><a id='centerMax' class='link'>" + max.value + "</a></td><td>g/s</td></tr></table>");
		}
	
	}else if(e.options[e.selectedIndex].value == 'Spritverbrauch'){
		var min = getMin('Consumption');
		var max = getMax('Consumption');
		
		if(isNaN(min.value)){
		
			result.append("Sie haben noch keine Messpunkte selektiert oder diese enthalten das Attribut \"Spritverbrauch\" nicht.</table>");
		}else{
	
			result.append("<tr><td><td><b>Mittelwert</b></td><td>" + getMean('Consumption') + "</td><td>l/h</td></tr>");
			result.append("<tr><td><td><b>Standardabweichung</b></td><td>" + getSD('Consumption') + "</td><td>l/h</td></tr>");
			result.append("<tr><td><td><b>Minimum</b></td><td><a id='centerMin' class='link'>" + min.value + "</a></td><td>l/h</td></tr>");
			result.append("<tr><td><td><b>Maximum</b></td><td><a id='centerMax' class='link'>" + max.value + "</a></td><td>l/h</td></tr></table>");
		}
	
	}else if(e.options[e.selectedIndex].value == 'MAF'){
		var min = getMin('MAF');
		var max = getMax('MAF');
		
		if(isNaN(min.value)){
		
			result.append("Sie haben noch keine Messpunkte selektiert oder diese enthalten das Attribut \"MAF\" nicht.</table>");
		}else{
	
			result.append("<tr><td><td><b>Mittelwert</b></td><td>" + getMean('MAF') + "</td><td>l/s</td></tr>");
			result.append("<tr><td><td><b>Standardabweichung</b></td><td>" + getSD('MAF') + "</td><td>l/s</td></tr>");
			result.append("<tr><td><td><b>Minimum</b></td><td><a id='centerMin' class='link'>" + min.value + "</a></td><td>l/s</td></tr>");
			result.append("<tr><td><td><b>Maximum</b></td><td><a id='centerMax' class='link'>" + max.value + "</a></td><td>l/s</td></tr></table>");
		}
	
	}else if(e.options[e.selectedIndex].value == 'Fahrzeugtyp'){
	
		if(selection.length == 0){
			
			result.append("Bitte wählen Sie zuerst einige Messpunkte aus.</table>");
		}else{
	
			var mostFreqManu = getMostFreqManu();
			result.append("<tr><td><td><b>Häufigster Fahrzeugtyp</b></td><td>" + mostFreqManu + "(" + manufacturerSelection[mostFreqManu] + ")</td></tr></table>");
		}
	}
	
	result.on('click', '#centerMin', function(){
		mainMap.setView([min.lat, min.lng],18);
		for(var j = 0; j < markers.length; j++){
			if(markers[j].getLatLng().lat == min.lat && markers[j].getLatLng().lng == min.lng){
				doNotLoad = true;
				markers[j].openPopup();
				break;
			}
		}
	});
	result.on('click', '#centerMax', function(){
		mainMap.setView([max.lat, max.lng],18);
		for(var j = 0; j < markers.length; j++){
			if(markers[j].getLatLng().lat == max.lat && markers[j].getLatLng().lng == max.lng){
				doNotLoad = true;
				markers[j].openPopup();
				break;
			}
		}
	});
    
    $("#textualresults").empty();
    $("#textualresults").append(result);
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
		return Math.round(sum/n*100)/ 100;
		
	//For phenomenon "CO2"
	}else if(phenomenon == 'CO2'){
		for(var i = 0; i < selection.length; i++){
			//If CO2 is not undefined
			if(selection[i].properties.phenomenons.CO2.value != '-'){
				sum = sum + selection[i].properties.phenomenons.CO2.value;
				n++;
			}
		}
		return Math.round(sum/n*100)/ 100;
	
	//For phenomenon "Consumption"
	}else if(phenomenon == 'Consumption'){
		for(var i = 0; i < selection.length; i++){
			//If Consumption is not undefined
			if(selection[i].properties.phenomenons.Consumption.value != '-'){
				sum = sum + selection[i].properties.phenomenons.Consumption.value;
				n++;
			}
		}
		return Math.round(sum/n*100)/ 100;
	
	//For phenomenon "MAF"
	}else if(phenomenon == 'MAF'){
		for(var i = 0; i < selection.length; i++){
			//If MAF is not undefined
			if(selection[i].properties.phenomenons.MAF.value != '-'){
				sum = sum + selection[i].properties.phenomenons.MAF.value;
				n++;
			}
		}
		return Math.round(sum/n*100)/ 100;
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

	var first = true;
	var min;
	var result = new Object();
	
	//For phenomenon "Speed"
	if(phenomenon == 'Speed'){
	
		for(var i = 0; i < selection.length; i++){
		
			// If first value, then take as minimum
			if(first){
				if(selection[i].properties.phenomenons.Speed.value != '-'){
					min = selection[i].properties.phenomenons.Speed.value;
					result.lat = selection[i].geometry.coordinates[1];
					result.lng = selection[i].geometry.coordinates[0];
					first = false;
				}
			}else{
				//If Speed is not undefined
				if(selection[i].properties.phenomenons.Speed.value != '-'){
					//If current Value is smaller than current min
					if(min > selection[i].properties.phenomenons.Speed.value){
						min = selection[i].properties.phenomenons.Speed.value;
						result.lat = selection[i].geometry.coordinates[1];
						result.lng = selection[i].geometry.coordinates[0];		
					}
				}
			}
		}
		result.value = Math.round(min*100)/ 100;
		return result;
	
	//For phenomenon "CO2"
	}else if(phenomenon == 'CO2'){
	
		for(var i = 0; i < selection.length; i++){
		
			// If first value, then take as minimum
			if(first){
				if(selection[i].properties.phenomenons.CO2.value != '-'){
					min = selection[i].properties.phenomenons.CO2.value;
					result.lat = selection[i].geometry.coordinates[1];
					result.lng = selection[i].geometry.coordinates[0];
					first = false;
				}
			}else{
				//If CO2 is not undefined
				if(selection[i].properties.phenomenons.CO2.value != '-'){
					//If current Value is smaller than current min
					if(min > selection[i].properties.phenomenons.CO2.value){
						min = selection[i].properties.phenomenons.CO2.value;
						result.lat = selection[i].geometry.coordinates[1];
						result.lng = selection[i].geometry.coordinates[0];		
					}
				}
			}
		}
		result.value = Math.round(min*100)/ 100;
		return result;

	//For phenomenon "Consumption"
	}else if(phenomenon == 'Consumption'){
	
		for(var i = 0; i < selection.length; i++){
		
			// If first value, then take as minimum
			if(first){
				if(selection[i].properties.phenomenons.Consumption.value != '-'){
					min = selection[i].properties.phenomenons.Consumption.value;
					result.lat = selection[i].geometry.coordinates[1];
					result.lng = selection[i].geometry.coordinates[0];
					first = false;
				}
			}else{
				//If Consumption is not undefined
				if(selection[i].properties.phenomenons.Consumption.value != '-'){
					//If current Value is smaller than current min
					if(min > selection[i].properties.phenomenons.Consumption.value){
						min = selection[i].properties.phenomenons.Consumption.value;
						result.lat = selection[i].geometry.coordinates[1];
						result.lng = selection[i].geometry.coordinates[0];		
					}
				}
			}
		}
		result.value = Math.round(min*100)/ 100;
		return result;

	//For phenomenon "MAF"
	}else if(phenomenon == 'MAF'){
	
		for(var i = 0; i < selection.length; i++){
		
			// If first value, then take as minimum
			if(first){
				if(selection[i].properties.phenomenons.MAF.value != '-'){
					min = selection[i].properties.phenomenons.MAF.value;
					result.lat = selection[i].geometry.coordinates[1];
					result.lng = selection[i].geometry.coordinates[0];
					first = false;
				}
			}else{
				//If MAF is not undefined
				if(selection[i].properties.phenomenons.MAF.value != '-'){
					//If current Value is smaller than current min
					if(min > selection[i].properties.phenomenons.MAF.value){
						min = selection[i].properties.phenomenons.MAF.value;
						result.lat = selection[i].geometry.coordinates[1];
						result.lng = selection[i].geometry.coordinates[0];		
					}
				}
			}
		}
		result.value = Math.round(min*100)/ 100;
		return result;
	
	// For phenomenon "Interpolated Speed"
	}else if(phenomenon == 'IntSpeed'){
	
		for(var i = 0; i < interpolated.phenomenons.Speed.length; i++){
			// If first value, then take as minimum
			if(first){
				min = interpolated.phenomenons.Speed[i];
				result.lat = interpolated.latitude[i];
				result.lng = interpolated.longitude[i];
				first = false;
			}else{
				//If current Value is smaller than current min
				if(min > interpolated.phenomenons.Speed[i]){
					min = interpolated.phenomenons.Speed[i];
					result.lat = interpolated.latitude[i];
					result.lng = interpolated.longitude[i];
				}
			}
		}
		result.value = Math.round(min*100)/ 100;
		return result;
	
	// For phenomenon "Interpolated CO2"
	}else if(phenomenon == 'IntCO2'){
	
		for(var i = 0; i < interpolated.phenomenons.CO2.length; i++){
			// If first value, then take as minimum
			if(first){
				min = interpolated.phenomenons.CO2[i];
				result.lat = interpolated.latitude[i];
				result.lng = interpolated.longitude[i];
				first = false;
			}else{
				//If current Value is smaller than current min
				if(min > interpolated.phenomenons.CO2[i]){
					min = interpolated.phenomenons.CO2[i];
					result.lat = interpolated.latitude[i];
					result.lng = interpolated.longitude[i];
				}
			}
		}
		result.value = Math.round(min*100)/ 100;
		return result;
	
	// For phenomenon "Interpolated Consumption"
	}else if(phenomenon == 'IntConsumption'){
	
		for(var i = 0; i < interpolated.phenomenons.Consumption.length; i++){
			// If first value, then take as minimum
			if(first){
				min = interpolated.phenomenons.Consumption[i];
				result.lat = interpolated.latitude[i];
				result.lng = interpolated.longitude[i];
				first = false;
			}else{
				//If current Value is smaller than current min
				if(min > interpolated.phenomenons.Consumption[i]){
					min = interpolated.phenomenons.Consumption[i];
					result.lat = interpolated.latitude[i];
					result.lng = interpolated.longitude[i];
				}
			}
		}
		result.value = Math.round(min*100)/ 100;
		return result;
	
	// For phenomenon "Interpolated Consumption"
	}else if(phenomenon == 'IntMAF'){
	
		for(var i = 0; i < interpolated.phenomenons.MAF.length; i++){
			// If first value, then take as minimum
			if(first){
				min = interpolated.phenomenons.MAF[i];
				result.lat = interpolated.latitude[i];
				result.lng = interpolated.longitude[i];
				first = false;
			}else{
				//If current Value is smaller than current min
				if(min > interpolated.phenomenons.MAF[i]){
					min = interpolated.phenomenons.MAF[i];
					result.lat = interpolated.latitude[i];
					result.lng = interpolated.longitude[i];
				}
			}
		}
		result.value = Math.round(min*100)/ 100;
		return result;
	}
}

// Get Maximum
// Description: Returns maximum for a given phenomenon
// Author: René Unrau
function getMax(phenomenon){

	var max = 0;
	var result = new Object();
	
	//For phenomenon "Speed"
	if(phenomenon == 'Speed'){
	
		for(var i = 0; i < selection.length; i++){
			//If Speed is not undefined
			if(selection[i].properties.phenomenons.Speed.value != '-'){
				//If current Value is bigger than current max
				if(max < selection[i].properties.phenomenons.Speed.value){
					max = selection[i].properties.phenomenons.Speed.value;
					result.lat = selection[i].geometry.coordinates[1];
					result.lng = selection[i].geometry.coordinates[0];
				}
			}
		}
		result.value = Math.round(max*100)/ 100;
		return result;
	
	//For phenomenon "CO2"
	}else if(phenomenon == 'CO2'){
	
		for(var i = 0; i < selection.length; i++){
			//If CO2 is not undefined
			if(selection[i].properties.phenomenons.CO2.value != '-'){
				//If current Value is bigger than current max
				if(max < selection[i].properties.phenomenons.CO2.value){
					max = selection[i].properties.phenomenons.CO2.value;
					result.lat = selection[i].geometry.coordinates[1];
					result.lng = selection[i].geometry.coordinates[0];		
				}
			}
		}
		result.value = Math.round(max*100)/ 100;
		return result;
		
	
	//For phenomenon "Consumption"
	}else if(phenomenon == 'Consumption'){
	
		for(var i = 0; i < selection.length; i++){
			//If Consumption is not undefined
			if(selection[i].properties.phenomenons.Consumption.value != '-'){
				//If current Value is bigger than current max
				if(max < selection[i].properties.phenomenons.Consumption.value){
					max = selection[i].properties.phenomenons.Consumption.value;
					result.lat = selection[i].geometry.coordinates[1];
					result.lng = selection[i].geometry.coordinates[0];		
				}
			}
		}
		result.value = Math.round(max*100)/ 100;
		return result;
		
	//For phenomenon "MAF"
	}else if(phenomenon == 'MAF'){
	
		for(var i = 0; i < selection.length; i++){
			//If MAF is not undefined
			if(selection[i].properties.phenomenons.MAF.value != '-'){
				//If current Value is bigger than current max
				if(max < selection[i].properties.phenomenons.MAF.value){
					max = selection[i].properties.phenomenons.MAF.value;
					result.lat = selection[i].geometry.coordinates[1];
					result.lng = selection[i].geometry.coordinates[0];		
				}
			}
		}
		result.value = Math.round(max*100)/ 100;
		return result;
	
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
		
	// For phenomenon "Interpolated Speed"
	}else if(phenomenon == 'IntSpeed'){
	
		for(var i = 0; i < interpolated.phenomenons.Speed.length; i++){
			//If current Value is bigger than current max
			if(max < interpolated.phenomenons.Speed[i]){
				max = interpolated.phenomenons.Speed[i];
				result.lat = interpolated.latitude[i];
				result.lng = interpolated.longitude[i];		
			}
		}
		result.value = Math.round(max*100)/ 100;
		return result;
	
	// For phenomenon "Interpolated CO2"
	}else if(phenomenon == 'IntCO2'){
	
		for(var i = 0; i < interpolated.phenomenons.CO2.length; i++){
			//If current Value is bigger than current max
			if(max < interpolated.phenomenons.CO2[i]){
				max = interpolated.phenomenons.CO2[i];
				result.lat = interpolated.latitude[i];
				result.lng = interpolated.longitude[i];		
			}
		}
		result.value = Math.round(max*100)/ 100;
		return result;
	
	// For phenomenon "Interpolated Consumption"
	}else if(phenomenon == 'IntConsumption'){
	
		for(var i = 0; i < interpolated.phenomenons.Consumption.length; i++){
			//If current Value is bigger than current max
			if(max < interpolated.phenomenons.Consumption[i]){
				max = interpolated.phenomenons.Consumption[i];
				result.lat = interpolated.latitude[i];
				result.lng = interpolated.longitude[i];		
			}
		}
		result.value = Math.round(max*100)/ 100;
		return result;
	
	// For phenomenon "Interpolated Consumption"
	}else if(phenomenon == 'IntMAF'){
	
		for(var i = 0; i < interpolated.phenomenons.MAF.length; i++){
			//If current Value is bigger than current max
			if(max < interpolated.phenomenons.MAF[i]){
				max = interpolated.phenomenons.MAF[i];
				result.lat = interpolated.latitude[i];
				result.lng = interpolated.longitude[i];		
			}
		}
		result.value = Math.round(max*100)/ 100;
		return result;
	}
}

// Get Most Frequent Manufacturer
// Description: Returns manufactures which is most frequent in selection
// Author: René Unrau
function getMostFreqManu(){

	return getMax('Manufacturer');

}


// Refresh Manufacturers
// Description: Refresh Manufacturers Arrays
// Author: René Unrau
function refreshManufacturers(){
	manufacturerSelection = new Array();

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
	
	manufacturerNames = new Array();
	manufacturerFrequency = new Array();
	
	for(var key in manufacturerSelection){
		manufacturerNames.push(key);
		manufacturerFrequency.push(manufacturerSelection[key]);
	}
	
	// Get and return maximum
	return getMax('Manufacturer');
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
				'<tr><td><b>Geschwindigkeit</b></td><td>' + phenomenons.Speed.value + ' km/h</td></tr>' +
				'<tr><td><b>CO2-Ausstoß</b></td><td>' + phenomenons.CO2.value + ' g/s</td></tr>' +
				'<tr><td><b>Spritverbrauch</b></td><td>' + phenomenons.Consumption.value + ' l/h</td></tr>' +
				'<tr><td><b>MAF</b></td><td>' + phenomenons.MAF.value + ' l/s</td></tr>' +
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
        
	});
}

// Reset Track Selection
// Description: Deletes Track and draws standard measurements
// Authors: René Unrau & Nicholas Schiestel
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

// Start Interpolation
// Description: Checks which interpolation is choosed and starts it
// Author: René Unrau
function startInterpolation(){
	
	if(selection.length == 0){
		alert('Es befindet sich keine Track in Ihrer Auswahl');
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

	
    if(document.interpolation.interpolationMethod[0].checked?"0":"1" == '0') {
        idwInterpolation(consumption, co2, maf, speed);
    }
    
    else if(document.interpolation.interpolationMethod[1].checked?"0":"1" == '1') {
        krigingInterpolation(consumption, co2, maf, speed);
    }
}

// IDW Interpolation
// Description: Compute Interpolation, Draw Points and start Line visualization
// Author: René Unrau
function idwInterpolation(consumption, co2, maf, speed){

	// Check if there has been already an interpolation and if yes: remove old interpolated-points from map
	if(interpolated != undefined){
		for(var i = 0; i < interpolated.marker.length; i++){
		
			mainMap.removeLayer(interpolated.marker[i]);
		}
	}
	
	// Delete sected measurements from map
	for(var i = 0; i < markers.length; i++){
		
		mainMap.removeLayer(markers[i]);
	}

	mainMap.removeLayer(trackLine);

	interpolated = new Object();
	interpolated.latitude = new Array();
	interpolated.longitude = new Array();
	interpolated.phenomenons = new Object();
	interpolated.phenomenons.Consumption = new Array();
	interpolated.phenomenons.CO2 = new Array();
	interpolated.phenomenons.MAF = new Array();
	interpolated.phenomenons.Speed = new Array();
	interpolated.marker = new Array();
	
	computeCoords();
		
	for(var i = 1; i < selection.length; i++){
		//Interpolate Consumption
		if(consumption){
			var firstsum = 0;
			var secondsum = 0;
			
			for(var j = 0; j < selection.length; j++){
				var value = selection[j].properties.phenomenons.Consumption.value;
				var dist = Math.sqrt(Math.pow(interpolated.latitude[i-1] - selection[j].geometry.coordinates[1],2) + Math.pow(interpolated.longitude[i-1] - selection[j].geometry.coordinates[0],2));
				firstsum = firstsum + (value / dist);
				
				secondsum = secondsum + (1 / dist);
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
				firstsum = firstsum + (value / dist);
				
				secondsum = secondsum + (1 / dist);
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
				firstsum = firstsum + (value / dist);
				
				secondsum = secondsum + (1 / dist);
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
				firstsum = firstsum + (value / dist);
				
				secondsum = secondsum + (1 / dist);
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
        }
        else {
            toggle_visibility('visualisation');
            button4 = true;
            toggle_visibility('visualisation');
        }
        
        //show downloadbutton for the result of the interpolation on the map (only when it isn't already active)
        if(button5 != true){
            toggle_visibility('interpolationDownload');
            button5 = true;
        }
        else {
            toggle_visibility('interpolationDownload');
            button5 = true;
            toggle_visibility('interpolationDownload');
        }
	}
	
	document.legendAttributs.interpolationAttribut[0].checked = true;
	checkVisualizationAttr();    
}


// Kriging Interpolation
// Description: Compute Interpolation, Draw Points and start Line visualization
// Author: René Unrau
function krigingInterpolation(consumption, co2, maf, speed){

	// Check if there has been already an interpolation and if yes: remove old interpolated-points from map
	if(interpolated != undefined){
		for(var i = 0; i < interpolated.marker.length; i++){
		
			mainMap.removeLayer(interpolated.marker[i]);
		}
	}
	
	// Delete sected measurements from map
	for(var i = 0; i < markers.length; i++){
		
		mainMap.removeLayer(markers[i]);
	}

	mainMap.removeLayer(trackLine);

	interpolated = new Object();
	interpolated.latitude = new Array();
	interpolated.longitude = new Array();
	interpolated.phenomenons = new Object();
	interpolated.phenomenons.Consumption = new Array();
	interpolated.phenomenons.CO2 = new Array();
	interpolated.phenomenons.MAF = new Array();
	interpolated.phenomenons.Speed = new Array();
	interpolated.marker = new Array();
	
	computeCoords();
	
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
        }
        else {
            toggle_visibility('visualisation');
            button4 = true;
            toggle_visibility('visualisation');
        }
        
        //show downloadbutton for the result of the interpolation on the map (only when it isn't already active)
        if(button5 != true){
            toggle_visibility('interpolationDownload');
            button5 = true;
        }
        else {
            toggle_visibility('interpolationDownload');
            button5 = true;
            toggle_visibility('interpolationDownload');
        }
	}
	
	document.legendAttributs.interpolationAttribut[0].checked = true;
	checkVisualizationAttr();
}


// Check visualization-attribute
// Looks for checkboxes and chooses Attribute to visualize
// Author: Nicho, René
function checkVisualizationAttr(){

	var attribut = document.getElementsByName('legendAttributs').value;

	if(document.legendAttributs.interpolationAttribut[0].checked){
	
		if(!isNaN(interpolated.phenomenons.Speed[0])){
		
			visualizeInterpolation('IntSpeed');
		}else{
		
			alert('Dieser Track hat dieses Attribut nicht');
			return;
		}
	}else if(document.legendAttributs.interpolationAttribut[1].checked){
		if(!isNaN(interpolated.phenomenons.CO2[0])){
		
			visualizeInterpolation('IntCO2');
		}else{
		
			alert('Dieser Track hat dieses Attribut nicht');
			document.legendAttributs.interpolationAttribut[0].checked = true;
			checkVisualizationAttr();
		}
	}else if(document.legendAttributs.interpolationAttribut[2].checked){
		if(!isNaN(interpolated.phenomenons.Consumption[0])){
		
			visualizeInterpolation('IntConsumption');
		}else{
		
			alert('Dieser Track hat dieses Attribut nicht');
			document.legendAttributs.interpolationAttribut[0].checked = true;
			checkVisualizationAttr();
		}
	}else if(document.legendAttributs.interpolationAttribut[3].checked){
		if(!isNaN(interpolated.phenomenons.MAF[0])){
		
			visualizeInterpolation('IntMAF');
		}else{
		
			alert('Dieser Track hat dieses Attribut nicht');
			document.legendAttributs.interpolationAttribut[0].checked = true;
			checkVisualizationAttr();
		}
	}
}


// Visualize Interpolation
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
		document.getElementById('darkGreenValue').innerHTML = '< ' + Math.round(firstFifth*100)/100 + ' l/h';
		document.getElementById('greenValue').innerHTML = '< ' + Math.round(secondFifth*100)/100 + ' l/h';
		document.getElementById('yellowValue').innerHTML = '< ' + Math.round(thirdFifth*100)/100 + ' l/h';
		document.getElementById('orangeValue').innerHTML = '< ' + Math.round(fourthFifth*100)/100 + ' l/h';
		document.getElementById('redValue').innerHTML = '> ' + Math.round(fourthFifth*100)/100 + ' l/h';
	}else if(phenomenon == 'IntSpeed'){
		document.getElementById('darkGreenValue').innerHTML = '< ' + Math.round(firstFifth*100)/100 + ' km/h';
		document.getElementById('greenValue').innerHTML = '< ' + Math.round(secondFifth*100)/100 + ' km/h';
		document.getElementById('yellowValue').innerHTML = '< ' + Math.round(thirdFifth*100)/100 + ' km/h';
		document.getElementById('orangeValue').innerHTML = '< ' + Math.round(fourthFifth*100)/100 + ' km/h';
		document.getElementById('redValue').innerHTML = '> ' + Math.round(fourthFifth*100)/100 + ' km/h';
	}else if(phenomenon == 'IntCO2'){
		document.getElementById('darkGreenValue').innerHTML = '< ' + Math.round(firstFifth*100)/100 + ' g/s';
		document.getElementById('greenValue').innerHTML = '< ' + Math.round(secondFifth*100)/100 + ' g/s';
		document.getElementById('yellowValue').innerHTML = '< ' + Math.round(thirdFifth*100)/100 + ' g/s';
		document.getElementById('orangeValue').innerHTML = '< ' + Math.round(fourthFifth*100)/100 + ' g/s';
		document.getElementById('redValue').innerHTML = '> ' + Math.round(fourthFifth*100)/100 + ' g/s';
	}else if(phenomenon == 'IntMAF'){
		document.getElementById('darkGreenValue').innerHTML = '< ' + Math.round(firstFifth*100)/100 + ' l/s';
		document.getElementById('greenValue').innerHTML = '< ' + Math.round(secondFifth*100)/100 + ' l/s';
		document.getElementById('yellowValue').innerHTML = '< ' + Math.round(thirdFifth*100)/100 + ' l/s';
		document.getElementById('orangeValue').innerHTML = '< ' + Math.round(fourthFifth*100)/100 + ' l/s';
		document.getElementById('redValue').innerHTML = '> ' + Math.round(fourthFifth*100)/100 + ' l/s';
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

// Compute new coordinates for Interpolation
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


// Check Interpolation-Requirements
// Description: This function checks if a interpolation is allowed
// Author: René Unrau
function checkIntRequirements(consumption, co2, maf, speed){
	
	// Cancel if there are measurements in selection from more than one track
	if(!onlyOneTrack){
		alert('Bitte wählen sie für eine Interpolation genau einen Track aus.');
		return false;
	}
	
	if(!consumption && !co2 && !maf && !speed){
		alert('Der ausgewählte Track enthält keine Attribute die Interpoliert werden können');
		return false;
	}

	return true;
}


// Selectionsbuttons
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
                alert("Error");
            }
        } 
    }
 }
 
// switch interpolation line
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


// switch interpolation measurements
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


// switch interpolated points
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

// Reset all Visualizations
// Description: Resets all visualizations and return to normal mode
// Author: René Unrau
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



// Set Maximum Measurements
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
	}
	
    drawMeasurements();
}