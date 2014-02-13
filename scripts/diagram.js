// Visualize the diagram for the analysis
// authors: Nicho and Johanna

/***********************************************
    1. Diagram-loader
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
    2. Diagram for speed
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
    2.1 Diagram for low speed values
***********************************************/

var s_total = selection.length;

for (var i = 0; i < selection.length; i++){
	// If speed is not undefined
	if (selection[i].properties.phenomenons.Speed.value == '-'){
		s_total = s_total-1;
	}
	// If speed is defined
	else {
		// check if value is a positive value; values smaller 0 will be ignored
		if( selection[i].properties.phenomenons.Speed.value < 0){
			s_total = s_total-1;
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

// check if there are existing speed values
if(s_total > 0){
	var result_low_speed = new Array(
							(interval_0_5/s_total)*100,
							(interval_5_10/s_total)*100,
							(interval_10_15/s_total)*100,
							(interval_15_20/s_total)*100,
							(interval_20_25/s_total)*100,
							(interval_25_30/s_total)*100,
							(interval_30_35/s_total)*100,
							(interval_35_40/s_total)*100,
							(interval_40_45/s_total)*100,
							(interval_45_50/s_total)*100,
							(interval_50_55/s_total)*100,
							(interval_55_60/s_total)*100,
							(interval_60_65/s_total)*100,
							(interval_65_70/s_total)*100,
							(interval_70_75/s_total)*100,
							(interval_75_80/s_total)*100,
							(interval_gr_80/s_total)*100);

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

	if( ((interval_gr_80/s_total)*100) <= 10) {

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
					data: [ (interval_0_5/s_total)*100,
							(interval_5_10/s_total)*100,
							(interval_10_15/s_total)*100,
							(interval_15_20/s_total)*100,
							(interval_20_25/s_total)*100,
							(interval_25_30/s_total)*100,
							(interval_30_35/s_total)*100,
							(interval_35_40/s_total)*100,
							(interval_40_45/s_total)*100,
							(interval_45_50/s_total)*100,
							(interval_50_55/s_total)*100,
							(interval_55_60/s_total)*100,
							(interval_60_65/s_total)*100,
							(interval_65_70/s_total)*100,
							(interval_70_75/s_total)*100,
							(interval_75_80/s_total)*100,
							(interval_gr_80/s_total)*100
						],
					color: '#8CBC3E'
				}]
			});
		});
	}

/***********************************************
	2.2 Diagram for high speed values
***********************************************/
	else {

	var total_high_speed = selection.length;
	for(var i = 0; i < selection.length; i++){
	// If speed is not undefined
		if (selection[i].properties.phenomenons.Speed.value == '-'){
			total_high_speed = total_high_speed-1;
		}
		// If speed is defined
		else {
		// check if value is a positive value; values smaller 0 will be ignored
			if( selection[i].properties.phenomenons.Speed.value < 0){
				total_high_speed = total_high_speed-1;
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
							(interval_0_10/total_high_speed)*100,
							(interval_10_20/total_high_speed)*100,
							(interval_20_30/total_high_speed)*100,
							(interval_30_40/total_high_speed)*100,
							(interval_40_50/total_high_speed)*100,
							(interval_50_60/total_high_speed)*100,
							(interval_60_70/total_high_speed)*100,
							(interval_70_80/total_high_speed)*100,
							(interval_80_90/total_high_speed)*100,
							(interval_90_100/total_high_speed)*100,
							(interval_100_110/total_high_speed)*100,
							(interval_110_120/total_high_speed)*100,
							(interval_120_130/total_high_speed)*100,
							(interval_130_140/total_high_speed)*100,
							(interval_140_150/total_high_speed)*100,
							(interval_150_160/total_high_speed)*100,
							(interval_gr_160/total_high_speed)*100);

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
					data: [ (interval_0_10/total_high_speed)*100,
							(interval_10_20/total_high_speed)*100,
							(interval_20_30/total_high_speed)*100,
							(interval_30_40/total_high_speed)*100,
							(interval_40_50/total_high_speed)*100,
							(interval_50_60/total_high_speed)*100,
							(interval_60_70/total_high_speed)*100,
							(interval_70_80/total_high_speed)*100,
							(interval_80_90/total_high_speed)*100,
							(interval_90_100/total_high_speed)*100,
							(interval_100_110/total_high_speed)*100,
							(interval_110_120/total_high_speed)*100,
							(interval_120_130/total_high_speed)*100,
							(interval_130_140/total_high_speed)*100,
							(interval_140_150/total_high_speed)*100,
							(interval_150_160/total_high_speed)*100,
							(interval_gr_160/total_high_speed)*100
							],
					color: '#8CBC3E'
				}]
			});
		});
	}
}

// if there are no existing speed values
else{
	errorMessage();
}
}

/***********************************************
	3. Diagram for CO2  
***********************************************/
function diagramCO2() {

var co_interval_0_5   = 0;
var co_interval_5_10  = 0;
var co_interval_10_15 = 0;
var co_interval_15_20 = 0;
var co_interval_20_25 = 0;
var co_interval_25_30 = 0;
var co_interval_30_35 = 0;
var co_interval_35_40 = 0;
var co_interval_40_45 = 0;
var co_interval_45_50 = 0;
var co_interval_50_55 = 0;
var co_interval_55_60 = 0;
var co_interval_gr_60 = 0;

var co_total = selection.length;

for(var i = 0; i < selection.length; i++){
			// If CO2 is not undefined
			if (selection[i].properties.phenomenons.CO2.value == '-'){
				co_total = co_total-1;
			}
			// If CO2 is defined
			else {
				// check if value is a positive value; values smaller 0 will be ignored
				if( selection[i].properties.phenomenons.CO2.value < 0){
					co_total = co_total-1;
				}
				// checks for the right interval
				if(selection[i].properties.phenomenons.CO2.value >= 0 && selection[i].properties.phenomenons.CO2.value  <= 5){co_interval_0_5++;}
				if(selection[i].properties.phenomenons.CO2.value >  5 && selection[i].properties.phenomenons.CO2.value  <= 10){co_interval_5_10++;}
				if(selection[i].properties.phenomenons.CO2.value > 10 && selection[i].properties.phenomenons.CO2.value  <= 15){co_interval_10_15++;}
				if(selection[i].properties.phenomenons.CO2.value > 15 && selection[i].properties.phenomenons.CO2.value  <= 20){co_interval_15_20++;}
				if(selection[i].properties.phenomenons.CO2.value > 20 && selection[i].properties.phenomenons.CO2.value  <= 25){co_interval_20_25++;}
				if(selection[i].properties.phenomenons.CO2.value > 25 && selection[i].properties.phenomenons.CO2.value  <= 30){co_interval_25_30++;}
				if(selection[i].properties.phenomenons.CO2.value > 30 && selection[i].properties.phenomenons.CO2.value  <= 35){co_interval_30_35++;}
				if(selection[i].properties.phenomenons.CO2.value > 35 && selection[i].properties.phenomenons.CO2.value  <= 40){co_interval_35_40++;}
				if(selection[i].properties.phenomenons.CO2.value > 40 && selection[i].properties.phenomenons.CO2.value  <= 45){co_interval_40_45++;}
				if(selection[i].properties.phenomenons.CO2.value > 45 && selection[i].properties.phenomenons.CO2.value  <= 50){co_interval_45_50++;}
				if(selection[i].properties.phenomenons.CO2.value > 50 && selection[i].properties.phenomenons.CO2.value  <= 55){co_interval_50_55++;}
				if(selection[i].properties.phenomenons.CO2.value > 55 && selection[i].properties.phenomenons.CO2.value  <= 60){co_interval_55_60++;}
				if(selection[i].properties.phenomenons.CO2.value > 60){co_interval_gr_60++;}
			}
}
if(co_total > 0){
var result_consumption = new Array(
                        (co_interval_0_5/co_total)*100,
                        (co_interval_5_10/co_total)*100,
                        (co_interval_10_15/co_total)*100,
                        (co_interval_15_20/co_total)*100,
						(co_interval_20_25/co_total)*100,
						(co_interval_25_30/co_total)*100,
						(co_interval_30_35/co_total)*100,
						(co_interval_35_40/co_total)*100,
						(co_interval_40_45/co_total)*100,
						(co_interval_45_50/co_total)*100,
						(co_interval_50_55/co_total)*100,
						(co_interval_55_60/co_total)*100,
						(co_interval_gr_60/co_total)*100);
					
var maxResult_co2 = Math.max(result_consumption[0],
                             result_consumption[1],
                             result_consumption[2],
                             result_consumption[3],
                             result_consumption[4],
                             result_consumption[5],
                             result_consumption[6],
                             result_consumption[7],
                             result_consumption[8],
                             result_consumption[9],
                             result_consumption[10],
                             result_consumption[11],
                             result_consumption[12]);

	
$(function () {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'CO2-Ausstoß'
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
				max: maxResult_co2,
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
                name: 'CO2-Ausstoß [g/s]',
                data: [ (co_interval_0_5/co_total)*100,
						(co_interval_5_10/co_total)*100,
						(co_interval_10_15/co_total)*100,
						(co_interval_15_20/co_total)*100,
						(co_interval_20_25/co_total)*100,
						(co_interval_25_30/co_total)*100,
						(co_interval_30_35/co_total)*100,
						(co_interval_35_40/co_total)*100,
						(co_interval_40_45/co_total)*100,
						(co_interval_45_50/co_total)*100,
						(co_interval_50_55/co_total)*100,
						(co_interval_55_60/co_total)*100,
						(co_interval_gr_60/co_total)*100
					],
				color: '#B22222'
            }]
        });
    });
}
else {
	errorMessage();
}
}

/***********************************************
	4. Diagram for Consumption 
***********************************************/

function diagramConsumption() {

var c_interval_0_1   = 0;
var c_interval_1_2  = 0;
var c_interval_2_3 = 0;
var c_interval_3_4 = 0;
var c_interval_4_5 = 0;
var c_interval_5_6 = 0;
var c_interval_6_7 = 0;
var c_interval_7_8 = 0;
var c_interval_8_9 = 0;
var c_interval_9_10 = 0;
var c_interval_10_11 = 0;
var c_interval_11_12 = 0;
var c_interval_12_13 = 0;
var c_interval_13_14 = 0;
var c_interval_14_15 = 0;
var c_interval_gr_15 = 0;

var c_total = selection.length;
for(var i = 0; i < selection.length; i++){
			// If Consumption is not undefined
			if (selection[i].properties.phenomenons.Consumption.value == '-'){
				c_total = c_total-1;
			}
			// If Consumption is defined
			else {
				// check if value is a positive value; values smaller 0 will be ignored
				if( selection[i].properties.phenomenons.Consumption.value < 0){
					c_total = c_total-1;
				}
				// checks for the right interval
				if(selection[i].properties.phenomenons.Consumption.value >= 0 && selection[i].properties.phenomenons.Consumption.value  <= 1){c_interval_0_1++;}
				if(selection[i].properties.phenomenons.Consumption.value >  1 && selection[i].properties.phenomenons.Consumption.value  <= 2){c_interval_1_2++;}
				if(selection[i].properties.phenomenons.Consumption.value >  2 && selection[i].properties.phenomenons.Consumption.value  <= 3){c_interval_2_3++;}
				if(selection[i].properties.phenomenons.Consumption.value >  3 && selection[i].properties.phenomenons.Consumption.value  <= 4){c_interval_3_4++;}
				if(selection[i].properties.phenomenons.Consumption.value >  4 && selection[i].properties.phenomenons.Consumption.value  <= 5){c_interval_4_5++;}
				if(selection[i].properties.phenomenons.Consumption.value >  5 && selection[i].properties.phenomenons.Consumption.value  <= 6){c_interval_5_6++;}
				if(selection[i].properties.phenomenons.Consumption.value >  6 && selection[i].properties.phenomenons.Consumption.value  <= 7){c_interval_6_7++;}
				if(selection[i].properties.phenomenons.Consumption.value >  7 && selection[i].properties.phenomenons.Consumption.value  <= 8){c_interval_7_8++;}
				if(selection[i].properties.phenomenons.Consumption.value >  8 && selection[i].properties.phenomenons.Consumption.value  <= 9){c_interval_8_9++;}
				if(selection[i].properties.phenomenons.Consumption.value >  9 && selection[i].properties.phenomenons.Consumption.value  <= 10){c_interval_9_10++;}
				if(selection[i].properties.phenomenons.Consumption.value > 10 && selection[i].properties.phenomenons.Consumption.value  <= 11){c_interval_10_11++;}
				if(selection[i].properties.phenomenons.Consumption.value > 11 && selection[i].properties.phenomenons.Consumption.value  <= 12){c_interval_11_12++;}
				if(selection[i].properties.phenomenons.Consumption.value > 12 && selection[i].properties.phenomenons.Consumption.value  <= 13){c_interval_12_13++;}
				if(selection[i].properties.phenomenons.Consumption.value > 13 && selection[i].properties.phenomenons.Consumption.value  <= 14){c_interval_13_14++;}
				if(selection[i].properties.phenomenons.Consumption.value > 14 && selection[i].properties.phenomenons.Consumption.value  <= 15){c_interval_14_15++;}
				if(selection[i].properties.phenomenons.Consumption.value > 15){c_interval_gr_15++;}
			}
}
if(c_total > 0){
var result_consumption = new Array(
                        (c_interval_0_1/c_total)*100,
                        (c_interval_1_2/c_total)*100,
                        (c_interval_2_3/c_total)*100,
                        (c_interval_3_4/c_total)*100,
						(c_interval_4_5/c_total)*100,
						(c_interval_5_6/c_total)*100,
						(c_interval_6_7/c_total)*100,
						(c_interval_7_8/c_total)*100,
						(c_interval_8_9/c_total)*100,
						(c_interval_9_10/c_total)*100,
						(c_interval_10_11/c_total)*100,
						(c_interval_11_12/c_total)*100,
						(c_interval_12_13/c_total)*100,
						(c_interval_13_14/c_total)*100,
						(c_interval_14_15/c_total)*100,
						(c_interval_gr_15/c_total)*100);
					
var maxResult_consumption = Math.max(result_consumption[0],
                                     result_consumption[1],
                                     result_consumption[2],
                                     result_consumption[3],
                                     result_consumption[4],
                                     result_consumption[5],
                                     result_consumption[6],
                                     result_consumption[7],
                                     result_consumption[8],
                                     result_consumption[9],
                                     result_consumption[10],
                                     result_consumption[11],
                                     result_consumption[12],
									 result_consumption[13],
									 result_consumption[14],
									 result_consumption[15]);

	
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
                    '0-1',
					'1-2',
					'2-3',
					'3-4',
					'4-5',
					'5-6',
					'6-7',
					'7-8',
					'8-9',
					'9-10',
					'10-11',
					'11-12',
					'12-13',
					'13-14',
					'14-15',
					'>15'
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
                data: [ (c_interval_0_1/c_total)*100,
                        (c_interval_1_2/c_total)*100,
                        (c_interval_2_3/c_total)*100,
                        (c_interval_3_4/c_total)*100,
						(c_interval_4_5/c_total)*100,
						(c_interval_5_6/c_total)*100,
						(c_interval_6_7/c_total)*100,
						(c_interval_7_8/c_total)*100,
						(c_interval_8_9/c_total)*100,
						(c_interval_9_10/c_total)*100,
						(c_interval_10_11/c_total)*100,
						(c_interval_11_12/c_total)*100,
						(c_interval_12_13/c_total)*100,
						(c_interval_13_14/c_total)*100,
						(c_interval_14_15/c_total)*100,
						(c_interval_gr_15/c_total)*100
					],
				color: '#FFA500'
            }]
        });
    });
}
else {
	errorMessage();
}
}


/***********************************************
	5. Diagram for MAF 
***********************************************/

function diagramMAF() {

var m_interval_0_5   = 0;
var m_interval_5_10  = 0;
var m_interval_10_15 = 0;
var m_interval_15_20 = 0;
var m_interval_20_25 = 0;
var m_interval_25_30 = 0;
var m_interval_30_35 = 0;
var m_interval_35_40 = 0;
var m_interval_40_45 = 0;
var m_interval_45_50 = 0;
var m_interval_50_55 = 0;
var m_interval_55_60 = 0;
var m_interval_60_65 = 0;
var m_interval_65_70 = 0;
var m_interval_70_75 = 0;
var m_interval_75_80 = 0;
var m_interval_gr_80 = 0;

var m_total = selection.length;
for(var i = 0; i < selection.length; i++){
			// If MAF is not undefined
			if (selection[i].properties.phenomenons.MAF.value == '-'){
				m_total = m_total-1;
			}
			// If MAF is defined
			else {
				// check if value is a positive value; values smaller 0 will be ignored
				if( selection[i].properties.phenomenons.MAF.value < 0){
					m_total = m_total-1;
				}
				// checks for the right interval
				if(selection[i].properties.phenomenons.MAF.value >= 0 && selection[i].properties.phenomenons.MAF.value  <= 5){m_interval_0_5++;}
				if(selection[i].properties.phenomenons.MAF.value >  5 && selection[i].properties.phenomenons.MAF.value  <= 10){m_interval_5_10++;}
				if(selection[i].properties.phenomenons.MAF.value > 10 && selection[i].properties.phenomenons.MAF.value  <= 15){m_interval_10_15++;}
				if(selection[i].properties.phenomenons.MAF.value > 15 && selection[i].properties.phenomenons.MAF.value  <= 20){m_interval_15_20++;}
				if(selection[i].properties.phenomenons.MAF.value > 20 && selection[i].properties.phenomenons.MAF.value  <= 25){m_interval_20_25++;}
				if(selection[i].properties.phenomenons.MAF.value > 25 && selection[i].properties.phenomenons.MAF.value  <= 30){m_interval_25_30++;}
				if(selection[i].properties.phenomenons.MAF.value > 30 && selection[i].properties.phenomenons.MAF.value  <= 35){m_interval_30_35++;}
				if(selection[i].properties.phenomenons.MAF.value > 35 && selection[i].properties.phenomenons.MAF.value  <= 40){m_interval_35_40++;}
				if(selection[i].properties.phenomenons.MAF.value > 40 && selection[i].properties.phenomenons.MAF.value  <= 45){m_interval_40_45++;}
				if(selection[i].properties.phenomenons.MAF.value > 45 && selection[i].properties.phenomenons.MAF.value  <= 50){m_interval_45_50++;}
				if(selection[i].properties.phenomenons.MAF.value > 50 && selection[i].properties.phenomenons.MAF.value  <= 55){m_interval_50_55++;}
				if(selection[i].properties.phenomenons.MAF.value > 55 && selection[i].properties.phenomenons.MAF.value  <= 60){m_interval_55_60++;}
				if(selection[i].properties.phenomenons.MAF.value > 60 && selection[i].properties.phenomenons.MAF.value  <= 65){m_interval_60_65++;}
				if(selection[i].properties.phenomenons.MAF.value > 65 && selection[i].properties.phenomenons.MAF.value  <= 70){m_interval_65_70++;}
				if(selection[i].properties.phenomenons.MAF.value > 70 && selection[i].properties.phenomenons.MAF.value  <= 75){m_interval_70_75++;}
				if(selection[i].properties.phenomenons.MAF.value > 75 && selection[i].properties.phenomenons.MAF.value  <= 80){m_interval_75_80++;}
				if(selection[i].properties.phenomenons.MAF.value > 80){m_interval_gr_80++;}
			}
}
if(m_total > 0){
var result_MAF = new Array(
                        (m_interval_0_5/m_total)*100,
                        (m_interval_5_10/m_total)*100,
                        (m_interval_10_15/m_total)*100,
                        (m_interval_15_20/m_total)*100,
						(m_interval_20_25/m_total)*100,
						(m_interval_25_30/m_total)*100,
						(m_interval_30_35/m_total)*100,
						(m_interval_35_40/m_total)*100,
						(m_interval_40_45/m_total)*100,
						(m_interval_45_50/m_total)*100,
						(m_interval_50_55/m_total)*100,
						(m_interval_55_60/m_total)*100,
						(m_interval_60_65/m_total)*100,
						(m_interval_65_70/m_total)*100,
						(m_interval_70_75/m_total)*100,
						(m_interval_75_80/m_total)*100,
						(m_interval_gr_80/m_total)*100
						);
					
var maxResult_MAF = Math.max(result_MAF[0],
                                     result_MAF[1],
                                     result_MAF[2],
                                     result_MAF[3],
                                     result_MAF[4],
                                     result_MAF[5],
                                     result_MAF[6],
                                     result_MAF[7],
                                     result_MAF[8],
                                     result_MAF[9],
                                     result_MAF[10],
                                     result_MAF[11],
                                     result_MAF[12],
									 result_MAF[13],
                                     result_MAF[14],
                                     result_MAF[15],
                                     result_MAF[16]
									 );

	
$(function () {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'MAF-Werte'
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
				max: maxResult_MAF,
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
                name: 'MAF [l/s]',
                data: [ (m_interval_0_5/m_total)*100,
						(m_interval_5_10/m_total)*100,
						(m_interval_10_15/m_total)*100,
						(m_interval_15_20/m_total)*100,
						(m_interval_20_25/m_total)*100,
						(m_interval_25_30/m_total)*100,
						(m_interval_30_35/m_total)*100,
						(m_interval_35_40/m_total)*100,
						(m_interval_40_45/m_total)*100,
						(m_interval_45_50/m_total)*100,
						(m_interval_50_55/m_total)*100,
						(m_interval_55_60/m_total)*100,
						(m_interval_60_65/m_total)*100,
						(m_interval_65_70/m_total)*100,
						(m_interval_70_75/m_total)*100,
						(m_interval_75_80/m_total)*100,
						(m_interval_gr_80/m_total)*100
					],
				color: '#167FC1'
            }]
        });
    });
}
else {
	errorMessage();
}
}

/***********************************************
	6. Diagram for Fahrzeugtypen 
***********************************************/





















/***********************************************************************
	7. errorMessage, if there are no values for drawing a diagram
***********************************************************************/
function errorMessage(){
	var errorText = document.getElementById("container");
	errorText.style.fontSize = "12pt";
	errorText.style.color = '#B22222';
	errorText.style.textAlign = "center";
	errorText.innerHTML = "<br><br><br><br><br><br><br><br><br><br>Diagramm konnte nicht erstellt werden, da keine Werte vorliegen.";
}

