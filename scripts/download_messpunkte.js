function download_sel_pkte(){

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
			height:220,
			width: 600,
			autoOpen: true,   
			modal: true,
		});	

	var name = new Date();
	$('<a href="data:' + jsonResultFile + '" download="' + name.getTime() + '.json"><div style="text-align: right;"><input type="button" name="confirmDownload" value="Herunterladen"></div></a>').appendTo('#downloadMpDialog');
	//$('#downloadMpDialog').dialog('close');	
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