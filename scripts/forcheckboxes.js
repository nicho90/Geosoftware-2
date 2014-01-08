// für selektierte Punkte
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

// für selektierte Tracks
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