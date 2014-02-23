 $(function() {
	            // Ursprügnliche Einstellung:
                // $('a[rel=tipsy]').tipsy({fade: true, gravity: 'w'}); // nw | n | ne | w | e | sw | s | se
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