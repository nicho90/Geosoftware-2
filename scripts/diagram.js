// Visualize the diagram for the analysis
// authors: Nicho and Johanna
function diagrams() {
    
var interval_0_5   = 0;
var interval_5_10  = 0;
var interval_10_15 = 0;
var interval_15_20 = 0;
var interval_20_25 = 0;
var interval_25_30 = 0;
var interval_30_35 = 0;
var interval_35_40 = 0;
var interval_40_45 = 0;
var interval_45_50 = 0;
var interval_50_55 = 0;
var interval_55_60 = 0;
var interval_60_65 = 0;
var interval_65_70 = 0;
var interval_70_75 = 0;
var interval_75_80 = 0;
var interval_gr_80 = 0;
var gesamt = selection.length;



for(var i = 0; i < selection.length; i++){
			// If speed is not undefined
			if (selection[i].properties.phenomenons.Speed.value == '-'){
				gesamt = gesamt-1;
			}
			// If speed is defined
			else {
				// check if value is a positive value; values smaller 0 will be ignored
				if( selection[i].properties.phenomenons.Speed.value < 0){
					gesamt = gesamt-1;
				}
				// checks for the right interval
				if(selection[i].properties.phenomenons.Speed.value >= 0 && selection[i].properties.phenomenons.Speed.value  <= 5){interval_0_5++;}
				if(selection[i].properties.phenomenons.Speed.value >  5 && selection[i].properties.phenomenons.Speed.value  <= 10){interval_5_10++;}
				if(selection[i].properties.phenomenons.Speed.value > 10 && selection[i].properties.phenomenons.Speed.value  <= 15){interval_10_15++;}
				if(selection[i].properties.phenomenons.Speed.value > 15 && selection[i].properties.phenomenons.Speed.value  <= 20){interval_15_20++;}
				if(selection[i].properties.phenomenons.Speed.value > 20 && selection[i].properties.phenomenons.Speed.value  <= 25){interval_20_25++;}
				if(selection[i].properties.phenomenons.Speed.value > 25 && selection[i].properties.phenomenons.Speed.value  <= 30){interval_25_30++;}
				if(selection[i].properties.phenomenons.Speed.value > 30 && selection[i].properties.phenomenons.Speed.value  <= 35){interval_30_35++;}
				if(selection[i].properties.phenomenons.Speed.value > 35 && selection[i].properties.phenomenons.Speed.value  <= 40){interval_35_40++;}
				if(selection[i].properties.phenomenons.Speed.value > 40 && selection[i].properties.phenomenons.Speed.value  <= 45){interval_40_45++;}
				if(selection[i].properties.phenomenons.Speed.value > 45 && selection[i].properties.phenomenons.Speed.value  <= 50){interval_45_50++;}
				if(selection[i].properties.phenomenons.Speed.value > 50 && selection[i].properties.phenomenons.Speed.value  <= 55){interval_50_55++;}
				if(selection[i].properties.phenomenons.Speed.value > 55 && selection[i].properties.phenomenons.Speed.value  <= 60){interval_55_60++;}
				if(selection[i].properties.phenomenons.Speed.value > 60 && selection[i].properties.phenomenons.Speed.value  <= 65){interval_60_65++;}
				if(selection[i].properties.phenomenons.Speed.value > 65 && selection[i].properties.phenomenons.Speed.value  <= 70){interval_65_70++;}
				if(selection[i].properties.phenomenons.Speed.value > 70 && selection[i].properties.phenomenons.Speed.value  <= 75){interval_70_75++;}
				if(selection[i].properties.phenomenons.Speed.value > 75 && selection[i].properties.phenomenons.Speed.value  <= 80){interval_75_80++;}
				if(selection[i].properties.phenomenons.Speed.value > 80){interval_gr_80++;}	
			}
}

var ergebnis = new Array(
                        (interval_0_5/gesamt)*100,
                        (interval_5_10/gesamt)*100,
                        (interval_10_15/gesamt)*100,
                        (interval_15_20/gesamt)*100,
						(interval_20_25/gesamt)*100,
						(interval_25_30/gesamt)*100,
						(interval_30_35/gesamt)*100,
						(interval_35_40/gesamt)*100,
						(interval_40_45/gesamt)*100,
						(interval_45_50/gesamt)*100,
						(interval_50_55/gesamt)*100,
						(interval_55_60/gesamt)*100,
						(interval_60_65/gesamt)*100,
						(interval_65_70/gesamt)*100,
						(interval_70_75/gesamt)*100,
						(interval_75_80/gesamt)*100,
						(interval_gr_80/gesamt)*100);
					
var maxErgebnis = Math.max(ergebnis[0],ergebnis[1],ergebnis[2],ergebnis[3],ergebnis[4],ergebnis[5],ergebnis[6],ergebnis[7],ergebnis[8],ergebnis[9],ergebnis[10],
ergebnis[11],ergebnis[12],ergebnis[13],ergebnis[14],ergebnis[15],ergebnis[16]);

$('#diagram').html('<div id=diagramBar class=popuplinks>'+
						'<ul>'+
							'<li><a href="" class=link>Geschwindigkeit</a></li>'+
							'<li><a href="" class=link>CO2-Aussto&szlig;</a></li>'+
							'<li><a href="" class=link>Spritverbrauch</a></li>'+
							'<li><a href="" class=link>MAF</a></li>'+
							'<li><a href="" class=link>Fahrzeugtypen</a></li>'+
						'</ul>'+
					'</div>'+
					'<div id=container style="width: 100%; height: 520px; margin: 0 auto;"></div>');
		$('#diagram').dialog({ 
		//autoOpen: true,   
		//modal: true,
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
					'75-80',
					'>80'
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
				max: maxErgebnis,
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
                data: [ (interval_0_5/gesamt)*100,
						(interval_5_10/gesamt)*100,
						(interval_10_15/gesamt)*100,
						(interval_15_20/gesamt)*100,
						(interval_20_25/gesamt)*100,
						(interval_25_30/gesamt)*100,
						(interval_30_35/gesamt)*100,
						(interval_35_40/gesamt)*100,
						(interval_40_45/gesamt)*100,
						(interval_45_50/gesamt)*100,
						(interval_50_55/gesamt)*100,
						(interval_55_60/gesamt)*100,
						(interval_60_65/gesamt)*100,
						(interval_65_70/gesamt)*100,
						(interval_70_75/gesamt)*100,
						(interval_75_80/gesamt)*100,
						(interval_gr_80/gesamt)*100
					],
				color: '#8CBC3E'
            }]
        });
    });



    
}
   
 