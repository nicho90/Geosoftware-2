// Visualize the diagram for the analysis
// authors: Nicho and Johanna

$(function () {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Punktdatenauswertung'
            },
            subtitle: {
                text: 'Mit ersten Werten bef�llt'
            },
            xAxis: {
                categories: [
                    'Durchschnittswerte',
					'Standartabweichung',
					'Minimum',
					'Maximum'
                ]
            },
            yAxis: {
                min: 0,
				max: 100,
                title: {
                    text: 'Anzahl'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
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
			// Author: Leon Vogel
			// Achtung! Funktioniert lokal nur mit Firefox. Mit Chrome wird hier nichts angezeigt, aber nur wenn man das Projekt lokal aufmacht.
			// Handelt sich um ein internes Sicherheitsproblem bei Chrome, wenn man die Seite aber �ber den Server anspricht, funktioniert es auch in Chrome.
            series: [{
                name: 'Geschwindigkeit',
                data: [window.opener.getMean('Speed'), window.opener.getSD('Speed'), window.opener.getMin('Speed').value, window.opener.getMax('Speed').value]
    
            }, {
                name: 'CO2 Aussto�',
                data: [window.opener.getMean('CO2'), window.opener.getSD('CO2'), window.opener.getMin('CO2').value, window.opener.getMax('CO2').value]
    
            }, {
                name: 'Kraftstoffverbrauch',
                data: [window.opener.getMean('Consumption'), window.opener.getSD('Consumption'), window.opener.getMin('Consumption').value, window.opener.getMax('Consumption').value]
    
            }, {
                name: 'Mass Air Flow',
                data: [window.opener.getMean('MAF'), window.opener.getSD('MAF'), window.opener.getMin('MAF').value, window.opener.getMax('MAF').value]
    
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