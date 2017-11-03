(function(){
	'use strict';
	angular.module("EMU").controller("OutputPageController",OutputPageController);

	OutputPageController.$inject = ["$scope","dhisService","configParam","utilityService","$state","_"]

	function OutputPageController($scope,dhisService,configParam,utilityService,$state,_){
		var vm = this;

		// public methods
		vm.init = init;

		// public variables
    	vm.isLoading = false;
    	vm.last_year = undefined;
    	/* 
    		the below object 'vm.chartOptions' holds options
    		for the charts getting renderred 
    		in output page.
    	*/
    	vm.chartOptions = {
    		"estimatedModernMethodMixCommodities" : undefined, // option of pie chart 'Estimated Modern Method Mix Commodities'
    		"modernMethodMix" : undefined, // pie charts to be displayed as 'Modern Method Mix : NFHS-4 2016'
    		"usersTrendByMethodsForCommodities" : undefined
    	}

    	// private methods
    	var createChartForEstimatedModernMethodMixCommodities = createChartForEstimatedModernMethodMixCommodities;
    	var createChartForModernMethodMix = createChartForModernMethodMix; 
    	var createChartForUsersTrendByMethodsForCommodities = createChartForUsersTrendByMethodsForCommodities;
    	var createChartForComparingSlopesForCommodities = createChartForComparingSlopesForCommodities;
    	var createChartForEMUCommoditiesOutput = createChartForEMUCommoditiesOutput;
    	var createChartForCommoditiesStockoutByMonth = createChartForCommoditiesStockoutByMonth;

    	//Has to be done 
    	function createChartForEMUCommoditiesOutput(){

    	} // createChartForEMUCommoditiesOutput

    	function createChartForCommoditiesStockoutByMonth(){
    		var chartOption = {
                credits : {
                    enabled : false
                },chart: {
                    type: 'column'
                },
                title: {
                    text: 'Sample FP Commodities Stockout by Month'
                },
                subtitle: {
                    text: 'LMIS Performance Report'
                },
                xAxis: {
                    categories: [                        
                        'Apr 2016',
                        'May 2016',
                        'Jun 2016',
                        'Jul 2016',
                        'Aug 2016',
                        'Sep 2016',
                        'Oct 2016',
                        'Nov 2016',
                        'Dec 2016',
                        'Jan 2017',
                        'Feb 2017',
                        'Mar 2017'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Stockout Value'
                    },
                    plotLines : [{
                        color : 'red',
                        value : 5,
                        width : 2
                    }]
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    series : {
                        cursor : 'pointer'
                    }
                },
                series: [
                    {
                        color : "#8e44ad", // blue                   
                        name: 'Stockout',
                        data: [9.71,3.43,3.88,4.57,4.29,4.65,5.81,4.21,5.25,4.19,4.05,7.99],
                        zones : [{
                            value : 5,
                            color : "#8e44ad" // purple
                        },{
                            value : 20,
                            color : "#e3c4ef" // light purple
                        }]
                    }                  
                ]
            };

            return chartOption;
    	} // end of createChartForCommoditiesStockoutByMonth

    	function createChartForComparingSlopesForCommodities(){
    		var eemu = [];
			eemu.push(Math.abs(configParam.PercentageSlopeEMUExclCondoms));
	
			var eemuex = [];
			eemuex.push(Math.abs(configParam.PercentageSlopeEMU));

    		var chartOption = {
				chart: {
					type: 'bar'
				},
		        credits: {
		            enabled: false
		        },
				title: {
					text: 'Comparing Slopes'
				},
				xAxis: {
				title: {
					enabled: false
				},
				labels: {
					enabled: false
				},
				tickLength: 0
				},
				yAxis: {
					min: 0,
					title: {
						text: ''
					}        
				},
				legend: {
					reversed: true
				},
				plotOptions: {
					 bar: {
						dataLabels: {
							enabled: true
						}
					}
				},	
				series: [{
					name: 'EMU Commodities ex. Condoms',
					data: eemu
				},{
					name: 'EMU Commodities inc. Condoms',
					data: eemuex
				},{
					name: 'mCPR Surveys',
					data: [0.0]
				},{
					name: 'mCPR FPET',
					data: [1.6]
				}]
			} // end of chartOption

			return chartOption;
    	} // createChartForComparingSlopesForCommodities

    	function createChartForUsersTrendByMethodsForCommodities(){
    		var mainObj = {}, data = [];

    		angular.forEach(configParam.selectedYears,function(selectedYear,index){
    			angular.forEach(configParam.indicators,function(indicator,index){
    				var indicatorLabel = configParam.indicatorsLabel[indicator];
    				var calculatedAmountPerYear = undefined;

    				if(angular.isDefined(indicatorLabel) && indicatorLabel !== null){
    					
    					if(!(indicatorLabel in mainObj)){
    						mainObj[indicatorLabel] = [];    					
    					}

    					calculatedAmountPerYear = _.chain(configParam.processedDataByYear).find(function(obj){
			    			return obj.year == selectedYear;
			    		}).thru(function(obj){
			    			return obj.data;
			    		}).find(function (obj){
			    			return obj.dataSetId == indicator;
			    		}).thru(function(obj){
			    			return obj.calculatedAmount;
			    		}).value();
    					
    					mainObj[indicatorLabel].push(parseFloat(calculatedAmountPerYear.toFixed(2)));	
    				}// end of if 
    			});
    		});

    		angular.forEach(mainObj,function(dataArray,indicator){
    			data.push({
    				"name" : indicator,
    				"data" : dataArray
    			});
    		});

    		var colorCodeArray = utilityService.getColorCodes(data);

    		var chartOption = {
		        title: {
		            text: 'Users Trends by Methods - Commodities'
		        },
		        credits: {
		            enabled: false
		        },		              
		        exporting: {
		            buttons: {
		                contextButton: {
		                    menuItems: [{
		                        textKey: 'downloadPNG',
		                        onclick: function () {
		                            this.exportChart();
		                        }
		                        }, {
		                        textKey: 'downloadJPEG',
		                        onclick: function () {
		                            this.exportChart({
		                                type: 'image/jpeg'
		                            });
		                        }
		                        }]
		                }
		            }
		        },
		        xAxis: {
		            categories: configParam.selectedYears
		        },
		        yAxis: {
		            type: 'spline',
		            minorTickInterval: 0.1
		        },

		        tooltip: {
		            headerFormat: '<b>{series.name}</b><br />',
		            pointFormat: '{point.y}'
		        },
		        colors : colorCodeArray,        
		        series: data
		    };

		    return chartOption;
    	} // end of 'createChartForUsersTrendByMethodsForCommodities'

    	// the below function render's chart 'Modern Method Mix : NFHS-4 2016'
    	function createChartForModernMethodMix(){
    		var dataModernMethodMix = [                 
                { "name" : "Sterilization", "y" : 36.0},
                { "name" : "IUD", "y" : 1.5},                
                { "name" : "Pill", "y" : 4.1},
                { "name" : "Condoms (Male)", "y" : 5.6}                                        
            ];

            var colorCodeArray = utilityService.getColorCodes(dataModernMethodMix);
	        var chartOption = {
	            chart: {
	                plotBackgroundColor: null,
	                plotBorderWidth: null,            
	                type: 'pie'
	            },
	            exporting: {
	                buttons: {
	                    contextButton: {
	                        menuItems: [{
	                            textKey: 'downloadPNG',
	                            onclick: function () {
	                                this.exportChart();
	                            }
	                            }, {
	                            textKey: 'downloadJPEG',
	                            onclick: function () {
	                                this.exportChart({
	                                    type: 'image/jpeg'
	                                });
	                            }
	                        }]
	                    }
	                }
	            },
	            title: {
	                text: 'Modern Method Mix: NFHS-4 2016'
	            },
	            subtitle: {
	                text: 'Year 2016'
	            },
	            tooltip: {
	                pointFormat: '<b>{point.percentage:.1f}%</b>'
	            },	            
	            credits: {
	                enabled: false
	            },

	            plotOptions: {
	                pie: {
	                    allowPointSelect: true,
	                    cursor: 'pointer',
	                    depth: 35,
	                    dataLabels: {
	                        enabled: false,
	                        format: '<b>{point.name}</b>: {point.y:.1f} %',
	                        style: {
	                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                        }
	                    },
	                    showInLegend: true,
	                    colors : colorCodeArray
	                }
	            },
	            series: [{
	                name: '',
	                colorByPoint: true,
	                data: dataModernMethodMix
	            }]
	        };

	        return chartOption;
    	} // end of createChartForModernMethodMix

    	/*
			the method 'createChartForEstimatedModernMethodMixCommodities'
			returns an 'option' object for graph 'Estimated Modern Method Mix Commodities'.
			The method also calculates the data which has to be rendered.
    	*/
    	function createChartForEstimatedModernMethodMixCommodities(){
    		vm.last_year = configParam.selectedYears[configParam.selectedYears.length - 1];
    		console.log(configParam.processedDataByYear);
    		console.log(vm.last_year);
    		var lastYearData = _.find(configParam.processedDataByYear,function(obj){
    			return obj.year == vm.last_year;
    		});		
    		
    		lastYearData = lastYearData["data"];
    		
    		/*
				suming up all the 'calculatedAmount' for last year
    		*/
    		var sumOfTotalCalculatedAmount = _.reduce(lastYearData,function(finalObj,current){
    			if(!("total" in finalObj)){
    				finalObj.total = current["calculatedAmount"];
    			}else{
    				finalObj.total += current["calculatedAmount"];
    			}
    			return finalObj;
    		},{});

    		sumOfTotalCalculatedAmount = sumOfTotalCalculatedAmount.total;
    		var methodMixData = [];

    		// calculating percentages for each 'calculatedAmount'
    		// by 'sumOfTotalCalculatedAmount'
    		angular.forEach(lastYearData,function(value,key){
    			var obj = {};
    			if(value["dataSetId"] === "IND1_C"){
    				obj["name"] = "Sterilization";
    				obj["y"] = (value["calculatedAmount"] / sumOfTotalCalculatedAmount) * 100;
    				methodMixData.push(obj); 
    			}else if(value["dataSetId"] === "IND25_C"){
    				obj["name"] = "IUD";
    				obj["y"] = (value["calculatedAmount"] / sumOfTotalCalculatedAmount) * 100;
    				methodMixData.push(obj);    				
    			}else if(value["dataSetId"] === "IND30_C"){
    				obj["name"] = "Pills";
    				obj["y"] = (value["calculatedAmount"] / sumOfTotalCalculatedAmount) * 100;
    				methodMixData.push(obj);    				
    			}else if(value["dataSetId"] === "IND31_C"){
    				obj["name"] = "Condoms";
    				obj["y"] = (value["calculatedAmount"] / sumOfTotalCalculatedAmount) * 100;
    				methodMixData.push(obj);    				
    			}else{
    				return;
    			}
    		});

    		// get the color-code (Hex value) for each indicator to be 
    		// shown in pie chart of 'Estimated Modern Method Mix Commodities'
    		var colorCodeArray = utilityService.getColorCodes(methodMixData); 

    		// option to feed to highChart directive for pie chart
    		var chartOption = {
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: null,		            
			            type: 'pie'
			        },
			        exporting: {
			            buttons: {
			                contextButton: {
			                    menuItems: [{
			                        textKey: 'downloadPNG',
			                        onclick: function () {
			                            this.exportChart();
			                        }
			                        }, {
			                        textKey: 'downloadJPEG',
			                        onclick: function () {
			                            this.exportChart({
			                                type: 'image/jpeg'
			                            });
			                        }
			                        }]
			                }
			            }
			        },
			        title: {
			            text: 'Estimated Modern Method Mix Commodities'
			        },
			        subtitle: {
			            text: 'Year '+vm.last_year
			        },
			        tooltip: {
			            pointFormat: '<b>{point.percentage:.1f}%</b>'
			        },			        
			        credits: {
			            enabled: false
			        },
			        plotOptions: {
			            pie: {
			                allowPointSelect: true,
			                cursor: 'pointer',
			                depth: 35,
			                dataLabels: {
			                    enabled: false,
			                    format: '<b>{point.name}</b>: {point.y:.1f} %',
			                    style: {
			                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
			                    }
			                },
			                showInLegend: true,
			                colors : colorCodeArray
			            }
			        },
			        series: [{
			            name: '',
			            colorByPoint: true,
			            data: methodMixData
			        }]
			} // chartOption

    		return chartOption;
    	} // createChartForEstimatedModernMethodMixCommodities


		function init(){
			if(!angular.isDefined(configParam.processedDataByYear)){
				$state.go("home");
			}
			vm.chartOptions["estimatedModernMethodMixCommodities"] = createChartForEstimatedModernMethodMixCommodities();
			vm.chartOptions["modernMethodMix"] = createChartForModernMethodMix();
			vm.chartOptions["usersTrendByMethodsForCommodities"] = createChartForUsersTrendByMethodsForCommodities();
			vm.chartOptions["comparingSlopesForCommodities"] = createChartForComparingSlopesForCommodities();
			vm.chartOptions["commoditiesStockoutByMonth"] = createChartForCommoditiesStockoutByMonth();

			utilityService.processDataForOutput(); // process data for output page
		} // end of init
	} // end of OutputPageController
})();