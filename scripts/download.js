// Download the results of the user interaction with the application
// Author: Johanna Möllmann

/***********************************************
    1. Download the selected measurement points
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
            title: "Error"
		});
	}

}

/***********************************************
    2. Download the interpolation result
***********************************************/

function downloadInterpolation(){

var selectionBox = document.getElementById('analysisSelectionBox');

	if(selectionBox.options[selectionBox.selectedIndex].value == 'Geschwindigkeit'){
			
			var jsonStringInterpolationSpeed = '{"interpolated_speed_values": [';

			for(var i = 1; i < selection.length; i++){
				if( i < 100){
				jsonStringInterpolationSpeed = jsonStringInterpolationSpeed +	'{"latitude":'+ interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , ' + '"speed":'	+	interpolated.phenomenons.Speed[i-1] + "}" + ",";             
			}
			}
				var jsonStringFInterpolationSp = jsonStringInterpolationSpeed.substr(0, jsonStringInterpolationSpeed.length-1);
				var jsonResultInterpolationSp = jsonStringFInterpolationSp + "] }";
				var jsonResultFileInterpolationSp = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolationSp + ")")));
	
	downloadwindow(jsonResultFileInterpolationSp);
	}

	else if(selectionBox.options[selectionBox.selectedIndex].value == 'CO2'){
			var jsonStringInterpolationCO = '{"interpolated_co2_values": [';

		for(var i = 1; i < selection.length; i++){
		if( i < 100){
			jsonStringInterpolationCO = jsonStringInterpolationCO +	'{"latitude":'+ interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , ' + '"CO2":' + interpolated.phenomenons.CO2[i-1] + "}" + ",";             
		}
		}
			var jsonStringFInterpolationCO = jsonStringInterpolationCO.substr(0, jsonStringInterpolationCO.length-1);
			var jsonResultInterpolationCO = jsonStringFInterpolationCO + "] }";
			var jsonResultFileInterpolationCO = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolationCO + ")")));	
			downloadwindow(jsonResultFileInterpolationCO);
	}

	else if(selectionBox.options[selectionBox.selectedIndex].value == 'Spritverbrauch'){
		var jsonStringInterpolationCon = '{"interpolated_consumption_values": [';

		for(var i = 1; i < selection.length; i++){
		if( i < 100){
			jsonStringInterpolationCon = jsonStringInterpolationCon +	'{"latitude":'+ interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , ' + '"consumption":' + interpolated.phenomenons.Consumption[i-1] + "}" + ",";             
		}
		}
			var jsonStringFInterpolationCon = jsonStringInterpolationCon.substr(0, jsonStringInterpolationCon.length-1);
			var jsonResultInterpolationCon = jsonStringFInterpolationCon + "] }";

			var jsonResultFileInterpolationCon = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolationCon + ")")));
		    
			downloadwindow(jsonResultFileInterpolationCon);
	}
	else if(selectionBox.options[selectionBox.selectedIndex].value == 'MAF'){
		
		var jsonStringInterpolationMAF = '{"interpolated_MAF_values": [';

		for(var i = 1; i < selection.length; i++){
		if( i < 100){
			jsonStringInterpolationMAF = jsonStringInterpolationMAF + '{"latitude":' + interpolated.latitude[i-1]+ ' , ' + '"longitude":' + interpolated.longitude[i-1] + ' , '  + '"MAF":' + interpolated.phenomenons.MAF[i-1] + "}" + ",";             
		}
		}
			var jsonStringFInterpolationMAF = jsonStringInterpolationMAF.substr(0, jsonStringInterpolationMAF.length-1);
			var jsonResultInterpolationMAF = jsonStringFInterpolationMAF + "] }";

			var jsonResultFileInterpolationMAF = "text/json;charset=utf-8," + escape(JSON.stringify(eval("(" + jsonResultInterpolationMAF + ")")));
		downloadwindow(jsonResultFileInterpolationMAF);
	}
}


//Description: this function opens the window, which asks the user about the download
//Author: Johanna and Nicho
function downloadwindow(resultData){
	
$('#downloadInterpolationDialog').html('M&ouml;chten Sie die berechneten Interpolationsergebnisse als .json-Datei herunterladen?<br>');
					
	$('#downloadInterpolationDialog').dialog({ 
		width: 600,
		autoOpen: true,   
		modal: true,
	});	


$('<a href="data:' + resultData + '" download="' + "interpolated_values" + '.json"><div style="text-align: right;"><hr><input type="button" name="confirmDownload" value="Herunterladen" class="jQueryButton"></div></a>').appendTo('#downloadInterpolationDialog');		
	
}