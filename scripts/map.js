/*
Test Map
*/
var mainMap;

var neLat;
var neLng;
var swLat;
var swLng;

var markers = [];

var overlays = [];

window.onload = function(){
	
    createMap();

};

function createMap(){

	var map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(51.96, 7.62),
        zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    });
	
	mainMap = map;
	
	google.maps.event.addListener(map, 'idle', function() {
        addMeasurementsToMap();
    });
}

function addMeasurementsToMap(){

	var bounds = mainMap.getBounds();
		neLat = bounds.getNorthEast().lat();
		neLng = bounds.getNorthEast().lng();
		swLat = bounds.getSouthWest().lat();
		swLng = bounds.getSouthWest().lng();
	
	$.getJSON("https://envirocar.org/api/stable/rest/measurements?bbox=" + swLng + "," + swLat + "," + neLng + "," + neLat,function(result){
	
		result = result.features;
		
		markers.length = 0;
		
		var i = overlays.length;
		while (i--) {
			var overlay = overlays[i];
			if (overlay){
				overlay.setMap(null);
			}
			delete overlays[i];
		}
		
		var id = 0;
		
		// var infoWindow = new google.maps.InfoWindow();
	
		$.each(result, function(i, result){
		
			latlng = new google.maps.LatLng(result.geometry.coordinates[1], result.geometry.coordinates[0]);
		
			var marker = new com.redfin.FastMarker(id, latlng, ["<img src='https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png'>"], "myMarker", 0, 10/*px*/, 10/*px*/);
			
			markers.push(marker);
		
			/*
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(result.geometry.coordinates[1], result.geometry.coordinates[0]),
				icon: "https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png",
				//map: mainMap
			});
			*/
			/*
			result = result.properties;
			
			(function(marker, result) {
		
				var contentString = 
					'<div id="content" style="width:200px;"><b>Hersteller ' + result.sensor.properties.manufacturer +
					'</b><br><b>Model: ' + result.sensor.properties.model +
					'</b><br><b>Geschwindigkeit ' + result.phenomenons.Speed.value + 
					'</b><br><b>CO2 ' + result.phenomenons.CO2.value + 
					'</b><br><b>Verbrauch ' + result.phenomenons.Consumption.value +
					'</b><br></div>';

				// Attaching a click event to the current marker
				google.maps.event.addListener(marker, "click", function(e) {
					infoWindow.setContent(contentString);
					infoWindow.open(mainMap, marker);
				});


			})(marker, result);
			*/
			
		});
		overlays.push(new com.redfin.FastMarkerOverlay(mainMap, markers));
		
	});
	
}