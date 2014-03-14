/********************************************************************************************
		Forcheckboxes
		
These functions allows the user to selecet from a list, all checkboxes with selecting
only one checkbox. It is used in the selected points list in the sidebar.

********************************************************************************************
Content

1. for selected points

2. for selected tracks

*********************************************************************************************/



/****************************
	1. for selected points
****************************/
$(function(){
    $('#checkAll').change(function(){
        $('.chk').prop('checked',this.checked);
    });

    $(".chk").change(function () {
        if ($(".chk:checked").length == $(".chk").length) {
            $('#checkAll').prop('checked','checked');
            }
            else{
                $('#checkAll').prop('checked',false);  
            }
    });
});


/****************************
	2. for selected tracks
****************************/
$(function(){
    $('#checkAll2').change(function(){
        $('.chk2').prop('checked',this.checked);
    });

    $(".chk2").change(function () {
        if ($(".chk2:checked").length == $(".chk2").length) {
            $('#checkAll2').prop('checked','checked');
            }
            else{
                $('#checkAll2').prop('checked',false);  
            }
    });
});