/********************************************************************************************
		Tooltips
		
Description: This function is used to show little tooltips with notes and hints for the user.
Source: http://onehackoranother.com/projects/jquery/tipsy/ 

********************************************************************************************/

$(function() {
                // $('a[rel=tipsy]').tipsy({fade: true, gravity: 'w'}); // nw | n | ne | w | e | sw | s | se  // default settings
                $('#chooseSinglePoint').tipsy({fade:false, gravity: 'n'});
                $('#chooseTrack').tipsy({fade:false, gravity: 'n'});
                $('#choosePolygon').tipsy({fade:false, gravity: 'n'}); 
                $('#interpolationInfo').tipsy({fade:false, gravity: 'e'});
                $('#maxOfMeasurementsInfo').tipsy({fade:false, gravity: 'n'});
                $('#visualisation').tipsy({fade:false, gravity: 'e'});
                $('#interpolationDownload').tipsy({fade:false, gravity: 'e'});
                $('#trackSelectingInfo').tipsy({fade:false, gravity: 'e'});
                $('#polygonSelectingInfo').tipsy({fade:false, gravity: 'e'});
                $('#krigingModelInfo').tipsy({fade:false, gravity: 'e'});
                $('#SimgaInfo').tipsy({fade:false, gravity: 'e'});
                $('#alphaInfo').tipsy({fade:false, gravity: 'e'});
});