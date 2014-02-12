// Visualize the diagram for the analysis
// authors: Nicho and Johanna

/***********************************************
1. Diagrammloader
***********************************************/
function diagrams() {

$('#diagram').html('<div id=diagramBar class=popuplinks>'+
'<ul>'+
'<li><a href="#diagram" onclick="diagramSpeed()" class=link>Geschwindigkeit</a></li>'+
'<li><a href="#diagram" onclick="diagramCO2()" class=link>CO2-Aussto&szlig;</a></li>'+
'<li><a href="#diagram" onclick="diagramConsumption()" class=link>Spritverbrauch</a></li>'+
'<li><a href="#diagram" onclick="diagramMAF()" class=link>MAF</a></li>'+
'<li><a href="#diagram" onclick="diagramCarType()" class=link>Fahrzeugtypen</a></li>'+
'</ul>'+
'</div>'+
'<div id=container style="width: 100%; height: 520px; margin: 0 auto;"></div>');
$('#diagram').dialog({
//autoOpen: true,
//modal: true,
width: 900,
height: 620});

diagramSpeed();

}




/***********************************************
1. Diagramm for speed
***********************************************/
function diagramSpeed() {

// Variables for speed diagram for small values, e.g. city traffic
var interval_0_5 = 0;
var interval_5_10 = 0;
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
// Variables for speed diagram for big values, e.g. highway traffic
var interval_0_10 = 0;
var interval_10_20 = 0;
var interval_20_30 = 0;
var interval_30_40 = 0;
var interval_40_50 = 0;
var interval_50_60 = 0;
var interval_60_70 = 0;
var interval_70_80 = 0;
var interval_80_90 = 0;
var interval_90_100 = 0;
var interval_100_110 = 0;
var interval_110_120 = 0;
var interval_120_130 = 0;
var interval_130_140 = 0;
var interval_140_150 = 0;
var interval_150_160 = 0;
var interval_gr_160 = 0;




/***********************************************
1.1 Diagramm for low speed values
***********************************************/

var gesamt = selection.length;

for (var i = 0; i < selection.length; i++){
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
		if(selection[i].properties.phenomenons.Speed.value >= 0 && selection[i].properties.phenomenons.Speed.value <= 5){interval_0_5++;}
		if(selection[i].properties.phenomenons.Speed.value > 5 && selection[i].properties.phenomenons.Speed.value <= 10){interval_5_10++;}
		if(selection[i].properties.phenomenons.Speed.value > 10 && selection[i].properties.phenomenons.Speed.value <= 15){interval_10_15++;}
		if(selection[i].properties.phenomenons.Speed.value > 15 && selection[i].properties.phenomenons.Speed.value <= 20){interval_15_20++;}
		if(selection[i].properties.phenomenons.Speed.value > 20 && selection[i].properties.phenomenons.Speed.value <= 25){interval_20_25++;}
		if(selection[i].properties.phenomenons.Speed.value > 25 && selection[i].properties.phenomenons.Speed.value <= 30){interval_25_30++;}
		if(selection[i].properties.phenomenons.Speed.value > 30 && selection[i].properties.phenomenons.Speed.value <= 35){interval_30_35++;}
		if(selection[i].properties.phenomenons.Speed.value > 35 && selection[i].properties.phenomenons.Speed.value <= 40){interval_35_40++;}
		if(selection[i].properties.phenomenons.Speed.value > 40 && selection[i].properties.phenomenons.Speed.value <= 45){interval_40_45++;}
		if(selection[i].properties.phenomenons.Speed.value > 45 && selection[i].properties.phenomenons.Speed.value <= 50){interval_45_50++;}
		if(selection[i].properties.phenomenons.Speed.value > 50 && selection[i].properties.phenomenons.Speed.value <= 55){interval_50_55++;}
		if(selection[i].properties.phenomenons.Speed.value > 55 && selection[i].properties.phenomenons.Speed.value <= 60){interval_55_60++;}
		if(selection[i].properties.phenomenons.Speed.value > 60 && selection[i].properties.phenomenons.Speed.value <= 65){interval_60_65++;}
		if(selection[i].properties.phenomenons.Speed.value > 65 && selection[i].properties.phenomenons.Speed.value <= 70){interval_65_70++;}
		if(selection[i].properties.phenomenons.Speed.value > 70 && selection[i].properties.phenomenons.Speed.value <= 75){interval_70_75++;}
		if(selection[i].properties.phenomenons.Speed.value > 75 && selection[i].properties.phenomenons.Speed.value <= 80){interval_75_80++;}
		if(selection[i].properties.phenomenons.Speed.value > 80){interval_gr_80++;}
	}
}

var result_low_speed = new Array(
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

var maxResult_low_speed = Math.max( result_low_speed[0],
									result_low_speed[1],
									result_low_speed[2],
									result_low_speed[3],
									result_low_speed[4],
									result_low_speed[5],
									result_low_speed[6],
									result_low_speed[7],
									result_low_speed[8],
									result_low_speed[9],
									result_low_speed[10],
									result_low_speed[11],
									result_low_speed[12],
									result_low_speed[13],
									result_low_speed[14],
									result_low_speed[15],
									result_low_speed[16]);

if(((interval_gr_80/gesamt)*100) <= 10) {

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
                ]
            },
            yAxis: {
                min: 0,
max: maxResult_low_speed,
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

/***********************************************
1.2 Diagramm for high speed values
***********************************************/
else {

var gesamt_high_speed = selection.length;
for(var i = 0; i < selection.length; i++){
// If speed is not undefined
	if (selection[i].properties.phenomenons.Speed.value == '-'){
		gesamt_high_speed = gesamt_high_speed-1;
	}
	// If speed is defined
	else {
	// check if value is a positive value; values smaller 0 will be ignored
		if( selection[i].properties.phenomenons.Speed.value < 0){
			gesamt_high_speed = gesamt_high_speed-1;
		}
		// checks for the right interval
		if(selection[i].properties.phenomenons.Speed.value >= 0 && selection[i].properties.phenomenons.Speed.value <= 10){interval_0_10++;}
		if(selection[i].properties.phenomenons.Speed.value > 10 && selection[i].properties.phenomenons.Speed.value <= 20){interval_10_20++;}
		if(selection[i].properties.phenomenons.Speed.value > 20 && selection[i].properties.phenomenons.Speed.value <= 30){interval_20_30++;}
		if(selection[i].properties.phenomenons.Speed.value > 30 && selection[i].properties.phenomenons.Speed.value <= 40){interval_30_40++;}
		if(selection[i].properties.phenomenons.Speed.value > 40 && selection[i].properties.phenomenons.Speed.value <= 50){interval_40_50++;}
		if(selection[i].properties.phenomenons.Speed.value > 50 && selection[i].properties.phenomenons.Speed.value <= 60){interval_50_60++;}
		if(selection[i].properties.phenomenons.Speed.value > 60 && selection[i].properties.phenomenons.Speed.value <= 70){interval_60_70++;}
		if(selection[i].properties.phenomenons.Speed.value > 70 && selection[i].properties.phenomenons.Speed.value <= 80){interval_70_80++;}
		if(selection[i].properties.phenomenons.Speed.value > 80 && selection[i].properties.phenomenons.Speed.value <= 90){interval_80_90++;}
		if(selection[i].properties.phenomenons.Speed.value > 90 && selection[i].properties.phenomenons.Speed.value <= 100){interval_90_100++;}
		if(selection[i].properties.phenomenons.Speed.value > 100 && selection[i].properties.phenomenons.Speed.value <= 110){interval_100_110++;}
		if(selection[i].properties.phenomenons.Speed.value > 110 && selection[i].properties.phenomenons.Speed.value <= 120){interval_110_120++;}
		if(selection[i].properties.phenomenons.Speed.value > 120 && selection[i].properties.phenomenons.Speed.value <= 130){interval_120_130++;}
		if(selection[i].properties.phenomenons.Speed.value > 130 && selection[i].properties.phenomenons.Speed.value <= 140){interval_130_140++;}
		if(selection[i].properties.phenomenons.Speed.value > 140 && selection[i].properties.phenomenons.Speed.value <= 150){interval_140_150++;}
		if(selection[i].properties.phenomenons.Speed.value > 150 && selection[i].properties.phenomenons.Speed.value <= 160){interval_150_160++;}
		if(selection[i].properties.phenomenons.Speed.value > 160){interval_gr_160++;}
	}
}

var result_high_speed = new Array(
                        (interval_0_10/gesamt_high_speed)*100,
                        (interval_10_20/gesamt_high_speed)*100,
                        (interval_20_30/gesamt_high_speed)*100,
                        (interval_30_40/gesamt_high_speed)*100,
						(interval_40_50/gesamt_high_speed)*100,
						(interval_50_60/gesamt_high_speed)*100,
						(interval_60_70/gesamt_high_speed)*100,
						(interval_70_80/gesamt_high_speed)*100,
						(interval_80_90/gesamt_high_speed)*100,
						(interval_90_100/gesamt_high_speed)*100,
						(interval_100_110/gesamt_high_speed)*100,
						(interval_110_120/gesamt_high_speed)*100,
						(interval_120_130/gesamt_high_speed)*100,
						(interval_130_140/gesamt_high_speed)*100,
						(interval_140_150/gesamt_high_speed)*100,
						(interval_150_160/gesamt_high_speed)*100,
						(interval_gr_160/gesamt_high_speed)*100);

var maxResult_high_speed = Math.max(result_high_speed[0],
									result_high_speed[1],
									result_high_speed[2],
									result_high_speed[3],
									result_high_speed[4],
									result_high_speed[5],
									result_high_speed[6],
									result_high_speed[7],
									result_high_speed[8],
									result_high_speed[9],
									result_high_speed[10],
									result_high_speed[11],
									result_high_speed[12],
									result_high_speed[13],
									result_high_speed[14],
									result_high_speed[15],
									result_high_speed[16]);

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
                    '0-10',
					'10-20',
					'20-30',
					'30-40',
					'40-50',
					'50-60',
					'60-70',
					'70-80',
					'80-90',
					'90-100',
					'100-110',
					'110-120',
					'120-130',
					'130-140',
					'140-150',
					'150-160',
					'>160'
                ]
            },
            yAxis: {
                min: 0,
max: maxResult_high_speed,
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
                data: [ (interval_0_10/gesamt_high_speed)*100,
						(interval_10_20/gesamt_high_speed)*100,
						(interval_20_30/gesamt_high_speed)*100,
						(interval_30_40/gesamt_high_speed)*100,
						(interval_40_50/gesamt_high_speed)*100,
						(interval_50_60/gesamt_high_speed)*100,
						(interval_60_70/gesamt_high_speed)*100,
						(interval_70_80/gesamt_high_speed)*100,
						(interval_80_90/gesamt_high_speed)*100,
						(interval_90_100/gesamt_high_speed)*100,
						(interval_100_110/gesamt_high_speed)*100,
						(interval_110_120/gesamt_high_speed)*100,
						(interval_120_130/gesamt_high_speed)*100,
						(interval_130_140/gesamt_high_speed)*100,
						(interval_140_150/gesamt_high_speed)*100,
						(interval_150_160/gesamt_high_speed)*100,
						(interval_gr_160/gesamt_high_speed)*100
						],
				color: '#8CBC3E'
            }]
        });
    });
}

}
/***********************************************
	3. Diagramm for consumption  
**********************************************/
function diagramConsumption() {

var c_interval_0_5   = 0;
var c_interval_5_10  = 0;
var c_interval_10_15 = 0;
var c_interval_15_20 = 0;
var c_interval_20_25 = 0;
var c_interval_25_30 = 0;
var c_interval_30_35 = 0;
var c_interval_35_40 = 0;
var c_interval_40_45 = 0;
var c_interval_45_50 = 0;
var c_interval_50_55 = 0;
var c_interval_55_60 = 0;
var c_interval_gr_60 = 0;

var c_gesamt = selection.length;

for(var i = 0; i < selection.length; i++){
			// If Consumption is not undefined
			if (selection[i].properties.phenomenons.Consumption.value == '-'){
				c_gesamt = c_gesamt-1;
			}
			// If Consumption is defined
			else {
				// check if value is a positive value; values smaller 0 will be ignored
				if( selection[i].properties.phenomenons.Consumption.value < 0){
					c_gesamt = c_gesamt-1;
				}
				// checks for the right interval
				if(selection[i].properties.phenomenons.Consumption.value >= 0 && selection[i].properties.phenomenons.Consumption.value  <= 5){c_interval_0_5++;}
				if(selection[i].properties.phenomenons.Consumption.value >  5 && selection[i].properties.phenomenons.Consumption.value  <= 10){c_interval_5_10++;}
				if(selection[i].properties.phenomenons.Consumption.value > 10 && selection[i].properties.phenomenons.Consumption.value  <= 15){c_interval_10_15++;}
				if(selection[i].properties.phenomenons.Consumption.value > 15 && selection[i].properties.phenomenons.Consumption.value  <= 20){c_interval_15_20++;}
				if(selection[i].properties.phenomenons.Consumption.value > 20 && selection[i].properties.phenomenons.Consumption.value  <= 25){c_interval_20_25++;}
				if(selection[i].properties.phenomenons.Consumption.value > 25 && selection[i].properties.phenomenons.Consumption.value  <= 30){c_interval_25_30++;}
				if(selection[i].properties.phenomenons.Consumption.value > 30 && selection[i].properties.phenomenons.Consumption.value  <= 35){c_interval_30_35++;}
				if(selection[i].properties.phenomenons.Consumption.value > 35 && selection[i].properties.phenomenons.Consumption.value  <= 40){c_interval_35_40++;}
				if(selection[i].properties.phenomenons.Consumption.value > 40 && selection[i].properties.phenomenons.Consumption.value  <= 45){c_interval_40_45++;}
				if(selection[i].properties.phenomenons.Consumption.value > 45 && selection[i].properties.phenomenons.Consumption.value  <= 50){c_interval_45_50++;}
				if(selection[i].properties.phenomenons.Consumption.value > 50 && selection[i].properties.phenomenons.Consumption.value  <= 55){c_interval_50_55++;}
				if(selection[i].properties.phenomenons.Consumption.value > 55 && selection[i].properties.phenomenons.Consumption.value  <= 60){c_interval_55_60++;}
				if(selection[i].properties.phenomenons.Consumption.value > 60){c_interval_gr_60++;}
			}
}
if(c_gesamt > 0){
var result_consumption = new Array(
                        (c_interval_0_5/c_gesamt)*100,
                        (c_interval_5_10/c_gesamt)*100,
                        (c_interval_10_15/c_gesamt)*100,
                        (c_interval_15_20/c_gesamt)*100,
						(c_interval_20_25/c_gesamt)*100,
						(c_interval_25_30/c_gesamt)*100,
						(c_interval_30_35/c_gesamt)*100,
						(c_interval_35_40/c_gesamt)*100,
						(c_interval_40_45/c_gesamt)*100,
						(c_interval_45_50/c_gesamt)*100,
						(c_interval_50_55/c_gesamt)*100,
						(c_interval_55_60/c_gesamt)*100,
						(c_interval_gr_60/c_gesamt)*100);
					
var maxResult_consumption = Math.max(result_consumption[0],result_consumption[1],result_consumption[2],result_consumption[3],result_consumption[4],
result_consumption[5],result_consumption[6],result_consumption[7],result_consumption[8],result_consumption[9],result_consumption[10],
result_consumption[11],result_consumption[12]);

	
$(function () {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Spritverbrauch'
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
					'>60'
                ]
            },
            yAxis: {
                min: 0,
				max: maxResult_consumption,
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
                name: 'Spritverbrauch [l/h]',
                data: [ (c_interval_0_5/c_gesamt)*100,
						(c_interval_5_10/c_gesamt)*100,
						(c_interval_10_15/c_gesamt)*100,
						(c_interval_15_20/c_gesamt)*100,
						(c_interval_20_25/c_gesamt)*100,
						(c_interval_25_30/c_gesamt)*100,
						(c_interval_30_35/c_gesamt)*100,
						(c_interval_35_40/c_gesamt)*100,
						(c_interval_40_45/c_gesamt)*100,
						(c_interval_45_50/c_gesamt)*100,
						(c_interval_50_55/c_gesamt)*100,
						(c_interval_55_60/c_gesamt)*100,
						(c_interval_gr_60/c_gesamt)*100
					],
				color: '#FFA500'
            }]
        });
    });
}
else {
	//document.getElementById('#container').innerHTML
	alert("Diagramm konnte nicht erstellt werden, da keine Werte vorlagen.");
}
}