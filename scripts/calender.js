/********************************************************************************************
		Calendar
		
This file contains all functions needed for displaying the calendar and retrieving infomration

*********************************************************************************************/

/****************************
	Calendar Functions
****************************/

$(function() {
	// datepicker for start of filter
    $( "#Start" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
			$( "#Ende" ).datepicker( "option", "minDate", selectedDate );
		}
    });
	
	// datepicker for end of filter
	$( "#Ende" ).datepicker({
		defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
			$( "#Start" ).datepicker( "option", "maxDate", selectedDate );
        }
    });
});