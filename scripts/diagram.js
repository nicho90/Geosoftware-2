// Visualize the diagram for the analysis
// authors: Nicho and Johanna
function diagrams() {
$('#diagram').html('<div id=diagramBar class=popuplinks>'+
						'<ul>'+
							'<li><a href="">Geschwindigkeit</a></li>'+
							'<li><a href="">CO2-Ausstoss</a></li>'+
							'<li><a href="">Spritverbrauch</a></li>'+
							'<li><a href="">MAF</a></li>'+
							'<li><a href="">Fahrzeugtypen</a></li>'+
						'</ul>'+
					'</div>'+
					'<div id=container style="width: 100%; height: 90%; margin: 0 auto;"></div>');
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
                text: 'Verteilung der Geschwindigkeit'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                    '0-5',
					'5-10',
					'10-15',
					'15-20',
					'20-25',
					'25-30',
					'30-35',
					'35-40',
					'40-45',
					'45-50',
					'50-55',
					'55-60',
					'60-65',
					'65-70',
					'70-75',
					'75-80'
					/*
					'80-85',
					'85-90',
					'90-95',
					'95-100',
					'100-105',
					'105-110',
					'110-115',
					'115-120',
					'120-125',
					'125-130',
					'130-135',
					'135-140',
					'140-145',
					'145-150',
					'150-155',
					'155-160',
					'160-165',
					'165-170',
					'170-175',
					'175-180',
					'>180'
					*/
                ]
            },
            yAxis: {
                min: 0,
				max: 100,
                title: {
                    text: 'Haeufigkeit [%]'
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
                name: 'Geschwindigkeit [km/h]',
                data: [ 0, 
						20, 
						21, 
						50,
						1, 
						6, 
						5, 
						80, 
						40, 
						20, 
						90, 
						100, 
						20, 
						80,
						3,
						6
					],
				color: '#8CBC3E'
    
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