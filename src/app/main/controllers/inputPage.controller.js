(function(){
	'use strict';	
    angular.module('EMU').controller('InputPageController',InputPageController);

    InputPageController.$inject = ["$scope","dhisService","configParam","utilityService","$state"];

    function InputPageController($scope,dhisService,configParam,utilityService,$state){

    	var vm = this;

    	// public methods
    	vm.init = init;
    	vm.generateOutput = generateOutput;

    	// public variables
    	vm.isLoading = false;
    	vm.columnChartOptionsArray = {};

    	// private methods
    	var processDataForColumnCharts = processDataForColumnCharts;



    	function generateOutput(){
    		$state.go("output");
    	} // end of generateOutput

    	function init(){
    		if(!angular.isDefined(configParam.selectedYears) || (angular.isArray(configParam.selectedYears) && configParam.selectedYears.length === 0)){
    			$state.go("home");
    		}else{
    			$scope.$emit("goBack",true);

    			vm.isLoading = true;    			
    			configParam.processedData = utilityService.processData();
    			//console.log("configParam.processedData ",JSON.stringify(configParam.processedData));
            	// data processing for graphs and charts,            
            	configParam.processedDataByYear = utilityService.processDataForCharts();
            	//console.log("configParam.processedDataByYear ",JSON.stringify(configParam.processedDataByYear));
            	// process data to be displayed in column charts
            	processDataForColumnCharts();
            	vm.isLoading = false;

            	$scope.$on("SETTINGS_CHANGE",function(event,args){            		            		            		
            		$state.go($state.current, {}, {reload: true});
            	});            	
    		}// end of else    		
    	}// end of init

    	/*
			the below method assign's variable 'vm.columnChartOptionsArray' a key-value pair
			where key is 'indicator' and value is 'options' object
			to be passed to 'scope.options' variable present in directive 'directive.chart.js'.
			For Example

			{
				"INDC_1" : {
					chart : {
						type : "column"
					},
					.....
				},
				"INDC_2" : { option configuration goes here.. },
				....
			}
    	*/
    	function processDataForColumnCharts(){    		
    		var dataForChart = {};
    		console.log("Graph Color Change ",configParam.inputChartsColor.toString());
    		angular.forEach(configParam.processedDataByYear,function(dataByYear,index){
    			
    			angular.forEach(dataByYear.data,function(data,idx){

    				var indicatorCode = data.dataSetId;

    				if(indicatorCode in dataForChart){
    					dataForChart[indicatorCode][0]["data"].push(data.amount);
	    			}else{
	    				dataForChart[indicatorCode] = [];
		    			dataForChart[indicatorCode].push({
		    				"name" : configParam.indicatorsMap[indicatorCode],
		    				"data" : [data.amount]
		    			});
	    			}// end else

    			});	// end of for each for data array iteration
    			    			
    		}); // end of for-each for interation per year
    		
    		angular.forEach(dataForChart,function(data,indicatorCode){

    			var option = {
	    			"chart" : {
	    				"type": "column",
	    				"shadow": false,
	    				"width" : null
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
			            	"color" : configParam.inputChartsColor,
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

    			
    			vm.columnChartOptionsArray[indicatorCode] = option;    			
    		});
    		
    	} // processDataForColumnCharts

    } // end of InputPageController
})();