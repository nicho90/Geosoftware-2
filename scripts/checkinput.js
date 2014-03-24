/********************************************************************************************
		Checkinput
		
This file contains all functions needed for checking the input of the kriging interpolation

*********************************************************************************************/

/****************************
	Check Users Input
****************************/

// Checks User Input
// Description: Checks entered data of user for kriging
// Auhtor: Nicholas Schiestel
function checkUserInput() {

var firstParameter = false;    
var secondParameter = false;  
    
	// check if alpha value is within range
    if(document.getElementById('alpha').value <= 100 && document.getElementById('alpha').value > 0) {
        firstParameter = true;
    }
    
	// throw error if value is out of range
    else {  
        firstParameter = false;
        var dialog = $('<p>Bitte tragen Sie für Alpha eine Zahl zwischen 1 und 100 ein.</p>').dialog({
            width:600,
            buttons: {
                "OK":  function() {dialog.dialog('close');}
 		    }
 		});
    }
    
	// check if sigma2 value is within range
    if(document.getElementById('sigmatwo').value <= 100 && document.getElementById('sigmatwo').value > 0) {
        secondParameter = true;
    }
    
	// throw error if value is out of range
    else {  
        secondParameter = false;
        var dialog = $('<p>Bitte tragen Sie für Simga<sup>2</sup> eine Zahl zwischen 1 und 100 ein.</p>').dialog({
            width:600,
            buttons: {
                "OK":  function() {dialog.dialog('close');}
 			}
 		});
    }
    
	// start interpolation if both values are accepted
    if(firstParameter && secondParameter) {
        startInterpolation();
    }
}