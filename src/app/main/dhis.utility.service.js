(function(){
	'use strict';

	angular.module('EMU').service('utilityService', utilityService);

	utilityService.$inject = ["configParam","_"];

	function utilityService(configParam,_){
		var obj = {};

		var filterDataByYear = filterDataByYear;
		var aggregateDataByIndicators = aggregateDataByIndicators;

		// public methods
		obj.processData = processData;

		return obj;

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

						if(arr[1] === selectedYear){ // check if year matches with current iterating data

							selectedIndicator = arr[0];


							populationCount = parseInt(arr[2]); // just assigning first population value
						
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
											if(arr_data[1] === yr && arr_data[0] === indicator){
												populationCount +=  parseInt(arr_data[2]);
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
			
			console.log(filteredData);
			
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

	}// utilityService
})();