function toggle_visibility(id) {
                var e = document.getElementById(id);
                if (e.style.display != 'block') {
                        e.style.display = 'block';
                }
                else {
                        e.style.display = 'none';
                }
}


// function to show Kriging-options if Radiobutton is selected 
function showhidediv(rad){
    var rads=document.getElementsByName(rad.name);
    document.getElementById('idwBox').style.display=(rads[0].checked)?'block':'none' ;
    document.getElementById('krigingBox').style.display=(rads[1].checked)?'block':'none' ;
}