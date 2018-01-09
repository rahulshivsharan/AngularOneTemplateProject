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
    	vm.outputTableData = undefined;
    	vm.emuFacilitiesForLatestYear = 0;
    	vm.isChartDataLoaded = false;

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
    	var createChartForTotalSterilisation = createChartForTotalSterilisation;
    	var createChartForProportionOfSteralization = createChartForProportionOfSteralization;
    	var createChartForTotalIUCD = createChartForTotalIUCD;
    	var createChartForProportionOfIUCD = createChartForProportionOfIUCD;
        var createChartForSterilisationPer1000EC = createChartForSterilisationPer1000EC;
        var createChartForAdverseEventsAttributableToSterilisation = createChartForAdverseEventsAttributableToSterilisation;
        var createChartForAcceptanceRate = createChartForAcceptanceRate;
    	var createNewChart = createNewChart;


    	function loadAdditonalDataForCharts(){
    		var promise = dhisService.loadDataFile(),
    			success = success,
    			error = error;

    		promise.then(success,error).finally(function(){
    			vm.isChartDataLoaded = true;
    		});

    		function success(data){
    			var mainData = data["data"];

    			var filteredDataByStates = undefined;
    			
    			if(configParam.isNationalSelected === true){
    				filteredDataByStates = {
    					"allindia" : mainData["allindia"]	
    				}
    			}else{
    				filteredDataByStates = _.pick(mainData,function(value, state_name,obj){    				
	    				var filteredStates = _.find(configParam.selectedStates,function(stateName){
	    					return (stateName.toLowerCase() === state_name.toLowerCase());	
	    				});	    				
	    				return filteredStates;
    				});	
    			} // end of if

    			    			
    			vm.chartOptions["totalSterilisation"] = createChartForTotalSterilisation(filteredDataByStates);
    			vm.chartOptions["proportionOfSterilisation"] = createChartForProportionOfSteralization(filteredDataByStates);
    			vm.chartOptions["totalIUCD"] = createChartForTotalIUCD(filteredDataByStates);
    			vm.chartOptions["proportionOfIUCD"] = createChartForProportionOfIUCD(filteredDataByStates);
    			vm.chartOptions["ocpUsers"] = createChartForOCPUsers(filteredDataByStates);
    			vm.chartOptions["injectableMPA"] = createChartForInjectableMPA(filteredDataByStates); 
    			vm.chartOptions["discontinuationRates"] = createChartForDiscontinuationRates(filteredDataByStates); 
                vm.chartOptions["sterilisationPer1000EC"] = createChartForSterilisationPer1000EC(filteredDataByStates);
                vm.chartOptions["adverseEventToSterilisation"] = createChartForAdverseEventsAttributableToSterilisation(filteredDataByStates);
                vm.chartOptions["acceptanceRate"] = createChartForAcceptanceRate(filteredDataByStates);
    			//console.log(vm.chartOptions["totalSterilisation"]);
    		} // end of success

    		function error(data){
    			console.log(data);
    		} // end of error
    	} // end of loadAdditonalDataForCharts

    	//Has to be done 
    	function createChartForEMUCommoditiesOutput(){

    	} // createChartForEMUCommoditiesOutput

    	function createChartForCommoditiesStockoutByMonth(){
    		var chartOption = {
                credits : {
                    enabled : false
                },chart: {
                    type: 'column',
                    width : 1400
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
    		//console.log(configParam.processedDataByYear);
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


        function createChartForAcceptanceRate(data){
            var dataElements = [
                "pps_acceptance_rate",
                "pas_acceptance_rate",
                "paiucd_acceptance_rate"
            ];    

            var dataElementMap = {
                "pps_acceptance_rate" : "Postpartum Sterilisation acceptance Rate",
                "pas_acceptance_rate" : "Post Abortion acceptance Rate",
                "paiucd_acceptance_rate" : "Post Abortion IUCD acceptance Rate"
            };

            var mainArray = [];         

            _.each(data,function(dataValue,stateName){
                var v = undefined;

                var yearList = configParam.selectedYears;
                v = _.chain(dataValue).pick(function(valArray,dataElementName){
                    return  _.find(dataElements,function(dataElement_Name){
                        return dataElement_Name === dataElementName;
                    });
                }).value();

                var obj2 = {};  

                _.each(v,function(valueArray,key){
                   obj2[key] = [];
                   _.each(yearList,function(yearNo,index){
                      var v = _.find(valueArray,function(val_array){
                         return val_array[1] === yearNo;
                      });

                      if(!_.isUndefined(v)){
                         obj2[key].push(v);
                      }else{
                         obj2[key].push([key,yearNo,"0"]);
                      }

                   });
                });
                mainArray.push(obj2);               
            }); // end of each

            //console.log(JSON.stringify(mainArray));
            var mainObject = {};
            _.each(mainArray,function(stateObject,index){
                _.each(stateObject,function(valueArray,dataElement){
                    var dataElementLabel = dataElementMap[dataElement];

                    if(dataElementLabel in mainObject){
                        
                        _.each(mainObject[dataElementLabel],function(array, index){
                            
                                
                                _.each(valueArray,function(val,index){
                                    
                                    if(val[1] === array[1]){
                                        array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
                                        val[2] = (val[2] === "") ? 0 :  parseInt(val[2]);
                                        array[2] += val[2];     
                                    } 
                                });                             
                            
                        });
                    
                    }else{
                        mainObject[dataElementLabel] = valueArray;
                    }

                });
            });

            //console.log(JSON.stringify(mainObject));

            return createNewChart(mainObject,"Acceptance Rate",false);
        }; //end of createChartForAcceptanceRate

        function createChartForAdverseEventsAttributableToSterilisation(data){
            var dataElements = [
                "failure_rate_per_lakh_sterilization",
                "complication_rate_per_lakh_sterilization",
                "death_rate_per_lakh_sterilization"
            ];

            var dataElementMap = {
                "failure_rate_per_lakh_sterilization" : "Failure rate per Lakh Sterilization",
                "complication_rate_per_lakh_sterilization" : "Complication rate per Lakh Sterilization",
                "death_rate_per_lakh_sterilization" : "Death rate per lakh Sterilization"
            };

            var mainArray = [];         

            _.each(data,function(dataValue,stateName){
                var v = undefined;

                var yearList = configParam.selectedYears;
                v = _.chain(dataValue).pick(function(valArray,dataElementName){
                    return  _.find(dataElements,function(dataElement_Name){
                        return dataElement_Name === dataElementName;
                    });
                }).value();

                var obj2 = {};  

                _.each(v,function(valueArray,key){
                   obj2[key] = [];
                   _.each(yearList,function(yearNo,index){
                      var v = _.find(valueArray,function(val_array){
                         return val_array[1] === yearNo;
                      });

                      if(!_.isUndefined(v)){
                         obj2[key].push(v);
                      }else{
                         obj2[key].push([key,yearNo,"0"]);
                      }

                   });
                });
                mainArray.push(obj2);               
            }); // end of each

            //console.log(JSON.stringify(mainArray));
            var mainObject = {};
            _.each(mainArray,function(stateObject,index){
                _.each(stateObject,function(valueArray,dataElement){
                    var dataElementLabel = dataElementMap[dataElement];

                    if(dataElementLabel in mainObject){
                        
                        _.each(mainObject[dataElementLabel],function(array, index){
                            
                                
                                _.each(valueArray,function(val,index){
                                    
                                    if(val[1] === array[1]){
                                        array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
                                        val[2] = (val[2] === "") ? 0 :  parseInt(val[2]);
                                        array[2] += val[2];     
                                    } 
                                });                             
                            
                        });
                    
                    }else{
                        mainObject[dataElementLabel] = valueArray;
                    }

                });
            });

            //console.log(JSON.stringify(mainObject));

            return createNewChart(mainObject,"Adverse Event Attributable to Sterilisation",false);
        }; // end of createChartForAdverseEventsAttributableToSterilisation

        function createChartForSterilisationPer1000EC(data){
            var dataElements = [
                "totalMaleSterilization",
                "totalFemaleSterilization"
            ];

            var dataElementMap = {
                "totalMaleSterilization" : "Male",
                "totalFemaleSterilization" : "Female"
            };

            var mainArray = [];
            

            _.each(data,function(dataValue,stateName){
                var v = undefined;

                var yearList = configParam.selectedYears;
                v = _.chain(dataValue).pick(function(valArray,dataElementName){
                    return  _.find(dataElements,function(dataElement_Name){
                        return dataElement_Name === dataElementName;
                    });
                }).value();

                var obj2 = {};  

                _.each(v,function(valueArray,key){
                   obj2[key] = [];
                   _.each(yearList,function(yearNo,index){
                      var v = _.find(valueArray,function(val_array){
                         return val_array[1] === yearNo;
                      });

                      if(!_.isUndefined(v)){
                         obj2[key].push(v);
                      }else{
                         obj2[key].push([key,yearNo,"0"]);
                      }

                   });
                });
                mainArray.push(obj2);               
            }); // end of each

            //console.log(JSON.stringify(mainArray));
            var mainObject = {};
            _.each(mainArray,function(stateObject,index){
                _.each(stateObject,function(valueArray,dataElement){
                    var dataElementLabel = dataElementMap[dataElement];

                    if(dataElementLabel in mainObject){
                        
                        _.each(mainObject[dataElementLabel],function(array, index){
                            
                                
                                _.each(valueArray,function(val,index){
                                    
                                    if(val[1] === array[1]){
                                        array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
                                        val[2] = (val[2] === "") ? 0 :  parseInt(val[2]);
                                        array[2] += val[2];     
                                    } 
                                });                             
                            
                        });
                    
                    }else{
                        mainObject[dataElementLabel] = valueArray;
                    }

                });
            });

            return createNewChart(mainObject,"Sterilisation Per 1000 eligible couple (EC)",true);            
        }; // end of createChartForSterilisationPer1000EC

    	function createChartForTotalSterilisation(data){
    		var dataElements = [
    			"femalesterilisationnumber",
    			"malesterilisationnumber",
    			"postpartumsterilizationnumber",
    			"postabortionsterilizationnumber"
    		];

    		var dataElementMap = {
    			"femalesterilisationnumber" : "Female Sterilisation",
    			"malesterilisationnumber" : "Male Sterilisation",
    			"postpartumsterilizationnumber" : "Post Partum (PP) Sterilization",
    			"postabortionsterilizationnumber" : "Post Abortion (PA) Sterilization"
    		}

    		var mainArray = [];    		

    		_.each(data,function(dataValue,stateName){
    			var v = undefined;

    			var yearList = configParam.selectedYears;
    			v = _.chain(dataValue).pick(function(valArray,dataElementName){
    				return  _.find(dataElements,function(dataElement_Name){
    					return dataElement_Name === dataElementName;
    				});
    			}).value();

    			var obj2 = {};	

				_.each(v,function(valueArray,key){
				   obj2[key] = [];
				   _.each(yearList,function(yearNo,index){
				      var v = _.find(valueArray,function(val_array){
				         return val_array[1] === yearNo;
				      });

				      if(!_.isUndefined(v)){
				         obj2[key].push(v);
				      }else{
				         obj2[key].push([key,yearNo,"0"]);
				      }

				   });
				});
				mainArray.push(obj2);    			
    		}); // end of each

    		//console.log(JSON.stringify(mainArray));
    		var mainObject = {};
    		_.each(mainArray,function(stateObject,index){
    			_.each(stateObject,function(valueArray,dataElement){
    				var dataElementLabel = dataElementMap[dataElement];

    				if(dataElementLabel in mainObject){
    					
    					_.each(mainObject[dataElementLabel],function(array, index){
    						
    							
    							_.each(valueArray,function(val,index){
    								
    								if(val[1] === array[1]){
    									array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
    									val[2] = (val[2] === "") ? 0 : 	parseInt(val[2]);
    									array[2] += val[2];  	
    								} 
    							});  							
    						
    					});
    				
    				}else{
    					mainObject[dataElementLabel] = valueArray;
    				}

    			});
    		});

    		//console.log(JSON.stringify(mainObject));

    		return createNewChart(mainObject,"Total sterilisation (Male and Female)",false);

    	} // end of createChartForTotalSterilisation

    	function createChartForProportionOfSteralization(data){
			var dataElements = [
    			"offemalesterilisationtototalsterilisation",
    			"ofmalesterilisationtototalsterilisation",
    			"ofintervalminilaptototalfemalesterilization",
    			"ofLaptototalFemalesterilization",
    			"ofPPStofemalesterilization",
    			"ofPAStoFemalesterilization",
    			"PPSacceptancerate"
    		];

    		var dataElementMap = {
    			"offemalesterilisationtototalsterilisation" : "% of female sterilisation to total Sterilisation",
    			"ofmalesterilisationtototalsterilisation" : "% of male sterilisation to total sterilisation",
    			"ofintervalminilaptototalfemalesterilization" : "% of interval mini lap to total female sterilization",
    			"ofLaptototalFemalesterilization" : "% of Lap to total Female sterilization",
    			"ofPPStofemalesterilization" : "% of PPS to Female sterilization",
    			"ofPAStoFemalesterilization" : "% of PAS to Female sterilization",
    			"PPSacceptancerate" : "PPS acceptance rate"
    		}

    		var mainArray = [];
    		

    		_.each(data,function(dataValue,stateName){
    			var v = undefined;

    			var yearList = configParam.selectedYears;
    			v = _.chain(dataValue).pick(function(valArray,dataElementName){
    				return  _.find(dataElements,function(dataElement_Name){
    					return dataElement_Name === dataElementName;
    				});
    			}).value();

    			var obj2 = {};	

				_.each(v,function(valueArray,key){
				   obj2[key] = [];
				   _.each(yearList,function(yearNo,index){
				      var v = _.find(valueArray,function(val_array){
				         return val_array[1] === yearNo;
				      });

				      if(!_.isUndefined(v)){
				         obj2[key].push(v);
				      }else{
				         obj2[key].push([key,yearNo,"0"]);
				      }

				   });
				});
				mainArray.push(obj2);    			
    		}); // end of each

    		//console.log(JSON.stringify(mainArray));
    		var mainObject = {};
    		_.each(mainArray,function(stateObject,index){
    			_.each(stateObject,function(valueArray,dataElement){
    				var dataElementLabel = dataElementMap[dataElement];
    				if(dataElementLabel in mainObject){
    					
    					_.each(mainObject[dataElementLabel],function(array, index){
    						
    							
    							_.each(valueArray,function(val,index){
    								
    								if(val[1] === array[1]){
    									array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
    									val[2] = (val[2] === "") ? 0 : 	parseInt(val[2]);
    									array[2] += val[2];  	
    								} 
    							});  							
    						
    					});
    				
    				}else{
    					mainObject[dataElementLabel] = valueArray;
    				}
    			});
    		});

    		//console.log(JSON.stringify(mainObject));

    		return createNewChart(mainObject,"Proportion of Sterilization",true);
    	}; // end of createChartForProportionOfSteralization


    	function createChartForTotalIUCD(data){
    		var dataElements = [
    			"IntervalIUCD",
    			"PPIUCDNumber",
    			"PAIUCDNumber"    			
    		];

    		var dataElementMap = {
    			"IntervalIUCD" : "Interval IUCD",
    			"PPIUCDNumber" : "PP IUCD - Number",
    			"PAIUCDNumber" : "PAI UCD - Number"
    		}

    		var mainArray = [];
    		

    		_.each(data,function(dataValue,stateName){
    			var v = undefined;

    			var yearList = configParam.selectedYears;
    			v = _.chain(dataValue).pick(function(valArray,dataElementName){
    				return  _.find(dataElements,function(dataElement_Name){
    					return dataElement_Name === dataElementName;
    				});
    			}).value();

    			var obj2 = {};	

				_.each(v,function(valueArray,key){
				   obj2[key] = [];
				   _.each(yearList,function(yearNo,index){
				      var v = _.find(valueArray,function(val_array){
				         return val_array[1] === yearNo;
				      });

				      if(!_.isUndefined(v)){
				         obj2[key].push(v);
				      }else{
				         obj2[key].push([key,yearNo,"0"]);
				      }

				   });
				});
				mainArray.push(obj2);    			
    		}); // end of each

    		//console.log(JSON.stringify(mainArray));
    		var mainObject = {};
    		_.each(mainArray,function(stateObject,index){
    			_.each(stateObject,function(valueArray,dataElement){
    				var dataElementLabel = dataElementMap[dataElement];	
    				if(dataElementLabel in mainObject){
    					
    					_.each(mainObject[dataElementLabel],function(array, index){
    						
    							
    							_.each(valueArray,function(val,index){
    								
    								if(val[1] === array[1]){
    									array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
    									val[2] = (val[2] === "") ? 0 : 	parseInt(val[2]);
    									array[2] += val[2];  	
    								} 
    							});  							
    						
    					});
    				
    				}else{
    					mainObject[dataElementLabel] = valueArray;
    				}
    			});
    		});

    		//console.log(JSON.stringify(mainObject));

    		return createNewChart(mainObject,"Total of IUCD",true);
    	} // end of createChartForTotalIUCD



    	function createChartForProportionOfIUCD(data){
    		var dataElements = [
    			"ofPPIUCDoutoftotalIUCD",
    			"ofPAIUCDoutoftotalIUCD",
    			"PPIUCDacceptancerate",
    			"PostpartumFPacceptance",
    			"PAFPacceptance",
    			"CondomNirodhUsersNumber"    			
    		];

    		var dataElementMap = {
    			"ofPPIUCDoutoftotalIUCD" : "% of PP IUCD out of total IUCD",
    			"ofPAIUCDoutoftotalIUCD" : "% of PA IUCD out of total IUCD",
    			"PPIUCDacceptancerate" : "PPIUCD acceptance rate",
    			"PostpartumFPacceptance" : "Post partum FP acceptance",
    			"PAFPacceptance" : "PA FP acceptance",
    			"CondomNirodhUsersNumber" : "Condom (Nirodh) Users – Number"
    		}

    		var mainArray = [];
    		

    		_.each(data,function(dataValue,stateName){
    			var v = undefined;

    			var yearList = configParam.selectedYears;
    			v = _.chain(dataValue).pick(function(valArray,dataElementName){
    				return  _.find(dataElements,function(dataElement_Name){
    					return dataElement_Name === dataElementName;
    				});
    			}).value();

    			var obj2 = {};	

				_.each(v,function(valueArray,key){
				   obj2[key] = [];
				   _.each(yearList,function(yearNo,index){
				      var v = _.find(valueArray,function(val_array){
				         return val_array[1] === yearNo;
				      });

				      if(!_.isUndefined(v)){
				         obj2[key].push(v);
				      }else{
				         obj2[key].push([key,yearNo,"0"]);
				      }

				   });
				});
				mainArray.push(obj2);    			
    		}); // end of each

    		//console.log(JSON.stringify(mainArray));
    		var mainObject = {};
    		_.each(mainArray,function(stateObject,index){
    			_.each(stateObject,function(valueArray,dataElement){
    				var dataElementLabel = dataElementMap[dataElement];

    				if(dataElementLabel in mainObject){
    					
    					_.each(mainObject[dataElementLabel],function(array, index){
    						
    							
    							_.each(valueArray,function(val,index){
    								
    								if(val[1] === array[1]){
    									array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
    									val[2] = (val[2] === "") ? 0 : 	parseInt(val[2]);
    									array[2] += val[2];  	
    								} 
    							});  							
    						
    					});
    				
    				}else{
    					mainObject[dataElementLabel] = valueArray;
    				}
    			});
    		});

    		//console.log(JSON.stringify(mainObject));

    		return createNewChart(mainObject,"Proportion of IUCD",false);
    	} // end of createChartForProportionOfIUCD


    	function createChartForOCPUsers(data){
    		var dataElements = [
    			"MalaNCOC",
    			"CentrochomanChhaya"    			
    		];

    		var dataElementMap = {
    			"MalaNCOC" : "Mala-N (COC)",
    			"CentrochomanChhaya" : "Centrochoman (Chhaya)"
    		}

    		var mainArray = [];
    		

    		_.each(data,function(dataValue,stateName){
    			var v = undefined;

    			var yearList = configParam.selectedYears;
    			v = _.chain(dataValue).pick(function(valArray,dataElementName){
    				return  _.find(dataElements,function(dataElement_Name){
    					return dataElement_Name === dataElementName;
    				});
    			}).value();

    			var obj2 = {};	

				_.each(v,function(valueArray,key){
				   obj2[key] = [];
				   _.each(yearList,function(yearNo,index){
				      var v = _.find(valueArray,function(val_array){
				         return val_array[1] === yearNo;
				      });

				      if(!_.isUndefined(v)){
				         obj2[key].push(v);
				      }else{
				         obj2[key].push([key,yearNo,"0"]);
				      }

				   });
				});
				mainArray.push(obj2);    			
    		}); // end of each

    		//console.log(JSON.stringify(mainArray));
    		var mainObject = {};
    		_.each(mainArray,function(stateObject,index){
    			_.each(stateObject,function(valueArray,dataElement){
    				var dataElementLabel = dataElementMap[dataElement];

    				if(dataElementLabel in mainObject){
    					
    					_.each(mainObject[dataElementLabel],function(array, index){
    						
    							
    							_.each(valueArray,function(val,index){
    								
    								if(val[1] === array[1]){
    									array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
    									val[2] = (val[2] === "") ? 0 : 	parseInt(val[2]);
    									array[2] += val[2];  	
    								} 
    							});  							
    						
    					});
    				
    				}else{
    					mainObject[dataElementLabel] = valueArray;
    				}
    			});
    		});

    		//console.log(JSON.stringify(mainObject));

    		return createNewChart(mainObject,"OCP Users",false);
    	} // end of createChartForOCPUsers

    	function createChartForInjectableMPA(data){
    		var dataElements = [
    			"InjectableContraceptiveAntaraProgramFirstDose",
    			"InjectableContraceptiveAntaraProgramSecondDose",
    			"InjectableContraceptiveAntaraProgramThirdDose",
    			"InjectableContraceptiveAntaraProgramFourthormorethanfourth"    			
    		];

    		var dataElementMap = {
    			"InjectableContraceptiveAntaraProgramFirstDose" : "Injectable Contraceptive-Antara Program- First Dose",
    			"InjectableContraceptiveAntaraProgramSecondDose" : "Injectable Contraceptive-Antara Program- Second Dose",
    			"InjectableContraceptiveAntaraProgramThirdDose" : "Injectable Contraceptive-Antara Program- Third Dose",
    			"InjectableContraceptiveAntaraProgramFourthormorethanfourth" : "Injectable Contraceptive-Antara Program- Fourth or more than fourth"
    		}

    		var mainArray = [];
    		

    		_.each(data,function(dataValue,stateName){
    			var v = undefined;

    			var yearList = configParam.selectedYears;
    			v = _.chain(dataValue).pick(function(valArray,dataElementName){
    				return  _.find(dataElements,function(dataElement_Name){
    					return dataElement_Name === dataElementName;
    				});
    			}).value();

    			var obj2 = {};	

				_.each(v,function(valueArray,key){
				   obj2[key] = [];
				   _.each(yearList,function(yearNo,index){
				      var v = _.find(valueArray,function(val_array){
				         return val_array[1] === yearNo;
				      });

				      if(!_.isUndefined(v)){
				         obj2[key].push(v);
				      }else{
				         obj2[key].push([key,yearNo,"0"]);
				      }

				   });
				});
				mainArray.push(obj2);    			
    		}); // end of each

    		//console.log(JSON.stringify(mainArray));
    		var mainObject = {};
    		_.each(mainArray,function(stateObject,index){
    			_.each(stateObject,function(valueArray,dataElement){
    				
    				var dataElementLabel = dataElementMap[dataElement];

    				if(dataElementLabel in mainObject){
    					
    					_.each(mainObject[dataElementLabel],function(array, index){
    						
    							
    							_.each(valueArray,function(val,index){
    								
    								if(val[1] === array[1]){
    									array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
    									val[2] = (val[2] === "") ? 0 : 	parseInt(val[2]);
    									array[2] += val[2];  	
    								} 
    							});  							
    						
    					});
    				
    				}else{
    					mainObject[dataElementLabel] = valueArray;
    				}
    			});
    		});

    		//console.log(JSON.stringify(mainObject));

    		return createNewChart(mainObject,"Injectable MPA",false);
    	} // createChartForInjectableMPA

    	function createChartForDiscontinuationRates(data){
    		var dataElements = [
    			"1stdoseto2nddose",
    			"2nddoseto3rddose",
    			"1stdosedto3rddose"    			
    		];

    		var dataElementMap = {
    			"1stdoseto2nddose" : "1st dose to 2nd dose",
    			"2nddoseto3rddose" : "2nd dose to 3rd dose",
    			"1stdosedto3rddose" : "1st dose d to  3rd  dose"
    		}

    		var mainArray = [];
    		

    		_.each(data,function(dataValue,stateName){
    			var v = undefined;

    			var yearList = configParam.selectedYears;
    			v = _.chain(dataValue).pick(function(valArray,dataElementName){
    				return  _.find(dataElements,function(dataElement_Name){
    					return dataElement_Name === dataElementName;
    				});
    			}).value();

    			var obj2 = {};	

				_.each(v,function(valueArray,key){
				   obj2[key] = [];
				   _.each(yearList,function(yearNo,index){
				      var v = _.find(valueArray,function(val_array){
				         return val_array[1] === yearNo;
				      });

				      if(!_.isUndefined(v)){
				         obj2[key].push(v);
				      }else{
				         obj2[key].push([key,yearNo,"0"]);
				      }

				   });
				});
				mainArray.push(obj2);    			
    		}); // end of each

    		//console.log(JSON.stringify(mainArray));
    		var mainObject = {};
    		_.each(mainArray,function(stateObject,index){
    			_.each(stateObject,function(valueArray,dataElement){
    				var dataElementLabel = dataElementMap[dataElement];
    				if(dataElementLabel in mainObject){
    					
    					_.each(mainObject[dataElementLabel],function(array, index){    						
    							
    							_.each(valueArray,function(val,index){    								
    								if(val[1] === array[1]){
    									array[2] = (array[2] === "") ? 0 : parseInt(array[2]);
    									val[2] = (val[2] === "") ? 0 : 	parseInt(val[2]);
    									array[2] += val[2];  	
    								} 
    							});  							
    						
    					});
    				
    				}else{

    					var valueArray = _.map(valueArray,function(val){
    						val[2] = (val[2] === "") ? 0 : parseInt(val[2]);
    						return val;
    					});

    					//console.log(" valueArray ",valueArray);
    					mainObject[dataElementLabel] = valueArray;
    				}
    			});
    		});

    		//console.log(JSON.stringify(mainObject));

    		return createNewChart(mainObject,"Discontinuation Rates",false);
    	} // end of createChartForDiscontinuationRates

    	function createNewChart(dataObject,chartTitle,isTotalDisplayed){
    		var chartOption = {
			    chart: {
			        type: 'column'
			    },
                credits : {
                    enabled : false
                },
			    title: {
			        text: chartTitle
			    },
			    xAxis: {
			        categories: configParam.selectedYears
			    },
			    yAxis: {
			        min: 0,
			        title: {
			            text: 'Total data'
			        },
			        stackLabels: {
			            enabled: (isTotalDisplayed) ? isTotalDisplayed : false,
			            style: {
			                fontWeight: 'bold',
			                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
			            }
			        }
			    }/*,
			    legend: {
			        align: 'right',
			        x: -30,
			        verticalAlign: 'top',
			        y: 25,
			        floating: true,
			        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			        borderColor: '#CCC',
			        borderWidth: 1,
			        shadow: false
			    }*/,
			    tooltip: {
			        headerFormat: '<b>{point.x}</b><br/>',
			        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			    },
			    plotOptions: {
			        column: {
			            stacking: 'normal',
			            dataLabels: {
			                enabled: true,
			                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
			            }
			        }
			    },
			    series: (function(obj){
			    	var outputArray = [];
			    	_.each(obj,function(valueArray,key){
			    		var data = [];
			    			
			    		_.each(valueArray,function(value,index){
			    			if(value[2] === ""){
			    				value[2] = 0;	
			    			}else if(typeof value[2] === 'string'){
			    				value[2] = parseInt(value[2]); 
			    			}else{
			    				value[2] = value[2]; 	
			    			}
			    			
			    			data.push(value[2]);
			    		});
			    			
			    		outputArray.push({
			    			"name" : key,
			    			"data" : data
			    		});			    		
			    	});
			    	console.log(outputArray);

			    	return outputArray;
			    })(dataObject)
			    /*
			    [{
			        name: 'John',
			        data: [5, 3, 4, 7, 2]
			    }, {
			        name: 'Jane',
			        data: [2, 2, 3, 2, 1]
			    }, {
			        name: 'Joe',
			        data: [3, 4, 4, 2, 5]
			    }]
			    */
			}; // end of chart Options
			return chartOption;
    	} // end of createNewChart 

		function init(){
			// additional charts renderred using new data
			loadAdditonalDataForCharts(); 
			
			if(!angular.isDefined(configParam.processedDataByYear)){
				$state.go("home");
			}
			
			vm.chartOptions["estimatedModernMethodMixCommodities"] = createChartForEstimatedModernMethodMixCommodities();
			vm.chartOptions["modernMethodMix"] = createChartForModernMethodMix();
			vm.chartOptions["usersTrendByMethodsForCommodities"] = createChartForUsersTrendByMethodsForCommodities();
			vm.chartOptions["comparingSlopesForCommodities"] = createChartForComparingSlopesForCommodities();
			vm.chartOptions["commoditiesStockoutByMonth"] = createChartForCommoditiesStockoutByMonth();

			vm.outputTableData = utilityService.processDataForOutput(); // process data for output page			
			vm.emuFacilitiesForLatestYear = vm.outputTableData[vm.outputTableData.length -1]["facilities_cc_percent"];
			
		} // end of init
	} // end of OutputPageController
})();