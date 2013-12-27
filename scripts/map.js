/*
Test Map
*/
var mainMap;

var neLat;
var neLng;
var swLat;
var swLng;

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
	
	google.maps.event.addListener(map, 'bounds_changed', function() {
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
		
		var infoWindow = new google.maps.InfoWindow();
	
		$.each(result, function(i, result){
		
			var marker = new google.maps.Marker({
			position: new google.maps.LatLng(result.geometry.coordinates[1], result.geometry.coordinates[0]),
			icon: "https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png",
			map: mainMap
			});
			
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
			
		});
		
	});
	
}