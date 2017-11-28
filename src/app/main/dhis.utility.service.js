(function(){
	'use strict';

	angular.module('EMU').service('utilityService', utilityService);

	utilityService.$inject = ["configParam","_"];

	function utilityService(configParam,_){
		var obj = {};

		// private methods
		var filterDataByYear = filterDataByYear;
		var aggregateDataByIndicators = aggregateDataByIndicators;
		var applyCYPAndAdjustmentFactor = applyCYPAndAdjustmentFactor;
		var linearRegression = linearRegression;
		

		// public methods
		obj.processData = processData;
		obj.processDataForCharts = processDataForCharts;
		obj.getColorCodes = getColorCodes;
		obj.processDataForOutput = processDataForOutput;

		return obj;

		function getColorCodes(chartPlotPoints){
			var index = 0,
		        labelTxt = "",
		        colorCode = "",
		        colorCodeArray = [];
		    try{
		        if(_.isArray(chartPlotPoints)){
		            for(var index = 0; index < chartPlotPoints.length; index++){
		                
		                labelTxt = chartPlotPoints[index]["name"];
		                colorCode = configParam.colorsPerLabel[labelTxt];

		                if(_.isUndefined(colorCode) || _.isNull(colorCode) || colorCode === ""){
		                    throw "No Color found for label "+labelTxt+" for pie chart";
		                }else{
		                    colorCodeArray.push(colorCode);
		                }
		            }
		        }else{
		            throw "Not iterable, not of type array"
		        }
		    }catch(e){
		        console.log(e);
		    }
		    return colorCodeArray;
		}// end of getColorCodes

		function applyCYPAndAdjustmentFactor(indicator,totalPopulation){
			var adj_factor = configParam.facilities_adjustments_Factor[indicator];
			var CYP = configParam.CYP_Factor[indicator];
			totalPopulation = isNaN(totalPopulation) ? 0 : totalPopulation;
			var calculatedAmount = (totalPopulation * 100) / adj_factor;
			calculatedAmount *= CYP;

			return {
				"CYP_F" : CYP,
				"Adj_Factor" : adj_factor,
				"calculatedAmount" : calculatedAmount
			}
		}// end of applyCYPAndAdjustmentFactor

		/*
			The below method is used for processing data so that the same 
			can be feed in charts and tables to be displayed.
			Data processing like CYP calculation and Adjustment factor
			is applied on data.
		*/
		function processDataForCharts(){
			var data = [];
			angular.forEach(configParam.selectedYears,function(selectedYear,index){
				var obj = {};
				obj["year"] = selectedYear;
				obj["data"] = [];

				angular.forEach(configParam.indicators,function(indicator,idx){
					var calculatedData = undefined;
					var arrayElement = _.find(configParam.processedData,function(arrObj){
						return (angular.isDefined(arrObj) && angular.isArray(arrObj) && arrObj[0] === indicator && arrObj[1] === selectedYear);
					});
					
					if(angular.isDefined(arrayElement) && !_.isNull(arrayElement) && angular.isArray(arrayElement)){

						calculatedData = applyCYPAndAdjustmentFactor(arrayElement[0],arrayElement[2]);

						obj["data"].push({
							"dataSetId" : arrayElement[0],
							"amount" : isNaN(arrayElement[2]) ? 0 : arrayElement[2],
							"CYP_F" : calculatedData["CYP_F"],
							"Adj_Factor" : calculatedData["Adj_Factor"],
							"calculatedAmount" : calculatedData["calculatedAmount"]
						});	
					}else{ // if data not found for a particular year

						calculatedData = applyCYPAndAdjustmentFactor(indicator,0);
						
						obj["data"].push({
							"dataSetId" : indicator,
							"amount" : 0,
							"CYP_F" : calculatedData["CYP_F"],
							"Adj_Factor" : calculatedData["Adj_Factor"],
							"calculatedAmount" : calculatedData["calculatedAmount"]
						});
					}// end of else
					
				}); // end of for-each by indicators

				data.push(obj);
 			});// end of for-each by year

			return data;
		}// end of method processDataForCharts

		function aggregateDataByIndicators(data){
			var finalArrayData = [];

			// 'data' contains key-value, where key can be selected state/district
			// and value are array of array.
			// example 
			// {
			// 	"Uttar Pradesh" : [
			// 							[],[],[]
			// 						],
			// 	"Bihar" : [ [],[],[] ]					
			// }

			// I want to get only the first key-value's value of above data,
			// for example, only value of 'Uttar Pradesh' 
			var arrayOfData = _.values(data)[0];
			
			// iterating though selected years i.e. if years selected are [2015,2016]
			angular.forEach(configParam.selectedYears,function(selectedYear,index){
				
				// iterating through all the values of selected 
				// districts/states, 
				// for example, iterating through
				// [["IND1_C","2015","234"],["IND1_C","2016","234"],["IND2_C","2016","234"] ...... ["IND31_C","2016","265"]]
				angular.forEach(arrayOfData,function(arr,index){
						var selectedIndicator = undefined,
							populationCount = 0;
						
						var count = 0;
						var selectedArrayData = undefined;

						if(angular.isDefined(arr) && angular.isDefined(arr[1]) && arr[1] === selectedYear){ // check if year matches with current iterating data

							selectedIndicator = arr[0];


							populationCount =  isNaN(arr[2]) ? 0 : parseInt(arr[2]); // just assigning first population value
						
							/*
								the perpose behind below code is to summat some years and indicator population
								for example, selected states are 'Bihar' and 'Uttar Pradesh' and selected years are 2015,2016 than
								adding ["INDC1_C","2015","12"] of Bihar to ["INDC1_C","2015","10"] of 'UP' with summate to 
								["INDC1_C","2015","22"]
							*/
						

							for(var s in data){
								count++;

								/*
									if selected 'Bihar' and 'UP',
									we have already captured data for 'Bihar' above
									hence just skip for 'Bihar' hence if count is 1 just skip.
								*/
								if(count === 1){ 
									continue;
								}else{
									selectedArrayData = data[s];

									for(var x = 0; x < selectedArrayData.length; x++){

										/*
											putting annonymous function in if condition
											to check if population got added or not
										*/
										if((function(arr_data,yr,indicator){
											var isFound = false;

											// if year is same and indicators are same then add data
											if(angular.isDefined(arr_data) && angular.isArray(arr_data) && arr_data[1] === yr && arr_data[0] === indicator){
												populationCount += isNaN(arr_data[2]) ? 0 : parseInt(arr_data[2]);
												isFound = true;
											}

											return isFound;
										})(selectedArrayData[x],selectedYear,selectedIndicator) === true){
											break;
										} // end of if

									} // end of for
								}// end of else
							}// end of for

							finalArrayData.push([ arr[0], arr[1], populationCount]); // adding the summated up population for particular year and indicator

						} // end of if	
				}); // end of for-each
				
			}); // end of for-each

			/*
				Re-arranging the data so that if selected years are 2015 and 2016 then arrange data as bellow
				IND1_C 2015, IND1_C 2016, INDC_2 2015, INDC_2 2016, INDC_3 2015, INDC_3 2016 and so on
			*/
			var outputArray = [];
			angular.forEach(configParam.indicators,function(indicator,indicator_index){
				angular.forEach(configParam.selectedYears,function(year,year_index){
					var arrayElement = _.find(finalArrayData,function(arrObj){
						return (arrObj[0] === indicator && arrObj[1] === year);
					});
					outputArray.push(arrayElement);
				});
			});

			return outputArray;
		}// end of aggregateDataByIndicators

		function processData(){
			var selectedStates = undefined,
				selectedDistricts = undefined, 
				filteredData = undefined;

			if(configParam.isNationalSelected === true){ // if National selected then select all states
				selectedStates = _.keys(configParam.statesObject);
				filteredData = filterDataByYear(selectedStates,"states");
			}else if(angular.isDefined(configParam.selectedDistricts) && angular.isArray(configParam.selectedDistricts) && configParam.selectedDistricts.length > 0){
				// is district selected than process data only for that perticular district				
				filteredData = filterDataByYear(configParam.selectedDistricts,"districts");
			}else{
				// process data only for selected state
				filteredData = filterDataByYear(configParam.selectedStates,"states");
			} // end of else
			
			//console.log(filteredData);
			
			return aggregateDataByIndicators(filteredData);
		} // processData

		function filterDataByYear(selectedOptions,selectionType){
			var mainData = (selectionType === "states") ? configParam.statesObject : configParam.districtsObject;
			var mapForSelectedOptions = {};
			
			/*
				'mainData' contains key-value pairs for states/districts as key 
				and value is again a key-value with key as indicator and  value as array of indicators
				i.e.
				for 'Andaman and Nicobar' than mainData will be

				{
					"Andaman and Nicobar":{
						"IND1_C":[["IND1_C","2009","7"],....,["IND1_C","2017","330"]],
						"IND2_C" : [["IND2_C","2009","690"],...,["IND2_C","2017","751"]],
						...
				}
				
			*/

			// iterating through mainData 
			angular.forEach(mainData,function(value,key){ 
				// just to check if current iterating key i.e. state is present in selected state's array
				var index = _.findIndex(selectedOptions,function(stateName){
					return (key === stateName);
				}); 
				var selectedValArray = undefined; // selected districts/states
				if(index !== -1){ // if state is selected 
					mapForSelectedOptions[key] = [];	

					/*
						value will be
						{
						"IND1_C":[["IND1_C","2009","7"],....,["IND1_C","2017","330"]],
						"IND2_C" : [["IND2_C","2009","690"],...,["IND2_C","2017","751"]],
						....
						}

					*/
					selectedValArray = _.values(value); // get all the values
					
					/*
						selectedValArray will be
						[
							[["IND1_C","2009","7"],....,["IND1_C","2017","330"]],
							[["IND2_C","2009","690"],...,["IND2_C","2017","751"]],
							[["IND3_C","2009","697"],....["IND3_C","2017","1081"]],
							......
						]
					*/

					angular.forEach(selectedValArray,function(arr,indexVal){
						
						// filtering 'selectedValArray' for selected years
						angular.forEach(configParam.selectedYears,function(yearVal,i){
							var resultArray = _.filter(arr,function(arrayValue){
								return (arrayValue[1] === yearVal);
							});

							mapForSelectedOptions[key].push(resultArray[0]);
						});
												 
					});
					
															
				}// end if
			});

			return mapForSelectedOptions;
		} // filterDataByYear



		function processDataForOutput(){
			
			var outputArray = [];
			angular.forEach(configParam.selectedYears,function(year_indicator,index){
				var total_cc_input_year = 0;
				var item = {};
				var wpp = 0;
				var cc_percent_year = 0;				
				var total_cc_input_year_excluding_condom = 0;
				var cc_percent_year_excluding_condom = 0;

				angular.forEach(configParam.indicators,function(indicator,index){				
					var searchedObject = _.chain(configParam.processedDataByYear).find(function(obj){
						return (obj.year == year_indicator);
					}).thru(function(obj){
						return obj.data;
					}).find(function(obj){
						return (obj.dataSetId == indicator);
					}).value();

					total_cc_input_year += searchedObject["calculatedAmount"];
					
					if(indicator !== "IND31_C"){
						total_cc_input_year_excluding_condom += searchedObject["calculatedAmount"]; 
					}// end of if

				}); // end of indicator iteration

				

				if(configParam.selectedDistricts.length > 0){
					// console.log("Selected Districts ",configParam.selectedDistricts);
					angular.forEach(configParam.selectedDistricts,function(value,index){
						if(angular.isDefined(configParam.populationForZones[value])){
							wpp += configParam.populationForZones[value][year_indicator];
						}else{
							angular.forEach(configParam.indicators,function(indicator,index){
								
								var searchedObject = _.chain(configParam.processedDataByYear).find(function(obj){
									return (obj.year == year_indicator);
								}).thru(function(obj){
									return obj.data;
								}).find(function(obj){
									return (obj.dataSetId == indicator);
								}).value();

								wpp +=  searchedObject["amount"];	
							});
						}
					});

				}else if(configParam.selectedStates.length > 0){
					angular.forEach(configParam.selectedStates,function(value,index){
						if(angular.isDefined(configParam.populationForZones[value])){
							wpp += configParam.populationForZones[value][year_indicator];
						}else{

							angular.forEach(configParam.indicators,function(indicator,index){
								
								var searchedObject = _.chain(configParam.processedDataByYear).find(function(obj){
									return (obj.year == year_indicator);
								}).thru(function(obj){
									return obj.data;
								}).find(function(obj){
									return (obj.dataSetId == indicator);
								}).value();

								wpp +=  searchedObject["amount"];	
							});
							
						}
						
					});					
				}else{ // National
					wpp += configParam.wpp[year_indicator];
				}
				
				cc_percent_year = (total_cc_input_year/wpp) * 100;
				cc_percent_year_excluding_condom =  (total_cc_input_year_excluding_condom / wpp) * 100;

				item["year"] = year_indicator;
				item["population"] = wpp;
				item["cc_input"] = total_cc_input_year.toFixed(2);
				item["facilities_cc_percent"] = isFinite(cc_percent_year) ? Number(Number(cc_percent_year).toFixed(2)) : 0;
				item["cc_input_excl_condom"] = Number(Number(total_cc_input_year_excluding_condom).toFixed(2));				
				item["facilities_cc_percent_excl_condom"] = isFinite(cc_percent_year_excluding_condom) ? Number(Number(cc_percent_year_excluding_condom).toFixed(2)) : 0;

				outputArray.push(item);
			}); // end of selected years iteration

			//console.log("outputArray ",outputArray);	
			angular.forEach(outputArray,function(obj,index){

				if(obj.facilities_cc_percent > 0){
					configParam.EMUSlopesDataX.push(obj.year);
					configParam.EMUSlopesDataY.push(obj.facilities_cc_percent/100);	
				}
				
				if(obj.facilities_cc_percent_excl_condom > 0){
					configParam.EMUSlopesXCondomDataX.push(obj.year);
                	configParam.EMUSlopesXCondomDataY.push(obj.facilities_cc_percent_excl_condom / 100);
				}
			});

			configParam.PercentageSlopeEMU = (linearRegression(configParam.EMUSlopesDataY, configParam.EMUSlopesDataX) * 100).toFixed(2);
    		configParam.PercentageSlopeEMUExclCondoms = (linearRegression(configParam.EMUSlopesXCondomDataY, configParam.EMUSlopesXCondomDataX) * 100).toFixed(2);

    		return outputArray;
		} // end of 'processDataForOutput'


		function linearRegression(y, x){
		    var lr = {};
		    var n = y.length;
		    var sum_x = 0;
		    var sum_y = 0;
		    var sum_xy = 0;
		    var sum_xx = 0;
		    var sum_yy = 0;

		    for (var i = 0; i < y.length; i++) {

		        sum_x += x[i];
		        sum_y += y[i];
		        sum_xy += (x[i] * y[i]);
		        sum_xx += (x[i] * x[i]);
		        sum_yy += (y[i] * y[i]);
		    }

		    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
		    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
		    lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

		    return lr.slope;
		} // linearRegression

	}// utilityService
})();