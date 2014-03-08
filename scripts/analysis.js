/********************************************************************************************
		Analysis
		
This file contains all functions needed for executing the different analysis.
You will find all functions for computing and displaying the analysis.
Many of these functions are also used by interpolation. So please be careful!

********************************************************************************************
Content

1. Update Analysis

2. Compute Statistics
	2.1 Compute Mean Value
	2.2 Compute Standard Deviation
	2.3 Get Minimum Value
	2.4 Get Maximum Value
	2.5 Get Most Frequent Manufacturer
	2.6 Refresh Manufacturers

*********************************************************************************************/

/****************************
	1. Update Analysis
****************************/


// Update Analysis
// Description: Refreshes the current Analysis
// Author: Rene Unrau
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
			
			result.append("Bitte w�hlen Sie zuerst einige Messpunkte aus.</table>");
		}else{
	
			var mostFreqManu = getMostFreqManu();
			result.append("<tr><td><td><b>H�ufigster Fahrzeugtyp</b></td><td>" + mostFreqManu + "(" + manufacturerSelection[mostFreqManu] + ")</td></tr></table>");
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

/****************************
	2. Compute Statistics
****************************/


// 2.1 Get Mean Value
// Description: Returns mean for a given phenomenon
// Author: Rene Unrau
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

// 2.2 Get StandardDeviation
// Description: Returns standard deviation for a given phenomenon
// Author: Rene Unrau
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

// 2.3 Get Minimum
// Description: Returns minimum for a given phenomenon
// Author: Rene Unrau
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

// 2.4 Get Maximum
// Description: Returns maximum for a given phenomenon
// Author: Rene Unrau
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

// 2.5 Get Most Frequent Manufacturer
// Description: Returns manufactures which is most frequent in selection
// Author: Rene Unrau
function getMostFreqManu(){

	return getMax('Manufacturer');

}


// 2.6 Refresh Manufacturers
// Description: Refresh Manufacturers Arrays
// Author: Rene Unrau
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