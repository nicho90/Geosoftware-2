// Visualize the diagram for the analysis
// authors: Nicho and Johanna
function diagrams() {
$('#diagram').html('<div id=diagramBar class=popuplinks>'+
						'<ul>'+
							'<li><a href="">Geschwindigkeit</a></li>'+
							'<li><a href="">Spritverbrauch</a></li>'+
							'<li><a href="">MAF</a></li>'+
							'<li><a href="">Fahrzeugtypen</a></li>'+
						'</ul>'+
					'</div>'+
					'<div id=container style="width: 80%; height: 80%; margin: 0 auto;"></div>');
		$('#diagram').dialog({ 
		autoOpen: true,   
		modal: true,
		width: 900,
		height: 620});
		
$(function () {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: [
                    'Autotypen'
                ]
            },
            yAxis: {
                min: 0,
				max: 100,
                title: {
                    text: 'Häufigkeit [%]'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Autotyp 4',
                data: [20]
    
            }, {
                name: 'Autotyp 3',
                data: [20]
    
            }, {
                name: 'Autotyp 2',
                data: [30]
    
            }, {
                name: 'Autotyp 1',
                data: [30]
    
            }]
        });
    });
    
var chart1; // globally available
$(function() {
      chart1 = new Highcharts.StockChart({
         chart: {
            renderTo: 'container'
         },
         rangeSelector: {
            selected: 1
         },
         series: [{
            name: 'USD to EUR',
            data: usdtoeur // predefined JavaScript array
         }]
      });
   });
   
   }