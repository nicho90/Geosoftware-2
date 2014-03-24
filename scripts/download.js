/********************************************************************************************
		Download
		
This file contains all functions needed downloading selected or interpolated measurements.

********************************************************************************************
Content

1. Download Measurements
	1.1 Selected Measurement
	1.2 Interpolated Measurements

2. Download Window

*********************************************************************************************/

/****************************
	1. Download Measurements
****************************/

// 1.1 Download selected measurement
// Description: Create JSON and offer download
// Author: Johanna Möllmann
function download_measurementPoints(){

if(selection.length > 0){

	var jsonString = '{"measurements": [';

	$.each(selection, function(i, measurement){
			lat = selection[i].geometry.coordinates[1];
			lon = selection[i].geometry.coordinates[0];
			point = i + 1;
			jsonString = jsonString + '{"latitude":'+ '"' + selection[i].geometry.coordinates[1]+ '"' + ' , ' +  '"longitude":' + '"' + selection[i].geometry.coordinates[0]+ '"' + ' , ' + '"sensorID":' + '"'+ measurement.properties.sensor.properties.id + '"'+ ' , ' + '"time":' + '"'+ measurement.properties.time + '"'+  ' , ' + 	'"manufacturer":' + '"'+ measurement.properties.sensor.properties.manufacturer + '"'+ ' , ' + '"model":' + '"'+ measurement.properties.sensor.properties.model + '"'+ ' , ' + 	'"speed":'+'"' + measurement.properties.phenomenons.Speed.value + '"' +' , ' + '"CO2":' + '"' + measurement.properties.phenomenons.CO2.value + '"' + ' , ' + '"consumption":' + '"' + measurement.properties.phenomenons.Consumption.value + '"' + ' , ' + '"MAF":' + '"' + measurement.properties.phenomenons.MAF.value  + '"' + "}" + ",";	
		});
	var jsonStringF = jsonString.substr(0, jsonString.length-1);
	var jsonResult = jsonStringF + '] }';

	var jsonResultFile = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResult + ")")));

	$('#downloadMpDialog').html('M&ouml;chten Sie die ausgew&auml;hlten Messpunkte als .json-Datei herunterladen?<br>');
					
		$('#downloadMpDialog').dialog({ 
			width: 600,
			autoOpen: true,   
			modal: true,
		});	

	var name = new Date();
	$('<a href="data:' + jsonResultFile + '" download="' + name.getTime() + '.json"><div style="text-align: right;"><hr><input type="button" name="confirmDownload" value="Herunterladen" class="jQueryButton"></div></a>').appendTo('#downloadMpDialog');
	
	}
else{
	var downloadmpDialog = $('<p>Um die Downloadfunktion nutzen zu k&ouml;nnen, muss sich mindestens ein Punkt in Ihrer Auswahl befinden.<br>Bitte selektieren Sie einen oder mehrere Punkte.</p>').dialog({
			buttons: {
				"OK": function() {downloadmpDialog.dialog('close');}
			},
			width: 600,
            title: "Error 501"
		});
	}

}


// 1.2 Download interpolated points
// Description: Create JSON and offer download
// Author: Johanna Möllmann
function downloadInterpolation(){

$('#downloadInterpolationDialog').html('Von welchem Attrigut m&ouml;chten Sie die Interpolationsergebnisse .json-Datei herunterladen?<br><br> <form action="select.htm"><select name="interpAttr" size="5" onchange="newBoxInt(this.form.interpAttr.options[this.form.interpAttr.selectedIndex].value)">  <option value="Geschwindigkeit">Geschwindigkeit</option> <option value="CO2-Ausstoss">CO2-Aussto&szlig;</option> <option value="Spritverbrauch">Spritverbrauch</option><option value="MAF-Werte">MAF-Werte</option> </select> </form>');

	$('#downloadInterpolationDialog').dialog({ 
		width: 600,
		autoOpen: true,   
		modal: true,
	});	
}

function newBoxInt(qrs){
	
	if(qrs == 'Geschwindigkeit'){
	
        var jsonStringInterpolationSpeed = '{"interpolated_speed_values": [';

			for(var i = 1; i < selection.length; i++){
				if( i < 100){
				jsonStringInterpolationSpeed = jsonStringInterpolationSpeed +	'{"latitude":'+ interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , ' + '"speed":'	+	interpolated.phenomenons.Speed[i-1] + "}" + ",";             
			}
			}
				var jsonStringFInterpolationSp = jsonStringInterpolationSpeed.substr(0, jsonStringInterpolationSpeed.length-1);
				var jsonResultInterpolationSp = jsonStringFInterpolationSp + "] }";
				var jsonResultFileInterpolationSp = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolationSp + ")")));
	
	downloadwindow(jsonResultFileInterpolationSp,"interpolated_speed");
	}

	else if(qrs == 'CO2-Ausstoss'){
			var jsonStringInterpolationCO = '{"interpolated_co2_values": [';

		for(var i = 1; i < selection.length; i++){
		if( i < 100){
			jsonStringInterpolationCO = jsonStringInterpolationCO +	'{"latitude":'+ interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , ' + '"CO2":' + interpolated.phenomenons.CO2[i-1] + "}" + ",";             
		}
		}
			var jsonStringFInterpolationCO = jsonStringInterpolationCO.substr(0, jsonStringInterpolationCO.length-1);
			var jsonResultInterpolationCO = jsonStringFInterpolationCO + "] }";
			var jsonResultFileInterpolationCO = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolationCO + ")")));	
			downloadwindow(jsonResultFileInterpolationCO,"interpolated_co2");
	}

	else if(qrs == 'Spritverbrauch'){
		var jsonStringInterpolationCon = '{"interpolated_consumption_values": [';

		for(var i = 1; i < selection.length; i++){
		if( i < 100){
			jsonStringInterpolationCon = jsonStringInterpolationCon +	'{"latitude":'+ interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , ' + '"consumption":' + interpolated.phenomenons.Consumption[i-1] + "}" + ",";             
		}
		}
			var jsonStringFInterpolationCon = jsonStringInterpolationCon.substr(0, jsonStringInterpolationCon.length-1);
			var jsonResultInterpolationCon = jsonStringFInterpolationCon + "] }";

			var jsonResultFileInterpolationCon = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolationCon + ")")));
		    
			downloadwindow(jsonResultFileInterpolationCon,"interpolated_consumption");
	}
	else if(qrs == 'MAF-Werte'){
		
		var jsonStringInterpolationMAF = '{"interpolated_MAF_values": [';

		for(var i = 1; i < selection.length; i++){
		if( i < 100){
			jsonStringInterpolationMAF = jsonStringInterpolationMAF + '{"latitude":' + interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , '  + '"MAF":' + interpolated.phenomenons.MAF[i-1] + "}" + ",";             
		}
		}
			var jsonStringFInterpolationMAF = jsonStringInterpolationMAF.substr(0, jsonStringInterpolationMAF.length-1);
			var jsonResultInterpolationMAF = jsonStringFInterpolationMAF + "] }";

			var jsonResultFileInterpolationMAF = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolationMAF + ")")));
			
		downloadwindow(jsonResultFileInterpolationMAF,"interpolated_MAF");
	}
}


/****************************
	2. Download Window
****************************/

// 2 Download Window
// Description: open window
// Author: Johanna Möllmann + Nicholas Schiestel
function downloadwindow(resultData,name){
	
	$('#downloadInterpolationDialog').html('M&ouml;chten Sie die Interpolationsergebnisse als .json-Datei herunterladen?<br>');

	$('#downloadInterpolationDialog').dialog({ 
		width: 600,
		autoOpen: true,   
		modal: true,
	});	
	
	$('<a href="data:' + resultData + '" download="' + name + '.json"><div style="text-align: right;"><hr><input type="button" name="confirmDownload" value="Herunterladen" class="jQueryButton"></div></a>').appendTo('#downloadInterpolationDialog');	
}

