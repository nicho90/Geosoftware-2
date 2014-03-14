/********************************************************************************************
		Toogle
		
These functions are used to show and hide content of the webpage. For example it is used to
show the sidebarboxes "selected points" only when a point was selected. The box "analyse" 
is displayed when a minimum of 2 points are selected and the box for the "interpolation" is
displayed when a track was selected. But the user has the possibilty to extend these 
boxes manually.

********************************************************************************************/

// for DIV elements
function toggle_visibility(id) {
                var e = document.getElementById(id);
                if (e.style.display != 'block' || e.style.display == null || e.style.display == undefined) {
                        e.style.display = 'block';
                }
                else {
                        e.style.display = 'none';
                }
}


// for the Kriging-options if the radiobutton for kriging was selected 
function showhidediv(rad){
    var rads=document.getElementsByName(rad.name);
    document.getElementById('idwBox').style.display=(rads[0].checked)?'block':'none' ;
    document.getElementById('krigingBox').style.display=(rads[1].checked)?'block':'none' ;
}