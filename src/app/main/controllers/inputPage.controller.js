(function(){
	'use strict';	
    angular.module('EMU').controller('InputPageController',InputPageController);

    InputPageController.$inject = ["$scope","dhisService","configParam","utilityService"];

    function InputPageController($scope,dhisService,configParam,utilityService){

    	var vm = this;

    	// public methods
    	vm.init = init;

    	// public variables
    	vm.isLoading = false;
    	vm.columnChartOptionsArray = []

    	// private methods
    	var processDataForCharts = processDataForCharts;

    	// private variables
    	var dataForChart = {};

    	function init(){
    		configParam.processedData = utilityService.processData();

            // data processing for graphs and charts,
            //console.log(configParam.processedData);
            configParam.processedDataByYear = utilityService.processDataForCharts();
            //console.log(configParam.processedDataByYear);
            processDataForCharts();
    	}// end of init

    	function processDataForCharts(){
    		console.log("configParam.processedDataByYear ",configParam.processedDataByYear);
    		angular.forEach(configParam.processedDataByYear,function(dataByYear,index){
    			
    			angular.forEach(dataByYear["data"],function(data,idx){
    				var indicatorCode = data["dataSetId"];

    				if(indicatorCode in dataForChart){
    					dataForChart[indicatorCode][0]["data"].push(data["amount"]);
	    			}else{
	    				dataForChart[indicatorCode] = [];
		    			dataForChart[indicatorCode].push({
		    				"name" : configParam.indicatorsMap[indicatorCode],
		    				"data" : [data["amount"]]
		    			});
	    			}// end else

    			});		

    			    			
    		});
    		console.log("dataForChart ",dataForChart);
    		angular.forEach(dataForChart,function(data,indicatorCode){    			
    			var option = {
	    			"chart" : {
	    				"type" : "column"
	    			},
	    			"credits" : {
	    				"enabled" : false
	    			},
	    			"title" : {
	    				"text" : data[0]["name"] 
	    			},
	    			"xAxis" : {
	    				"categories" : configParam.selectedYears
	    			},
	    			"yAxis" : {
	    				"min" : 0,
	    				"title" : {
	    					"text" : "Value(s)"
	    				},
	    				"stackLabels" : {
	    					"enabled" : false,
	    					"style" : {
	    						"fontWeight" : "bold",
	    						"color" : (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	    					},
	    					"formatter" : function(){
	    						return this.value
	    					}
	    				}
	    			},
	    			"tooltip": {
			            "pointFormat" : '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
			            "shared" : true
        			},
			        "plotOptions" : {
			            "column" : {
			                "stacking" : 'normal',
			                "depth" : 50,
			                "dataLabels" : {
			                    "enabled" : false,
			                    "color" : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
			                }
			            },
			            "series" : {
			                "pointWidth": 20 //width of the column bars irrespective of the chart size
			            }
			        },
			        "exporting" : {
			            "buttons" : {
			                "contextButton" : {
			                    "menuItems": [{
			                        "textKey": 'downloadPNG',
			                        "onclick": function () {
			                            	this.exportChart();
			                        	}
			                    	},{
			                        "textKey" : 'downloadJPEG',
			                        "onclick": function () {
				                            this.exportChart({
				                                "type" : 'image/jpeg'
				                            });
			                        	}
			                        }]
			                }
			            }
			        },
			        "series": data
    			} // end of option

    			vm.columnChartOptionsArray.push(option);
    		});
    		
    	} // processDataForCharts

    } // end of InputPageController
})();