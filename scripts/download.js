// Download the results of the user interaction with the application
// author: Johanna Möllmann

/***********************************************
    1. download the selected measurement points
***********************************************/

function download_measurementPoints(){

if(selection.length > 0){

	var jsonString = '{"measurements": [';

	$.each(selection, function(i, measurement){
			lat = selection[i].geometry.coordinates[1];
			lon = selection[i].geometry.coordinates[0];
			point = i + 1;
			jsonString = jsonString + '{"latitude":'+selection[i].geometry.coordinates[1]+ ' , ' +  '"longitude":' + selection[i].geometry.coordinates[0]+ ' , ' + '"sensorID":' + '"'+ measurement.properties.sensor.properties.id + '"'+ ' , ' + '"time":' + '"'+ measurement.properties.time + '"'+  ' , ' + 	'"manufacturer":' + '"'+ measurement.properties.sensor.properties.manufacturer + '"'+ ' , ' + '"model":' + '"'+ measurement.properties.sensor.properties.model + '"'+ ' , ' + 	'"speed":'+ measurement.properties.phenomenons.Speed.value + ' , ' + '"CO2":' +  measurement.properties.phenomenons.CO2.value + ' , ' + '"consumption":' + measurement.properties.phenomenons.Consumption.value + ' , ' + '"MAF":' + measurement.properties.phenomenons.MAF.value  + "}" + ",";	
		});
	var jsonStringF = jsonString.substr(0, jsonString.length-1);
	var jsonResult = jsonStringF + '] }';

	var jsonResultFile = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResult + ")")));

	$('#downloadMpDialog').html('M&ouml;chten Sie die ausgew&auml;hlten Messpunkte als .json-Datei herunterladen?<br>');
					
		$('#downloadMpDialog').dialog({ 
			height:260,
			width: 600,
			autoOpen: true,   
			modal: true,
		});	

	var name = new Date();
	$('<a href="data:' + jsonResultFile + '" download="' + name.getTime() + '.json"><div style="text-align: right;"><input type="button" name="confirmDownload" value="Herunterladen"></div></a>').appendTo('#downloadMpDialog');
	
	}
else{
	var downloadmpDialog = $('<p>Um die Downloadfunktion nutzen zu k&ouml;nnen, muss sich mindestens ein Punkt in Ihrer Auswahl befinden.<br>Bitte selektieren Sie einen oder mehrere Punkte.</p>').dialog({
			buttons: {
				"OK": function() {downloadmpDialog.dialog('close');}
			},
			width: 600,
            height:220
		});
	}

}

/***********************************************
    2. download the interpolation result
***********************************************/

function downloadInterpolation(){

var jsonStringInterpolation = '{"interpolated_values": [';

for(var i = 1; i < interpolated.length; i++){
	jsonStringInterpolation = jsonStringInterpolation +	'{"latitude":'+ interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , ' + '"speed":'	+	interpolated.phenomenons.Speed[i-1] + ' , ' + '"CO2":' + interpolated.phenomenons.CO2[i-1] + ' , ' + '"consumption":' + interpolated.phenomenons.Consumption[i-1] + ' , ' + '"MAF":' + interpolated.phenomenons.MAF[i-1] + "}" + ",";             
	}
	var jsonStringFInterpolation = jsonStringInterpolation.substr(0, jsonStringInterpolation.length-1);
	var jsonResultInterpolation = jsonStringFInterpolation + "] }";

	var jsonResultFileInterpolation = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolation + ")")));
	
	alert(jsonResultFileInterpolation);
	
	$('#downloadInterpolationDialog').html('M&ouml;chten Sie die berechneten Interpolationsergebnisse als .json-Datei herunterladen?<br>');
					
		$('#downloadInterpolationDialog').dialog({ 
			height:260,
			width: 600,
			autoOpen: true,   
			modal: true,
		});	

	//var nameI = new Date();
	//$('<a href="data:' + jsonResultFileInterpolation + '" download="' + "interpolation" + '.json"><div style="text-align: right;"><input type="button" name="confirmDownload" value="Herunterladen"></div></a>').appendTo('#downloadInterpolationDialog');
	
	
	
}