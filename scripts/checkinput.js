function checkUserInput() {

var firstParameter = false;    
var secondParameter = false;  
    
    if(document.getElementById('alpha').value <= 100 && document.getElementById('alpha').value > 0) {
        firstParameter = true;
    }
    
    else {  
            firstParameter = false;
            var dialog = $('<p>Bitte tragen Sie für Alpha eine Zahl zwischen 1 und 100 ein.</p>').dialog({
                width:600,
                height:200,
                buttons: {
                    "OK":  function() {dialog.dialog('close');}
 			    }
 		     });
    }
    
    if(document.getElementById('sigmatwo').value <= 100 && document.getElementById('sigmatwo').value > 0) {
        secondParameter = true;
    }
    
    else {  
            secondParameter = false;
            var dialog = $('<p>Bitte tragen Sie für Simga<sup>2</sup> eine Zahl zwischen 1 und 100 ein.</p>').dialog({
                width:600,
                height:200,
                buttons: {
                    "OK":  function() {dialog.dialog('close');}
 			    }
 		     });
    }
    
    if(firstParameter && secondParameter) {
        startInterpolation();
    }
}