$(function() {
                $( "#Start" ).datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 1,
                    onClose: function( selectedDate ) {
                        $( "#Ende" ).datepicker( "option", "minDate", selectedDate );
                    }
                });
                $( "#Ende" ).datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    numberOfMonths: 1,
                    onClose: function( selectedDate ) {
                        $( "#Start" ).datepicker( "option", "maxDate", selectedDate );
                    }
                });
            });