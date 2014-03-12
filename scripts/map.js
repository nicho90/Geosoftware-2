/********************************************************************************************
		Map
		
This main file contains all global variables of our application.
These variables are also used in other files. So please be careful with editing or deleting.
Later in this file you will also find two initial functions of our application.

********************************************************************************************
Content

1. Global variables

2. Event register

3. Initial Functions
	3.1 Draw MainMap
	3.2 Draw Measurements

*********************************************************************************************/


/***********************
	1. Global variables
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
	2. Event register
***********************/
window.onload = function() {
	document.getElementById('interpolationMethod')[0].checked = true;
	document.legendAttributs.interpolationAttribut[0].checked = true;
	drawMap();
	setMaxMeas();
	mainMap.on('moveend', drawMeasurements);
}


/***********************
	3. Initial Functions
***********************/

// 3.1 Draw MainMap
// Description: Initializes main map and navigation-elements
// Author: René Unrau
function drawMap() {
	// create a map in the "map" div, set the view to a given place and zoom

    var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
    
    var osm_cm = new L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
        key: '2a08ced180ac4d00a9d92267b347b6be',
        styleId: 997,
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'

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
        "OpenStreetMap (Cloudmade)": osm_cm,
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
	//Author: Johanna Moellmann
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
	// Author: Johanna Moellmann
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



// 3.2 Draw Measurements
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
			},
            error: function(jqXHR, textStatus, errorThrown){
            var dialog = $('<p>Beim Abruf der Messpunkte ist folgender Fehler aufgetreten: '+errorThrown+' Bitte konsultieren Sie das Handbuch f&uuml;r weitere Informationen.</p>').dialog({
			modal: true,
            height:200,
            width:600,
            title: "Status Error "+errorThrown,
			buttons: {
				"OK":  function() {dialog.dialog('close');}
			}
        })
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
			Consumption.unit = "l/h";
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
					'<tr><td><a href="#" id="centerPoint" class="link">Auf Punkt zentrieren</a></td><td><a href="#" id="showTrack" class="link">Zugeh&ouml;rigen Track anzeigen</a></td></tr></table></html>');

				// Insert the container into the popup
				marker.bindPopup(container[0]);
		
				//Do not load measurements if marker is clicked
				marker.on('click', function(){
					doNotLoad = true;
					if(singlePointSelection) {
						mainMap.closePopup();
						var dialog = $('<p>M&ouml;chten Sie diesen Punkt von der Auswahl entfernen?</p>').dialog({
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
				'<tr><td><a href="#" id="centerPoint" class="link">Auf Punkt zentrieren</a></td><td><a href="#" id="showTrack" class="link">Zugeh&ouml;rigen Track anzeigen</a></td></tr></table></html>');
	
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
    
         
           //if no measurements are returned
    if(markers.length==0) {
        var dialog = $('<p>Mit den gegenw&auml;rtig gew&auml;hlten Filtereinstellungen konnten keine Messpunkte gefunden werden. Bitte &auml;ndern Sie die Filtereinstellungen</p>').dialog({
            modal:true,
            width:600,
            title: 'Error 402',
            buttons: {
                "OK": function() {dialog.dialog('close');}
            }
        })
        return;
    }      
		
	for(var i = 0; i < markers.length; i++) {
		mainMap.addLayer(markers[i]);
	}
}

function downloadsite(){
	window.open('test.html');
}