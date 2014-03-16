/********************************************************************************************
		Filter
		
This file contains functions for manipulating markers on the map by user-inputs.
The functions are used for checking parameters in a single measurment, start the filtering process and 
reseting all filters. With influence on our visualisations and user interface.

********************************************************************************************
Content

1. Check Filter

2. Start Filter

3. Reset Filter

*********************************************************************************************/


/***********************
	1. Check Filter
***********************/

// Check Filter
// Description: Checks for a single measurment if it should be drawn on map
// Author: Reneé Unrau, Christian Peters
function checkFilter(measurement){

	var geometry = measurement.geometry;
	var properties = measurement.properties;
	var sensor = properties.sensor;
	var phenomenons = properties.phenomenons;

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
}

/***********************
	2. Start Filter
***********************/

// 2 Start Filter
// Description: Start the filter if button 'OK' is pressed 
// Author: Christian Peters
function startFilter() {

    startForm = document.filterFormular.Start.value;
    endForm = document.filterFormular.Ende.value;
    typForm = document.filterFormular.Typ.value;
    sensorForm = document.filterFormular.Sensor_ID.value;
    
    if(startForm==null || startForm=="") {
        if(endForm==null || endForm=="") {
            if(typForm==null || typForm=="") {
                if(sensorForm==null || sensorForm=="") {
					var dialog=$('<p>Sie haben keine Filterkriterien angegeben. Bitte setzen Sie mindestens ein Kriterium.</p>').dialog({
						width: 600,
						title: 'Error 401',
						buttons:{
							"OK":function(){dialog.dialog('close');}
						}
					});
                return false;
                }
            }
        }
    }
	drawMeasurements();
}

/***********************
	3. Start Filter
***********************/

// 3 Reset Filter
// Description: Reset the filter to update the measurements
// Author: Christian Peters, René Unrau
function resetFilter() {
    document.filterFormular.Start.value = "";
    document.filterFormular.Ende.value = "";
    document.filterFormular.Typ.value = "";
    document.filterFormular.Sensor_ID.value = "";
	
	startForm = "";
	endForm = "";
	typForm = "";
	sensorForm = "";
	
    drawMeasurements();
}